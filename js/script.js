// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// NASA API key
const apiKey = "bGPbGZ9eCjJoex4jc8rWWKRemA6Pwzz8sbRBntAJ";

// Button + gallery
const button = document.querySelector("button");
const gallery = document.getElementById("gallery");

// When button is clicked
button.addEventListener("click", fetchImages);

function fetchImages() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Loading message (rubric requirement)
  gallery.innerHTML = `<div class="placeholder"><p>Loading space images...</p></div>`;

  fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`)
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
    const div = document.createElement("div");
    div.classList.add("gallery-item");

    let content;

    // Handle images vs videos (bonus points)
    if (item.media_type === "image") {
      content = `<img src="${item.url}" alt="${item.title}">`;
    } else {
      content = `<a href="${item.url}" target="_blank">Watch Video</a>`;
    }

    div.innerHTML = `
      ${content}
      <p><strong>${item.title}</strong></p>
      <p>${item.date}</p>
    `;

    // Modal click
    div.addEventListener("click", () => openModal(item));

    gallery.appendChild(div);
  });
}

const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");

function openModal(item) {
  modal.classList.remove("hidden");

  document.getElementById("modal-title").textContent = item.title;
  document.getElementById("modal-date").textContent = item.date;
  document.getElementById("modal-desc").textContent = item.explanation;
  document.body.style.overflow = "hidden";
  if (item.media_type === "image") {
    document.getElementById("modal-img").src = item.url;
    document.getElementById("modal-img").style.display = "block";
  } else {
    document.getElementById("modal-img").style.display = "none";
  }
}

// Close modal
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});
const backBtn = document.getElementById("back-btn");

backBtn.addEventListener("click", closeModal);

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
}