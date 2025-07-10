import { Cormorant_Garamond } from "next/font/google"

export const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"], // Tous les poids disponibles
  style: ["normal", "italic"], // Styles disponibles
  subsets: ["latin", "latin-ext"], // Sous-ensembles disponibles pour une couverture étendue
  display: "swap", // Optimisation pour le rendu des polices
  variable: "--font-cormorantGaramond", // Nom de la variable CSS
})
