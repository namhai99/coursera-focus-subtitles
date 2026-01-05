const fontSizeInput = document.getElementById('font-size');
const opacityInput = document.getElementById('bg-opacity');
const lockModeInput = document.getElementById('lock-mode');
const resetBtn = document.getElementById('reset-btn');

const DEFAULT_CONFIG = {
    fontSize: '26',
    bgOpacity: '0.75',
    isLocked: true,
    position: { bottom: '12%', left: '50%' }
};

// Hàm hỗ trợ delay việc ghi vào storage
let writeTimeout;
function debouncedSave(key, value) {
    clearTimeout(writeTimeout);
    writeTimeout = setTimeout(() => {
        chrome.storage.sync.set({ [key]: value });
    }, 200);
}

function updateUI(data) {
    fontSizeInput.value = data.fontSize || '26';
    document.getElementById('size-val').innerText = (data.fontSize || '26') + 'px';
    opacityInput.value = data.bgOpacity || '0.75';
    document.getElementById('opacity-val').innerText = data.bgOpacity || '0.75';
    lockModeInput.checked = data.isLocked !== undefined ? data.isLocked : true;
}

// Load settings
chrome.storage.sync.get(['fontSize', 'bgOpacity', 'isLocked', 'position'], (data) => {
    updateUI(data);
});

// Sự kiện thay đổi cỡ chữ
fontSizeInput.addEventListener('input', (e) => {
    const val = e.target.value;
    document.getElementById('size-val').innerText = val + 'px';
    debouncedSave('fontSize', val); 
});

// Sự kiện thay đổi độ mờ
opacityInput.addEventListener('input', (e) => {
    const val = e.target.value;
    document.getElementById('opacity-val').innerText = val;
    debouncedSave('bgOpacity', val);
});

lockModeInput.addEventListener('change', (e) => {
    chrome.storage.sync.set({ isLocked: e.target.checked });
});

resetBtn.addEventListener('click', () => {
    if (confirm('Reset all settings to default?')) {
        chrome.storage.sync.set(DEFAULT_CONFIG, () => {
            updateUI(DEFAULT_CONFIG);
        });
    }
});