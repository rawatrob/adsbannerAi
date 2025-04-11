/**
 * Banner UI - Handles user interface interactions
 */
export class BannerUI {
  constructor(protocol) {
    this.protocol = protocol;
    
    // DOM elements
    this.imageInput = document.getElementById('productImage');
    this.imagePreview = document.getElementById('imagePreview');
    this.promptInput = document.getElementById('productDescription');
    this.layoutSelect = document.getElementById('layoutStyle');
    this.generateBtn = document.getElementById('generateBtn');
    this.downloadBtn = document.getElementById('downloadBtn');
    this.errorMessage = document.getElementById('errorMessage');
    this.loadingOverlay = document.getElementById('loadingOverlay');
  }

  /**
   * Initialize UI event listeners
   */
  initialize() {
    // Set up image preview
    this.imageInput.addEventListener('change', this.handleImageChange.bind(this));
    
    // Set up layout options
    this.populateLayoutOptions();
    
    // Set up button event listeners
    this.generateBtn.addEventListener('click', this.handleGenerateClick.bind(this));
    this.downloadBtn.addEventListener('click', this.handleDownloadClick.bind(this));
  }

  /**
   * Handle image input change
   * @param {Event} event - Input change event
   */
  handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.src = e.target.result;
        this.imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview.style.display = 'none';
    }
  }

  /**
   * Populate layout dropdown options
   */
  populateLayoutOptions() {
    // Get available layouts from protocol
    const layouts = this.protocol.getAvailableLayouts();
    const defaultLayout = this.protocol.getDefaultLayout();
    
    // Clear existing options
    this.layoutSelect.innerHTML = '';
    
    // Add options
    layouts.forEach(layout => {
      const option = document.createElement('option');
      option.value = layout;
      option.textContent = this.formatLayoutName(layout);
      this.layoutSelect.appendChild(option);
    });
    
    // Set default layout
    this.layoutSelect.value = defaultLayout;
  }

  /**
   * Format layout name for display
   * @param {string} name - Layout name in camelCase
   * @returns {string} - Formatted name
   */
  formatLayoutName(name) {
    return name
      // Convert camelCase to space-separated
      .replace(/([A-Z])/g, ' $1')
      // Capitalize first letter
      .replace(/^./, str => str.toUpperCase());
  }

  /**
   * Handle generate button click
   */
  async handleGenerateClick() {
    try {
      // Show loading indicator
      this.showLoading(true);
      this.hideError();
      
      // Get input values
      const imageFile = this.imageInput.files[0];
      const prompt = this.promptInput.value;
      const layoutName = this.layoutSelect.value;
      
      // Generate banner
      const success = await this.protocol.generateBanner(imageFile, prompt, layoutName);
      
      if (success) {
        // Enable download button
        this.downloadBtn.disabled = false;
      } else {
        this.showError('Failed to generate banner. Please try again.');
      }
    } catch (error) {
      // Handle errors
      this.showError(this.protocol.handleError(error));
    } finally {
      // Hide loading indicator
      this.showLoading(false);
    }
  }

  /**
   * Handle download button click
   */
  handleDownloadClick() {
    try {
      const filename = `banner-${Date.now()}.png`;
      const success = this.protocol.downloadBanner(filename);
      
      if (!success) {
        this.showError('Failed to download banner. Please try again.');
      }
    } catch (error) {
      this.showError('Error downloading banner: ' + error.message);
    }
  }

  /**
   * Show loading indicator
   * @param {boolean} isLoading - Loading state
   */
  showLoading(isLoading) {
    this.loadingOverlay.style.display = isLoading ? 'flex' : 'none';
    this.generateBtn.disabled = isLoading;
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = 'block';
  }

  /**
   * Hide error message
   */
  hideError() {
    this.errorMessage.style.display = 'none';
  }
} 