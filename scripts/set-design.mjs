import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";

const designs = {
  main2: {
    id: "signal",
    name: "Signal Grid",
    companyPage: true,
    headingFont: "Space Grotesk",
    bodyFont: "DM Sans",
    themeColor: "#F4F6F0",
    solutionsPath: "/solutions/",
    solutionsLabel: "Solutions",
  },
  main3: {
    id: "nocturne",
    name: "Nocturne",
    companyPage: true,
    headingFont: "Syne",
    bodyFont: "Plus Jakarta Sans",
    themeColor: "#0D1524",
    solutionsPath: "/platform/",
    solutionsLabel: "Platform",
  },
  main4: {
    id: "kiln",
    name: "Kiln Editorial",
    companyPage: false,
    headingFont: "DM Serif Display",
    bodyFont: "Outfit",
    themeColor: "#F7F0E4",
    solutionsPath: "/solutions/",
    solutionsLabel: "Solutions",
  },
  main5: {
    id: "cobalt",
    name: "Cobalt Index",
    companyPage: true,
    headingFont: "Bricolage Grotesque",
    bodyFont: "Inter",
    themeColor: "#F7F8FB",
    solutionsPath: "/solutions/",
    solutionsLabel: "Solutions",
  },
  main6: {
    id: "current",
    name: "Quiet Current",
    companyPage: false,
    headingFont: "Fraunces",
    bodyFont: "DM Sans",
    themeColor: "#F9F8F2",
    solutionsPath: "/solutions/",
    solutionsLabel: "Solutions",
  },
};
const branch = process.argv[2];
const selection = designs[branch];
if (!selection) throw Error("Choose main2, main3, main4, main5 or main6.");
const active = execFileSync("git", ["branch", "--show-current"], {
  encoding: "utf8",
}).trim();
if (active !== branch)
  throw Error(
    `Refusing to write ${branch}'s design while ${active} is checked out.`,
  );
const design = {
  ...selection,
  branch,
  routes: [
    "/",
    selection.solutionsPath,
    ...(selection.companyPage ? ["/company/"] : []),
    "/contact/",
    "/legal/",
  ],
};
await fs.writeFile(
  "src/redesign/design.json",
  JSON.stringify(design, null, 2) + "\n",
);
const html = await fs.readFile("index.html", "utf8");
await fs.writeFile(
  "index.html",
  html.replace(
    /(<meta name="theme-color" content=")[^"]+/,
    `$1${selection.themeColor}`,
  ),
);
const pages = JSON.parse(
  await fs.readFile("src/redesign/content.json", "utf8"),
);
const productRoutes = [
  "eti-sol",
  "eti-edge-local-scada",
  "eti-log",
  "eti-ppc-power-plant-controller",
  "eti-zes-zero-export-system",
  "eti-lms-load-management-system",
  "eti-cast-solar-generation-forecasting",
];
const redirects = {};
for (const route of Object.keys(pages)) {
  if (route === "/" || design.routes.includes(route)) continue;
  const slug = route.replace(/^\/+|\/+$/g, "");
  if (productRoutes.includes(slug))
    redirects[route] = `${selection.solutionsPath}#${slug}`;
  else if (route === "/products/") redirects[route] = selection.solutionsPath;
  else if (route === "/about-us/")
    redirects[route] = selection.companyPage ? "/company/" : "/#company";
  else if (route === "/terms-and-conditions/") redirects[route] = "/legal/";
  else if (route === "/inquiry-form/") redirects[route] = "/contact/#enquiry";
  else {
    const sections = {
      "/team/": "team",
      "/awards/": "awards",
      "/news-updates/": "news",
      "/resource/": "insights",
    };
    redirects[route] =
      `${selection.companyPage ? "/company/" : "/"}#${sections[route] || "article-" + slug}`;
  }
}
await fs.writeFile(
  "src/redesign/redirects.json",
  JSON.stringify(redirects, null, 2) + "\n",
);
await fs.writeFile(
  "public/_redirects",
  Object.entries(redirects)
    .map(([from, to]) => `${from} ${to} 301`)
    .join("\n") + "\n/* /index.html 200\n",
);
await fs.writeFile(
  "README.md",
  `# EnerMAN — ${selection.name}\n\nThis branch is **${branch}**: the ${selection.name} redesign. The original main branch is unchanged.\n\n## Run locally\n\nRequires Node.js 20.19+ or 22.12+.\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\nOpen the URL Vite prints. To preview a production build:\n\n\`\`\`bash\nnpm run build\nnpm run preview\n\`\`\`\n\n## This design\n\n- Typography: ${selection.headingFont} + ${selection.bodyFont}; locally hosted fonts with licenses.\n- ${design.routes.length - 1} main pages: ${design.routes.filter((r) => r !== "/legal/").join(", ")} plus a legal page.\n- No photographic images. Native SVG/CSS geometry and scroll effects.\n- Product specifications stay together on ${selection.solutionsPath}.\n- Company, leadership, team, awards, news and full articles are consolidated ${selection.companyPage ? "on /company/" : "within Home"}.\n- Legacy URLs redirect to the corresponding page and section.\n- Scroll effects respect reduced motion. Mobile navigation supports Escape.\n- The enquiry form prepares an email for review. Set VITE_CONTACT_ENDPOINT only when a real endpoint is ready.\n\n## Design branches\n\n| Branch | Design | Typography |\n| --- | --- | --- |\n${Object.entries(
    designs,
  )
    .map(([b, d]) => `| ${b} | ${d.name} | ${d.headingFont} + ${d.bodyFont} |`)
    .join(
      "\n",
    )}\n\n\`npm test\` checks navigation, responsive layouts, retained content, legacy redirects, product interactions, motion and enquiries. Run a local preview server first. No deployment is configured or performed by these scripts.\n`,
);
console.log(
  `${branch}: ${selection.name}, ${design.routes.length - 1} main pages, ${Object.keys(redirects).length} legacy redirects.`,
);
