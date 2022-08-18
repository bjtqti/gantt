import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";
import pkg from "./package.json";

export default defineConfig([
  /* 单独生成声明文件 */
  {
    input: "src/components/index.ts",
    plugins: [dts()],
    output: {
      format: "esm",
      file: pkg.typings,
    },
  },
]);
