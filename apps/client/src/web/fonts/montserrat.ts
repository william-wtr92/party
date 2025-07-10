import { Montserrat } from "next/font/google"

export const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Tous les poids disponibles
  style: ["normal", "italic"], // Styles disponibles
  subsets: ["latin", "latin-ext"], // Sous-ensembles disponibles pour une couverture étendue
  display: "swap", // Optimisation pour le rendu des polices
  variable: "--font-montserrat",
})
