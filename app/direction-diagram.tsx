"use client"
import dynamic from "next/dynamic"

const PenicheMap = dynamic(() => import("./peniche-map"), { ssr: false })

export default function DirectionDiagram({
  windDir,
  swellDir,
  spotFacing,
}: {
  windDir: number
  swellDir: number
  spotFacing: number | null
}) {
  return <PenicheMap windDir={windDir} swellDir={swellDir} spotFacing={spotFacing} />
}
