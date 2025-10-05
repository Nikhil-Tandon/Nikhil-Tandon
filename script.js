// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializePortfolioTabs();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeAnimations();
    updateCurrentYear();
});

// Portfolio Tab Functionality
function initializePortfolioTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding panel
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// Contact Form Functionality
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    // Form validation
    function validateField(field, value) {
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!value.trim()) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length > 100) {
                    errorMessage = 'Name must be less than 100 characters';
                    isValid = false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'Invalid email address';
                    isValid = false;
                } else if (value.length > 255) {
                    errorMessage = 'Email must be less than 255 characters';
                    isValid = false;
                }
                break;
            case 'message':
                if (!value.trim()) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                } else if (value.length > 1000) {
                    errorMessage = 'Message must be less than 1000 characters';
                    isValid = false;
                }
                break;
        }

        return { isValid, errorMessage };
    }

    // Show error message
    function showError(field, message) {
        const errorElement = document.getElementById(field.name + 'Error');
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    // Clear error message
    function clearError(field) {
        const errorElement = document.getElementById(field.name + 'Error');
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    // Real-time validation
    [nameInput, emailInput, messageInput].forEach(field => {
        field.addEventListener('input', function() {
            const value = this.value;
            const validation = validateField(this, value);
            
            if (!validation.isValid) {
                showError(this, validation.errorMessage);
            } else {
                clearError(this);
            }
        });

        field.addEventListener('blur', function() {
            const value = this.value;
            const validation = validateField(this, value);
            
            if (!validation.isValid) {
                showError(this, validation.errorMessage);
            } else {
                clearError(this);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };

        // Validate all fields
        let isFormValid = true;
        const fields = [nameInput, emailInput, messageInput];
        
        fields.forEach(field => {
            const validation = validateField(field, field.value);
            if (!validation.isValid) {
                showError(field, validation.errorMessage);
                isFormValid = false;
            } else {
                clearError(field);
            }
        });

        if (!isFormValid) {
            return;
        }

        // Create WhatsApp message
        const whatsappMessage = `New inquiry from ${encodeURIComponent(formData.name)}%0A%0AEmail: ${encodeURIComponent(formData.email)}%0A%0AMessage: ${encodeURIComponent(formData.message)}`;
        const whatsappUrl = `https://wa.me/919876810359?text=${whatsappMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show success message (you can customize this)
        showNotification('Opening WhatsApp', 'Your message is ready to send via WhatsApp!');
        
        // Reset form
        form.reset();
    });
}

// WhatsApp Direct Contact
function openWhatsApp() {
    window.open('https://wa.me/919876810359', '_blank');
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    // Smooth scroll for CTA button
    window.scrollToPortfolio = function() {
        const portfolioSection = document.getElementById('portfolio');
        if (portfolioSection) {
            portfolioSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation on Scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .stat-card, .portfolio-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Notification System
function showNotification(title, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: hsl(var(--card));
        border: 1px solid hsl(var(--border));
        border-radius: 0.5rem;
        padding: 1rem;
        box-shadow: var(--shadow-soft);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Update Current Year
function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Portfolio Image Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Mobile Menu Toggle (if needed in future)
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
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
}

// Form Enhancement - Auto-resize Textarea
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.querySelector('textarea[name="message"]');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
});

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // ESC key to close any open modals or overlays
    if (e.key === 'Escape') {
        // Add functionality for closing modals if needed
    }
    
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// Remove keyboard navigation class on mouse use
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Performance Optimization - Debounce Scroll Events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll-based animations (removed parallax effect to fix moving hero image)
// const handleScroll = debounce(function() {
//     const scrolled = window.pageYOffset;
//     const parallax = document.querySelector('.hero-background');
//     
//     if (parallax) {
//         const speed = scrolled * 0.5;
//         parallax.style.transform = `translateY(${speed}px)`;
//     }
// }, 10);

// window.addEventListener('scroll', handleScroll);

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Portfolio Gallery Data - Treat each category as a folder
const portfolioGalleries = {
    'weddings': {
    title: 'Wedding Ceremonies',
    description: 'Capturing beautiful wedding moments with professional color grading and retouching.',
    images: [
        { src: 'hero-wedding.jpg', title: 'Wedding Ceremony', description: 'Professional Retouching' },
        { src: 'assets/prewedding-1.jpg', title: 'Wedding Portrait', description: 'Professional Retouching' },
        { src: 'assets/prewedding-2.jpg', title: 'Wedding Details', description: 'Professional Retouching' },
        { src: 'assets/DSC_4284.jpg', title: 'Wedding Moment', description: 'Professional Retouching' },
        { src: 'assets/DSC_4349.jpg', title: 'Ceremony Details', description: 'Professional Retouching' },
        { src: 'assets/DSC_4478.jpg', title: 'Candid Smile', description: 'Professional Retouching' },
        { src: 'assets/DSC05057.jpg', title: 'Wedding Couple', description: 'Professional Retouching' }
    ]
},

'pre-wedding': {
    title: 'Pre-Wedding Shoots',
    description: 'Romantic pre-wedding moments captured with artistic flair and professional editing.',
    images: [
        { src: 'assets/prewedding-1.jpg', title: 'Romantic Pre-Wedding', description: 'Professional Retouching' },
        { src: 'assets/prewedding-2.jpg', title: 'Cultural Moments', description: 'Professional Retouching' },
        { src: 'hero-wedding.jpg', title: 'Pre-Wedding Shoot', description: 'Professional Retouching' },
        { src: 'assets/DSC07068.jpg', title: 'Golden Hour', description: 'Professional Retouching' },
        { src: 'assets/DSC08097.jpg', title: 'Intimate Portrait', description: 'Professional Retouching' },
        { src: 'assets/DSC08104.jpg', title: 'Nature Walk', description: 'Professional Retouching' },
        { src: 'assets/prewedding-1.jpg', title: 'Classic Pose', description: 'Professional Retouching' },
        { src: 'assets/prewedding-2.jpg', title: 'Stylish Couple', description: 'Professional Retouching' }
    ]
}
,
    'events': {
        title: 'Special Events',
        description: 'Corporate events, celebrations, and special occasions with professional photo editing.',
        images: [
            { src: 'hero-wedding.jpg', title: 'Corporate Event', description: 'Professional Retouching' },
            { src: 'assets/prewedding-1.jpg', title: 'Birthday Celebration', description: 'Professional Retouching' },
            { src: 'assets/prewedding-2.jpg', title: 'Anniversary Party', description: 'Professional Retouching' }
        ]
    },
    'portraits': {
        title: 'Portrait Sessions',
        description: 'Individual and family portraits with professional retouching and color enhancement.',
        images: [
            { src: 'assets/prewedding-2.jpg', title: 'Portrait Session', description: 'Professional Retouching' },
            { src: 'hero-wedding.jpg', title: 'Family Portrait', description: 'Professional Retouching' },
            { src: 'assets/prewedding-1.jpg', title: 'Individual Portrait', description: 'Professional Retouching' }
        ]
    }
};

// Open Gallery Modal
function openGalleryModal(category) {
    const gallery = portfolioGalleries[category];
    if (!gallery) return;

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeGalleryModal()">
            <div class="gallery-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeGalleryModal()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="gallery-header">
                    <h2>${gallery.title}</h2>
                    <p>${gallery.description}</p>
                </div>
                
                <div class="gallery-main">
                    <button class="gallery-nav gallery-prev" onclick="previousImage()">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <div class="gallery-image-container">
                        <img id="gallery-main-image" src="${gallery.images[0].src}" alt="${gallery.images[0].title}" class="gallery-main-image">
                    </div>
                    
                    <button class="gallery-nav gallery-next" onclick="nextImage()">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                
                <div class="gallery-info">
                    <h3 id="gallery-image-title">${gallery.images[0].title}</h3>
                    <p id="gallery-image-description">${gallery.images[0].description}</p>
                </div>
                
                <div class="gallery-thumbnails">
                    ${gallery.images.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="goToImage(${index})">
                            <img src="${img.src}" alt="${img.title}">
                        </div>
                    `).join('')}
                </div>
                
                <div class="gallery-counter">
                    <span id="current-image">1</span>/<span id="total-images">${gallery.images.length}</span>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Store current gallery data
    window.currentGallery = gallery;
    window.currentImageIndex = 0;
    
    // Add keyboard navigation
    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeGalleryModal();
        if (e.key === 'ArrowLeft') previousImage();
        if (e.key === 'ArrowRight') nextImage();
    };
    document.addEventListener('keydown', handleKeydown);
    modal.keydownHandler = handleKeydown;
}

// Gallery Navigation Functions
function nextImage() {
    if (!window.currentGallery) return;
    window.currentImageIndex = (window.currentImageIndex + 1) % window.currentGallery.images.length;
    updateGalleryImage();
}

function previousImage() {
    if (!window.currentGallery) return;
    window.currentImageIndex = window.currentImageIndex === 0 ? window.currentGallery.images.length - 1 : window.currentImageIndex - 1;
    updateGalleryImage();
}

function goToImage(index) {
    if (!window.currentGallery) return;
    window.currentImageIndex = index;
    updateGalleryImage();
}

function updateGalleryImage() {
    if (!window.currentGallery) return;
    
    const image = window.currentGallery.images[window.currentImageIndex];
    const mainImage = document.getElementById('gallery-main-image');
    const title = document.getElementById('gallery-image-title');
    const description = document.getElementById('gallery-image-description');
    const currentCounter = document.getElementById('current-image');
    
    if (mainImage) {
        // Reset image to show loading state
        mainImage.style.opacity = '0.5';
        
        // Create new image to get natural dimensions
        const img = new Image();
        img.onload = function() {
            mainImage.src = image.src;
            mainImage.alt = image.title;
            mainImage.style.opacity = '1';
            
            // Add natural dimensions as data attributes for responsive behavior
            mainImage.setAttribute('data-natural-width', img.naturalWidth);
            mainImage.setAttribute('data-natural-height', img.naturalHeight);
            mainImage.setAttribute('data-aspect-ratio', (img.naturalWidth / img.naturalHeight).toFixed(2));
        };
        img.src = image.src;
    }
    
    if (title) title.textContent = image.title;
    if (description) description.textContent = image.description;
    if (currentCounter) currentCounter.textContent = window.currentImageIndex + 1;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === window.currentImageIndex);
    });
}

function closeGalleryModal() {
    const modal = document.querySelector('.gallery-modal');
    if (modal) {
        if (modal.keydownHandler) {
            document.removeEventListener('keydown', modal.keydownHandler);
        }
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
            window.currentGallery = null;
            window.currentImageIndex = 0;
        }, 300);
    }
}

// Console Welcome Message
console.log('%cWelcome to Nikhil Tandon\'s Portfolio!', 'color: #d4af37; font-size: 20px; font-weight: bold;');
console.log('%cProfessional Wedding Photo Editor', 'color: #666; font-size: 14px;');
console.log('%cBringing love stories to life, one edit at a time.', 'color: #999; font-size: 12px; font-style: italic;');
