"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ImageIcon, MousePointerClick, Upload } from "lucide-react"
import { rgbToHex } from "@/lib/color-utils"
import ColorCard from "@/components/color-card"
import { useToast } from "@/components/ui/use-toast"

export default function ImageColorPicker() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [pickedColor, setPickedColor] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageSrc(reader.result as string)
        setPickedColor(null) // Reset picked color on new image upload
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (imageSrc && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const img = imageRef.current

      img.onload = () => {
        // Resize canvas to fit image, or limit size for performance
        const maxWidth = 800
        const maxHeight = 600
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)
      }
    }
  }, [imageSrc])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const pixel = ctx.getImageData(x, y, 1, 1).data
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2])
    setPickedColor(hex)

    toast({
      title: "Warna Dipilih!",
      description: `Warna ${hex.toUpperCase()} telah dipilih dari gambar.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Pemilih Warna dari Gambar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="image-upload" className="mb-2 block">
            Unggah Gambar
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Pilih Gambar
          </Button>
        </div>

        {imageSrc && (
          <div className="relative border rounded-md overflow-hidden flex justify-center items-center bg-muted">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto cursor-crosshair"
              onClick={handleCanvasClick}
              style={{ display: "block" }}
              aria-label="Klik pada gambar untuk memilih warna"
            />
            <img
              ref={imageRef}
              src={imageSrc || "/placeholder.svg"}
              alt="Gambar yang diunggah"
              className="hidden"
              crossOrigin="anonymous"
            />
            <div className="absolute top-2 right-2 bg-background/80 p-2 rounded-md flex items-center gap-2 text-sm">
              <MousePointerClick className="h-4 w-4" />
              Klik pada gambar untuk memilih warna
            </div>
          </div>
        )}

        {pickedColor && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MousePointerClick className="h-5 w-5" />
              Warna yang Dipilih
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <ColorCard hex={pickedColor} name="Warna Dipilih" />
            </div>
          </div>
        )}

        {!imageSrc && <p className="text-center text-muted-foreground">Unggah gambar untuk mulai memilih warna.</p>}
      </CardContent>
    </Card>
  )
}
