// Funcionalidad principal de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initMobileMenu();
    initSmoothScroll();
    initFormValidation();
    initAnimations();
    initProgressBars();
});

// Menú móvil responsive
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace (móvil)
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    menuToggle.classList.remove('active');
                    navbar.classList.remove('active');
                }
            });
        });

        // Cerrar menú al redimensionar ventana
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                menuToggle.classList.remove('active');
                navbar.classList.remove('active');
            }
        });
    }
}

// Scroll suave para enlaces internos
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Validación de formularios
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const formObject = {};
            
            // Convertir FormData a objeto
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            
            // Validar campos
            if (validateContactForm(formObject)) {
                showNotification('¡Mensaje enviado correctamente!', 'success');
                this.reset();
            }
        });
    }
}

// Validación específica del formulario de contacto
function validateContactForm(data) {
    const errors = [];
    
    // Validar nombre
    if (!data.name || data.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Ingresa un email válido');
    }
    
    // Validar asunto
    if (!data.subject) {
        errors.push('Selecciona un asunto');
    }
    
    // Validar mensaje
    if (!data.message || data.message.trim().length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    // Mostrar errores o éxito
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Remover notificación existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Agregar estilos dinámicamente
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        }
        
        .notification-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .notification-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .notification-info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .notification-message {
            flex: 1;
            margin-right: 10px;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            opacity: 0.7;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Botón de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        closeNotification(notification);
    });
    
    // Auto cerrar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification);
        }
    }, 5000);
}

function closeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Animaciones al hacer scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos animables
    const animatedElements = document.querySelectorAll('.raffle-card, .step, .stat-card, .contact-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Animación de barras de progreso
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
                
                progressObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Funciones utilitarias
const Utils = {
    // Debounce para optimizar eventos
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Detectar dispositivo móvil
    isMobile: function() {
        return window.innerWidth <= 768;
    },
    
    // Formatear números
    formatNumber: function(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    },
    
    // Generar ID único
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Funcionalidad específica para rifas
const RaffleManager = {
    // Comprar boleto
    buyTicket: function(raffleId) {
        showNotification('Funcionalidad de compra en desarrollo', 'info');
        console.log(`Comprando boleto para rifa: ${raffleId}`);
    },
    
    // Ver detalles de rifa
    viewDetails: function(raffleId) {
        showNotification('Abriendo detalles de la rifa...', 'info');
        console.log(`Ver detalles de rifa: ${raffleId}`);
    },
    
    // Calcular tiempo restante
    calculateTimeRemaining: function(endDate) {
        const now = new Date().getTime();
        const end = new Date(endDate).getTime();
        const difference = end - now;
        
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            
            return { days, hours, minutes };
        }
        
        return null;
    }
};

// Event listeners adicionales para funcionalidad específica
document.addEventListener('click', function(e) {
    // Manejo de botones de compra
    if (e.target.closest('.btn-primary') && e.target.textContent.includes('Comprar Boleto')) {
        e.preventDefault();
        const raffleCard = e.target.closest('.raffle-card');
        const raffleTitle = raffleCard.querySelector('h3').textContent;
        RaffleManager.buyTicket(raffleTitle);
    }
});

// Optimización de rendimiento
const performanceOptimizations = {
    // Lazy loading para imágenes
    initLazyLoading: function() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores sin soporte
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    },
    
    // Precargar recursos críticos
    preloadCriticalResources: function() {
        const criticalResources = [
            '/css/styles.css',
            '/js/main.js'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
};

// Inicializar optimizaciones
performanceOptimizations.initLazyLoading();

// Exportar funciones para uso global si es necesario
window.RaffleManager = RaffleManager;
window.Utils = Utils;
