
function getNextMove(board, player, playerPieceLeft, isFirstTurn) {
    let allPossibleMoves = getAllMoves(board, player, isFirstTurn, playerPieceLeft);
    console.log(allPossibleMoves);//cetak semua possible move
    let bestScore = -9999;
    let bestMove;
    for (let i = 0; i < allPossibleMoves.length; i++) {
        //copy board
        let newBoard = [...board];
        // console.log(board === newBoard);
        let score = minimax(allPossibleMoves[i], newBoard, playerPieceLeft); //(move,board)
        if (score > bestScore) {//get max value for enemy
            bestScore = score;
            bestMove = allPossibleMoves[i];
        }
    }
    console.log("best next move score:" + bestScore);
    console.log("best next move:" + JSON.stringify(bestMove));
    return bestMove;
}

function minimax(move, tempBoard, playerPieceLeft) {
    let score = 0;
    console.log(move);
    if (move.owner == "enemy" && move.moveType == "place") {//sementara place aja yg diambil
        if (move.type == "capstone" && playerPieceLeft.capstone > 0) {
            //check if target cell is empty
            let targetCell = tempBoard[move.row][move.col].stack
            if (targetCell.length == 0) {
                //place new piece on an empty cell
                targetCell.push({ type: move.type, owner: move.owner });
                //calculate score
                for (let i = 0; i < tempBoard.length; i++) {
                    for (let j = 0; j < tempBoard[i].length; j++) {
                        //check if cell is not empty
                        if (tempBoard[i][j].stack.length > 0) {
                            if (tempBoard[i][j].stack[tempBoard[i][j].stack.length - 1].owner == "enemy") {
                                //stack is controlled by enemy

                                for (let k = 0; k < tempBoard[i][j].stack.length; k++) {
                                    //count the value of all piece (flatstone = 1, wallstone = 2, capstone = 3)
                                    if (tempBoard[i][j].stack[k].type == "flatstone") {
                                        score += 1;
                                    } else if (tempBoard[i][j].stack[k].type == "wallstone") {
                                        score += 2;
                                    } else if (tempBoard[i][j].stack[k].type == "capstone") {
                                        score += 3;
                                    }
                                }
                            }
                        }
                    }
                }

                tempBoard[move.row][move.col].stack.splice(tempBoard[move.row][move.col].stack.length - 1); //reset
            }
        } else if (move.type != "capstone" && playerPieceLeft.stone > 0) {
            //check if target cell is empty
            let targetCell = tempBoard[move.row][move.col].stack
            if (targetCell.length == 0) {
                //place new piece on an empty cell
                targetCell.push({ type: move.type, owner: move.owner });
                //calculate score
                for (let i = 0; i < tempBoard.length; i++) {
                    for (let j = 0; j < tempBoard[i].length; j++) {
                        //check if cell is not empty
                        if (tempBoard[i][j].stack.length > 0) {
                            if (tempBoard[i][j].stack[tempBoard[i][j].stack.length - 1].owner == "enemy") {
                                //stack is controlled by enemy

                                for (let k = 0; k < tempBoard[i][j].stack.length; k++) {
                                    //count the value of all piece (flatstone = 1, wallstone = 2, capstone = 3)
                                    if (tempBoard[i][j].stack[k].type == "flatstone") {
                                        score += 1;
                                    } else if (tempBoard[i][j].stack[k].type == "wallstone") {
                                        score += 2;
                                    } else if (tempBoard[i][j].stack[k].type == "capstone") {
                                        score += 3;
                                    }
                                }
                            }
                        }
                    }
                }

                tempBoard[move.row][move.col].stack.splice(tempBoard[move.row][move.col].stack.length - 1); //reset
            }
        }
    } else {
        //drop

    }
    return score;
}


//bentuk susunan objek

// playerPieceLeft = {
//     stone: 10,
//     capstone: 1
// }

