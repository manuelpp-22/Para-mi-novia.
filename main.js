document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bgMusic');

    // --- Animación de entrada general ---
    const animateIn = (selector) => {
        gsap.to(selector, {
            duration: 1.5,
            opacity: 1,
            y: 0,
            ease: 'power3.out',
            delay: 0.5,
            stagger: 0.2
        });
    };

    // --- Función de navegación con FADE ---
    const navigateWithFade = (url) => {
        // Desvanecer el contenido de la página actual
        gsap.to('main.container > *', { duration: 0.8, opacity: 0, ease: 'power2.in' });

        // Desvanecer la música actual
        if (bgMusic && bgMusic.volume > 0) {
            gsap.to(bgMusic, {
                duration: 1,
                volume: 0,
                ease: 'linear',
                onComplete: () => { window.location.href = url; }
            });
        } else {
            // Si no hay música, solo espera a que la animación termine
            setTimeout(() => { window.location.href = url; }, 800);
        }
    };

    // --- Lógica por página ---
    const pageClass = document.body.className;

    // 1. PÁGINA DE LOGIN
    if (pageClass.includes('page-login')) {
        const welcomeOverlay = document.getElementById('welcomeOverlay');
        const loginBox = document.querySelector('.login-box');
        gsap.set(loginBox, { opacity: 0 }); // Ocultar formulario al inicio

        const startExperience = () => {
            gsap.to(welcomeOverlay, {
                duration: 1,
                opacity: 0,
                ease: 'power2.inOut',
                onComplete: () => { welcomeOverlay.style.display = 'none'; }
            });

            if (bgMusic) {
                bgMusic.volume = 0;
                bgMusic.play().catch(error => console.log("Error al reproducir audio:", error));
                gsap.to(bgMusic, { duration: 4, volume: 0.7, ease: 'linear' });
            }
            animateIn('.login-box');
        };

        welcomeOverlay.addEventListener('click', startExperience, { once: true });

        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            navigateWithFade('bts-world.html');
        });
    }

    // 2. PÁGINA TEMÁTICA BTS
    if (pageClass.includes('page-bts')) {
        animateIn('.content-box');

         // Intentamos reproducir la música y manejamos cualquier error.
         const playPromise = bgMusic.play();
         if (playPromise !== undefined) {
             playPromise.then(_ => {
                 // La reproducción comenzó correctamente, ahora hacemos el fade-in.
                 bgMusic.volume = 0;
                 gsap.to(bgMusic, { duration: 2, volume: 0.7, ease: 'linear' });
             }).catch(error => {
                 // Si falla, lo mostramos en la consola para saber por qué.
                 console.error("Error al reproducir música en la página 2. Revisa la consola (F12) para ver el detalle. Causa más probable: ruta/nombre de archivo incorrecto o política de autoplay del navegador.", error);
             });
         }

        const link = document.getElementById('navigateToLetters');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateWithFade(link.href);
            });
        }
    }

    // 3. PÁGINA DE CARTAS
    if (pageClass.includes('page-letters')) {
        const letters = [
            "Para la chica que ilumina mis días...",
            "¿Recuerdas la primera vez que reímos juntos hasta llorar? Atesoro ese momento.",
            "Me encanta cómo te emocionas con las canciones de BTS. Tu pasión es contagiosa.",
            "Cada día a tu lado es mi 'Magic Shop' personal, un lugar donde encuentro consuelo.",
            "Gracias por ser mi 'Serendipity', el hallazgo más hermoso de mi vida.",
            "Tu sonrisa tiene el poder de convertir un 'Spring Day' frío en el día más cálido.",
            "Prometo ser tu refugio, tu amigo y tu fan número uno, siempre.",
            "Amo nuestras noches de películas, nuestras conversaciones sin fin y tu forma de ver el mundo.",
            "Eres más brillante que cualquier 'Dynamite'.",
            "Y esto es solo el comienzo de nuestra historia..."
        ];
        let currentLetterIndex = 0;

        const letterTextEl = document.getElementById('letterText');
        const letterCounterEl = document.getElementById('letterCounter');
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');

        if (bgMusic) {
            bgMusic.volume = 0;
            bgMusic.play().catch(() => {});
            gsap.to(bgMusic, { duration: 2, volume: 0.7, ease: 'linear' });
        }

        const showLetter = (index) => {
            gsap.to(letterTextEl, {
                duration: 0.5,
                opacity: 0,
                y: -10,
                ease: 'power2.in',
                onComplete: () => {
                    letterTextEl.textContent = letters[index];
                    letterCounterEl.textContent = `${index + 1} / ${letters.length}`;
                    gsap.to(letterTextEl, { duration: 0.5, opacity: 1, y: 0, ease: 'power2.out' });
                }
            });
            prevBtn.style.opacity = index === 0 ? '0.5' : '1';
            prevBtn.disabled = index === 0;
            nextBtn.textContent = (index === letters.length - 1) ? 'Ver la sorpresa final' : 'Siguiente';
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentLetterIndex < letters.length - 1) {
                    currentLetterIndex++;
                    showLetter(currentLetterIndex);
                } else {
                    navigateWithFade('finale.html');
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentLetterIndex > 0) {
                    currentLetterIndex--;
                    showLetter(currentLetterIndex);
                }
            });
        }

        showLetter(0);
        animateIn('.letter-carousel');
    }

    // 4. PÁGINA FINAL
    if (pageClass.includes('page-finale')) {
        const stars = [];
        const starrySky = document.querySelector('.starry-sky');
        for (let i = 0; i < 150; i++) { // Aumenté un poco el número de estrellas para un mejor efecto
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 3 + 1; // Hacemos las estrellas un poco más visibles
            star.style.width = `${size}px`;
            star.style.height = star.style.width;
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            // Guardamos un valor de "profundidad" para el efecto parallax
            star.dataset.depth = Math.random() * 0.5 + 0.2;
            starrySky.appendChild(star);
            stars.push(star);
        }

        // --- EFECTO PARALLAX CON EL RATÓN ---
        const handleMouseMove = (event) => {
            const { clientX, clientY } = event;
            const { innerWidth, innerHeight } = window;
            // Normalizamos la posición del ratón (-1 a 1)
            const moveX = (clientX / innerWidth - 0.5) * 2;
            const moveY = (clientY / innerHeight - 0.5) * 2;

            stars.forEach(star => {
                const depth = star.dataset.depth;
                gsap.to(star, { x: -moveX * 25 * depth, y: -moveY * 25 * depth, duration: 1, ease: 'power2.out' });
            });
        };

        if (bgMusic) {
            bgMusic.volume = 0;
            bgMusic.play().catch(() => {});
            gsap.to(bgMusic, { duration: 4, volume: 0.7, ease: 'linear' });
        }

        const finalMessage = "Tú eres mi universo";
        const titleEl = document.querySelector('.page-finale .title');

        animateIn('.final-message');
        // Asegúrate de tener TextPlugin.min.js en tus HTML para que esto funcione
        gsap.to(titleEl, { duration: 4, text: finalMessage, ease: "none", delay: 1.5 });

        window.addEventListener('mousemove', handleMouseMove);
    }
});

