import { auth, database } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Register function with email verification
window.register = async function() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const phone = document.getElementById('registerPhone').value;

    if (!name || !email || !password || !phone) {
        alert('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user);
        
        // Save user data to database
        await set(ref(database, 'users/' + user.uid), {
            name: name,
            email: email,
            phone: phone,
            createdAt: new Date().toISOString(),
            emailVerified: false
        });

        alert('Registration successful! A verification email has been sent to ' + email + '. Please verify your email before logging in.');
        
        // Sign out user until they verify email
        await signOut(auth);
        
        // Clear form and show login
        document.getElementById('registerName').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerPhone').value = '';
        showLogin();
        
    } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = 'Registration failed. ';
        
        switch(error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'This email is already registered.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/weak-password':
                errorMessage += 'Password is too weak.';
                break;
            default:
                errorMessage += error.message;
        }
        
        alert(errorMessage);
    }
};

// Login function
window.login = async function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if email is verified
        if (!user.emailVerified) {
            alert('Please verify your email before logging in. Check your inbox for the verification link.');
            await signOut(auth);
            return;
        }

        // Clear form
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. ';
        
        switch(error.code) {
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/user-disabled':
                errorMessage += 'This account has been disabled.';
                break;
            case 'auth/user-not-found':
                errorMessage += 'No account found with this email.';
                break;
            case 'auth/wrong-password':
                errorMessage += 'Incorrect password.';
                break;
            case 'auth/invalid-credential':
                errorMessage += 'Invalid email or password.';
                break;
            default:
                errorMessage += error.message;
        }
        
        alert(errorMessage);
    }
};

// Logout function
window.logout = async function() {
    try {
        await signOut(auth);
        alert('Logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    }
};

// Auth state observer
onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
        // User is signed in and email is verified
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
        document.getElementById('userEmail').textContent = user.email;
        
        // Load initial data
        if (window.loadRooms) window.loadRooms();
        if (window.loadTenants) window.loadTenants();
        if (window.loadPayments) window.loadPayments();
        if (window.loadMaintenance) window.loadMaintenance();
        
    } else {
        // User is signed out or email not verified
        document.getElementById('authSection').style.display = 'flex';
        document.getElementById('dashboardSection').style.display = 'none';
    }
});

// Show/hide forms
window.showRegister = function() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
};

window.showLogin = function() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
};