function getAllMoves(board, player, isFirstTurn, playerPieceLeft) {
    let allPossibleMoves = [];
    let otherPlayer = "";
    if (player == "enemy") {
        otherPlayer = "player";
    } else {
        otherPlayer = "enemy";
    }

    //possible move for place new stone
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let newMove = "";
            if (!isFirstTurn) {//not first move, free to place all stone type
                if (playerPieceLeft.stone > 0) {//jumlah stone untuk flatstone dan wallstone mencukupi
                    newMove = {
                        type: "flatstone",
                        col: j,
                        row: i,
                        owner: player,
                        moveType: "place",
                    }
                    allPossibleMoves.push(newMove);

                    newMove = {
                        type: "wallstone",
                        col: j,
                        row: i,
                        owner: player,
                        moveType: "place",
                    }
                    allPossibleMoves.push(newMove);
                }

                if (playerPieceLeft.capstone > 0) {//jumlah capstone mencukupi
                    newMove = {
                        type: "capstone",
                        col: j,
                        row: i,
                        owner: player,
                        moveType: "place",
                    }
                    allPossibleMoves.push(newMove);
                }


            } else {// first move, place other player flatstone
                newMove = {
                    type: "flatstone",
                    col: j,
                    row: i,
                    owner: otherPlayer,
                    moveType: "place",
                }
                allPossibleMoves.push(newMove);
            }

        }

    }

    //generate all possible moves for stack owned, only for moves after first move
    if (!isFirstTurn) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j].stack.length > 0 && board[i][j].stack[board[i][j].stack.length - 1].owner == player) {//stack owned by player
                    let stackMoves = generateStackMoves(board, player, i, j);

                    for (let i = 0; i < stackMoves.length; i++) {
                        allPossibleMoves.push(stackMoves[i]);
                    }

                }
            }
        }
    }

    return allPossibleMoves;
}

function generateStackMoves(board, player, row, col) {
    let stackMoves = [];
    let stack = board[row][col].stack;
    let allDrops = [];
    let newMove = "";

    for (let n = 1; n <= Math.min(stack.length, board.length); n++) {// for 1 to the carry limit of the board
        allDrops = [];//reset allDrops
        generateDrops(n, allDrops, []);

        for (let i = 0; i < allDrops.length; i++) {
            let drops = allDrops[i];

            //move stack ke kiri
            newMove = {
                col: col,
                row: row,
                owner: player,
                direction: "left",
                drops: drops,
                moveType: "move",
            }
            if (isLegal(board, newMove)) {
                stackMoves.push(newMove);
            }

            //move stack ke kanan
            newMove = {
                col: col,
                row: row,
                owner: player,
                direction: "right",
                drops: drops,
                moveType: "move",
            }
            if (isLegal(board, newMove)) {
                stackMoves.push(newMove);
            }

            //move stack ke atas
            newMove = {
                col: col,
                row: row,
                owner: player,
                direction: "up",
                drops: drops,
                moveType: "move",
            }
            if (isLegal(board, newMove)) {
                stackMoves.push(newMove);
            }

            //move stack ke bawah
            newMove = {
                col: col,
                row: row,
                owner: player,
                direction: "down",
                drops: drops,
                moveType: "move",
            }
            if (isLegal(board, newMove)) {
                stackMoves.push(newMove);
            }

        }
    }
    return stackMoves;
}

//generate semua kombinasi drop stack yang mungkin
//generate possible combinations of drops for a stack with "number" pieces remaining in-hand
function generateDrops(number, allDrops, current) {
    if (number <= 0) {
        //all pieces dropped, add current to all drops possible combination list
        let drop = [];
        for (let i = 0; i < current.length; i++) {
            drop.push(current[i]);
        }
        allDrops.push(drop);
    } else {
        for (let i = 1; i <= number; i++) {
            current.push(i);
            generateDrops(number - 1, allDrops, current);//recursive
            current.splice(current.length - 1, 1);//delete last index of current   
        }
    }
}

