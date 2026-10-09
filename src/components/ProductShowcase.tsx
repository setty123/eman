import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Cloud,
  Cpu,
  SlidersHorizontal,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, asset } from "../data/content";
import { SectionHeading } from "./ui";
export default function ProductShowcase() {
  const [selected, setSelected] = useState(0);
  const p = products[selected];
  const root = useRef<HTMLElement>(null);
  const group = useRef(-1);
  const manuallySelected = useRef(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width:1024px) and (prefers-reduced-motion:no-preference)",
      () => {
        const trigger = ScrollTrigger.create({
          trigger: root.current,
          start: "top 50%",
          end: "bottom 70%",
          onUpdate: (self) => {
            if (manuallySelected.current) return;
            const g = Math.min(2, Math.floor(self.progress * 3));
            if (group.current !== g) {
              group.current = g;
              setSelected([0, 3, 6][g]);
            }
          },
        });
        return () => trigger.kill();
      },
    );
    return () => mm.revert();
  }, []);
  const select = (index: number) => {
    manuallySelected.current = true;
    setSelected(index);
  };
  return (
    <section className="solutions-section section" id="solutions" ref={root}>
      <div className="container">
        <SectionHeading
          number="02"
          label="THE PRODUCT ECOSYSTEM"
          title={
            <>
              Every plant.
              <br />
              <span className="olive">One connected ecosystem.</span>
            </>
          }
          action={
            <Link to="/products/" className="text-button">
              Explore all solutions
              <ArrowUpRight size={18} />
            </Link>
          }
        >
          From data in the field to decisions on your screen. Seven products,
          built to work together.
        </SectionHeading>
        <div className="product-showcase">
          <div
            className="product-index"
            role="tablist"
            aria-label="Explore EnerMAN products"
            aria-orientation="vertical"
            onKeyDown={(e) => {
              const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
              if (!keys.includes(e.key)) return;
              e.preventDefault();
              const next =
                e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? 6
                    : (selected + (e.key === "ArrowDown" ? 1 : 6)) % 7;
              select(next);
              document.getElementById(`product-tab-${next}`)?.focus();
            }}
          >
            {["Monitor", "Control", "Forecast"].map((category) => (
              <div className="product-group" key={category}>
                <span className="mono group-label">
                  {category === "Monitor" ? (
                    <Cloud size={13} />
                  ) : category === "Control" ? (
                    <SlidersHorizontal size={13} />
                  ) : (
                    <Sun size={13} />
                  )}{" "}
                  {category}
                </span>
                {products.map(
                  (product, i) =>
                    product.category === category && (
                      <button
                        key={product.name}
                        id={`product-tab-${i}`}
                        role="tab"
                        aria-selected={selected === i}
                        aria-controls="product-preview"
                        tabIndex={selected === i ? 0 : -1}
                        onClick={() => select(i)}
                        className={selected === i ? "active" : ""}
                      >
                        <span>{product.name}</span>
                        <span className="index-label">{product.label}</span>
                        <ArrowUpRight size={19} />
                      </button>
                    ),
                )}
              </div>
            ))}
          </div>
          <div
            className="product-preview"
            id="product-preview"
            role="tabpanel"
            aria-labelledby={`product-tab-${selected}`}
            tabIndex={0}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={p.name}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -5 }}
                transition={{ duration: 0.18 }}
              >
                <div className="product-meta mono">
                  <span>
                    {p.category} / {p.label}
                  </span>
                  <span>0{selected + 1} — 07</span>
                </div>
                <div className={`product-visual product-${selected}`}>
                  <div className="visual-grid" aria-hidden="true" />
                  <img
                    src={asset(p.imageQuery) || asset("Inverter dashboard")}
                    alt={`${p.name}: ${p.label}, original EnerMAN product visual`}
                    loading="lazy"
                    width="900"
                    height="480"
                  />
                  {selected < 2 && (
                    <span className="preview-badge">
                      <span className="status-dot" />
                      Original application preview
                    </span>
                  )}
                  {selected === 2 && (
                    <span className="hardware-label mono">
                      <Cpu size={16} />
                      DESIGNED & BUILT IN-HOUSE
                    </span>
                  )}
                </div>
                <div className="product-info">
                  <div>
                    <span className="mono">{p.label}</span>
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                  </div>
                  <Link
                    to={p.route}
                    className="round-link"
                    aria-label={`Explore ${p.name}`}
                  >
                    <ArrowUpRight size={26} />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="product-next">
              <span className="mono">
                BUILT IN BENGALURU. DEPLOYED GLOBALLY.
              </span>
              <button
                onClick={() => select((selected + 1) % 7)}
                aria-label="Next product"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
