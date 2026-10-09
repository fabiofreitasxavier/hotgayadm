import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteHeader } from "@/components/site-header";
import { AgeGate } from "@/components/age-gate";
import { MobileCtaBar, SiteFooter } from "@/components/telegram-cta";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HotGay — Comunidade privada" },
      { name: "theme-color", content: "#08060c" },
      { name: "rating", content: "adult" },
      {
        name: "description",
        content: "Prévias gratuitas e vídeos exclusivos para maiores de 18 anos. Conteúdo novo todos os dias.",
      },
    ],
    links: [
      { rel: "icon", type: "image/jpeg", href: "/logo.jpg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      // Thumbnails and previews come from the CDN; open the connection early.
      { rel: "preconnect", href: "https://hotgay.b-cdn.net" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,800&family=Barlow:wght@400;500;600&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen font-[family-name:var(--font-sans)] antialiased">
        <PreviewHostBridge />
        <AuthProvider>
          <SiteHeader />
          <Outlet />
          <SiteFooter />
          <MobileCtaBar />
          <AgeGate />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
