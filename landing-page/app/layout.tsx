import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://axiomlancer.io"),
  title: "AxiomLancer | Gestão Financeira, Faturamento & Cobrança Autônoma",
  description:
    "Elimine o constrangimento de cobrar clientes. Faturamento automático com Asaas e Stripe, régua de cobrança preditiva e provisionamento de impostos para freelancers e microagências. Desenvolvido pela 7Keys.",
  keywords: [
    "gestão financeira freelancer",
    "cobrança autônoma",
    "faturamento Asaas Stripe",
    "previsão de receita dev PJ",
    "smart escrow tecnologia",
    "Previsio BI",
  ],
  authors: [{ name: "7Keys Engineering" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://axiomlancer.io",
    siteName: "AxiomLancer",
    title: "AxiomLancer | Gestão Financeira, Faturamento & Cobrança Autônoma",
    description:
      "A esteira autônoma que transforma entregas de código e design em dinheiro na conta, sem atritos de cobrança.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AxiomLancer — Plataforma de Gestão Financeira Autônoma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AxiomLancer | Gestão Financeira Autônoma",
    description: "Elimine o constrangimento de cobrar clientes com a esteira autônoma AxiomLancer.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "AxiomLancer",
      "operatingSystem": "Web Browser",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "49.90",
        "priceCurrency": "BRL",
        "priceValidUntil": "2027-12-31",
      },
      "description":
        "Plataforma de automação financeira, faturamento com Asaas e Stripe, Smart Escrows e conciliação bancária determinística.",
    },
    {
      "@type": "Organization",
      "name": "7Keys",
      "url": "https://axiomlancer.io",
      "logo": "https://axiomlancer.io/logo.png",
      "sameAs": ["https://github.com/HenriqueMC17"],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-dark-l0 text-[#FAFAFA] font-sans antialiased selection:bg-growth-emerald/30 selection:text-white">
        <SmoothScrollProvider />
        {children}
      </body>
    </html>
  );
}