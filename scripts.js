
/* scripts.js - shared across pages
   Features:
   - Intro reveal (shown once on first visit)
   - Play chime/whoosh on Enter (user gesture)
   - Background music (plays after user enters if gesture)
   - Theme toggle (prefers-color-scheme fallback, persisted)
   - Intercept nav link clicks to create smooth fade between pages
   - Stagger reveal of sections
*/
document.addEventListener('DOMContentLoaded', function(){
  const intro = document.getElementById('intro');
  const enterBtn = document.getElementById('enterBtn');
  const site = document.getElementById('site');
  const chime = document.getElementById('chime');
  const whoosh = document.getElementById('whoosh');
  const bgm = document.getElementById('bgm');
  const toggle = document.getElementById('themeToggle');
  const fadeOverlay = document.getElementById('pageFade');
  const seenKey = 'legacies_seen_intro_v1';
  const themeKey = 'legacies_theme_v1';

  const holdBeforeAuto = 2800;
  const fadeDuration = 900; // overlay fade duration used for page transitions
  let entered = false;

  // Reveal site after intro (only show intro once)
  function revealSite(playSound=true){
    if(entered) return;
    entered = true;
    // play sounds if allowed
    if(playSound){
      try{ chime.currentTime = 0; chime.volume = 0.45; chime.play().catch(()=>{}); }catch(e){}
      setTimeout(()=>{ try{ whoosh.currentTime = 0; whoosh.volume = 0.6; whoosh.play().catch(()=>{}); }catch(e){} }, 380);
      // try playing bgm softly after whoosh
      setTimeout(()=>{ if(bgm){ try{ bgm.currentTime = 0; bgm.volume = 0.12; bgm.play().catch(()=>{}); }catch(e){} } }, 1000);
    }
    intro.classList.add('hidden');
    setTimeout(()=>{
      intro.style.display = 'none';
      document.body.style.overflow = 'auto';
      // show main content
      site.classList.add('visible');
      // animate sections
      document.querySelectorAll('.fade-in').forEach((el,i)=>{
        setTimeout(()=> el.classList.add('visible'), 120*i + 80);
      });
    }, 700);
    // mark seen
    localStorage.setItem(seenKey, '1');
  }

  // If user already saw intro, skip it
  const seen = localStorage.getItem(seenKey);
  if(seen){
    // hide intro immediately and show site
    if(intro) intro.style.display = 'none';
    document.body.style.overflow = 'auto';
    if(site) site.classList.add('visible');
    document.querySelectorAll('.fade-in').forEach((el,i)=>{
      setTimeout(()=> el.classList.add('visible'), 80*i + 40);
    });
  } else {
    // auto reveal after short hold (no sound)
    setTimeout(()=> revealSite(false), holdBeforeAuto);
  }

  // Enter button click -> reveal w/ sound (gesture)
  if(enterBtn){
    enterBtn.addEventListener('click', ()=> revealSite(true));
  }

  // THEME: prefer user's system unless they have saved preference
  function applyTheme(theme){
    if(theme === 'light') document.body.classList.add('light');
    else document.body.classList.remove('light');
    localStorage.setItem(themeKey, theme);
  }
  // initial
  (function initTheme(){
    const saved = localStorage.getItem(themeKey);
    if(saved){
      applyTheme(saved);
    } else {
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      applyTheme(prefersLight ? 'light' : 'dark');
    }
  })();
  if(toggle){
    toggle.addEventListener('click', ()=>{
      const isLight = document.body.classList.contains('light');
      applyTheme(isLight ? 'dark' : 'light');
    });
  }

  // Background music accessible control: clicking footer toggles
  const bgmToggle = document.getElementById('bgmToggle');
  if(bgm && bgmToggle){
    bgmToggle.addEventListener('click', function(){
      if(bgm.paused){ bgm.play().catch(()=>{}); bgmToggle.textContent = '🔊'; }
      else { bgm.pause(); bgmToggle.textContent = '🔈'; }
    });
  }

  // Page transition: intercept nav links and fade overlay, then navigate
  document.querySelectorAll('.header-menu a').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = a.getAttribute('href');
      if(!href || href.startsWith('#')) return;
      e.preventDefault();
      // activate overlay
      if(fadeOverlay) fadeOverlay.classList.add('active');
      setTimeout(()=> { window.location.href = href; }, fadeDuration);
    });
  });

  // When coming back to page, ensure fade overlay hidden
  if(fadeOverlay) fadeOverlay.classList.remove('active');

});
