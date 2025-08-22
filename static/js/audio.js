const Audio = ( ()=>{
  const bgm = document.getElementById("bgm");
  const sfx = { deal: document.getElementById("sfx-deal"), win: document.getElementById("sfx-win"), lose: document.getElementById("sfx-lose") };
  let enabled=false;
  function enable(){ if(enabled) return; enabled=true; const vol=parseFloat(document.getElementById("audio-vol").value||"0.35"); bgm.volume=vol; bgm.loop=true; bgm.play().catch(()=>{}); }
  function disable(){ enabled=false; bgm.pause(); }
  function toggle(){ enabled ? disable() : enable(); }
  function play(name){ if(!enabled) return; try { if(sfx[name]){ sfx[name].currentTime = 0; sfx[name].play().catch(()=>{}); } } catch(e){} }
  return { toggle, play };
})();
window.Audio = Audio;
