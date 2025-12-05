window.showTab = function(tabName) {
    // Hide all tabs
    document.getElementById('roomsTab').style.display = 'none';
    document.getElementById('tenantsTab').style.display = 'none';
    document.getElementById('paymentsTab').style.display = 'none';
    document.getElementById('maintenanceTab').style.display = 'none';
    
    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    if (tabName === 'rooms') {
        document.getElementById('roomsTab').style.display = 'block';
        tabButtons[0].classList.add('active');
    } else if (tabName === 'tenants') {
        document.getElementById('tenantsTab').style.display = 'block';
        tabButtons[1].classList.add('active');
    } else if (tabName === 'payments') {
        document.getElementById('paymentsTab').style.display = 'block';
        tabButtons[2].classList.add('active');
    } else if (tabName === 'maintenance') {
        document.getElementById('maintenanceTab').style.display = 'block';
        tabButtons[3].classList.add('active');
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Happy Living - Kost Management System Initialized');
});