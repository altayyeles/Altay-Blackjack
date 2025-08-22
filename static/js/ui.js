const UI = (()=>{
  const $ = sel => document.querySelector(sel);
  const dealerEl = $("#dealer-cards");
  const playerEl = $("#player-cards");

  function clearHands(){ dealerEl.innerHTML=""; playerEl.innerHTML=""; $("#status").textContent=""; updateBet(0); }
  function cardEl(card, opts={}){ const el=document.createElement("div"); el.className="card"; el.style.setProperty("--img", `url('${card.img}')`); if(opts.faceDown) el.classList.add("back"); return el; }
  function animateDeal(who, card, opts={}){ return new Promise(res=>{ const area = who==="dealer"?dealerEl:playerEl; const el = cardEl(card, opts); el.classList.add("deal-in"); area.appendChild(el); setTimeout(()=>{ el.classList.remove("deal-in"); res(); }, 220); }); }
  function revealDealerHole(){ const back = dealerEl.querySelector(".card.back"); if(back) back.classList.remove("back"); }
  function updateTotals(p,d){ $("#player-total").textContent=p; $("#dealer-total").textContent=d; }
  function updateBalance(b){ $("#balance").textContent = `₺${b}`; }
  function updateBet(b){ /* göstermek istersen burayı doldur */ }
  function setStatus(t){ $("#status").textContent=t; }
  function toast(msg){ if(!msg) return; setStatus((( $("#status").textContent||"" ) + " • " + msg).trim()); }
  function setAdvice(t){ $("#advice").textContent = `🧠 Strateji: ${t}`; }
  function lockActions(lock=true){ ["#btn-hit","#btn-stand","#btn-double","#btn-split","#btn-surrender"].forEach(id=>{ $(id).disabled = lock; }); }
  function enableButtons(o){ Object.entries(o).forEach(([k,v])=>{ $(`#btn-${k}`).disabled = !v; }); }
  function consumeBet(){ const custom = parseInt($("#custom-bet").value||"0",10); const now = isNaN(custom)?0:custom; if(now>0 && Game.state.balance>=now){ Game.state.balance -= now; updateBalance(Game.state.balance); updateBet(now); return now; } setStatus("Geçerli bir bahis gir or seç."); return 0; }
  function getSideBetAmount(){ return parseInt($("#sb-amt").value||"0",10) || 0; }

  document.addEventListener("DOMContentLoaded", ()=>{
    document.querySelectorAll(".chip").forEach(btn=>{ btn.addEventListener("click", ()=>{ $("#custom-bet").value = btn.dataset.amt; }); });
    $("#btn-bet").addEventListener("click", ()=>{});
    $("#btn-deal").addEventListener("click", ()=>{ Game.state.sideBet = { pp: $("#sb-pp").checked, t213: $("#sb-213").checked, amt: getSideBetAmount() }; Game.deal(); });
    $("#btn-hit").addEventListener("click", Game.hit);
    $("#btn-stand").addEventListener("click", Game.stand);
    $("#btn-double").addEventListener("click", Game.doubleDown);
    $("#btn-surrender").addEventListener("click", Game.surrender);
    $("#btn-settings").addEventListener("click", ()=> $("#dlg-settings").showModal());
    $("#save-settings").addEventListener("click", ()=>{
      Game.state.rules.h17 = $("#rule-h17").checked;
      Game.state.rules.decks = parseInt($("#rule-decks").value,10) || 6;
      Game.state.rules.bjPayout = parseFloat($("#rule-bjpayout").value) || 1.5;
      Game.state.rules.surrender = $("#rule-surrender").checked;
      Game.state.rules.das = $("#rule-das").checked;
      Game.state.payouts.perfectPairs = ($("#pp-payouts").value || "5,10,25").split(",").map(x=>parseInt(x,10));
      Game.state.payouts.t213 = ($("#t213-payouts").value || "5,10,30,40,100").split(",").map(x=>parseInt(x,10));
    });
    $("#btn-theme").addEventListener("click", ()=>{ const root=document.documentElement; const cur=root.getAttribute("data-theme")||"light"; root.setAttribute("data-theme", cur==="dark"?"light":"dark"); });
    $("#btn-audio").addEventListener("click", ()=>{ Audio.toggle(); });
  });

  function afterRound(){ }
  return { clearHands, animateDeal, revealDealerHole, updateTotals, updateBalance, updateBet, setStatus, toast, setAdvice, lockActions, enableButtons, consumeBet, getSideBetAmount, afterRound };
})();
window.UI = UI;
