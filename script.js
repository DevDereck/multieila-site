// Menu toggle
(function() {
    const btn = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.site-nav');
    
    if(btn && nav){
        btn.onclick = function(e) {
            e.preventDefault();
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isOpen);
            nav.classList.toggle('open');
        };
        
        nav.querySelectorAll('a').forEach(link => {
            link.onclick = function() {
                btn.setAttribute('aria-expanded', 'false');
                nav.classList.remove('open');
            };
        });
    }
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calculate offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (btn) {
                    btn.setAttribute('aria-expanded', 'false');
                }
                if (nav) {
                    nav.classList.remove('open');
                }
            }
        });
    });
    
    // Scroll reveal with enhanced animation
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                // Add a slight delay for smoother appearance
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 50);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in view
    });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    // Animate sections on scroll
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
    
    // Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
