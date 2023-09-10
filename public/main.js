const EMPTY = 0;
const DARK = 1;
const LIGHT = 2;

const boardElement = document.getElementById("board");

async function showBoard() {
  const turnCount = 0;
  const response = await fetch(`/api/games/latest/turns/${turnCount}`);
  const responseBody = await response.json();
  const board = responseBody.board;
  const nextDisc = responseBody.nextDisc;

  // 盤面初期化 (子要素を全て削除)
  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.firstChild);
  }

  // 盤面描画
  board.forEach((line) => {
    line.forEach((square) => {
      // <div class="square">
      const squareElement = document.createElement("div");
      squareElement.className = "square";

      if (square !== EMPTY) {
        // <div class="stone dark">
        const stoneElement = document.createElement("div");
        const color = square === DARK ? "dark" : "light";
        stoneElement.className = `stone ${color}`;

        squareElement.appendChild(stoneElement);
      } else {
        // 置ける場所にはクリックイベントを設定
        squareElement.addEventListener("click", async () => {
          const nextTurnCount = turnCount + 1;
          await registerTurn(nextTurnCount, nextDisc, x, y);
        });
      }

      boardElement.appendChild(squareElement);
    });
  });
}

// ターン(盤面)の状態を登録
async function registerTurn(turnCount, disc, x, y) {
  const requestBody = {
    turnCount,
    move: {
      disc,
      x,
      y,
    },
  };

  await fetch("/api/games/latest/turns", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
}

async function registerGame() {
  const response = await fetch("/api/games", {
    method: "POST",
  });
  const game = await response.json();
  console.log(game);
}

async function main() {
  await showBoard();
  await registerGame();
}

main();
