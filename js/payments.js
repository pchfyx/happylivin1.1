import { database } from './firebase-config.js';
import { ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// CREATE - Add new payment
window.createPayment = async function() {
    const tenant = document.getElementById('paymentTenant').value;
    const room = document.getElementById('paymentRoom').value;
    const amount = document.getElementById('paymentAmount').value;
    const date = document.getElementById('paymentDate').value;
    const status = document.getElementById('paymentStatus').value;

    if (!tenant || !room || !amount || !date) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const paymentsRef = ref(database, 'payments');
        const newPaymentRef = push(paymentsRef);
        
        await set(newPaymentRef, {
            tenant: tenant,
            room: room,
            amount: parseFloat(amount),
            date: date,
            status: status,
            createdAt: new Date().toISOString()
        });

        alert('Payment added successfully!');
        
        // Clear form
        document.getElementById('paymentTenant').value = '';
        document.getElementById('paymentRoom').value = '';
        document.getElementById('paymentAmount').value = '';
        document.getElementById('paymentDate').value = '';
        document.getElementById('paymentStatus').value = 'paid';
        
        hideAddPaymentForm();
        
    } catch (error) {
        console.error('Error adding payment:', error);
        alert('Failed to add payment: ' + error.message);
    }
};

// READ - Load all payments
window.loadPayments = function() {
    const paymentsRef = ref(database, 'payments');
    
    onValue(paymentsRef, (snapshot) => {
        const paymentsList = document.getElementById('paymentsList');
        paymentsList.innerHTML = '';
        
        if (snapshot.exists()) {
            const payments = snapshot.val();
            
            Object.keys(payments).forEach(key => {
                const payment = payments[key];
                const statusClass = `status-${payment.status}`;
                
                const paymentCard = document.createElement('div');
                paymentCard.className = 'data-card';
                paymentCard.innerHTML = `
                    <h3>Payment #${key.substring(0, 8)}</h3>
                    <p><strong>Tenant:</strong> ${payment.tenant}</p>
                    <p><strong>Room:</strong> ${payment.room}</p>
                    <p><strong>Amount:</strong> Rp ${parseFloat(payment.amount).toLocaleString('id-ID')}</p>
                    <p><strong>Date:</strong> ${payment.date}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${payment.status}</span></p>
                    <div class="card-actions">
                        <button class="btn-edit" onclick='editPaymentData("${key}", ${JSON.stringify(payment).replace(/'/g, "&apos;")})'>Edit</button>
                        <button class="btn-delete" onclick="deletePayment('${key}')">Delete</button>
                    </div>
                `;
                
                paymentsList.appendChild(paymentCard);
            });
        } else {
            paymentsList.innerHTML = '<p style="text-align: center; color: #999;">No payments found. Add your first payment!</p>';
        }
    });
};

// UPDATE - Update payment
window.updatePayment = async function() {
    const paymentKey = document.getElementById('editPaymentKey').value;
    const tenant = document.getElementById('editPaymentTenant').value;
    const room = document.getElementById('editPaymentRoom').value;
    const amount = document.getElementById('editPaymentAmount').value;
    const date = document.getElementById('editPaymentDate').value;
    const status = document.getElementById('editPaymentStatus').value;

    if (!tenant || !room || !amount || !date) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const paymentRef = ref(database, 'payments/' + paymentKey);
        
        await update(paymentRef, {
            tenant: tenant,
            room: room,
            amount: parseFloat(amount),
            date: date,
            status: status,
            updatedAt: new Date().toISOString()
        });

        alert('Payment updated successfully!');
        hideEditPaymentForm();
        
    } catch (error) {
        console.error('Error updating payment:', error);
        alert('Failed to update payment: ' + error.message);
    }
};

// DELETE - Delete payment
window.deletePayment = async function(paymentKey) {
    if (!confirm('Are you sure you want to delete this payment?')) {
        return;
    }

    try {
        const paymentRef = ref(database, 'payments/' + paymentKey);
        await remove(paymentRef);
        alert('Payment deleted successfully!');
        
    } catch (error) {
        console.error('Error deleting payment:', error);
        alert('Failed to delete payment: ' + error.message);
    }
};

// Helper function for edit
window.editPaymentData = function(key, payment) {
    document.getElementById('editPaymentKey').value = key;
    document.getElementById('editPaymentTenant').value = payment.tenant;
    document.getElementById('editPaymentRoom').value = payment.room;
    document.getElementById('editPaymentAmount').value = payment.amount;
    document.getElementById('editPaymentDate').value = payment.date;
    document.getElementById('editPaymentStatus').value = payment.status;
    
    document.getElementById('addPaymentForm').style.display = 'none';
    document.getElementById('editPaymentForm').style.display = 'block';
};

// Show/Hide forms
window.showAddPaymentForm = function() {
    document.getElementById('addPaymentForm').style.display = 'block';
    document.getElementById('editPaymentForm').style.display = 'none';
};

window.hideAddPaymentForm = function() {
    document.getElementById('addPaymentForm').style.display = 'none';
};

window.hideEditPaymentForm = function() {
    document.getElementById('editPaymentForm').style.display = 'none';
};