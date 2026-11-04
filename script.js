
// ===================================
// 1. OPEN INVITATION
// ===================================

const openInvite = document.getElementById("openInvite");
const invitation = document.getElementById("invitation");

openInvite.addEventListener("click", () => {
  invitation.hidden = false;

  document.getElementById("cover").style.display = "none";

  document.getElementById("welcome").scrollIntoView({
    behavior: "smooth"
  });
});


// ===================================
// 2. MUSIC PLAYER - SOFT BY LANY
// ===================================

const musicFab = document.getElementById("musicFab");
const birthdayAudio = document.getElementById("birthdayAudio");

musicFab.addEventListener("click", async () => {
  if (birthdayAudio.paused) {
    try {
      await birthdayAudio.play();

      musicFab.textContent = "♫";
      musicFab.classList.add("playing");
      musicFab.setAttribute("aria-label", "Pause music");

    } catch (error) {
      alert("Musik belum bisa diputar. Silakan coba lagi.");
    }

  } else {
    birthdayAudio.pause();

    musicFab.textContent = "♫";
    musicFab.classList.remove("playing");
    musicFab.setAttribute("aria-label", "Play music");
  }
});

birthdayAudio.addEventListener("ended", () => {
  musicFab.classList.remove("playing");
  musicFab.setAttribute("aria-label", "Play music");
});


// ===================================
// 3. BLOW THE CANDLES
// ===================================

function blowCandles() {
  const flames = document.getElementById("flames");
  const feedback = document.getElementById("cakeFeedback");

  if (flames.classList.contains("off")) return;

  flames.classList.add("off");

  feedback.textContent =
    "Yeay! Happy Birthday, Mysha! Make a wish! ✨";

  document.getElementById("blowButton").textContent =
    "♡ Lilin sudah ditiup!";
}

document.getElementById("blowButton")
  .addEventListener("click", blowCandles);


// ===================================
// 4. MICROPHONE BLOW
// ===================================

document.getElementById("micButton")
  .addEventListener("click", async () => {

  const feedback = document.getElementById("cakeFeedback");

  try {
    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    const context = new AudioContextClass();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();

    analyser.fftSize = 256;
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);

    feedback.textContent = "Tiup sekarang ke mikrofon! 🎤";

    let hits = 0;
    let elapsed = 0;

    const timer = setInterval(() => {

      analyser.getByteFrequencyData(data);

      const volume =
        data.reduce((a, b) => a + b, 0) / data.length;

      if (volume > 30) {
        hits++;
      } else {
        hits = 0;
      }

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

        feedback.textContent =
          "Belum terdeteksi. Coba lagi atau tekan Tiup Lilin!";
      }

    }, 150);

  } catch (error) {

    feedback.textContent =
      "Aktifkan izin mikrofon atau gunakan tombol Tiup Lilin!";

  }
});


// ===================================
// 5. RUNNING DECLINE BUTTON
// ===================================

const declineButton =
  document.getElementById("declineButton");

function moveDeclineButton() {

  const maxX = 180;
  const maxY = 100;

  const x = Math.random() * maxX - maxX / 2;
  const y = Math.random() * maxY - maxY / 2;

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


// ===================================
// 6. RSVP VIA WHATSAPP
// ===================================

document.getElementById("rsvpForm")
  .addEventListener("submit", (event) => {

  event.preventDefault();

  const name =
    document.getElementById("guestName").value.trim();

  const count =
    document.getElementById("guestCount").value;

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
