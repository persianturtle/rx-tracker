import path from "path";
import { spawn, spawnSync } from "child_process";
import chokidar from "chokidar";
import { fileURLToPath } from "url";

let referenceToProcess;

build();
startServer();

chokidar
  .watch(`${path.dirname(fileURLToPath(import.meta.url))}/../src`, {
    ignoreInitial: true,
  })
  .on("all", build);

function build() {
  spawnSync("node", ["scripts/build.mjs"], {
    stdio: "inherit",
    shell: true,
  });
}

function startServer() {
  referenceToProcess = spawn(
    "npx",
    [
      "http-server",
      "-c-1",
      "--proxy",
      "http://localhost:3000?",
      "--port",
      "3000",
      "dist",
    ],
    { stdio: "inherit", shell: true }
  );
}

function stopServer() {
  if (referenceToProcess) {
    referenceToProcess.kill("SIGTERM");
    referenceToProcess = null;
  }
}

process.on("SIGINT", () => {
  stopServer();
  process.exit();
});

process.on("SIGTERM", () => {
  stopServer();
  process.exit();
});
