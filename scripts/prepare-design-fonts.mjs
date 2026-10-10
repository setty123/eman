import fs from "node:fs/promises";

const families = [
  "Space+Grotesk:wght@400;500;600;700",
  "DM+Sans:wght@400;500;600;700",
  "Syne:wght@400;500;600;700",
  "Plus+Jakarta+Sans:wght@400;500;600;700",
  "DM+Serif+Display",
  "Outfit:wght@400;500;600;700",
  "Bricolage+Grotesque:wght@400;500;600;700",
  "Inter:wght@400;500;600;700",
  "Fraunces:wght@400;500;600;700",
];
const directory = "public/design-directions/fonts";
await fs.mkdir(directory, { recursive: true });
const response = await fetch(
  `https://fonts.googleapis.com/css2?family=${families.join("&family=")}&display=swap`,
  {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    },
  },
);
if (!response.ok) throw new Error(`Font stylesheet: ${response.status}`);
const providerCSS = await response.text();
const faces = [
  ...providerCSS.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g),
].map((match) => match[1]);
if (!faces.length)
  throw new Error(
    `No Latin font faces returned: ${providerCSS.slice(0, 1000)}`,
  );
const downloads = new Map();
const localFaces = [];
for (const face of faces) {
  const family = face.match(/font-family:\s*'([^']+)'/)[1];
  const url = face.match(/url\(([^)]+)\)/)[1];
  let file = downloads.get(url);
  if (!file) {
    const slug = family.toLowerCase().replaceAll(" ", "-");
    file = `${slug}-${[...downloads.values()].filter((name) => name.startsWith(slug)).length + 1}.woff2`;
    const font = await fetch(url);
    if (!font.ok) throw new Error(`${family}: ${font.status}`);
    await fs.writeFile(
      `${directory}/${file}`,
      Buffer.from(await font.arrayBuffer()),
    );
    downloads.set(url, file);
  }
  localFaces.push(face.replace(url, `./${file}`));
}
await fs.writeFile(`${directory}/fonts.css`, localFaces.join("\n\n") + "\n");
for (const family of families) {
  const slug = family.split(":")[0].replaceAll("+", "").toLowerCase();
  const license = await fetch(
    `https://raw.githubusercontent.com/google/fonts/main/ofl/${slug}/OFL.txt`,
  );
  if (!license.ok) throw new Error(`${slug} font license: ${license.status}`);
  await fs.writeFile(`${directory}/${slug}-OFL.txt`, await license.text());
}
console.log(
  `Prepared ${downloads.size} local font files for nine type families.`,
);
