
document.addEventListener("DOMContentLoaded", () => {

  // =====================================
  // 1. OPEN INVITATION
  // =====================================

  const openInvite = document.getElementById("openInvite");
  const invitation = document.getElementById("invitation");
  const cover = document.getElementById("cover");

  if (openInvite && invitation && cover) {
    openInvite.addEventListener("click", () => {
      invitation.hidden = false;
      cover.style.display = "none";

      document.getElementById("welcome")?.scrollIntoView({
        behavior: "smooth"
      });
    });
  }


  // =====================================
  // 2. MUSIC PLAYER - LANY
  // =====================================

  const musicButton = document.getElementById("musicFab");

  let audio = document.getElementById("birthdayAudio");

  // Create audio element if it does not exist
  if (!audio) {
    audio = document.createElement("audio");
    audio.id = "birthdayAudio";
    document.body.appendChild(audio);
  }

  // Set MP3 location
  audio.src = new URL(
    "assets/soft-lany.mp3",
    document.baseURI
  ).href;

  audio.type = "audio/mpeg";
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0.8;

  audio.load();

  if (musicButton) {

    musicButton.textContent = "♫";
    musicButton.setAttribute("aria-label", "Play music");

    musicButton.addEventListener("click", async () => {

      if (audio.paused) {

        try {
          await audio.play();

          musicButton.classList.add("playing");
          musicButton.setAttribute("aria-label", "Pause music");

        } catch (error) {

          console.error("Music playback error:", error);

          alert(
            "Musik belum bisa diputar. Pastikan file soft-lany.mp3 sudah ter-upload dengan benar."
          );

        }

      } else {

        audio.pause();

        musicButton.classList.remove("playing");
        musicButton.setAttribute("aria-label", "Play music");

      }

    });

    audio.addEventListener("play", () => {
      musicButton.classList.add("playing");
    });

    audio.addEventListener("pause", () => {
      musicButton.classList.remove("playing");
    });

  }


  // =====================================
  // 3. BLOW THE CANDLES
  // =====================================

  const blowButton = document.getElementById("blowButton");
  const flames = document.getElementById("flames");
  const cakeFeedback = document.getElementById("cakeFeedback");

  function blowCandles() {

    if (flames) {
      flames.classList.add("off");
    }

    if (cakeFeedback) {
      cakeFeedback.textContent =
        "Yeay! Happy Birthday, Mysha! Make a wish! ♡";
    }

    if (blowButton) {
      blowButton.textContent = "♡ Lilin sudah ditiup!";
    }

  }

  if (blowButton) {
    blowButton.addEventListener("click", blowCandles);
  }


  // =====================================
  // 4. MICROPHONE BLOW
  // =====================================

  const micButton = document.getElementById("micButton");

  if (micButton) {

    micButton.addEventListener("click", async () => {

      if (!navigator.mediaDevices?.getUserMedia) {
        if (cakeFeedback) {
          cakeFeedback.textContent =
            "Mikrofon tidak tersedia. Gunakan tombol Tiup Lilin!";
        }
        return;
      }

      let stream;
      let context;
      let timer;

      try {

        stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });

        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;

        context = new AudioContextClass();

        const source = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser();

        analyser.fftSize = 256;
        source.connect(analyser);

        const data = new Uint8Array(
          analyser.frequencyBinCount
        );

        if (cakeFeedback) {
          cakeFeedback.textContent =
            "Tiup sekarang ke mikrofon! 🎤";
        }

        let hits = 0;
        let elapsed = 0;

        timer = setInterval(() => {

          analyser.getByteFrequencyData(data);

          const volume =
            data.reduce((a, b) => a + b, 0) / data.length;

          hits = volume > 30 ? hits + 1 : 0;
          elapsed++;

          if (hits >= 3) {

            clearInterval(timer);
            stream.getTracks().forEach(track => track.stop());
            context.close();

            blowCandles();

          }

          if (elapsed >= 80) {

            clearInterval(timer);
            stream.getTracks().forEach(track => track.stop());
            context.close();

            if (cakeFeedback) {
              cakeFeedback.textContent =
                "Belum terdeteksi. Coba lagi atau tekan Tiup Lilin!";
            }

          }

        }, 150);

      } catch (error) {

        if (timer) clearInterval(timer);

        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        if (context) context.close();

        if (cakeFeedback) {
          cakeFeedback.textContent =
            "Izinkan akses mikrofon atau gunakan tombol Tiup Lilin!";
        }

      }

    });

  }


  // =====================================
  // 5. RUNNING DECLINE BUTTON
  // =====================================

  const declineButton =
    document.getElementById("declineButton");

  if (declineButton) {

    function moveDeclineButton() {

      const x = Math.random() * 180 - 90;
      const y = Math.random() * 100 - 50;

      declineButton.style.transform =
        `translate(${x}px, ${y}px)`;

    }

    declineButton.addEventListener(
      "mouseenter",
      moveDeclineButton
    );

    declineButton.addEventListener(
      "touchstart",
      (event) => {
        event.preventDefault();
        moveDeclineButton();
      },
      { passive: false }
    );

    declineButton.addEventListener("click", (event) => {
      event.preventDefault();
      moveDeclineButton();
    });

  }


  // =====================================
  // 6. RSVP VIA WHATSAPP
  // =====================================

  const rsvpForm = document.getElementById("rsvpForm");

  if (rsvpForm) {

    rsvpForm.addEventListener("submit", (event) => {

      event.preventDefault();

      const name =
        document.getElementById("guestName")?.value.trim();

      const count =
        document.getElementById("guestCount")?.value;

      const whatsappNumber = "6285231677007";

      if (!name) {
        alert("Masukkan nama terlebih dahulu!");
        return;
      }

      const message =
        `Halo! Aku ${name}, konfirmasi hadir di ulang tahun Mysha tanggal 7 November 2026. Jumlah: ${count} orang.`;

      const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappURL, "_blank");

    });

  }

});
