// Main JavaScript functionality for the landing page
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize forms
    initializeEmailSignup();
    initializeSurveyModal();
    initializeContactForm();
    
    // Initialize Google Analytics if available
    if (typeof gtag !== 'undefined') {
        // Track page view
        gtag('event', 'page_view', {
            page_title: 'Landing Page',
            page_location: window.location.href
        });
    }
});

// Email signup functionality
function initializeEmailSignup() {
    const emailForm = document.getElementById('email-signup-form');
    const emailInput = document.getElementById('email-input');
    const signupButton = document.getElementById('signup-button');
    
    if (emailForm) {
        emailForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            if (!isValidEmail(email)) {
                showMessage('Proszę wprowadzić poprawny adres e-mail', 'error');
                return;
            }
            
            // Disable form during submission
            signupButton.disabled = true;
            signupButton.textContent = 'Zapisywanie...';
            
            try {
                // Save to Firebase
                const result = await window.firebaseDB.saveEmailSignup(email, 'landing-page');
                
                if (result.success) {
                    showMessage('Dziękujemy! Zostałeś zapisany na listę oczekujących.', 'success');
                    emailInput.value = '';
                    
                    // Track conversion in Google Analytics
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'signup', {
                            event_category: 'engagement',
                            event_label: 'email_signup'
                        });
                    }
                    
                    // Show survey modal after successful signup
                    setTimeout(() => {
                        showSurveyModal(email);
                    }, 2000);
                    
                } else {
                    showMessage('Wystąpił błąd. Spróbuj ponownie.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Wystąpił błąd. Spróbuj ponownie.', 'error');
            } finally {
                signupButton.disabled = false;
                signupButton.textContent = 'Zapisz się na listę';
            }
        });
    }
}

// Survey modal functionality
function initializeSurveyModal() {
    const modal = document.getElementById('survey-modal');
    const closeBtn = document.querySelector('.close-modal');
    const surveyForm = document.getElementById('survey-form');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    if (surveyForm) {
        surveyForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(surveyForm);
            const surveyData = {
                email: formData.get('survey-email'),
                priceWillingness: formData.get('price-willingness'),
                mostImportantFeature: formData.get('important-feature'),
                currentSolution: formData.get('current-solution'),
                feedback: formData.get('additional-feedback'),
                source: 'survey-modal'
            };
            
            try {
                const result = await window.firebaseDB.saveSurveyResponse(surveyData);
                
                if (result.success) {
                    showMessage('Dziękujemy za wypełnienie ankiety!', 'success');
                    modal.style.display = 'none';
                    
                    // Track survey completion
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'survey_complete', {
                            event_category: 'engagement',
                            event_label: 'validation_survey'
                        });
                    }
                } else {
                    showMessage('Wystąpił błąd przy zapisywaniu ankiety.', 'error');
                }
            } catch (error) {
                console.error('Survey error:', error);
                showMessage('Wystąpił błąd przy zapisywaniu ankiety.', 'error');
            }
        });
    }
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const email = formData.get('contact-email');
            const feedback = formData.get('contact-message');
            
            if (!isValidEmail(email) || !feedback.trim()) {
                showMessage('Proszę wypełnić wszystkie pola', 'error');
                return;
            }
            
            try {
                const result = await window.firebaseDB.saveFeedback(email, feedback, 'contact-form');
                
                if (result.success) {
                    showMessage('Dziękujemy za wiadomość! Odpowiemy wkrótce.', 'success');
                    contactForm.reset();
                    
                    // Track contact form submission
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'contact_form', {
                            event_category: 'engagement',
                            event_label: 'contact_submission'
                        });
                    }
                } else {
                    showMessage('Wystąpił błąd przy wysyłaniu wiadomości.', 'error');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                showMessage('Wystąpił błąd przy wysyłaniu wiadomości.', 'error');
            }
        });
    }
}

// Show survey modal
function showSurveyModal(email = '') {
    const modal = document.getElementById('survey-modal');
    const emailInput = document.getElementById('survey-email');
    
    if (modal) {
        if (emailInput && email) {
            emailInput.value = email;
        }
        modal.style.display = 'block';
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            messageDiv.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            messageDiv.style.backgroundColor = '#f44336';
            break;
        default:
            messageDiv.style.backgroundColor = '#2196F3';
    }
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

// Add CSS animation for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(style);