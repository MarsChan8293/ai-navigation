import "./globals.css";
import ThemeProvider from "@/components/providers/theme-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import GlobalErrorToast from "@/components/providers/global-error-toast";
import { Toaster } from "@/ui/common/sonner";
import { Sidebar } from "@/components/sidebar/sidebar";
import { prisma } from "@/lib/db/db";

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
    },
    orderBy: {
      id: "asc",
    },
  });

  return (
    <html lang="zh-CN" suppressHydrationWarning>
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
            <GlobalErrorToast />
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
      </body>
    </html>
  );
}
