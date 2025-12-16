import { database } from './firebase-config.js';
import { ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// CREATE - Add new maintenance request
window.createMaintenance = async function() {
    const room = document.getElementById('maintenanceRoom').value;
    const issue = document.getElementById('maintenanceIssue').value;
    const priority = document.getElementById('maintenancePriority').value;
    const status = document.getElementById('maintenanceStatus').value;

    if (!room || !issue) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const maintenanceRef = ref(database, 'maintenance');
        const newMaintenanceRef = push(maintenanceRef);
        
        await set(newMaintenanceRef, {
            room: room,
            issue: issue,
            priority: priority,
            status: status,
            createdAt: new Date().toISOString()
        });

        alert('Maintenance request added successfully!');
        
        // Clear form
        document.getElementById('maintenanceRoom').value = '';
        document.getElementById('maintenanceIssue').value = '';
        document.getElementById('maintenancePriority').value = 'low';
        document.getElementById('maintenanceStatus').value = 'pending';
        
        hideAddMaintenanceForm();
        
    } catch (error) {
        console.error('Error adding maintenance:', error);
        alert('Failed to add maintenance: ' + error.message);
    }
};

// READ - Load all maintenance requests
window.loadMaintenance = function() {
    const maintenanceRef = ref(database, 'maintenance');
    
    onValue(maintenanceRef, (snapshot) => {
        const maintenanceList = document.getElementById('maintenanceList');
        maintenanceList.innerHTML = '';
        
        if (snapshot.exists()) {
            const maintenances = snapshot.val();
            
            Object.keys(maintenances).forEach(key => {
                const maintenance = maintenances[key];
                const statusClass = `status-${maintenance.status}`;
                const priorityClass = `priority-${maintenance.priority}`;
                
                const maintenanceCard = document.createElement('div');
                maintenanceCard.className = 'data-card';
                maintenanceCard.innerHTML = `
                    <h3>Request #${key.substring(0, 8)}</h3>
                    <p><strong>Room:</strong> ${maintenance.room}</p>
                    <p><strong>Issue:</strong> ${maintenance.issue}</p>
                    <p><strong>Priority:</strong> <span class="status-badge ${priorityClass}">${maintenance.priority}</span></p>
                    <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${maintenance.status}</span></p>
                    <p><strong>Created:</strong> ${new Date(maintenance.createdAt).toLocaleDateString()}</p>
                    <div class="card-actions">
                        <button class="btn-edit" onclick='editMaintenanceData("${key}", ${JSON.stringify(maintenance).replace(/'/g, "&apos;")})'>Edit</button>
                        <button class="btn-delete" onclick="deleteMaintenance('${key}')">Delete</button>
                    </div>
                `;
                
                maintenanceList.appendChild(maintenanceCard);
            });
        } else {
            maintenanceList.innerHTML = '<p style="text-align: center; color: #999;">No maintenance requests found. Add your first request!</p>';
        }
    });
};

// UPDATE - Update maintenance request
window.updateMaintenance = async function() {
    const maintenanceKey = document.getElementById('editMaintenanceKey').value;
    const room = document.getElementById('editMaintenanceRoom').value;
    const issue = document.getElementById('editMaintenanceIssue').value;
    const priority = document.getElementById('editMaintenancePriority').value;
    const status = document.getElementById('editMaintenanceStatus').value;

    if (!room || !issue) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const maintenanceRef = ref(database, 'maintenance/' + maintenanceKey);
        
        await update(maintenanceRef, {
            room: room,
            issue: issue,
            priority: priority,
            status: status,
            updatedAt: new Date().toISOString()
        });

        alert('Maintenance request updated successfully!');
        hideEditMaintenanceForm();
        
    } catch (error) {
        console.error('Error updating maintenance:', error);
        alert('Failed to update maintenance: ' + error.message);
    }
};

// DELETE - Delete maintenance request
window.deleteMaintenance = async function(maintenanceKey) {
    if (!confirm('Are you sure you want to delete this maintenance request?')) {
        return;
    }

    try {
        const maintenanceRef = ref(database, 'maintenance/' + maintenanceKey);
        await remove(maintenanceRef);
        alert('Maintenance request deleted successfully!');
        
    } catch (error) {
        console.error('Error deleting maintenance:', error);
        alert('Failed to delete maintenance: ' + error.message);
    }
};

// Helper function for edit
window.editMaintenanceData = function(key, maintenance) {
    document.getElementById('editMaintenanceKey').value = key;
    document.getElementById('editMaintenanceRoom').value = maintenance.room;
    document.getElementById('editMaintenanceIssue').value = maintenance.issue;
    document.getElementById('editMaintenancePriority').value = maintenance.priority;
    document.getElementById('editMaintenanceStatus').value = maintenance.status;
    
    document.getElementById('addMaintenanceForm').style.display = 'none';
    document.getElementById('editMaintenanceForm').style.display = 'block';
};

// Show/Hide forms
window.showAddMaintenanceForm = function() {
    document.getElementById('addMaintenanceForm').style.display = 'block';
    document.getElementById('editMaintenanceForm').style.display = 'none';
};

window.hideAddMaintenanceForm = function() {
    document.getElementById('addMaintenanceForm').style.display = 'none';
};

window.hideEditMaintenanceForm = function() {
    document.getElementById('editMaintenanceForm').style.display = 'none';
};