/* ============================================================
   GreenEarth - script.js
   Features: mobile menu, dark mode, animated counters,
   waste bin info, tip filter, carbon calculator,
   pledge form validation, back-to-top button
   ============================================================ */

/* ---------- 1. Mobile menu toggle ---------- */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
// close the menu after clicking any link
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

/* ---------- 2. Dark mode (remembered using localStorage) ---------- */
const themeBtn = document.getElementById("themeBtn");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

/* ---------- 3. Animated counters (start when visible) ---------- */
const counters = document.querySelectorAll(".counter");

function runCounter(el) {
  const target = Number(el.dataset.target);
  const steps = 60;                 // number of animation steps
  let current = 0;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString("en-IN");
  }, 30);
}

// IntersectionObserver = detects when an element appears on screen
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runCounter(entry.target);
      obs.unobserve(entry.target);  // run only once
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => observer.observe(c));

/* ---------- 4. Waste bin information ---------- */
const binData = {
  green: {
    title: "🟢 Wet Waste (Green Bin)",
    items: ["Vegetable and fruit peels", "Leftover food", "Tea leaves and coffee grounds", "Garden waste like leaves"],
    tip: "Can be converted to compost."
  },
  blue: {
    title: "🔵 Dry Waste (Blue Bin)",
    items: ["Paper and cardboard", "Plastic bottles and wrappers", "Glass and metal cans", "Clothes and rubber"],
    tip: "Wash and dry before giving for recycling."
  },
  red: {
    title: "🔴 Hazardous Waste (Red Bin)",
    items: ["Batteries and cells", "Expired medicines", "Paint and chemical containers", "Sanitary and biomedical waste"],
    tip: "Never mix with normal waste. Hand over to authorised collectors."
  },
  yellow: {
    title: "🟡 E-Waste",
    items: ["Old mobile phones and chargers", "Computers and keyboards", "Earphones and cables", "Broken electronic gadgets"],
    tip: "Give to authorised e-waste recycling centres."
  }
};

const binButtons = document.querySelectorAll(".bin");
const binInfo = document.getElementById("binInfo");

binButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const data = binData[btn.dataset.bin];
    binButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const listItems = data.items.map(item => `<li>${item}</li>`).join("");
    binInfo.innerHTML = `<h3>${data.title}</h3><ul>${listItems}</ul><p><strong>Tip:</strong> ${data.tip}</p>`;
  });
});

/* ---------- 5. Eco tips filter ---------- */
const filterButtons = document.querySelectorAll(".filter");
const tips = document.querySelectorAll(".tip");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.filter;
    tips.forEach(tip => {
      const show = category === "all" || tip.dataset.category === category;
      tip.classList.toggle("hide", !show);
    });
  });
});

/* ---------- 6. Carbon footprint calculator ---------- */
// Approximate emission factors (kg CO2): electricity 0.82/unit, petrol vehicle 0.12/km, plastic item 0.03 each
document.getElementById("calcForm").addEventListener("submit", (e) => {
  e.preventDefault();   // stop page from reloading

  const electricity = Number(document.getElementById("electricity").value);
  const travel = Number(document.getElementById("travel").value);
  const plastic = Number(document.getElementById("plastic").value);

  const total = electricity * 0.82 + travel * 0.12 + plastic * 4 * 0.03;
  const result = document.getElementById("calcResult");

  let advice;
  if (total < 150) advice = "🌟 Great! Your footprint is low. Keep it up.";
  else if (total < 300) advice = "👍 Moderate. Try saving electricity and using public transport.";
  else advice = "⚠️ High. Reduce vehicle use and switch to energy-saving appliances.";

  result.innerHTML = `<strong>Estimated: ${total.toFixed(1)} kg CO₂ per month</strong><br>${advice}`;
  result.classList.remove("hidden");
});

/* ---------- 7. Pledge form validation ---------- */
const pledgeForm = document.getElementById("pledgeForm");
const pledgeCountEl = document.getElementById("pledgeCount");

// load saved pledge count
let pledgeCount = Number(localStorage.getItem("pledgeCount")) || 0;
pledgeCountEl.textContent = pledgeCount;

pledgeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const choice = document.getElementById("pledgeChoice").value;

  // clear old errors
  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("pledgeError").textContent = "";

  let valid = true;

  if (name.length < 3) {
    document.getElementById("nameError").textContent = "Please enter your name (min 3 letters).";
    valid = false;
  }
  // simple email pattern check
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    document.getElementById("emailError").textContent = "Please enter a valid email.";
    valid = false;
  }
  if (choice === "") {
    document.getElementById("pledgeError").textContent = "Please select a pledge.";
    valid = false;
  }

  if (!valid) return;

  pledgeCount++;
  localStorage.setItem("pledgeCount", pledgeCount);
  pledgeCountEl.textContent = pledgeCount;

  const msg = document.getElementById("pledgeMsg");
  msg.innerHTML = `🎉 Thank you, <strong>${name}</strong>! Your pledge: "${choice}".`;
  msg.classList.remove("hidden");
  pledgeForm.reset();
});

/* ---------- 8. Back to top button ---------- */
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
  topBtn.style.display = window.scrollY > 400 ? "block" : "none";
});
topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
