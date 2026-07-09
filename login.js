document.addEventListener('DOMContentLoaded', async () => {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const errorDescription = document.getElementById('errorDescription');
    const errorTitle = document.getElementById('errorTitle');

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    const currentRedirectTarget = "https://phoenixmagie.github.io/website-template/login.html";
    const externalLoginUrl = `https://phoenixmagie.vercel.app/user/extern/login?redirect=${encodeURIComponent(currentRedirectTarget)}`;

    // FALL 1: Kein Code vorhanden -> Weiterleitung zum Login-Gate
    if (!code) {
        setTimeout(() => {
            window.location.href = externalLoginUrl;
        }, 800);
        return;
    }

    // FALL 2: Code vorhanden -> Absolut an deine Vercel-API senden
    try {
        // WICHTIG: Hier MUSS die absolute URL zu deiner funktionierenden API auf Vercel stehen!
        const apiUrl = 'https://phoenixmagie.vercel.app/api/extern/verify.js'; 

        const response = await fetch(`${apiUrl}?code=${encodeURIComponent(code)}`, {
            method: 'GET',
            mode: 'cors', // Aktiviert CORS-Abfragen explizit
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            }
        });

        // Falls die API ein Text-Fehler oder HTML zurückgibt statt JSON (z.B. 404/500)
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "Fehler beim Server-Abruf.";
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorMessage;
            } catch(e) {
                errorMessage = `Server-Antwort (${response.status}): ${errorText.substring(0, 50)}`;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();

        // Login erfolgreich
        localStorage.setItem('phoenix_username', data.username);

        loadingState.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 3.5rem; color: var(--success); margin-bottom: 1rem;"></i>
            <h2>Erfolgreich eingeloggt!</h2>
            <p style="color: var(--text-muted);">Willkommen zurück, ${data.username}. Leite weiter...</p>
        `;

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (err) {
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
        errorTitle.innerText = "Verbindungsfehler";
        errorDescription.innerHTML = `${err.message}<br><br><small style="color:var(--text-muted)">Hinweis: Stelle sicher, dass deine API auf Vercel CORS-Anfragen von GitHub Pages erlaubt.</small>`;
    }
});