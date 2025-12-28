// script.js 
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configuration ---
    // Replace these URLs with your actual project thumbnail images
    const projectPreviews = {
        'project1': 'img/preview/1.png',
        'project2': 'img/preview/2.png',
        'project3': 'img/preview/3.png',
        'project4': 'img/preview/4.png',
        'project5': 'img/preview/5.png',
        'project6': 'img/preview/6.png',
    };

    // --- Selectors ---
    const signs = document.querySelectorAll('.sign-item');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const body = document.body;
    const closeButtons = document.querySelectorAll('.close-btn');
    const parallaxBg = document.getElementById('parallax-bg');

     // --- Parallax Effect ---
     document.addEventListener('mousemove', (e) => {
        if (parallaxBg) {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.03;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.03;
            parallaxBg.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
        }
    });


    // --- Hover Logic (Show Preview) ---
    signs.forEach(sign => {
        sign.addEventListener('mouseenter', () => {
            const projectId = sign.getAttribute('data-project');
            const isLeft = sign.classList.contains('left-sign');
            const rect = sign.getBoundingClientRect();
            const previewHeight = previewContainer.offsetHeight;
            
            if (projectPreviews[projectId]) {
                previewImage.src = projectPreviews[projectId];
            }

            // Position Logic: Simplified for flat style
            if (isLeft) {
                previewContainer.style.left = '10%';
                previewContainer.style.top = `${rect.top - previewHeight/3}px`;
    
            } else {
                previewContainer.style.right = '10%';
                previewContainer.style.top = `${rect.top - previewHeight/3}px`;
                previewContainer.style.left = 'auto';
            }

            previewContainer.classList.add('visible');
        });

        sign.addEventListener('mouseleave', () => {
            previewContainer.classList.remove('visible');
        });

        // --- Click Logic (Open Panel) ---
        sign.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectId = sign.getAttribute('data-project');
            const targetPanel = document.getElementById(projectId);
            const isLeft = sign.classList.contains('left-sign');

            closeAllPanels();

            if (targetPanel) {
                targetPanel.classList.add('active');
                if (isLeft) {
                    body.classList.add('push-right');
                } else {
                    body.classList.add('push-left');
                }
            }
        });
    });

    // --- Close Logic ---
    function closeAllPanels() {
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        body.classList.remove('push-left', 'push-right');
        const iframes = document.querySelectorAll('iframe');
        
        // 2. 遍历并重置它们的 src，这会立即停止视频和音频
        iframes.forEach(iframe => {
            const currentSrc = iframe.src;
            iframe.src = ''; // 先清空
            iframe.src = currentSrc; // 再还原，确保下次打开面板时视频还能加载
        });
    
        // 3. 原有的面板收回逻辑
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        body.classList.remove('push-left', 'push-right');
    }

    closeButtons.forEach(btn => btn.addEventListener('click', closeAllPanels));

    // Close when clicking the "pushed" background area
    document.getElementById('main-scene').addEventListener('click', (e) => {
        if (!e.target.closest('.sign')) {
            closeAllPanels();
        }
    });

    // // Close on Escape key
    // document.addEventListener('keydown', (e) => {
    //     if (e.key === 'Escape') closeAllPanels();
    // });
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lbClose = document.querySelector('.lightbox-close');
    const lbPrev = document.querySelector('.lightbox-prev');
    const lbNext = document.querySelector('.lightbox-next');
    
    let currentGallery = [];
    let currentIndex = 0;

    // Delegate click events for images in panels
    document.querySelectorAll('.panel-scrollable').forEach(panel => {
        panel.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                const images = Array.from(panel.querySelectorAll('img'));
                currentGallery = images.map(img => img.src);
                currentIndex = currentGallery.indexOf(e.target.src);
                
                openLightbox(currentGallery[currentIndex]);
            }
        });
    });

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        lightboxImg.src = currentGallery[currentIndex];
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        lightboxImg.src = currentGallery[currentIndex];
    }

    lbClose.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', showNext);
    lbPrev.addEventListener('click', showPrev);

    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

});