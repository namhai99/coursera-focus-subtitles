// Lắng nghe sự kiện cài đặt extension
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        chrome.tabs.create({
            url: "https://hainn-it.github.io/coursera-focus-subtitles/" 
        });
    }
});