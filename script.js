// sudoku Algorithm
/*krzysztof.bozek@hotmail.com a tytule wpisać również nr indeksu */
{
  const createHTML = (id = "") => {
    const sudokuContainer = document.getElementById(id);
    const border = "1px solid gray";
    const borderFat = "2px solid black";
    let gridAreas = ``;
    let smallString = ``;
    for (let i = 0; i < 81; i++) {
      const sudokuRect = document.createElement("div");
      sudokuRect.classList.add("sudoku_number");
      if (i < 72) {
        if ((i > 17 && i < 27) || (i > 44 && i < 54)) {
          sudokuRect.style.borderBottom = borderFat;
        } else {
          sudokuRect.style.borderBottom = border;
        }
      }
      if ((i + 1) % 9 !== 0) {
        if ((i + 1) % 3 === 0) {
          sudokuRect.style.borderRight = borderFat;
        } else {
          sudokuRect.style.borderRight = border;
        }
      }
      //sudokuRect.innerText = (i + 1) % 9 !== 0 ? (i + 1) % 9 : 9;
      sudokuRect.id = i;
      sudokuRect.dataset.row = Math.floor(i / 9);
      sudokuRect.dataset.column = i % 9 !== 0 ? i % 9 : 0;
      sudokuContainer.appendChild(sudokuRect);
      smallString += ` ${i}`;
      if (i > 0 && i % 8 === 0) {
        gridAreas += `'${smallString}'`;
        smallString = ``;
      }
    }

    sudokuContainer.style.gridTemplateAreas = gridAreas;
    return sudokuContainer;
  };
  const eliminateNumbers = (row, col, numberToEliminate, sudoku = []) => {
    const sudokuCopy = [...sudoku];
    //console.log(numberToEliminate);

    // eliminateNumbers in row
    for (let i = col + 1; i < 9; i++) {
      const index = sudokuCopy[row][i].possibleNumbers.indexOf(
        numberToEliminate
      );
      index != -1 ? sudokuCopy[row][i].possibleNumbers.splice(index, 1) : null;
    }

    // eliminate numbers in Column
    for (let i = row + 1; i < 9; i++) {
      const index = sudokuCopy[i][col].possibleNumbers.indexOf(
        numberToEliminate
      );
      index !== -1 ? sudokuCopy[i][col].possibleNumbers.splice(index, 1) : null;
    }
    // eliminate numbers in small sudokuRect
    const rowCoord = row % 3;
    const colCoord = col % 3;
    const bigCol = Math.floor(col / 3);
    const bigRow = Math.floor(row / 3);

    const rectRowArr = [0, 1, 2];
    const rectColArr = [0, 1, 2];

    const finalLocalRows = rectRowArr.filter((item) => item > rowCoord);
    const finalLocalCols = rectColArr.filter((item) => item !== colCoord);

    finalLocalRows.forEach((finalrow) => {
      const totalRowNumber = finalrow + 3 * bigRow;

      for (let i = 0; i < finalLocalCols.length; i++) {
        const totalColNumber = finalLocalCols[i] + 3 * bigCol;
        //console.log(totalColNumber);

        const index = sudokuCopy[totalRowNumber][
          totalColNumber
        ].possibleNumbers.indexOf(numberToEliminate);
        index !== -1
          ? sudokuCopy[totalRowNumber][totalColNumber].possibleNumbers.splice(
              index,
              1
            )
          : null;
      }
    });

    //console.log(rowCoord);

    return sudokuCopy;
  };
  const randomizeSudoku = (sudokuObjectsArray = []) => {
    let sudokuCopy = [...sudokuObjectsArray];

    for (let i = 0; i < sudokuCopy.length; i++) {
      const sudokuRow = sudokuCopy[i];
      for (let j = 0; j < sudokuRow.length; j++) {
        const sudokuElement = sudokuRow[j];
        const randomIndex = Math.floor(
          Math.random() * sudokuElement.possibleNumbers.length
        );
        //console.log(randomIndex);

        const sudokuNumber = sudokuElement.possibleNumbers[randomIndex];
        //sudokuCopy[i][j].possibleNumbers = null;
        sudokuCopy[i][j].number = sudokuNumber;
        const copy = eliminateNumbers(i, j, sudokuNumber, sudokuCopy);
        sudokuCopy = copy;
      }
    }

    //console.log(sudokuCount);

    return sudokuCopy;

    //console.log(sudokuCopy);
  };

  const initializeSudokuArray = () => {
    const sudokuArray = [];
    for (let i = 0; i < 9; i++) {
      const row = [];
      for (let j = 0; j < 9; j++) {
        const sudokuNumber = {
          number: null,
          row: i,
          column: j,
          possibleNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        };
        row.push(sudokuNumber);
      }
      sudokuArray.push(row);
    }
    return sudokuArray;
  };

  const createSudokuToSolve = (sudokuArray = [], difficulty = 1) => {
    sudoku = [...sudokuArray];

    const indexes = [];
    sudoku.forEach((item) => {
      item.forEach((rect) => {
        indexes.push({ row: rect.row, column: rect.column });
      });
    });

    const removedItems = [];
    const amountOfNumbersToEliminate = {
      1: {
        min: 18,
        max: 22,
      },
      2: {
        min: 23,
        max: 28,
      },
      3: {
        min: 29,
        max: 36,
      },
      4: {
        min: 37,
        max: 45,
      },
    };
    const numbersCount =
      Math.floor(
        Math.random() *
          (amountOfNumbersToEliminate[difficulty].max -
            amountOfNumbersToEliminate[difficulty].min)
      ) + amountOfNumbersToEliminate[difficulty].min;
    for (let i = 0; i < 81 - numbersCount; i++) {
      const index = Math.floor(Math.random() * indexes.length);
      const rect = indexes[index];
      sudoku[rect.row][rect.column].number = 0;
      indexes.splice(index, 1);
      removedItems.push(rect);
    }

    return sudoku;
  };
  const writeSudkuToHTML = (sudokuArray = [], sudokuHTML) => {
    const sudoku = [...sudokuArray];

    [...sudokuHTML.children].forEach((element) => {
      const row = element.dataset.row;
      const col = element.dataset.column;
      if (sudoku[row][col].number !== 0) {
        element.dataset.start_number = true;
        element.classList.add("disabled");
      } else {
        element.dataset.start_number = false;
      }

      element.innerText =
        sudoku[row][col].number === 0 ? "" : sudoku[row][col].number;
    });
  };
  const generateSudoku = () => {
    const initSudokuArray = initializeSudokuArray();

    let randomizedArray = randomizeSudoku(initSudokuArray);
    let sudokuControlNumber = 0;
    let iterations = 0;
    while (sudokuControlNumber !== 405 && iterations < 10000) {
      iterations++;
      randomizedArray.forEach((row) => {
        row.forEach((sud) => {
          const number = sud.number ? sud.number : -1;
          sudokuControlNumber += number;
        });
      });
      if (sudokuControlNumber !== 405) {
        randomizedArray = [];
        randomizedArray = randomizeSudoku(initializeSudokuArray());

        sudokuControlNumber = 0;
      } else {
        return randomizedArray;
      }
    }
    sum += iterations;
  };
  const StartGameFunction = (id = "", difficulty = 1) => {
    const fullSudoku = generateSudoku();
    const finalSudoku = createSudokuToSolve(fullSudoku, difficulty);
    writeSudkuToHTML(finalSudoku, createHTML(id));

    return { fullSudoku, finalSudoku };
  };
  const createNumbersPanel = (selector = "") => {
    const parent = document.querySelector(selector);
    const panel = document.createElement("div");
    panel.classList.add("numbers_panel");
    for (let i = 0; i < 9; i++) {
      const number = document.createElement("div");
      number.classList.add("panel_number");
      number.innerText = i + 1;
      number.dataset.number = i + 1;
      number.id = `digit_${i + 1}`;
      panel.appendChild(number);
    }
    parent.appendChild(panel);
  };

  const App = (sudokuID = "") => {
    const PRIVATE_DATA = {
      icons: {
        play:
          "M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
        pause:
          "M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z",
        remove:
          "M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
        add:
          "M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
      },
    };
    const SetState = (state = {}, callback) => {
      AppState = { ...AppState, ...state };
      console.log(AppState);
      callback(AppState);
      //AppUpdated(callback);
    };
    let AppState = {
      sudokuPause: false,
      sudokuID: sudokuID,
      sudokuFull: null,
      sudokuToSolve: null,
      hasSudokuInitialize: false,
      time: 0,
      timerId: "",
      difficulty: 4,
      selectedRect: {},
      selectedNumber: "",
      HTMLRects: "",
      NumbersPanel: "",
      sudokuMode: "normal",
    };
    // funkcje developerskie
    const LOGBTN = document.getElementById("LOG_BTN");
    LOGBTN.addEventListener("click", (e) => {
      console.log(AppState);
    });

    // -------------------------------------------------------------------- Handlers
    const handleTimer = (time = 0) => {
      const HTML_timer = document.getElementById("sudoku_timer");
      const seconds = time % 60;
      const minutes = Math.floor(time / 60);
      const hours = Math.floor(time / 3600);
      HTML_timer.innerText =
        `${hours < 10 ? "0" + hours : hours}` +
        ":" +
        `${minutes < 10 ? "0" + minutes : minutes}` +
        ":" +
        `${seconds < 10 ? "0" + seconds : seconds}`;
    };
    const handlePauseStart = (mode = "", element) => {
      if (mode === "pause") {
        window.clearInterval(AppState.timerId);
        element.dataset.actionType = "play";
        element.children[1].setAttribute("d", PRIVATE_DATA.icons.play);
        AppState.sudokuPause = true;
      } else if (mode === "play") {
        const timer = window.setInterval(() => {
          AppState.time++;
          handleTimer(AppState.time);
        }, 1000);
        console.log(PRIVATE_DATA.icons.pause);
        element.children[1].setAttribute("d", PRIVATE_DATA.icons.pause);
        element.dataset.actionType = "pause";
        AppState.timerId = timer;
        AppState.sudokuPause = false;
      }
    };
    const handleReset = () => {
      AppState.time = 0;
      window.clearInterval(AppState.timerId);
      handleTimer(AppState.time);
      AppState.sudokuPause = true;
      const playBtn = document.getElementById("action_pause");
      playBtn.dataset.actionType = "play";
      const sudoku = document.getElementById("sudoku");
      playBtn.children[1].setAttribute("d", PRIVATE_DATA.icons.play);
      writeSudkuToHTML(AppState.sudokuToSolve, sudoku);
    };
    // --------------------------------------------------------------------HTML_Elements
    const playElement = document.getElementById("sudoku_init_btn");
    const sudokuHTML = document.getElementById(sudokuID);
    const sudokuActionPanel = document.getElementById("action_panel");
    const sudokuActionButtons = [...sudokuActionPanel.children];
    /*--------------------------------------------------event Listeners */

    sudokuActionButtons.forEach((el) => {
      const actionElement = el.children[0];
      if (actionElement) {
        actionElement.addEventListener("click", (e) => {
          e.stopPropagation();
          const target = e.currentTarget;
          if (target.dataset.action === "true") {
            const actionType = target.dataset.actionType;
            console.log(actionType);
            if (actionType === "pause" || actionType === "play") {
              handlePauseStart(actionType, target);
            } else if (actionType === "reset") {
              handleReset();
            } else if (actionType === "remove") {
              AppState.sudokuMode = "remove";
              target.dataset.actionType = "add";
              target.children[1].setAttribute("d", PRIVATE_DATA.icons.add);
            } else if (actionType === "add") {
              target.dataset.actionType = "remove";
              AppState.sudokuMode = "normal";
              target.children[1].setAttribute("d", PRIVATE_DATA.icons.remove);
            }
          }
        });
      }
    });

    const handleNumbersPanel = () => {
      AppState.NumbersPanel.addEventListener("click", (e) => {
        e.stopPropagation();

        const element = e.target;

        if (
          element.classList.contains("panel_number") &&
          !AppState.sudokuPause
        ) {
          const number = element.dataset.number * 1;
          AppState.selectedNumber = number;
          AppState.selectedRect.element.innerText = number;
        }
      });
    };
    // handling Sudoku areas
    sudokuHTML.addEventListener("click", (e) => {
      const { HTMLRects } = AppState;
      e.stopPropagation();

      if (
        e.target.classList.contains("sudoku_number") &&
        e.target.dataset.start_number !== "true" &&
        !AppState.sudokuPause
      ) {
        const row = e.target.dataset.row;
        const col = e.target.dataset.column;
        HTMLRects.forEach((element) => {
          if (element.dataset.row === row && element.dataset.column === col) {
          } else {
            element.classList.remove("active");
          }
        });
        e.target.classList.toggle("active");
        if (e.target.classList.contains("active")) {
          AppState.selectedRect = { row, col, element: e.target };
          if (AppState.sudokuMode === "remove") {
            console.log("DZIAŁA--------------");
            AppState.selectedRect = {};
            e.target.innerText = "";
          }
        } else {
          AppState.selectedRect = {};
        }
      }
    });

    // initializing game
    playElement.addEventListener("click", (e) => {
      e.stopPropagation();
      e.target.style.display = "none";
      // creating panel with numbers to select
      createNumbersPanel(".sudoku-wrap");
      const { hasSudokuInitialize, time, sudokuID } = AppState;
      sudokuHTML.style.display = "grid";
      if (hasSudokuInitialize) {
      } else {
        const intervalId = window.setInterval(() => {
          AppState.time++;
          handleTimer(AppState.time);
        }, 1000);
        AppState.timerId = intervalId;
        const data = StartGameFunction(AppState.sudokuID, AppState.difficulty);
        AppState.hasSudokuInitialize = true;
        AppState.sudokuFull = data.fullSudoku;
        AppState.sudokuToSolve = data.finalSudoku;
        AppState.HTMLRects = document.querySelectorAll(".sudoku_number");
        const panel = document.querySelector(".numbers_panel");
        SetState({ NumbersPanel: panel }, handleNumbersPanel);
      }
    });
  };
  App("sudoku");
}
