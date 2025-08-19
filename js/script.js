// script.js

document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.getElementById("navToggle");
  const nav = document.querySelector(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("nav-open");
    });
  }

  // Dropdown menu toggle for mobile
  document.querySelectorAll(".dropbtn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelectorAll(".dropdown-content").forEach(function (dc) {
        if (dc !== btn.nextElementSibling) dc.classList.remove("show");
      });
      btn.nextElementSibling.classList.toggle("show");
    });
  });

  // Close dropdowns when clicking outside
  window.addEventListener("click", function (event) {
    if (!event.target.matches(".dropbtn")) {
      document.querySelectorAll(".dropdown-content").forEach(function (dc) {
        dc.classList.remove("show");
      });
    }
  });

  // Modal open/close logic
  const openBtn = document.getElementById("openConsultForm");
  const closeBtn = document.getElementById("closeConsultForm");
  const modal = document.getElementById("consultModal");
  const form = document.getElementById("consultForm");
  const msg = document.getElementById("consultMsg");

  if (openBtn && modal && form && msg) {
    openBtn.addEventListener("click", () => {
      modal.style.display = "flex";
      msg.textContent = "";
      msg.classList.remove("error");
      form.reset();
    });
  }
  if (closeBtn && modal && msg) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      msg.textContent = "";
      msg.classList.remove("error");
    });
  }
  // Close modal on overlay click
  if (modal && msg) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        msg.textContent = "";
        msg.classList.remove("error");
      }
    });
  }

  // Form submission
  if (form && msg) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form field values by name
      const fullname = form.elements["fullname"] ? form.elements["fullname"].value.trim() : "";
      const email = form.elements["email"] ? form.elements["email"].value.trim() : "";
      const mobile = form.elements["mobile"] ? form.elements["mobile"].value.trim() : "";
      const project = form.elements["project"] ? form.elements["project"].value.trim() : "";

      msg.textContent = "Submitting...";
      msg.classList.remove("error");

fetch("https://tragontechnologies.onrender.com/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullname,
          email,
          mobile,
          project
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            msg.textContent = "Submitted! Thanks, we will get back to you soon.";
            msg.classList.remove("error");
            form.reset();
          } else {
            msg.textContent = "Error: " + (data.error || "Unknown error");
            msg.classList.add("error");
          }
        })
        .catch(() => {
          msg.textContent = "Network error. Please try again.";
          msg.classList.add("error");
        });
    });
  }
});

//project category

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - document.querySelector(".nav").offsetHeight, // offset for fixed nav
        behavior: "smooth"
      });
    }
  });
});

// Scroll to anchor on page load if present in URL
document.addEventListener("DOMContentLoaded", function () {
  const hash = window.location.hash.substring(1);
  if (hash) {
    const target = document.getElementById(hash);
    if (target) {
      setTimeout(() => {
        window.scrollTo({
          top: target.offsetTop - document.querySelector(".nav").offsetHeight,
          behavior: "smooth"
        });
      }, 300); // wait a moment for page layout
    }
  }
});