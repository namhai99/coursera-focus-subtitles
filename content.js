let currentSettings = {
    fontSize: '26',
    bgOpacity: '0.75',
    isLocked: true,
    position: { bottom: '12%', left: '50%' }
};

const subOverlay = document.createElement('div');
subOverlay.id = 'custom-sub-overlay';
subOverlay.style.cssText = `
    position: absolute;
    width: 80%;
    min-height: 40px;
    color: #ffffff;
    padding: 12px 20px;
    border-radius: 12px;
    text-align: center;
    z-index: 2147483647;
    font-weight: 600;
    line-height: 1.4;
    text-shadow: 1px 1px 3px rgba(0,0,0,1);
    display: block !important;
    user-select: none;
    box-sizing: border-box;
    transition: background-color 0.2s, font-size 0.2s;
    transform: translateX(-50%);
    pointer-events: auto;
`;

function applySettings() {
    subOverlay.style.fontSize = currentSettings.fontSize + 'px';
    subOverlay.style.backgroundColor = `rgba(0, 0, 0, ${currentSettings.bgOpacity})`;
    subOverlay.style.bottom = currentSettings.position.bottom;
    subOverlay.style.left = currentSettings.position.left;
    subOverlay.style.cursor = currentSettings.isLocked ? 'default' : 'move';
}

// Lấy data từ Storage
chrome.storage.sync.get(['fontSize', 'bgOpacity', 'isLocked', 'position'], (data) => {
    if (data.fontSize) currentSettings.fontSize = data.fontSize;
    if (data.bgOpacity) currentSettings.bgOpacity = data.bgOpacity;
    if (data.isLocked !== undefined) currentSettings.isLocked = data.isLocked;
    if (data.position) currentSettings.position = data.position;
    applySettings();
});

// Quan trọng: Đồng bộ thời gian thực khi chỉnh Popup
chrome.storage.onChanged.addListener((changes) => {
    if (changes.fontSize) currentSettings.fontSize = changes.fontSize.newValue;
    if (changes.bgOpacity) currentSettings.bgOpacity = changes.bgOpacity.newValue;
    if (changes.isLocked) currentSettings.isLocked = changes.isLocked.newValue;
    if (changes.position) currentSettings.position = changes.position.newValue;
    applySettings();
});

let isDragging = false;
subOverlay.addEventListener('mousedown', (e) => {
    if (currentSettings.isLocked) return; 
    isDragging = true;
    subOverlay.style.transition = 'none';
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const container = subOverlay.parentElement;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = 100 - (((e.clientY - rect.top) / rect.height) * 100);
    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));
    currentSettings.position = { bottom: `${y}%`, left: `${x}%` };
    applySettings();
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        subOverlay.style.transition = 'all 0.2s ease';
        chrome.storage.sync.set({ position: currentSettings.position });
    }
});

function initOverlay() {
    const videoContainer = document.querySelector('.rc-VideoControlsContainer') || document.querySelector('.vjs-tech');
    const target = videoContainer?.parentElement || videoContainer;
    if (target && !document.getElementById('custom-sub-overlay')) {
        target.style.position = 'relative';
        target.appendChild(subOverlay);
    }
}

function startSubtitleSync() {
    setInterval(() => {
        initOverlay();
        const phrases = document.querySelectorAll('.rc-Phrase');
        let activeText = "";
        phrases.forEach(phrase => {
            const isActive = phrase.classList.contains('active') || 
                             window.getComputedStyle(phrase).backgroundColor !== 'rgba(0, 0, 0, 0)';
            if (isActive) activeText = phrase.innerText.trim();
        });
        if (activeText && activeText !== subOverlay.innerText) {
            subOverlay.innerText = activeText;
        }
    }, 200);
}
startSubtitleSync();