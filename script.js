// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Fonction pour afficher une notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Gestion du formulaire principal avec FormSubmit
document.getElementById('form-contact').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Envoi des données à FormSubmit
    const form = e.target;
    const formData = new FormData(form);
    
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showNotification("Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.");
            form.reset();
        } else {
            throw new Error('Erreur lors de l\'envoi');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification("Une erreur s'est produite. Veuillez nous contacter directement par téléphone.");
    });
});

// Gestion du formulaire d'avis
document.getElementById('avis-form').addEventListener('submit', function(e) {
    e.preventDefault();
    showNotification("Merci pour votre avis ! Il sera publié après modération.");
    this.reset();
    document.getElementById('avis-modal').style.display = 'none';
});

// Gestion du modal d'avis
const modal = document.getElementById('avis-modal');
const openModalBtns = document.querySelectorAll('#open-avis-modal, #open-avis-modal-mobile');
const closeModal = document.querySelector('.close-modal');

openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modal.style.display = 'block';
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Simulation de chargement des avis
function chargerAvis() {
    setTimeout(() => {
        const avisTrack = document.getElementById('avis-track');
        avisTrack.innerHTML = '';
        
        // Données simulées (remplacer par un appel API réel si nécessaire)
        const avisSimules = [
            { nom: "Marie D.", note: 5, commentaire: "Professionnalisme exceptionnel. Maître Dupont a résolu mon problème commercial en un temps record." },
            { nom: "Pierre L.", note: 4, commentaire: "Très bon conseil en droit fiscal. Explications claires et précises." },
            { nom: "Sophie T.", note: 5, commentaire: "Accompagnement personnalisé tout au long de la création de ma société. Je recommande vivement !" }
        ];
        
        avisSimules.forEach(avis => {
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
        
        initCarrousel();
    }, 1500);
}

// Initialisation du carrousel
function initCarrousel() {
    const avisTrack = document.getElementById('avis-track');
    const avisCards = document.querySelectorAll('.avis-card');
    if (avisCards.length === 0) return;
    
    const cardWidth = avisCards[0].offsetWidth + 32;
    let currentPosition = 0;
    const maxPosition = -(cardWidth * (avisCards.length - 1));

    document.getElementById('next-avis').addEventListener('click', () => {
        if (currentPosition > maxPosition) {
            currentPosition -= cardWidth;
            avisTrack.style.transform = `translateX(${currentPosition}px)`;
        }
    });

    document.getElementById('prev-avis').addEventListener('click', () => {
        if (currentPosition < 0) {
            currentPosition += cardWidth;
            avisTrack.style.transform = `translateX(${currentPosition}px)`;
        }
    });

    // Auto-défilement
    setInterval(() => {
        if (currentPosition <= maxPosition) {
            currentPosition = 0;
        } else {
            currentPosition -= cardWidth;
        }
        avisTrack.style.transform = `translateX(${currentPosition}px)`;
    }, 5000);
}

// Charge les avis au chargement de la page
document.addEventListener('DOMContentLoaded', chargerAvis);