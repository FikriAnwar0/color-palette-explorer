"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ColorCard from "@/components/color-card"
import { generatePalette } from "@/lib/color-utils"
import { Paintbrush, Shuffle, Save, Download } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { savePalette } from "@/lib/local-storage-utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type HarmonyType = "analogous" | "complementary" | "triadic" | "monochromatic" | "tetradic" | "square"

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#3498db")
  const [harmonyType, setHarmonyType] = useState<HarmonyType>("analogous")
  const [palette, setPalette] = useState<string[]>([])
  const [saturation, setSaturation] = useState<number[]>([70])
  const [lightness, setLightness] = useState<number[]>([50])
  const [numColors, setNumColors] = useState<number[]>([5])
  const { toast } = useToast()

  const generateNewPalette = () => {
    const generatedColors = generatePalette(baseColor, harmonyType, saturation[0], lightness[0], numColors[0])
    setPalette(generatedColors)
  }

  const handleRandomColor = () => {
    const randomHex =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    setBaseColor(randomHex)
  }

  const handleSavePalette = () => {
    if (palette.length > 0) {
      const paletteName = prompt("Masukkan nama untuk palet ini:")
      if (paletteName) {
        savePalette(paletteName, palette)
        toast({
          title: "Palet Disimpan!",
          description: `Palet "${paletteName}" telah disimpan.`,
        })
      }
    } else {
      toast({
        title: "Tidak Ada Palet",
        description: "Hasilkan palet terlebih dahulu sebelum menyimpan.",
        variant: "destructive",
      })
    }
  }

  const handleExportPalette = (format: "css" | "json") => {
    if (palette.length === 0) {
      toast({
        title: "Tidak Ada Palet",
        description: "Hasilkan palet terlebih dahulu sebelum mengekspor.",
        variant: "destructive",
      })
      return
    }

    let exportContent = ""
    let filename = ""
    let mimeType = ""

    if (format === "css") {
      exportContent = `:root {\n${palette
        .map((color, index) => `  --color-palette-${index + 1}: ${color.toLowerCase()};`)
        .join("\n")}\n}`
      filename = "color-palette.css"
      mimeType = "text/css"
    } else if (format === "json") {
      const paletteObject = palette.reduce(
        (acc, color, index) => {
          acc[`color${index + 1}`] = color.toUpperCase()
          return acc
        },
        {} as Record<string, string>,
      )
      exportContent = JSON.stringify(paletteObject, null, 2)
      filename = "color-palette.json"
      mimeType = "application/json"
    }

    const blob = new Blob([exportContent], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Palet Diekspor!",
      description: `Palet telah diekspor sebagai ${filename}.`,
    })
  }

  useEffect(() => {
    generateNewPalette()
  }, [baseColor, harmonyType, saturation, lightness, numColors])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5" />
            Kontrol Palet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="base-color" className="mb-2 block">
              Warna Dasar
            </Label>
            <div className="flex gap-2">
              <Input
                id="base-color"
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
            <Label htmlFor="harmony-type" className="mb-2 block">
              Jenis Harmoni
            </Label>
            <Select value={harmonyType} onValueChange={(value: HarmonyType) => setHarmonyType(value)}>
              <SelectTrigger id="harmony-type">
                <SelectValue placeholder="Pilih jenis harmoni" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analogous">Analog</SelectItem>
                <SelectItem value="complementary">Komplementer</SelectItem>
                <SelectItem value="triadic">Triadik</SelectItem>
                <SelectItem value="monochromatic">Monokromatik</SelectItem>
                <SelectItem value="tetradic">Tetradik</SelectItem>
                <SelectItem value="square">Persegi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="saturation-slider" className="mb-2 block">
              Saturasi ({saturation[0]}%)
            </Label>
            <Slider
              id="saturation-slider"
              min={0}
              max={100}
              step={1}
              value={saturation}
              onValueChange={setSaturation}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="lightness-slider" className="mb-2 block">
              Kecerahan ({lightness[0]}%)
            </Label>
            <Slider
              id="lightness-slider"
              min={0}
              max={100}
              step={1}
              value={lightness}
              onValueChange={setLightness}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="num-colors-slider" className="mb-2 block">
              Jumlah Warna ({numColors[0]})
            </Label>
            <Slider
              id="num-colors-slider"
              min={2}
              max={10}
              step={1}
              value={numColors}
              onValueChange={setNumColors}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={generateNewPalette} className="flex-1">
              Hasilkan Palet
            </Button>
            <Button variant="outline" size="icon" onClick={handleSavePalette} aria-label="Simpan Palet">
              <Save className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Ekspor Palet">
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExportPalette("css")}>Ekspor sebagai CSS</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportPalette("json")}>Ekspor sebagai JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Palet Warna Anda</CardTitle>
        </CardHeader>
        <CardContent>
          {palette.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {palette.map((color, index) => (
                <ColorCard key={index} hex={color} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Pilih warna dasar dan jenis harmoni untuk menghasilkan palet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
