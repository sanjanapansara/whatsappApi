import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "");

  console.log("VITE_API_URL:", env.VITE_API_URL);

  return {
    plugins: [react()],
    server: {
      port: 4100, // Change this to a different port number
      host: "0.0.0.0", // Optional: allows access from other devices on the network
      strictPort: true, // Ensures that Vite will not try to use another port if the specified one is occupied
    },
    // server: {
    //   proxy: {
    //     "/api": {
    //       target: env.VITE_API_URL,
    //       changeOrigin: true,
    //     },
    //   },
    // },
  };
});
