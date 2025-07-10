import { Quicksand } from "next/font/google"

export const quicksand = Quicksand({
  weight: ["300", "400", "500", "600", "700"], // Tous les poids disponibles
  style: ["normal"], // Styles disponibles
  subsets: ["latin", "latin-ext"], // Sous-ensembles disponibles pour une couverture étendue
  display: "swap", // Optimisation pour le rendu des polices
  variable: "--font-quicksand", // Nom de la variable CSS
})
