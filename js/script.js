// Inputs
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
setupDateInputs(startInput, endInput);

// NASA API key
const apiKey = "bGPbGZ9eCjJoex4jc8rWWKRemA6Pwzz8sbRBntAJ";

// Button + gallery
const button = document.getElementById("fetch-btn");
const gallery = document.getElementById("gallery");

// Modal elements
const modal = document.getElementById("modal");
const backBtn = document.getElementById("back-btn");

// Click event
button.addEventListener("click", fetchImages);

function fetchImages() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Validate 9‑day range
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = (end - start) / (1000 * 60 * 60 * 24);

  if (diff !== 8) {
    alert("Please select a date range of exactly 9 consecutive days.");
    return;
  }

  gallery.innerHTML = `<div class="placeholder"><p>Loading space images...</p></div>`;

  fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}&thumbs=true`)
    .then(res => res.json())
    .then(data => {
      displayImages(data);
    })
    .catch(err => {
      console.error(err);
      gallery.innerHTML = `<div class="placeholder"><p>Error loading images 🚨</p></div>`;
    });
}

function displayImages(data) {
  gallery.innerHTML = "";

  data.slice(0, 9).forEach(item => {
     console.log(item);
    const div = document.createElement("div");
    div.classList.add("gallery-item");

    let content;

    // ⭐ Correct thumbnail logic
    if (item.media_type === "image") {
      content = `<img src="${item.url}" alt="${item.title}">`;
} else {
  const thumb = item.thumbnail_url || item.hdurl || item.url || "img/video-placeholder.png";
  content = `<img src="${thumb}" alt="${item.title}">`;
}


    div.innerHTML = `
      ${content}
      <p><strong>${item.title}</strong></p>
      <p>${item.date}</p>
    `;

    div.addEventListener("click", () => openModal(item));

    gallery.appendChild(div);
  });
}

function openModal(item) {
  modal.classList.remove("hidden");

  document.getElementById("modal-title").textContent = item.title;
  document.getElementById("modal-date").textContent = item.date;
  document.getElementById("modal-desc").textContent = item.explanation;

  const modalImg = document.getElementById("modal-img");
  const modalVideo = document.getElementById("modal-video");

  document.body.style.overflow = "hidden";

  if (item.media_type === "image") {
    modalImg.src = item.url;
    modalImg.style.display = "block";

    modalVideo.src = "";
    modalVideo.style.display = "none";

  } else {
    modalVideo.src = "";
    modalVideo.style.display = "none";

    const thumb = item.thumbnail_url || item.hdurl || item.url || "img/video-placeholder.png";

    modalImg.src = thumb;
    modalImg.style.display = "block";

    const descEl = document.getElementById("modal-desc");
    descEl.textContent = item.explanation + " ";

    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.textContent = "▶ Watch Video on NASA.gov";
    link.style.color = "#FC3D21";
    link.style.fontWeight = "bold";

    descEl.appendChild(link);
  }
}

backBtn.addEventListener("click", closeModal);

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
}

const facts = [
  "A day on Venus is longer than a year on Venus.",
  "Neutron stars can spin 600 times per second.",
  "Jupiter has the shortest day of all planets.",
  "There are more stars in the universe than grains of sand on Earth.",
  "The Sun makes up 99.8% of the mass in our solar system.",
  "Mars has the largest volcano in the solar system: Olympus Mons.",
  "Light from the Sun takes 8 minutes to reach Earth.",
  "Saturn could float in water because it’s mostly gas.",
  "A spoonful of a neutron star weighs about a billion tons."
];

function loadRandomFact() {
  const fact = facts[Math.floor(Math.random() * facts.length)];
  document.getElementById("space-fact").textContent = "🚀 Did you know? " + fact;
}

loadRandomFact();
