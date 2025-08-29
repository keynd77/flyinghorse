# Gallery Configuration API

This website provides a public JSON configuration file that can be accessed by other websites to get the image gallery data.

## 📍 **Access URL**
```
https://your-domain.com/gallery-config.json
```

## 📋 **JSON Structure**
```json
{
  "imageCollection": {
    "juan-1": "/images/memes/juan-1.png",
    "juan-2": "/images/memes/juan-2.png",
    // ... 97 total images
  },
  "galleryConfig": {
    "columns": 9,
    "spacing": {
      "x": 5,
      "y": 4,
      "z": 6
    },
    "imageSize": {
      "width": 3,
      "height": 2.5
    },
    "wobble": {
      "baseFactor": 0.2,
      "hoverFactor": 0.4,
      "baseSpeed": 1,
      "hoverSpeed": 4
    }
  }
}
```

## 🌐 **Usage Examples**

### **JavaScript Fetch**
```javascript
fetch('https://your-domain.com/gallery-config.json')
  .then(response => response.json())
  .then(data => {
    console.log('Image collection:', data.imageCollection)
    console.log('Gallery config:', data.galleryConfig)
    
    // Get all image URLs
    const imageUrls = Object.values(data.imageCollection)
    
    // Use gallery settings
    const columns = data.galleryConfig.columns
    const spacing = data.galleryConfig.spacing
  })
  .catch(error => console.error('Failed to load config:', error))
```

### **React Hook**
```javascript
import { useState, useEffect } from 'react'

function useGalleryConfig() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('https://your-domain.com/gallery-config.json')
      .then(response => response.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return { config, loading, error }
}
```

### **Python Requests**
```python
import requests

response = requests.get('https://your-domain.com/gallery-config.json')
data = response.json()

image_collection = data['imageCollection']
gallery_config = data['galleryConfig']

print(f"Total images: {len(image_collection)}")
print(f"Gallery columns: {gallery_config['columns']}")
```

## 📊 **Data Fields**

### **imageCollection**
- **Type**: Object with string keys and string values
- **Keys**: Descriptive names (e.g., "juan-1", "juan-2")
- **Values**: Image URLs relative to the domain
- **Total**: 97 images (PNG and JPG formats)

### **galleryConfig**
- **columns**: Number of columns in the grid layout (9)
- **spacing**: 3D spacing between images
  - **x**: Horizontal spacing (5 units)
  - **y**: Vertical spacing (4 units) 
  - **z**: Depth spacing (6 units)
- **imageSize**: Dimensions of each image
  - **width**: Image width (3 units)
  - **height**: Image height (2.5 units)
- **wobble**: Animation settings for hover effects
  - **baseFactor**: Base wobble intensity (0.2)
  - **hoverFactor**: Hover wobble intensity (0.4)
  - **baseSpeed**: Base animation speed (1)
  - **hoverSpeed**: Hover animation speed (4)

## 🔄 **Updates**
- The configuration is automatically loaded when the website starts
- Changes to the JSON file are reflected immediately
- No caching - always fetches the latest version

## 🌍 **CORS**
This JSON file is served with appropriate CORS headers to allow cross-origin requests from other websites.

