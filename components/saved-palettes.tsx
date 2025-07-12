"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, FolderOpen } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getSavedPalettes, deletePalette } from "@/lib/local-storage-utils"

interface SavedPalette {
  name: string
  colors: string[]
  savedAt: string
}

export default function SavedPalettes() {
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([])
  const { toast } = useToast()

  const loadPalettes = () => {
    const palettes = getSavedPalettes()
    setSavedPalettes(palettes)
  }

  const handleDeletePalette = (name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus palet "${name}"?`)) {
      deletePalette(name)
      loadPalettes()
      toast({
        title: "Palet Dihapus!",
        description: `Palet "${name}" telah dihapus.`,
      })
    }
  }

  useEffect(() => {
    loadPalettes()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Palet Tersimpan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {savedPalettes.length === 0 ? (
          <p className="text-center text-muted-foreground">Belum ada palet yang disimpan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPalettes.map((palette, index) => (
              <Card key={index} className="relative group overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    {palette.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePalette(palette.name)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-600"
                      aria-label={`Hapus palet ${palette.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Disimpan: {palette.savedAt}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {palette.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="h-16 rounded-md border"
                        style={{ backgroundColor: color }}
                        title={color.toUpperCase()}
                      ></div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">{/* Future: Add "Load Palette" button here */}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
