// Define the structure for a saved palette
interface SavedPalette {
  name: string
  colors: string[]
  savedAt: string // ISO string for date
}

const STORAGE_KEY = "color_palettes"

// Function to get all saved palettes
export function getSavedPalettes(): SavedPalette[] {
  if (typeof window === "undefined") {
    return []
  }
  try {
    const item = localStorage.getItem(STORAGE_KEY)
    return item ? JSON.parse(item) : []
  } catch (error) {
    console.error("Failed to load palettes from local storage:", error)
    return []
  }
}

// Function to save a new palette
export function savePalette(name: string, colors: string[]): void {
  if (typeof window === "undefined") {
    return
  }
  try {
    const palettes = getSavedPalettes()
    const newPalette: SavedPalette = {
      name,
      colors,
      savedAt: new Date().toISOString(),
    }
    // Check if a palette with the same name already exists and replace it
    const existingIndex = palettes.findIndex((p) => p.name === name)
    if (existingIndex > -1) {
      palettes[existingIndex] = newPalette
    } else {
      palettes.push(newPalette)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes))
  } catch (error) {
    console.error("Failed to save palette to local storage:", error)
  }
}

// Function to delete a palette by name
export function deletePalette(name: string): void {
  if (typeof window === "undefined") {
    return
  }
  try {
    let palettes = getSavedPalettes()
    palettes = palettes.filter((p) => p.name !== name)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes))
  } catch (error) {
    console.error("Failed to delete palette from local storage:", error)
  }
}
