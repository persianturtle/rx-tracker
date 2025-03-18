import path from "path";
import { spawn, spawnSync } from "child_process";
import { fileURLToPath } from "url";
import chokidar from "chokidar";

build();
const serverProcess = startServer();

chokidar
  .watch(`${path.dirname(fileURLToPath(import.meta.url))}/../src`, {
    ignoreInitial: true,
  })
  .on("all", build);

function build() {
  spawnSync("npm", ["run", "build"], {
    stdio: "inherit",
    shell: true,
  });
}

function startServer() {
  return spawn(
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
  serverProcess.kill("SIGTERM");
}

process.on("SIGINT", () => {
  stopServer();
  process.exit();
});

process.on("SIGTERM", () => {
  stopServer();
  process.exit();
});
