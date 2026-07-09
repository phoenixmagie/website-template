document.addEventListener('DOMContentLoaded', () => {
    const guestView = document.getElementById('guestView');
    const userView = document.getElementById('userView');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const navUserStatus = document.getElementById('navUserStatus');

    // Prüfen, ob der Nutzer im LocalStorage eingeloggt hinterlegt ist
    const storedUser = localStorage.getItem('phoenix_username');

    if (storedUser) {
        // Logged-in State anzeigen
        if (guestView) guestView.style.display = 'none';
        if (userView) userView.style.display = 'block';
        if (usernameDisplay) usernameDisplay.innerText = storedUser;

        // Navbar Status Update
        if (navUserStatus) {
            navUserStatus.innerHTML = `<span style="font-size:0.9rem; color:var(--text-muted)"><i class="fa-solid fa-circle" style="color:#10b981; font-size:0.6rem; margin-right:5px;"></i> ${storedUser}</span>`;
        }
    } else {
        // Guest State anzeigen
        if (guestView) guestView.style.display = 'block';
        if (userView) userView.style.display = 'none';

        if (navUserStatus) {
            navUserStatus.innerHTML = `<a href="login.html" class="btn btn-secondary" style="padding: 0.4rem 1rem; font-size: 0.85rem;"><i class="fa-solid fa-right-to-bracket"></i> Login</a>`;
        }
    }

    // Logout Logik
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('phoenix_username');
            window.location.reload();
        });
    }
});