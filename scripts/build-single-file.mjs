import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const htmlPath = path.join(distDir, "index.html");

const html = await readFile(htmlPath, "utf8");
const scriptMatch = html.match(/<script type="module" crossorigin src="(.+?)"><\/script>/);
const cssMatch = html.match(/<link rel="stylesheet" crossorigin href="(.+?)">/);

if (!scriptMatch) {
  throw new Error("Built HTML is missing the main script tag.");
}

const scriptPath = path.join(distDir, scriptMatch[1].replace(/^\//, "").replace(/\//g, path.sep));
const scriptContent = (await readFile(scriptPath, "utf8")).replace(/<\/script>/gi, "<\\/script>");

let singleFileHtml = html.replace(
  scriptMatch[0],
  `<script type="module">\n${scriptContent}\n</script>`,
);

if (cssMatch) {
  const cssPath = path.join(distDir, cssMatch[1].replace(/^\//, "").replace(/\//g, path.sep));
  const cssContent = (await readFile(cssPath, "utf8")).replace(/<\/style>/gi, "<\\/style>");

  singleFileHtml = singleFileHtml.replace(
    cssMatch[0],
    `<style>\n${cssContent}\n</style>`,
  );
}

await writeFile(path.join(distDir, "single-file.html"), singleFileHtml, "utf8");
