import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: ".", // project root
  plugins: [tailwindcss()],
  build: {
    // Performance optimizations
    target: "es2020", // Modern browsers support (better tree-shaking)
    minify: "esbuild", // Fast minification
    cssMinify: "lightningcss", // Faster CSS minification

    // Code splitting for better caching
    rollupOptions: {
      input: {
        // define all entry HTML files for multi-page setup
        ar: path.resolve(__dirname, "ar/index.html"),
        en: path.resolve(__dirname, "en/index.html"),
        "ar-about": path.resolve(__dirname, "ar/about-us/index.html"),
        "en-about": path.resolve(__dirname, "en/about-us/index.html"),
        "ar-services": path.resolve(__dirname, "ar/services/index.html"),
        "en-services": path.resolve(__dirname, "en/services/index.html"),
        "en-blog": path.resolve(__dirname, "en/blogs/index.html"),
        "ar-blog": path.resolve(__dirname, "ar/blogs/index.html"),
        "ar-blog-details": path.resolve(
          __dirname,
          "ar/blog-details/index.html"
        ),
        "en-blog-details": path.resolve(
          __dirname,
          "en/blog-details/index.html"
        ),
        "en-related-blogs": path.resolve(
          __dirname,
          "en/related-blogs/index.html"
        ),
        "ar-related-blogs": path.resolve(
          __dirname,
          "ar/related-blogs/index.html"
        ),
        "ar-sub-category": path.resolve(
          __dirname,
          "ar/sub-category/index.html"
        ),
        "en-sub-category": path.resolve(
          __dirname,
          "en/sub-category/index.html"
        ),
      },
      output: {
        // Better chunking strategy for caching
        manualChunks: (id) => {
          // Separate large vendor libraries for better caching
          if (id.includes("node_modules")) {
            if (id.includes("swiper")) {
              return "vendor-swiper";
            }
            // Group other small vendors together
            return "vendor-other";
          }
        },
        // Optimize chunk file names for better caching
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          // Organize assets by type for better caching
          const info = assetInfo.name?.split(".") ?? [];
          const ext = info[info.length - 1];

          if (
            /\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(assetInfo.name ?? "")
          ) {
            return "assets/images/[name]-[hash][extname]";
          }
          if (/\.(woff2?|ttf|otf|eot)$/i.test(assetInfo.name ?? "")) {
            return "assets/fonts/[name]-[hash][extname]";
          }
          if (/\.css$/i.test(assetInfo.name ?? "")) {
            return "assets/css/[name]-[hash][extname]";
          }

          return "assets/[name]-[hash][extname]";
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 500, // Stricter warning for better performance
    // Source maps disabled for smaller builds
    sourcemap: false,
    // Improve build performance
    reportCompressedSize: false,

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Improve asset inlining threshold
    assetsInlineLimit: 4096, // 4KB limit for base64 inlining
  },
  server: {
    open: "ar/index.html", // opens Arabic version by default when running `npm run dev`
    // Add headers for development server
    headers: {
      "Cache-Control": "no-cache",
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["swiper"],
    esbuildOptions: {
      target: "es2020",
    },
  },

  // Enable experimental features for better performance
  experimental: {
    renderBuiltUrl(filename) {
      // Add version hash to bust cache effectively
      return { relative: true };
    },
  },
});
