"use client"
import dynamic from "next/dynamic"

const PenicheMap = dynamic(() => import("./peniche-map"), { ssr: false })

export default function DirectionDiagram({
  windDir,
  swellDir,
  spotFacing,
  mapCenter,
  mapZoom,
}: {
  windDir: number
  swellDir: number
  spotFacing: number | null
  mapCenter: [number, number]
  mapZoom: number
}) {
  return <PenicheMap windDir={windDir} swellDir={swellDir} spotFacing={spotFacing} mapCenter={mapCenter} mapZoom={mapZoom} />
}
