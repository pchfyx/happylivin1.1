import { database } from './firebase-config.js';
import { ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// CREATE - Add new room
window.createRoom = async function() {
    const roomNumber = document.getElementById('roomNumber').value;
    const roomType = document.getElementById('roomType').value;
    const roomPrice = document.getElementById('roomPrice').value;
    const roomStatus = document.getElementById('roomStatus').value;

    if (!roomNumber || !roomType || !roomPrice) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const roomsRef = ref(database, 'rooms');
        const newRoomRef = push(roomsRef);
        
        await set(newRoomRef, {
            roomNumber: roomNumber,
            type: roomType,
            price: parseFloat(roomPrice),
            status: roomStatus,
            createdAt: new Date().toISOString()
        });

        alert('Room added successfully!');
        
        // Clear form
        document.getElementById('roomNumber').value = '';
        document.getElementById('roomType').value = '';
        document.getElementById('roomPrice').value = '';
        document.getElementById('roomStatus').value = 'available';
        
        hideAddRoomForm();
        
    } catch (error) {
        console.error('Error adding room:', error);
        alert('Failed to add room: ' + error.message);
    }
};

// READ - Load all rooms
window.loadRooms = function() {
    const roomsRef = ref(database, 'rooms');
    
    onValue(roomsRef, (snapshot) => {
        const roomsList = document.getElementById('roomsList');
        roomsList.innerHTML = '';
        
        if (snapshot.exists()) {
            const rooms = snapshot.val();
            
            Object.keys(rooms).forEach(key => {
                const room = rooms[key];
                const statusClass = `status-${room.status}`;
                
                const roomCard = document.createElement('div');
                roomCard.className = 'data-card';
                roomCard.innerHTML = `
                    <h3>Room ${room.roomNumber}</h3>
                    <p><strong>Type:</strong> ${room.type}</p>
                    <p><strong>Price:</strong> Rp ${parseFloat(room.price).toLocaleString('id-ID')}/month</p>
                    <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${room.status}</span></p>
                    <div class="card-actions">
                        <button class="btn-edit" onclick="showEditRoomForm('${key}', '${room.roomNumber}', '${room.type}', ${room.price}, '${room.status}')">Edit</button>
                        <button class="btn-delete" onclick="deleteRoom('${key}')">Delete</button>
                    </div>
                `;
                
                roomsList.appendChild(roomCard);
            });
        } else {
            roomsList.innerHTML = '<p style="text-align: center; color: #999;">No rooms found. Add your first room!</p>';
        }
    });
};

// UPDATE - Update room
window.updateRoom = async function() {
    const roomId = document.getElementById('editRoomId').value;
    const roomNumber = document.getElementById('editRoomNumber').value;
    const roomType = document.getElementById('editRoomType').value;
    const roomPrice = document.getElementById('editRoomPrice').value;
    const roomStatus = document.getElementById('editRoomStatus').value;

    if (!roomNumber || !roomType || !roomPrice) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const roomRef = ref(database, 'rooms/' + roomId);
        
        await update(roomRef, {
            roomNumber: roomNumber,
            type: roomType,
            price: parseFloat(roomPrice),
            status: roomStatus,
            updatedAt: new Date().toISOString()
        });

        alert('Room updated successfully!');
        hideEditRoomForm();
        
    } catch (error) {
        console.error('Error updating room:', error);
        alert('Failed to update room: ' + error.message);
    }
};

// DELETE - Delete room
window.deleteRoom = async function(roomId) {
    if (!confirm('Are you sure you want to delete this room?')) {
        return;
    }

    try {
        const roomRef = ref(database, 'rooms/' + roomId);
        await remove(roomRef);
        alert('Room deleted successfully!');
        
    } catch (error) {
        console.error('Error deleting room:', error);
        alert('Failed to delete room: ' + error.message);
    }
};

// Show/Hide forms
window.showAddRoomForm = function() {
    document.getElementById('addRoomForm').style.display = 'block';
    document.getElementById('editRoomForm').style.display = 'none';
};

window.hideAddRoomForm = function() {
    document.getElementById('addRoomForm').style.display = 'none';
};

window.showEditRoomForm = function(id, number, type, price, status) {
    document.getElementById('editRoomId').value = id;
    document.getElementById('editRoomNumber').value = number;
    document.getElementById('editRoomType').value = type;
    document.getElementById('editRoomPrice').value = price;
    document.getElementById('editRoomStatus').value = status;
    
    document.getElementById('addRoomForm').style.display = 'none';
    document.getElementById('editRoomForm').style.display = 'block';
};

window.hideEditRoomForm = function() {
    document.getElementById('editRoomForm').style.display = 'none';
};