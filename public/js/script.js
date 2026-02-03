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
    
    // Scroll reveal
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.12});
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    // Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
