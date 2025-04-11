/**
 * Banner Context - Business logic for banner generation
 */
export class BannerContext {
  constructor(model) {
    this.model = model;
    this.canvas = null;
    // API key should be loaded from environment variables or config
    this.API_KEY = process.env.OPENAI_API_KEY || '';
  }

  /**
   * Initialize the canvas
   * @param {string} canvasId - Canvas element ID
   */
  async initialize(canvasId) {
    this.canvas = new fabric.Canvas(canvasId);
    this.canvas.setWidth(1200);
    this.canvas.setHeight(600);
  }

  /**
   * Process image and convert to data URL
   * @param {File} imageFile - Uploaded image file
   * @returns {Promise<string>} - Data URL
   */
  processImage(imageFile) {
    return new Promise((resolve, reject) => {
      if (!imageFile) {
        reject(new Error('No image file provided'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve(img);
        };
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        img.src = e.target.result;
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(imageFile);
    });
  }

  /**
   * Generate creative content using LLM
   * @param {string} prompt - User prompt for content generation
   * @returns {Promise<Object>} - Generated content
   */
  async generateContent(prompt) {
    try {
      if (!prompt || prompt.trim() === '') {
        throw new Error('No prompt provided');
      }

      // Check if API key is available
      if (!this.API_KEY) {
        console.warn('No API key provided. Using fallback content.');
        return this.getFallbackContent();
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a creative advertising copywriter. Generate engaging content for a product banner based on the description.
                Return a JSON object with the following structure:
                {
                  "topLabel": "A short, impactful label (2-3 words)",
                  "mainHeading": "A compelling main heading (3-5 words)",
                  "description": "A brief, engaging product description (1-2 sentences)",
                  "tagline": "A memorable tagline (3-4 words)",
                  "design": {
                    "colors": {
                      "primary": "Main brand color (hex code)",
                      "secondary": "Accent color (hex code)",
                      "text": "Text color (hex code)"
                    },
                    "style": {
                      "mood": "Design mood (e.g., luxurious, modern, playful)",
                      "elements": ["List of design elements"]
                    }
                  }
                }
                IMPORTANT: All colors in the 'colors' object MUST be valid CSS hex colors (e.g., "#FF5500"). Do not use color names like "gold" or "dark blue".`
            },
            {
              role: "user",
              content: `Create banner content for: ${prompt}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const content = JSON.parse(data.choices[0].message.content);
      
      // Validate and fix color values
      return this.validateContentColors(content);
    } catch (error) {
      console.error('Error generating content:', error);
      
      // Return fallback content if generation fails
      return this.getFallbackContent();
    }
  }

  /**
   * Get fallback content when API is unavailable
   * @returns {Object} - Fallback content
   */
  getFallbackContent() {
    return {
      topLabel: "FEATURED",
      mainHeading: "Premium Quality",
      description: "Experience excellence in every detail",
      tagline: "Elevate Your Style",
      design: {
        colors: {
          primary: "#4B0082",
          secondary: "#f4b942",
          text: "#ffffff"
        },
        style: {
          mood: "luxurious",
          elements: ["gradient", "geometric"]
        }
      }
    };
  }

  /**
   * Validate and fix color values in content
   * @param {Object} content - Generated content
   * @returns {Object} - Content with validated colors
   */
  validateContentColors(content) {
    if (!content.design || !content.design.colors) {
      content.design = {
        colors: {
          primary: "#4B0082",
          secondary: "#f4b942",
          text: "#ffffff"
        },
        style: {
          mood: "luxurious",
          elements: ["gradient", "geometric"]
        }
      };
      return content;
    }
    
    const colors = content.design.colors;
    
    // Validate primary color
    colors.primary = this.ensureValidColor(colors.primary) || "#4B0082";
    
    // Validate secondary color
    colors.secondary = this.ensureValidColor(colors.secondary) || "#f4b942";
    
    // Validate text color
    colors.text = this.ensureValidColor(colors.text) || "#ffffff";
    
    return content;
  }

  /**
   * Generate background pattern using LLM
   * @param {Object} style - Design style preferences
   * @returns {Promise<Object>} - Generated pattern
   */
  async generateBackgroundPattern(style) {
    try {
      // Check if API key is available
      if (!this.API_KEY) {
        console.warn('No API key provided. Using default pattern.');
        return this.getDefaultPattern();
      }
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a creative banner designer. Generate background pattern specifications that match the given style.
                Return a JSON object with the following structure:
                {
                  "pattern": {
                    "type": "geometric|organic|abstract",
                    "elements": [
                      {
                        "shape": "circle|line|rectangle|wave",
                        "count": number,
                        "size": { "min": number, "max": number },
                        "opacity": number,
                        "distribution": "random|grid|radial"
                      }
                    ],
                    "colors": {
                      "background": ["#hexcolor1", "#hexcolor2"],
                      "elements": ["#hexcolor1", "#hexcolor2"]
                    }
                  }
                }
                IMPORTANT: All colors MUST be valid CSS hex colors (e.g., "#FF5500"). Do not use color names like "gold" or "dark blue".`
            },
            {
              role: "user",
              content: `Create background pattern for style: ${style.mood}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const patternConfig = JSON.parse(data.choices[0].message.content);
      
      // Validate and ensure all colors are valid hex colors
      return this.validatePatternColors(patternConfig);
    } catch (error) {
      console.error('Error generating background pattern:', error);
      
      // Return default pattern if API call fails
      return {
        pattern: {
          type: "geometric",
          elements: [
            {
              shape: "circle",
              count: 20,
              size: { min: 5, max: 15 },
              opacity: 0.1,
              distribution: "random"
            }
          ],
          colors: {
            background: ["#4B0082", "#6A0DAD"],
            elements: ["#FFFFFF"]
          }
        }
      };
    }
  }

  /**
   * Validate and ensure all colors in pattern config are valid hex colors
   * @param {Object} patternConfig - Pattern configuration from LLM
   * @returns {Object} - Validated pattern configuration
   */
  validatePatternColors(patternConfig) {
    if (!patternConfig.pattern || !patternConfig.pattern.colors) {
      return this.getDefaultPattern();
    }

    const colors = patternConfig.pattern.colors;
    
    // Validate background colors
    if (!colors.background || !Array.isArray(colors.background) || colors.background.length < 2) {
      colors.background = ["#4B0082", "#6A0DAD"];
    } else {
      colors.background = colors.background.map(color => this.ensureValidColor(color));
    }
    
    // Validate element colors
    if (!colors.elements || !Array.isArray(colors.elements) || colors.elements.length < 1) {
      colors.elements = ["#FFFFFF"];
    } else {
      colors.elements = colors.elements.map(color => this.ensureValidColor(color));
    }
    
    return patternConfig;
  }

  /**
   * Ensure a color string is a valid CSS hex color
   * @param {string} color - Color value to validate
   * @returns {string} - Valid hex color
   */
  ensureValidColor(color) {
    // Check if the color is already a valid hex color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      return color;
    }
    
    // Try to convert known color names to hex
    const colorMap = {
      'red': '#FF0000',
      'green': '#008000',
      'blue': '#0000FF',
      'yellow': '#FFFF00',
      'purple': '#800080',
      'gold': '#FFD700',
      'silver': '#C0C0C0',
      'black': '#000000',
      'white': '#FFFFFF',
      'gray': '#808080',
      'pink': '#FFC0CB',
      'brown': '#A52A2A',
      'orange': '#FFA500',
      'teal': '#008080',
      'navy': '#000080',
      'maroon': '#800000',
      'coral': '#FF7F50',
      'lime': '#00FF00',
      'dark gold': '#B8860B',
      'dark blue': '#00008B',
      'dark purple': '#301934',
      'turquoise': '#40E0D0',
      'indigo': '#4B0082',
      'violet': '#8A2BE2',
      'magenta': '#FF00FF',
      'cyan': '#00FFFF'
    };
    
    // Check if the color name exists in our map
    const lowerColor = color.toLowerCase();
    if (colorMap[lowerColor]) {
      return colorMap[lowerColor];
    }
    
    // Generate a random color based on the style mood (as fallback)
    const moodColorMap = {
      'luxurious': ['#4B0082', '#6A0DAD', '#8A2BE2', '#800080'],
      'modern': ['#2980b9', '#3498db', '#7f8c8d', '#95a5a6'],
      'playful': ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db'],
      'elegant': ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6'],
      'vintage': ['#c0392b', '#d35400', '#e67e22', '#f39c12'],
      'minimalist': ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6']
    };
    
    // Default colors for any mood
    const defaultColors = ['#4B0082', '#6A0DAD', '#8A2BE2', '#800080'];
    
    // Get colors array for the current mood or use default
    const moodColors = moodColorMap[this.currentMood] || defaultColors;
    
    // Return a random color from the mood colors array
    return moodColors[Math.floor(Math.random() * moodColors.length)];
  }

  /**
   * Get default pattern configuration
   * @returns {Object} - Default pattern configuration
   */
  getDefaultPattern() {
    return {
      pattern: {
        type: "geometric",
        elements: [
          {
            shape: "circle",
            count: 20,
            size: { min: 5, max: 15 },
            opacity: 0.1,
            distribution: "random"
          }
        ],
        colors: {
          background: ["#4B0082", "#6A0DAD"],
          elements: ["#FFFFFF"]
        }
      }
    };
  }

  /**
   * Apply background with generated pattern
   * @param {Object} bgConfig - Background configuration
   * @param {Object} style - Design style preferences
   */
  async applyBackground(bgConfig, style) {
    // Get pattern suggestions from LLM
    const patternConfig = await this.generateBackgroundPattern(style);
    
    // Use contrasting colors
    const colors = patternConfig.pattern.colors;
    
    // Make sure background is not too dark if text is dark
    if (this.isColorDark(colors.background[0]) && this.isColorDark(colors.background[1])) {
      if (style.mood === 'luxury' || style.mood === 'elegant') {
        // For luxury, use a gradient from black to dark gold
        colors.background = ["#000000", "#2C2415"];
      } else {
        // For other styles, lighten the background
        colors.background = this.lightifyColors(colors.background);
      }
    }
    
    // Apply base gradient background
    const gradient = new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: 0,
        y1: 0,
        x2: this.canvas.width,
        y2: this.canvas.height
      },
      colorStops: [
        { offset: 0, color: colors.background[0] },
        { offset: 1, color: colors.background[1] }
      ]
    });

