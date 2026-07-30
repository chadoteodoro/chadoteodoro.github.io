const config = window.TEODORO_CONFIG;
const eventDate = new Date(config.eventDate);
const countdownStartedAt = new Date("2026-07-01T00:00:00-03:00");

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

const pad = value => String(Math.max(0, value)).padStart(2, "0");

function updateCountdown() {
  const now = new Date();
  const distance = eventDate.getTime() - now.getTime();

  if (distance <= 0) {
    $("#countdown").hidden = true;
    $(".countdown-progress").hidden = true;
    $("#eventArrived").hidden = false;
    if (!sessionStorage.getItem("teodoro-celebrated")) {
      sessionStorage.setItem("teodoro-celebrated", "true");
      launchConfetti(4800);
    }
    return;
  }

  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);

  $("#days").textContent = pad(days);
  $("#hours").textContent = pad(hours);
  $("#minutes").textContent = pad(minutes);
  $("#seconds").textContent = pad(seconds);

  const totalWindow = eventDate.getTime() - countdownStartedAt.getTime();
  const elapsed = now.getTime() - countdownStartedAt.getTime();
  const progress = Math.min(100, Math.max(1.5, (elapsed / totalWindow) * 100));
  $("#progressBar").style.width = `${progress}%`;
  $("#progressDuck").style.left = `${progress}%`;
}

function setupNavigation() {
  const header = $("#siteHeader");
  const button = $("#menuButton");
  const nav = $("#mobileNav");

  const closeMenu = () => {
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Abrir menu");
    nav.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  };

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    nav.setAttribute("aria-hidden", String(isOpen));
    document.body.classList.toggle("menu-open", !isOpen);
  });

  $$("a", nav).forEach(link => link.addEventListener("click", closeMenu));
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 32);
  }, { passive: true });
}

function setupReveal() {
  const elements = $$(".reveal, .reveal-item");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach(element => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  elements.forEach(element => observer.observe(element));
}

function setupLinks() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.address)}`;
  $("#mapsButton").href = mapsUrl;

  $("#rsvpForm").addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#guestName").value.trim();
    const count = Number($("#guestCount").value);

    if (!name) {
      showToast("Conte para a gente o seu nome primeiro.");
      $("#guestName").focus();
      return;
    }

    const message = encodeURIComponent(config.whatsappMessage(name, count));
    const number = String(config.whatsappNumber || "").replace(/\D/g, "");
    const url = number
      ? `https://wa.me/${number}?text=${message}`
      : `https://wa.me/?text=${message}`;

    showToast(number ? "Abrindo o WhatsApp com sua mensagem..." : "Mensagem pronta! Escolha o contato no WhatsApp.");
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

function showToast(message) {
  const toast = $("#toast");
  $("#toastMessage").textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 4200);
}

function launchConfetti(duration = 3500) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = $("#confettiCanvas");
  const context = canvas.getContext("2d");
  const colors = ["#667b38", "#9ca76a", "#d3ad3d", "#f4d87d", "#fff8e9", "#355229"];
  const particles = Array.from({ length: 150 }, (_, index) => ({
    x: Math.random() * innerWidth,
    y: -20 - Math.random() * innerHeight * 0.55,
    width: 5 + Math.random() * 8,
    height: 7 + Math.random() * 10,
    color: colors[index % colors.length],
    speed: 2.2 + Math.random() * 4.5,
    swing: Math.random() * Math.PI * 2,
    spin: Math.random() * Math.PI,
    shape: Math.random() > 0.82 ? "heart" : "rect"
  }));

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  canvas.classList.add("active");
  const started = performance.now();

  function drawHeart(particle) {
    const size = particle.width;
    context.beginPath();
    context.moveTo(particle.x, particle.y + size / 3);
    context.bezierCurveTo(particle.x - size, particle.y - size / 2, particle.x - size, particle.y + size, particle.x, particle.y + size * 1.35);
    context.bezierCurveTo(particle.x + size, particle.y + size, particle.x + size, particle.y - size / 2, particle.x, particle.y + size / 3);
    context.fill();
  }

  function frame(now) {
    context.clearRect(0, 0, innerWidth, innerHeight);
    particles.forEach(particle => {
      particle.y += particle.speed;
      particle.x += Math.sin(particle.swing += 0.025) * 1.15;
      particle.spin += 0.04;
      context.save();
      context.fillStyle = particle.color;
      context.globalAlpha = 0.92;
      if (particle.shape === "heart") {
        drawHeart(particle);
      } else {
        context.translate(particle.x, particle.y);
        context.rotate(particle.spin);
        context.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
      }
      context.restore();
    });

    if (now - started < duration) {
      requestAnimationFrame(frame);
    } else {
      canvas.classList.remove("active");
      context.clearRect(0, 0, innerWidth, innerHeight);
    }
  }

  requestAnimationFrame(frame);
}

$("#celebrateButton")?.addEventListener("click", () => launchConfetti(4200));
setupNavigation();
setupReveal();
setupLinks();
updateCountdown();
setInterval(updateCountdown, 1000);
