let counter = 0;
let sum = 0;

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
    sudokuRect.innerText = (i + 1) % 9 !== 0 ? (i + 1) % 9 : 9;
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
    const index = sudokuCopy[row][i].possibleNumbers.indexOf(numberToEliminate);
    index != -1 ? sudokuCopy[row][i].possibleNumbers.splice(index, 1) : null;
  }

  // eliminate numbers in Column
  for (let i = row + 1; i < 9; i++) {
    const index = sudokuCopy[i][col].possibleNumbers.indexOf(numberToEliminate);
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
const writeSudokuToHtml = () => {};
const generateSudoku = () => {
  const initSudokuArray = initializeSudokuArray();
  //console.log(initSudokuArray);
  const sudokuHTML = createHTML("sudoku");
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
      //console.log(randomizedArray);
      sudokuControlNumber = 0;
    }
  }
  sum += iterations;
  console.log(iterations);

  //console.log(randomizedArray);

  [...sudokuHTML.children].forEach((element) => {
    const row = element.dataset.row;
    const col = element.dataset.column;

    element.innerText =
      randomizedArray[row][col].number === undefined
        ? -1
        : randomizedArray[row][col].number;
  });
};

document.body.addEventListener("click", () => {
  counter++;

  const sudokuHTML = createHTML("sudoku");
  sudokuHTML.innerHTML = "";
  generateSudoku();
  console.log(`${sum / counter} Średnia. Licznik: ${counter}`);
});
