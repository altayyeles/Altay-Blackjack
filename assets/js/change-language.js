const btnTurkish = document.getElementById("btn-turkish");
const btnEnglish = document.getElementById("btn-english");
const titleBetHome = document.getElementById("title-bet-home");
const textBtnClear = document.querySelector(".btn-clear-container span");
const textBtnPlay = document.querySelector(".btn-start-game-container span");
const textScore = document.querySelector(".player__score-counter span");
const btnHit = document.querySelector(".btn-hit-container span");
const btnStand = document.querySelector(".btn-stand-container span");
const btnDouble = document.querySelector(".btn-double-container span");
const settingsModalTitle = document.querySelector(".modal-title");
const SettingstextStatistics = document.querySelector(".statistics h5");
const modalBodyItems = document.querySelectorAll(".statistics p");
const btnRestartGame = document.getElementById("btn-restart-game");
const modalHelpTitles = document.querySelectorAll(".modal-help h5");
const modalHelpBody = document.querySelectorAll(".modal-help p");

const saveLanguage = (language) => {
  localStorage.setItem("language", language);
};

// set default language to Turkish; migrate old 'spanish' to 'english'
(() => {
  const stored = localStorage.getItem("language");
  if (!stored) {
    saveLanguage("turkish");
  } else if (stored === "spanish") {
    saveLanguage("english");
  }
})();

const restoreLanguage = () => {
  const lang = localStorage.getItem("language") || "turkish";
  if (lang === "turkish") {
    btnTurkish.classList.add("hidden");
    btnEnglish.classList.remove("hidden");
    titleBetHome.innerHTML = "Bahsini yap";
    textBtnClear.innerHTML = "Temizle";
    textBtnPlay.innerHTML = "Dağıt";
    textScore.innerHTML = "Puan";
    btnHit.innerHTML = "Kart Çek";
    btnStand.innerHTML = "Kal";
    btnDouble.innerHTML = "İkiye Katla";
    settingsModalTitle.innerHTML = "Ayarlar";
    SettingstextStatistics.innerHTML = "İstatistikler";
    modalBodyItems[0].innerHTML = "Oynanan oyunlar: ";
    modalBodyItems[1].innerHTML = "Kazanılan oyunlar: ";
    modalBodyItems[2].innerHTML = "Kaybedilen oyunlar: ";
    modalBodyItems[3].innerHTML = "Berabere kalan oyunlar: ";
    modalBodyItems[4].innerHTML = "Yeniden başlatılan oyunlar: ";
    modalBodyItems[5].innerHTML = "En yüksek skor: ";
    modalBodyItems[6].innerHTML = "Kazanılan para: $ ";
    modalBodyItems[7].innerHTML = "Kaybedilen para: $ ";
    modalBodyItems[8].innerHTML = "Ziyaretçi numaranız: ";
    btnRestartGame.innerHTML = "Oyunu Yeniden Başlat";
    modalHelpTitles[0].innerHTML = "Yardım";
    modalHelpTitles[1].innerHTML = "Nasıl oynanır";
    modalHelpBody[0].innerHTML =
      "Blackjack'ın amacı, 21'i geçmeden krupiyenin elini yenmektir.";
    modalHelpBody[1].innerHTML =
      "Yüz kartları 10 değerindedir. Aslar 1 veya 11 değerindedir, hangisi daha iyi bir el yapıyorsa.";
    modalHelpBody[2].innerHTML =
      "Her oyuncu iki kartla başlar, krupiyenin kartlarından biri sona kadar gizlidir.";
    modalHelpBody[3].innerHTML =
      "'Kart Çek' başka bir kart istemektir. 'Kal' toplamını koruyup sıranı bitirmektir.";
    modalHelpBody[4].innerHTML =
      "'İkiye Katla' bahsi iki katına çıkarır ve yalnızca bir kart daha alırsın.";
    modalHelpBody[5].innerHTML =
      "21'i geçersen elin biter ve krupiye kazanır.";
    modalHelpBody[6].innerHTML =
      "Fişlerin biterse ayarlardan 'Oyunu Yeniden Başlat' ile yeniden başlayabilirsin.";
  } else if (lang === "english") {
    btnEnglish.classList.add("hidden");
    btnTurkish.classList.remove("hidden");
    titleBetHome.innerHTML = "Place your bet";
    textBtnClear.innerHTML = "Clear";
    textBtnPlay.innerHTML = "Deal";
    textScore.innerHTML = "Score";
    btnHit.innerHTML = "Hit";
    btnStand.innerHTML = "Stand";
    btnDouble.innerHTML = "Double";
    settingsModalTitle.innerHTML = "Settings";
    SettingstextStatistics.innerHTML = "Statistics";
    modalBodyItems[0].innerHTML = "Games played: ";
    modalBodyItems[1].innerHTML = "Games won: ";
    modalBodyItems[2].innerHTML = "Games lost: ";
    modalBodyItems[3].innerHTML = "Games draw: ";
    modalBodyItems[4].innerHTML = "Games restarted: ";
    modalBodyItems[5].innerHTML = "Highest score: ";
    modalBodyItems[6].innerHTML = "Money won: $ ";
    modalBodyItems[7].innerHTML = "Money lost: $ ";
    modalBodyItems[8].innerHTML = "You are visitor number: ";
    btnRestartGame.innerHTML = "Restart Game";
    modalHelpTitles[0].innerHTML = "Help";
    modalHelpTitles[1].innerHTML = "How to play";
    modalHelpBody[0].innerHTML =
      "The goal of Blackjack is to beat the dealer's hand without going over 21.";
    modalHelpBody[1].innerHTML =
      "Face cards are worth 10. Aces are worth 1 or 11, whichever makes a better hand.";
    modalHelpBody[2].innerHTML =
      "Each player starts with two cards, one of the dealer's cards is hidden until the end.";
    modalHelpBody[3].innerHTML =
      "To 'Hit' is to ask for another card. To 'Stand' is to hold your total and end your turn.";
    modalHelpBody[4].innerHTML =
      "To 'Double Down' is to double your bet, and receive one and only one more card.";
    modalHelpBody[5].innerHTML =
      "If you go over 21 you bust, and the dealer wins regardless of the dealer's hand.";
    modalHelpBody[6].innerHTML =
      "If you run out of chips you can always restart the game with the 'Restart Game' button in the settings section.";
  }
};

const changeLanguage = (language) => {
  if (language === "turkish") {
    btnTurkish.classList.add("hidden");
    btnEnglish.classList.remove("hidden");
    saveLanguage(language);
  } else if (language === "english") {
    btnEnglish.classList.add("hidden");
    btnTurkish.classList.remove("hidden");
    saveLanguage(language);
  }
  restoreLanguage();
};

btnEnglish.addEventListener("click", () => {
  changeLanguage("english");
});

btnTurkish.addEventListener("click", () => {
  changeLanguage("turkish");
});

restoreLanguage();
