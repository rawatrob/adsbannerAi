# AI Banner Generator

A powerful web application that allows users to create customized promotional banners leveraging AI-generated content and dynamic layouts.

![Banner Generator Preview](./screenshots/preview.png)

## Features

- **AI-Powered Content Generation**: Generate creative copy for your banners using advanced language models
- **Multiple Layout Templates**: Choose from a variety of professional layouts including:
  - Modern Agency
  - Minimal Product
  - Vibrant Retail
- **Dynamic Styling**: Automatic color schemes and typography based on product context
- **Image Integration**: Upload and incorporate product images with intelligent placement
- **Background Generation**: AI-generated patterns and backgrounds that complement your content
- **Responsive Design**: Banner adapts to different screen sizes while maintaining visual appeal

## Examples

### Travel Promotion Banner
![Travel Banner](./screenshots/travel_banner.png)
*Discover Paradise vacation promotion with price point and limited-time offer*

### Food Promotion Banner
![Food Banner](./screenshots/food_banner.png)
*Restaurant promotion featuring appetizing food imagery with bold typography*

### Product Showcase Banner
![Product Banner](./screenshots/product_banner.png)
*Clean, minimal product showcase with person image and call-to-action*

### Lifestyle Product Banner
![Lifestyle Banner](./screenshots/lifestyle_banner.png)
*Lifestyle product promotion with gradient background and clear messaging*

## Technical Architecture

The application follows a modular architecture:

- **BannerContext**: Core business logic for banner generation
- **BannerModel**: Data structures defining layouts and styles
- **BannerUI**: User interface components and interaction handling
- **BannerProtocol**: Communication layer between components

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/banner-generator.git
cd banner-generator
```

2. Configure API key (optional, for AI content generation)
```bash
# Create a .env file in the root directory
echo "OPENAI_API_KEY=your_api_key_here" > .env
```

3. Open `index.html` in your browser or use a local server
```bash
# Using Python's built-in server
python -m http.server
```

4. Upload an image, enter a product description, select a layout, and generate your banner!

## Configuration

You can customize the available layouts by modifying the `themes.js` file. Each layout template defines:

- Canvas dimensions
- Content positioning
- Image placement and masking
- Background layers
- Typography and spacing

## API Key Setup

To enable AI-generated content:

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Create a `.env` file in the project root
3. Add your API key: `OPENAI_API_KEY=your_api_key_here`

Note: If no API key is provided, the application will use predefined fallback content instead of generating new content.

## Screenshot Setup for GitHub

**Note for Repository Setup:**
1. Before pushing to GitHub, replace the placeholder files in the `screenshots` directory with the actual banner images shown in this README
2. Ensure each image is properly named to match the references in this document:
   - `preview.png` - Main application interface
   - `travel_banner.png` - Travel promotion example
   - `food_banner.png` - Food promotion example
   - `product_banner.png` - Product showcase example
   - `lifestyle_banner.png` - Lifestyle product example

## License

MIT

## Acknowledgements

- Uses [Fabric.js](http://fabricjs.com/) for canvas manipulation
- AI content generation powered by OpenAI's GPT models 