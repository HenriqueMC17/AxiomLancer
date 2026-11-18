import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AxiomLancer - Motor Financeiro Autônomo (7Keys)",
  description:
    "Plataforma SaaS de gestão financeira, faturamento autônomo e cobrança preditiva para freelancers e microagências. Desenvolvido por 7Keys.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
        <Toaster position="top-right" richColors theme="dark" />
      </body>
    </html>
  );
}
