// Gestion des thèmes
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation
    initTheme();
    initCountdown();
    initSlideshow();
    initMobileNav();
    initFAQ();
    initRSVPForm();
    
    // Mise à jour de la navigation au scroll
    updateActiveNavOnScroll();
    
    // Initialiser le compte à rebours du RSVP
    initRsvpCountdown();
});

// Gestion des thèmes
function initTheme() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;
    
    // Récupérer le thème sauvegardé ou utiliser le thème romantique par défaut
    const savedTheme = localStorage.getItem('weddingTheme') || 'romantique';
    setTheme(savedTheme);
    
    // Ajouter les écouteurs d'événements aux boutons de thème
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
            
            // Sauvegarder le thème
            localStorage.setItem('weddingTheme', theme);
        });
    });
}

function setTheme(theme) {
    const body = document.body;
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    // Supprimer toutes les classes de thème
    body.classList.remove('theme-romantique', 'theme-epure', 'theme-moderne', 'theme-nature');
    
    // Ajouter la classe du thème sélectionné
    body.classList.add(`theme-${theme}`);
    
    // Mettre à jour les boutons actifs
    themeButtons.forEach(button => {
        if (button.getAttribute('data-theme') === theme) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Compte à rebours - VERSION AMÉLIORÉE
function initCountdown() {
    // Date du mariage : 24 mai 2026 à 14h30 (heure de la cérémonie civile)
    const weddingDate = new Date('May 24, 2026 14:30:00').getTime();
    
    // Mettre à jour le compte à rebours toutes les secondes
    const countdownInterval = setInterval(function() {
        updateCountdown(weddingDate);
    }, 1000);
    
    // Mettre à jour immédiatement
    updateCountdown(weddingDate);
}

function updateCountdown(weddingDate) {
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;
    
    // Si le compte à rebours est terminé
    if (timeLeft < 0) {
        clearInterval(countdownInterval);
        document.querySelector('.countdown').innerHTML = `
            <div class="countdown-ended">
                <h3>Le grand jour est arrivé !</h3>
                <p>Merci à tous d'avoir partagé ce moment avec nous.</p>
            </div>
        `;
        
        // Mettre à jour le footer
        const footerDays = document.getElementById('footer-days');
        if (footerDays) {
            footerDays.textContent = "0";
        }
        
        return;
    }
    
    // Calculer les jours, heures, minutes, secondes
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // Mettre à jour les éléments avec effet de flip
    updateFlipCard('days', days);
    updateFlipCard('hours', hours);
    updateFlipCard('minutes', minutes);
    updateFlipCard('seconds', seconds);
    
    // Mettre à jour le footer
    const footerDays = document.getElementById('footer-days');
    if (footerDays) {
        footerDays.textContent = days;
    }
}

function updateFlipCard(type, value) {
    const flipCard = document.querySelector(`.flip-card[data-type="${type}"]`);
    if (!flipCard) return;
    
    const currentTop = flipCard.querySelector('.flip-top');
    const currentBottom = flipCard.querySelector('.flip-bottom');
    const nextTop = flipCard.querySelector('.flip-top-next');
    
    const currentValue = parseInt(currentTop.textContent);
    const formattedValue = value < 10 ? `0${value}` : `${value}`;
    const formattedCurrent = currentValue < 10 ? `0${currentValue}` : `${currentValue}`;
    
    // Si la valeur a changé, déclencher l'animation
    if (value !== currentValue) {
        // Mettre à jour la valeur suivante
        nextTop.textContent = formattedValue;
        
        // Déclencher l'animation
        flipCard.classList.add('flipping');
        
        // Après l'animation, mettre à jour les valeurs et retirer la classe d'animation
        setTimeout(() => {
            currentTop.textContent = formattedValue;
            currentBottom.textContent = formattedValue;
            flipCard.classList.remove('flipping');
        }, 600);
    }
}

// Compte à rebours pour la date limite RSVP
function initRsvpCountdown() {
    // Date limite RSVP : 24 avril 2026
    const rsvpDeadline = new Date('April 24, 2026 23:59:59').getTime();
    
    // Mettre à jour le compte à rebours RSVP
    updateRsvpCountdown(rsvpDeadline);
    
    // Mettre à jour toutes les 24 heures
    setInterval(function() {
        updateRsvpCountdown(rsvpDeadline);
    }, 24 * 60 * 60 * 1000);
}

function updateRsvpCountdown(rsvpDeadline) {
    const now = new Date().getTime();
    const timeLeft = rsvpDeadline - now;
    
    // Si la date limite est passée
    if (timeLeft < 0) {
        const rsvpDaysElement = document.getElementById('rsvp-days-left');
        if (rsvpDaysElement) {
            rsvpDaysElement.textContent = "0";
        }
        return;
    }
    
    // Calculer les jours restants
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    
    // Mettre à jour l'élément
    const rsvpDaysElement = document.getElementById('rsvp-days-left');
    if (rsvpDaysElement) {
        rsvpDaysElement.textContent = daysLeft;
    }
}

// Galerie slideshow
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.slide-nav.prev');
    const nextBtn = document.querySelector('.slide-nav.next');
    let currentSlide = 0;
    let slideInterval;
    
    // Fonction pour afficher un slide spécifique
    function showSlide(index) {
        // Masquer tous les slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Désactiver tous les indicateurs
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Afficher le slide sélectionné
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }
    
    // Fonction pour passer au slide suivant
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    }
    
    // Fonction pour passer au slide précédent
    function prevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1;
        }
        showSlide(prevIndex);
    }
    
    // Ajouter les écouteurs d'événements
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Ajouter les écouteurs d'événements aux indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            resetInterval();
        });
    });
    
    // Fonction pour redémarrer l'intervalle
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }
    
    // Fonction pour démarrer l'intervalle automatique
    function startInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Démarrer l'intervalle automatique
    startInterval();
    
    // Arrêter l'intervalle lorsque l'utilisateur interagit avec le slideshow
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slideshowContainer.addEventListener('mouseleave', () => {
            startInterval();
        });
    }
}

