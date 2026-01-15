// ============ WEBSITE CORE FUNCTIONS ============

// Global variable for current language
window.currentLanguage = 'fr';

// Show/Hide Sections
function showSection(id) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(s => {
        s.classList.remove('active-section');
    });
    
    // Show the selected section
    document.getElementById(id).classList.add('active-section');
    
    // Close mobile menu if open
    document.getElementById('mobileMenu').classList.add('hidden');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update URL hash
    history.pushState(null, null, `#${id}`);
}

// Toggle Mobile Menu
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
    
    // Close chat if open when opening menu
    if (!menu.classList.contains('hidden')) {
        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow.style.display === 'flex') {
            chatWindow.style.display = 'none';
        }
    }
}

// Filter Offers by Category
function filterOffers(cat) {
    // Update active tab
    document.querySelectorAll('.section-tab').forEach(t => {
        t.classList.remove('active-tab', 'bg-white', 'shadow');
        t.classList.add('bg-white', 'shadow');
    });
    
    const activeTab = document.getElementById(`tab-${cat}`);
    activeTab.classList.add('active-tab');
    activeTab.classList.remove('bg-white', 'shadow');
    
    // Filter cards
    document.querySelectorAll('.offer-card').forEach(card => {
        if (cat === 'all' || card.getAttribute('data-cat') === cat) {
            card.style.display = 'flex';
            setTimeout(() => {
                card.style.opacity = '1';
            }, 50);
        } else {
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // If on mobile, scroll to offers section
    if (window.innerWidth < 768) {
        document.getElementById('offers').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// Filter from Mobile Menu
function filterFromMenu(cat) {
    document.getElementById('mobileMenu').classList.add('hidden');
    showSection('offers');
    
    setTimeout(() => {
        filterOffers(cat);
    }, 100);
}

// Initialize Page on Load
document.addEventListener('DOMContentLoaded', function() {
    // Check URL hash and show corresponding section
    const hash = window.location.hash.substring(1);
    const validSections = ['home', 'about', 'offers', 'contact'];
    
    if (hash && validSections.includes(hash)) {
        showSection(hash);
    } else {
        showSection('home');
    }
    
    // Initialize all offer cards as visible
    document.querySelectorAll('.offer-card').forEach(card => {
        card.style.display = 'flex';
        card.style.opacity = '1';
    });
    
    // Add click event listeners for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Add active class to nav links based on current section
    window.addEventListener('scroll', function() {
        if (window.innerWidth > 768) {
            const sections = document.querySelectorAll('.page-section');
            const navLinks = document.querySelectorAll('nav button[onclick^="showSection"]');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('text-blue-700', 'font-extrabold');
                if (link.getAttribute('onclick').includes(`'${current}'`)) {
                    link.classList.add('text-blue-700', 'font-extrabold');
                }
            });
        }
    });
    
    // Initialize language
    updateLanguageUI();
});
