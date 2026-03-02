/* =========================================
   SECURITY BLOCKER
   This script prevents right-clicking and common keyboard shortcuts 
   used to open browser developer tools.
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Disable Right-Click Context Menu
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    // 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, etc)
    document.addEventListener('keydown', (event) => {
        // F12 key
        if (event.key === 'F12' || event.keyCode === 123) {
            event.preventDefault();
            return false;
        }

        // Ctrl / Cmd combinations
        if (event.ctrlKey || event.metaKey) {
            // Shift combinations
            if (event.shiftKey) {
                // Ctrl+Shift+I (Inspector) / Ctrl+Shift+J (Console) / Ctrl+Shift+C (Element selector)
                if (event.key.toUpperCase() === 'I' || event.key.toUpperCase() === 'J' || event.key.toUpperCase() === 'C') {
                    event.preventDefault();
                    return false;
                }
            }

            // Ctrl+U (View Source) / Ctrl+S (Save)
            if (event.key.toUpperCase() === 'U' || event.key.toUpperCase() === 'S') {
                event.preventDefault();
                return false;
            }
        }
    });

    // 3. Optional: Dragging prevention for images (to avoid easy "save as")
    document.addEventListener('dragstart', (event) => {
        if (event.target.tagName.toLowerCase() === 'img') {
            event.preventDefault();
        }
    });
});