function isLegal(board, newMove, isFirstTurn = false) {
    let row = newMove.row;
    let col = newMove.col;
    let moveType = newMove.moveType;

    //invalid cell
    if (row < 0 || row >= board.length || col < 0 || col >= board.length) {
        return false;
    }

    if (moveType == "move") {
        return isLegalMove(board, newMove);
    } else {
        return isLegalPlace(board, newMove, isFirstTurn);//??? ini belum dibuat functionnya
    }
}

function isLegalPlace(board, newMove, isFirstTurn) {

    if (isFirstTurn && newMove.type != "flatstone") {
        return false; //first move harus flat
    } else if (board[row][col].length != 0) {
        return false;// place harus di cell kosong
    } else {
        return true;
    }

}

function getMovedNum(drops) {// drops (1,2,1,1)
    if (drops == null || drops.length == 0) {
        return 0;
    }
    let num = 0;
    for (let i = 0; i < drops.length; i++) {
        num = num + drops[i];
    }
    return num;
}

function isLegalMove(board, newMove) {
    let player = newMove.owner;
    let drops = newMove.drops;
    let row = newMove.row;
    let col = newMove.col;
    let direction = newMove.direction;


    //piece yang dipindah lebih dari yang ada di stack
    if (board[row][col].stack.length == 0 || board[row][col].stack.length < getMovedNum(drops)) {
        return false;
    }

    //stack tidak dikontrol player
    if (board[row][col].stack[board[row][col].stack.length - 1].owner != player) {
        return false;
    }

    //stack yg dipindah melebihi batas (maksimal sepanjang ukuran papan)
    if (board.length < getMovedNum(drops)) {
        return false;
    }

    //move stack keluar melebihi batas papan
    if ((direction == "up" && row + drops.length >= board.length) ||
        (direction == "down" && row - drops.length < 0) ||
        (direction == "right" && col + drops.length >= board.length) ||
        (direction == "left" && col - drops.length < 0)) {
        return false;
    }
    // console.log(board[row][col]);
    let movedStack = [...board[row][col].stack];
    for (let i = 0; i < drops.length; i++) {
        let rowT = row;
        let colT = col;

        if (direction == "up") {
            rowT = parseInt(rowT) + (i + 1) * (-1);
            colT = parseInt(col);

            if (rowT < 0) {
                return false;
            }
        } else if (direction == "down") {
            rowT = parseInt(rowT) + (i + 1) * 1;
            colT = parseInt(col);

            if (rowT >= board.length) {
                return false;
            }
        } else if (direction == "left") {
            rowT = parseInt(row);
            colT = parseInt(colT) + (i + 1) * (-1);
            if (colT < 0) {
                return false;
            }
        } else {
            rowT = parseInt(row);
            colT = parseInt(colT) + (i + 1) * 1;

            if (colT >= board.length) {
                return false;
            }
        }

        let targetStack = board[parseInt(rowT)][parseInt(colT)].stack;//untuk cek

        if (!allowToDrop(targetStack, movedStack)) {
            return false;
        }

        if (drops[i] > movedStack.length) {//drops lebih besar dari jumlah piece yang ada
            return false;
        }

        //remove moved piece from stack
        for (let j = 0; j < drops[i]; j++) {
            movedStack.splice(0, 1);
        }
    }


    //jika lolos berati valid
    return true;
}

function allowToDrop(stackTarget, stackIncoming) {
    //jika target cell kosong atau topnya adalah flat
    if (stackTarget.length == 0 || (stackTarget[stackTarget.length - 1].type != "wallstone" && stackTarget[stackTarget.length - 1].type != "capstone")) {
        return true;
    } else if (stackIncoming[0].type == "capstone" && stackTarget[stackTarget.length - 1].type != "capstone") {//cek jika yang didrop adalah capstone dan top of target bukan capstone maka capstone boleh di drop
        return true;
    } else {
        return false;
    }

}

export default { getNextMove };