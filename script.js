/**
 * GESTIONNAIRE PRINCIPAL
 * - Initialise toutes les fonctionnalités du site
 */
document.addEventListener('DOMContentLoaded', function() {
    // Met à jour l'année dans le footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialise le défilement fluide
    initSmoothScrolling();
    
    // Initialise le formulaire de contact (remplace initGoogleForm)
    initContactForm();
    
    // Initialise le carrousel d'avis
    initAvisCarousel();
    
    // Initialise les modals
    initModals();
    
    // Initialise les notifications
    initNotifications();
});

/**
 * DÉFILEMENT FLUIDE
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * FORMULAIRE DE CONTACT AVEC FORMSPREE
 */
function initContactForm() {
    const contactForm = document.getElementById('form-contact');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Feedback visuel
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        
        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showNotification("Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.", 6000);
                this.reset();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de l\'envoi');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showNotification("Une erreur technique est survenue. Veuillez nous contacter directement par téléphone.", 6000);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
    
    // Configuration spécifique Formspree
    contactForm.action = 'https://formspree.io/f/your_formspree_id';
    contactForm.insertAdjacentHTML('afterbegin', `
        <input type="hidden" name="_subject" value="Nouveau message du site cabinet-avocat">
        <input type="text" name="_gotcha" style="display:none">
    `);
}

/**
 * CARROUSEL D'AVIS
 */
function initAvisCarousel() {
    const avisTrack = document.getElementById('avis-track');
    if (!avisTrack) return;
    
    // Simulation de données (remplacer par un appel API réel)
    const avisData = [
        {
            nom: "Marie D.",
            note: 5,
            commentaire: "Maître Dupont a résolu mon litige commercial avec une efficacité remarquable. Professionnalisme exemplaire."
        },
        {
            nom: "Pierre L.",
            note: 4,
            commentaire: "Conseils fiscaux très pertinents qui m'ont permis d'optimiser ma structure. Je recommande."
        },
        {
            nom: "Sophie T.",
            note: 5,
            commentaire: "Accompagnement personnalisé lors de la création de ma SASU. Un suivi irréprochable."
        }
    ];
    
    // Génération des cartes d'avis
    avisTrack.innerHTML = '';
    avisData.forEach(avis => {
        const avisCard = document.createElement('div');
        avisCard.className = 'avis-card';
        avisCard.innerHTML = `
            <h3>${avis.nom}</h3>
            <div class="avis-note">
                ${'<i class="fas fa-star filled"></i>'.repeat(avis.note)}
                ${'<i class="fas fa-star empty"></i>'.repeat(5 - avis.note)}
            </div>
            <p>"${avis.commentaire}"</p>
        `;
        avisTrack.appendChild(avisCard);
    });
    
    // Navigation du carrousel
    const prevBtn = document.getElementById('prev-avis');
    const nextBtn = document.getElementById('next-avis');
    const cards = document.querySelectorAll('.avis-card');
    let currentPosition = 0;
    const cardWidth = cards[0].offsetWidth + 32; // 32px pour les marges
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPosition < 0) {
                currentPosition += cardWidth;
                avisTrack.style.transform = `translateX(${currentPosition}px)`;
            }
        });
        
        nextBtn.addEventListener('click', () => {
            const maxPosition = -((cards.length - 1) * cardWidth);
            if (currentPosition > maxPosition) {
                currentPosition -= cardWidth;
                avisTrack.style.transform = `translateX(${currentPosition}px)`;
            }
        });
    }
    
    // Auto-défilement
    setInterval(() => {
        const maxPosition = -((cards.length - 1) * cardWidth);
        if (currentPosition <= maxPosition) {
            currentPosition = 0;
        } else {
            currentPosition -= cardWidth;
        }
        avisTrack.style.transform = `translateX(${currentPosition}px)`;
    }, 5000);
}

/**
 * GESTION DES MODALS
 */
function initModals() {
    const modal = document.getElementById('avis-modal');
    if (!modal) return;
    
    const openModalBtns = document.querySelectorAll('#open-avis-modal, #open-avis-modal-mobile');
    const closeModal = document.querySelector('.close-modal');
    
    // Ouverture du modal
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Fermeture du modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    // Fermeture en cliquant à l'extérieur
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Gestion du formulaire d'avis
    const avisForm = document.getElementById('avis-form');
    if (avisForm) {
        avisForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulation d'envoi
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            
            setTimeout(() => {
                showNotification("Merci pour votre avis ! Il sera publié après modération.");
                this.reset();
                modal.style.display = 'none';
                document.body.style.overflow = '';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        });
    }
}

/**
 * NOTIFICATIONS
 */
function initNotifications() {
    window.showNotification = function(message, duration = 5000) {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.textContent = message;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, duration);
    };
}

/**
 * FALLBACK POUR LES NAVIGATEURS ANCIENS
 */
if (!('scrollBehavior' in document.documentElement.style)) {
    import('smoothscroll-polyfill').then(module => {
        module.polyfill();
    });
}