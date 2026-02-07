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

// --- Cotización dinámica ---
// Precios falsos para demo
const preciosRepuestos = {motor:120, plc:200, valvula:80, interruptor:60, faja:40, control:90, push:15, muletilla:18, termocupla:25, contactor:55, proteccion:35, sensor:45, transformador:70, rele:12, led:8, alarma:22, filtro:30, cobre:10, bola:28, regulador:32};
const preciosServicios = {montaje:300, mantenimiento:150, automatizacion:400, emergencia:250};
const repuestoOptions = `<option value="" disabled selected>Elige un repuesto</option>
  <option value="motor">Motor Eléctrico ($120)</option>
  <option value="plc">PLC Programable ($200)</option>
  <option value="valvula">Válvula solenoide ($80)</option>
  <option value="interruptor">Interruptor de corriente ($60)</option>
  <option value="faja">Faja de transmisión ($40)</option>
  <option value="control">Control de temperatura ($90)</option>
  <option value="push">Botón Push ($15)</option>
  <option value="muletilla">Selector de muletilla ($18)</option>
  <option value="termocupla">Termocupla ($25)</option>
  <option value="contactor">Contactor ($55)</option>
  <option value="proteccion">Protección térmica ($35)</option>
  <option value="sensor">Sensor inductivo ($45)</option>
  <option value="transformador">Transformador ($70)</option>
  <option value="rele">Relé ($12)</option>
  <option value="led">Luz led ($8)</option>
  <option value="alarma">Alarma lumínica ($22)</option>
  <option value="filtro">Filtro aire ($30)</option>
  <option value="cobre">Figura de cobre ($10)</option>
  <option value="bola">Válvula de bola ($28)</option>
  <option value="regulador">Regulador de presión ($32)</option>`;
const servicioOptions = `<option value="" disabled selected>Elige un servicio</option>
  <option value="montaje">Montaje industrial ($300)</option>
  <option value="mantenimiento">Mantenimiento ($150)</option>
  <option value="automatizacion">Automatización ($400)</option>
  <option value="emergencia">Atención 24/7 ($250)</option>`;

function iniciarCotizacion() {
  const repuestosList = document.getElementById('repuestosList');
  const serviciosList = document.getElementById('serviciosList');
  const addRepuesto = document.getElementById('addRepuesto');
  const addServicio = document.getElementById('addServicio');
  const totalAmount = document.getElementById('totalAmount');
  const breakdown = document.getElementById('breakdown');
  const calcBtn = document.getElementById('calculateQuote');
  const form = document.getElementById('quoteForm');
  if(!repuestosList || !serviciosList) return; // No está el formulario en la página
  // Función para crear fila de repuesto
  function crearRepuestoRow() {
    const div = document.createElement('div');
    div.className = 'quote-row';
    div.innerHTML = `<select class='premium-select repuesto-item'>${repuestoOptions}</select><input type='number' min='1' value='1' class='premium-cantidad cantidad-item' placeholder='Cantidad' /><button type='button' class='remove-item' title='Quitar'>✕</button>`;
    div.querySelector('.remove-item').onclick = () => div.remove();
    return div;
  }
  // Función para crear fila de servicio
  function crearServicioRow() {
    const div = document.createElement('div');
    div.className = 'quote-row';
    div.innerHTML = `<select class='premium-select servicio-item'>${servicioOptions}</select><button type='button' class='remove-item' title='Quitar'>✕</button>`;
    div.querySelector('.remove-item').onclick = () => div.remove();
    return div;
  }
  // Inicializar solo si está vacío (evita duplicados por recarga parcial)
  if (!repuestosList.querySelector('.repuesto-item')) repuestosList.appendChild(crearRepuestoRow());
  if (!serviciosList.querySelector('.servicio-item')) serviciosList.appendChild(crearServicioRow());
  if(addRepuesto) addRepuesto.onclick = () => repuestosList.appendChild(crearRepuestoRow());
  if(addServicio) addServicio.onclick = () => serviciosList.appendChild(crearServicioRow());
  function calcularTotal() {
    let total = 0;
    let desglose = [];
    // Repuestos
    repuestosList.querySelectorAll('.repuesto-item').forEach((sel, idx) => {
      const val = sel.value;
      const cant = parseInt(sel.parentElement.querySelector('.cantidad-item').value)||1;
      if(val && preciosRepuestos[val]) {
        const subt = preciosRepuestos[val]*cant;
        total += subt;
        desglose.push(`<li>${sel.options[sel.selectedIndex].text} x${cant} <span style='float:right;'>$${subt}</span></li>`);
      }
    });
    // Servicios
    serviciosList.querySelectorAll('.servicio-item').forEach((sel, idx) => {
      const val = sel.value;
      if(val && preciosServicios[val]) {
        total += preciosServicios[val];
        desglose.push(`<li>${sel.options[sel.selectedIndex].text} <span style='float:right;'>$${preciosServicios[val]}</span></li>`);
      }
    });
    if(totalAmount) totalAmount.textContent = '$'+total;
    if(breakdown) breakdown.innerHTML = desglose.join('');
  }
  if(calcBtn) calcBtn.onclick = function() {
    calcularTotal();
    // Scroll al resumen
    const resumen = document.querySelector('.quote-summary');
    if(resumen) {
      resumen.scrollIntoView({behavior:'smooth', block:'center'});
    }
  };
  // Limpiar resumen al cambiar algo
  [repuestosList, serviciosList].forEach(list => {
    list.addEventListener('change', function(){
      if(totalAmount) totalAmount.textContent = '$0';
      if(breakdown) breakdown.innerHTML = '';
    });
  });
  // Limpiar formulario tras 7 segundos al enviar
  if(form) form.addEventListener('submit', function(e){
    // Validación mínima: debe haber al menos un repuesto o servicio seleccionado
    const hayRepuesto = Array.from(repuestosList.querySelectorAll('.repuesto-item')).some(sel => sel.value);
    const hayServicio = Array.from(serviciosList.querySelectorAll('.servicio-item')).some(sel => sel.value);
    if(!hayRepuesto && !hayServicio) {
      e.preventDefault();
      alert('Agrega al menos un repuesto o servicio para cotizar.');
      return false;
    }
    setTimeout(()=>{
      form.reset();
      // Limpiar dinámicos
      repuestosList.innerHTML = '';
      serviciosList.innerHTML = '';
      repuestosList.appendChild(crearRepuestoRow());
      serviciosList.appendChild(crearServicioRow());
      if(totalAmount) totalAmount.textContent = '$0';
      if(breakdown) breakdown.innerHTML = '';
    },7000);
  });
}
// Ejecutar robusto: si el DOM ya está listo, ejecuta directo, si no, espera el evento
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarCotizacion);
} else {
  iniciarCotizacion();
}
// --- Fin cotización dinámica ---
