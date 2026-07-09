document.addEventListener('DOMContentLoaded', () => {
    const authBtn = document.getElementById('auth-btn');
    const userDisplay = document.getElementById('user-display');

    // Prüfen, ob wir einen Auth-Code via Redirect erhalten haben
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    // Lokalen Anmeldezustand abfragen
    const savedUser = localStorage.getItem('phoenix_user');

    if (savedUser) {
        setLoggedInUser(savedUser);
    } else if (code) {
        // Falls ein Code in der URL übergeben wurde, verifizieren wir ihn über die login.js API
        verifyAuthCode(code);
    } else {
        setLoggedOutState();
    }

    authBtn.addEventListener('click', () => {
        if (localStorage.getItem('phoenix_user')) {
            // Logout durchführen
            localStorage.removeItem('phoenix_user');
            setLoggedOutState();
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            // Zum Login weiterleiten – aktuelle Seite als Redirect-Ziel mitgeben
            const currentUrl = window.location.origin + window.location.pathname;
            window.location.href = `login.html?redirect=${encodeURIComponent(currentUrl)}`;
        }
    });

    async function verifyAuthCode(authCode) {
        userDisplay.textContent = "Verifiziere Session...";
        userDisplay.style.display = "inline-block";

        try {
            // Aufruf des bereitgestellten API-Handlers für den Code (login.js)
            const response = await fetch(`/api/extern/login.js?code=${encodeURIComponent(authCode)}`);
            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('phoenix_user', data.username);
                setLoggedInUser(data.username);
            } else {
                alert('Session-Validierung fehlgeschlagen: ' + (data.error || 'Unbekannter Fehler'));
                setLoggedOutState();
            }
            // Bereinigen der URL-Zeile von Query-Parametern
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
            console.error('Fehler bei Code-Verifizierung:', err);
            // Fallback für lokale Testumgebungen ohne Backend-Server
            window.history.replaceState({}, document.title, window.location.pathname);
            setLoggedOutState();
        }
    }

    function setLoggedInUser(username) {
        userDisplay.textContent = `Eingeloggt als: ${username}`;
        userDisplay.style.display = 'inline-block';
        authBtn.textContent = 'Logout';
        authBtn.classList.remove('btn-primary');
        authBtn.classList.add('btn-outline');
    }

    function setLoggedOutState() {
        userDisplay.textContent = '';
        userDisplay.style.display = 'none';
        authBtn.textContent = 'Login';
        authBtn.classList.remove('btn-outline');
        authBtn.classList.add('btn-primary');
    }
});