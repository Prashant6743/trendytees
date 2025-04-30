// Login Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements
    const loginTabs = document.querySelectorAll('.login-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const switchTabLinks = document.querySelectorAll('.switch-tab');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const signinHelper = document.getElementById('signin-helper');
    const signupHelper = document.getElementById('signup-helper');
    const notification = document.querySelector('.profile-notification');
    const notificationText = notification.querySelector('span');
    const notificationClose = notification.querySelector('.notification-close');

    // Switch between tabs
    loginTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Switch tab links
    switchTabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = link.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Function to switch tabs
    function switchTab(tabName) {
        // Update tab buttons
        loginTabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update tab content
        tabContents.forEach(content => {
            if (content.id === `${tabName}-content`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Update helper text
        if (tabName === 'signin') {
            signinHelper.style.display = 'block';
            signupHelper.style.display = 'none';
        } else {
            signinHelper.style.display = 'none';
            signupHelper.style.display = 'block';
        }
    }

    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const passwordField = button.closest('.password-field');
            const passwordInput = passwordField.querySelector('input');
            const icon = button.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Reset error messages
            clearErrors();
            
            // Get form values
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            // Validate form
            let isValid = true;
            
            if (!email) {
                showError('login-email-error', 'Please enter your email address');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('login-email-error', 'Please enter a valid email address');
                isValid = false;
            }
            
            if (!password) {
                showError('login-password-error', 'Please enter your password');
                isValid = false;
            }
            
            if (isValid) {
                // In a real application, you would make an API call to your server
                // For demo purposes, we'll simulate the login
                simulateLogin(email, password, rememberMe);
            }
        });
    }

    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Reset error messages
            clearErrors();
            
            // Get form values
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            // Validate form
            let isValid = true;
            
            if (!name) {
                showError('register-name-error', 'Please enter your full name');
                isValid = false;
            }
            
            if (!email) {
                showError('register-email-error', 'Please enter your email address');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('register-email-error', 'Please enter a valid email address');
                isValid = false;
            }
            
            if (!password) {
                showError('register-password-error', 'Please create a password');
                isValid = false;
            } else if (password.length < 8) {
                showError('register-password-error', 'Password must be at least 8 characters');
                isValid = false;
            }
            
            if (!confirmPassword) {
                showError('register-confirm-password-error', 'Please confirm your password');
                isValid = false;
            } else if (password !== confirmPassword) {
                showError('register-confirm-password-error', 'Passwords do not match');
                isValid = false;
            }
            
            if (isValid) {
                // In a real application, you would make an API call to your server
                // For demo purposes, we'll simulate the registration
                simulateRegistration(name, email, password);
            }
        });
    }

    // Notification close button
    if (notificationClose) {
        notificationClose.addEventListener('click', () => {
            notification.classList.remove('show');
        });
    }

    // Helper functions
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showNotification(message, type = 'success') {
        notificationText.textContent = message;
        
        // Remove all notification type classes
        notification.classList.remove('notification-success', 'notification-error', 'notification-warning', 'notification-info');
        
        // Add correct notification type class
        notification.classList.add(`notification-${type}`);
        
        // Set icon based on type
        const icon = notification.querySelector('i');
        if (icon) {
            icon.className = ''; // Clear existing icon
            switch (type) {
                case 'success':
                    icon.className = 'fas fa-check-circle';
                    break;
                case 'error':
                    icon.className = 'fas fa-times-circle';
                    break;
                case 'warning':
                    icon.className = 'fas fa-exclamation-triangle';
                    break;
                default:
                    icon.className = 'fas fa-info-circle';
            }
        }
        
        // Show notification
        notification.classList.add('show');
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }

    function simulateLogin(email, password, rememberMe) {
        // For demo purposes, we'll accept any properly formatted
        // email with a password length of at least 6 characters
        
        // In a real application, you would validate credentials with your server
        
        if (password.length >= 6) {
            // Store user data in localStorage
            const userData = {
                email: email,
                name: email.split('@')[0], // Use part of email as name for demo
                orders: Math.floor(Math.random() * 5),
                wishlist: Math.floor(Math.random() * 10),
                reviews: Math.floor(Math.random() * 3),
                isLoggedIn: true
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));
            
            if (rememberMe) {
                localStorage.setItem('rememberedUser', email);
            } else {
                localStorage.removeItem('rememberedUser');
            }
            
            // Show success message
            showNotification('Login successful! Welcome back.', 'success');
            
            // After a delay, redirect to home page
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        } else {
            // Show error for incorrect credentials
            showError('login-password-error', 'Incorrect email or password');
        }
    }

    function simulateRegistration(name, email, password) {
        // For demo purposes, we'll accept any registration that passes client-side validation
        
        // In a real application, you would send this data to your server
        // and validate that the email isn't already in use
        
        // Store user data in localStorage
        const userData = {
            email: email,
            name: name,
            orders: 0,
            wishlist: 0,
            reviews: 0,
            isLoggedIn: true
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Show success message
        showNotification('Account created successfully!', 'success');
        
        // After a delay, redirect to home page
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    }

    // Check if we have a remembered user
    function checkRememberedUser() {
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            const loginEmail = document.getElementById('login-email');
            if (loginEmail) {
                loginEmail.value = rememberedUser;
                document.getElementById('remember-me').checked = true;
            }
        }
    }

    // Check for remembered user
    checkRememberedUser();
}); 