"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy, ImportIcon as Convert } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { hexToRgb, rgbToHex, hexToHsl, hslToRgb } from "@/lib/color-utils"

export default function ColorConverter() {
  const [inputColor, setInputColor] = useState("#3498db")
  const [hexOutput, setHexOutput] = useState("")
  const [rgbOutput, setRgbOutput] = useState("")
  const [hslOutput, setHslOutput] = useState("")
  const { toast } = useToast()

  const convertColors = (color: string) => {
    let hex = ""
    let rgb: { r: number; g: number; b: number } | null = null
    let hsl: { h: number; s: number; l: number } | null = null

    // Try to parse as Hex
    if (color.startsWith("#") && (color.length === 7 || color.length === 4)) {
      hex = color
      rgb = hexToRgb(hex)
      hsl = hexToHsl(hex)
    }
    // Try to parse as RGB
    else if (color.startsWith("rgb(")) {
      const match = color.match(/rgb$$(\d+),\s*(\d+),\s*(\d+)$$/)
      if (match) {
        rgb = { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) }
        hex = rgbToHex(rgb.r, rgb.g, rgb.b)
        hsl = hexToHsl(hex)
      }
    }
    // Try to parse as HSL
    else if (color.startsWith("hsl(")) {
      const match = color.match(/hsl$$(\d+),\s*(\d+)%,\s*(\d+)%$$/)
      if (match) {
        hsl = { h: Number(match[1]), s: Number(match[2]), l: Number(match[3]) }
        rgb = hslToRgb(hsl.h, hsl.s, hsl.l)
        hex = rgbToHex(rgb.r, rgb.g, rgb.b)
      }
    }

    setHexOutput(hex ? hex.toUpperCase() : "Invalid Color")
    setRgbOutput(rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "Invalid Color")
    setHslOutput(hsl ? `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)` : "Invalid Color")
  }

  useEffect(() => {
    convertColors(inputColor)
  }, [inputColor])

  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Disalin!",
      description: `Kode ${format} ${text} telah disalin ke clipboard.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Convert className="h-5 w-5" />
          Konverter Warna
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="input-color" className="mb-2 block">
            Masukkan Warna (Hex, RGB, atau HSL)
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              id="input-color"
              type="text"
              value={inputColor}
              onChange={(e) => setInputColor(e.target.value)}
              className="flex-1"
              placeholder="#RRGGBB, rgb(R,G,B), atau hsl(H,S,L)"
            />
            <input
              type="color"
              value={inputColor.startsWith("#") ? inputColor : "#000000"} // Fallback for non-hex inputs
              onChange={(e) => setInputColor(e.target.value)}
              className="w-10 h-10 p-0 border-none cursor-pointer rounded-md overflow-hidden"
              title="Pilih warna"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="w-20 shrink-0">Hex:</Label>
            <Input value={hexOutput} readOnly className="flex-1 font-mono" />
            <Button variant="outline" size="icon" onClick={() => handleCopy(hexOutput, "Hex")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Label className="w-20 shrink-0">RGB:</Label>
            <Input value={rgbOutput} readOnly className="flex-1 font-mono" />
            <Button variant="outline" size="icon" onClick={() => handleCopy(rgbOutput, "RGB")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Label className="w-20 shrink-0">HSL:</Label>
            <Input value={hslOutput} readOnly className="flex-1 font-mono" />
            <Button variant="outline" size="icon" onClick={() => handleCopy(hslOutput, "HSL")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          className="w-full h-24 rounded-md border"
          style={{ backgroundColor: inputColor.startsWith("#") ? inputColor : hexOutput }}
        ></div>
      </CardContent>
    </Card>
  )
}
