const EMPTY = 0
const DARK = 1
const LIGHT = 2

const INITIAL_BOARD = [
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, DARK, LIGHT, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, LIGHT, DARK, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
]

const boardElement = document.getElementById('board')

async function showBoard() {
  // 盤面初期化 (子要素を全て削除)
  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.firstChild)
  }

  // 盤面描画
  INITIAL_BOARD.forEach((line) => {
    line.forEach((square) => {
      // <div class="square">
      const squareElement = document.createElement('div')
      squareElement.className = 'square'

      if (square !== EMPTY) {
        // <div class="stone dark">
        const stoneElement = document.createElement('div')
        const color = square === DARK ? 'dark' : 'light'
        stoneElement.className = `stone ${color}`

        squareElement.appendChild(stoneElement)
      }

      boardElement.appendChild(squareElement)
    })
  })
}

async function main() {
  await showBoard()
}

main()
