let balance = 0;

// Kullanıcıdan para yatırma işlemi
const deposit = () => {
  const depositAmount = parseFloat(document.getElementById("deposit").value);
  if (isNaN(depositAmount) || depositAmount <= 0) {
    alert("Invalid deposit amount, try again.");
  } else {
    balance += depositAmount;
    updateBalance();
    document.getElementById("deposit").value = '';
  }
};

// Kullanıcıdan hat başına bahis miktarını alma
const getBet = () => {
  const bet = parseFloat(document.getElementById("bet").value);
  const lines = parseInt(document.getElementById("lines").value);
  if (isNaN(bet) || bet <= 0 || bet > balance / lines) {
    alert("Invalid bet, try again.");
    return 0;
  } else {
    return bet;
  }
};

// Slot makaralarını döndürme işlemi
const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

// Makaraları satırlara dönüştürme işlemi
const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

// Kazançları hesaplama işlemi
const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;
    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }
  return winnings;
};

// Kullanıcı arayüzünü güncelle
const updateBalance = () => {
  document.getElementById("balance").innerText = "Balance: $" + balance;
};

// Oyunu başlatma işlemi
const startGame = () => {
  const lines = parseInt(document.getElementById("lines").value);
  const bet = getBet();
  if (bet === 0) return; // Geçersiz bahis

  balance -= bet * lines;
  const reels = spin();
  const rows = transpose(reels);
  
  // Makaraları yazdır
  displayReels(rows);
  
  const winnings = getWinnings(rows, bet, lines);
  balance += winnings;
  updateBalance();
  if (winnings > 0) {
    alert("You won: $" + winnings);
  }
};

// Makaraları ekrana yazdır
const displayReels = (rows) => {
  const reelsDiv = document.getElementById("reels");
  reelsDiv.innerHTML = ''; // Temizle
  for (const row of rows) {
    const reelDiv = document.createElement("div");
    reelDiv.className = "reel";
    reelDiv.innerText = row.join(" | ");
    reelsDiv.appendChild(reelDiv);
  }
};

// Olay dinleyicilerini ekle
document.getElementById("deposit-button").addEventListener("click", deposit);
document.getElementById("spin-button").addEventListener("click", startGame);
