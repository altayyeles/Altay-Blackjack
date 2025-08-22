
let deckId = "";
let playerHand = [];
let dealerHand = [];

async function initDeck() {
    const res = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
    const data = await res.json();
    deckId = data.deck_id;
}

async function drawCard(handId, handArray) {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const data = await res.json();
    const card = data.cards[0];
    handArray.push(card);
    const img = document.createElement("img");
    img.src = card.image;
    img.className = "card";
    document.getElementById(handId).appendChild(img);
}

function hit() {
    drawCard("player-hand", playerHand);
}

function stand() {
    drawCard("dealer-hand", dealerHand);
}

function bet(amount) {
    console.log("Bet placed:", amount);
    localStorage.setItem("lastBet", amount);
}

window.onload = () => {
    initDeck();
};
