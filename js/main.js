/* Global Main Logic */

document.addEventListener('DOMContentLoaded', () => {
    // --- Lazy Loading Google Maps and Waze Facade Pattern ---
    const mapContainers = document.querySelectorAll('.map-facade-container');
    if ('IntersectionObserver' in window) {
        const mapObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadMap(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px 200px 0px" });

        mapContainers.forEach(container => {
            mapObserver.observe(container);
        });
    } else {
        // Fallback
        mapContainers.forEach(container => loadMap(container));
    }

    function loadMap(container) {
        const iframeSrc = container.getAttribute('data-src');
        if (iframeSrc && !container.querySelector('iframe')) {
            const iframe = document.createElement('iframe');
            iframe.src = iframeSrc;
            iframe.loading = 'lazy';
            iframe.className = 'map-iframe';
            iframe.allowFullscreen = true;

            iframe.onload = () => {
                const loader = container.querySelector('.map-loader');
                if (loader) loader.style.display = 'none';
            };

            container.appendChild(iframe);
        }
    }

    // --- Maps Tabs Logic ---
    const mapTabBtns = document.querySelectorAll('.map-tab-btn');
    const mapTabContents = document.querySelectorAll('.map-tab-content');

    mapTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            mapTabBtns.forEach(b => b.classList.remove('active'));
            mapTabContents.forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
            });

            // Add active class to clicked button
            btn.classList.add('active');

            // Show target content
            const targetId = btn.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.style.display = 'block';

                // Trigger map load if not already loaded (fixes lazy loading issues when hidden)
                const facadeContainer = targetContent.querySelector('.map-facade-container');
                if (facadeContainer) {
                    loadMap(facadeContainer);
                }
            }
        });
    });

    // --- Modals Logic for Catalog ---
    const modal = document.getElementById('service-modal');
    if (modal) {
        const modalClose = modal.querySelector('.modal-close');
        const modalTitle = modal.querySelector('.modal-title');
        const modalDesc = modal.querySelector('.modal-desc');

        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.service-item') || e.target.closest('.flavor-card');
                if (!item) return;

                const title = item.getAttribute('data-title');
                const desc = item.getAttribute('data-desc');

                modalTitle.textContent = title;
                modalDesc.innerHTML = desc;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- Tabs Logic for Servicios ---
    const tabs = document.querySelectorAll('.tab-btn');
    const items = document.querySelectorAll('.service-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            items.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- WhatsApp Inquiry Logic ---
    const whatsappBtns = document.querySelectorAll('.btn-whatsapp-consult');
    whatsappBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = e.target.closest('.service-item') || e.target.closest('.flavor-card');
            const itemName = parent ? parent.getAttribute('data-title') : 'sus postres';
            const msg = `Hola me interesaria saber mas sobre el postre ${itemName}`;
            const number = "00000000000"; // replace with real number later
            window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, '_blank');
        });
    });

    // --- Hero Slider Logic ---
    const slides = document.querySelectorAll('.hero__slide');
    const btnPrev = document.querySelector('.hero__slider-btn--prev');
    const btnNext = document.querySelector('.hero__slider-btn--next');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        const prevSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        const startSlideTimer = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 8000); // 8 seconds per slide
        };

        if (btnNext && btnPrev) {
            btnNext.addEventListener('click', () => {
                nextSlide();
                startSlideTimer();
            });
            btnPrev.addEventListener('click', () => {
                prevSlide();
                startSlideTimer();
            });
        }

        startSlideTimer();
    }

    // --- Lightbox for Gallery ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox__img');
        const lightboxClose = lightbox.querySelector('.lightbox__close');

        document.querySelectorAll('.gallery__img').forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => { lightboxImg.src = ''; }, 300); // Clear after transiton
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // --- Mobile Nav Toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // --- Reviews Carousel Generation ---
    const track = document.getElementById('reviews-track');
    if (track) {
        const names = ["María Rojas", "Carlos Jiménez", "Ana Castro", "Luis Pérez", "Elena Mora"];
        let html = "";
        for (let i = 0; i < names.length; i++) {
            html += `<div class="review-card"><h4>${names[i]}</h4><div class="review__stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div><p style="font-size:0.9rem; opacity:0.8;">"¡El sabor es increíble! Definitivamente el mejor pastel que hemos tenido en nuestras fiestas familiares."</p></div>`;
        }
        track.innerHTML = html + html;
    }
});
