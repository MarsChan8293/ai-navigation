import "./globals.css";
import ThemeProvider from "@/components/providers/theme-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import { Toaster } from "@/ui/common/sonner";
import { Sidebar } from "@/components/sidebar/sidebar";
import { prisma } from "@/lib/db/db";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { Analytics as OtherAnalytics } from "@/components/analytics";
import { thumbnailUpdateJob } from "@/lib/tasks/cron";

if (process.env.NODE_ENV === "production") {
  thumbnailUpdateJob.start();
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      likes: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 预连接到关键域名 */}
        <link rel="preconnect" href="https://icon.horse" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS预解析 */}
        <link rel="dns-prefetch" href="https://icon.horse" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background overflow-hidden selection:bg-primary/10 selection:text-primary transition-colors duration-300"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <div className="flex h-screen w-full overflow-hidden">
              <Sidebar categories={categories} />
              <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative">
                <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                  {children}
                </div>
                <Toaster />
              </main>
            </div>
          </StoreProvider>
        </ThemeProvider>
        <VercelAnalytics />
        <OtherAnalytics googleAnalyticsId="G-9MNGY82H1J" />
      </body>
    </html>
  );
}
