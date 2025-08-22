# Aviation Heaven ✈️

A beautiful 3D aviation experience built with React Three Fiber, featuring a detailed airplane model soaring through animated clouds with a stunning sky environment.

## Features

- **3D Airplane Model**: Detailed airplane built with Three.js geometries including body, wings, tail, windows, and propeller
- **Animated Clouds**: Multiple cloud formations with different sizes, opacities, and movement patterns
- **Dynamic Sky**: Beautiful sky environment with sunset lighting
- **Smooth Animations**: Gentle floating airplane animation and slow cloud movement
- **Interactive Controls**: Orbit controls for camera movement and exploration
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Modern UI**: Elegant overlay with glowing text effects

## Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber
- **Three.js** - 3D graphics library

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aviation-heaven
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── Airplane.tsx    # 3D airplane model with animations
│   └── Clouds.tsx      # Cloud formations and movement
├── App.tsx             # Main application component
├── App.css             # Application styles
├── index.css           # Global styles
└── main.tsx           # Application entry point
```

## Controls

- **Mouse/Touch**: Click and drag to rotate the camera around the scene
- **Scroll**: Zoom in and out
- **Pan**: Right-click and drag to pan the view

## Customization

### Modifying the Airplane

The airplane model is built in `src/components/Airplane.tsx` using basic Three.js geometries. You can:

- Change colors by modifying the `color` prop in materials
- Adjust size by changing geometry `args`
- Modify animation by editing the `useFrame` hook

### Adjusting Clouds

Cloud properties can be modified in `src/components/Clouds.tsx`:

- `opacity`: Cloud transparency (0-1)
- `speed`: Animation speed
- `width/depth`: Cloud dimensions
- `segments`: Detail level
- `position`: Location in 3D space
- `scale`: Size multiplier

### Sky Environment

The sky environment is configured in `src/App.tsx`:

- `Sky` component controls the sky appearance
- `Environment` provides lighting presets
- `ambientLight` and `directionalLight` control scene lighting

## Deployment

This project can be easily deployed to various platforms:

### Vercel
```bash
npm run build
# Deploy the dist folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy the dist folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Deploy the dist folder to GitHub Pages
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by aviation and flight simulation
- Built with modern web technologies
- Special thanks to the React Three Fiber community

---

**Fly high and enjoy the view!** 🛩️
