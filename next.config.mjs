/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // No basePath for root deployment, or basePath: '/' which is the default.

//   webpack: (config, { isServer }) => {
//     config.experiments = {
//       ...config.experiments,
//       asyncWebAssembly: true, // Ensures WebAssembly is enabled
//     };

//     // If using Next.js 12+, `fs` fallback might not be needed for client-side.
//     // For older versions or specific server-side scenarios, it can be useful.
//     if (!isServer) {
//       config.resolve.fallback = {
//         ...config.resolve.fallback,
//         fs: false, // Prevents errors for 'fs' module in browser
//       };
//     }

//     // This rule is important for how web-ifc loads its WASM.
//     // It ensures .wasm files are treated as static assets that can be fetched.
//     // The 'file-loader' copies the WASM files from node_modules (if imported directly there)
//     // or from wherever they are referenced to the build output.
//     // Since we are manually copying to `public/`, this specific file-loader rule for .wasm
//     // might be redundant if web-ifc loads directly from public via fetch.
//     // However, some libraries might try to `import wasm from './file.wasm'`, which would need this.
//     // For web-ifc loading from `public/`, the `headers` config is more critical.
//     // Let's keep it general in case other WASM files are used.
//     config.module.rules.push({
//       test: /\.wasm$/,
//       type: "javascript/auto", // Important for ES6 module interoperability with WASM
//       loader: "file-loader", // Fallback loader if not handled as a URL by default
//       options: {
//         // For root deployment, publicPath for assets bundled by webpack.
//         // Assets in `public` are served directly from root.
//         publicPath: `/_next/static/wasm/`, // Where webpack-bundled WASM might go
//         outputPath: `static/wasm/`, // Where they are placed in the .next build
//         name: "[name].[hash].[ext]",
//       },
//     });

//     return config;
//   },

//   async headers() {
//     return [
//       {
//         // For root deployment, WASM files in public/ (e.g., public/web-ifc.wasm)
//         // will be accessible at /web-ifc.wasm.
//         // This source matches any .wasm file request.
//         source: "/:path*.wasm",
//         headers: [
//           {
//             key: "Content-Type",
//             value: "application/wasm", // Crucial for browsers to interpret WASM
//           },
//           // Optional: COOP/COEP headers for SharedArrayBuffer (used by web-ifc-mt.wasm)
//           // These are strict and can break other embeds if not configured correctly.
//           // Enable if you specifically use web-ifc-mt.wasm and face issues.
//           // { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
//           // { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
//         ],
//       },
//     ];
//   },
//   // reactStrictMode: true, // Recommended for development
// };

// export default nextConfig;
