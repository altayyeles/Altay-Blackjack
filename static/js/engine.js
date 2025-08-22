const API_BASE = "https://www.deckofcardsapi.com/api/deck";

let state = {
  deckId: null,
  shoe: [],
  rules: { h17: true, decks: 6, bjPayout: 1.5, surrender: false, das: true },
  payouts: { perfectPairs: [5,10,25], t213: [5,10,30,40,100] },
  balance: 1000,
  bet: 0,
  sideBet: { pp:false, t213:false, amt:0 },
  hands: { player: [], dealer: [] },
  history: [],
  useApi: true,
};

const Storage = {
  load(){ const s = localStorage.getItem("abj_state"); if(s){ try{ const o=JSON.parse(s); state.balance = o.balance??state.balance; }catch{}} },
  save(){ localStorage.setItem("abj_state", JSON.stringify({ balance: state.balance })); },
  pushHistory(e){ const arr = JSON.parse(localStorage.getItem("abj_history")||"[]"); arr.unshift(e); localStorage.setItem("abj_history", JSON.stringify(arr.slice(0,500))); },
  getHistory(){ return JSON.parse(localStorage.getItem("abj_history")||"[]"); }
};

async function newShoe(){
  try{
    if(navigator.onLine){
      const res = await fetch(`${API_BASE}/new/shuffle/?deck_count=${state.rules.decks}`, {cache:"no-store"});
      const data = await res.json();
      if(data.success){ state.deckId = data.deck_id; state.useApi = true; return; }
    }
    state.useApi = false; state.shoe = buildLocalShoe(state.rules.decks); shuffle(state.shoe);
  }catch(e){ state.useApi = false; state.shoe = buildLocalShoe(state.rules.decks); shuffle(state.shoe); }
}

async function draw(count=1){
  if(state.useApi && state.deckId){
    try{
      const res = await fetch(`${API_BASE}/${state.deckId}/draw/?count=${count}`, {cache:"no-store"});
      const data = await res.json();
      if(data.success){
        return data.cards.map(card=>({ code:card.code, value:card.value, suit:card.suit, img:card.image }));
      }
    }catch(e){ state.useApi = false; }
  }
  const out=[]; for(let i=0;i<count;i++){ if(!state.shoe.length){ state.shoe=buildLocalShoe(state.rules.decks); shuffle(state.shoe);} out.push(state.shoe.pop()); }
  return out;
}

function buildLocalShoe(decks=6){
  const suits=["S","H","D","C"]; const ranks=["A","2","3","4","5","6","7","8","9","0","J","Q","K"]; const shoe=[];
  for(let d=0; d<decks; d++) for(const s of suits) for(const r of ranks){
    shoe.push({ code:r+s, value:rankValue(r), suit:suitName(s), img:`https://deckofcardsapi.com/static/img/${r}${s}.png` });
  }
  return shoe;
}
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } }
function rankValue(r){ if(r==="A")return 11; if(["K","Q","J","0"].includes(r)) return 10; return parseInt(r,10); }
function suitName(s){ return {S:"SPADES",H:"HEARTS",D:"DIAMONDS",C:"CLUBS"}[s]; }

function handTotal(cards){ let total=cards.reduce((t,c)=>t+(c.value===11?11:c.value),0); let aces=cards.filter(c=>c.code[0]==="A").length; while(total>21 && aces>0){ total-=10; aces--; } return total; }
function isSoft(cards){ const sumHard = cards.reduce((t,c)=>t+(c.code[0]==="A"?1:(c.value===11?10:c.value)),0); const sum = handTotal(cards); return sum!==sumHard; }

async function deal(){
  UI.clearHands(); UI.lockActions(true);
  const bet = UI.consumeBet(); if(bet<=0) return UI.setStatus("Önce bahis koy.");
  state.bet = bet; state.sideBet.amt = UI.getSideBetAmount();
  if(!state.deckId && state.useApi) await newShoe();
  if(!state.deckId && !state.useApi && state.shoe.length<52) await newShoe();
  const p1 = await draw(1); UI.animateDeal("player", p1[0]);
  const d1 = await draw(1); UI.animateDeal("dealer", d1[0]);
  const p2 = await draw(1); UI.animateDeal("player", p2[0]);
  const d2 = await draw(1); UI.animateDeal("dealer", d2[0], {faceDown:true});
  state.hands.player=[p1[0],p2[0]]; state.hands.dealer=[d1[0],d2[0]]; Audio.play("deal");
  const sideWin = evaluateSideBets(); if(sideWin.amount!==0){ state.balance += sideWin.amount; UI.updateBalance(state.balance); UI.toast(sideWin.message); }
  const pt=handTotal(state.hands.player); const dt=handTotal([state.hands.dealer[0]]); UI.updateTotals(pt,dt);
  if(pt===21 || dt===21) return endRound(true);
  UI.lockActions(false); UI.enableButtons({hit:true, stand:true, double:true, split:canSplit(), surrender:state.rules.surrender});
  UI.setAdvice(basicStrategyAdvice(state,false));
}

