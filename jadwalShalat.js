    let setDate = document.querySelector("input[type='date']"),
        inpKota = document.querySelector(".kota"),
        timeCont = document.querySelector(".time"),
        dateCont = document.querySelector(".date"),
        greeting = document.querySelector(".greeting"),
        jadwal = document.querySelector(".jadwal-shalat"),
        jadwalCont = document.querySelector(".jadwal-cont"),
        jadwalInfo = document.querySelector(".jadwal-info"),
        bgCbox = document.querySelector("#bg"),
        select = document.querySelector(".slct-bg"),
        date = new Date();
        
    select.addEventListener("click", e => {
      const selectedBg = e.target.dataset.bg,
            selectedHex = e.target.dataset.hex;
      if(selectedBg != undefined) {
        if(bgCbox.checked) {
        document.body.style.backgroundImage = `url(./img/${selectedBg}.png)`;
        } else {
          document.body.style.backgroundImage = `none`;
          document.body.style.backgroundColor = selectedHex;
        }
      }
    });
    
    fetch("https://api.myquran.com/v1/sholat/kota/semua")
      .then(res => res.json())
      .then(res => {
        const sortedKota = res.sort((a, b) => a.lokasi.localeCompare(b.lokasi));
    
        let kotaItems = "";
        sortedKota.forEach(kota => {
          kotaItems += `<option value="${kota.id}">${kota.lokasi.replace('KAB. ', '')}</option>`;
        });
        inpKota.innerHTML += kotaItems;
      });
      
      
    inpKota.addEventListener("change", () => {
      let slctOpt = inpKota.options[inpKota.selectedIndex],
          locationID = slctOpt.value,
          location = slctOpt.textContent;
          defaultDate = new Date().toLocaleDateString('zh-Hans-CH'),
          slctDate = document.querySelector(".slct-date").value.split("-").join("/");
          url = `https://api.myquran.com/v1/sholat/jadwal/${locationID}/${slctDate == "" ? defaultDate : slctDate}`
        console.log(url)
      fetch(url).then(res => res.json()).then(res => {
        jadwalCont.classList.remove("hidden");
        console.log(slctDate)
        const jadwalShalat = res.data.jadwal;
        jadwalInfo.innerHTML = `
        <p class="text-center">Jadwal Shalat ${location} hari <br>${jadwalShalat.tanggal}</p>`;
        jadwalCont.innerHTML = `
          <div class="jadwal">
            <p>Subuh</p>
            <p>${jadwalShalat.subuh}</p>
          </div>
          <div class="jadwal">
            <p>Terbit</p>
            <p>${jadwalShalat.terbit}</p>
          </div>
          <div class="jadwal">
            <p>Dzuhur</p>
            <p>${jadwalShalat.dzuhur}</p>
          </div>
          <div class="jadwal">
            <p>Ashar</p>
            <p>${jadwalShalat.ashar}</p>
          </div>
          <div class="jadwal">
            <p>Maghrib</p>
            <p>${jadwalShalat.maghrib}</p>
          </div>
          <div class="jadwal">
            <p>Isya</p>
            <p>${jadwalShalat.isya}</p>
          </div>
        `;
        console.log(slctDate)
      })
      console.log("ID:", locationID);
      console.log("Text:", location);
      console.log("Date:", date);
});

    
    const hour = date.getHours();
    greeting.innerHTML =
      hour >= 5 && hour < 12 ? 'Pagi ☀️' :
      hour >= 12 && hour < 15 ? 'Siang 🌞' :
      hour >= 15 && hour < 18 ? 'Sore 🌅' : 'Malam 🌙';
    
    const formattedDate = date.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    dateCont.innerHTML = formattedDate;
      
    setInterval(() => {
      let date = new Date();
      const formattedTime = date.toLocaleTimeString('en-US', {hour12:false});
      timeCont.innerHTML = formattedTime;
    }, 1000);



