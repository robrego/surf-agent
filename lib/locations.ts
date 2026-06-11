import type { SpotProfile } from "./spots"

export interface Location {
  id: string
  name: string
  country: string
  lat: number
  lng: number
  mapCenter: [number, number]
  mapZoom: number
  spots: SpotProfile[]
}

export const LOCATIONS: Location[] = [
  {
    id: "peniche",
    name: "Peniche",
    country: "PT",
    lat: 39.36, lng: -9.38,
    mapCenter: [39.355, -9.383],
    mapZoom: 10,
    spots: [
      { name: "Supertubos", facing: 225, swellDirMin: 200, swellDirMax: 260, swellMin: 1.0, swellMax: 3.0, offshoreWindMin: 20, offshoreWindMax: 80, periodMin: 10, tide: "mid to high", notes: "World-class barrels. SW facing, N/NE wind offshore. Needs SW swell. Heavy." },
      { name: "Consolacao", facing: 225, swellDirMin: 200, swellDirMax: 290, swellMin: 0.8, swellMax: 3.5, offshoreWindMin: 10, offshoreWindMax: 70, periodMin: 9, tide: "low to mid", notes: "Reef break. SW facing, N/NE offshore. Good rights. Handles bigger swell." },
      { name: "Molhe Leste", facing: 250, swellDirMin: 220, swellDirMax: 280, swellMin: 0.6, swellMax: 1.8, offshoreWindMin: 30, offshoreWindMax: 90, periodMin: 7, tide: "low to mid", notes: "Pier break. ENE offshore. Peninsula shelter. Mainly lefts." },
      { name: "Lagide", facing: 315, swellDirMin: 280, swellDirMax: 350, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 90, offshoreWindMax: 180, periodMin: 8, tide: "low to mid", notes: "North side of peninsula. NW facing. SE/E wind offshore. Lefts. N/NE/NW wind is directly onshore — completely unrideable. Only recommend with SE or E wind." },
      { name: "Gamboa", facing: 345, swellDirMin: 310, swellDirMax: 360, swellMin: 0.5, swellMax: 1.8, offshoreWindMin: 160, offshoreWindMax: 230, periodMin: 7, tide: "mid to high", notes: "South bay near Peniche town. Mellow. S wind offshore." },
      { name: "Cerro", facing: 350, swellDirMin: 310, swellDirMax: 360, swellMin: 0.5, swellMax: 2.0, offshoreWindMin: 170, offshoreWindMax: 240, periodMin: 7, tide: "mid", notes: "Close to town. S/SSW offshore. N wind onshore." },
      { name: "Meio da Baia", facing: 340, swellDirMin: 300, swellDirMax: 350, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 160, offshoreWindMax: 240, periodMin: 8, tide: "mid", notes: "Centre of north bay. Can barrel. S offshore. Lefts and rights." },
      { name: "Cantinho da Baia", facing: 135, swellDirMin: 300, swellDirMax: 355, swellMin: 0.8, swellMax: 2.0, offshoreWindMin: 90, offshoreWindMax: 180, periodMin: 8, tide: "all tides", notes: "Corner of bay, sheltered from N/NW wind by the Peniche peninsula. Long rights in N or NW swell. Works when the rest of the bay is blown out by Nortada." },
      { name: "Baleal", facing: 340, swellDirMin: 300, swellDirMax: 360, swellMin: 0.6, swellMax: 2.5, offshoreWindMin: 120, offshoreWindMax: 180, periodMin: 7, tide: "all tides", notes: "Sheltered, consistent. SE offshore. Reef rights + south lefts." },
      { name: "Belgas", facing: 350, swellDirMin: 320, swellDirMax: 360, swellMin: 0.6, swellMax: 2.0, offshoreWindMin: 100, offshoreWindMax: 190, periodMin: 7, tide: "all tides", notes: "Strong long waves. E/S offshore. Watch cliff stone falls." },
      { name: "Praia del Rey", facing: 290, swellDirMin: 270, swellDirMax: 330, swellMin: 0.6, swellMax: 2.5, offshoreWindMin: 140, offshoreWindMax: 200, periodMin: 7, tide: "below mid", notes: "Multiple peaks. S/SE offshore. Not crowded." },
      { name: "Cortico", facing: 290, swellDirMin: 260, swellDirMax: 340, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 80, offshoreWindMax: 150, periodMin: 8, tide: "all tides", notes: "Long 11km exposed beach. Powerful. E/SE offshore. Rarely crowded." },
      { name: "Areia Branca", facing: 270, swellDirMin: 240, swellDirMax: 300, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 60, offshoreWindMax: 120, periodMin: 8, tide: "low falling", notes: "Exposed beach break. E offshore. Uncrowded." },
    ],
  },

  {
    id: "ericeira",
    name: "Ericeira",
    country: "PT",
    lat: 39.01, lng: -9.42,
    mapCenter: [39.01, -9.42],
    mapZoom: 12,
    spots: [
      { name: "Ribeira d'Ilhas", facing: 250, swellDirMin: 260, swellDirMax: 320, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 60, offshoreWindMax: 140, periodMin: 9, tide: "all tides", notes: "Classic right point. WST event spot. ENE/E offshore. N wind is cross-offshore for the right — works well. Long walls." },
      { name: "Coxos", facing: 275, swellDirMin: 260, swellDirMax: 310, swellMin: 1.2, swellMax: 3.5, offshoreWindMin: 70, offshoreWindMax: 130, periodMin: 11, tide: "mid to high", notes: "Heavy reef right. One of Europe's best. Needs real swell. Experts only." },
      { name: "Crazy Left", facing: 270, swellDirMin: 250, swellDirMax: 310, swellMin: 1.0, swellMax: 3.0, offshoreWindMin: 60, offshoreWindMax: 120, periodMin: 10, tide: "mid", notes: "Long left reef. Power and length. ENE offshore." },
      { name: "Pedra Branca", facing: 260, swellDirMin: 240, swellDirMax: 300, swellMin: 1.0, swellMax: 2.5, offshoreWindMin: 50, offshoreWindMax: 110, periodMin: 9, tide: "mid", notes: "Reef break. Consistent. Works on most W swells." },
      { name: "Foz do Lizandro", facing: 280, swellDirMin: 260, swellDirMax: 320, swellMin: 0.6, swellMax: 2.0, offshoreWindMin: 80, offshoreWindMax: 150, periodMin: 7, tide: "all tides", notes: "Beach break at river mouth. Good for beginners. E offshore." },
    ],
  },

  {
    id: "nazare",
    name: "Nazaré",
    country: "PT",
    lat: 39.60, lng: -9.07,
    mapCenter: [39.60, -9.07],
    mapZoom: 12,
    spots: [
      { name: "Praia do Norte", facing: 260, swellDirMin: 240, swellDirMax: 300, swellMin: 3.0, swellMax: 15.0, offshoreWindMin: 50, offshoreWindMax: 110, periodMin: 14, tide: "all tides", notes: "Big wave spot. World record waves. Canyon amplifies swell. Experts/tow-in only above 4m." },
      { name: "Praia de Nazaré", facing: 270, swellDirMin: 250, swellDirMax: 310, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 60, offshoreWindMax: 130, periodMin: 9, tide: "mid to high", notes: "Main beach. Multiple peaks. NE wind offshore. More manageable than Praia do Norte." },
      { name: "Praia do Salgado", facing: 275, swellDirMin: 260, swellDirMax: 310, swellMin: 0.8, swellMax: 2.0, offshoreWindMin: 70, offshoreWindMax: 140, periodMin: 8, tide: "all tides", notes: "South beach, more sheltered. Good when Norte is too big." },
    ],
  },

  {
    id: "sagres",
    name: "Sagres",
    country: "PT",
    lat: 37.01, lng: -8.94,
    mapCenter: [37.01, -8.94],
    mapZoom: 11,
    spots: [
      { name: "Tonel", facing: 220, swellDirMin: 190, swellDirMax: 260, swellMin: 1.0, swellMax: 3.0, offshoreWindMin: 290, offshoreWindMax: 50, periodMin: 10, tide: "all tides", notes: "SW-facing. Works on S/SW swell. NE/N offshore. Consistent, rarely crowded." },
      { name: "Beliche", facing: 260, swellDirMin: 240, swellDirMax: 300, swellMin: 1.0, swellMax: 2.5, offshoreWindMin: 350, offshoreWindMax: 70, periodMin: 10, tide: "mid to high", notes: "W-facing, sheltered from N/NW wind by cliffs to the north. ENE/E offshore. Quality peaks." },
      { name: "Mareta", facing: 185, swellDirMin: 160, swellDirMax: 220, swellMin: 0.8, swellMax: 2.0, offshoreWindMin: 270, offshoreWindMax: 30, periodMin: 8, tide: "all tides", notes: "S-facing inside the bay. Very sheltered. Needs big SW or direct S swell." },
      { name: "Cordoama", facing: 270, swellDirMin: 250, swellDirMax: 310, swellMin: 1.2, swellMax: 3.5, offshoreWindMin: 50, offshoreWindMax: 130, periodMin: 10, tide: "mid", notes: "Exposed W-facing beach. Powerful. NE offshore. Rarely crowded." },
    ],
  },

  {
    id: "mundaka",
    name: "Mundaka",
    country: "ES",
    lat: 43.41, lng: -2.70,
    mapCenter: [43.41, -2.70],
    mapZoom: 12,
    spots: [
      { name: "Mundaka", facing: 5, swellDirMin: 330, swellDirMax: 40, swellMin: 1.5, swellMax: 4.0, offshoreWindMin: 100, offshoreWindMax: 200, periodMin: 12, tide: "low to mid outgoing", notes: "One of Europe's best lefts. Sandbar at river mouth. S/SE offshore. Needs N swell + low tide." },
      { name: "Laida", facing: 350, swellDirMin: 310, swellDirMax: 40, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 110, offshoreWindMax: 200, periodMin: 9, tide: "all tides", notes: "Beach across estuary. Works when Mundaka is too big. Beginner friendly." },
      { name: "Bakio", facing: 355, swellDirMin: 320, swellDirMax: 40, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 120, offshoreWindMax: 210, periodMin: 8, tide: "all tides", notes: "Beach break 8km west. More consistent than Mundaka. S wind offshore." },
    ],
  },

  {
    id: "zarautz",
    name: "Zarautz",
    country: "ES",
    lat: 43.29, lng: -2.17,
    mapCenter: [43.29, -2.17],
    mapZoom: 12,
    spots: [
      { name: "Zarautz", facing: 0, swellDirMin: 320, swellDirMax: 50, swellMin: 0.8, swellMax: 3.0, offshoreWindMin: 120, offshoreWindMax: 220, periodMin: 9, tide: "all tides", notes: "Long beach. Consistent. S wind offshore. Multiple peaks. Good surf town vibe." },
      { name: "Orio", facing: 355, swellDirMin: 310, swellDirMax: 40, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 110, offshoreWindMax: 200, periodMin: 8, tide: "all tides", notes: "River mouth break east of Zarautz. Sandbar. S/SE offshore." },
      { name: "Zumaia", facing: 340, swellDirMin: 300, swellDirMax: 30, swellMin: 1.0, swellMax: 3.0, offshoreWindMin: 110, offshoreWindMax: 220, periodMin: 9, tide: "mid to high", notes: "Beach and reef. Flysch cliffs backdrop. Can be powerful. S offshore." },
      { name: "Getaria", facing: 350, swellDirMin: 310, swellDirMax: 40, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 120, offshoreWindMax: 200, periodMin: 8, tide: "all tides", notes: "Small fishing village. Right point on W side of cape. Sheltered on big days." },
    ],
  },

  {
    id: "somo",
    name: "Somo",
    country: "ES",
    lat: 43.46, lng: -3.61,
    mapCenter: [43.46, -3.61],
    mapZoom: 12,
    spots: [
      { name: "Somo", facing: 350, swellDirMin: 310, swellDirMax: 40, swellMin: 0.8, swellMax: 3.0, offshoreWindMin: 120, offshoreWindMax: 220, periodMin: 9, tide: "all tides", notes: "Long sandy beach across the bay from Santander. Very consistent. S wind offshore. All levels." },
      { name: "Loredo", facing: 340, swellDirMin: 300, swellDirMax: 30, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 130, offshoreWindMax: 220, periodMin: 8, tide: "all tides", notes: "Next beach east. Less crowded than Somo. Similar conditions." },
      { name: "Langre", facing: 345, swellDirMin: 310, swellDirMax: 40, swellMin: 1.0, swellMax: 3.0, offshoreWindMin: 130, offshoreWindMax: 210, periodMin: 9, tide: "mid to high", notes: "Cliffside beach. Harder to access, far fewer people. Powerful peaks." },
      { name: "Galizano", facing: 330, swellDirMin: 290, swellDirMax: 20, swellMin: 1.0, swellMax: 2.5, offshoreWindMin: 140, offshoreWindMax: 220, periodMin: 8, tide: "all tides", notes: "Small cove. Works best on solid NW swell with S offshore." },
    ],
  },

  {
    id: "elpalmar",
    name: "El Palmar",
    country: "ES",
    lat: 36.17, lng: -6.05,
    mapCenter: [36.17, -6.05],
    mapZoom: 12,
    spots: [
      { name: "El Palmar", facing: 235, swellDirMin: 200, swellDirMax: 270, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 30, offshoreWindMax: 100, periodMin: 9, tide: "all tides", notes: "Consistent Andalusian beach. E/NE offshore. Multiple peaks. Warm water. Busy in summer." },
      { name: "El Cabo", facing: 220, swellDirMin: 190, swellDirMax: 260, swellMin: 1.0, swellMax: 2.5, offshoreWindMin: 20, offshoreWindMax: 90, periodMin: 9, tide: "low to mid", notes: "Cape end of the beach. More punch than the middle. NE offshore." },
      { name: "Conil", facing: 225, swellDirMin: 200, swellDirMax: 265, swellMin: 0.8, swellMax: 2.0, offshoreWindMin: 30, offshoreWindMax: 100, periodMin: 8, tide: "all tides", notes: "Town beach north of El Palmar. Sheltered cove. Gentler. Good for beginners." },
      { name: "Zahara de los Atunes", facing: 260, swellDirMin: 220, swellDirMax: 300, swellMin: 1.0, swellMax: 3.0, offshoreWindMin: 20, offshoreWindMax: 80, periodMin: 9, tide: "mid to high", notes: "Long exposed WSW-facing beach south towards Tarifa. Very windy area. Levante (NE/E) is offshore — good. Poniente (W) is onshore — blown out." },
    ],
  },

  {
    id: "hossegor",
    name: "Hossegor",
    country: "FR",
    lat: 43.67, lng: -1.43,
    mapCenter: [43.67, -1.43],
    mapZoom: 11,
    spots: [
      { name: "La Gravière", facing: 270, swellDirMin: 255, swellDirMax: 300, swellMin: 1.0, swellMax: 3.0, offshoreWindMin: 60, offshoreWindMax: 130, periodMin: 11, tide: "low to mid", notes: "Elite shorebreak. WSL event spot. E offshore. One of France's best beach breaks. Very powerful." },
      { name: "Les Estagnots", facing: 270, swellDirMin: 255, swellDirMax: 305, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 60, offshoreWindMax: 130, periodMin: 10, tide: "all tides", notes: "Quality beach break just south. E/ENE offshore. Multiple peaks." },
      { name: "La Nord", facing: 268, swellDirMin: 250, swellDirMax: 300, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 60, offshoreWindMax: 130, periodMin: 9, tide: "mid to high", notes: "North end of the beach. Less crowded than La Grav." },
      { name: "Capbreton", facing: 275, swellDirMin: 260, swellDirMax: 310, swellMin: 0.6, swellMax: 2.0, offshoreWindMin: 70, offshoreWindMax: 140, periodMin: 8, tide: "all tides", notes: "More sheltered thanks to the canyon. E offshore. Works smaller days." },
      { name: "Seignosse Le Penon", facing: 268, swellDirMin: 250, swellDirMax: 300, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 60, offshoreWindMax: 130, periodMin: 9, tide: "all tides", notes: "North of Hossegor. Hollow beach peaks. Often less crowded." },
    ],
  },

  {
    id: "biarritz",
    name: "Biarritz",
    country: "FR",
    lat: 43.48, lng: -1.56,
    mapCenter: [43.48, -1.56],
    mapZoom: 12,
    spots: [
      { name: "Côte des Basques", facing: 255, swellDirMin: 235, swellDirMax: 290, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 50, offshoreWindMax: 110, periodMin: 9, tide: "low to mid", notes: "Iconic spot. Disappears at high tide. NE offshore. Long lefts and rights." },
      { name: "Grande Plage", facing: 275, swellDirMin: 255, swellDirMax: 310, swellMin: 0.6, swellMax: 2.0, offshoreWindMin: 70, offshoreWindMax: 140, periodMin: 8, tide: "all tides", notes: "Town beach. More forgiving, busy. E offshore. Good for all levels." },
      { name: "Anglet Les Cavaliers", facing: 270, swellDirMin: 250, swellDirMax: 305, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 60, offshoreWindMax: 130, periodMin: 9, tide: "all tides", notes: "Long beach north of Biarritz. Multiple peaks. E offshore. Less crowded than town." },
      { name: "Lafitenia", facing: 260, swellDirMin: 240, swellDirMax: 295, swellMin: 1.0, swellMax: 2.5, offshoreWindMin: 50, offshoreWindMax: 120, periodMin: 10, tide: "all tides", notes: "Point break south of town. Long right walls. Longboard paradise. ENE offshore." },
    ],
  },

  {
    id: "lacanau",
    name: "Lacanau",
    country: "FR",
    lat: 45.00, lng: -1.20,
    mapCenter: [45.00, -1.20],
    mapZoom: 12,
    spots: [
      { name: "Lacanau Ocean", facing: 272, swellDirMin: 255, swellDirMax: 305, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 60, offshoreWindMax: 130, periodMin: 9, tide: "all tides", notes: "Classic French beach break. E offshore. Pro contest site. Multiple peaks." },
      { name: "Les Grands Crohots", facing: 270, swellDirMin: 255, swellDirMax: 300, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 60, offshoreWindMax: 130, periodMin: 9, tide: "all tides", notes: "South of Lacanau. Sandbanks shift. Less crowded. E offshore." },
      { name: "Le Porge", facing: 272, swellDirMin: 255, swellDirMax: 300, swellMin: 0.8, swellMax: 2.0, offshoreWindMin: 60, offshoreWindMax: 130, periodMin: 8, tide: "all tides", notes: "Exposed beach, no facilities. Long drive but worth it for solitude." },
      { name: "Le Gurp", facing: 275, swellDirMin: 255, swellDirMax: 305, swellMin: 0.8, swellMax: 2.5, offshoreWindMin: 60, offshoreWindMax: 130, periodMin: 8, tide: "all tides", notes: "Northernmost Médoc beach. Very exposed. Almost never crowded." },
    ],
  },

  {
    id: "guethary",
    name: "Guéthary",
    country: "FR",
    lat: 43.44, lng: -1.61,
    mapCenter: [43.44, -1.61],
    mapZoom: 13,
    spots: [
      { name: "Parlementia", facing: 255, swellDirMin: 235, swellDirMax: 285, swellMin: 1.5, swellMax: 5.0, offshoreWindMin: 50, offshoreWindMax: 110, periodMin: 12, tide: "mid to high", notes: "World-class reef. Long powerful rights. Needs real swell. NE offshore. Not for beginners." },
      { name: "Cenitz", facing: 250, swellDirMin: 230, swellDirMax: 280, swellMin: 1.0, swellMax: 3.0, offshoreWindMin: 50, offshoreWindMax: 120, periodMin: 10, tide: "all tides", notes: "Rocky point between Guéthary and St-Jean. Quality right walls. Less crowded than Biarritz." },
      { name: "Avalanche", facing: 260, swellDirMin: 240, swellDirMax: 290, swellMin: 2.0, swellMax: 6.0, offshoreWindMin: 50, offshoreWindMax: 110, periodMin: 14, tide: "mid", notes: "Big wave spot next to Parlementia. Only breaks on XXL swells. Heavy." },
      { name: "Haitza", facing: 258, swellDirMin: 238, swellDirMax: 285, swellMin: 1.0, swellMax: 3.0, offshoreWindMin: 50, offshoreWindMax: 120, periodMin: 10, tide: "low to mid", notes: "Reef break below the village. Short but punchy lefts. ENE offshore." },
    ],
  },
]

export const DEFAULT_LOCATION_ID = "peniche"

export function getLocation(id: string | undefined): Location {
  return LOCATIONS.find(l => l.id === id) ?? LOCATIONS.find(l => l.id === DEFAULT_LOCATION_ID)!
}
