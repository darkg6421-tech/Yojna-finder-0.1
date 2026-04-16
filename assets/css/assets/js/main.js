(function(){
  // Dark mode
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('theme') || 'light';
  root.setAttribute('data-theme', storedTheme);
  if(themeToggle) themeToggle.addEventListener('click',()=>{
    const next = root.getAttribute('data-theme')==='light'?'dark':'light';
    root.setAttribute('data-theme',next); localStorage.setItem('theme',next);
  });

  // Mobile menu
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  if(toggleBtn && navMenu){
    toggleBtn.addEventListener('click',()=>{
      const expanded = toggleBtn.getAttribute('aria-expanded')==='true'?false:true;
      toggleBtn.setAttribute('aria-expanded', expanded);
      navMenu.classList.toggle('active');
    });
  }

  // Scroll reveal
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('visible');});
  },{threshold:0.1});
  document.querySelectorAll('.animate-on-scroll').forEach(el=>observer.observe(el));

  // Weather
  const weatherWidget = document.getElementById('weatherWidget');
  if(weatherWidget){
    weatherWidget.innerHTML = `<div class="weather-loading-skeleton"></div>`;
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(async pos=>{
        try{
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true`);
          const data = await res.json();
          const temp = data.current_weather.temperature;
          const code = data.current_weather.weathercode;
          const {icon,desc} = getWeatherDetails(code);
          weatherWidget.innerHTML = `<div class="weather-icon">${icon}</div><div class="weather-temp">${temp}°C</div><div class="weather-desc">${desc}</div><small>in your area</small>`;
        }catch{weatherWidget.innerHTML='<p>Weather unavailable</p>';}
      },()=>{weatherWidget.innerHTML='<p>Location access denied.</p>';});
    }
  }
  function getWeatherDetails(code){
    if(code<=3) return {icon:'☀️',desc:'Clear'};
    if(code<=49) return {icon:'🌫️',desc:'Fog'};
    if(code<=69) return {icon:'🌧️',desc:'Rain'};
    return {icon:'☁️',desc:'Cloudy'};
  }

  // Contact form
  window.initContactForm = function(){
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    form.addEventListener('submit',async(e)=>{
      e.preventDefault(); clearErrors();
      let valid=true;
      const name=document.getElementById('name'), email=document.getElementById('email'), msg=document.getElementById('message');
      if(!name.value.trim()){showError('name','Required');valid=false;}
      if(!/^\S+@\S+\.\S+$/.test(email.value)){showError('email','Invalid email');valid=false;}
      if(!msg.value.trim()){showError('message','Required');valid=false;}
      if(!valid)return;
      status.textContent='Sending...';
      try{
        const res = await fetch('https://formspree.io/f/mayvlrnb',{method:'POST',headers:{'Accept':'application/json'},body:new FormData(form)});
        if(res.ok){status.innerHTML='<span style="color:green">✓ Message sent!</span>'; form.reset();}
        else throw new Error();
      }catch{status.innerHTML='<span style="color:red">Error. Try again.</span>';}
    });
    function showError(field,msg){document.querySelector(`[data-error="${field}"]`).textContent=msg;}
    function clearErrors(){document.querySelectorAll('[data-error]').forEach(e=>e.textContent='');}
  };

  // Search
  window.initServiceSearch = async function(){
    const input=document.getElementById('serviceSearch'), results=document.getElementById('searchResults');
    let services=[];
    try{ const res=await fetch('./assets/data/search.json'); services=await res.json(); }catch(e){}
    input.addEventListener('input',e=>{
      const term=e.target.value.toLowerCase();
      const filtered=services.filter(s=>s.title.toLowerCase().includes(term)||s.description.toLowerCase().includes(term));
      results.innerHTML=filtered.length?filtered.map(s=>`<div class="service-card"><h3>${s.title}</h3><p>${s.description}</p></div>`).join(''):'<p>No matches</p>';
    });
  };
})();
