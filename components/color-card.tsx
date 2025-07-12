"use client"

import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { hexToRgb, hexToHsl } from "@/lib/color-utils"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorCardProps {
  hex: string
  name?: string
}

export default function ColorCard({ hex, name }: ColorCardProps) {
  const { toast } = useToast()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const rgb = hexToRgb(hex)
  const hsl = hexToHsl(hex)

  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Disalin!",
      description: `Kode ${format} ${text} telah disalin ke clipboard.`,
    })
    setIsPopoverOpen(false) // Close popover after copying
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out group aspect-square",
        "hover:scale-[1.02] hover:shadow-lg",
      )}
      style={{ backgroundColor: hex }}
    >
      <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: hex }}></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        <span
          className="font-mono text-lg font-semibold mb-2 text-white text-shadow-sm"
          style={{ textShadow: "0px 0px 4px rgba(0,0,0,0.5)" }}
        >
          {hex.toUpperCase()}
        </span>
        {name && (
          <span
            className="text-sm text-white/80 mb-2 text-shadow-sm"
            style={{ textShadow: "0px 0px 4px rgba(0,0,0,0.5)" }}
          >
            {name}
          </span>
        )}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/20 text-white hover:bg-white/40 hover:text-white border-white/30"
              aria-label={`Salin kode hex ${hex}`}
            >
              <Copy className="h-4 w-4 mr-2" />
              Salin
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 flex flex-col gap-1 bg-popover text-popover-foreground shadow-lg rounded-md">
            <Button
              variant="ghost"
              className="justify-start text-sm h-8"
              onClick={() => handleCopy(hex.toUpperCase(), "Hex")}
            >
              Hex: {hex.toUpperCase()}
            </Button>
            {rgb && (
              <Button
                variant="ghost"
                className="justify-start text-sm h-8"
                onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")}
              >
                RGB: {`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
              </Button>
            )}
            {hsl && (
              <Button
                variant="ghost"
                className="justify-start text-sm h-8"
                onClick={() =>
                  handleCopy(`hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`, "HSL")
                }
              >
                HSL: {`hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`}
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
