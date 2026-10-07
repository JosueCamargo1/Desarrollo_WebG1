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
        rootMargin: "-20% 0px -60% 0px",
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
});

const tiltImages = document.querySelectorAll('.profile-img, .tech-logo');

tiltImages.forEach(img => {
    // Al mover el ratón sobre la imagen
    img.addEventListener('mousemove', (e) => {
        const rect = img.getBoundingClientRect();
        
        // Calcular el centro de la imagen
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Posición relativa del cursor desde el centro (-1 a 1)
        const percentX = (e.clientX - centerX) / (rect.width / 2);
        const percentY = (e.clientY - centerY) / (rect.height / 2);
        
        // Grados de rotación maximos (ajusta a 15-20 si quieres más movimiento)
        const maxRotation = 15; 
        const rotateX = -percentY * maxRotation;
        const rotateY = percentX * maxRotation;

        // Aplica el efecto de rotación y elevación
        img.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
    });

    // Al salir el cursor, restablecer la posición original
    img.addEventListener('mouseleave', () => {
        img.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
});

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
// SISTEMA DE PESTAÑAS Y CONTADORES ANIMADOS 
// -----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                // 1. Quitar la clase 'active' de todos los botones y contenidos
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // 2. Activar el botón presionado
                btn.classList.add('active');

                // 3. Mostrar el contenido correspondiente
                const targetElement = document.getElementById(`tab-${targetTab}`);
                if (targetElement) {
                    targetElement.classList.add('active');
                } else {
                    console.error(`No se encontró el elemento con id: tab-${targetTab}`);
                }
            });
        });
    }

    // Animación de los números de las estadísticas
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
});
// -----------------------------------------------------------------
// INTERACTIVIDAD EN HABILIDADES (EFECTO 3D & MOVIMIENTO EN HOVER)
// -----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const skillCards = document.querySelectorAll('.skill-item');

    skillCards.forEach(card => {
        const icon = card.querySelector('.skill-icon');

        // Movimiento 3D al desplazar el cursor sobre la tarjeta
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Posición X dentro de la tarjeta
            const y = e.clientY - rect.top;  // Posición Y dentro de la tarjeta

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Grados de inclinación
            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;

            // Animación y ligera rotación del icono
            if (icon) {
                icon.style.transform = `scale(1.15) rotate(5deg)`;
                icon.style.transition = `transform 0.1s ease-out`;
            }
        });

        // Restablecer posición original cuando el ratón sale
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            card.style.transition = 'transform 0.3s ease';
            
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
    });
});
