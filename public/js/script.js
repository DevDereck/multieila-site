// Script: menu toggle, reveal on scroll, quote calculator, validation and send via fetch to serverless endpoint

document.addEventListener('DOMContentLoaded', function(){
	// year in footer
	document.getElementById('year').textContent = new Date().getFullYear();

	// menu toggle
	const btn = document.querySelector('.menu-toggle');
	const nav = document.querySelector('.site-nav');
	if(btn){
		btn.addEventListener('click', () => {
			const open = btn.getAttribute('aria-expanded') === 'true';
			btn.setAttribute('aria-expanded', String(!open));
			nav.classList.toggle('open');
		});
	}

	// scroll reveal using IntersectionObserver
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if(entry.isIntersecting){
				entry.target.classList.add('visible');
				observer.unobserve(entry.target);
			}
		});
	}, {threshold: 0.12});

	document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

	// Utilities
	function formatCurrency(n){
		return '$' + Number(n).toLocaleString('es-CO', {maximumFractionDigits:0});
	}

	// Quote calculator & validation
	const form = document.getElementById('quoteForm');
	const calculateBtn = document.getElementById('calculate');
	const breakdown = document.getElementById('breakdown');
	const totalAmount = document.getElementById('totalAmount');
	const quoteError = document.getElementById('quoteError');
	const quoteSuccess = document.getElementById('quoteSuccess');
	const sendQuoteBtn = document.getElementById('sendQuote');

	function computeQuote(){
		let total = 0;
		breakdown.innerHTML = '';

		const serviceChecks = form.querySelectorAll('input[name="service"]');
		let anySelected = false;
		serviceChecks.forEach(check => {
			if(check.checked){
				anySelected = true;
				const price = Number(check.dataset.price || 0);
				const serviceName = check.value;
				const qtyInput = form.querySelector(`input[name="qty-${serviceName}"]`);
				const qty = qtyInput ? Math.max(1, Number(qtyInput.value || 1)) : 1;
				const line = price * qty;
				total += line;

				const li = document.createElement('li');
				// ...continúa el código...
			}
		});
		// ...continúa el código...
	}
	// ...continúa el código del archivo original...
});