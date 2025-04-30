// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close-modal');
    const modalButton = document.querySelector('.modal-button');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Basic validation
            if (name === '' || email === '' || subject === '' || message === '') {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission (would be replaced with actual AJAX call)
            setTimeout(() => {
                // Show success modal
                successModal.classList.add('show');
                
                // Reset form
                contactForm.reset();
            }, 1000);
        });
    }
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            successModal.classList.remove('show');
        });
    }
    
    if (modalButton) {
        modalButton.addEventListener('click', () => {
            successModal.classList.remove('show');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('show');
        }
    });
    
    // Input label animation
    const formInputs = document.querySelectorAll('.input-group input, .input-group textarea');
    
    formInputs.forEach(input => {
        const label = input.previousElementSibling;
        
        // Move label up if input has value
        if (input.value !== '') {
            label.style.top = '-20px';
            label.style.fontSize = '0.8rem';
            label.style.color = '#3498db';
        }
        
        input.addEventListener('focus', () => {
            label.style.top = '-20px';
            label.style.fontSize = '0.8rem';
            label.style.color = '#3498db';
        });
        
        input.addEventListener('blur', () => {
            if (input.value === '') {
                label.style.top = '0';
                label.style.fontSize = '0.9rem';
                label.style.color = '#7f8c8d';
            }
        });
    });
    
    // Chat button functionality
    const chatButton = document.querySelector('.chat-button');
    
    if (chatButton) {
        chatButton.addEventListener('click', () => {
            showNotification('Live chat feature coming soon!', 'info');
        });
    }
    
    // Notification function
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <p>${message}</p>
            </div>
            <span class="notification-close">&times;</span>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
        
        // Close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Add notification styles if not already in the main CSS
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 300px;
            max-width: 90%;
            transform: translateX(110%);
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }
        
        .notification.success i {
            color: #2ecc71;
        }
        
        .notification.error i {
            color: #e74c3c;
        }
        
        .notification.info i {
            color: #3498db;
        }
        
        .notification-close {
            cursor: pointer;
            font-size: 1.2rem;
            color: #7f8c8d;
        }
    `;
    
    // Add styles to head
    const styleElement = document.createElement('style');
    styleElement.textContent = notificationStyles;
    document.head.appendChild(styleElement);
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const heroSection = document.querySelector('.contact-hero');
        if (heroSection) {
            const scrollPosition = window.pageYOffset;
            heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        }
    });
});
