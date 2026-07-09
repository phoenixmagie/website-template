// Da es sich um Frontend-seitigen Code für Github-Pages handelt, der mit der API interagiert:
document.addEventListener('DOMContentLoaded', async () => {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const errorDescription = document.getElementById('errorDescription');
    const errorTitle = document.getElementById('errorTitle');

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    // Festgelegte URLs laut deiner GitHub-Pages Vorgabe
    const currentRedirectTarget = "https://phoenixmagie.github.io/website-template/login.html";
    const externalLoginUrl = `https://phoenixmagie.vercel.app/user/extern/login?redirect=${encodeURIComponent(currentRedirectTarget)}`;

    // FALL 1: Kein Code in der URL vorhanden -> Nutzer muss zum Login geschickt werden
    if (!code) {
        // Kurze Verzögerung für den optischen Übergang, dann Weiterleitung zum echten Login-Gate
        setTimeout(() => {
            window.location.href = externalLoginUrl;
        }, 800);
        return;
    }

    // FALL 2: Ein Code wurde zurückgegeben -> Wir müssen ihn über deine GET-Schnittstelle verifizieren
    try {
        // Info: In der Produktions-Serverumgebung läuft die API unter deiner Domain.
        // Falls deine API auf Vercel läuft, passe den Host entsprechend an (z.B. https://phoenixmagie.vercel.app/api/extern/login.js)
        const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? '/api/extern/login.js' 
            : 'https://phoenixmagie.vercel.app/api/extern/login.js';

        const response = await fetch(`${apiHost}?code=${encodeURIComponent(code)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Verifizierung des Codes fehlgeschlagen.');
        }

        // Login war erfolgreich! Wir speichern den ermittelten Usernamen ab
        localStorage.setItem('phoenix_username', data.username);

        // Optisches Feedback anpassen und zur Hauptseite leiten
        loadingState.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 3.5rem; color: var(--success); margin-bottom: 1rem;"></i>
            <h2>Erfolgreich eingeloggt!</h2>
            <p style="color: var(--text-muted);">Willkommen zurück, ${data.username}. Leite weiter...</p>
        `;

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (err) {
        // Fehler anzeigen (z. B. Code abgelaufen oder manipuliert)
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
        errorTitle.innerText = "Login fehlgeschlagen";
        errorDescription.innerText = err.message || "Der übergebene Verifizierungscode ist ungültig oder abgelaufen.";
    }
});
