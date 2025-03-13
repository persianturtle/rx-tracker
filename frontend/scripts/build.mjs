import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import process from "child_process";
import { fileURLToPath } from "url";

/**
 * Plugin to update index.html with the hashed bundle filename
 */
function htmlEsbuildPlugin({
  inputHtml = "src/index.html",
  outputHtml = "dist/index.html",
} = {}) {
  return {
    name: "html-esbuild-plugin",
    setup(build) {
      build.onEnd(async (result) => {
        const bundleFile = Object.keys(result.metafile.outputs).find((file) =>
          file.endsWith(".js")
        );
        const bundleFilename = path.basename(bundleFile);

        let htmlContent = fs
          .readFileSync(inputHtml, "utf-8")
          .replace("{{bundle}}", bundleFilename);

        fs.writeFileSync(outputHtml, htmlContent, "utf-8");

        console.log(`HTML file updated with bundle: ${bundleFilename}`);
      });
    },
  };
}

process.spawnSync(
  "rm",
  ["-rf", `${path.dirname(fileURLToPath(import.meta.url))}/../dist`],
  {
    stdio: "inherit",
    shell: true,
  }
);

await esbuild.build({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  outdir: "dist",
  minify: true,
  metafile: true,
  entryNames: "[name].[hash]",
  plugins: [htmlEsbuildPlugin()],
});
