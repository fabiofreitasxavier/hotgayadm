import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteHeader } from "@/components/site-header";
import { AgeGate } from "@/components/age-gate";
import { MobileCtaBar, SiteFooter } from "@/components/telegram-cta";
import { BRAND } from "@/lib/brand";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HotGay — Vídeos gays exclusivos e comunidade privada" },
      { name: "description", content: "Prévias gratuitas de vídeos gays exclusivos, atualizados todos os dias. Entre na comunidade privada no Telegram com mais de 800 vídeos por R$ 9,99." },
      { name: "keywords", content: "vídeos gays, vídeo gay, hot gay, gay porn, prévias gay, conteúdo adulto gay, comunidade Telegram, vídeos exclusivos" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "theme-color", content: "#08060c" },
      { name: "rating", content: "adult" },
      { name: "content-language", content: "pt-BR" },
      { httpEquiv: "content-language", content: "pt-BR" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", type: "image/jpeg", href: "/logo.jpg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      // Thumbnails and previews come from the CDN; open the connection early.
      { rel: "preconnect", href: "https://hotgay.b-cdn.net" },
      { rel: "alternate", hrefLang: "pt-BR", href: `${BRAND.siteUrl}/` },
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
