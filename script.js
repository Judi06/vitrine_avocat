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
                
                // Optionnel : Redirection après envoi
                // window.location.href = '/merci.html';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de l\'envoi');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showNotification(`Erreur: ${error.message || "Veuillez nous contacter directement par téléphone."}`, 6000);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    // Configuration supplémentaire
    contactForm.insertAdjacentHTML('beforeend', `
        <input type="hidden" name="_next" value="https://votresite.com/merci.html">
        <input type="hidden" name="_format" value="plain">
    `);
}

/**
 * CARROUSEL D'AVIS NOTARIAUX MULTILINGUES
 */
function initAvisCarousel() {
    const avisTrack = document.getElementById('avis-track');
    if (!avisTrack) return;

    // Données simulées - 70 avis (10 par langue)
    const avisData = [
        // Français (10 avis)
        {
            nom: "Marie D.",
            note: 5,
            commentaire: "Maître Dupont a géré notre succession familiale avec professionnalisme et humanité. Tout était parfait."
        },
        {
            nom: "Pierre L.",
            note: 5,
            commentaire: "Excellente expertise en droit immobilier. Notre achat s'est déroulé sans le moindre problème."
        },
        {
            nom: "Sophie T.",
            note: 4,
            commentaire: "Bon accompagnement pour notre contrat de mariage. Quelques délais mais résultat satisfaisant."
        },
        {
            nom: "Antoine R.",
            note: 5,
            commentaire: "Notaire très compétent pour les donations. A su nous conseiller judicieusement."
        },
        {
            nom: "Élodie M.",
            note: 5,
            commentaire: "Gestion impeccable de notre acte de vente. Explications claires et précises."
        },
        {
            nom: "Thomas B.",
            note: 5,
            commentaire: "A réglé un litige successoral complexe avec brio. Je recommande vivement."
        },
        {
            nom: "Camille V.",
            note: 4,
            commentaire: "Bon notaire pour notre PACS. Un peu formaliste mais très rigoureux."
        },
        {
            nom: "Nicolas P.",
            note: 5,
            commentaire: "A rédigé notre testament avec une grande précision juridique. Très rassurant."
        },
        {
            nom: "Laura F.",
            note: 5,
            commentaire: "Excellent conseil pour l'achat de notre résidence secondaire. À l'écoute et disponible."
        },
        {
            nom: "Marc S.",
            note: 5,
            commentaire: "Gestion notariale irréprochable pour la vente de notre commerce. Professionnalisme exemplaire."

        // Anglais (10 avis)
        },
        {
            nom: "John S.",
            note: 5,
            commentaire: "Handled our French property purchase flawlessly. Exceptional knowledge of international law."
        },
        {
            nom: "Emma W.",
            note: 5,
            commentaire: "Perfect notary for our marriage contract in France. Explained everything clearly in English."
        },
        {
            nom: "Michael B.",
            note: 4,
            commentaire: "Good service for our inheritance matters. Some delays but good final result."
        },
        {
            nom: "Sarah K.",
            note: 5,
            commentaire: "Saved us from a bad property deal. Incredible attention to detail!"
        },
        {
            nom: "David L.",
            note: 5,
            commentaire: "Best notary in Paris for expats. Multilingual and extremely competent."
        },
        {
            nom: "Jennifer M.",
            note: 5,
            commentaire: "Managed our complex French succession perfectly. Worth every euro."
        },
        {
            nom: "Robert T.",
            note: 4,
            commentaire: "Solid advice for our French will. Took time to explain everything."
        },
        {
            nom: "Olivia P.",
            note: 5,
            commentaire: "Exceptional service for our property sale. Everything went smoothly."
        },
        {
            nom: "James H.",
            note: 5,
            commentaire: "Precise and professional for our French donation. Highly recommend."
        },
        {
            nom: "Sophia R.",
            note: 5,
            commentaire: "Made French notarial procedures understandable. Lifesaver for foreigners!"

        // Espagnol (10 avis)
        },
        {
            nom: "Carlos M.",
            note: 5,
            commentaire: "Excelente notario para nuestra compra en París. Todo perfectamente explicado en español."
        },
        {
            nom: "Isabel G.",
            note: 5,
            commentaire: "Gestión impecable de nuestra herencia francesa. Muy profesional."
        },
        {
            nom: "Javier L.",
            note: 4,
            commentaire: "Buen servicio para nuestro contrato matrimonial. Algún retraso menor."
        },
        {
            nom: "Elena R.",
            note: 5,
            commentaire: "Resolvió un problema complejo con nuestra propiedad. ¡Recomendado 100%!"
        },
        {
            nom: "Miguel S.",
            note: 5,
            commentaire: "Habla español perfectamente. Nos ayudó mucho con la compra de nuestro piso."
        },
        {
            nom: "Lucía D.",
            note: 5,
            commentaire: "Asesoramiento perfecto para nuestro testamento francés. Muy detallista."
        },
        {
            nom: "Alejandro P.",
            note: 5,
            commentaire: "Gran conocimiento del derecho internacional. Nos guió perfectamente."
        },
        {
            nom: "Carmen V.",
            note: 4,
            commentaire: "Buen notario para la venta de nuestra propiedad. Un poco lento pero seguro."
        },
        {
            nom: "Diego C.",
            note: 5,
            commentaire: "Proceso de donación muy fluido gracias a su ayuda. Excelente servicio."
        },
        {
            nom: "Patricia M.",
            note: 5,
            commentaire: "Nos evitó muchos problemas con su expertise. ¡Gracias por todo!"

        // Italien (10 avis)
        },
        {
            nom: "Marco R.",
            note: 5,
            commentaire: "Servizio notarile eccellente per il nostro acquisto a Parigi. Parla italiano perfettamente."
        },
        {
            nom: "Giulia B.",
            note: 4,
            commentaire: "Buona esperienza per il nostro contratto di matrimonio. Professionale e attento."
        },
        {
            nom: "Luca F.",
            note: 5,
            commentaire: "Ha gestito la nostra successione in Francia con grande competenza. Consigliatissimo!"
        },
        {
            nom: "Sofia M.",
            note: 5,
            commentaire: "Risolto un problema complicato con la nostra proprietà. Molto grata per l'aiuto."
        },
        {
            nom: "Antonio C.",
            note: 5,
            commentaire: "Consigli preziosi per la nostra donazione. Servizio impeccabile."
        },
        {
            nom: "Elena D.",
            note: 5,
            commentaire: "Perfetta conoscenza del diritto francese e italiano. Ci ha guidato passo passo."
        },
        {
            nom: "Paolo S.",
            note: 4,
            commentaire: "Un po' formale ma molto competente. Buona esperienza complessiva."
        },
        {
            nom: "Francesca L.",
            note: 5,
            commentaire: "Attenzione ai dettagli eccezionale. Ci ha protetto da molti rischi."
        },
        {
            nom: "Roberto V.",
            note: 5,
            commentaire: "Il miglior notaio per italiani in Francia. Paziente e chiaro nelle spiegazioni."
        },
        {
            nom: "Alessia P.",
            note: 5,
            commentaire: "Grazie per aver reso semplice un processo complesso. Servizio eccellente."

        // Allemand (10 avis)
        },
        {
            nom: "Hans M.",
            note: 5,
            commentaire: "Ausgezeichneter Notar für unseren Immobilienkauf in Paris. Alles perfekt erklärt auf Deutsch."
        },
        {
            nom: "Anna S.",
            note: 5,
            commentaire: "Hervorragende Beratung für unser französisches Testament. Sehr professionell."
        },
        {
            nom: "Thomas W.",
            note: 4,
            commentaire: "Gute Erfahrung mit unserem Ehevertrag. Etwas langsam aber gründlich."
        },
        {
            nom: "Claudia B.",
            note: 5,
            commentaire: "Komplexe Erbschaftsangelegenheit bestens gelöst. Vielen Dank!"
        },
        {
            nom: "Dieter K.",
            note: 5,
            commentaire: "Perfekte Deutschkenntnisse. Hat uns bei der Schenkung optimal beraten."
        },
        {
            nom: "Petra H.",
            note: 5,
            commentaire: "Absolute Empfehlung! Unser Hausverkauf verlief reibungslos dank seiner Hilfe."
        },
        {
            nom: "Wolfgang F.",
            note: 5,
            commentaire: "Besonders kompetent in internationalem Recht. Hat uns viel Ärger erspart."
        },
        {
            nom: "Sabine L.",
            note: 4,
            commentaire: "Guter Service, etwas teuer aber das Ergebnis stimmte. Zufrieden."
        },
        {
            nom: "Klaus P.",
            note: 5,
            commentaire: "Schnell und präzise bei unserem Grundstückskauf. Perfekt für Deutsche in Frankreich."
        },
        {
            nom: "Ursula R.",
            note: 5,
            commentaire: "Habe mich bestens aufgehoben gefühlt. Kompetent und freundlich."

        // Lituanien (10 avis)
        },
        {
            nom: "Tomas K.",
            note: 5,
            commentaire: "Puikus notaras mūsų namo pirkimui Paryžiuje. Kalba lietuviškai - didelis pliusas!"
        },
        {
            nom: "Lina B.",
            note: 4,
            commentaire: "Gera patirtis dėl mūsų testamento. Šiek tiek lėta, bet profesionalu."
        },
        {
            nom: "Darius P.",
            note: 5,
            commentaire: "Išsprendė sudėtingą paveldėjimo bylą. Labai dėkoju už profesionalumą."
        },
        {
            nom: "Rasa L.",
            note: 5,
            commentaire: "Patyręs notaras tarptautinėse bylose. Padėjo išvengti daug problemų."
        },
        {
            nom: "Marius S.",
            note: 5,
            commentaire: "Rekomenduoju visiems lietuviams Paryžiuje. Puikios paslaugos lietuvių kalba."
        },
        {
            nom: "Eglė M.",
            note: 5,
            commentaire: "Išsamiai paaiškino visus dokumentus. Jaučiausi saugiai."
        },
        {
            nom: "Andrius K.",
            note: 5,
            commentaire: "Padėjo įsigyti butą Paryžiuje. Viską sutvarkė greitai ir profesionaliai."
        },
        {
            nom: "Giedrė L.",
            note: 4,
            commentaire: "Gerai, bet kai kurie dokumentai užtruko. Galiausiai viskas pavyko."
        },
        {
            nom: "Kęstutis P.",
            note: 5,
            commentaire: "Tobula patirtis. Notaras supranta lietuvių poreikius."
        },
        {
            nom: "Aistė V.",
            note: 5,
            commentaire: "Dėkoju už profesionalų požiūrį ir lietuvišką aptarnavimą."

        // Portugais (10 avis)
        },
        {
            nom: "João S.",
            note: 5,
            commentaire: "Notário excelente para a compra do nosso apartamento em Paris. Fala português fluentemente."
        },
        {
            nom: "Ana L.",
            note: 5,
            commentaire: "Gestão impecável da nossa herança francesa. Muito profissional e atencioso."
        },
        {
            nom: "Carlos M.",
            note: 4,
            commentaire: "Bom serviço para o nosso contrato de casamento. Algum atraso mas resultado satisfatório."
        },
        {
            nom: "Sofia R.",
            note: 5,
            commentaire: "Resolveu um problema complexo com a nossa propriedade. Recomendo sem dúvidas!"
        },
        {
            nom: "Miguel P.",
            note: 5,
            commentaire: "Conhecimento excecional do direito internacional. Orientou-nos perfeitamente."
        },
        {
            nom: "Inês T.",
            note: 5,
            commentaire: "Aconselhamento perfeito para o nosso testamento. Muito detalhista e claro."
        },
        {
            nom: "Pedro G.",
            note: 5,
            commentaire: "Processo de doação muito tranquilo graças à sua ajuda. Serviço excelente."
        },
        {
            nom: "Beatriz F.",
            note: 4,
            commentaire: "Bom notário para a venda da nossa propriedade. Um pouco formal mas eficiente."
        },
        {
            nom: "Rui C.",
            note: 5,
            commentaire: "Evitou-nos muitos problemas com a sua experiência. Obrigado por tudo!"
        },
        {
            nom: "Teresa M.",
            note: 5,
            commentaire: "Melhor notário para portugueses em Paris. Paciente e claro nas explicações."
        }
    ];

    // Mélanger aléatoirement les avis
    for (let i = avisData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [avisData[i], avisData[j]] = [avisData[j], avisData[i]];
    }

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

    // Initialisation de la navigation du carrousel
    const prevBtn = document.getElementById('prev-avis');
    const nextBtn = document.getElementById('next-avis');
    const cards = document.querySelectorAll('.avis-card');
    let currentPosition = 0;
    const cardWidth = cards[0]?.offsetWidth + 32 || 300;

    if (prevBtn && nextBtn && cards.length > 0) {
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
    if (cards.length > 0) {
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
}

/**
 * MÉLANGER UN TABLEAU ALÉATOIREMENT (FONCTION UTILITAIRE)
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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