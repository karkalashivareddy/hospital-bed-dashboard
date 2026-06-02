// Main initialization file
console.log('🏥 Hospital Bed Management System Initialized');

// Check API connectivity
async function checkAPIConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/beds`, { method: 'HEAD' });
    if (response.ok) {
      console.log('✓ API connection successful');
    }
  } catch (error) {
    console.error('✗ API connection failed:', error);
    showAlert('⚠️ Cannot connect to server. Please ensure the backend is running on port 5000.', 'error');
  }
}

// Wait for DOM to load before checking API
document.addEventListener('DOMContentLoaded', checkAPIConnection);