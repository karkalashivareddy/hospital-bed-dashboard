// Global state
let allBeds = [];
let currentFilters = {
  ward: 'all',
  status: 'all',
};

// DOM Elements
const bedsGrid = document.getElementById('bedsGrid');
const wardFilter = document.getElementById('wardFilter');
const statusFilter = document.getElementById('statusFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const refreshBtn = document.getElementById('refreshBtn');
const lastUpdateEl = document.getElementById('lastUpdate');
const detailsSidebar = document.getElementById('detailsSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const admitModal = document.getElementById('admitModal');
const transferModal = document.getElementById('transferModal');
const admitForm = document.getElementById('admitForm');
const transferForm = document.getElementById('transferForm');

// Event Listeners
wardFilter.addEventListener('change', applyFilters);
statusFilter.addEventListener('change', applyFilters);
clearFiltersBtn.addEventListener('click', clearFilters);
refreshBtn.addEventListener('click', refreshData);
closeSidebarBtn.addEventListener('click', closeSidebar);
admitForm.addEventListener('submit', handleAdmit);
transferForm.addEventListener('submit', handleTransfer);

// Render beds grid
function renderBeds(beds) {
  if (beds.length === 0) {
    bedsGrid.innerHTML = '<div class="loading">No beds found matching filters</div>';
    return;
  }

  bedsGrid.innerHTML = beds.map(bed => `
    <div class="bed-card ${bed.status}" data-bed-id="${bed.id}">
      <div class="bed-number">${bed.bedNumber}</div>
      <div class="bed-ward">${bed.ward}</div>
      <span class="bed-status ${bed.status}">${bed.status}</span>
      ${bed.patientName ? `<div class="bed-patient">👤 ${bed.patientName}</div>` : ''}
    </div>
  `).join('');

  // Add click listeners to bed cards
  document.querySelectorAll('.bed-card').forEach(card => {
    card.addEventListener('click', () => showBedDetails(card.dataset.bedId));
  });
}

// Show bed details in sidebar
async function showBedDetails(bedId) {
  const bed = allBeds.find(b => b.id === bedId);
  if (!bed) return;

  const detailsContent = document.getElementById('bedDetailsContent');
  
  let html = `
    <div class="detail-item">
      <div class="detail-label">Bed Number</div>
      <div class="detail-value">${bed.bedNumber}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">Ward</div>
      <div class="detail-value">${bed.ward}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">Status</div>
      <div class="detail-value"><span class="bed-status ${bed.status}">${bed.status}</span></div>
    </div>
  `;

  if (bed.status === 'occupied') {
    html += `
      <div class="detail-item">
        <div class="detail-label">Patient Name</div>
        <div class="detail-value">${bed.patientName || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Patient ID</div>
        <div class="detail-value">${bed.patientId || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Assigned Doctor</div>
        <div class="detail-value">${bed.doctor || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Admitted Date</div>
        <div class="detail-value">${bed.admittedDate ? new Date(bed.admittedDate).toLocaleDateString() : 'N/A'}</div>
      </div>
    `;
  }

  html += '<div class="sidebar-actions">';

  if (bed.status === 'available') {
    html += `<button class="btn btn-success" onclick="openAdmitModal('${bed.id}', '${bed.bedNumber}')">➕ Admit Patient</button>`;
  } else if (bed.status === 'occupied') {
    html += `
      <button class="btn btn-danger" onclick="handleDischarge('${bed.id}')">➖ Discharge Patient</button>
      <button class="btn btn-primary" onclick="openTransferModal('${bed.id}', '${bed.bedNumber}')">🔄 Transfer Patient</button>
    `;
  }

  html += '</div>';

  detailsContent.innerHTML = html;
  detailsSidebar.classList.add('active');
}

// Close sidebar
function closeSidebar() {
  detailsSidebar.classList.remove('active');
}

// Open admit modal
function openAdmitModal(bedId, bedNumber) {
  document.getElementById('modalBedNumber').textContent = bedNumber;
  admitModal.dataset.bedId = bedId;
  admitForm.reset();
  admitModal.classList.add('active');
}

// Close admit modal
function closeAdmitModal() {
  admitModal.classList.remove('active');
}

// Open transfer modal
function openTransferModal(bedId, bedNumber) {
  document.getElementById('transferBedNumber').textContent = bedNumber;
  transferModal.dataset.bedId = bedId;
  
  // Populate available beds
  const availableBeds = allBeds.filter(b => b.status === 'available');
  const targetBedSelect = document.getElementById('targetBed');
  
  targetBedSelect.innerHTML = '<option value="">Select destination bed</option>' +
    availableBeds.map(b => `<option value="${b.id}">${b.bedNumber} (${b.ward})</option>`).join('');
  
  transferForm.reset();
  transferModal.classList.add('active');
}

// Close transfer modal
function closeTransferModal() {
  transferModal.classList.remove('active');
}

// Handle admit form submission
async function handleAdmit(e) {
  e.preventDefault();
  
  const bedId = admitModal.dataset.bedId;
  const patientData = {
    patientName: document.getElementById('patientName').value,
    patientId: document.getElementById('patientId').value,
    doctor: document.getElementById('doctorName').value,
    admissionReason: document.getElementById('admissionReason').value,
  };

  await admitPatient(bedId, patientData);
  closeAdmitModal();
  await refreshData();
}

// Handle discharge
async function handleDischarge(bedId) {
  if (confirm('Are you sure you want to discharge this patient?')) {
    await dischargePatient(bedId);
    closeSidebar();
    await refreshData();
  }
}

// Handle transfer form submission
async function handleTransfer(e) {
  e.preventDefault();
  
  const fromBedId = transferModal.dataset.bedId;
  const toBedId = document.getElementById('targetBed').value;
  
  if (!toBedId) {
    showAlert('Please select a destination bed', 'error');
    return;
  }

  const transferData = {
    transferReason: document.getElementById('transferReason').value,
  };

  await transferPatient(fromBedId, toBedId, transferData);
  closeTransferModal();
  closeSidebar();
  await refreshData();
}

// Apply filters
function applyFilters() {
  currentFilters.ward = wardFilter.value;
  currentFilters.status = statusFilter.value;

  let filtered = allBeds;

  if (currentFilters.ward !== 'all') {
    filtered = filtered.filter(bed => bed.ward === currentFilters.ward);
  }

  if (currentFilters.status !== 'all') {
    filtered = filtered.filter(bed => bed.status === currentFilters.status);
  }

  renderBeds(filtered);
}

// Clear filters
function clearFilters() {
  wardFilter.value = 'all';
  statusFilter.value = 'all';
  currentFilters = { ward: 'all', status: 'all' };
  renderBeds(allBeds);
}

// Update analytics
function updateAnalytics() {
  const total = allBeds.length;
  const available = allBeds.filter(b => b.status === 'available').length;
  const occupied = allBeds.filter(b => b.status === 'occupied').length;
  const maintenance = allBeds.filter(b => b.status === 'maintenance').length;
  const occupancyRate = total > 0 ? ((occupied / total) * 100).toFixed(1) : 0;

  document.getElementById('totalBeds').textContent = total;
  document.getElementById('availableBeds').textContent = available;
  document.getElementById('occupiedBeds').textContent = occupied;
  document.getElementById('maintenanceBeds').textContent = maintenance;
  document.getElementById('occupancyRate').textContent = `${occupancyRate}%`;

  // Change color based on occupancy
  const occupancyCard = document.querySelector('.stat-card.occupancy');
  if (occupancyRate > 80) {
    occupancyCard.style.borderLeftColor = 'var(--danger-color)';
  } else if (occupancyRate > 60) {
    occupancyCard.style.borderLeftColor = 'var(--warning-color)';
  } else {
    occupancyCard.style.borderLeftColor = 'var(--success-color)';
  }
}

// Refresh data
async function refreshData() {
  allBeds = await fetchBeds();
  updateAnalytics();
  applyFilters();
  
  const now = new Date();
  lastUpdateEl.textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === admitModal) closeAdmitModal();
  if (e.target === transferModal) closeTransferModal();
});

// Initialize
refreshData();
setInterval(refreshData, 30000); // Refresh every 30 seconds