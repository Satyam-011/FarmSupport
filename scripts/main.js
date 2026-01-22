// Global state
let isAnalyzing = false;
let currentAnalysisResult = null;
let chatMessages = [];

// DOM Elements
const diagnosisModal = document.getElementById('diagnosisModal');
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const imagePreview = document.getElementById('imagePreview');
const previewImage = document.getElementById('previewImage');
const analysisLoader = document.getElementById('analysisLoader');
const resultsCard = document.getElementById('resultsCard');
const chatCard = document.getElementById('chatCard');
const chatMessages_el = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

// Navigation functionality
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const menuIcon = menuBtn.querySelector('.menu-icon');
    const closeIcon = menuBtn.querySelector('.close-icon');
    
    mobileMenu.classList.toggle('hidden');
    
    if (mobileMenu.classList.contains('hidden')) {
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
    } else {
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        menuBtn.setAttribute('aria-expanded', 'true');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const menuIcon = menuBtn.querySelector('.menu-icon');
    const closeIcon = menuBtn.querySelector('.close-icon');
    
    mobileMenu.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}


function displayAnalysisResults(result) {
    // Update diagnosis name and confidence
    document.getElementById('diagnosisName').textContent = result.disease;
    document.getElementById('confidenceBadge').textContent = `${result.confidence}% confidence`;
    document.getElementById('severityLevel').textContent = `Severity: ${result.severity}`;
    document.getElementById('diagnosisDescription').textContent = result.description;
    
    // Update treatments list
    const treatmentsList = document.getElementById('treatmentsList');
    treatmentsList.innerHTML = result.treatments.map(treatment => `
        <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            ${treatment}
        </li>
    `).join('');
    
    resultsCard.classList.remove('hidden');
}

// AI Chat functionality
function openAIChat() {
    chatCard.classList.remove('hidden');
    chatInput.focus();
}

function handleChatSubmit(event) {
    event.preventDefault();
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addChatMessage('user', message);
    chatInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addChatMessage('ai', aiResponse);
    }, 1000);
}

function addChatMessage(role, message) {
    // Remove placeholder if it exists
    const placeholder = chatMessages_el.querySelector('.chat-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${role}`;
    
    const bubbleElement = document.createElement('div');
    bubbleElement.className = `chat-bubble ${role}`;
    bubbleElement.textContent = message;
    
    messageElement.appendChild(bubbleElement);
    chatMessages_el.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages_el.scrollTop = chatMessages_el.scrollHeight;
    
    // Store message
    chatMessages.push({ role, message });
}

function generateAIResponse(userMessage) {
    const responses = {
        treatment: [
            "Based on your image analysis, I recommend starting with the copper-based fungicide treatment immediately. Apply it in the early morning or late evening to avoid leaf burn.",
            "The treatment plan I've provided should show results within 7-10 days. Make sure to follow the application schedule carefully.",
            "For organic alternatives, you can use neem oil or baking soda solution. These are gentler but may take longer to show effects."
        ],
        prevention: [
            "To prevent future outbreaks, ensure proper spacing between plants for good air circulation. This is crucial for preventing fungal diseases.",
            "Consider planting resistant varieties next season. They're your best defense against recurring problems.",
            "Regular monitoring and early detection are key. Check your plants weekly for any signs of disease."
        ],
        general: [
            "Based on your crop diagnosis, this condition is treatable with proper care. Early intervention is crucial for success.",
            "The symptoms you're showing are common during this season. With the right treatment, your plants should recover well.",
            "I'd be happy to help you with more specific questions about treatment timing or application methods.",
            "Remember to always test treatments on a small area first before applying to your entire crop."
        ]
    };
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('treatment') || lowerMessage.includes('cure') || lowerMessage.includes('medicine')) {
        return responses.treatment[Math.floor(Math.random() * responses.treatment.length)];
    } else if (lowerMessage.includes('prevent') || lowerMessage.includes('avoid') || lowerMessage.includes('future')) {
        return responses.prevention[Math.floor(Math.random() * responses.prevention.length)];
    } else {
        return responses.general[Math.floor(Math.random() * responses.general.length)];
    }
}

// Keyboard navigation for tiles
function handleTileKeydown(event, callback) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        callback();
    }
}

// Smooth scrolling for internal links
function smoothScrollToElement(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Auto-resize textarea
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // File input change event
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Chat form submit event
    if (chatForm) {
        chatForm.addEventListener('submit', handleChatSubmit);
    }
    
    // Chat input auto-resize
    if (chatInput) {
        chatInput.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
    }
    
    // Modal close on overlay click
    if (diagnosisModal) {
        diagnosisModal.addEventListener('click', function(event) {
            if (event.target === diagnosisModal) {
                closeDiagnosisTool();
            }
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !diagnosisModal.classList.contains('hidden')) {
            closeDiagnosisTool();
        }
    });
    
    // Add keyboard navigation to tiles
    const tiles = document.querySelectorAll('.quick-access-tile[role="button"]');
    tiles.forEach(tile => {
        tile.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                tile.click();
            }
        });
    });
    
    // Add smooth scrolling to anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                smoothScrollToElement(targetElement);
            }
        });
    });
    
    // Initialize accessibility features
    initializeAccessibility();
});

// Accessibility enhancements
function initializeAccessibility() {
    // Add focus indicators for keyboard navigation
    const focusableElements = document.querySelectorAll('button, [role="button"], input, textarea, select, a[href]');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--ring)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Add loading states for better UX
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.opacity = '0.8';
                setTimeout(() => {
                    this.style.opacity = '';
                }, 200);
            }
        });
    });
}

// Voice command simulation (placeholder for future implementation)
function initializeVoiceCommands() {
    if ('speechRecognition' in window || 'webkitSpeechRecognition' in window) {
        // Voice recognition would be implemented here
        console.log('Speech recognition available');
    }
}

// Offline functionality (placeholder for future implementation)
function initializeOfflineSupport() {
    if ('serviceWorker' in navigator) {
        // Service worker registration would be here
        console.log('Service Worker support available');
    }
}

// Performance optimization
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error handling
window.addEventListener('error', function(event) {
    console.error('Application error:', event.error);
    // In a real application, you would send this to an error reporting service
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Analytics placeholder (for future implementation)
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
    // Analytics tracking would be implemented here
}

// Usage tracking for UX improvements
function trackDiagnosisUsage() {
    trackEvent('diagnosis_tool_opened');
}

function trackImageUpload() {
    trackEvent('image_uploaded');
}

function trackChatUsage() {
    trackEvent('ai_chat_opened');
}

// Export functions for global use
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.scrollToSection = scrollToSection;
window.openDiagnosisTool = openDiagnosisTool;
window.closeDiagnosisTool = closeDiagnosisTool;
window.removeImage = removeImage;
window.openAIChat = openAIChat;