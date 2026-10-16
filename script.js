/**
 * @file script.js
 * @description Lógica interactiva completa y blindada: Animaciones SVG StrokeText, CMS Administrador, 
 * Fondo desvanecido, DepthCarousel 3D y control de acceso.
 */

document.addEventListener('DOMContentLoaded', () => {

    const ADMIN_PASSWORD_HASH = "camilo230712";

    // --- 1. ANIMACIÓN STROKETEXT SVG ---
    function initStrokeTextAnimations() {
        const containers = document.querySelectorAll('.stroke-text-container');
        containers.forEach(container => {
            const textStr = container.getAttribute('data-stroke-text') || "Angélica Montiel";
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("class", "stroke-text-svg");
            svg.setAttribute("viewBox", "0 0 520 80");

            const textPath = document.createElementNS(svgNS, "text");
            textPath.setAttribute("x", "10");
            textPath.setAttribute("y", "55");
            textPath.setAttribute("class", "stroke-text-path");
            textPath.textContent = textStr;

            svg.appendChild(textPath);
            container.innerHTML = '';
            container.appendChild(svg);

            setTimeout(() => { svg.classList.add('animated'); }, 300);

            container.addEventListener('mouseenter', () => {
                svg.classList.remove('animated');
                setTimeout(() => svg.classList.add('animated'), 50);
            });
        });
    }

    initStrokeTextAnimations();

    // --- 2. BASE DE DATOS Y LOCALSTORAGE ---
    const initialProperties = {
        "1": {
            title: "Residencia Exclusiva Villa Magna",
            location: "San Cristóbal, Táchira",
            price: "$120,000",
            desc: "4 Habitaciones | 3 Baños | 2 Puestos de estacionamiento con acabados de lujo.",
            whatsapp: "https://wa.me/584147544303?text=Hola%20Ang%C3%A9lica,%20me%20interesa%20la%20Residencia%20Villa%20Magna.",
            images: [
                'https://picsum.photos/seed/a/800/1000',
                'https://picsum.photos/seed/b/800/1000',
                'https://picsum.photos/seed/c/800/1000',
                'https://picsum.photos/seed/d/800/1000',
                'https://picsum.photos/seed/e/800/1000'
            ]
        },
        "2": {
            title: "Penthouse Ejecutivo Altamira",
            location: "Sector Comercial, San Cristóbal",
            price: "$650 / mes",
            desc: "3 Habitaciones | 2 Baños | Vista panorámica insuperable y seguridad privada.",
            whatsapp: "https://wa.me/584147544303?text=Hola%20Ang%C3%A9lica,%20me%20interesa%20el%20Penthouse%20Altamira.",
            images: [
                'https://picsum.photos/seed/f/800/1000',
                'https://picsum.photos/seed/g/800/1000',
                'https://picsum.photos/seed/h/800/1000',
                'https://picsum.photos/seed/i/800/1000',
                'https://picsum.photos/seed/j/800/1000'
            ]
        },
        "3": {
            title: "Local Comercial Plaza Central",
            location: "Centro, San Cristóbal",
            price: "$85,000",
            desc: "Amplio espacio a pie de calle con alto flujo peatonal y excelente proyección comercial.",
            whatsapp: "https://wa.me/584147544303?text=Hola%20Ang%C3%A9lica,%20me%20interesa%20el%20Local%20Plaza%20Central.",
            images: [
                'https://picsum.photos/seed/k/800/1000',
                'https://picsum.photos/seed/l/800/1000',
                'https://picsum.photos/seed/m/800/1000',
                'https://picsum.photos/seed/n/800/1000',
                'https://picsum.photos/seed/o/800/1000'
            ]
        }
    };

    let storedProperties = JSON.parse(localStorage.getItem('verax_properties')) || initialProperties;
    let storedHeroImg = localStorage.getItem('verax_hero_img') || "";
    let storedBgImg = localStorage.getItem('verax_bg_img') || "";

    // --- 3. FONDO GENERAL ---
    const mainBg = document.getElementById('main-background');
    const btnEditBg = document.getElementById('btn-edit-bg');

    function applyMainBackground() {
        if (mainBg && storedBgImg) {
            mainBg.style.backgroundImage = `url('${storedBgImg}')`;
        }
    }
    applyMainBackground();

    if (btnEditBg) {
        btnEditBg.addEventListener('click', () => {
            const newUrl = prompt("Ingresa el enlace (URL) de la imagen de fondo general:", storedBgImg);
            if (newUrl !== null && newUrl.trim() !== "") {
                storedBgImg = newUrl.trim();
                localStorage.setItem('verax_bg_img', storedBgImg);
                applyMainBackground();
            }
        });
    }

    // --- 4. MODO ADMINISTRADOR ---
    const adminAuthModal = document.getElementById('admin-auth-modal');
    const adminForm = document.getElementById('admin-form');
    const adminPassInput = document.getElementById('admin-pass');
    const adminError = document.getElementById('admin-error');
    const openAdminBtn = document.getElementById('open-admin-btn');
    const openAdminBtnMobile = document.getElementById('open-admin-btn-mobile');
    const closeAdminModal = document.getElementById('close-admin-modal');
    const adminBar = document.getElementById('admin-bar');
    const closeAdminModeBtn = document.getElementById('close-admin-mode');

    function enableAdminMode() {
        adminBar?.classList.remove('hidden');
        document.querySelectorAll('.admin-only').forEach(btn => btn.classList.remove('hidden'));
    }

    function disableAdminMode() {
        adminBar?.classList.add('hidden');
        document.querySelectorAll('.admin-only').forEach(btn => btn.classList.add('hidden'));
    }

    openAdminBtn?.addEventListener('click', () => adminAuthModal?.classList.remove('hidden'));
    openAdminBtnMobile?.addEventListener('click', () => {
        document.getElementById('mobile-menu')?.classList.remove('active');
        adminAuthModal?.classList.remove('hidden');
    });
    closeAdminModal?.addEventListener('click', () => adminAuthModal?.classList.add('hidden'));

    adminForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (adminPassInput && adminPassInput.value === ADMIN_PASSWORD_HASH) {
            adminAuthModal?.classList.add('hidden');
            adminError?.classList.add('hidden');
            adminPassInput.value = '';
            enableAdminMode();
        } else {
            adminError?.classList.remove('hidden');
        }
    });

    closeAdminModeBtn?.addEventListener('click', disableAdminMode);

    // --- 5. EDICIÓN DE FOTO DE PERFIL ---
    const heroImgContainer = document.getElementById('hero-img-container');
    const heroImgBox = document.getElementById('hero-img-box');
    const btnEditHeroImg = document.getElementById('btn-edit-hero-img');

    function applyHeroImage() {
        if (heroImgContainer && storedHeroImg) {
            if (heroImgBox) heroImgBox.style.display = 'none';
            let existingImg = heroImgContainer.querySelector('img');
            if (!existingImg) {
                existingImg = document.createElement('img');
                heroImgContainer.insertBefore(existingImg, btnEditHeroImg);
            }
            existingImg.src = storedHeroImg;
        }
    }
    applyHeroImage();

    btnEditHeroImg?.addEventListener('click', () => {
        const newUrl = prompt("Enlace de la nueva foto de perfil de la asesora:", storedHeroImg);
        if (newUrl !== null && newUrl.trim() !== "") {
            storedHeroImg = newUrl.trim();
            localStorage.setItem('verax_hero_img', storedHeroImg);
            applyHeroImage();
        }
    });

    // --- 6. EDICIÓN DE TEXTOS Y PRECIOS ---
    function renderStoredTextData() {
        Object.keys(storedProperties).forEach(id => {
            const p = storedProperties[id];
            const titleEl = document.getElementById(`prop-title-${id}`);
            const descEl = document.getElementById(`prop-desc-${id}`);
            const priceEl = document.getElementById(`prop-price-${id}`);

            if (titleEl) titleEl.textContent = p.title;
            if (descEl) descEl.textContent = p.desc;
            if (priceEl) priceEl.textContent = p.price;
        });
    }
    renderStoredTextData();

    document.querySelectorAll('.btn-edit-text').forEach(btn => {
        btn.addEventListener('click', () => {
            const editType = btn.getAttribute('data-edit-type');
            const propId = btn.getAttribute('data-prop-id');
            const p = storedProperties[propId];

            if (editType === 'title') {
                const val = prompt("Editar Título del Inmueble:", p.title);
                if (val !== null && val.trim() !== "") p.title = val.trim();
            } else if (editType === 'desc') {
                const val = prompt("Editar Descripción del Inmueble:", p.desc);
                if (val !== null && val.trim() !== "") p.desc = val.trim();
            } else if (editType === 'price') {
                const val = prompt("Editar Precio del Inmueble:", p.price);
                if (val !== null && val.trim() !== "") p.price = val.trim();
            }

            localStorage.setItem('verax_properties', JSON.stringify(storedProperties));
            renderStoredTextData();
        });
    });

    // --- 7. REGISTRO DE CLIENTE Y VIDEO INTRO ---
    const authModal = document.getElementById('auth-modal');
    const authForm = document.getElementById('auth-form');
    const userNameInput = document.getElementById('user-name');
    const userDobInput = document.getElementById('user-dob');
    const introVideoOverlay = document.getElementById('intro-video-overlay');
    const closingVideo = document.getElementById('closing-video');
    const welcomeUserName = document.getElementById('welcome-user-name');
    const skipVideoBtn = document.getElementById('skip-video-btn');

    if (localStorage.getItem('verax_user')) {
        authModal?.classList.add('hidden');
        document.body.classList.remove('locked');
        introVideoOverlay?.classList.add('hidden');
    }

    authForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = userNameInput?.value.trim();
        const dob = userDobInput?.value;

        if (name && dob) {
            localStorage.setItem('verax_user', JSON.stringify({ name, dob }));
            authModal?.classList.add('hidden');
            if (welcomeUserName) welcomeUserName.textContent = name;
            introVideoOverlay?.classList.remove('hidden');
            closingVideo?.play().catch(() => {});
        }
    });

    function closeVideoOverlay() {
        introVideoOverlay?.classList.add('hidden');
        document.body.classList.remove('locked');
        closingVideo?.pause();
    }

    skipVideoBtn?.addEventListener('click', closeVideoOverlay);
    closingVideo?.addEventListener('ended', closeVideoOverlay);

    // --- 8. DEPTH CAROUSEL 3D CON ANIMACIÓN ---
    const propertyModal = document.getElementById('property-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const depthCarouselStage = document.getElementById('depth-carousel');
    const prevSlideBtn = document.getElementById('prev-slide');
    const nextSlideBtn = document.getElementById('next-slide');
    const btnEditGalleryImgs = document.getElementById('btn-edit-gallery-imgs');

    const modalTitle = document.getElementById('modal-property-title');
    const modalLocation = document.getElementById('modal-property-location');
    const modalPrice = document.getElementById('modal-property-price');
    const modalWhatsapp = document.getElementById('modal-whatsapp-link');

    let activePropertyId = null;
    let activeImages = [];
    let activeIndex = 0;
    const config = { depth: 220, spread: 90, tilt: 22, falloff: 0.2, blur: 6 };

    function renderDepthCarousel() {
        if (!depthCarouselStage) return;
        depthCarouselStage.innerHTML = '';
        const total = activeImages.length;

        activeImages.forEach((imgUrl, i) => {
            const card = document.createElement('div');
            card.className = 'depth-card';

            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = `Foto ${i + 1}`;

            const tint = document.createElement('div');
            tint.className = 'depth-card-tint';

            card.appendChild(img);
            card.appendChild(tint);

            let offset = i - activeIndex;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const absOffset = Math.abs(offset);
            const translateX = offset * config.spread;
            const translateZ = -absOffset * config.depth;
            const rotateY = offset * -config.tilt;
            const opacity = Math.max(0, 1 - absOffset * config.falloff);
            const blurVal = absOffset * config.blur;
            const tintOpacity = Math.min(0.8, absOffset * 0.25);

            card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
            card.style.opacity = opacity;
            card.style.filter = `blur(${blurVal}px)`;
            card.style.zIndex = 100 - absOffset;
            tint.style.opacity = tintOpacity;

            depthCarouselStage.appendChild(card);
        });
    }

    function openGallery(propertyId) {
        activePropertyId = propertyId;
        const data = storedProperties[propertyId];
        if (!data) return;

        if (modalTitle) modalTitle.textContent = data.title;
        if (modalLocation) modalLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.location}`;
        if (modalPrice) modalPrice.textContent = data.price;
        if (modalWhatsapp) modalWhatsapp.href = data.whatsapp;

        activeImages = data.images;
        activeIndex = 0;

        renderDepthCarousel();
        propertyModal?.classList.remove('hidden');
        document.body.classList.add('locked');
    }

    closeModalBtn?.addEventListener('click', () => {
        propertyModal?.classList.add('hidden');
        document.body.classList.remove('locked');
    });

    prevSlideBtn?.addEventListener('click', () => {
        activeIndex = (activeIndex - 1 + activeImages.length) % activeImages.length;
        renderDepthCarousel();
    });

    nextSlideBtn?.addEventListener('click', () => {
        activeIndex = (activeIndex + 1) % activeImages.length;
        renderDepthCarousel();
    });

    btnEditGalleryImgs?.addEventListener('click', () => {
        if (!activePropertyId) return;
        const currentUrls = activeImages.join(', ');
        const promptResult = prompt("Ingresa los enlaces de fotos separados por comas (,):", currentUrls);

        if (promptResult !== null && promptResult.trim() !== "") {
            const newImgs = promptResult.split(',').map(url => url.trim()).filter(url => url !== "");
            if (newImgs.length > 0) {
                storedProperties[activePropertyId].images = newImgs;
                localStorage.setItem('verax_properties', JSON.stringify(storedProperties));
                activeImages = newImgs;
                activeIndex = 0;
                renderDepthCarousel();
            }
        }
    });

    document.querySelectorAll('.open-gallery-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.property-card');
            const propertyId = card?.getAttribute('data-id');
            if (propertyId) openGallery(propertyId);
        });
    });

    // --- 9. FILTRADO Y RESPONSIVE ---
    const searchInput = document.getElementById('search-input');
    const filterType = document.getElementById('filter-type');
    const propertyCards = document.querySelectorAll('.property-card');

    function filterProperties() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const selectedType = filterType ? filterType.value : "all";

        propertyCards.forEach(card => {
            const type = card.getAttribute('data-type');
            const textContent = card.innerText.toLowerCase();

            const matchesQuery = textContent.includes(query);
            const matchesType = (selectedType === 'all' || type === selectedType);

            if (matchesQuery && matchesType) {
                card.style.display = 'block';
                setTimeout(() => card.classList.add('appear'), 50);
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchInput?.addEventListener('input', filterProperties);
    filterType?.addEventListener('change', filterProperties);

    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburgerBtn?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('active');
    });

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach(el => scrollObserver.observe(el));

});
