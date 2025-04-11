/**
 * Banner Model - Data structures for banner generation
 */
export class BannerModel {
  constructor() {
    this.layouts = {
      modernAgency: {
        canvas: { width: 1200, height: 600 },
        contentArea: {
          position: { x: "8%", y: "20%" },
          width: "45%",
          elements: [
            { type: "label", position: { x: "0%", y: "0%" }, style: { fontSize: 24, fontWeight: "bold", withBackground: true, backgroundColor: "rgba(255,255,255,0.3)" } },
            { type: "heading", position: { x: "0%", y: "15%" }, style: { fontSize: 72, fontWeight: "bold", lineHeight: 1.1 } },
            { type: "description", position: { x: "0%", y: "45%" }, style: { fontSize: 24, lineHeight: 1.4 } },
            { type: "tagline", position: { x: "0%", y: "70%" }, style: { fontSize: 32, fontStyle: "italic" } },
            { type: "cta", position: { x: "0%", y: "85%" }, style: { width: 200, height: 60 } }
          ]
        },
        imageArea: {
          position: { x: "75%", y: "50%" },
          width: "45%",
          mask: "circle"
        },
        background: {
          base: "gradient",
          pattern: "dots",
          accent: "wave"
        }
      },
      
      productShowcase: {
        canvas: { width: 1200, height: 600 },
        contentArea: {
          position: { x: "10%", y: "55%" },
          width: "80%",
          elements: [
            { type: "label", position: { x: "0%", y: "0%" }, style: { fontSize: 22, fontWeight: "bold", withBackground: true, backgroundColor: "rgba(255,255,255,0.4)" } },
            { type: "heading", position: { x: "0%", y: "15%" }, style: { fontSize: 64, fontWeight: "bold", lineHeight: 1.1 } },
            { type: "description", position: { x: "0%", y: "40%" }, style: { fontSize: 24, lineHeight: 1.4 } },
            { type: "cta", position: { x: "0%", y: "75%" }, style: { width: 220, height: 60 } }
          ]
        },
        imageArea: {
          position: { x: "50%", y: "20%" },
          width: "70%",
          mask: "rectangle"
        },
        background: {
          base: "solid",
          pattern: "geometric",
          accent: "none"
        }
      },
      
      minimalDesign: {
        canvas: { width: 1200, height: 600 },
        contentArea: {
          position: { x: "50%", y: "50%" },
          width: "80%",
          elements: [
            { type: "heading", position: { x: "0%", y: "0%" }, style: { fontSize: 82, fontWeight: "bold", textAlign: "center", centered: true } },
            { type: "description", position: { x: "0%", y: "40%" }, style: { fontSize: 28, textAlign: "center", centered: true, lineHeight: 1.5 } },
            { type: "cta", position: { x: "50%", y: "70%" }, style: { width: 220, height: 60, centered: true } }
          ]
        },
        imageArea: {
          position: { x: "50%", y: "50%" },
          width: "100%",
          mask: "overlay",
          opacity: 0.2
        },
        background: {
          base: "solid",
          pattern: "minimal",
          accent: "none"
        }
      },
      
      luxuryProduct: {
        canvas: { width: 1200, height: 600 },
        contentArea: {
          position: { x: "10%", y: "20%" },
          width: "40%",
          elements: [
            { type: "label", position: { x: "0%", y: "0%" }, style: { fontSize: 24, fontWeight: "bold", fontFamily: "Playfair Display" } },
            { type: "heading", position: { x: "0%", y: "15%" }, style: { fontSize: 70, fontWeight: "bold", fontFamily: "Playfair Display", lineHeight: 1.1 } },
            { type: "tagline", position: { x: "0%", y: "55%" }, style: { fontSize: 30, fontStyle: "italic", fontFamily: "Playfair Display" } },
            { type: "description", position: { x: "0%", y: "70%" }, style: { fontSize: 22, fontFamily: "Montserrat", lineHeight: 1.5 } },
            { type: "cta", position: { x: "0%", y: "90%" }, style: { width: 200, height: 60, fontFamily: "Montserrat" } }
          ]
        },
        imageArea: {
          position: { x: "75%", y: "50%" },
          width: "40%",
          mask: "circle"
        },
        background: {
          base: "gradient",
          pattern: "minimal",
          accent: "line"
        }
      }
    };
    
    // Current state
    this.content = null;
    this.image = null;
    this.currentLayout = null;
    
    // Default color schemes
    this.colorSchemes = {
      modern: {
        primary: "#3498db",
        secondary: "#2ecc71",
        text: "#ffffff",
        background: ["#2c3e50", "#34495e"]
      },
      luxury: {
        primary: "#4B0082",
        secondary: "#f4b942",
        text: "#ffffff",
        background: ["#2d1d40", "#482e65"]
      },
      minimal: {
        primary: "#000000",
        secondary: "#555555",
        text: "#ffffff",
        background: ["#1a1a1a", "#333333"]
      },
      bright: {
        primary: "#ff6b6b",
        secondary: "#feca57",
        text: "#ffffff",
        background: ["#ff6b6b", "#ff9ff3"]
      },
      elegant: {
        primary: "#B8860B",
        secondary: "#FFFFFF",
        text: "#FFFFFF",
        background: ["#000000", "#1A1A1A"]
      },
      nature: {
        primary: "#2E8B57",
        secondary: "#F0E68C",
        text: "#FFFFFF",
        background: ["#006400", "#228B22"]
      }
    };
  }
  
  // Helper method to get a layout by name
  getLayout(name) {
    return this.layouts[name] || this.layouts.modernAgency;
  }
  
  // Helper method to get a random layout
  getRandomLayout() {
    const keys = Object.keys(this.layouts);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return this.layouts[randomKey];
  }
  
  // Helper method to get a color scheme
  getColorScheme(name) {
    return this.colorSchemes[name] || this.colorSchemes.modern;
  }
} 