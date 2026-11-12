document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------------------------------
    // 1. BOTÓN DE MODO OSCURO / CLARO
    // -----------------------------------------------------------------
    const toggleBtn = document.createElement("button");
    toggleBtn.classList.add("theme-toggle-btn");
    toggleBtn.setAttribute("aria-label", "Cambiar tema");
    
    // Recuperar tema guardado o preferencia del sistema
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
        toggleBtn.textContent = "☀️";
    } else {
        toggleBtn.textContent = "🌙";
    }

    document.body.appendChild(toggleBtn);

    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        
        let theme = "light";
        if (document.body.classList.contains("dark-theme")) {
            theme = "dark";
            toggleBtn.textContent = "☀️";
        } else {
            toggleBtn.textContent = "🌙";
        }
        localStorage.setItem("theme", theme);
    });

    // -----------------------------------------------------------------
    // 2. RESALTADO ACTIVO DE SECCIONES EN EL MENÚ (IntersectionObserver)
    // -----------------------------------------------------------------
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav a");

    const observerOptions = {
        root: null,
        rootMargin: "-20px 0px -60px 0px",
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // -----------------------------------------------------------------
    // 3. ANIMACIÓN DE ENTRADA SUAVE PARA SECCIONES (Scroll Reveal)
    // -----------------------------------------------------------------
    sections.forEach(section => section.classList.add("reveal"));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Animar solo una vez
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => revealObserver.observe(section));

    // -----------------------------------------------------------------
    // 4. EFECTO TILT (3D) EN IMÁGENES DE PERFIL Y LOGOS
    // -----------------------------------------------------------------
    const tiltImages = document.querySelectorAll('.profile-img, .tech-logo');

    tiltImages.forEach(img => {
        img.addEventListener('mousemove', (e) => {
            const rect = img.getBoundingClientRect();
            
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const percentX = (e.clientX - centerX) / (rect.width / 2);
            const percentY = (e.clientY - centerY) / (rect.height / 2);
            
            const maxRotation = 15; 
            const rotateX = -percentY * maxRotation;
            const rotateY = percentX * maxRotation;

            img.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
        });

        img.addEventListener('mouseleave', () => {
            img.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });

    // -----------------------------------------------------------------
    // 5. ACORDEÓN / DESPLEGABLE DE PROYECTOS
    // -----------------------------------------------------------------
    const toggleDetailsBtns = document.querySelectorAll('.btn-toggle-details');

    toggleDetailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const detailsContainer = btn.nextElementSibling;
            const isHidden = detailsContainer.classList.contains('hidden');

            if (isHidden) {
                detailsContainer.classList.remove('hidden');
                btn.classList.add('active');
                btn.querySelector('span').textContent = 'Ocultar detalles';
                btn.setAttribute('aria-expanded', 'true');
            } else {
                detailsContainer.classList.add('hidden');
                btn.classList.remove('active');
                btn.querySelector('span').textContent = 'Ver detalles del juego';
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // -----------------------------------------------------------------
    // 6. SISTEMA DE PESTAÑAS Y CONTADORES ANIMADOS ("SOBRE MÍ")
    // -----------------------------------------------------------------
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');

                const targetElement = document.getElementById(`tab-${targetTab}`);
                if (targetElement) {
                    targetElement.classList.add('active');
                }
            });
        });
    }

    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            let count = 0;
            const speed = Math.max(1, Math.ceil(target / 20));

            const updateCount = () => {
                count += speed;
                if (count < target) {
                    stat.innerText = count;
                    setTimeout(updateCount, 40);
                } else {
                    stat.innerText = target;
                }
            };
            updateCount();
        });
    };

    const aboutSection = document.querySelector('#sobre-mi');
    if (aboutSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animatedStats) {
                animateStats();
                animatedStats = true;
            }
        }, { threshold: 0.3 });

        statsObserver.observe(aboutSection);
    }

    // -----------------------------------------------------------------
    // 7. INTERACTIVIDAD EN HABILIDADES (EFECTO 3D EN TARJETAS)
    // -----------------------------------------------------------------
    const skillCards = document.querySelectorAll('.skill-item');

    skillCards.forEach(card => {
        const icon = card.querySelector('.skill-icon');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;

            if (icon) {
                icon.style.transform = `scale(1.15) rotate(5deg)`;
                icon.style.transition = `transform 0.1s ease-out`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            card.style.transition = 'transform 0.3s ease';
            
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
    });
	
	// -----------------------------------------------------------------
    // 8. FUNCIONALIDAD DE COPIAR AL PORTAPAPELES (CONTACTO)
    // -----------------------------------------------------------------
    const copyButtons = document.querySelectorAll('.btn-copy');
    
    // Crear elemento Toast de notificación si no existe
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = '¡Copiado al portapapeles!';
        document.body.appendChild(toast);
    }

    let toastTimeout;

    copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const textToCopy = btn.getAttribute('data-copy');
            try {
                await navigator.clipboard.writeText(textToCopy);
                
                toast.textContent = `¡Copiado: ${textToCopy}!`;
                toast.classList.add('show');

                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => {
                    toast.classList.remove('show');
                }, 2500);
            } catch (err) {
                console.error('Error al copiar:', err);
            }
        });
    });
	 // -----------------------------------------------------------------
// ANIMACIÓN DE APERTURA (INTRO LOADER)
// -----------------------------------------------------------------
window.addEventListener("load", () => {
    const loader = document.getElementById("intro-loader");
    if (loader) {
        // Pequeño retardo opcional (en milisegundos) para que se luzca la animación
        setTimeout(() => {
            loader.classList.add("fade-out");
        }, 600); // 600 milisegundos = 0.6 segundos
    }
});
});
