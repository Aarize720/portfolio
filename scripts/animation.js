// === Animation des éléments à l'entrée dans le viewport ===

const animatedElements = document.querySelectorAll("[data-animate]");

const observer = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      entry.target.classList.add("animated");

      observer.unobserve(entry.target);

    }

  });

}, { threshold: 0.1 });

animatedElements.forEach(el => observer.observe(el));

// === Nouvelles animations pour les éléments spéciaux ===
const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => fadeObserver.observe(el));

// === Loader de page ===

window.addEventListener("load", () => {

  const loader = document.getElementById("page-loader");

  if (loader) {

    loader.classList.add("fade-out");

  }

});

// === Smooth scroll (optionnel, à activer si tu veux) ===

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

   anchor.addEventListener("click", function (e) {

     e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({

       behavior: "smooth"

     });

   });

 });
