/**
 * AI Banner Generator - Main Application
 */
import { BannerModel } from './models/BannerModel.js';
import { BannerContext } from './contexts/BannerContext.js';
import { BannerProtocol } from './protocols/BannerProtocol.js';
import { BannerUI } from './ui/BannerUI.js';

/**
 * Initialize application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Create folder structure if it doesn't exist
    await ensureFolderStructure();
    
    // Create MCP components
    const model = new BannerModel();
    const context = new BannerContext(model);
    const protocol = new BannerProtocol(context);
    const ui = new BannerUI(protocol);
    
    // Initialize components
    await protocol.initialize('bannerCanvas');
    ui.initialize();
    
    console.log('Banner Generator initialized successfully');
  } catch (error) {
    console.error('Error initializing Banner Generator:', error);
    showFatalError('Failed to initialize application. Please refresh the page and try again.');
  }
});

/**
 * Ensure the necessary folder structure exists
 */
async function ensureFolderStructure() {
  // Add favicon to prevent 404 errors
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.href = 'data:;base64,iVBORw0KGgo='; // Minimal empty favicon
  document.head.appendChild(favicon);
  
  // Add required font imports
  await loadFonts();
}

/**
 * Load required fonts
 */
async function loadFonts() {
  // Add Google Fonts link
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display:wght@400;700&display=swap';
  document.head.appendChild(fontLink);
  
  return new Promise(resolve => {
    // Give fonts time to load
    setTimeout(resolve, 100);
  });
}

/**
 * Show fatal error message
 * @param {string} message - Error message
 */
function showFatalError(message) {
  const errorElement = document.createElement('div');
  errorElement.style.position = 'fixed';
  errorElement.style.top = '0';
  errorElement.style.left = '0';
  errorElement.style.width = '100%';
  errorElement.style.padding = '20px';
  errorElement.style.backgroundColor = '#f44336';
  errorElement.style.color = 'white';
  errorElement.style.textAlign = 'center';
  errorElement.style.zIndex = '9999';
  errorElement.textContent = message;
  
  document.body.appendChild(errorElement);
} 