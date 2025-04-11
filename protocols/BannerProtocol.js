/**
 * Banner Protocol - Interface between context and UI layer
 */
export class BannerProtocol {
  constructor(context) {
    this.context = context;
  }

  /**
   * Initialize the banner generator
   * @param {string} canvasId - Canvas element ID
   * @returns {Promise<boolean>} - Success status
   */
  async initialize(canvasId) {
    try {
      await this.context.initialize(canvasId);
      return true;
    } catch (error) {
      console.error('Error initializing banner generator:', error);
      return false;
    }
  }

  /**
   * Generate banner with provided image, prompt, and layout
   * @param {File} imageFile - Uploaded image file
   * @param {string} prompt - User prompt for content generation
   * @param {string} layoutName - Layout template name
   * @returns {Promise<boolean>} - Success status
   */
  async generateBanner(imageFile, prompt, layoutName) {
    try {
      // Validate inputs
      if (!prompt || prompt.trim() === '') {
        throw new Error('Please enter a product description');
      }

      // Generate banner using context
      const success = await this.context.generateBanner(imageFile, prompt, layoutName);
      
      return success;
    } catch (error) {
      console.error('Error in banner generation:', error);
      throw error; // Propagate error to UI layer
    }
  }

  /**
   * Download generated banner
   * @param {string} filename - Output filename
   * @returns {boolean} - Success status
   */
  downloadBanner(filename = 'banner.png') {
    return this.context.downloadBanner(filename);
  }

  /**
   * Get available layout names
   * @returns {Array<string>} - Array of layout names
   */
  getAvailableLayouts() {
    return Object.keys(this.context.model.layouts);
  }

  /**
   * Get default layout name
   * @returns {string} - Default layout name
   */
  getDefaultLayout() {
    return 'modernAgency';
  }

  /**
   * Handle errors from banner generation
   * @param {Error} error - Error object
   * @returns {string} - User-friendly error message
   */
  handleError(error) {
    let errorMessage = 'An unexpected error occurred.';
    
    if (error.message.includes('No prompt provided')) {
      errorMessage = 'Please enter a product description.';
    } else if (error.message.includes('Failed to load image')) {
      errorMessage = 'Unable to load the provided image. Please try another image.';
    } else if (error.message.includes('API request failed')) {
      errorMessage = 'Unable to connect to the AI service. Please try again later.';
    }
    
    return errorMessage;
  }
} 