function evaluateSideBets(){
  let net=0; const msgs=[]; const sbAmt=state.sideBet.amt||0; const [pMix,pCol,pPerf]=state.payouts.perfectPairs; const [pFlush,pStraight,pTrips,pSF,pSuitedTrips]=state.payouts.t213;
  if(state.sideBet.pp && sbAmt>0){ const [a,b]=state.hands.player; const mixed=(a.code[0]===b.code[0] && a.code[1]!==b.code[1]);
    const colored=(a.code[0]===b.code[0] && ((["H","D"].includes(a.code[1]) && ["H","D"].includes(b.code[1])) || (["S","C"].includes(a.code[1]) && ["S","C"].includes(b.code[1]))) && a.code[1]!==b.code[1]);
    const perfect=(a.code===b.code);
    if(perfect){ net += sbAmt*pPerf; msgs.push(`Perfect Pair! x${pPerf}`);} else if(colored){ net += sbAmt*pCol; msgs.push(`Colored Pair x${pCol}`);} else if(mixed){ net += sbAmt*pMix; msgs.push(`Mixed Pair x${pMix}`);} else { net -= sbAmt; }
  }
  if(state.sideBet.t213 && sbAmt>0){ const [p1,p2]=state.hands.player; const up=state.hands.dealer[0]; const pay=evaluate21plus3([p1,p2,up],[pFlush,pStraight,pTrips,pSF,pSuitedTrips]); if(pay>0){ net += sbAmt*pay; msgs.push(`21+3 kazanç x${pay}`);} else { net -= sbAmt; } }
  return { amount: net, message: msgs.join(" • ") };
}

function evaluate21plus3(cards,[pFlush,pStraight,pTrips,pSF,pSuitedTrips]){ const suits=cards.map(c=>c.code[1]); const ranks=cards.map(c=>c.code[0]).map(r=>r==="0"?"10":r);
  const rankOrder=["A","2","3","4","5","6","7","8","9","10","J","Q","K"]; const allSameSuit=suits.every(s=>s===suits[0]); const rankCounts=ranks.reduce((m,r)=>(m[r]=(m[r]||0)+1,m),{});
  const isTrips=Object.values(rankCounts).some(v=>v===3); const toIdx=r=>rankOrder.indexOf(r); const sorted=ranks.slice().sort((a,b)=>toIdx(a)-toIdx(b));
  const isStraight=(toIdx(sorted[2])-toIdx(sorted[0])===2) && new Set(sorted).size===3;
  if(isTrips && allSameSuit) return pSuitedTrips; if(allSameSuit && isStraight) return pSF; if(isTrips) return pTrips; if(isStraight) return pStraight; if(allSameSuit) return pFlush; return 0; }

async function hit(){ const c=(await draw(1))[0]; state.hands.player.push(c); UI.animateDeal("player", c); Audio.play("deal"); const t=handTotal(state.hands.player); UI.updateTotals(t, handTotal([state.hands.dealer[0]])); UI.setAdvice(basicStrategyAdvice(state,false)); if(t>21) return endRound(); }
function stand(){ dealerPlay(); }
async function doubleDown(){ if(state.balance<state.bet) return; state.balance -= state.bet; state.bet *= 2; UI.updateBalance(state.balance); UI.updateBet(state.bet); await hit(); if(handTotal(state.hands.player)<=21) dealerPlay(); }
function canSplit(){ const [a,b]=state.hands.player; return a && b && a.code[0]===b.code[0]; }
function surrender(){ state.balance += Math.floor(state.bet/2); endRound(true, { surrender:true }); }

async function dealerPlay(){ UI.revealDealerHole(); let total = handTotal(state.hands.dealer); while(total<17 || (total===17 && state.rules.h17 && isSoft(state.hands.dealer))){ const c=(await draw(1))[0]; state.hands.dealer.push(c); UI.animateDeal("dealer", c); total = handTotal(state.hands.dealer); } endRound(); }

function endRound(naturalCheck=false, extra={}){
  UI.lockActions(true);
  const pt=handTotal(state.hands.player); const dt=handTotal(state.hands.dealer);
  let outcome="push"; let delta=0;
  const playerBJ=(state.hands.player.length===2 && pt===21); const dealerBJ=(state.hands.dealer.length===2 && dt===21);
  if(extra.surrender){ outcome="surrender"; delta=0; }
  else if(playerBJ && !dealerBJ){ outcome="player-bj"; delta=Math.floor(state.bet*state.rules.bjPayout); }
  else if(dealerBJ && !playerBJ){ outcome="dealer-bj"; delta=-state.bet; }
  else if(pt>21){ outcome="player-bust"; delta=-state.bet; }
  else if(dt>21){ outcome="dealer-bust"; delta=state.bet; }
  else if(pt>dt){ outcome="player-win"; delta=state.bet; }
  else if(pt<dt){ outcome="dealer-win"; delta=-state.bet; }
  state.balance += delta; UI.updateBalance(state.balance); Storage.save(); if(delta>0) Audio.play("win"); else if(delta<0) Audio.play("lose");
  UI.setStatus(`Sonuç: ${outcome} (${pt} vs ${dt}) ${delta>=0?"+":"-"}₺${Math.abs(delta)}`);
  Storage.pushHistory({ t:new Date().toISOString(), bet:state.bet, side:state.sideBet, player:state.hands.player, dealer:state.hands.dealer, result:outcome, delta, balance:state.balance, rules:state.rules });
  UI.afterRound(); UI.setAdvice("—");
}

function basicStrategyAdvice(state){ const pt=handTotal(state.hands.player); const up=state.hands.dealer[0]; const upVal=up?rankValue(up.code[0]):10; if(pt<=11) return "Double (mümkünse), değilse Hit"; if(pt===12 && upVal>=4 && upVal<=6) return "Stand"; if(pt>=13 && pt<=16 && upVal<=6) return "Stand"; if(pt>=17) return "Stand"; return "Hit"; }

window.Game = { state, Storage, newShoe, deal, hit, stand, doubleDown, surrender };
document.addEventListener("DOMContentLoaded", () => { Storage.load(); UI.updateBalance(state.balance); });
