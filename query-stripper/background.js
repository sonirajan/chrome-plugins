// background.js
// Listens for navigation events on http://localhost/*
// If the URL has query parameters, strips them and redirects to the clean URL.

/*
Here's what actually happens:
1. Chrome starts navigating to http://localhost:63342/file.html?foo=bar
2. The page begins loading
3. onBeforeNavigate fires - this is early in the navigation, before the server responds, but the navigation has already started
4. The extension calls chrome.tabs.update() with the clean URL
5. Chrome cancels the first navigation and starts a new one to http://localhost:63342/file.html
   So the server at localhost:63342 actually receives two requests - one with the query params, one without.
*/

// --- Add or remove ports here ---
const PORTS = [63342];
// --------------------------------

chrome.webNavigation.onBeforeNavigate.addListener(
    (details) => {
        const url = new URL(details.url);

        // Only act if there are query parameters to strip
        if (url.search === "") return;

        // Build clean URL: same origin + pathname, no query string, no hash changes
        const cleanUrl = url.origin + url.pathname;

        console.log(`[QueryStripper] Stripping params from: ${details.url}`);
        console.log(`[QueryStripper] Redirecting to: ${cleanUrl}`);

        // Redirect the tab to the clean URL
        chrome.tabs.update(details.tabId, { url: cleanUrl });
    },
    {
        url: PORTS.map((port) => ({
            hostEquals: "localhost",
            ports: [port],
            schemes: ["http"]
        }))
    }
);