const EMPTY = 0;
const DARK = 1;
const LIGHT = 2;

const WINNER_DRAW = 0;
const WINNER_DARK = 1;
const WINNER_LIGHT = 2;

const boardElement = document.getElementById("board");
const nextDiscMessageElement = document.getElementById("next-disc-message");
const warningMessageElement = document.getElementById("warning-message");

async function showBoard(gameId, myDisc, turnCount, previousDisc = null) {
  const response = await fetch(`/api/games/${gameId}/turns/${turnCount}`);
  const responseBody = await response.json();
  const board = responseBody.board;
  const nextDisc = responseBody.nextDisc;
  const winnerDisc = responseBody.winnerDisc;

  showWarningMessage(previousDisc, nextDisc, winnerDisc);

  showNextDiscMessage(nextDisc);

  // 盤面初期化 (子要素を全て削除)
  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.firstChild);
  }

  // 盤面描画
  board.forEach((line, y) => {
    line.forEach((square, x) => {
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
          const registerTurnResponse = await registerTurn(
            nextTurnCount,
            nextDisc,
            x,
            y
          );
          if (registerTurnResponse.ok) {
            await showBoard(gameId, nextTurnCount, nextDisc);
          }
        });
      }

      boardElement.appendChild(squareElement);
    });
  });
}

function discToString(disc) {
  return disc === DARK ? "黒" : "白";
}

function showWarningMessage(previousDisc, nextDisc, winnerDisc) {
  const message = warningMessage(previousDisc, nextDisc, winnerDisc);

  warningMessageElement.innerText = message;

  if (message === null) {
    warningMessageElement.style.display = "none";
  } else {
    warningMessageElement.style.display = "block";
  }
}

function warningMessage(previousDisc, nextDisc, winnerDisc) {
  if (nextDisc !== null) {
    if (previousDisc === nextDisc) {
      const skipped = nextDisc === DARK ? LIGHT : DARK;
      return `${discToString(skipped)}の番はスキップです`;
    } else {
      return null;
    }
  } else {
    if (winnerDisc === WINNER_DRAW) {
      return "引き分けです";
    } else {
      return `${discToString(winnerDisc)}の勝ちです`;
    }
  }
}

function showNextDiscMessage(nextDisc) {
  if (nextDisc) {
    nextDiscMessageElement.innerText = `次は${discToString(nextDisc)}の番です`;
  } else {
    nextDiscMessageElement.innerText = "";
  }
}

async function registerGame() {
  const result = await fetch("/api/games", {
    method: "POST",
  }).then((response) => response.json());

  return result.gameId;
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

  return await fetch("/api/games/latest/turns", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
}

async function findLatestRoom() {
  const result = await fetch("/api/rooms", {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  return {
    roomId: result.roomId,
    lightPlayer: result.lightPlayer,
    darkPlayer: result.darkPlayer,
  };
}

async function createNewRoom() {
  const result = await fetch("/api/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  return result.roomId;
}

async function joinNewRoom(roomId) {
  const result = await fetch(`/api/rooms/${roomId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  return {
    roomId: result.roomId,
    roomName: result.roomName,
    yourDisc: result.yourDisc,
    isReady: result.isReady,
  };
}

async function main() {
  const room = await findLatestRoom();
  let roomId = null;

  // 白か黒かどちらか参加していればそのルームに入る どちらかがいる部屋に入る
  // FIXME: 汚い、リアルタイム通信をしたいだけなので 一旦これでok
  if (!!room.darkPlayer || !!room.lightPlayer) {
    roomId = room.roomId;
  } else {
    roomId = await createNewRoom();
  }

  const roomInfo = await joinNewRoom(roomId);

  if (roomInfo.isReady) {
    const gameId = await registerGame();
    await showBoard(gameId, roomInfo.yourDisc, 0);
  }
}

main();
