import ColorPaletteGenerator from "@/components/color-palette-generator"
import ColorConverter from "@/components/color-converter"
import GradientGenerator from "@/components/gradient-generator"
import AccessibilityChecker from "@/components/accessibility-checker"
import ColorMixer from "@/components/color-mixer"
import ShadesTintsGenerator from "@/components/shades-tints-generator"
import ImageColorPicker from "@/components/image-color-picker"
import SavedPalettes from "@/components/saved-palettes"
import { ModeToggle } from "@/components/mode-toggle"
import { Github } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center border-b gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold text-center sm:text-left">Penjelajah Palet Warna Super Keren Ultimate</h1>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/vercel/v0"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            <Github className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Tabs defaultValue="palette-generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 h-auto">
            <TabsTrigger value="palette-generator">Pembuat Palet</TabsTrigger>
            <TabsTrigger value="color-converter">Konverter Warna</TabsTrigger>
            <TabsTrigger value="color-mixer">Pencampur Warna</TabsTrigger>
            <TabsTrigger value="shades-tints">Shades & Tints</TabsTrigger>
            <TabsTrigger value="gradient-generator">Pembuat Gradien</TabsTrigger>
            <TabsTrigger value="image-picker">Pilih dari Gambar</TabsTrigger>
            <TabsTrigger value="saved-palettes">Palet Tersimpan</TabsTrigger>
            <TabsTrigger value="accessibility-checker">Aksesibilitas</TabsTrigger>
          </TabsList>
          <TabsContent value="palette-generator" className="mt-6">
            <ColorPaletteGenerator />
          </TabsContent>
          <TabsContent value="color-converter" className="mt-6">
            <ColorConverter />
          </TabsContent>
          <TabsContent value="color-mixer" className="mt-6">
            <ColorMixer />
          </TabsContent>
          <TabsContent value="shades-tints" className="mt-6">
            <ShadesTintsGenerator />
          </TabsContent>
          <TabsContent value="gradient-generator" className="mt-6">
            <GradientGenerator />
          </TabsContent>
          <TabsContent value="image-picker" className="mt-6">
            <ImageColorPicker />
          </TabsContent>
          <TabsContent value="saved-palettes" className="mt-6">
            <SavedPalettes />
          </TabsContent>
          <TabsContent value="accessibility-checker" className="mt-6">
            <AccessibilityChecker />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} Penjelajah Palet Warna Super Keren Ultimate. Dibuat dengan ❤️ oleh v0.</p>
      </footer>
    </div>
  )
}
