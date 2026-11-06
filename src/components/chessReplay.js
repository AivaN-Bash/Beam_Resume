const WIDTH = 86;
const HEIGHT = 28;

const GAME = [
  ["e2e4", "e4"], ["e7e5", "e5"], ["g1f3", "Nf3"], ["d7d6", "d6"], ["d2d4", "d4"], ["c8g4", "Bg4"],
  ["d4e5", "dxe5"], ["g4f3", "Bxf3"], ["d1f3", "Qxf3"], ["d6e5", "dxe5"], ["f1c4", "Bc4"], ["g8f6", "Nf6"],
  ["f3b3", "Qb3"], ["d8e7", "Qe7"], ["b1c3", "Nc3"], ["c7c6", "c6"], ["c1g5", "Bg5"], ["b7b5", "b5"],
  ["c3b5", "Nxb5"], ["c6b5", "cxb5"], ["c4b5", "Bxb5+"], ["b8d7", "Nbd7"], ["e1c1 a1d1", "O-O-O"], ["a8d8", "Rd8"],
  ["d1d7", "Rxd7"], ["d8d7", "Rxd7"], ["h1d1", "Rd1"], ["e7e6", "Qe6"], ["b5d7", "Bxd7+"], ["f6d7", "Nxd7"],
  ["b3b8", "Qb8+"], ["d7b8", "Nxb8"], ["d1d8", "Rd8#"],
];

const STARTING_BOARD = ["rnbqkbnr", "pppppppp", "........", "........", "........", "........", "PPPPPPPP", "RNBQKBNR"];
const PIECES = {
  k: [" ^ ", "[K]", "==="], q: [" * ", "[Q]", "==="], r: ["[R]", "[=]", "==="],
  b: [" ' ", "[B]", "==="], n: [" > ", "[N]", "==="], p: [" . ", "[P]", "==="],
};
const MOVE_DURATION = 1.3;
const SLIDE_DURATION = 0.45;
const END_HOLD = 5;
const TOTAL_DURATION = GAME.length * MOVE_DURATION + END_HOLD;
const BOARD_X = 4;
const BOARD_Y = 2;
const SQUARE_WIDTH = 7;
const SQUARE_HEIGHT = 3;

class ChessGrid {
  constructor() {
    this.characters = new Array(WIDTH * HEIGHT);
    this.colors = new Array(WIDTH * HEIGHT);
    this.clear();
  }

  clear() {
    this.characters.fill(" ");
    this.colors.fill("0");
  }

  set(x, y, character, color = "0") {
    const column = Math.round(x);
    const row = Math.round(y);
    if (column < 0 || column >= WIDTH || row < 0 || row >= HEIGHT) return;
    const index = row * WIDTH + column;
    this.characters[index] = character;
    this.colors[index] = String(color);
  }

  text(x, y, value, color = "0") {
    [...String(value)].forEach((character, offset) => this.set(x + offset, y, character, color));
  }

  frame() {
    return this.characters.map((character, index) => [character, this.colors[index]]);
  }
}

function square(position) {
  return [position.charCodeAt(0) - 97, 8 - Number(position[1])];
}

function createBoardStates() {
  const states = [STARTING_BOARD.map((row) => row.split(""))];
  for (const [move] of GAME) {
    const board = states.at(-1).map((row) => row.slice());
    for (const step of move.split(" ")) {
      const [fromX, fromY] = square(step.slice(0, 2));
      const [toX, toY] = square(step.slice(2, 4));
      board[toY][toX] = board[fromY][fromX];
      board[fromY][fromX] = ".";
    }
    states.push(board);
  }
  return states;
}

function drawPiece(grid, x, y, piece) {
  const sprite = PIECES[piece.toLowerCase()];
  const color = piece === piece.toUpperCase() ? "0" : "2";
  sprite.forEach((line, row) => [...line].forEach((character, column) => {
    if (character !== " ") grid.set(x + column, y + row, character, color);
  }));
}

