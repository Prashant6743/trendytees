// About Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.about-content h2, .about-content .lead, .about-content p, .value-card, .founder-bio h3, .founder-bio p, .team-member, .timeline-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };
    
    // Add animation classes to elements
    const addAnimationClasses = () => {
        // About content elements
        document.querySelectorAll('.about-content h2, .about-content .lead, .about-content p').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        });
        
        // Value cards
        document.querySelectorAll('.value-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        });
        
        // Founder bio elements
        document.querySelectorAll('.founder-bio h3, .founder-bio p').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(20px)';
            el.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        });
        
        // Team members
        document.querySelectorAll('.team-member').forEach((member, index) => {
            member.style.opacity = '0';
            member.style.transform = 'translateY(30px)';
            member.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        });
        
        // Timeline items
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            item.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
        });
    };
    
    // Add the animate class to show elements
    const animateElement = (element) => {
        element.style.opacity = '1';
        element.style.transform = 'translate(0)';
    };
    
    // Initialize
    addAnimationClasses();
    
    // Run on scroll
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.animate').forEach(element => {
            animateElement(element);
        });
        animateOnScroll();
    });
    
    // Run once on page load
    animateOnScroll();
    
    // Counter animation for stats
    const stats = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter, target) => {
        let count = 0;
        const duration = 2000; // 2 seconds
        const frameRate = 60;
        const increment = target / (duration / 1000 * frameRate);
        
        const updateCount = () => {
            if (count < target) {
                count += increment;
                counter.textContent = Math.ceil(count) + (counter.textContent.includes('K+') ? 'K+' : '+');
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = target + (counter.textContent.includes('K+') ? 'K+' : '+');
            }
        };
        
        updateCount();
    };
    
    // Intersection Observer for stats
    const observeStats = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.textContent);
                    entry.target.textContent = '0';
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => {
            const value = stat.textContent;
            stat.textContent = value.replace(/[^0-9]/g, '');
            observer.observe(stat);
        });
    };
    
    observeStats();
});
