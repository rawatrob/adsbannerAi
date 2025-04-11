// Layout templates for banner themes
const layoutTemplates = {
  // Modern Agency Layout
  modernAgency: {
    canvas: {
      width: 1200,
      height: 600,
      aspectRatio: 2
    },
    layout: {
      // Left content area (60% of width)
      contentArea: {
        width: "60%",
        padding: 80,
        elements: [
          {
            type: "label",
            position: { top: "8%", left: "0" },
            style: {
              maxWidth: "200px",
              padding: "8px 16px",
              borderRadius: "20px"
            }
          },
          {
            type: "heading",
            position: { top: "20%", left: "0" },
            style: {
              maxWidth: "80%",
              fontSize: 64,
              lineHeight: 1.2
            }
          },
          {
            type: "description",
            position: { top: "45%", left: "0" },
            style: {
              maxWidth: "70%",
              fontSize: 28,
              lineHeight: 1.4
            }
          },
          {
            type: "tagline",
            position: { top: "65%", left: "0" },
            style: {
              fontSize: 22
            }
          },
          {
            type: "cta",
            position: { top: "75%", left: "0" },
            style: {
              width: 180,
              height: 56,
              borderRadius: 28
            }
          },
          {
            type: "contact",
            position: { top: "85%", left: "0" },
            style: {
              width: 260,
              height: 56,
              borderRadius: 28
            }
          }
        ]
      },
      // Right image area (40% of width)
      imageArea: {
        width: "40%",
        position: { right: "0", top: "0" },
        style: {
          maskType: "circle",
          maskSize: "90%",
          maskPosition: "center"
        }
      }
    },
    background: {
      layers: [
        {
          type: "base",
          style: {
            type: "gradient"
          }
        },
        {
          type: "pattern",
          style: {
            type: "dots",
            density: "medium",
            opacity: 0.1
          }
        },
        {
          type: "accent",
          style: {
            type: "wave",
            opacity: 0.3
          }
        }
      ]
    },
    styleTokens: {
      fonts: {
        primary: "Montserrat",
        secondary: "Arial"
      },
      spacing: {
        small: 8,
        medium: 16,
        large: 24,
        xlarge: 40
      },
      animation: {
        duration: "0.3s",
        type: "ease-in-out"
      }
    }
  },

  // Minimal Product Layout
  minimalProduct: {
    canvas: {
      width: 1200,
      height: 600,
      aspectRatio: 2
    },
    layout: {
      // Left content area (50% of width)
      contentArea: {
        width: "50%",
        padding: 60,
        elements: [
          {
            type: "label",
            position: { top: "10%", left: "0" },
            style: {
              maxWidth: "150px",
              padding: "6px 12px",
              borderRadius: "15px"
            }
          },
          {
            type: "heading",
            position: { top: "25%", left: "0" },
            style: {
              maxWidth: "90%",
              fontSize: 48,
              lineHeight: 1.3
            }
          },
          {
            type: "description",
            position: { top: "50%", left: "0" },
            style: {
              maxWidth: "80%",
              fontSize: 24,
              lineHeight: 1.5
            }
          },
          {
            type: "cta",
            position: { top: "70%", left: "0" },
            style: {
              width: 160,
              height: 50,
              borderRadius: 25
            }
          }
        ]
      },
      // Right image area (50% of width)
      imageArea: {
        width: "50%",
        position: { right: "0", top: "0" },
        style: {
          maskType: "rectangle",
          maskSize: "95%",
          maskPosition: "center"
        }
      }
    },
    background: {
      layers: [
        {
          type: "base",
          style: {
            type: "solid"
          }
        },
        {
          type: "pattern",
          style: {
            type: "geometric",
            density: "light",
            opacity: 0.05
          }
        }
      ]
    },
    styleTokens: {
      fonts: {
        primary: "Inter",
        secondary: "Arial"
      },
      spacing: {
        small: 6,
        medium: 12,
        large: 20,
        xlarge: 32
      },
      animation: {
        duration: "0.2s",
        type: "ease-out"
      }
    }
  },
  
  // Vibrant Retail Layout - Based on user design
  vibrantRetail: {
    canvas: {
      width: 1200,
      height: 600,
      aspectRatio: 2
    },
    layout: {
      // Left content area (50% of width)
      contentArea: {
        position: { x: "0%", y: "0%" },
        width: "50%",
        padding: 40,
        elements: [
          {
            type: "label",
            position: { x: "5%", y: "10%" },
            style: {
              maxWidth: "200px",
              fontSize: 28,
              fontWeight: "bold",
              textAlign: "left"
            }
          },
          {
            type: "heading",
            position: { x: "5%", y: "30%" },
            style: {
              maxWidth: "90%",
              fontSize: 56,
              lineHeight: 1.2,
              fontWeight: "bold"
            }
          },
          {
            type: "description",
            position: { x: "5%", y: "50%" },
            style: {
              maxWidth: "90%",
              fontSize: 24,
              lineHeight: 1.4
            }
          },
          {
            type: "tagline",
            position: { x: "5%", y: "65%" },
            style: {
              fontSize: 28,
              fontWeight: "bold"
            }
          },
          {
            type: "cta",
            position: { x: "5%", y: "80%" },
            style: {
              width: 220,
              height: 60,
              borderRadius: 4,
              fontSize: 22,
              fontWeight: "bold"
            }
          }
        ]
      },
      // Right image area
      imageArea: {
        position: { x: "70%", y: "50%" },
        width: "50%",
        mask: "circle"
      },
      // Logo area
      logoArea: {
        position: { x: "85%", y: "15%" },
        width: "25%",
        height: "15%"
      },
      // Discount badge (circular)
      discountBadge: {
        position: { x: "50%", y: "45%" },
        radius: 100,
        style: {
          fill: "#FFD700",
          stroke: "#FFFFFF",
          strokeWidth: 5,
          fontSize: 36,
          fontWeight: "bold",
          textAlign: "center"
        }
      },
      // Phone/contact info
      contactInfo: {
        position: { x: "30%", y: "90%" },
        style: {
          fontSize: 24,
          fontWeight: "bold",
          backgroundColor: "#FFD700"
        }
      }
    },
    background: {
      layers: [
        {
          type: "base",
          style: {
            type: "split",
            colors: ["#c159f9", "#5e0e8b"]
          }
        },
        {
          type: "accent",
          style: {
            type: "curved",
            position: "right",
            radius: "60%"
          }
        }
      ]
    },
    styleTokens: {
      colors: {
        primary: "#5e0e8b",    // Deep purple
        secondary: "#FFD700",  // Gold/yellow
        accent: "#c159f9",     // Light purple
        text: "#FFFFFF"        // White text
      },
      fonts: {
        primary: "Montserrat",
        secondary: "Arial"
      },
      spacing: {
        small: 10,
        medium: 20,
        large: 30,
        xlarge: 50
      }
    }
  }
};

// Helper function to get layout template
function getLayoutTemplate(templateName) {
  return layoutTemplates[templateName] || layoutTemplates.modernAgency;
}

// Helper function to get random layout template
function getRandomLayout() {
  const templates = Object.values(layoutTemplates);
  return templates[Math.floor(Math.random() * templates.length)];
}

export { layoutTemplates, getLayoutTemplate, getRandomLayout }; 