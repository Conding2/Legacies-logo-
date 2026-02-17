// Form Elements
const careerForm = document.getElementById('careerForm');
const successMessage = document.getElementById('successMessage');

// Formspree Configuration
// The form endpoint is set in the HTML form action attribute
// Get your form ID from https://formspree.io/

// Form Submission with AJAX for better UX
careerForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(careerForm);
    const formAction = careerForm.action;

    // Check if Formspree is configured
    if (formAction.includes('YOUR_FORM_ID')) {
        alert('Formspree is not configured yet. Please follow the setup guide in FORMSPREE_SETUP.md');
        return;
    }

    // Disable submit button during processing
    const submitBtn = careerForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-text">Submitting...</span>';

    try {
        // Send to Formspree
        const response = await fetch(formAction, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Email sent successfully:', result);

            // Hide form and show success message
            careerForm.style.display = 'none';
            successMessage.classList.remove('hidden');

            // Update success message
            const successText = successMessage.querySelector('p');
            successText.innerHTML = 'Thank you for your interest. We\'ll review your application and get back to you soon.';

            // Reset form
            careerForm.reset();
        } else {
            throw new Error(result.error || 'Submission failed');
        }

    } catch (error) {
        console.error('Error sending email:', error);
        alert('There was an error submitting your application. Please try again or contact us directly at legacies@legacies.global');

    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add entrance animations on load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
