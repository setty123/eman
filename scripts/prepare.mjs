import fs from "node:fs/promises";
const pages = JSON.parse(await fs.readFile("src/data/original.json", "utf8"));
await fs.mkdir("src/data/pages", { recursive: true });
for (const page of pages)
  await fs.writeFile(
    "src/data/pages/" + (page.route.replaceAll("/", "") || "home") + ".json",
    JSON.stringify(page),
  );
await fs.writeFile(
  "src/data/routes.json",
  JSON.stringify(
    pages.map(({ route, title, description, heading }) => ({
      route,
      title,
      description,
      heading,
    })),
  ),
);
const library = pages.find((p) => p.route === "/resource/");
const articles = [];
for (const [i, b] of library.blocks.entries())
  if (b.type === "h3" && b.links?.length) {
    const route = new URL(b.links[0].href).pathname;
    const page = pages.find((p) => p.route === route);
    if (
      !page ||
      (route.startsWith("/eti-") &&
        !route.includes("dashboard") &&
        !route.includes("dongle") &&
        !route.includes("plant-data"))
    )
      continue;
    articles.push({
      route,
      title: b.text,
      category: library.blocks[i - 2]?.text || "Case Study",
      date: library.blocks[i - 1]?.text || "",
      description: library.blocks[i + 1]?.text || "",
      image: page.blocks.find((x) => x.type === "image"),
    });
  }
await fs.writeFile("src/data/articles.json", JSON.stringify(articles));
const awards = pages.find((p) => p.route === "/awards/");
const awardList = [];
for (const [i, b] of awards.blocks.entries())
  if (b.type === "image") {
    const next = awards.blocks.slice(i + 1, i + 5);
    awardList.push({
      image: b,
      year: next.find((x) => /^20\d\d$/.test(x.text || ""))?.text,
      title: next.find((x) => x.type === "h3")?.text,
      organization: next.filter(
        (x) => x.type === "p" && !/^20\d\d$/.test(x.text || ""),
      )[0]?.text,
    });
  }
await fs.writeFile("src/data/awards.json", JSON.stringify(awardList));
console.log("Prepared", pages.length, "independent page data files.");
