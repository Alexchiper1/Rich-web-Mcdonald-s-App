import Providers from "./providers";

export const metadata = {
  title: "McDonald's Ordering App",
  description: "Next.js + MUI full stack app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
