// Menu toggle & Scroll optimization
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
    
    // Smooth scroll for all anchor links (optimized)
    let scrollTimeout;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            clearTimeout(scrollTimeout);
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                if (btn) btn.setAttribute('aria-expanded', 'false');
                if (nav) nav.classList.remove('open');
            }
        });
    });
    
    // Scroll reveal with enhanced animation (optimized with requestAnimationFrame)
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    requestAnimationFrame(() => {
                        entry.target.classList.add('visible');
                    });
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }
    
    // Animate sections on scroll (optimized)
    const sections = document.querySelectorAll('.section');
    if (sections.length > 0) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    requestAnimationFrame(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    });
                }
            });
        }, {
            threshold: 0.1
        });
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            sectionObserver.observe(section);
        });
    }
    
    // Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