function drawBoard(grid, board, highlightedSquares, movingSquares, movingPieces, easing) {
  for (let row = 0; row < 8; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      const x = BOARD_X + column * SQUARE_WIDTH;
      const y = BOARD_Y + row * SQUARE_HEIGHT;
      const name = String.fromCharCode(97 + column) + (8 - row);
      const isLight = (column + row) % 2 === 0;
      const highlighted = highlightedSquares.has(name);
      const squareColor = highlighted ? (isLight ? "5" : "6") : isLight ? "7" : "8";
      grid.text(x, y, "+-----+", squareColor);
      grid.text(x, y + 1, `|${isLight ? " ... " : " ::: "}|`, squareColor);
      grid.text(x, y + 2, "+-----+", squareColor);

      const piece = board[row][column];
      if (piece !== "." && !movingSquares.has(name)) drawPiece(grid, x + 2, y, piece);
    }
  }

  if (movingPieces) {
    for (const { fromX, fromY, toX, toY, piece } of movingPieces) {
      drawPiece(
        grid,
        BOARD_X + Math.round((fromX + (toX - fromX) * easing) * SQUARE_WIDTH) + 2,
        BOARD_Y + Math.round((fromY + (toY - fromY) * easing) * SQUARE_HEIGHT),
        piece,
      );
    }
  }

  for (let index = 0; index < 8; index += 1) {
    grid.set(BOARD_X - 2, BOARD_Y + index * SQUARE_HEIGHT + 1, String(8 - index), "1");
    grid.set(BOARD_X + index * SQUARE_WIDTH + 3, BOARD_Y + SQUARE_HEIGHT * 8, String.fromCharCode(97 + index), "1");
  }
}

function drawMovePanel(grid, played, isMate) {
  const left = BOARD_X + SQUARE_WIDTH * 8 + 6;
  grid.text(left, 2, "CHESS / REPLAY", "2");
  grid.text(left, 3, "OPERA GAME · 1858", "1");
  grid.text(left, 5, "MOVE", "1");
  grid.text(left + 6, 5, "WHITE", "1");
  grid.text(left + 15, 5, "BLACK", "1");
  grid.text(left, 6, "--------------------", "3");

  const currentFullMove = Math.floor(Math.max(0, played - 1) / 2);
  const firstMove = Math.max(0, Math.min(Math.ceil(GAME.length / 2) - 10, currentFullMove - 6));
  for (let move = firstMove; move < Math.min(Math.ceil(GAME.length / 2), firstMove + 10); move += 1) {
    const y = 7 + move - firstMove;
    const whiteIndex = move * 2;
    const blackIndex = whiteIndex + 1;
    grid.text(left, y, `${String(move + 1).padStart(2, "0")}.`, "1");
    if (whiteIndex < played) grid.text(left + 5, y, GAME[whiteIndex][1], whiteIndex === played - 1 ? "4" : "0");
    if (blackIndex < played) grid.text(left + 14, y, GAME[blackIndex][1], blackIndex === played - 1 ? "4" : "2");
  }

  grid.text(left, HEIGHT - 4, isMate ? "CHECKMATE / BLACK" : played % 2 ? "BLACK TO MOVE" : "WHITE TO MOVE", isMate ? "2" : "1");
  grid.text(left, HEIGHT - 2, isMate ? "A CLASSIC FINISH" : "MOVE BY MOVE", "1");
}

/** Build the current board and move list for the animated Opera Game replay. */
export default function createChessReplay() {
  const grid = new ChessGrid();
  const boards = createBoardStates();

  function draw(time) {
    grid.clear();
    const localTime = time % TOTAL_DURATION;
    const moveIndex = Math.min(GAME.length, Math.floor(localTime / MOVE_DURATION));
    const moveTime = localTime - moveIndex * MOVE_DURATION;
    const isSliding = moveIndex < GAME.length && moveTime < SLIDE_DURATION;
    const board = boards[isSliding ? moveIndex : Math.min(GAME.length, moveIndex + 1)];
    const lastMoveIndex = isSliding ? moveIndex : Math.min(GAME.length, moveIndex + 1) - 1;
    const lastMove = lastMoveIndex >= 0 ? GAME[lastMoveIndex][0].split(" ") : [];
    const highlightedSquares = new Set(lastMove.flatMap((move) => [move.slice(0, 2), move.slice(2, 4)]));
    const movingSquares = new Set(isSliding ? GAME[moveIndex][0].split(" ").map((move) => move.slice(0, 2)) : []);
    const movingPieces = isSliding ? GAME[moveIndex][0].split(" ").map((move) => {
      const [fromX, fromY] = square(move.slice(0, 2));
      const [toX, toY] = square(move.slice(2, 4));
      return { fromX, fromY, toX, toY, piece: boards[moveIndex][fromY][fromX] };
    }) : null;
    const easingProgress = Math.min(1, moveTime / SLIDE_DURATION);
    const easing = easingProgress * easingProgress * (3 - 2 * easingProgress);
    const played = isSliding ? moveIndex + 1 : Math.min(GAME.length, moveIndex + 1);
    const isMate = moveIndex >= GAME.length;

    grid.text(2, 0, "P / PORTFOLIO CHESS STUDY", "1");
    grid.text(WIDTH - 24, 0, "C++  /  SFML", "2");
    drawBoard(grid, board, highlightedSquares, movingSquares, movingPieces, easing);
    drawMovePanel(grid, played, isMate);
    return grid.frame();
  }

  draw.duration = TOTAL_DURATION;
  return draw;
}
