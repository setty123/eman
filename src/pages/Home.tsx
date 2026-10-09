import { usePageMotion } from "../hooks/useMotion";
import {
  Hero,
  Credibility,
  Benefits,
  DashboardShowcase,
  Industries,
  AwardsPreview,
  Insights,
} from "../components/HomeSections";
import { FinalCTA } from "../components/Layout";
import ProductShowcase from "../components/ProductShowcase";
import { Accordion, Eyebrow, Metrics } from "../components/ui";
import home from "../data/pages/home.json";
export default function Home() {
  const scope = usePageMotion("home");
  const faq = home.sections.find(
    (s) => s.heading === "Frequently asked questions",
  );
  const items =
    faq?.blocks
      .filter((b) => b.type === "h3")
      .map((b) => ({
        question: b.text || "",
        answer: faq.blocks[faq.blocks.indexOf(b) + 1]?.text || "",
      })) || [];
  return (
    <div ref={scope}>
      <Hero />
      <section className="impact-section" id="impact">
        <div className="container">
          <div className="impact-top" data-reveal>
            <Eyebrow number="01">OUR IMPACT, IN NUMBERS</Eyebrow>
            <span className="mono">GLOBAL REACH. ENGINEERED IN INDIA.</span>
          </div>
          <Metrics />
        </div>
      </section>
      <Credibility />
      <ProductShowcase />
      <Benefits />
      <DashboardShowcase />
      <Industries />
      <AwardsPreview />
      <Insights />
      <section className="section faq-section">
        <div className="container faq-grid">
          <div data-reveal>
            <Eyebrow number="08">A LITTLE MORE CLARITY</Eyebrow>
            <h2>
              Good questions.
              <br />
              <span className="olive">Clear answers.</span>
            </h2>
            <p>Frequently asked questions</p>
          </div>
          <Accordion items={items} />
        </div>
      </section>
      <FinalCTA />
    </div>
  );
}
