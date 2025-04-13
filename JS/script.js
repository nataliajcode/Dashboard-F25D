// KLOCKA & DATUM
function updateClock() {
    const now = new Date();
    const clock = document.getElementById("clock");
    const date = document.getElementById("date");
  
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    clock.textContent = `${hours}:${minutes}`;
  
    const options = { year: "numeric", month: "long", day: "numeric" };
    date.textContent = now.toLocaleDateString("sv-SE", options);
  }
  setInterval(updateClock, 1000);
  updateClock();
  
  // REDIGERBAR RUBRIK 
  const titleEl = document.getElementById("dashboard-title");
  titleEl.textContent = localStorage.getItem("dashboardTitle") || "Natalia Johanssons Dashboard";
  
  titleEl.addEventListener("input", () => {
    localStorage.setItem("dashboardTitle", titleEl.textContent);
  });
  
  // SNABBLÄNKAR 
  const linkForm = document.getElementById("link-form");
  const linkList = document.getElementById("link-list");
  let links = JSON.parse(localStorage.getItem("links")) || [];
  
  function renderLinks() {
    linkList.innerHTML = "";
    links.forEach((link, index) => {
      const li = document.createElement("li");
      const favicon = document.createElement("img");
      favicon.src = `https://www.google.com/s2/favicons?sz=32&domain_url=${link.url}`;
      favicon.alt = "";
  
      const a = document.createElement("a");
      a.href = link.url;
      a.textContent = link.title;
      a.target = "_blank";
  
      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.onclick = () => {
        links.splice(index, 1);
        localStorage.setItem("links", JSON.stringify(links));
        renderLinks();
      };
  
      li.appendChild(favicon);
      li.appendChild(a);
      li.appendChild(delBtn);
      linkList.appendChild(li);
    });
  }
  
  linkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("link-title").value;
    const url = document.getElementById("link-url").value;
    links.push({ title, url });
    localStorage.setItem("links", JSON.stringify(links));
    renderLinks();
    linkForm.reset();
  });
  
  renderLinks();
  
  // VÄDER 
  async function hamtaVader() {
    const lat = 57.6689;
    const lon = 12.5783;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Kunde inte hämta vädret");

      const data = await response.json();
      const temp = data.current_weather.temperature;
      const weatherCode = data.current_weather.weathercode;

      const beskrivning = hamtaVaderBeskrivning(weatherCode);

      document.getElementById("vader").innerHTML =
        `Temperatur: ${temp}°C<br>Väder: ${beskrivning}`;
    } catch (error) {
      document.getElementById("vader").innerText =
        "Fel vid hämtning av vädret.";
      console.error(error);
    }
  }

  function hamtaVaderBeskrivning(kod) {
    const koder = {
      0: "Klart",
      1: "Mest klart",
      2: "Delvis molnigt",
      3: "Molnigt",
      45: "Dimma",
      48: "Frostdimma",
      51: "Lätt duggregn",
      53: "Måttligt duggregn",
      55: "Tungt duggregn",
      61: "Lätt regn",
      63: "Måttligt regn",
      65: "Tungt regn",
      71: "Lätt snö",
      73: "Måttlig snö",
      75: "Tung snö",
      80: "Regnskurar",
      95: "Åska"
    };
    return koder[kod] || "Okänt väder";
  }

  hamtaVader();
  
  // CITAT 
  async function hamtaMeme() {
    try {
      const response = await fetch("https://api.blademaker.tv/memes/random");
      const data = await response.json();
      
      if (data.image) {
        
        document.getElementById("meme-img").src = data.image;
        
        localStorage.setItem("senasteMeme", data.image);
      } else {
        document.getElementById("meme-img").src = "https://via.placeholder.com/500?text=Inget+meme+hittades";
      }
    } catch (error) {
      console.error("Fel vid hämtning av meme:", error);
      document.getElementById("meme-img").src = "https://via.placeholder.com/500?text=Fel+vid+hämta+meme";
    }
  }

  function laddaSenasteMeme() {
    const sparatMeme = localStorage.getItem("senasteMeme");
    if (sparatMeme) {
      document.getElementById("meme-img").src = sparatMeme;
    } else {
      hamtaMeme(); 
    }
  }

  laddaSenasteMeme();

  // ANTECKNINGAR
  const notesEl = document.getElementById("notes");
  notesEl.value = localStorage.getItem("notes") || "";
  notesEl.addEventListener("input", () => {
    localStorage.setItem("notes", notesEl.value);
  });
  
  // SLUMPA BAKGRUND 
  const bgBtn = document.getElementById("background-btn");
  bgBtn.addEventListener("click", () => {
    const colors = ["#f5f5f5", "#e6f7ff", "#fff0f5", "#e0ffe0", "#ffffe0"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
  });
  