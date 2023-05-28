let suratContainer = document.querySelector('.surat-cont'),
      searchBox = document.querySelector('#search-box'),
      loadingIndicator = document.getElementById('loading-indicator'),
      ayatContainer = document.querySelector('.ayat-cont'),
      qari = document.querySelector('.qari'),
      audioFull = document.querySelector('audio');
      suratURL = "";


loadingIndicator.style.display = 'block';
fetch("https://equran.id/api/v2/surat")
  .then(response => response.json())
  .then(data => {
    // Proses respons API
    console.log(data);
    let suratHTML = "";
    for (const surat of data.data) {
      suratHTML += `
        <div class="letter shadow-lg p-8 flex items-center gap-4 rounded-2xl hover:bg-primary hover:text-cyan-50 group transition-all duration-300 ease-in-out border border-primary border-2 bg-amber-700">
          <div class="rounded-full flex items-center justify-center h-10 w-10 border-dotted border-2 border-dark group-hover:border-cyan-50">${surat.nomor}</div>
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
    searchBox.addEventListener('input', function() {
      const searchValue = this.value.toLowerCase();
      suratItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchValue) ? '' : 'none';
      });
    });

    // Simpan URL surat yang diklik pada localStorage
    for (const item of suratItems) {
      item.addEventListener('click', () => {
        const suratNumber = item.children[0].textContent;
        suratURL = `https://equran.id/api/v2/surat/${suratNumber}`;
        fetch(suratURL)
          .then(res => res.json())
          .then(res => {
            console.log(res)
            const ayats = res.data.ayat.map(ayat => createAyatElement(ayat, ayat.audio['02']));
            audioFull.innerHTML = `<source src="${res.data.audioFull["05"]}"></source>`;
            document.querySelector('.surat').innerHTML = ayats.join('');
          });
            suratContainer.classList.add("hidden")
            ayatContainer.classList.remove("hidden")
          });
        }
        loadingIndicator.style.display = 'none';
      })
    
    // buat element ayat
    function createAyatElement(ayat, audio) {
      return `
        <div class="container my-6 shadow-lg rounded-2xl p-4">
          <p class="text-center">
            <audio src="${audio}" preload="none" ></audio>
            <button class="text-4xl mb-5 text-center" onclick="toggleAudio(this)"><span class="block">${ayat.teksArab}</span><p class="mt-96 text-sm">🔊</p></button>
          </p>
          <p class="border-b border-b-2 border-b-black pb-2 italic text-sm">${ayat.teksLatin}</p>
          <p class="mt-2 text-sm">${ayat.teksIndonesia}</p>
        </div>`;
    }
    
    qari.addEventListener("change", () => {
      fetch(suratURL)
        .then(res => res.json()).then(res => {
          const ayats = res.data.ayat.map(ayat => createAyatElement(ayat, ayat.audio[qari.value]));
            document.querySelector('.surat').innerHTML = ayats;
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
    
 /*
history.pushState(null, null, location.href);
window.addEventListener('popstate', event => {
  if (suratContainer.classList.contains("hidden")) {
    ayatContainer.classList.add("hidden");
    suratContainer.classList.remove("hidden");
  } else {
    window.history.go(-1);
    console.log(window.history)
  }
})

window.addEventListener('popstate', event => {
  history.pushState(null, null, location.href);
});


*/