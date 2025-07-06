// src/utils/imageUtils.ts

// Load all image modules in that folder
export const imageModules = import.meta.glob('../assets/images/*.{png,jpg,jpeg}')

// Force images to be bundled in production
Object.values(imageModules).forEach(loader => loader())

// Create an array of { name, path } for each image
export function getImageEntries(): { name: string; path: string }[] {
  return Object.keys(imageModules).map(key => {
    const parts = key.split('/')
    const fileName = parts[parts.length - 1]
    return {
      name: fileName,
      path: new URL(key.replace('..', '.'), import.meta.url).href
    }
  })
}