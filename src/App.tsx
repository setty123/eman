import { lazy, Suspense, useEffect } from "react";
import type { ComponentType } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import routes from "./data/routes.json";
const Home = lazy(() => import("./pages/Home"));
const ContentPage = lazy(() => import("./pages/ContentPage"));
function Metadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const route = routes.find(
      (r) => r.route === (pathname.endsWith("/") ? pathname : pathname + "/"),
    );
    const title = route?.title || "Page not found | EnerMAN Technologies";
    const description =
      route?.description ||
      "EnerMAN Technologies: solar SCADA and remote monitoring systems.";
    document.title = title;
    const set = (selector: string, content: string) =>
      document.querySelector(selector)?.setAttribute("content", content);
    set('meta[name="description"]', description);
    set('meta[property="og:title"]', title);
    set('meta[property="og:description"]', description);
    set('meta[property="og:url"]', "https://enerman.in" + pathname);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", "https://enerman.in" + (route?.route || pathname));
  }, [pathname]);
  return null;
}
export default function App({
  initialPage,
  homePage,
}: {
  initialPage: ComponentType;
  homePage: boolean;
}) {
  const HomePage = homePage ? initialPage : Home;
  const InternalPage = homePage ? ContentPage : initialPage;
  return (
    <>
      <Metadata />
      <Suspense
        fallback={
          <div className="page-loading" data-page-loading role="status">
            Loading page…
          </div>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="*" element={<InternalPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