    const background = new fabric.Rect({
      left: 0,
      top: 0,
      width: this.canvas.width,
      height: this.canvas.height,
      fill: gradient,
      selectable: false
    });
    this.canvas.add(background);
    background.sendToBack();
    
    // Add vignette effect for depth
    const vignette = new fabric.Rect({
      left: 0,
      top: 0,
      width: this.canvas.width,
      height: this.canvas.height,
      fill: new fabric.Gradient({
        type: 'radial',
        coords: {
          x1: this.canvas.width / 2,
          y1: this.canvas.height / 2,
          r1: Math.min(this.canvas.width, this.canvas.height) * 0.8,
          x2: this.canvas.width / 2,
          y2: this.canvas.height / 2,
          r2: Math.max(this.canvas.width, this.canvas.height)
        },
        colorStops: [
          { offset: 0, color: 'rgba(0,0,0,0)' },
          { offset: 1, color: 'rgba(0,0,0,0.4)' }
        ]
      }),
      selectable: false
    });
    this.canvas.add(vignette);
    vignette.sendToBack();
    background.sendToBack();
    
    // Add texture overlay pattern - more pronounced
    this.addTextureOverlay(colors);
    
    // Apply pattern elements
    this.addPatternElements(patternConfig);
  }
  
  /**
   * Add texture overlay to background
   * @param {Object} colors - Color configuration
   */
  addTextureOverlay(colors) {
    // Create noise texture
    const patternSize = 250;
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    const ctx = patternCanvas.getContext('2d');
    
    // Fill with semi-transparent base color
    ctx.fillStyle = this.hexToRgba(colors.background[0], 0.1);
    ctx.fillRect(0, 0, patternSize, patternSize);
    
    // Add noise
    for (let i = 0; i < patternSize * patternSize / 20; i++) {
      const x = Math.random() * patternSize;
      const y = Math.random() * patternSize;
      const size = Math.random() * 2 + 1;
      const opacity = Math.random() * 0.1 + 0.05;
      
      ctx.fillStyle = this.hexToRgba(colors.elements[0] || '#FFFFFF', opacity);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add diagonal lines
    ctx.strokeStyle = this.hexToRgba(colors.elements[0] || '#FFFFFF', 0.05);
    ctx.lineWidth = 1;
    
    for (let i = 0; i < patternSize / 15; i++) {
      const spacing = i * 15;
      ctx.beginPath();
      ctx.moveTo(0, spacing);
      ctx.lineTo(spacing, 0);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(patternSize, spacing);
      ctx.lineTo(spacing, patternSize);
      ctx.stroke();
    }
    
    // Create pattern and apply to canvas
    const pattern = new fabric.Pattern({
      source: patternCanvas,
      repeat: 'repeat'
    });
    
    const textureOverlay = new fabric.Rect({
      left: 0,
      top: 0,
      width: this.canvas.width,
      height: this.canvas.height,
      fill: pattern,
      opacity: 0.8,
      selectable: false
    });
    
    this.canvas.add(textureOverlay);
    textureOverlay.sendToBack();
  }
  
  /**
   * Add pattern elements to background
   * @param {Object} patternConfig - Pattern configuration
   */
  addPatternElements(patternConfig) {
    patternConfig.pattern.elements.forEach(element => {
      // Increase element count for more texture
      const count = element.count * 1.5;
      
      for (let i = 0; i < count; i++) {
        let shape;
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        const size = element.size.min + Math.random() * (element.size.max - element.size.min);
        
        switch (element.shape) {
          case 'circle':
            shape = new fabric.Circle({
              left: x,
              top: y,
              radius: size / 2,
              fill: patternConfig.pattern.colors.elements[0],
              opacity: element.opacity * 1.5, // Increase opacity for visibility
              selectable: false
            });
            break;
          case 'rectangle':
            shape = new fabric.Rect({
              left: x,
              top: y,
              width: size,
              height: size * (0.5 + Math.random() * 1),
              fill: patternConfig.pattern.colors.elements[0],
              opacity: element.opacity * 1.5,
              selectable: false,
              angle: Math.random() * 45
            });
            break;
          case 'wave':
            const path = this.generateWavePath(this.canvas.width/4, 50);
            shape = new fabric.Path(path, {
              left: x,
              top: y,
              fill: 'transparent',
              stroke: patternConfig.pattern.colors.elements[0],
              strokeWidth: 2,
              opacity: element.opacity * 1.5,
              selectable: false
            });
            break;
          case 'line':
            shape = new fabric.Line([0, 0, size * 2, 0], {
              left: x,
              top: y, 
              stroke: patternConfig.pattern.colors.elements[0],
              strokeWidth: Math.random() * 2 + 1,
              opacity: element.opacity * 1.5,
              selectable: false,
              angle: Math.random() * 180
            });
            break;
        }
        
        if (shape) {
          this.canvas.add(shape);
          shape.sendToBack();
        }
      }
    });
  }
  
  /**
   * Check if a color is dark
   * @param {string} hexColor - Hex color
   * @returns {boolean} - True if color is dark
   */
  isColorDark(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // Calculate perceived brightness using YIQ formula
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // YIQ < 128 is considered dark
    return yiq < 128;
  }
  
  /**
   * Convert hex color to rgba
   * @param {string} hex - Hex color
   * @param {number} alpha - Alpha value
   * @returns {string} - RGBA color
   */
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  /**
   * Generate wave path for background pattern
   * @param {number} width - Wave width
   * @param {number} height - Wave height
   * @returns {string} - SVG path for wave
   */
  generateWavePath(width, height) {
    return `M 0 ${height/2} 
            Q ${width/4} 0, ${width/2} ${height/2} 
            T ${width} ${height/2}`;
  }
  
  /**
   * Lightify dark colors
   * @param {Array} colors - Array of hex colors
   * @returns {Array} - Lightified colors
   */
  lightifyColors(colors) {
    return colors.map(color => {
      // Convert hex to RGB
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      
      // Lighten by 40%
      const newR = Math.min(255, r + 102);
      const newG = Math.min(255, g + 102);
      const newB = Math.min(255, b + 102);
      
      // Convert back to hex
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    });
  }

  /**
   * Apply product image to canvas
   * @param {HTMLImageElement} image - Processed image
   * @param {Object} imageConfig - Image area configuration
   */
  applyProductImage(image, imageConfig) {
    try {
      console.log("Applying product image", image, imageConfig);
      
      // Scale image while maintaining aspect ratio
      let scale;
      const maxSize = Math.min(this.canvas.width, this.canvas.height) * 0.6; // Increased from 0.4
      
      if (image.width > image.height) {
        scale = maxSize / image.width;
      } else {
        scale = maxSize / image.height;
      }
      
      // Create fabric image object
      const imgInstance = new fabric.Image(image, {
        left: this.canvas.width * parseFloat(imageConfig.position.x) / 100,
        top: this.canvas.height * parseFloat(imageConfig.position.y) / 100,
        scaleX: scale,
        scaleY: scale,
        originX: 'center',
        originY: 'center',
        selectable: false
      });
      
      console.log("Image instance created:", imgInstance);
      
      // Apply mask based on configuration
      if (imageConfig.mask === 'circle') {
        const radius = Math.min(image.width, image.height) * scale / 2;
        const clipPath = new fabric.Circle({
          radius: radius,
          originX: 'center',
          originY: 'center'
        });
        imgInstance.clipPath = clipPath;
        
        // Add glow effect
        const glowCircle = new fabric.Circle({
          radius: radius + 10,
          left: imgInstance.left,
          top: imgInstance.top,
          fill: 'transparent',
          stroke: '#FFFFFF',
          strokeWidth: 5,
          opacity: 0.3,
          originX: 'center',
          originY: 'center',
          selectable: false
        });
        this.canvas.add(glowCircle);
      } else if (imageConfig.mask === 'rectangle') {
        const cornerRadius = 20;
        const clipPath = new fabric.Rect({
          width: image.width * scale,
          height: image.height * scale,
          rx: cornerRadius,
          ry: cornerRadius,
          originX: 'center',
          originY: 'center'
        });
        imgInstance.clipPath = clipPath;
      }
      
      // Add to canvas and bring to front
      this.canvas.add(imgInstance);
      imgInstance.bringToFront();
      
      console.log("Image added to canvas");
      return true;
    } catch (error) {
      console.error("Error in applyProductImage:", error);
      return false;
    }
  }

  /**
   * Create text element on canvas
   * @param {Object} config - Text element configuration
   * @returns {fabric.Text} - Created text object
   */
  createTextElement(config) {
    // Parse position
    const left = typeof config.left === 'string' 
      ? this.canvas.width * parseFloat(config.left) / 100 
      : config.left;
      
    const top = typeof config.top === 'string' 
      ? this.canvas.height * parseFloat(config.top) / 100 
      : config.top;
    
    // Create text object
    const textObj = new fabric.Textbox(config.text || '', {
      left: left,
      top: top,
      width: config.width || config.maxWidth || 400,
      fontSize: config.fontSize || 24,
      fontFamily: config.fontFamily || 'Montserrat',
      fontWeight: config.fontWeight || 'normal',
      fontStyle: config.fontStyle || 'normal',
      fill: config.fill || '#000000',
      lineHeight: config.lineHeight || 1.2,
      textAlign: config.textAlign || 'left',
      selectable: false
    });
    
    // Adjust origin for centered elements
    if (config.centered) {
      textObj.set({
        originX: 'center',
        originY: 'center',
        textAlign: 'center'
      });
    }
    
    // Add text stroke outline for better readability against any background
    if (config.fontSize >= 32) {
      textObj.set({
        strokeWidth: 0.5,
        stroke: this.isColorDark(config.fill) ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
      });
    }
    
    // Add shadow for larger text
    if (config.fontSize >= 48) {
      textObj.set({
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.5)',
          blur: 10,
          offsetX: 5,
          offsetY: 5
        })
      });
    }
    
    // Add background for text if specified
    if (config.withBackground) {
      const padding = 15;
      const heightMultiplier = config.text.split('\n').length;
      const bgHeight = textObj.height + padding * 2;
      
      const textBg = new fabric.Rect({
        left: textObj.left - padding,
        top: textObj.top - padding/2,
        width: textObj.width + padding * 2,
        height: bgHeight,
        fill: config.backgroundColor || 'rgba(0,0,0,0.5)', // Darker background for better contrast
        rx: 4,
        ry: 4,
        selectable: false
      });
      
      this.canvas.add(textBg);
      textBg.bringToFront();
    }
    
    this.canvas.add(textObj);
    textObj.bringToFront();
    return textObj;
  }

  /**
   * Create button element on canvas
   * @param {Object} config - Button configuration
   */
  createButton(config) {
    // Parse position
    const left = typeof config.left === 'string' 
      ? this.canvas.width * parseFloat(config.left) / 100 
      : config.left;
      
    const top = typeof config.top === 'string' 
      ? this.canvas.height * parseFloat(config.top) / 100 
      : config.top;
    
    // Create button background
    const buttonBg = new fabric.Rect({
      left: left,
      top: top,
      width: config.width || 180,
      height: config.height || 56,
      fill: config.fill || '#4B0082',
      rx: config.borderRadius || 28,
      ry: config.borderRadius || 28,
      selectable: false,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.4)',
        blur: 8,
        offsetX: 3,
        offsetY: 3
      })
    });
    
    // Adjust origin for centered buttons
    if (config.centered) {
      buttonBg.set({
        originX: 'center',
        originY: 'center'
      });
    }
    
    // Add highlight effect (subtle gradient)
    const highlight = new fabric.Rect({
      left: buttonBg.left,
      top: buttonBg.top,
      width: buttonBg.width,
      height: buttonBg.height / 2,
      rx: buttonBg.rx,
      ry: buttonBg.ry,
      fill: 'rgba(255,255,255,0.2)',
      selectable: false
    });
    
    // Create button text
    const buttonText = new fabric.Text(config.text || 'LEARN MORE', {
      left: buttonBg.left + buttonBg.width/2,
      top: buttonBg.top + buttonBg.height/2,
      fontSize: config.fontSize || 18,
      fontFamily: config.fontFamily || 'Montserrat',
      fontWeight: 'bold',
      fill: config.textColor || '#FFFFFF',
      originX: 'center',
      originY: 'center',
      selectable: false,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.3)',
        blur: 2,
        offsetX: 1,
        offsetY: 1
      })
    });
    
    // Add subtle border
    const border = new fabric.Rect({
      left: buttonBg.left - 1,
      top: buttonBg.top - 1,
      width: buttonBg.width + 2,
      height: buttonBg.height + 2,
      rx: buttonBg.rx + 1,
      ry: buttonBg.ry + 1,
      fill: 'transparent',
      stroke: 'rgba(255,255,255,0.5)',
      strokeWidth: 1,
      selectable: false
    });
    
    this.canvas.add(border);
    this.canvas.add(buttonBg);
    this.canvas.add(highlight);
    this.canvas.add(buttonText);
    
    // Ensure all button elements are at the front
    border.bringToFront();
    buttonBg.bringToFront();
    highlight.bringToFront();
    buttonText.bringToFront();
  }

  /**
   * Apply content elements to canvas
   * @param {Object} contentArea - Content area configuration
   * @param {Object} content - Generated content
   */
  applyContent(contentArea, content) {
    const { elements } = contentArea;
    
    elements.forEach(element => {
      // Ensure text is a string
      let text = '';
      switch(element.type) {
        case 'label':
          text = String(content.topLabel || 'FEATURED');
          break;
        case 'heading':
          text = String(content.mainHeading || 'Premium Quality');
          break;
        case 'description':
          text = String(content.description || 'Experience excellence in every detail');
          break;
        case 'tagline':
          text = String(content.tagline || 'Elevate Your Style');
          break;
        default:
          text = '';
      }
      
      switch(element.type) {
        case 'label':
        case 'heading':
        case 'description':
        case 'tagline':
          this.createTextElement({
            text: text,
            left: this.canvas.width * parseFloat(contentArea.position.x) / 100 + 
                 this.canvas.width * parseFloat(element.position.x) / 100,
            top: this.canvas.height * parseFloat(contentArea.position.y) / 100 + 
                 this.canvas.height * parseFloat(element.position.y) / 100,
            width: this.canvas.width * parseFloat(contentArea.width) / 100,
            ...element.style,
            fontFamily: content.design.style.mood === 'luxurious' ? 'Playfair Display' : 'Montserrat',
            fill: content.design.colors.text
          });
          break;
        case 'cta':
          this.createButton({
            text: content.ctaText || 'LEARN MORE',
            left: this.canvas.width * parseFloat(contentArea.position.x) / 100 + 
                 this.canvas.width * parseFloat(element.position.x) / 100,
            top: this.canvas.height * parseFloat(contentArea.position.y) / 100 + 
                 this.canvas.height * parseFloat(element.position.y) / 100,
            ...element.style,
            fill: content.design.colors.secondary,
            textColor: content.design.colors.primary
          });
          break;
      }
    });
  }

  /**
   * Apply layout to canvas
   * @param {Object} layout - Layout configuration
   * @param {Object} content - Generated content
   * @param {HTMLImageElement} image - Processed image
   */
  async applyLayout(layout, content, image) {
    // Clear canvas
    this.canvas.clear();
    
    // Set canvas dimensions
    this.canvas.setWidth(layout.canvas.width);
    this.canvas.setHeight(layout.canvas.height);
    
    // Apply background
    await this.applyBackground(layout.background, content.design.style);
    
    // Apply image
    if (image) {
      this.applyProductImage(image, layout.imageArea);
    }
    
    // Apply content
    this.applyContent(layout.contentArea, content);
    
    // Render canvas
    this.canvas.renderAll();
  }

  /**
   * Generate banner from image and prompt
   * @param {File} imageFile - Uploaded image file
   * @param {string} prompt - User prompt
   * @param {string} layoutName - Layout template name
   * @returns {Promise<boolean>} - Success status
   */
  async generateBanner(imageFile, prompt, layoutName) {
    try {
      console.log("Starting banner generation:", { 
        hasImage: !!imageFile, 
        prompt: prompt, 
        layout: layoutName 
      });
      
      // Process input validation
      if (!prompt || prompt.trim() === '') {
        throw new Error('No prompt provided');
      }
      
      // Process image if provided
      let processedImage = null;
      if (imageFile) {
        console.log("Processing image...");
        try {
          processedImage = await this.processImage(imageFile);
          console.log("Image processed successfully");
        } catch (imgError) {
          console.error("Error processing image:", imgError);
          // Continue without image if processing fails
        }
      }
      
      // Generate content using LLM
      console.log("Generating content...");
      const content = await this.generateContent(prompt);
      console.log("Content generated:", content);
      
      // Store current mood for color fallbacks
      this.currentMood = content.design.style.mood || 'modern';
      
      // Get layout template
      const layout = this.model.getLayout(layoutName);
      console.log("Using layout:", layoutName);
      
      // Force a small delay to ensure everything is loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Apply layout to canvas
      console.log("Applying layout...");
      await this.applyLayout(layout, content, processedImage);
      
      return true;
    } catch (error) {
      console.error('Error generating banner:', error);
      return false;
    }
  }

  /**
   * Download banner as PNG
   * @param {string} filename - Output filename
   * @returns {boolean} - Success status
   */
  downloadBanner(filename = 'banner.png') {
    try {
      if (!this.canvas) {
        return false;
      }
      
      const dataUrl = this.canvas.toDataURL({
        format: 'png',
        quality: 1
      });
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
      
      return true;
    } catch (error) {
      console.error('Error downloading banner:', error);
      return false;
    }
  }
} 