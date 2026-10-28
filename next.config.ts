import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // White fabric bands at the default 75; the story layers use 90.
    qualities: [75, 90],
  },
  turbopack: {
    // A stray lockfile in the home folder otherwise confuses root detection.
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
