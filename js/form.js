/* ===================================
   GIDI Paisagismo - Form Validation & Handling
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
});

/* ===================================
   Contact Form Initialization
   =================================== */
function initializeContactForm() {
    const form = document.getElementById('contato-form');

    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('.form-control');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Phone formatting
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit(this);
    });
}

/* ===================================
   Field Validation
   =================================== */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    field.classList.remove('error');
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = '';
    }

    // Check if required
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório';
    }

    // Specific validations
    if (value) {
        switch(fieldName) {
            case 'nome':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'Nome deve ter pelo menos 3 caracteres';
                } else if (!/^[a-záàâãéèêíïóôõöúçñ\s]+$/i.test(value)) {
                    isValid = false;
                    errorMessage = 'Nome deve conter apenas letras';
                }
                break;

            case 'email':
                if (!validateEmail(value)) {
                    isValid = false;
                    errorMessage = 'Email inválido';
                }
                break;

            case 'telefone':
                if (!validatePhone(value)) {
                    isValid = false;
                    errorMessage = 'Telefone inválido';
                }
                break;

            case 'mensagem':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
                }
                break;
        }
    }

    // Show error if invalid
    if (!isValid) {
        field.classList.add('error');
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = errorMessage;
        }
    }

    return isValid;
}

/* ===================================
   Validate All Fields
   =================================== */
function validateForm(form) {
    const fields = form.querySelectorAll('.form-control[required]');
    let isValid = true;

    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

/* ===================================
   Email Validation
   =================================== */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

/* ===================================
   Phone Validation
   =================================== */
function validatePhone(phone) {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');

    // Check if has 10 or 11 digits (BR format)
    return cleaned.length >= 10 && cleaned.length <= 11;
}

/* ===================================
   Phone Number Formatting
   =================================== */
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');

    // Limit to 11 digits
    value = value.substring(0, 11);

    // Format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (value.length <= 10) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    } else {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    }

    input.value = value;
}

/* ===================================
   Form Submission Handler
   =================================== */
async function handleFormSubmit(form) {
    // Validate form
    if (!validateForm(form)) {
        showFormMessage('Por favor, corrija os erros antes de enviar.', 'error');
        return;
    }

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        // Send form data
        // Option 1: Send to backend API
        // const response = await sendToBackend(data);

        // Option 2: Send via email service (FormSpree, EmailJS, etc.)
        // const response = await sendViaEmailService(data);

        // Option 3: Simulation for demo
        const response = await simulateFormSubmission(data);

        if (response.success) {
            showSuccessMessage();
            form.reset();

            // Track conversion (Google Analytics, Facebook Pixel, etc.)
            trackFormSubmission(data);
        } else {
            throw new Error(response.message || 'Erro ao enviar formulário');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage('Erro ao enviar mensagem. Tente novamente mais tarde.', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

/* ===================================
   Send to Backend API
   =================================== */
async function sendToBackend(data) {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return await response.json();
}

/* ===================================
   Send via Email Service (FormSpree)
   =================================== */
async function sendViaFormSpree(data) {
    const FORMSPREE_ID = 'YOUR_FORMSPREE_ID'; // Replace with actual ID

    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return {
        success: response.ok,
        message: response.ok ? 'Mensagem enviada com sucesso!' : 'Erro ao enviar'
    };
}

/* ===================================
   Simulate Form Submission (Demo)
   =================================== */
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form data:', data);
            resolve({ success: true });
        }, 1500);
    });
}

/* ===================================
   Show Success Message
   =================================== */
function showSuccessMessage() {
    const successMessage = document.querySelector('.form-success-message');

    if (successMessage) {
        successMessage.classList.add('show');

        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }
}

/* ===================================
   Show Form Message
   =================================== */
function showFormMessage(message, type = 'info') {
    // Create or update message element
    let messageElement = document.querySelector('.form-message');

    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'form-message';
        const form = document.getElementById('contato-form');
        form.appendChild(messageElement);
    }

    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    messageElement.style.display = 'block';

    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

/* ===================================
   Track Form Submission
   =================================== */
function trackFormSubmission(data) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            event_category: 'Contact',
            event_label: 'Contact Form',
            tipo_projeto: data['tipo-projeto']
        });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact', {
            content_name: 'Contact Form',
            tipo_projeto: data['tipo-projeto']
        });
    }

    // Google Ads Conversion
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'send_to': 'AW-XXXXXXXXX/XXXXXXXXXXXXXX' // Replace with actual conversion ID
        });
    }

    console.log('📊 Form submission tracked');
}

/* ===================================
   Auto-save Form Data (Optional)
   =================================== */
function autoSaveFormData() {
    const form = document.getElementById('contato-form');
    if (!form) return;

    const inputs = form.querySelectorAll('.form-control');

    inputs.forEach(input => {
        // Load saved data
        const savedValue = localStorage.getItem(`form_${input.name}`);
        if (savedValue && !input.value) {
            input.value = savedValue;
        }

        // Save on input
        input.addEventListener('input', function() {
            localStorage.setItem(`form_${this.name}`, this.value);
        });
    });

    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        inputs.forEach(input => {
            localStorage.removeItem(`form_${input.name}`);
        });
    });
}

// Uncomment to enable auto-save
// autoSaveFormData();

/* ===================================
   Spam Protection (Honeypot)
   =================================== */
function addHoneypot() {
    const form = document.getElementById('contato-form');
    if (!form) return;

    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.display = 'none';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';

    form.appendChild(honeypot);

    // Check honeypot on submit
    form.addEventListener('submit', function(e) {
        if (honeypot.value) {
            e.preventDefault();
            console.warn('Spam detected');
            return false;
        }
    });
}

addHoneypot();

/* ===================================
   Export Form Functions
   =================================== */
window.GIDIForm = {
    validateEmail,
    validatePhone,
    formatPhoneNumber,
    sendToBackend,
    trackFormSubmission
};

/* ===================================
   Instructions for Production Setup
   =================================== */
/*
Para configurar o formulário em produção:

1. BACKEND API:
   - Implemente endpoint /api/contact
   - Adicione validação server-side
   - Configure envio de email (SMTP, SendGrid, etc.)
   - Atualize sendToBackend() com URL real

2. EMAIL SERVICE:
   - OPÇÃO A - FormSpree (mais simples):
     * Cadastre em https://formspree.io
     * Obtenha Form ID
     * Atualize FORMSPREE_ID
     * Use sendViaFormSpree()

   - OPÇÃO B - EmailJS:
     * Cadastre em https://www.emailjs.com
     * Configure template
     * Obtenha credenciais
     * Atualize sendViaEmailJS()

3. SPAM PROTECTION:
   - Honeypot já implementado
   - Para reCAPTCHA:
     * Cadastre em https://www.google.com/recaptcha
     * Adicione site key ao HTML
     * Descomente loadRecaptcha()

4. TRACKING:
   - Atualize IDs do Google Analytics
   - Atualize Pixel do Facebook
   - Configure conversões do Google Ads

Recomendação: Para início rápido, use FormSpree
*/

console.log('📧 Formulário de contato inicializado');
