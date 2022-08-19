import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  console.log(command, mode);
  if (command === "serve") {
    return {
      // dev 独有配置
      mode: mode,
      server: {
        port: 3000,
      },
    };
  } else {
    // command === 'build'
    return {
      // build 独有配置
      mode: "production",
      build: {
        lib: {
          entry: path.resolve(__dirname, "src/components/index.ts"),
          formats: ["es", "umd", "cjs"],
          name: "gantt",
          fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
          input: ["src/components/index.ts"],
          // 确保外部化处理那些你不想打包进库的依赖
          external: ["react", "react-dom", "react-is"],
          output: {
            // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "react-is": "ReactIs",
            },
          },
        },
      },
      plugins: [react()],
    };
  }
});