// Navigation mobile
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (!hamburger || !navMenu || !menuOverlay) return;
    
    // Ouvrir/fermer le menu hamburger
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fermer le menu en cliquant sur l'overlay
    menuOverlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        this.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Fermer le menu en cliquant sur un lien
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Navigation inférieure pour mobile
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function() {
            bottomNavItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Section FAQ avec accordéon
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Fermer toutes les autres réponses
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('active');
                }
            });
            
            // Basculer l'état actif pour cette question
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            answer.classList.toggle('active');
        });
    });
}

// Formulaire RSVP
function initRSVPForm() {
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    const newResponseBtn = document.getElementById('newResponse');
    
    if (!rsvpForm) return;
    
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les valeurs du formulaire
        const name = document.getElementById('guest-name').value;
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        
        // Mettre à jour les statistiques
        updateStats(attendance);
        
        // Afficher le message de succès
        rsvpForm.classList.add('hidden');
        rsvpSuccess.classList.remove('hidden');
        
        // Réinitialiser le formulaire (en arrière-plan)
        rsvpForm.reset();
    });
    
    // Bouton pour une nouvelle réponse
    if (newResponseBtn) {
        newResponseBtn.addEventListener('click', function() {
            rsvpForm.classList.remove('hidden');
            rsvpSuccess.classList.add('hidden');
        });
    }
}

function updateStats(attendance) {
    // Mettre à jour les statistiques en temps réel (simulation)
    const confirmedElement = document.getElementById('confirmed-invites');
    const pendingElement = document.getElementById('pending-invites');
    const declinedElement = document.getElementById('declined-invites');
    
    if (!confirmedElement || !pendingElement || !declinedElement) return;
    
    let confirmed = parseInt(confirmedElement.textContent);
    let pending = parseInt(pendingElement.textContent);
    let declined = parseInt(declinedElement.textContent);
    
    if (attendance === 'yes') {
        confirmed++;
        pending--;
    } else if (attendance === 'no') {
        declined++;
        pending--;
    }
    
    // Mettre à jour les éléments
    confirmedElement.textContent = confirmed;
    pendingElement.textContent = pending;
    declinedElement.textContent = declined;
    
    // Mettre à jour la barre de progression
    const total = parseInt(document.getElementById('total-invites').textContent);
    const progressPercent = Math.round((confirmed + declined) / total * 100);
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText) {
        progressFill.style.width = `${progressPercent}%`;
        progressText.textContent = `${progressPercent}% de réponses reçues`;
    }
}

// Mise à jour de la navigation active au défilement
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a, .bottom-nav .nav-item');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === current) {
                link.classList.add('active');
            }
        });
    });
}

// Animation d'entrée pour les éléments
window.addEventListener('load', function() {
    // Ajouter une classe au body pour les animations
    document.body.classList.add('loaded');
    
    // Animation d'entrée pour les éléments
    const animatedElements = document.querySelectorAll('.hero-title, .hero-subtitle, .countdown-container, .hero-message, .btn-primary');
    
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
        element.classList.add('fade-in-up');
    });
    
    // Ajouter des styles d'animation si non déjà présents
    if (!document.querySelector('#animation-styles')) {
        const animationStyle = document.createElement('style');
        animationStyle.id = 'animation-styles';
        animationStyle.textContent = `
            .fade-in-up {
                animation: fadeInUp 0.8s ease forwards;
                opacity: 0;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            body.loaded .hero-title,
            body.loaded .hero-subtitle,
            body.loaded .countdown-container,
            body.loaded .hero-message,
            body.loaded .btn-primary {
                animation: fadeInUp 0.8s ease forwards;
            }
        `;
        document.head.appendChild(animationStyle);
    }
});