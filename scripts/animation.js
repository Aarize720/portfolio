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
