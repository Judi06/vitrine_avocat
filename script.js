/**
 * GESTIONNAIRE PRINCIPAL
 * - Initialise toutes les fonctionnalités du site
 */
document.addEventListener('DOMContentLoaded', function() {
    // Met à jour l'année dans le footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialise le défilement fluide
    initSmoothScrolling();
    
    // Initialise le formulaire de contact
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
 * CARROUSEL D'AVIS - CHARGE LES DONNÉES DEPUIS UN FICHIER JSON EXTERNE
 */
async function initAvisCarousel() {
    const avisTrack = document.getElementById('avis-track');
    if (!avisTrack) return;

    // Afficher un indicateur de chargement
    avisTrack.innerHTML = `
        <div class="avis-card">
            <h3>Chargement des avis</h3>
            <div class="avis-note">
                <i class="fas fa-spinner fa-pulse"></i>
            </div>
            <p>Veuillez patienter pendant le chargement des témoignages...</p>
        </div>
    `;

    try {
        // Chemin vers le fichier JSON - à adapter selon votre structure
        const jsonPath = 'avis-clients-cabinet-avocat/avis.json';
        
        // Chargement asynchrone du fichier JSON
        const response = await fetch(jsonPath);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const avisData = await response.json();
        
        // Vérification de la structure des données
        if (!Array.isArray(avisData)) {
            throw new Error('Format de données invalide: un tableau est attendu');
        }

        // Nettoyage du contenu précédent
        avisTrack.innerHTML = '';

        // Génération des cartes d'avis
        avisData.forEach(avis => {
            // Validation des champs requis
            const nom = avis.nom || 'Anonyme';
            const note = Math.min(Math.max(parseInt(avis.note) || 0, 0), 5); // Note entre 0 et 5
            const commentaire = avis.commentaire || 'Aucun commentaire fourni';

            const avisCard = document.createElement('div');
            avisCard.className = 'avis-card';
            avisCard.innerHTML = `
                <h3>${nom}</h3>
                <div class="avis-note">
                    ${'<i class="fas fa-star filled"></i>'.repeat(note)}
                    ${'<i class="fas fa-star empty"></i>'.repeat(5 - note)}
                </div>
                <p>"${commentaire}"</p>
            `;
            avisTrack.appendChild(avisCard);
        });

        // Initialisation de la navigation du carrousel
        initCarouselNavigation();

    } catch (error) {
        console.error('Erreur lors du chargement des avis:', error);
        
        // Affichage d'un message d'erreur
        avisTrack.innerHTML = `
            <div class="avis-card error-card">
                <h3>Erreur de chargement</h3>
                <div class="avis-note">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p>Nous n'avons pas pu charger les témoignages clients.</p>
                <p class="error-details">${error.message}</p>
            </div>
        `;
    }
}

/**
 * INITIALISE LA NAVIGATION DU CARROUSEL
 */
function initCarouselNavigation() {
    const avisTrack = document.getElementById('avis-track');
    const prevBtn = document.getElementById('prev-avis');
    const nextBtn = document.getElementById('next-avis');
    const cards = document.querySelectorAll('.avis-card');
    
    if (!avisTrack || !prevBtn || !nextBtn || cards.length === 0) return;

    let currentPosition = 0;
    const cardWidth = cards[0].offsetWidth + 32; // 32px pour les marges
    const maxPosition = -((cards.length - 1) * cardWidth);

    // Fonction pour mettre à jour la position
    const updatePosition = () => {
        avisTrack.style.transform = `translateX(${currentPosition}px)`;
    };

    // Gestion des boutons précédent/suivant
    prevBtn.addEventListener('click', () => {
        if (currentPosition < 0) {
            currentPosition += cardWidth;
            updatePosition();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPosition > maxPosition) {
            currentPosition -= cardWidth;
            updatePosition();
        }
    });

    // Auto-défilement
    let autoScrollInterval = setInterval(() => {
        if (currentPosition <= maxPosition) {
            currentPosition = 0;
        } else {
            currentPosition -= cardWidth;
        }
        updatePosition();
    }, 5000);

    // Arrêt de l'auto-défilement au survol
    avisTrack.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });

    avisTrack.addEventListener('mouseleave', () => {
        autoScrollInterval = setInterval(() => {
            if (currentPosition <= maxPosition) {
                currentPosition = 0;
            } else {
                currentPosition -= cardWidth;
            }
            updatePosition();
        }, 5000);
    });
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
        btn.addEventListener('click', (e) => {
            e.preventDefault();
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
            
            // Récupération des données du formulaire
            const formData = new FormData(this);
            const nom = formData.get('name');
            const note = formData.get('note');
            const commentaire = formData.get('comment');
            
            // Validation des données
            if (!nom || !note || !commentaire) {
                showNotification("Veuillez remplir tous les champs du formulaire.", 3000);
                return;
            }
            
            // Simulation d'envoi
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            
            // Simulation de délai pour l'envoi
            setTimeout(() => {
                showNotification("Merci pour votre avis ! Il sera publié après modération.", 4000);
                this.reset();
                modal.style.display = 'none';
                document.body.style.overflow = '';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Ici, vous pourriez ajouter un appel API réel pour enregistrer l'avis
                // enregistrerAvisAPI({ nom, note, commentaire });
                
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
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
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

/**
 * FONCTION POUR ENREGISTRER UN AVIS (EXEMPLE)
 * À implémenter avec votre backend
 */
async function enregistrerAvisAPI(avis) {
    try {
        const response = await fetch('https://votre-api.com/avis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(avis)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de l\'enregistrement');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
}