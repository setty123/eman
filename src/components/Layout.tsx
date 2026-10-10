import { Suspense, useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  ArrowUp,
  ExternalLink,
  Play,
  Monitor,
  SlidersHorizontal,
  ChartNoAxesCombined,
} from "lucide-react";
import {
  asset,
  products,
  social,
  phoneNumbers,
  mapUrl,
  appLinks,
} from "../data/content";
import { Button } from "./ui";
import { useSmoothScroll } from "../hooks/useMotion";

const nav = [
  ["Solutions", "/products/"],
  ["Company", "/about-us/"],
  ["Library", "/resource/"],
  ["News", "/news-updates/"],
  ["Contact", "/contact/"],
];
function Navbar() {
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const solutionsPanel = useRef<HTMLDivElement>(null);
  const solutionsButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
    setSolutionsOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (!solutionsOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!solutionsPanel.current?.contains(event.target as Node))
        setSolutionsOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [solutionsOpen]);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 20);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (e.key === "Tab") {
        const elements =
          panel.current?.querySelectorAll<HTMLAnchorElement>("a");
        const first = elements?.[0],
          last = elements?.[elements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          menuButton.current?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          menuButton.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);
  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <Link className="brand" to="/" aria-label="EnerMAN Technologies home">
          <img
            src={asset("eman-header-logo")}
            alt="EnerMAN Technologies"
            width="180"
            height="66"
          />
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {nav.map(([label, to], i) =>
            i === 0 ? (
              <div
                className={`nav-dropdown ${solutionsOpen ? "is-open" : ""}`}
                key={to}
                ref={solutionsPanel}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setSolutionsOpen(true);
                }}
                onPointerLeave={() => {
                  if (!solutionsPanel.current?.contains(document.activeElement))
                    setSolutionsOpen(false);
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    setSolutionsOpen(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    setSolutionsOpen(false);
                    solutionsButton.current?.focus();
                  }
                }}
              >
                <NavLink to={to} onFocus={() => setSolutionsOpen(true)}>
                  {label}
                </NavLink>
                <button
                  className="solutions-toggle"
                  aria-label="Show solutions menu"
                  aria-expanded={solutionsOpen}
                  aria-controls="solutions-menu"
                  ref={solutionsButton}
                  onClick={() => setSolutionsOpen(!solutionsOpen)}
                >
                  <ChevronDown size={13} />
                </button>
                <div className="mega-menu" id="solutions-menu">
                  <div className="mega-intro">
                    <span className="mono">THE ENERMAN ECOSYSTEM</span>
                    <h3>
                      From the field.
                      <br />
                      To one screen.
                    </h3>
                    <p>
                      Monitor. Control. Forecast.
                      <br />
                      Connected solar intelligence.
                    </p>
                    <Link to="/products/">
                      Explore all products <ArrowUpRight size={18} />
                    </Link>
                  </div>
                  <nav className="mega-products" aria-label="Product solutions">
                    {[
                      { name: "Monitor", icon: Monitor },
                      { name: "Control", icon: SlidersHorizontal },
                      { name: "Forecast", icon: ChartNoAxesCombined },
                    ].map(({ name, icon: Icon }) => (
                      <div className="mega-category" key={name}>
                        <h4 className="mega-category-title">
                          <Icon
                            size={17}
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                          {name}
                        </h4>
                        <ul>
                          {products
                            .filter((p) => p.category === name)
                            .map((p) => (
                              <li key={p.name}>
                                <NavLink
                                  className="mega-product-link"
                                  to={p.route}
                                >
                                  <span className="mega-product-copy">
                                    <strong>{p.name}</strong>
                                    <span>{p.label}</span>
                                  </span>
                                  <ArrowUpRight size={15} aria-hidden="true" />
                                </NavLink>
                              </li>
                            ))}
                        </ul>
                        {name === "Forecast" && (
                          <div className="mega-help">
                            <p>
                              Find the right solution
                              <br />
                              for your plant.
                            </p>
                            <Link to="/inquiry-form/">
                              Talk to our team <ArrowUpRight size={14} />
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
              </div>
            ) : (
              <NavLink key={to} to={to}>
                {label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="nav-actions">
          <Button to="/inquiry-form/" className="small">
            Let’s talk
          </Button>
          <button
            className="menu-button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
            ref={menuButton}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu" id="mobile-navigation" ref={panel}>
          <nav aria-label="Mobile navigation">
            {nav.map(([label, to], i) => (
              <NavLink key={to} to={to}>
                <span className="mono">0{i + 1}</span>
                {label}
                <ArrowUpRight />
              </NavLink>
            ))}
            <NavLink to="/awards/">
              Awards & recognition
              <ArrowUpRight />
            </NavLink>
            <NavLink to="/inquiry-form/">
              Request a demo
              <ArrowUpRight />
            </NavLink>
          </nav>
          <p>Built in India. For the global market.</p>
        </div>
      )}
    </header>
  );
}
export function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="container cta-inner">
        <div>
          <span className="eyebrow light">
            <span className="status-dot" />
            LET’S CONNECT
          </span>
          <h2>
            Bring your solar plants
            <br />
            to <span>one screen.</span>
          </h2>
          <p>
            For IPPs, EPCs, utilities, rooftop owners, agri-solar and O&M
            providers.
          </p>
        </div>
        <Link
          className="cta-circle"
          to="/inquiry-form/"
          aria-label="Request a demo"
        >
          <ArrowUpRight size={43} />
          <span>Request a demo</span>
        </Link>
        <div className="cta-orbit" aria-hidden="true" />
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" aria-label="EnerMAN home">
              <img
                src={asset("eman-header-logo")}
                alt="EnerMAN Technologies"
                width="180"
                height="66"
              />
            </Link>
            <p>
              IoT SCADA for solar PV plants.
              <br />
              Built in India for the global market.
            </p>
            <a
              href="https://www.eaglesunscada.com/#/login"
              target="_blank"
              rel="noreferrer"
            >
              ETi-SOL login <ArrowUpRight size={14} />
            </a>
            <div className="social-icons">
              <a
                href={social[0][1]}
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={19} />
              </a>
              <a
                href={social[1][1]}
                aria-label="YouTube"
                target="_blank"
                rel="noreferrer"
              >
                <Play size={20} />
              </a>
              {social.slice(2).map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noreferrer">
                  {name}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3>Solutions</h3>
            {products.map((p) => (
              <Link to={p.route} key={p.name}>
                {p.name}
                <span>{p.label}</span>
              </Link>
            ))}
          </div>
          <div>
            <h3>Explore</h3>
            {nav.slice(1).map(([n, u]) => (
              <Link to={u} key={u}>
                {n}
              </Link>
            ))}
            <Link to="/awards/">Awards</Link>
            <Link to="/team/">Life at EnerMAN</Link>
            <Link to="/inquiry-form/">Request a demo</Link>
            {appLinks.map(([n, u]) => (
              <a key={n} href={u} target="_blank" rel="noreferrer">
                {n}
                <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
          <div className="footer-contact">
            <h3>Find us</h3>
            <p>
              EnerMAN Technologies Pvt Ltd
              <br />
              No. 12 & 13, Daystar Center, 10th Cross,
              <br />
              Pampa Extension, Kempapura, Hebbal,
              <br />
              Bengaluru 560024, Karnataka, India
            </p>
            <a href={mapUrl} target="_blank" rel="noreferrer">
              Get directions <ArrowUpRight size={14} />
            </a>
            <a href="mailto:sales@enerman.in">sales@enerman.in</a>
            <a href="mailto:support@enerman.in">support@enerman.in</a>
            <a href="mailto:info@enerman.in">info@enerman.in</a>
            {phoneNumbers.map((n) => (
              <a href={`tel:${n.replaceAll(" ", "")}`} key={n}>
                {n}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} EnerMAN Technologies Pvt Ltd</span>
          <Link to="/terms-and-conditions/">Terms & privacy</Link>
          <a href="#top">
            Back to top <ArrowUp size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
export default function Layout() {
  useSmoothScroll();
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div id="top" />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="page-loading" data-page-loading role="status">
              Loading page…
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
