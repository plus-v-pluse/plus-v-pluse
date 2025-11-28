// ========================================
// MOBILE MENU
// ========================================

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.remove('active');
}

// Close mobile menu on outside click
document.addEventListener('click', function(event) {
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const isClickInsideNav = navLinks.contains(event.target);
    const isClickOnMenuBtn = menuBtn && menuBtn.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnMenuBtn && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
});

// ========================================
// WHATSAPP FORM SUBMISSION
// ========================================

function sendToWhatsApp(event) {
    event.preventDefault();
    
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const message = document.getElementById('userMessage').value;
    const managerIndex = document.getElementById('managerSelect').value;
    
    const whatsappNumbers = [
        '77781120300',
        '77055573390',
        '77053328812'
    ];
    
    const selectedNumber = whatsappNumbers[managerIndex];
    
    const whatsappMessage = `*Новая заявка с сайта*%0A%0A` +
                           ` Имя: ${encodeURIComponent(name)}%0A` +
                           ` Телефон: ${encodeURIComponent(phone)}%0A` +
                           ` Сообщение:%0A${encodeURIComponent(message)}`;
    
    const whatsappURL = `https://wa.me/${selectedNumber}?text=${whatsappMessage}`;
    window.open(whatsappURL, '_blank');
    
    document.getElementById('contactForm').reset();
    alert('Спасибо! Сейчас откроется WhatsApp с вашим сообщением.');
}

// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// HEADER SCROLL EFFECT
// ========================================

let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.padding = '10px 40px';
    } else {
        header.style.padding = '20px 40px';
    }

    lastScroll = currentScroll;
});

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to elements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.service-card, .equipment-item, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});