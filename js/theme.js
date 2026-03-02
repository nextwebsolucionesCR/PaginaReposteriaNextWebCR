/* =========================================
   START: Theme Toggle Logic (Dark/Light Mode)
   ========================================= */

const themeBtn = document.getElementById('theme-toggle');
const themeIcon = themeBtn ? themeBtn.querySelector('.theme-icon') : null;

const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

let initialTheme = 'light';
if (savedTheme === 'dark' || savedTheme === 'light') {
    initialTheme = savedTheme;
} else {
    initialTheme = systemPrefersDark ? 'dark' : 'light';
}

document.body.classList.toggle('dark-mode', initialTheme === 'dark');

function updateThemeUI(isDark) {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    if (themeIcon) {
        themeIcon.textContent = isDark ? '☀' : '☾';
    }

    if (themeBtn) {
        themeBtn.setAttribute('aria-pressed', String(isDark));
        themeBtn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
}

updateThemeUI(initialTheme === 'dark');

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        document.body.classList.toggle('dark-mode', isDark);
        updateThemeUI(isDark);
    });
}

if (!savedTheme && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
        const isDark = e.matches;
        document.body.classList.toggle('dark-mode', isDark);
        updateThemeUI(isDark);
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
}
