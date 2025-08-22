let balance = 1000;
let history = [];
function hit() {
    // Simulate card draw
    alert('Hit!');
}
function stand() {
    alert('Stand!');
}
function resetGame() {
    alert('New Game Started');
}
function bet(amount) {
    if (balance >= amount) {
        balance -= amount;
        document.getElementById('balance').innerText = `Balance: ₺${balance}`;
        history.push(`Bet ₺${amount}`);
        updateHistory();
    }
}
function updateHistory() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '<h3>Game History</h3>' + history.slice(-5).map(h => `<div>${h}</div>`).join('');
}