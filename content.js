// Tạo element hiển thị phụ đề với style đẹp hơn
const subOverlay = document.createElement('div');
subOverlay.id = 'custom-sub-overlay';
subOverlay.style.cssText = `
    position: absolute;
    bottom: 12%;
    left: 50%;
    transform: translateX(-50%);
    width: 85%;
    background-color: rgba(0, 0, 0, 0.75);
    color: #ffffff;
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 26px;
    text-align: center;
    z-index: 10000;
    pointer-events: none;
    font-weight: 600;
    line-height: 1.4;
    text-shadow: 1px 1px 3px rgba(0,0,0,1);
    display: none;
    transition: all 0.2s ease;
`;

// Hàm gắn overlay vào khung video
function initOverlay() {
    // Tìm container chứa video dựa trên class bạn cung cấp
    const videoContainer = document.querySelector('.rc-VideoControlsContainer');
    if (videoContainer && !document.getElementById('custom-sub-overlay')) {
        videoContainer.style.position = 'relative'; // Đảm bảo container có position để overlay bám vào
        videoContainer.appendChild(subOverlay);
        subOverlay.style.display = 'block';
    }
}

// Hàm lấy text đã được dịch
function getTranslatedText() {
    // 1. Tìm tất cả các đoạn phrase trong bản chép lời
    const phrases = document.querySelectorAll('.rc-Phrase');
    let activeText = "";

    phrases.forEach(phrase => {
        // Kiểm tra xem phrase này có đang "active" (màu xanh/đang phát) không
        // Coursera dùng class 'active' hoặc aria-label thay đổi để đánh dấu
        const isActive = phrase.classList.contains('active') || 
                         window.getComputedStyle(phrase).backgroundColor !== 'rgba(0, 0, 0, 0)';

        if (isActive) {
            // Lấy text bên trong. Nếu có Google Translate, nó sẽ nằm trong các thẻ <font>
            // Sử dụng innerText của phrase sẽ lấy được kết quả cuối cùng sau khi dịch
            activeText = phrase.innerText.trim();
        }
    });

    return activeText;
}

// Chạy vòng lặp để cập nhật liên tục
function startSubtitleSync() {
    setInterval(() => {
        initOverlay();
        
        const newText = getTranslatedText();
        
        if (newText && newText !== subOverlay.innerText) {
            // Chỉ cập nhật nếu text khác đi để tránh nhấp nháy
            subOverlay.innerText = newText;
            subOverlay.style.display = 'block';
        }
    }, 200); // Quét mỗi 200ms để đảm bảo độ nhạy
}

// Bắt đầu thực hiện
startSubtitleSync();