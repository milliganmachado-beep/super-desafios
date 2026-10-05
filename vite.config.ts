import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

function ahsdEditorApi(): Plugin {
  const root = process.cwd();
  const storyPath = path.join(root, "src", "ahsd", "story.ts");
  const imagesPath = path.join(root, "public", "ahsd", "images");
  const allowedImage = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,119}\.(webp|png|jpe?g|svg)$/i;

  return {
    name: "ahsd-editor-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url ?? "/", "http://localhost");
        if (!url.pathname.startsWith("/__ahsd-editor/")) return next();

        const remote = request.socket.remoteAddress ?? "";
        if (!(remote === "::1" || remote === "127.0.0.1" || remote.startsWith("::ffff:127."))) {
          response.writeHead(403).end("Editor API is available only from this computer.");
          return;
        }

        response.setHeader("Cache-Control", "no-store");
        if (url.pathname === "/__ahsd-editor/images" && request.method === "GET") {
          try {
            const files = await fs.readdir(imagesPath);
            response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            response.end(JSON.stringify(files.filter((name) => allowedImage.test(name)).sort()));
          } catch (error) {
            server.config.logger.error(`Could not list AHSD images: ${String(error)}`);
            response.writeHead(500).end("Could not list images.");
          }
          return;
        }

        if (url.pathname === "/__ahsd-editor/story" && request.method === "PUT") {
          try {
            const chunks: Buffer[] = [];
            let size = 0;
            for await (const chunk of request) {
              const buffer = Buffer.from(chunk);
              size += buffer.length;
              if (size > 2_000_000) {
                response.writeHead(413).end("Story file is too large.");
                return;
              }
              chunks.push(buffer);
            }
            const source = Buffer.concat(chunks).toString("utf8");
            if (!source.includes("export const scenes") || !source.includes("export const endings")) {
              response.writeHead(400).end("Invalid story source.");
              return;
            }
            await fs.writeFile(storyPath, source, "utf8");
            response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            response.end(JSON.stringify({ saved: true }));
          } catch (error) {
            server.config.logger.error(`Could not save AHSD story: ${String(error)}`);
            response.writeHead(500).end("Could not save story.ts.");
          }
          return;
        }

        if (url.pathname === "/__ahsd-editor/image" && request.method === "PUT") {
          const name = url.searchParams.get("name") ?? "";
          if (!allowedImage.test(name)) {
            response.writeHead(400).end("Invalid image filename.");
            return;
          }
          try {
            const chunks: Buffer[] = [];
            let size = 0;
            for await (const chunk of request) {
              const buffer = Buffer.from(chunk);
              size += buffer.length;
              if (size > 20_000_000) {
                response.writeHead(413).end("Image is too large.");
                return;
              }
              chunks.push(buffer);
            }
            if (!size) {
              response.writeHead(400).end("Image file is empty.");
              return;
            }
            await fs.writeFile(path.join(imagesPath, name), Buffer.concat(chunks));
            response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            response.end(JSON.stringify({ saved: true, name }));
          } catch (error) {
            server.config.logger.error(`Could not save AHSD image: ${String(error)}`);
            response.writeHead(500).end("Could not save image.");
          }
          return;
        }

        response.writeHead(405, { Allow: "GET, PUT" }).end("Method not allowed.");
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), ahsdEditorApi()],
});
