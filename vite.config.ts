import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    {
      name: "save-config",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/api/save-config" && req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => { body += chunk; });
            req.on("end", () => {
              try {
                const config = JSON.parse(body);
                const filePath = path.resolve(__dirname, "src/config.ts");
                const content = fs.readFileSync(filePath, "utf-8");
                const startMarker = "// ── CONFIGURAÇÃO PADRÃO (O QUE VEM NO SITE) ──";
                const startIndex = content.indexOf(startMarker);
                
                if (startIndex !== -1) {
                  const prefix = content.slice(0, startIndex + startMarker.length);
                  const newContent = `${prefix}\nexport const DEFAULT_CONFIG: BusinessConfig = ${JSON.stringify(config, null, 2)};\n`;
                  fs.writeFileSync(filePath, newContent);
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ success: true }));
                } else {
                  res.statusCode = 404;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ error: "Marker not found" }));
                }
              } catch (error: any) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: error.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
