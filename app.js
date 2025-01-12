const checkTableEmty = (table) => {
    // Check if the table is valid
    let isValid = false;
    for (let i = 0; i < table.length; i++) {
        if (table[i] !== "") {
            isValid = true;
            break;
        }
    }
    return isValid;
}

const printMessage = (msg) => {
    const messageSpan = document.getElementById('message')
    messageSpan.innerHTML = msg
    messageSpan.style.display = 'block'
}

function isTableValid(board) {
    const size = 9;
    const boxSize = 3;

    // Helper function to check duplicates in an array
    function hasDuplicates(array) {
        const seen = new Set();
        for (let num of array) {
            if (num !== "") { // Ignore empty cells
                if (seen.has(num)) {
                    return true;
                }
                seen.add(num);
            }
        }
        return false;
    }

    // Check rows
    for (let row = 0; row < size; row++) {
        if (hasDuplicates(board[row])) {
            return false;
        }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
        const column = [];
        for (let row = 0; row < size; row++) {
            column.push(board[row][col]);
        }
        if (hasDuplicates(column)) {
            return false;
        }
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < size; boxRow += boxSize) {
        for (let boxCol = 0; boxCol < size; boxCol += boxSize) {
            const box = [];
            for (let row = 0; row < boxSize; row++) {
                for (let col = 0; col < boxSize; col++) {
                    box.push(board[boxRow + row][boxCol + col]);
                }
            }
            if (hasDuplicates(box)) {
                return false;
            }
        }
    }

    // If all checks pass, the board is valid
    return true;
}

const solve = () => {
    let table = [];
    for (let i = 0; i < 81; i++) {
        // Get input item
        const input = document.getElementsByTagName('input')[i];
        // Get value
        const inputValue = input.value;
        // Color user input
        if (inputValue) input.classList.add("userinput");
        // Save to table
        table[i] = inputValue ? inputValue : "";
    }

    // Check if the table is empty
    let empty = checkTableEmty(table);
    if (!empty) {
        printMessage('Empty table :(')
        return;
    }

    // Convert the table to a 2D array
    let table2D = [];
    for (let i = 0; i < 9; i++) {
        table2D.push(table.splice(0, 9));
    }

    // Check if the table is valid
    let isValid = isTableValid(table2D);
    if (!isValid) {
        printMessage('Invalid table :(')
        return;
    }


    // Solve the sudoku
    if (sudokuSolver(table2D)) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const index = i * 9 + j
                document.getElementsByTagName('input')[index].value = table2D[i][j];
            }
        }
    } else {
        printMessage('No solution :(')
    }
}

function sudokuSolver(board) {
    let row
    let col
    let isEmpty = true;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] == 0) {
                // Some missing values
                row = i;
                col = j;
                isEmpty = false;
                break;
            }
        }
        if (!isEmpty) break;
    }

    // No empty 
    if (isEmpty) return true;

    // Else for each-row backtrack
    for (let num = 1; num <= 9; num++) {
        if (isValueValid(board, row, col, num)) {
            board[row][col] = num;
            if (sudokuSolver(board, 9)) return true;
            else board[row][col] = 0;
        }
    }
    return false;
}

function isValueValid(board, row, col, value) {
    // Check row
    for (let j = 0; j < board.length; j++) {
        if (board[row][j] == value) return false;
    }

    // Check column
    for (let i = 0; i < board.length; i++) {
        if (board[i][col] == value) return false;
    }

    // Check box
    let sqrt = Math.floor(Math.sqrt(board.length));
    let rowStart = row - row % sqrt;
    let colStart = col - col % sqrt;

    for (let i = rowStart; i < rowStart + sqrt; i++) {
        for (let j = colStart; j < colStart + sqrt; j++) {
            if (board[i][j] == value) return false;
        }
    }

    return true;
}

const cancelSolver = () => location.reload();
