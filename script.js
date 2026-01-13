const TOTAL_ROOMS = 50;
let students = JSON.parse(localStorage.getItem('hostelDB')) || [];
let adminCreds = JSON.parse(localStorage.getItem('adminCreds')) || null;

// --- 1. DYNAMIC INITIALIZATION ---
// Check if an admin exists. If not, the UI tells the user to "Create" an account.
window.onload = () => {
    if (adminCreds) {
        document.getElementById('login-subtext').innerText = "Sign in to manage bookings";
        document.getElementById('loginBtn').innerText = "Login";
        document.getElementById('user').placeholder = "Username";
        document.getElementById('pass').placeholder = "Password";
    }
};

// --- 2. LOGIN LOGIC ---
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('user').value;
    const p = document.getElementById('pass').value;

    if (!adminCreds) {
        // First-time use: Save these as the permanent credentials
        adminCreds = { user: u, pass: p };
        localStorage.setItem('adminCreds', JSON.stringify(adminCreds));
        alert("Admin Account Created! Logging in...");
        enterDashboard();
    } else {
        // Validation check
        if (u === adminCreds.user && p === adminCreds.pass) {
            enterDashboard();
        } else {
            const err = document.getElementById('errorMsg');
            err.style.display = 'block';
            err.innerText = "Error: Name or Password does not match!";
        }
    }
});

function enterDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-dashboard').style.display = 'block';
    updateStats();
    renderTable();
}

// --- 3. NAVIGATION ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if(item.getAttribute('onclick').includes(pageId)) item.classList.add('active');
    });
}

// --- 4. BOOKING & DATA MANAGEMENT ---


document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const roomNo = document.getElementById('stuRoom').value;

    // Check if room is already taken
    if (students.some(s => s.room === roomNo)) {
        alert("Booking Failed: Room " + roomNo + " is already occupied!");
        return;
    }

    const newBooking = {
        id: document.getElementById('stuID').value,
        name: document.getElementById('stuName').value,
        room: roomNo,
        status: document.getElementById('stuStatus').value,
        key: Date.now() // Unique identifier
    };

    students.push(newBooking);
    localStorage.setItem('hostelDB', JSON.stringify(students));
    e.target.reset();
    alert('Booking Successful for Room ' + roomNo);
    updateStats();
    renderTable();
});

function updateStats() {
    const booked = students.length;
    document.getElementById('booked-count').innerText = booked;
    document.getElementById('available-count').innerText = TOTAL_ROOMS - booked;
}

function renderTable() {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';
    students.forEach(s => {
        tbody.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>Room ${s.room}</td>
                <td><span class="status-tag ${s.status.toLowerCase()}">${s.status}</span></td>
                <td><button onclick="deleteBooking(${s.key})" style="color:var(--danger); background:none; border:none; cursor:pointer;"><i class="fas fa-times-circle"></i> Cancel</button></td>
            </tr>`;
    });
}

function deleteBooking(key) {
    if(confirm("Are you sure you want to cancel this booking?")) {
        students = students.filter(s => s.key !== key);
        localStorage.setItem('hostelDB', JSON.stringify(students));
        updateStats();
        renderTable();
    }
}

function logout() { location.reload(); }