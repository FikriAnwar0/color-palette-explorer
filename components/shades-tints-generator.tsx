"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Palette, SunDim, MoonStar, Shuffle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import ColorCard from "@/components/color-card"
import { generateShades, generateTints } from "@/lib/color-utils"

export default function ShadesTintsGenerator() {
  const [baseColor, setBaseColor] = useState("#3498db")
  const [numShades, setNumShades] = useState<number[]>([3])
  const [numTints, setNumTints] = useState<number[]>([3])
  const [shades, setShades] = useState<string[]>([])
  const [tints, setTints] = useState<string[]>([])

  const generateVariations = () => {
    setShades(generateShades(baseColor, numShades[0]))
    setTints(generateTints(baseColor, numTints[0]))
  }

  const handleRandomColor = () => {
    const randomHex =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    setBaseColor(randomHex)
  }

  useEffect(() => {
    generateVariations()
  }, [baseColor, numShades, numTints])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Kontrol Shades & Tints
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="shades-tints-base-color" className="mb-2 block">
              Warna Dasar
            </Label>
            <div className="flex gap-2">
              <Input
                id="shades-tints-base-color"
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="flex-1"
                placeholder="#RRGGBB"
              />
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-10 h-10 p-0 border-none cursor-pointer rounded-md overflow-hidden"
                title="Pilih warna"
              />
              <Button variant="outline" size="icon" onClick={handleRandomColor} aria-label="Warna Acak">
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="num-shades-slider" className="mb-2 block">
              Jumlah Shades ({numShades[0]})
            </Label>
            <Slider
              id="num-shades-slider"
              min={1}
              max={5}
              step={1}
              value={numShades}
              onValueChange={setNumShades}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="num-tints-slider" className="mb-2 block">
              Jumlah Tints ({numTints[0]})
            </Label>
            <Slider
              id="num-tints-slider"
              min={1}
              max={5}
              step={1}
              value={numTints}
              onValueChange={setNumTints}
              className="w-full"
            />
          </div>

          <Button onClick={generateVariations} className="w-full">
            Hasilkan Shades & Tints
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Variasi Warna Anda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MoonStar className="h-5 w-5" />
              Shades (Lebih Gelap)
            </h3>
            {shades.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {shades.map((color, index) => (
                  <ColorCard key={`shade-${index}`} hex={color} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Hasilkan shades dari warna dasar.</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <SunDim className="h-5 w-5" />
              Tints (Lebih Terang)
            </h3>
            {tints.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {tints.map((color, index) => (
                  <ColorCard key={`tint-${index}`} hex={color} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Hasilkan tints dari warna dasar.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
