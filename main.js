// main.js — tiny helper: scroll reveal, typing effect placeholder, back-to-top
document.addEventListener('DOMContentLoaded', function () {
  // reveal on scroll using IntersectionObserver
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  // back-to-top
  const btt = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btt.classList.add('show'); else btt.classList.remove('show');
  });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // hero image subtle hover (desktop)
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    heroImg.addEventListener('mouseenter', () => heroImg.style.transform = 'scale(1.03)');
    heroImg.addEventListener('mouseleave', () => heroImg.style.transform = 'scale(1)');
  }

  // typing effect (simple, lightweight)
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const fullText = heroTitle.textContent;
    // If you prefer typing effect, uncomment below — lightweight simulation
    /*
    heroTitle.textContent = '';
    let i = 0;
    const t = setInterval(() => {
      heroTitle.textContent += fullText[i++];
      if (i >= fullText.length) clearInterval(t);
    }, 18);
    */
  }
});

// =========================
// Counter Animation
// =========================
const counters = document.querySelectorAll('.counter');
const speed = 150; // lower = faster

const startCounters = () => {
  counters.forEach(counter => {
    const update = () => {
      const target = +counter.getAttribute('data-target');
      const current = +counter.innerText;
      const increment = target / speed;

      if (current < target) {
        counter.innerText = Math.ceil(current + increment);
        setTimeout(update, 30);
      } else {
        counter.innerText = target;
      }
    };
    update();
  });
};

// Start when visible on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startCounters();
      observer.disconnect();
    }
  });
});
counters.forEach(counter => observer.observe(counter));

// =========================
// DYNAMIC ENROLLMENT + PAYSTACK
// =========================
const paystackPublicKey = "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Replace with your real key

const enrollModal = new bootstrap.Modal(document.getElementById("enrollModal"));
const courseTitle = document.getElementById("courseTitle");
const selectedCourse = document.getElementById("selectedCourse");
const selectedAmount = document.getElementById("selectedAmount");

// Step 1: Capture course data and open modal
document.querySelectorAll(".pay-btn").forEach(button => {
  button.addEventListener("click", function () {
    const courseName = this.dataset.course;
    const amount = this.dataset.amount;
    courseTitle.textContent = courseName;
    selectedCourse.value = courseName;
    selectedAmount.value = amount;
    enrollModal.show();
  });
});

// Step 2: Handle form submission → open Paystack
document.getElementById("enrollForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const studentName = document.getElementById("studentName").value;
  const studentEmail = document.getElementById("studentEmail").value;
  const studentPhone = document.getElementById("studentPhone").value;
  const course = selectedCourse.value;
  const amount = selectedAmount.value * 100; // Convert to kobo

  let handler = PaystackPop.setup({
    key: paystackPublicKey,
    email: studentEmail,
    amount: amount,
    currency: "NGN",
    ref: 'PSK_' + Math.floor((Math.random() * 1000000000) + 1),
    metadata: {
      custom_fields: [
        { display_name: "Full Name", variable_name: "full_name", value: studentName },
        { display_name: "Phone Number", variable_name: "phone", value: studentPhone },
        { display_name: "Course", variable_name: "course_name", value: course }
      ]
    },
    callback: function (response) {
      enrollModal.hide();
      alert(`✅ Payment successful!\nCourse: ${course}\nTransaction Ref: ${response.reference}`);
    },
    onClose: function () {
      alert("❌ Payment window closed.");
    }
  });
  handler.openIframe();
});
