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
        li.textContent = `${serviceName} x${qty}`;
        const span = document.createElement('span');
        span.textContent = formatCurrency(line);
        li.appendChild(span);
        breakdown.appendChild(li);
      }
    });

    if(!anySelected){
      breakdown.innerHTML = '<li>No hay servicios seleccionados</li>';
    }

    // options
    const options = ['rush','repuestos'];
    options.forEach(id => {
      const el = document.getElementById(id);
      if(el && el.checked){
        const price = Number(el.dataset.price || 0);
        total += price;
        const li = document.createElement('li');
        li.textContent = (id === 'rush' ? 'Servicio urgente' : 'Incluye repuestos');
        const span = document.createElement('span');
        span.textContent = formatCurrency(price);
        li.appendChild(span);
        breakdown.appendChild(li);
      }
    });

    totalAmount.textContent = formatCurrency(total);
    return { total, anySelected };
  }

  if(calculateBtn){
    calculateBtn.addEventListener('click', () => {
      quoteError.hidden = true;
      const res = computeQuote();
      if(!res.anySelected){
        quoteError.textContent = 'Selecciona al menos un servicio para calcular la cotización.';
        quoteError.hidden = false;
      } else {
        quoteSuccess.textContent = 'Estimación calculada localmente. Para enviar la solicitud completa presiona "Enviar Solicitud".';
        quoteSuccess.hidden = false;
        setTimeout(()=> quoteSuccess.hidden = true, 5000);
        totalAmount.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:320,iterations:1});
      }
    });
  }

  // send quote (submit)
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    quoteError.hidden = true;
    quoteSuccess.hidden = true;

    // basic HTML5 constraints
    if(!form.checkValidity()){
      quoteError.textContent = 'Completa los campos obligatorios correctamente.';
      quoteError.hidden = false;
      form.reportValidity();
      return;
    }

    const { total, anySelected } = computeQuote();
    if(!anySelected){
      quoteError.textContent = 'Selecciona al menos un servicio antes de enviar.';
      quoteError.hidden = false;
      return;
    }

    // build payload
    const payload = {
      type: 'quote',
      client: {
        name: form.clientName.value,
        email: form.clientEmail.value,
        phone: form.clientPhone ? form.clientPhone.value : ''
      },
      services: [],
      options: {
        rush: !!document.getElementById('rush').checked,
        repuestos: !!document.getElementById('repuestos').checked
      },
      notes: form.notes.value || '',
      total
    };

    form.querySelectorAll('input[name="service"]').forEach(check => {
      if(check.checked){
        const qty = form.querySelector(`input[name="qty-${check.value}"]`).value;
        payload.services.push({name: check.value, qty: Number(qty), unitPrice: Number(check.dataset.price)});
      }
    });

    // disable button and send
    sendQuoteBtn.disabled = true;
    sendQuoteBtn.textContent = 'Enviando...';

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if(res.ok){
        quoteSuccess.textContent = 'Solicitud enviada. Respuesta: ' + (data.message || 'Recibido. Pronto nos contactamos.');
        quoteSuccess.hidden = false;
        form.reset();
        computeQuote(); // reset summary
      } else {
        throw new Error(data.error || 'Error al enviar la solicitud');
      }
    } catch(err){
      console.error(err);
      quoteError.textContent = 'Error enviando la solicitud: ' + err.message;
      quoteError.hidden = false;
    } finally {
      sendQuoteBtn.disabled = false;
      sendQuoteBtn.textContent = 'Enviar Solicitud';
    }
  });

  // Contact form: client-side validation + send
  const contactForm = document.getElementById('contactForm');
  const contactError = document.getElementById('contactError');
  const contactSuccess = document.getElementById('contactSuccess');

  contactForm.addEventListener('submit', async function(e){
    e.preventDefault();
    contactError.hidden = true;
    contactSuccess.hidden = true;

    if(!contactForm.checkValidity()){
      contactError.textContent = 'Completa los campos obligatorios correctamente.';
      contactError.hidden = false;
      contactForm.reportValidity();
      return;
    }

    const payload = {
      type: 'contact',
      client: {
        name: contactForm.name.value,
        email: contactForm.email.value,
        phone: contactForm.phone ? contactForm.phone.value : ''
      },
      message: contactForm.message.value
    };

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if(res.ok){
        contactSuccess.textContent = 'Mensaje enviado. ' + (data.message || '');
        contactSuccess.hidden = false;
        contactForm.reset();
      } else {
        throw new Error(data.error || 'Error enviando mensaje');
      }
    } catch(err){
      console.error(err);
      contactError.textContent = 'Error enviando el mensaje: ' + err.message;
      contactError.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mensaje';
    }
  });

});
