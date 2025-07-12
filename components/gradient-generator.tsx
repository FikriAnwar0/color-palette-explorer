"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy, Palette, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"

export default function GradientGenerator() {
  const [color1, setColor1] = useState("#FF0000")
  const [color2, setColor2] = useState("#0000FF")
  const [angle, setAngle] = useState<number[]>([90])
  const [gradientCss, setGradientCss] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const css = `linear-gradient(${angle[0]}deg, ${color1}, ${color2})`
    setGradientCss(css)
  }, [color1, color2, angle])

  const handleCopy = () => {
    navigator.clipboard.writeText(gradientCss)
    toast({
      title: "Disalin!",
      description: "Kode CSS gradien telah disalin ke clipboard.",
    })
  }

  const handleExportCss = () => {
    if (!gradientCss) {
      toast({
        title: "Tidak Ada Gradien",
        description: "Hasilkan gradien terlebih dahulu sebelum mengekspor.",
        variant: "destructive",
      })
      return
    }

    const exportContent = `background: ${gradientCss};`
    const filename = "gradient.css"
    const mimeType = "text/css"

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
      title: "Gradien Diekspor!",
      description: `Gradien telah diekspor sebagai ${filename}.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Pembuat Gradien
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="color1" className="mb-2 block">
              Warna 1
            </Label>
            <div className="flex gap-2">
              <Input
                id="color1"
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
            <Label htmlFor="color2" className="mb-2 block">
              Warna 2
            </Label>
            <div className="flex gap-2">
              <Input
                id="color2"
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
          <Label htmlFor="angle-slider" className="mb-2 block">
            Sudut Gradien ({angle[0]}°)
          </Label>
          <Slider
            id="angle-slider"
            min={0}
            max={360}
            step={1}
            value={angle}
            onValueChange={setAngle}
            className="w-full"
          />
        </div>

        <div
          className="w-full h-48 rounded-md border"
          style={{ background: gradientCss }}
          aria-label="Pratinjau Gradien"
        ></div>

        <div>
          <Label htmlFor="css-output" className="mb-2 block">
            Kode CSS
          </Label>
          <div className="flex gap-2">
            <Input id="css-output" value={gradientCss} readOnly className="flex-1 font-mono" />
            <Button variant="outline" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleExportCss} aria-label="Ekspor CSS Gradien">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
