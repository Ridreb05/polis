import "./globals.css";
import { PolisProvider } from "@/context/PolisContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const siteUrl = "https://polis.vote";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Polis — On-chain governance, decided together",
    template: "%s · Polis",
  },
  description:
    "Polis is a decentralized governance platform for DAOs, councils and communities. Open elections, approve nominees, and let members cast verifiable on-chain votes.",
  keywords: [
    "DAO governance",
    "on-chain voting",
    "council elections",
    "web3",
    "decentralized governance",
    "AIA blockchain",
  ],
  authors: [{ name: "Polis" }],
  openGraph: {
    title: "Polis — On-chain governance, decided together",
    description:
      "Open elections, approve nominees, and let members cast verifiable on-chain votes.",
    url: siteUrl,
    siteName: "Polis",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Polis — On-chain governance, decided together",
    description:
      "Decentralized governance for DAOs, councils and communities.",
  },
};

export const viewport = {
  themeColor: "#0c0b16",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <PolisProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </PolisProvider>
      </body>
    </html>
  );
}
