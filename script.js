/* =========================
   Mobile Navigation Toggle
========================= */
const menuBtn = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".links");

menuBtn.addEventListener("click", () => {
  const expanded = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", !expanded);
  navLinks.classList.toggle("open");
  menuBtn.textContent = expanded ? "☰" : "✕";
});

navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  });
});

/* =========================
   Smooth Scroll for Anchor Links
========================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) { 
      e.preventDefault(); 
      target.scrollIntoView({ behavior: "smooth" }); 
    }
  });
});

/* =========================
   Section Fade-In & Neon Glow on Scroll
========================= */
const sections = document.querySelectorAll(".section");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add("visible");
      entry.target.style.boxShadow = "0 0 60px rgba(110,231,255,0.4)";
    } else {
      entry.target.style.boxShadow = "none";
    }
  });
},{ threshold: 0.2 });
sections.forEach(sec => observer.observe(sec));

/* Add hover neon effect for info cards dynamically */
document.querySelectorAll('.info-card, .reg-card, .t-content, .speaker').forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "scale(1.03)";
    card.style.boxShadow = "0 0 48px rgba(110,231,255,0.5)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "scale(1)";
    card.style.boxShadow = "";
  });
});

/* =========================
   Countdown Timer
========================= */
const countdown = document.getElementById("countdown");
const eventDate = new Date("Nov 18, 2025 09:00:00").getTime();

if(countdown){
  setInterval(() => {
    const now = new Date().getTime();
    const distance = eventDate - now;
    if(distance < 0){
      countdown.innerHTML = "Event Started!";
      return;
    }
    const days = Math.floor(distance/(1000*60*60*24));
    const hours = Math.floor((distance%(1000*60*60*24))/(1000*60*60));
    const mins = Math.floor((distance%(1000*60*60))/(1000*60));
    const secs = Math.floor((distance%(1000*60))/1000);
    countdown.innerHTML = `${days}d ${hours}h ${mins}m ${secs}s`;

    // subtle pulsing effect
    countdown.style.textShadow = `0 0 ${5 + Math.sin(Date.now()*0.01)*3}px rgba(110,231,255,0.7)`;
  },1000);
}

/* =========================
   Back-to-Top Button
========================= */
const backToTop = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
  backToTop.style.display = (window.scrollY > 300) ? "block" : "none";
});
backToTop.addEventListener("click", () => {
  window.scrollTo({ top:0, behavior:"smooth" });
});

/* =========================
   Cinematic Particle / Starfield Background
========================= */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particlesArray = [];
let shootingStars = [];
const mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
window.addEventListener("mousemove", e => { mouse.x = e.x; mouse.y = e.y; });

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.baseSize = this.size;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if(this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    if(mouse.x && mouse.y){
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 120){
        this.x += dx * 0.02;
        this.y += dy * 0.02;
      }
    }
    this.size = this.baseSize + Math.sin(Date.now()*0.005 + this.x) * 0.5;
  }
  draw() {
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fill();
  }
}

class ShootingStar {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -10;
    this.len = Math.random()*80 + 100;
    this.speed = Math.random()*6 + 4;
    this.angle = Math.random()*Math.PI/8 - Math.PI/16;
  }
  update() {
    this.x += Math.cos(this.angle)*this.speed;
    this.y += Math.sin(this.angle)*this.speed + 2;
    if(this.y > canvas.height || this.x > canvas.width || this.x < 0) this.reset();
  }
  draw() {
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x,this.y);
    ctx.lineTo(this.x - Math.cos(this.angle)*this.len, this.y - Math.sin(this.angle)*this.len);
    ctx.stroke();
  }
}

function initParticles(num = 120){
  particlesArray = [];
  for(let i=0;i<num;i++) particlesArray.push(new Particle());
  shootingStars = [];
  for(let i=0;i<3;i++) shootingStars.push(new ShootingStar());
}
initParticles();

function connectParticles(){
  for(let a=0;a<particlesArray.length;a++){
    for(let b=a+1;b<particlesArray.length;b++){
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 120){
        ctx.strokeStyle = `rgba(110,231,255,${1 - dist/120})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x,particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x,particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function drawNebula() {
  const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);
  gradient.addColorStop(0,'rgba(50,0,100,0.25)');
  gradient.addColorStop(0.5,'rgba(0,0,50,0.2)');
  gradient.addColorStop(1,'rgba(0,0,0,0.3)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawNebula();
  particlesArray.forEach(p => { p.update(); p.draw(); });
  shootingStars.forEach(s => { s.update(); s.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Scroll-triggered fade-in with staggered delay
const animatedElements = document.querySelectorAll('.info-card, .speaker, .t-item, .reg-card');

function revealStaggered() {
  const triggerBottom = window.innerHeight * 0.85;

  animatedElements.forEach((el, index) => {
    const elTop = el.getBoundingClientRect().top;

    if(elTop < triggerBottom){
      // Add visible class with staggered delay
      setTimeout(() => {
        el.classList.add('visible');
      }, index * 150); // 150ms delay between elements
    }
  });
}

window.addEventListener('scroll', revealStaggered);
window.addEventListener('load', revealStaggered);
