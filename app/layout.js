import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "3D Creator - Create and Showcase 3D Models",
  description:
    "Create, customize, and showcase 3D models with our easy-to-use platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-950`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <div className='flex min-h-screen flex-col'>
            <Header />
            <main className='flex-1 container mx-auto py-8 px-4'>
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
