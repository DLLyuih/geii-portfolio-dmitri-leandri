import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Alexandre Martin | Portfolio BUT GEII IUT de Bordeaux",
  description: "Portfolio académique et professionnel d'Alexandre Martin, étudiant en 2ème année de BUT GEII (Génie Électrique et Informatique Industrielle) à l'IUT de Bordeaux. Découvrez mes compétences en programmation, matériel électronique et projets industriels.",
  keywords: ["GEII", "Génie Électrique", "Informatique Industrielle", "IUT de Bordeaux", "STM32", "KiCad", "Automatisme", "Portfolio"],
  authors: [{ name: "Alexandre Martin" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}

