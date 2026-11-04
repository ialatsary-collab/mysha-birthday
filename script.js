
// =============================================
// MYSHA'S BIRTHDAY SCRAPBOOK
// =============================================

document.addEventListener("DOMContentLoaded", () => {

  // =============================================
  // 1. MUSIC PLAYER SETUP
  // =============================================

  const musicButton = document.getElementById("musicFab");
  const audio = document.getElementById("birthdayAudio");

  if (audio) {
    audio.src = "assets/soft-lany.mp3";
    audio.loop = true;
    audio.volume = 0.8;
    audio.preload = "auto";
  }

  // Function to play music
  async function playBirthdayMusic() {
    if (!audio) return;

    try {
      await audio.play();

      if (musicButton) {
        musicButton.classList.add("playing");
        musicButton.setAttribute("aria-label", "Pause music");
      }

    } catch (error) {
      console.error("Music playback failed:", error);

      alert(
        "Musik belum bisa diputar. Silakan tekan tombol musik ♫."
      );
    }
  }

  // Function to pause music
  function pauseBirthdayMusic() {
    if (!audio) return;

    audio.pause();

    if (musicButton) {
      musicButton.classList.remove("playing");
      musicButton.setAttribute("aria-label", "Play music");
    }
  }


  // =============================================
  // 2. OPEN INVITATION + AUTO PLAY MUSIC
  // =============================================

  const openInvite = document.getElementById("openInvite");
  const invitation = document.getElementById("invitation");
  const cover = document.getElementById("cover");

  if (openInvite && invitation && cover) {

    openInvite.addEventListener("click", async () => {

      invitation.hidden = false;
      cover.style.display = "none";

      // Play music when invitation is opened
      await playBirthdayMusic();

      document.getElementById("welcome")?.scrollIntoView({
        behavior: "smooth"
      });

    });

  }


  // =============================================
  // 3. MUSIC BUTTON PLAY / PAUSE
  // =============================================

  if (musicButton && audio) {

    musicButton.addEventListener("click", async () => {

      if (audio.paused) {
        await playBirthdayMusic();
      } else {
        pauseBirthdayMusic();
      }

    });

    audio.addEventListener("play", () => {
      musicButton.classList.add("playing");
    });

    audio.addEventListener("pause", () => {
      musicButton.classList.remove("playing");
    });

  }


  // =============================================
  // 4. BLOW THE CANDLES
  // =============================================

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


  // =============================================
  // 5. BLOW CANDLES USING MICROPHONE
  // =============================================

  const micButton = document.getElementById("micButton");

  if (micButton) {

    micButton.addEventListener("click", async () => {

      let stream;
      let context;
      let timer;

      try {

        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Microphone unavailable");
        }

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

        function cleanup() {
          if (timer) clearInterval(timer);

          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }

          if (context && context.state !== "closed") {
            context.close();
          }
        }

        timer = setInterval(() => {

          analyser.getByteFrequencyData(data);

          const volume =
            data.reduce((a, b) => a + b, 0) / data.length;

          hits = volume > 30 ? hits + 1 : 0;
          elapsed++;

          if (hits >= 3) {

            cleanup();
            blowCandles();

          } else if (elapsed >= 80) {

            cleanup();

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

        if (context && context.state !== "closed") {
          context.close();
        }

        if (cakeFeedback) {
          cakeFeedback.textContent =
            "Izinkan akses mikrofon atau gunakan tombol Tiup Lilin!";
        }

      }

    });

  }


  // =============================================
  // 6. RUNNING DECLINE BUTTON
  // =============================================

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


  // =============================================
  // 7. RSVP VIA WHATSAPP
  // =============================================

  const rsvpForm = document.getElementById("rsvpForm");

  if (rsvpForm) {

    rsvpForm.addEventListener("submit", (event) => {

      event.preventDefault();

      const whatsappNumber = "6285231677007";
      const message = "hai ganteng gue dateng ya";

      const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappURL, "_blank");

    });

  }

});
