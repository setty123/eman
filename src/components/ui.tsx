import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Plus, Minus } from "lucide-react";
import gsap from "gsap";
import { metrics } from "../data/content";

export function Button({
  to,
  children,
  secondary = false,
  className = "",
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      !matchMedia("(pointer:fine) and (prefers-reduced-motion:no-preference)")
        .matches
    )
      return;
    const rect = e.currentTarget.getBoundingClientRect();
    gsap.to(ref.current, {
      x: (e.clientX - rect.left - rect.width / 2) * 0.07,
      y: (e.clientY - rect.top - rect.height / 2) * 0.1,
      duration: 0.25,
    });
  };
  return (
    <Link
      ref={ref}
      to={to}
      className={`${secondary ? "text-button" : "button"} ${className}`}
      onMouseMove={move}
      onMouseLeave={() => gsap.to(ref.current, { x: 0, y: 0, duration: 0.3 })}
    >
      {children}
      {secondary ? <ArrowUpRight size={18} /> : <ArrowRight size={18} />}
    </Link>
  );
}
export function Eyebrow({
  children,
  number,
}: {
  children: ReactNode;
  number?: string;
}) {
  return (
    <div className="eyebrow">
      {number ? <span>{number} /</span> : <span className="status-dot" />}
      {children}
    </div>
  );
}
export function SectionHeading({
  label,
  number,
  title,
  children,
  action,
}: {
  label: string;
  number?: string;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading" data-reveal>
      <div>
        <Eyebrow number={number}>{label}</Eyebrow>
        <h2>{title}</h2>
        {children && <p className="section-description">{children}</p>}
      </div>
      {action}
    </div>
  );
}
function Metric({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    let tween: gsap.core.Tween | undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const counter = { value: Math.max(0, value - 20) };
          tween = gsap.to(counter, {
            value,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: () => setDisplay(Math.round(counter.value)),
          });
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      tween?.kill();
    };
  }, [value]);
  return (
    <div className="metric" ref={ref}>
      <div className="metric-value" aria-label={`${value}${suffix}`}>
        <span aria-hidden="true">
          {display}
          <span>{suffix}</span>
        </span>
      </div>
      <span className="metric-label">{label}</span>
    </div>
  );
}
export function Metrics() {
  return (
    <div className="metrics">
      {metrics.map((m) => (
        <Metric key={m.label} {...m} />
      ))}
    </div>
  );
}
export function Accordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div
          className={`accordion-item ${open === i ? "is-open" : ""}`}
          key={item.question}
        >
          <h3>
            <button
              id={`faq-${i}`}
              aria-expanded={open === i}
              aria-controls={`answer-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="mono">0{i + 1}</span>
              <span>{item.question}</span>
              {open === i ? <Minus size={20} /> : <Plus size={20} />}
            </button>
          </h3>
          <div
            className="accordion-answer"
            id={`answer-${i}`}
            role="region"
            aria-labelledby={`faq-${i}`}
            hidden={open !== i}
          >
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export function PageReady() {
  useEffect(() => {
    document.dispatchEvent(new Event("page-ready"));
  }, []);
  return null;
}
