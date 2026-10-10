import fs from "node:fs/promises";

const files = (await fs.readdir("src/data/pages")).filter((file) =>
  file.endsWith(".json"),
);
const pages = {};
for (const file of files) {
  const page = JSON.parse(await fs.readFile(`src/data/pages/${file}`, "utf8"));
  pages[page.route] = {
    route: page.route,
    title: page.title,
    heading: page.heading,
    description: page.description,
    blocks: page.blocks.filter((block) => block.type !== "image"),
  };
}
await fs.mkdir("src/redesign", { recursive: true });
await fs.writeFile("src/redesign/content.json", JSON.stringify(pages));

const prototype = await fs.readFile(
  "public/design-directions/directions.js",
  "utf8",
);
const diagrams = ["signalDiagram", "nocturneDiagram", "currentDiagram"].map(
  (name) => {
    const match = prototype.match(
      new RegExp(`const ${name} = (\x60[\\s\\S]*?\x60);`),
    );
    if (!match) throw Error(`Missing ${name}`);
    return `export const ${name} = ${match[1]};`;
  },
);
await fs.writeFile("src/redesign/diagrams.ts", diagrams.join("\n"));

let css = await fs.readFile("public/design-directions/directions.css", "utf8");
// Keep the reviewed visual systems; the review portal remains a separate artifact.
css =
  css.slice(0, css.indexOf(".review-toolbar")) +
  css.slice(css.indexOf(".site {"));
await fs.writeFile("src/styles/main.css", css);
await fs.writeFile(
  "src/App.tsx",
  'export { default } from "./redesign/Site";\n',
);
await fs.writeFile(
  "src/main.tsx",
  `import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/main.css";
import "./redesign/site.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>,
);
`,
);
await fs.writeFile(
  "index.html",
  `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="theme-color" content="#F4F6F0" />
<title>EnerMAN Technologies | Monitor, Analyze and Notify</title>
<meta name="description" content="Solar SCADA, RMS and plant controllers built in Bengaluru. Cloud and local monitoring, control and forecasting across 3+ GW of solar in 10+ countries." />
<link rel="canonical" href="https://enerman.in/" />
<meta property="og:title" content="EnerMAN Technologies | Monitor, Analyze and Notify" />
<meta property="og:description" content="Connected solar intelligence for PV plants and rooftops." />
<meta property="og:url" content="https://enerman.in/" /><meta property="og:type" content="website" />
<link rel="stylesheet" href="/design-directions/fonts/fonts.css" />
</head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>
`,
);
console.log(
  `Prepared text-only content for ${Object.keys(pages).length} source pages and five visual systems.`,
);
