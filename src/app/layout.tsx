import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { WaitingApproval } from "@/components/waiting-approval";
import { getAppContext } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeetCode Tracker",
  description: "Private LeetCode leaderboard and revision tracker"
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const context = await getAppContext();
  const blocked = context.profile && context.profile.status !== "approved";

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AppNav profile={context.profile} />
          <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
            {blocked ? <WaitingApproval profile={context.profile!} /> : children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
