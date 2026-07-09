document.addEventListener('DOMContentLoaded', () => {
    const guestView = document.getElementById('guestView');
    const userView = document.getElementById('userView');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const navUserStatus = document.getElementById('navUserStatus');

    // WICHTIG: Nutzt jetzt "currentUser", genau wie in der login.html definiert!
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
        // Angemeldeten Zustand anzeigen
        if (guestView) guestView.style.display = 'none';
        if (userView) userView.style.display = 'block';
        if (usernameDisplay) usernameDisplay.innerText = storedUser;

        // Status in der Navbar aktualisieren (inkl. Online-Indikator)
        if (navUserStatus) {
            navUserStatus.innerHTML = `
                <span style="font-size: 0.9rem; margin-left: 15px; display: inline-flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-circle" style="color: #4dff88; font-size: 0.6rem;"></i> 
                    ${storedUser}
                </span>`;
        }
    } else {
        // Gast-Zustand anzeigen
        if (guestView) guestView.style.display = 'block';
        if (userView) userView.style.display = 'none';

        // Login-Button in der Navbar anzeigen
        if (navUserStatus) {
            navUserStatus.innerHTML = `
                <a href="login.html" class="btn btn-secondary" style="padding: 0.4rem 1rem; font-size: 0.85rem; text-decoration: none;">
                    <i class="fa-solid fa-right-to-bracket"></i> Login
                </a>`;
        }
    }

    // Abmelde-Logik
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Löscht den richtigen Key aus dem Speicher
            localStorage.removeItem('currentUser');
            // Seite neu laden, um Ansicht zurückzusetzen
            window.location.reload();
        });
    }
});