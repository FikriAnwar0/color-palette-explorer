"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getContrastRatio, getWCAGCompliance, hexToRgb } from "@/lib/color-utils"
import { CheckCircle, XCircle, Accessibility } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AccessibilityChecker() {
  const [foregroundColor, setForegroundColor] = useState("#FFFFFF")
  const [backgroundColor, setBackgroundColor] = useState("#000000")
  const [contrastRatio, setContrastRatio] = useState(0)
  const [wcagCompliance, setWcagCompliance] = useState({ AA: false, AAA: false })

  useEffect(() => {
    const fgRgb = hexToRgb(foregroundColor)
    const bgRgb = hexToRgb(backgroundColor)

    if (fgRgb && bgRgb) {
      const ratio = getContrastRatio(fgRgb, bgRgb)
      setContrastRatio(ratio)
      setWcagCompliance(getWCAGCompliance(ratio))
    } else {
      setContrastRatio(0)
      setWcagCompliance({ AA: false, AAA: false })
    }
  }, [foregroundColor, backgroundColor])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          Pemeriksa Aksesibilitas Kontras
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="foreground-color" className="mb-2 block">
              Warna Teks (Foreground)
            </Label>
            <div className="flex gap-2">
              <Input
                id="foreground-color"
                type="text"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className="flex-1"
                placeholder="#RRGGBB"
              />
              <input
                type="color"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className="w-10 h-10 p-0 border-none cursor-pointer rounded-md overflow-hidden"
                title="Pilih warna teks"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="background-color" className="mb-2 block">
              Warna Latar Belakang (Background)
            </Label>
            <div className="flex gap-2">
              <Input
                id="background-color"
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1"
                placeholder="#RRGGBB"
              />
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-10 h-10 p-0 border-none cursor-pointer rounded-md overflow-hidden"
                title="Pilih warna latar belakang"
              />
            </div>
          </div>
        </div>

        <div
          className="w-full p-8 rounded-md border flex items-center justify-center text-2xl font-bold"
          style={{ backgroundColor: backgroundColor, color: foregroundColor }}
        >
          Contoh Teks
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Rasio Kontras:</span>
            <span className="text-2xl font-bold">{contrastRatio.toFixed(2)}:1</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              {wcagCompliance.AA ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className={cn("font-medium", wcagCompliance.AA ? "text-green-600" : "text-red-600")}>
                WCAG AA (Minimum)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {wcagCompliance.AAA ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className={cn("font-medium", wcagCompliance.AAA ? "text-green-600" : "text-red-600")}>
                WCAG AAA (Enhanced)
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Rasio kontras yang direkomendasikan: AA (4.5:1 untuk teks normal, 3:1 untuk teks besar), AAA (7:1 untuk teks
            normal, 4.5:1 untuk teks besar).
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
