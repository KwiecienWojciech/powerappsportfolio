document.addEventListener('DOMContentLoaded', function() {
    // Obsługa menu hamburger
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            hamburger.classList.toggle('active');
        });

        // Dodaj obsługę zamykania menu po kliknięciu linku nawigacyjnego
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    hamburger.classList.remove('active');
                }
            });
        });
    }

    // Funkcja do płynnego przewijania do elementu o danym ID
    function scrollToSection(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            requestAnimationFrame(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    // Obsługa przewijania do sekcji po załadowaniu strony z kotwicą
    // Ta część jest kluczowa dla linków typu 'index.html#about'
    if (window.location.hash) {
        const hash = window.location.hash.substring(1); // Usuń '#'
        // Daj przeglądarce chwilę na wyrenderowanie strony przed przewinięciem
        setTimeout(() => {
            scrollToSection(hash);
        }, 100); // Mniejsze opóźnienie, jeśli strona nie jest skomplikowana
    }


    // Obsługa animacji wjazdu na przewijanie dla klasy .fade-in-on-scroll
    const fadeInOnScrollElements = document.querySelectorAll('.fade-in-on-scroll');

    const observerOptions = {
        root: null, // Obserwujemy względem viewportu
        rootMargin: '0px',
        threshold: 0.2 // Element jest widoczny, gdy 20% jego wysokości jest w viewportcie
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Przestań obserwować po animacji (opcjonalnie, aby animowało się tylko raz)
            }
        });
    }, observerOptions);

    // Rozpocznij obserwowanie wszystkich elementów z klasą 'fade-in-on-scroll'
    fadeInOnScrollElements.forEach(element => {
        observer.observe(element);
    });
});

// --- Lightbox / Image Modal Functionality ---

document.addEventListener('DOMContentLoaded', () => {
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.classList.add('lightbox-overlay');
    document.body.appendChild(lightboxOverlay);

    const lightboxContent = document.createElement('div');
    lightboxContent.classList.add('lightbox-content');
    lightboxOverlay.appendChild(lightboxContent);

    const lightboxImage = document.createElement('img');
    lightboxContent.appendChild(lightboxImage);

    const lightboxCaption = document.createElement('p');
    lightboxCaption.classList.add('lightbox-caption');
    lightboxContent.appendChild(lightboxCaption);

    const closeButton = document.createElement('button');
    closeButton.classList.add('lightbox-close');
    closeButton.innerHTML = '&times;'; // Symbol 'x'
    lightboxOverlay.appendChild(closeButton);

    const prevButton = document.createElement('button');
    prevButton.classList.add('lightbox-nav-btn', 'lightbox-prev');
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    lightboxOverlay.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.classList.add('lightbox-nav-btn', 'lightbox-next');
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    lightboxOverlay.appendChild(nextButton);

    let currentGalleryImages = [];
    let currentIndex = 0;

    document.querySelectorAll('[data-lightbox]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Zapobiega domyślnej akcji linku

            const galleryName = this.getAttribute('data-lightbox');
            currentGalleryImages = Array.from(document.querySelectorAll(`[data-lightbox="${galleryName}"]`));
            currentIndex = currentGalleryImages.indexOf(this);

            showImage(this.href, this.getAttribute('data-title'));
            lightboxOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Zapobiega scrollowaniu strony pod spodem
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', (e) => {
        // Zamknij lightbox tylko, jeśli kliknięto poza obrazkiem (na overlay)
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (lightboxOverlay.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });

    prevButton.addEventListener('click', showPrevImage);
    nextButton.addEventListener('click', showNextImage);

    function showImage(src, title) {
        lightboxImage.src = src;
        lightboxCaption.textContent = title || ''; // Ustawia tytuł lub pusty string
    }

    function showPrevImage() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentGalleryImages.length - 1;
        const prevLink = currentGalleryImages[currentIndex];
        showImage(prevLink.href, prevLink.getAttribute('data-title'));
    }

    function showNextImage() {
        currentIndex = (currentIndex < currentGalleryImages.length - 1) ? currentIndex + 1 : 0;
        const nextLink = currentGalleryImages[currentIndex];
        showImage(nextLink.href, nextLink.getAttribute('data-title'));
    }

    function closeLightbox() {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Przywraca scrollowanie strony
        lightboxImage.src = ''; // Wyczyść src obrazka
        lightboxCaption.textContent = ''; // Wyczyść podpis
    }
});