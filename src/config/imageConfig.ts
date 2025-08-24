// Image Gallery Configuration
// Edit this file to add/remove images from your gallery
// Simply add new lines or delete existing ones to update your collection

export interface ImageCollection {
  [key: string]: string;
}

export interface GalleryConfig {
  columns: number;
  spacing: {
    x: number;
    y: number;
    z: number;
  };
  imageSize: {
    width: number;
    height: number;
  };
  wobble: {
    baseFactor: number;
    hoverFactor: number;
    baseSpeed: number;
    hoverSpeed: number;
  };
}

export const imageCollection: ImageCollection = {
  // Add new images by adding new lines here
  // Remove images by deleting the lines you don't want
  // Format: 'descriptive-name': '/path/to/image.png'
  
  'juan-1': '/images/memes/juan-1.png',
  'juan-2': '/images/memes/juan-2.png',
  'juan-3': '/images/memes/juan-3.png',
  'juan-4': '/images/memes/juan-4.png',
  'juan-5': '/images/memes/juan-5.png',
  'juan-6': '/images/memes/juan-6.png',
  'juan-7': '/images/memes/juan-7.png',
  'juan-8': '/images/memes/juan-8.png',
  'juan-9': '/images/memes/juan-9.png',
  'juan-10': '/images/memes/juan-10.png',
  'juan-11': '/images/memes/juan-11.png',
  'juan-12': '/images/memes/juan-12.png',
  'juan-13': '/images/memes/juan-13.png',
  'juan-14': '/images/memes/juan-14.png',
  'juan-15': '/images/memes/juan-15.png',
  'juan-16': '/images/memes/juan-16.png',
  'juan-17': '/images/memes/juan-17.png',
  'juan-18': '/images/memes/juan-18.png',
  'juan-19': '/images/memes/juan-19.png',
  'juan-20': '/images/memes/juan-20.png',
  'juan-21': '/images/memes/juan-21.png',
  'juan-22': '/images/memes/juan-22.png',
  'juan-23': '/images/memes/juan-23.png',
  'juan-24': '/images/memes/juan-24.png',
  'juan-25': '/images/memes/juan-25.png',
  'juan-26': '/images/memes/juan-26.png',
  'juan-27': '/images/memes/juan-27.png',
  'juan-28': '/images/memes/juan-28.png',
  'juan-29': '/images/memes/juan-29.png',
  'juan-30': '/images/memes/juan-30.png',
  'juan-31': '/images/memes/juan-31.png',
  'juan-32': '/images/memes/juan-32.png',
  'juan-33': '/images/memes/juan-33.png',
  'juan-34': '/images/memes/juan-34.png',
  'juan-35': '/images/memes/juan-35.png',
  'juan-36': '/images/memes/juan-36.png',
  'juan-37': '/images/memes/juan-37.png',
  'juan-38': '/images/memes/juan-38.png',
  'juan-39': '/images/memes/juan-39.png',
  'juan-40': '/images/memes/juan-40.png',
  'juan-41': '/images/memes/juan-41.png',
  'juan-42': '/images/memes/juan-42.png',
  'juan-43': '/images/memes/juan-43.png',
  'juan-44': '/images/memes/juan-44.png',
  'juan-45': '/images/memes/juan-45.png',
  'juan-46': '/images/memes/juan-46.png',
  'juan-47': '/images/memes/juan-47.png',
  'juan-48': '/images/memes/juan-48.png',
  'juan-49': '/images/memes/juan-49.png',
  'juan-50': '/images/memes/juan-50.png',
  'juan-51': '/images/memes/juan-51.png',
  'juan-52': '/images/memes/juan-52.png',
  'juan-53': '/images/memes/juan-53.png',
  'juan-54': '/images/memes/juan-54.png',
  'juan-55': '/images/memes/juan-55.png',
  'juan-56': '/images/memes/juan-56.png',
  'juan-57': '/images/memes/juan-57.png',
  'juan-58': '/images/memes/juan-58.png',
  'juan-59': '/images/memes/juan-59.png',
  'juan-60': '/images/memes/juan-60.png',
  'juan-61': '/images/memes/juan-61.png',
  'juan-62': '/images/memes/juan-62.png',
  'juan-63': '/images/memes/juan-63.png',
  'juan-64': '/images/memes/juan-64.png',
  'juan-65': '/images/memes/juan-65.png',
  'juan-66': '/images/memes/juan-66.png',
  'juan-67': '/images/memes/juan-67.png',
  'juan-68': '/images/memes/juan-68.png',
  'juan-69': '/images/memes/juan-69.png',
  'juan-70': '/images/memes/juan-70.png',
  'juan-71': '/images/memes/juan-71.png',
  'juan-72': '/images/memes/juan-72.png',
  'juan-73': '/images/memes/juan-73.png',
  'juan-74': '/images/memes/juan-74.png',
  'juan-75': '/images/memes/juan-75.png',
  'juan-76': '/images/memes/juan-76.png',
  'juan-77': '/images/memes/juan-77.png',
  'juan-78': '/images/memes/juan-78.png',
  'juan-79': '/images/memes/juan-79.png',
  'juan-80': '/images/memes/juan-80.png',
  'juan-81': '/images/memes/juan-81.png',
}

// You can also add other gallery configuration options here
export const galleryConfig: GalleryConfig = {
  // Grid layout settings
  columns: 9,
  spacing: {
    x: 5,  // Space between columns
    y: 4,  // Space between rows
    z: 6   // Depth spacing
  },
  
  // Image dimensions
  imageSize: {
    width: 3,
    height: 2.5
  },
  
  // Wobble effect settings
  wobble: {
    baseFactor: 0.2,
    hoverFactor: 0.4,
    baseSpeed: 1,
    hoverSpeed: 4
  }
}
