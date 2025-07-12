"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy, Blend } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"
import { blendColors, hexToRgb, hexToHsl } from "@/lib/color-utils"

export default function ColorMixer() {
  const [color1, setColor1] = useState("#FF0000")
  const [color2, setColor2] = useState("#0000FF")
  const [blendRatio, setBlendRatio] = useState<number[]>([50]) // 0-100, percentage of color2
  const [blendedHex, setBlendedHex] = useState("")
  const [blendedRgb, setBlendedRgb] = useState("")
  const [blendedHsl, setBlendedHsl] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const blended = blendColors(color1, color2, blendRatio[0] / 100)
    setBlendedHex(blended.toUpperCase())

    const rgb = hexToRgb(blended)
    if (rgb) {
      setBlendedRgb(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
    } else {
      setBlendedRgb("Invalid Color")
    }

    const hsl = hexToHsl(blended)
    if (hsl) {
      setBlendedHsl(`hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`)
    } else {
      setBlendedHsl("Invalid Color")
    }
  }, [color1, color2, blendRatio])

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
          <Blend className="h-5 w-5" />
          Pencampur Warna
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mixer-color1" className="mb-2 block">
              Warna 1
            </Label>
            <div className="flex gap-2">
              <Input
                id="mixer-color1"
                type="text"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="flex-1"
                placeholder="#RRGGBB"
              />
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-10 h-10 p-0 border-none cursor-pointer rounded-md overflow-hidden"
                title="Pilih warna 1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="mixer-color2" className="mb-2 block">
              Warna 2
            </Label>
            <div className="flex gap-2">
              <Input
                id="mixer-color2"
                type="text"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="flex-1"
                placeholder="#RRGGBB"
              />
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-10 h-10 p-0 border-none cursor-pointer rounded-md overflow-hidden"
                title="Pilih warna 2"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="blend-ratio-slider" className="mb-2 block">
            Rasio Campuran (Warna 2: {blendRatio[0]}%)
          </Label>
          <Slider
            id="blend-ratio-slider"
            min={0}
            max={100}
            step={1}
            value={blendRatio}
            onValueChange={setBlendRatio}
            className="w-full"
          />
        </div>

        <div
          className="w-full h-24 rounded-md border flex items-center justify-center text-lg font-semibold"
          style={{ backgroundColor: blendedHex }}
        >
          <span className="text-white text-shadow-sm" style={{ textShadow: "0px 0px 4px rgba(0,0,0,0.5)" }}>
            Warna Campuran
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="w-20 shrink-0">Hex:</Label>
            <Input value={blendedHex} readOnly className="flex-1 font-mono" />
            <Button variant="outline" size="icon" onClick={() => handleCopy(blendedHex, "Hex")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Label className="w-20 shrink-0">RGB:</Label>
            <Input value={blendedRgb} readOnly className="flex-1 font-mono" />
            <Button variant="outline" size="icon" onClick={() => handleCopy(blendedRgb, "RGB")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Label className="w-20 shrink-0">HSL:</Label>
            <Input value={blendedHsl} readOnly className="flex-1 font-mono" />
            <Button variant="outline" size="icon" onClick={() => handleCopy(blendedHsl, "HSL")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
