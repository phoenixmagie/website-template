document.addEventListener('DOMContentLoaded', async () => {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const errorDescription = document.getElementById('errorDescription');
    const errorTitle = document.getElementById('errorTitle');

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    // Dynamische Erkennung der Domain für Vercel/Lokal
    const currentRedirectTarget = window.location.origin + "/login.html";
    const externalLoginUrl = `https://phoenixmagie.vercel.app/user/extern/login?redirect=${encodeURIComponent(currentRedirectTarget)}`;

    // FALL 1: Kein Code vorhanden -> Weiterleitung zum Login-Gate
    if (!code) {
        setTimeout(() => {
            window.location.href = externalLoginUrl;
        }, 800);
        return;
    }

    // WICHTIG: Code sofort aus der URL-Leiste entfernen (Clean URL), 
    // damit er beim Neuladen oder Zurückgehen nicht noch einmal abgefeuert wird.
    window.history.replaceState({}, document.title, window.location.pathname);

    // FALL 2: Code wurde abgefangen -> An die Vercel-API senden
    try {
        const apiUrl = 'https://phoenixmagie.vercel.app/api/extern/verify.js'; 

        // API-Abfrage starten
        const response = await fetch(`${apiUrl}?code=${encodeURIComponent(code)}`, {
            method: 'GET',
            mode: 'cors'
        });

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

        // Login erfolgreich im LocalStorage hinterlegen
        localStorage.setItem('phoenix_username', data.username);

        // Erfolgsmeldung im UI anzeigen
        loadingState.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 3.5rem; color: var(--success); margin-bottom: 1rem;"></i>
            <h2>Erfolgreich eingeloggt!</h2>
            <p style="color: var(--text-muted); margin-top: 5px;">Willkommen zurück, ${data.username}. Leite weiter...</p>
        `;

        // Expliziter Redirect auf die saubere Startseite ohne Parameter
        setTimeout(() => {
            window.location.replace(window.location.origin + '/index.html');
        }, 1000);

    } catch (err) {
        loadingState.style.display = 'none';
        errorState.classList.remove('hidden'); 
        errorTitle.innerText = "Verbindungsfehler";
        errorDescription.innerHTML = `${err.message}<br><br><small style="color:var(--text-muted)">Hinweis: Falls der Fehler bleibt, prüfe ob die Datei in Vercel unter "/api/extern/login.js" liegt und CORS-Header zurückgibt.</small>`;
    }
});