// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all beds
async function fetchBeds() {
  try {
    const response = await fetch(`${API_BASE_URL}/beds`);
    if (!response.ok) throw new Error('Failed to fetch beds');
    return await response.json();
  } catch (error) {
    console.error('Error fetching beds:', error);
    showAlert('Failed to load beds', 'error');
    return [];
  }
}

// Admit patient to a bed
async function admitPatient(bedId, patientData) {
  try {
    const response = await fetch(`${API_BASE_URL}/beds/${bedId}/admit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) throw new Error('Failed to admit patient');
    const result = await response.json();
    showAlert('✓ Patient admitted successfully', 'success');
    return result;
  } catch (error) {
    console.error('Error admitting patient:', error);
    showAlert('✗ Failed to admit patient', 'error');
    throw error;
  }
}

// Discharge patient from a bed
async function dischargePatient(bedId) {
  try {
    const response = await fetch(`${API_BASE_URL}/beds/${bedId}/discharge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to discharge patient');
    const result = await response.json();
    showAlert('✓ Patient discharged successfully', 'success');
    return result;
  } catch (error) {
    console.error('Error discharging patient:', error);
    showAlert('✗ Failed to discharge patient', 'error');
    throw error;
  }
}

// Transfer patient to another bed
async function transferPatient(fromBedId, toBedId, transferData) {
  try {
    const response = await fetch(`${API_BASE_URL}/beds/${fromBedId}/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toBedId: toBedId,
        ...transferData,
      }),
    });

    if (!response.ok) throw new Error('Failed to transfer patient');
    const result = await response.json();
    showAlert('✓ Patient transferred successfully', 'success');
    return result;
  } catch (error) {
    console.error('Error transferring patient:', error);
    showAlert('✗ Failed to transfer patient', 'error');
    throw error;
  }
}

// Get single bed details
async function getBedDetails(bedId) {
  try {
    const response = await fetch(`${API_BASE_URL}/beds/${bedId}`);
    if (!response.ok) throw new Error('Failed to fetch bed details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching bed details:', error);
    return null;
  }
}

// Show alert message
function showAlert(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert ${type}`;
  alert.textContent = message;
  
  const container = document.querySelector('.main-content');
  container.insertBefore(alert, container.firstChild);
  
  setTimeout(() => alert.remove(), 3000);
}