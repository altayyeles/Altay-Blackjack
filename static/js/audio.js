// static/js/audio.js
const Audio = (() => {
  const bgm = document.getElementById("bgm");
  const sfx = {
    deal: document.getElementById("sfx-deal"),
    win: document.getElementById("sfx-win"),
    lose: document.getElementById("sfx-lose")
  };
  let enabled = false;

  async function enable(){
    if (enabled) return;
    enabled = true;

    try {
      const vol = parseFloat(document.getElementById("audio-vol").value || "0.35");
      bgm.volume = vol;
      bgm.loop = true;
      bgm.load(); // önemli: kaynağı yeniden yükle

      // Hazır olunca çal
      await bgm.play();
      UI.toast("Müzik açık");
    } catch (err) {
      enabled = false;
      UI.toast("Müzik başlatılamadı: " + (err?.message || err));
      console.error("BGM play error:", err);
    }
  }

  function disable(){
    enabled = false;
    bgm.pause();
  }
  function toggle(){ enabled ? disable() : enable(); }
  function play(name){
    if (!enabled) return;
    const el = sfx[name];
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(err => console.warn(`${name} sfx error`, err));
  }

  return { toggle, play };
})();
window.Audio = Audio;
