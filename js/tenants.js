import { database } from './firebase-config.js';
import { ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// CREATE - Add new tenant
window.createTenant = async function() {
    const name = document.getElementById('tenantName').value;
    const email = document.getElementById('tenantEmail').value;
    const phone = document.getElementById('tenantPhone').value;
    const idCard = document.getElementById('tenantID').value;
    const moveInDate = document.getElementById('tenantMoveIn').value;

    if (!name || !email || !phone || !idCard || !moveInDate) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const tenantsRef = ref(database, 'tenants');
        const newTenantRef = push(tenantsRef);
        
        await set(newTenantRef, {
            name: name,
            email: email,
            phone: phone,
            idCard: idCard,
            moveInDate: moveInDate,
            createdAt: new Date().toISOString()
        });

        alert('Tenant added successfully!');
        
        // Clear form
        document.getElementById('tenantName').value = '';
        document.getElementById('tenantEmail').value = '';
        document.getElementById('tenantPhone').value = '';
        document.getElementById('tenantID').value = '';
        document.getElementById('tenantMoveIn').value = '';
        
        hideAddTenantForm();
        
    } catch (error) {
        console.error('Error adding tenant:', error);
        alert('Failed to add tenant: ' + error.message);
    }
};

// READ - Load all tenants
window.loadTenants = function() {
    const tenantsRef = ref(database, 'tenants');
    
    onValue(tenantsRef, (snapshot) => {
        const tenantsList = document.getElementById('tenantsList');
        tenantsList.innerHTML = '';
        
        if (snapshot.exists()) {
            const tenants = snapshot.val();
            
            Object.keys(tenants).forEach(key => {
                const tenant = tenants[key];
                
                const tenantCard = document.createElement('div');
                tenantCard.className = 'data-card';
                tenantCard.innerHTML = `
                    <h3>${tenant.name}</h3>
                    <p><strong>Email:</strong> ${tenant.email}</p>
                    <p><strong>Phone:</strong> ${tenant.phone}</p>
                    <p><strong>ID Card:</strong> ${tenant.idCard}</p>
                    <p><strong>Move-in Date:</strong> ${tenant.moveInDate}</p>
                    <div class="card-actions">
                        <button class="btn-edit" onclick='editTenantData("${key}", ${JSON.stringify(tenant).replace(/'/g, "&apos;")})'>Edit</button>
                        <button class="btn-delete" onclick="deleteTenant('${key}')">Delete</button>
                    </div>
                `;
                
                tenantsList.appendChild(tenantCard);
            });
        } else {
            tenantsList.innerHTML = '<p style="text-align: center; color: #999;">No tenants found. Add your first tenant!</p>';
        }
    });
};

// UPDATE - Update tenant
window.updateTenant = async function() {
    const tenantKey = document.getElementById('editTenantKey').value;
    const name = document.getElementById('editTenantName').value;
    const email = document.getElementById('editTenantEmail').value;
    const phone = document.getElementById('editTenantPhone').value;
    const idCard = document.getElementById('editTenantID').value;
    const moveInDate = document.getElementById('editTenantMoveIn').value;

    if (!name || !email || !phone || !idCard || !moveInDate) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const tenantRef = ref(database, 'tenants/' + tenantKey);
        
        await update(tenantRef, {
            name: name,
            email: email,
            phone: phone,
            idCard: idCard,
            moveInDate: moveInDate,
            updatedAt: new Date().toISOString()
        });

        alert('Tenant updated successfully!');
        hideEditTenantForm();
        
    } catch (error) {
        console.error('Error updating tenant:', error);
        alert('Failed to update tenant: ' + error.message);
    }
};

// DELETE - Delete tenant
window.deleteTenant = async function(tenantKey) {
    if (!confirm('Are you sure you want to delete this tenant?')) {
        return;
    }

    try {
        const tenantRef = ref(database, 'tenants/' + tenantKey);
        await remove(tenantRef);
        alert('Tenant deleted successfully!');
        
    } catch (error) {
        console.error('Error deleting tenant:', error);
        alert('Failed to delete tenant: ' + error.message);
    }
};

// Helper function for edit
window.editTenantData = function(key, tenant) {
    document.getElementById('editTenantKey').value = key;
    document.getElementById('editTenantName').value = tenant.name;
    document.getElementById('editTenantEmail').value = tenant.email;
    document.getElementById('editTenantPhone').value = tenant.phone;
    document.getElementById('editTenantID').value = tenant.idCard;
    document.getElementById('editTenantMoveIn').value = tenant.moveInDate;
    
    document.getElementById('addTenantForm').style.display = 'none';
    document.getElementById('editTenantForm').style.display = 'block';
};

// Show/Hide forms
window.showAddTenantForm = function() {
    document.getElementById('addTenantForm').style.display = 'block';
    document.getElementById('editTenantForm').style.display = 'none';
};

window.hideAddTenantForm = function() {
    document.getElementById('addTenantForm').style.display = 'none';
};

window.hideEditTenantForm = function() {
    document.getElementById('editTenantForm').style.display = 'none';
};