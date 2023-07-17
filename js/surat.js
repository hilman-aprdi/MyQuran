let suratContainer = document.querySelector('.surat-cont'),
    ayatContainer = document.querySelector('.ayat-cont'),
    tafsirContainer = document.querySelector('.tafsir-cont'),
    suratInfo = document.querySelector(".surat-info"),
    searchBox = document.querySelector('#search-box'),
    loadingIndicator = document.querySelector('.loading-indicator'),
    qari = document.querySelector('.qari'),
    audioFull = document.querySelector('audio'),
    suratURL = "";


function invisible() {
  loadingIndicator.style.display = 'flex';
  suratContainer.classList.remove("hidden");
  jadwal.classList.remove("hidden");
  searchBox.classList.remove("hidden")
  const lp = document.querySelector(".landing-page")
  lp.classList.add("invisible");
  setTimeout(() => {
    lp.classList.add("hidden")
    loadingIndicator.style.display = 'none';
  }, 1000);
}


function tafsirSurat() {
  const id = ayatContainer.querySelector('.ayat-elem').dataset.id;
  tafsirContainer.classList.remove("hidden")
  suratContainer.classList.add("hidden");
  ayatContainer.classList.add("hidden");
  loadingIndicator.style.display = 'flex';

  fetch(`https://equran.id/api/v2/tafsir/${id}`).then(res => res.json()).then(res => {
    loadingIndicator.style.display = 'none';
    const tafsirInfo = document.querySelector(".tafsir-info");
    tafsirInfo.innerHTML = `
      <h1 class="text-xl font-bold">Tafsir surat <i>${res.data.namaLatin}</i></h1>`;
    let tafsirHTML = '';
    res.data.tafsir.forEach((ayat, index) => {
      index += 1;
      tafsirHTML += `
        <div class="my-4 md:mx-8">
          <input type="checkbox" id="tafsir${index}" class="peer sr-only" />
          <label for="tafsir${index}" class="text-xl font-bold bg-transparent backdrop-blur-lg block p-4 text-white rounded-lg peer-checked:rounded-b-none flex justify-between hover:bg-white border-2 border-white group">
              <span class="group-hover:text-dark">Ayat ke-${index}</span>
              <span>📖</span>
            </label>
            <p class="px-1.5 py-2 hidden border border-white border-2 rounded-b-lg peer-checked:block backdrop-blur-lg">${ayat.teks}
            </p>
          </div>
       `;
    })
    tafsirContainer.innerHTML += tafsirHTML;
  })
}
loadingIndicator.style.display = 'flex';
fetch("https://equran.id/api/v2/surat").then(response => response.json()).then(data => {
  // Proses respons API
  let suratHTML = "";
  for (const surat of data.data) {
    suratHTML += `
      <div class="letter shadow-lg p-8 flex items-center gap-4 rounded-2xl hover:bg-dark/25 hover:text-cyan-50 group transition-all duration-300 ease-in-out border border-white border-2 bg-transparent backdrop-blur-lg">
        <div class="rounded-full flex items-center justify-center h-10 w-10 border-dotted border-2 border-white group-hover:border-cyan-50">${surat.nomor}</div>
          <div class="grid">
          <h4 class="font-bold">${surat.namaLatin} (${surat.nama})</h4>
          <div class="flex gap-3 text-xs">
            <p>${surat.arti} - </p>
            <p>${surat.jumlahAyat} Ayat</p>
          </div>
        </div>
      </div>
    `;
  }
  suratContainer.innerHTML = suratHTML;
  // Live search
  const suratItems = Array.from(suratContainer.getElementsByClassName('letter'));
  searchBox.addEventListener('input', function () {
    const searchValue = this.value.toLowerCase();
    suratItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(searchValue) ? '' : 'none';
    });
  });


  for (const item of suratItems) {
    item.addEventListener('click', () => {
      searchBox.classList.add("hidden")
      loadingIndicator.style.display = 'flex';
      const suratNumber = item.children[0].textContent;
      suratURL = `https://equran.id/api/v2/surat/${suratNumber}`;
      fetch(suratURL).then(res => res.json()).then(res => {
        const surat = res.data;
        console.log(surat)
        suratInfo.innerHTML = `
          <h1 class="text-6xl">${surat.nama}</h1>
          <p class="text-lg">(${surat.namaLatin})</p>
          <div>
            <span>${surat.arti} • </span>
            <span>${surat.jumlahAyat} Ayat • </span>
            <span>${surat.tempatTurun}</span>
          </div>
        `;
        loadingIndicator.style.display = 'none';
        const ayats = res.data.ayat.map(ayat => createAyatElement(ayat, ayat.audio['05'], res.data.nomor));
        audioFull.innerHTML = `<source src="${res.data.audioFull["05"]}"></source>`;
        document.querySelector('.deskripsi').innerHTML = res.data.deskripsi;
        document.querySelector('.surat').innerHTML = ayats.join('');
      });
      suratContainer.classList.add("hidden")
      ayatContainer.classList.remove("hidden")
      jadwal.classList.add("hidden")
    });
  }
  loadingIndicator.style.display = 'none';
})


function createAyatElement(ayat, audio, nomor) {
  return `
    <div class="container ayat-elem my-6 shadow-lg rounded-2xl p-4 bg-transparent backdrop-blur-lg" data-id="${nomor}">
      <p class="text-center mb-3">${ayat.nomorAyat}:${nomor}</p>
      <p class="text-center">
        <audio src="${audio}" preload="none" ></audio>
        <button class="text-4xl mb-5 text-center" onclick="toggleAudio(this)">${ayat.teksArab}<span class="mt-5 block text-sm">🔊</span></button>
      </p>
      <p class="border-b border-b-2 border-b-white pb-2 italic text-sm">${ayat.teksLatin}</p>
      <p class="mt-2 text-sm">${ayat.teksIndonesia}</p>
    </div>`;
}


qari.addEventListener("change", () => {
  fetch(suratURL).then(res => res.json()).then(res => {
    const ayats = res.data.ayat.map(ayat => createAyatElement(ayat, ayat.audio[qari.value], res.data.nomor));
    document.querySelector('.surat').innerHTML = ayats.join('');
  })
})


// putar audio saat ayat diklik
function toggleAudio(button) {
  const audio = button.parentNode.querySelector('audio');
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
}


history.pushState(null, null, location.href);
window.addEventListener('popstate', () => {
  if (suratContainer.classList.contains("hidden")) {
    ayatContainer.classList.add("hidden");
    tafsirContainer.classList.add("hidden");
    suratContainer.classList.remove("hidden")
    jadwal.classList.remove("hidden");
    searchBox.classList.remove("hidden");
  }
})
window.addEventListener('popstate', () => {
  history.pushState(null, null, location.href);
})
