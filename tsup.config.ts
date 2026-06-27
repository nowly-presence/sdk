import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts", "src/metadata.ts"],
  format: ["esm"],
  clean: true,
  dts: true,
  splitting: false,
  treeshake: true,
  minify: false,
  sourcemap: false,
  target: 'es2022',
  esbuildOptions(options) {
    options.alias = {
      "#": "./src",
    }
  },
})
