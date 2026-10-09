import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
gsap.registerPlugin(ScrollTrigger);
const positions = new Map<string, number>();

export function useSmoothScroll() {
  const instance = useRef<Lenis | null>(null);
  const lastScroll = useRef(window.scrollY);
  const location = useLocation();
  const navigation = useNavigationType();
  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    const lenis = new Lenis({
      duration: 0.85,
      lerp: 0.13,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -100 },
      autoRaf: false,
      autoResize: true,
      respectReducedMotion: true,
      stopInertiaOnNavigate: true,
    });
    instance.current = lenis;
    const remember = () => {
      lastScroll.current = window.scrollY;
    };
    const update = () => {
      remember();
      ScrollTrigger.update();
    };
    lenis.on("scroll", update);
    window.addEventListener("scroll", remember, { passive: true });
    window.addEventListener("popstate", remember);
    document.addEventListener("click", remember, true);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const refresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    document.addEventListener("page-ready", refresh);
    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", update);
      window.removeEventListener("scroll", remember);
      window.removeEventListener("popstate", remember);
      document.removeEventListener("click", remember, true);
      lenis.destroy();
      instance.current = null;
      window.removeEventListener("load", refresh);
      document.removeEventListener("page-ready", refresh);
      history.scrollRestoration = previous;
    };
  }, []);
  useLayoutEffect(() => {
    const savedPosition = positions.get(location.key);
    const target = navigation === "POP" ? (savedPosition ?? window.scrollY) : 0;
    let frame = 0;
    let complete = false;
    const restore = () => {
      if (complete || document.querySelector("[data-page-loading]")) return;
      complete = true;
      instance.current?.resize();
      ScrollTrigger.refresh();
      if (location.hash) {
        const el = document.getElementById(
          decodeURIComponent(location.hash.slice(1)),
        );
        if (el) {
          instance.current?.scrollTo(el, { immediate: true, offset: -100 });
          if (!instance.current) el.scrollIntoView();
        }
      } else if (
        navigation !== "POP" ||
        (savedPosition !== undefined && Math.abs(window.scrollY - target) > 1)
      ) {
        instance.current?.scrollTo(target, { immediate: true, force: true });
        window.scrollTo(0, target);
      }
      ScrollTrigger.update();
    };
    const ready = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(restore);
    };
    if (
      location.hash &&
      document.getElementById(decodeURIComponent(location.hash.slice(1)))
    )
      ready();
    document.addEventListener("page-ready", ready);
    return () => {
      // React can replace a tall page before layout cleanup, clamping scrollY.
      // Keep the position captured while the outgoing page was still mounted.
      positions.set(location.key, lastScroll.current);
      cancelAnimationFrame(frame);
      document.removeEventListener("page-ready", ready);
    };
  }, [location.key, location.hash, navigation]);
}

export function usePageMotion(dependency: unknown) {
  const scope = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!scope.current) return;
    document.dispatchEvent(new Event("page-ready"));
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.from("[data-hero-line]", {
          yPercent: 105,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "all",
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
          gsap.from(el, {
            y: 25,
            opacity: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
            clearProps: "all",
          }),
        );
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) =>
          gsap.fromTo(
            el,
            { yPercent: -3 },
            {
              yPercent: 3,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          ),
        );
      }, scope);
      return () => context.revert();
    });
    const refresh = () => ScrollTrigger.refresh();
    scope.current.addEventListener("load", refresh, true);
    const current = scope.current;
    const observer = new ResizeObserver(() => ScrollTrigger.refresh());
    observer.observe(current);
    return () => {
      current.removeEventListener("load", refresh, true);
      observer.disconnect();
      media.revert();
    };
  }, [dependency]);
  return scope;
}
