import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Resolve the `@/*` alias from tsconfig.json natively — no extra plugin.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Playwright owns e2e/; vitest owns everything else.
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      /**
       * Coverage measures the code this repo owns and maintains:
       * our components and our library code.
       *
       * Deliberately outside the scope:
       *  - src/components/ui/**  vendored shadcn source, maintained upstream
       *  - src/app/**            routes, layouts, and metadata files, whose
       *                          real contract (status codes, headers, tags,
       *                          landmarks) is asserted by the Playwright suite
       */
      include: [
        "src/components/brand/**/*.tsx",
        "src/components/layout/**/*.tsx",
        "src/components/sections/**/*.tsx",
        "src/components/prose.tsx",
        "src/lib/**/*.ts",
      ],
      exclude: ["src/**/*.{test,spec}.{ts,tsx}", "src/**/*.d.ts"],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
