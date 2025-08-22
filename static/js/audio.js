// static/js/audio.js
const Audio = (() => {
  const bgm = document.getElementById("bgm");
  const sfx = {
    deal: document.getElementById("sfx-deal"),
    win:  document.getElementById("sfx-win"),
    lose: document.getElementById("sfx-lose"),
  };

  // Durum makinesi
  let enabled = false;          // kullanıcı ses açık mı istiyor?
  let playing = false;          // gerçekten çalıyor mu?
  let playPromise = null;       // bekleyen play() sözü
  let toggling = false;         // debounce

  function ensureReady() {
    // kaynak ve loop ayarları tek yerden
    if (!bgm) return;
    bgm.loop = true;
    if (bgm.volume == null) bgm.volume = 0.35;
  }

  async function startBGM() {
    ensureReady();
    if (!bgm) return;
    // Zaten çalıyorsa tekrar deneme
    if (playing) return;

    try {
      // Aynı anda birden çok play başlatma
      if (!playPromise) {
        // Preload edilmişse immediate, değilse tarayıcı yüklerken promise döner
        playPromise = bgm.play();
      }

      if (playPromise && typeof playPromise.then === "function") {
        await playPromise; // Çalma başlayana kadar bekle
      }
      playing = true;
      playPromise = null;
      UI?.toast?.("Müzik açık");
    } catch (err) {
      // Autoplay veya başka kısıtlama durumunda yakala
      playing = false;
      playPromise = null;
      enabled = false;
      UI?.toast?.("Müzik başlatılamadı: " + (err?.message || err));
      console.error("BGM play error:", err);
    }
  }

  function stopBGM() {
    if (!bgm) return;

    // play() hâlâ pending ise, bitince pause et
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => bgm.pause())
        .catch(() => {/* zaten hata yakalandı */})
        .finally(() => {
          playing = false;
          playPromise = null;
        });
    } else {
      bgm.pause();
      playing = false;
    }
  }

  // Public API
  async function enable() {
    if (enabled) return;
    enabled = true;
    bgm?.load?.();       // kaynağı tazele (güvenli)
    await startBGM();    // bekle ki pause çakışması olmasın
  }

  function disable() {
    if (!enabled) return;
    enabled = false;
    stopBGM();           // play pending ise ardından pause eder
  }

  // Tek tıklamada bir kez toggle (debounce)
  let lastToggle = 0;
  async function toggle() {
    const now = Date.now();
    if (toggling || now - lastToggle < 250) return;
    toggling = true; lastToggle = now;

    try {
      if (enabled) disable();
      else await enable();
    } finally {
      setTimeout(() => { toggling = false; }, 150);
    }
  }

  // Kısa efektler: BGM’den bağımsız, ama play() failure spam olmasın diye try/catch
  function play(name) {
    if (!enabled) return; // kullanıcı kapalı istiyorsa efekt de çalma
    const el = sfx[name];
    if (!el) return;
    try {
      el.currentTime = 0;
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch {}
  }

  // Sayfa görünürlüğü değişirse (bazı tarayıcılar otomatik kısar/pauseler)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      // hiçbir şey yapmıyoruz; tarayıcı pauleyebilir, geri gelince kullanıcı isterse tekrar toggle eder
    } else {
      // geri gelince durum konsistent kalsın
      if (enabled && !playing && !playPromise) {
        startBGM();
      }
    }
  });

  return { toggle, enable, disable, play };
})();
window.Audio = Audio;
// Örnek: Audio.enable(); Audio.disable(); Audio.toggle(); Audio.play("deal"); Audio.play("win");
