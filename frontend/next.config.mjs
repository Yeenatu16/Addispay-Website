/** @type {import('next').NextConfig} */

// Uploaded media (news covers, CVs) is served by the Go API, so its origin must
// be allowlisted for next/image. Derive it from the same env var the API client
// uses, falling back to the local dev backend.
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
const apiOrigin = apiBaseUrl.replace(/\/api\/v1\/?$/, "");

const remotePatterns = [];
try {
  const { protocol, hostname, port } = new URL(apiOrigin);
  remotePatterns.push({
    protocol: protocol.replace(":", ""),
    hostname,
    port: port || undefined,
    pathname: "/uploads/**",
  });
} catch {
  // Ignore an unparseable URL; images from the API just won't load.
}

const isLocalApi = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(apiOrigin);

// Render Static Site: NEXT_OUTPUT=export → static HTML in /out
// Docker / Node Web Service: default standalone server
const isStaticExport = process.env.NEXT_OUTPUT === "export";

const nextConfig = {
  ...(isStaticExport ? { output: "export" } : { output: "standalone" }),
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns,
    // Static export cannot use the Next image optimizer.
    unoptimized: isStaticExport,
    // Next refuses to optimize images from private IPs to prevent SSRF. In local
    // development the API genuinely is on localhost, so the check is opted out of
    // there only — never when pointing at a deployed backend.
    dangerouslyAllowLocalIP: isLocalApi && process.env.NODE_ENV !== "production",
  },
  // Avoid trailing-slash surprises between Static Site and local preview.
  trailingSlash: isStaticExport,
};

export default nextConfig;
