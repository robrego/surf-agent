export interface SpotProfile {
  name: string
  facing: number
  swellDirMin: number
  swellDirMax: number
  swellMin: number
  swellMax: number
  offshoreWindMin: number
  offshoreWindMax: number
  periodMin: number
  tide: string
  notes: string
}

export const SPOTS: SpotProfile[] = [
  {
    name: "Supertubos", facing: 225,
    swellDirMin: 200, swellDirMax: 260, swellMin: 1.0, swellMax: 3.0,
    offshoreWindMin: 20, offshoreWindMax: 80, periodMin: 10,
    tide: "mid to high",
    notes: "World-class barrels. SW facing so N/NE wind is offshore. Needs SW swell. Heavy, can be crowded."
  },
  {
    name: "Consolacao", facing: 225,
    swellDirMin: 200, swellDirMax: 260, swellMin: 0.8, swellMax: 3.5,
    offshoreWindMin: 10, offshoreWindMax: 70, periodMin: 9,
    tide: "low to mid",
    notes: "Reef break. SW facing, N/NE wind offshore. Good rights. Handles bigger swell. Urchins and rocks."
  },

  {
    name: "Porto Batel", facing: 245,
    swellDirMin: 220, swellDirMax: 330, swellMin: 1.0, swellMax: 3.0,
    offshoreWindMin: 20, offshoreWindMax: 80, periodMin: 9,
    tide: "mid to high",
    notes: "Reef/point break south of Consolacao. NE offshore, sheltered from N wind. Rights. Powerful. Rocks and urchins. Needs bigger swell."
  },

  {
    name: "Molhe Leste", facing: 250,
    swellDirMin: 220, swellDirMax: 280, swellMin: 0.6, swellMax: 1.8,
    offshoreWindMin: 30, offshoreWindMax: 90, periodMin: 7,
    tide: "low to mid",
    notes: "Pier/point break. ENE offshore. Some peninsula shelter. Locals spot, be respectful. Mainly lefts."
  },
  {
    name: "Lagide", facing: 315,
    swellDirMin: 280, swellDirMax: 350, swellMin: 0.8, swellMax: 2.5,
    offshoreWindMin: 90, offshoreWindMax: 180, periodMin: 8,
    tide: "low to mid",
    notes: "North side of peninsula. NW facing. SE wind offshore. Picks up NW swell well. Lefts mainly."
  },
  {
    name: "Gamboa", facing: 345,
    swellDirMin: 310, swellDirMax: 360, swellMin: 0.5, swellMax: 1.8,
    offshoreWindMin: 160, offshoreWindMax: 230, periodMin: 7,
    tide: "mid to high",
    notes: "South end of bay near Peniche town. Mellow. Watch random rocks. S wind offshore."
  },
  {
    name: "Cerro", facing: 350,
    swellDirMin: 310, swellDirMax: 360, swellMin: 0.5, swellMax: 2.0,
    offshoreWindMin: 170, offshoreWindMax: 240, periodMin: 7,
    tide: "mid",
    notes: "Close to Peniche town. Gentle waves. S/SSW wind offshore. N wind onshore. Rocks near west cliffs."
  },
  {
    name: "Meio da Baia", facing: 340,
    swellDirMin: 300, swellDirMax: 350, swellMin: 0.8, swellMax: 2.5,
    offshoreWindMin: 160, offshoreWindMax: 240, periodMin: 8,
    tide: "mid",
    notes: "Centre of north bay. Picks up most swell. Can barrel. S wind offshore. Multiple peaks, lefts and rights."
  },
  {
    name: "Cantinho da Baia", facing: 350,
    swellDirMin: 300, swellDirMax: 355, swellMin: 0.8, swellMax: 2.0,
    offshoreWindMin: 90, offshoreWindMax: 180, periodMin: 8,
    tide: "all tides",
    notes: "Corner of the bay. Comes alive in big N or medium NW swell. Long rights possible. NE-SE wind clean."
  },
  {
    name: "Baleal", facing: 340,
    swellDirMin: 300, swellDirMax: 360, swellMin: 0.6, swellMax: 2.5,
    offshoreWindMin: 120, offshoreWindMax: 180, periodMin: 7,
    tide: "all tides",
    notes: "Sheltered, very consistent. SE wind offshore. Reef side has rights, south side has lefts."
  },
  {
    name: "Belgas", facing: 350,
    swellDirMin: 320, swellDirMax: 360, swellMin: 0.6, swellMax: 2.0,
    offshoreWindMin: 100, offshoreWindMax: 190, periodMin: 7,
    tide: "all tides",
    notes: "Strong long waves, sometimes tubular. Big beach. E/S wind offshore. Watch cliff stone falls."
  },
  {
    name: "Praia del Rey", facing: 290,
    swellDirMin: 270, swellDirMax: 330, swellMin: 0.6, swellMax: 2.5,
    offshoreWindMin: 140, offshoreWindMax: 200, periodMin: 7,
    tide: "below mid",
    notes: "Multiple peaks, lefts and rights. S/SE wind offshore. Not crowded. Beautiful scenery."
  },
  {
    name: "Cortico", facing: 290,
    swellDirMin: 260, swellDirMax: 340, swellMin: 0.8, swellMax: 2.5,
    offshoreWindMin: 80, offshoreWindMax: 150, periodMin: 8,
    tide: "all tides",
    notes: "Long 11km exposed beach. Powerful. E/SE wind offshore. Rarely crowded."
  },
  {
    name: "Areia Branca", facing: 270,
    swellDirMin: 240, swellDirMax: 300, swellMin: 0.8, swellMax: 2.5,
    offshoreWindMin: 60, offshoreWindMax: 120, periodMin: 8,
    tide: "low falling",
    notes: "Exposed river break. E wind offshore. Peninsula shadows N swell. Uncrowded. Lefts and rights."
  }
]