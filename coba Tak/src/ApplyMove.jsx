
//apply untuk mensimulasikan move ke dalam clone dari game board untuk dievaluasi 
function apply(board, player, move, isFirstTurn){
    if(move.moveType == "place"){
        let res = applyPlace(board, player, move, isFirstTurn);
        return res;
    }else{
        let res = applyMove(board, player, move);
        return res;
    }
}

function applyPlace(board, player, move, isFirstTurn){
    let otherPlayer = "";
    if(player == "enemy"){
        otherPlayer = "player";
    }else{
        otherPlayer = "enemy";
    }

    // let appliedBoard = {...board};
    let appliedBoard = [];
    for (let i = 0; i < board.length; i++) {
        let copiedRow = [];
        for (let j = 0; j < board[i].length; j++) {
            let copiedStack = [...board[i][j].stack]
            let copiedCol = {
                col: board[i][j].col,
                row: board[i][j].row,
                stack: copiedStack,
            }
            copiedRow.push(copiedCol);
        }
        appliedBoard.push(copiedRow);
    }

    // console.log(appliedBoard);
    let piece = move.type;
    let row = move.row;
    let col = move.col;
    let newPiece = "";

    if(isFirstTurn){
        newPiece = {
            type: piece,
            owner: otherPlayer,
        }
    }else{
        newPiece = {
            type: piece,
            owner: player,
        }
    }

    appliedBoard[row][col].stack.push(newPiece);

    return appliedBoard;
}

function applyMove(board, player, move){
    //copy board to save the state
    let appliedBoard = [];
    for (let i = 0; i < board.length; i++) {
        let copiedRow = [];
        for (let j = 0; j < board[i].length; j++) {
            let copiedStack = [...board[i][j].stack]
            let copiedCol = {
                col: board[i][j].col,
                row: board[i][j].row,
                stack: copiedStack,
            }
            copiedRow.push(copiedCol);
        }
        appliedBoard.push(copiedRow);
    }

    let direction = move.direction;
    let dropsCombination = move.drops;
    let row = move.row;
    let col = move.col;
    let movedStack = appliedBoard[row][col].stack;
    //jumlah pertambahan column dan row
    let dR = 0;
    let dC = 0;

    if(direction == "left"){
        dR = 0;
        dC = -1;
    }else if(direction == "right"){
        dR = 0;
        dC = 1;
    }else if(direction == "up"){
        dR = -1;
        dC = 0;
    }else{//down
        dR = 1;
        dC = 0;
    }

    for (let i = 0; i < dropsCombination.length; i++) {
        let r = parseInt(row) + dR * (i+1);
        let c = parseInt(col) + dC * (i+1);

        let getStack = "";
        if(dropsCombination.length == 1){//khusus jika hanya move satu top piece dr stack, sisanya tetap stay
            getStack = movedStack.splice(movedStack.length-1, 1);
        }else{
            getStack = movedStack.splice(0, dropsCombination[i]);
        }


        if(appliedBoard[r][c].stack.length != 0 && getStack.length != 0 && getStack[0].type == "capstone" && appliedBoard[r][c].stack[appliedBoard[r][c].stack.length-1].type == "wallstone"){
            // appliedBoard[r][c].stack[appliedBoard[r][c].stack.length-1].type = "flatstone";
            //make wall flat
            let flatStone = {
                type: "flatstone",
                owner: appliedBoard[r][c].stack[appliedBoard[r][c].stack.length-1].owner
            }
            appliedBoard[r][c].stack.splice(appliedBoard[r][c].stack.length-1, 1);//delete wall
            //insert flat
            appliedBoard[r][c].stack.push(flatStone);
        }
        //drop pieces to appliedboard current cell's stack
        appliedBoard[r][c].stack.push(...getStack);
    }

    return appliedBoard;
}

export default {apply}