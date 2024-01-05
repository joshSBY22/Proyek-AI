import ApplyMove from "./ApplyMove";

let {apply} = ApplyMove;

function getNextMove(board, player, playerPieceLeft, isFirstTurn){

    let allPossibleMoves = getAllMoves(board, player, isFirstTurn, playerPieceLeft);
    // console.log(allPossibleMoves);//cetak semua possible move
    if(allPossibleMoves.length == 0){
        alert("No More Move Available!");
    }

    for (let i = 0; i < allPossibleMoves.length; i++) {
        let getAppliedMoveOnTheBoard = apply(board, player, allPossibleMoves[i], isFirstTurn);
        allPossibleMoves[i].boardState = getAppliedMoveOnTheBoard;

        //hitung langkah terbaik
        if (isFirstTurn) {
            //menghitung langkah saat menggerakkan piece lawan di move pertama 
            let thePlayer = "enemy";
            if(player == "enemy"){
                thePlayer = "player";
            }

            allPossibleMoves[i].score = getScoreFromSBE(getAppliedMoveOnTheBoard, thePlayer);
        }else{
            allPossibleMoves[i].score = getScoreFromSBE(getAppliedMoveOnTheBoard, player);
        }
    }
    console.log(allPossibleMoves);//cetak semua possible move
    
    //shuffle
    shuffleArray(allPossibleMoves);

    // console.log(allPossibleMoves);

    let bestMove = "";

    if(isFirstTurn){//dapatkan posisi terjelek untuk musuh di peletakan batu yang pertama 
        let minScore = 999999999;
        for (let i = 0; i < allPossibleMoves.length; i++) {
            if(allPossibleMoves[i].score < minScore){
                minScore = allPossibleMoves[i].score;
                bestMove = allPossibleMoves[i];
            }
        }
    }else{
        //dapatkan langkah terbaik untuk ai
        let maxScore = -999999999;
        for (let i = 0; i < allPossibleMoves.length; i++) {
            if(allPossibleMoves[i].score > maxScore){
                maxScore = allPossibleMoves[i].score;
                bestMove = allPossibleMoves[i];
            }
        }
    }

    //return best move
    return bestMove;
}

function shuffleArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        let j = Math.floor(Math.random() * arr.length);
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
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
            //seluruh move berjenis place harus ditempat kosong 
            if(board[i][j].stack.length == 0){
                let newMove = "";
                if(!isFirstTurn){//not first move, free to place all stone type
                    if(playerPieceLeft.stone > 0){//jumlah stone untuk flatstone dan wallstone mencukupi
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
    
                    if(playerPieceLeft.capstone > 0){//jumlah capstone mencukupi
                        newMove = {
                            type: "capstone",
                            col: j,
                            row: i,
                            owner: player,
                            moveType: "place",
                        }
                        allPossibleMoves.push(newMove);
                    }
    
    
                }else{// first move, place other player flatstone
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
        return isLegalPlace(board, newMove, isFirstTurn);
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
    if((direction == "up" && row - drops.length < 0) || 
    (direction == "down" && row + drops.length >= board.length) || 
    (direction == "right" && col + drops.length >= board.length) ||
    (direction == "left" && col - drops.length < 0)){
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


function getScoreFromSBE(board, player) {
    let playerScore = 0;
    let otherPlayer = "player";
    if(player == "player"){
        otherPlayer = "enemy";
    }else{
        otherPlayer = "player";
    }
  
    // Hitung SBE untuk setiap konfigurasi board dari possible move
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const cell = board[row][col];

        if(cell.stack.length != 0){
            const pieceOnTop = cell.stack[cell.stack.length-1];
      
            // Adjust scores based on the content of the cell
            if (pieceOnTop.type == "flatstone" && pieceOnTop.owner == player) {
                // Flat Stone controlled by the ai player
                if(row == 0 || row == board.length-1 || col == 0 || col == board[row.length]){//if on the outer layer / edge of the board
                    playerScore += 0.5;                
                }

                //add plus score for connected flatstone
                playerScore += isPieceInGroup(board, row, col, player);

                playerScore += 2;//score for flat stone
            }else if (pieceOnTop.type == "wallstone" && pieceOnTop.owner == player) {
                playerScore += 1; // Standing Stone controlled by the player
            }else if (pieceOnTop.type == "capstone" && pieceOnTop.owner == player && cell.stack.length > 1 && cell.stack[cell.stack.length-2].owner == otherPlayer) {
                playerScore += 10; // Captured other player's piece controlled by the player
            }else if(pieceOnTop.type == "capstone" && pieceOnTop.owner == player && nearEnemyWall(board, otherPlayer, row, col)){//Capstone position near other player's wall
                playerScore += 5;
            }else if(pieceOnTop.type == "capstone" && pieceOnTop.owner == player){
                playerScore += 2;
            }

        }

      }
    }

    //check block for enemy move
    playerScore += blockEnemyRoad(board, player);

    // Check for control of the center 
    if (isCenterControlled(board, player)) {
        playerScore += 5; // Bonus for controlling the center
    }

    //check win condition for ai
    if (checkPlayerRoadComplete(board, player)) {
        playerScore += 300; // Bonus for completing a road
    }
    
    //lose condition for ai when other player complete the road first
    if (checkPlayerRoadComplete(board, otherPlayer)) {
        playerScore -= 300; // lose condition
    }
  

    return playerScore;
}

function isPieceInGroup(board, row, col, player){//jika piece flat stone saling terhubung di arah vertikal dan horizontal
    let plusScore = 0;
    let r = parseInt(row);
    let c = parseInt(col);
    
    //check vertical direction
    if(r - 1 >= 0){

        if(board[r-1][c].stack.length != 0 && board[r-1][c].stack[board[r-1][c].stack.length-1].type == "flatstone" && board[r-1][c].stack[board[r-1][c].stack.length-1].owner == player){
            plusScore += 0.5;
        }
    }
    if(r + 1 < board.length){

        if(board[r+1][c].stack.length != 0 && board[r+1][c].stack[board[r+1][c].stack.length-1].type == "flatstone" && board[r+1][c].stack[board[r+1][c].stack.length-1].owner == player){
            plusScore += 0.5;
        }
    }

    //check horizontal direction
    if(c - 1 >= 0){

        if(board[r][c-1].stack.length != 0 && board[r][c-1].stack[board[r][c-1].stack.length-1].type == "flatstone" && board[r][c-1].stack[board[r][c-1].stack.length-1].owner == player){
            plusScore += 0.5;
        }
    }
    if(c + 1 < board.length){

        if(board[r][c+1].stack.length != 0 && board[r][c+1].stack[board[r][c+1].stack.length-1].type == "flatstone" && board[r][c+1].stack[board[r][c+1].stack.length-1].owner == player){
            plusScore += 0.5;
        }
    }
    return plusScore;
}

function nearEnemyWall(board, otherPlayer, row, col){
    let isNear = false;
    let r = parseInt(row);
    let c = parseInt(col);
    
    //check vertical direction
    if(r - 1 >= 0){
        if(board[r-1][c].stack.length != 0 && board[r-1][c].stack[board[r-1][c].stack.length-1].type == "wallstone" && board[r-1][c].stack[board[r-1][c].stack.length-1].owner == otherPlayer){
            isNear = true;
        }
    }
    if(r + 1 < board.length){
        if(board[r+1][c].stack.length != 0 && board[r+1][c].stack[board[r+1][c].stack.length-1].type == "wallstone" && board[r+1][c].stack[board[r+1][c].stack.length-1].owner == otherPlayer){
            isNear = true;
        }
    }

    //check horizontal direction
    if(c - 1 >= 0){
        if(board[r][c-1].stack.length != 0 && board[r][c-1].stack[board[r][c-1].stack.length-1].type == "wallstone" && board[r][c-1].stack[board[r][c-1].stack.length-1].owner == otherPlayer){
            isNear = true;
        }
    }
    if(c + 1 < board.length){

        if(board[r][c+1].stack.length != 0 && board[r][c+1].stack[board[r][c+1].stack.length-1].type == "wallstone" && board[r][c+1].stack[board[r][c+1].stack.length-1].owner == otherPlayer){
            isNear = true;
        }
    }

    return isNear;
}


// Function to check if the center is controlled by a player
function isCenterControlled(board, player) {
    const centerRow = Math.floor(board.length / 2);
    const centerCol = Math.floor(board[0].length / 2);
    
    if(board[centerRow][centerCol].stack.length != 0){
        return board[centerRow][centerCol].stack[board[centerRow][centerCol].stack.length-1].type == "flatstone" && board[centerRow][centerCol].stack[board[centerRow][centerCol].stack.length-1].owner == player;
    }else{
        return false;
    }
}

function blockEnemyRoad(board, player){
    let score = 0;
    let otherPlayer = "player";
    if(player == "player"){
        otherPlayer = "enemy";
    }else{
        otherPlayer = "player";
    }
    let wallBlock = false;
    //Check Horizontal Road
    for (let row = 0; row < board.length; row++) {
        let roadLength = 0;
        wallBlock = false;
        for (let col = 0; col < board.length; col++) {
            if(board[row][col].stack.length > 0){
                const topStack = board[row][col].stack[board[row][col].stack.length-1];
                if (topStack.type == "flatstone" && topStack.owner == otherPlayer) {
                    roadLength++;
                    if (roadLength == board.length-1 && wallBlock) {
                        // return true;
                        score += 10;
                    }
                }else if(topStack.type == "wallstone" && topStack.owner == player){
                    wallBlock = true;
                    if (roadLength == board.length-1 && wallBlock) {
                        score += 10;
                    }
                } else {
                    roadLength = 0; // Reset the count
                }

            }
        }
    }

    // Check for a vertical road
    for (let col = 0; col < board.length; col++) {
        let roadLength = 0;
        wallBlock = false;
        for (let row = 0; row < board.length; row++) {
            if(board[row][col].stack.length > 0){
                const topStack = board[row][col].stack[board[row][col].stack.length-1];
                if (topStack.type == 'flatstone' && topStack.owner == otherPlayer) {
                    roadLength++;
                    if (roadLength == board.length-1 && wallBlock) {
                        // return true; // Vertical road completed
                        score += 10;
                    }
                } else if(topStack.type == "wallstone" && topStack.owner == player){
                    wallBlock = true;
                    if (roadLength == board.length-1 && wallBlock) {
                        score += 10;
                    }
                } else {
                    roadLength = 0; // Reset the count if the road is broken
                }
            }

        }
        
    }

    return score;
}
  
// Function to check if a road is complete for a player
function isRoadComplete(board, player) {

    //Check Horizontal Road
    for (let row = 0; row < board.length; row++) {
        let roadLength = 0;
        for (let col = 0; col < board.length; col++) {
            if(board[row][col].stack.length > 0){
                const topStack = board[row][col].stack[board[row][col].stack.length-1];
                if (topStack.type == "flatstone" && topStack.owner == player) {
                    roadLength++;
                    if (roadLength >= board.length) {
                        return true; // Horizontal road completed
                    }
                } else {
                    roadLength = 0; // Reset the count if the road is broken
                }

            }
        }
    }

    // Check for a vertical road
    for (let col = 0; col < board.length; col++) {
        let roadLength = 0;
        for (let row = 0; row < board.length; row++) {
            if(board[row][col].stack.length > 0){
                const topStack = board[row][col].stack[board[row][col].stack.length-1];
                if (topStack.type == 'flatstone' && topStack.owner == player) {
                    roadLength++;
                    if (roadLength >= board.length) {
                        return true; // Vertical road completed
                    }
                } else {
                    roadLength = 0; // Reset the count if the road is broken
                }
            }

        }
        
    }

    return false;
}

function checkPlayerRoadComplete(board, player){
    let playerWin = false;
    let boardSize = board.length;
    for (let i = 0; i < board[0].length; i++) {
        let size = parseInt(boardSize);
        let helper = [];
        let status = "top"
        for (let i = 0; i < size; i++) {
          let row = [];
          for (let j = 0; j < size; j++) {
            row.push("uncheck");
          }
          helper.push(row);
        }
        if (board[0][i].stack.length > 0) {
          if (playerWin == true) {
            return true;//road is complete
          }
          playerWin = backtrackingPlayer(board, i, 0, helper, status, player);
        }
    }
    
    //lanjut pengecekan horizontal
    if (playerWin == false) {
        
        for (let i = 0; i < board.length; i++) {
            let size = parseInt(boardSize);
            let helper = [];
            let status = "left"
            for (let i = 0; i < size; i++) {
                let row = [];
                for (let j = 0; j < size; j++) {
                    row.push("uncheck");
                }
                helper.push(row);
            }
            if (board[i][0].stack.length > 0) {
                if (playerWin == true) {
                    return true;//road is complete
                }
                playerWin = backtrackingPlayer(board, 0, i, helper, status, player);
            }
        }

    }

    return playerWin;
}
  
function backtrackingPlayer(board, posX, posY, helper, status, player) {
    let boardSize = board.length;
    let checkX = [1, 0, -1, 0];
    let checkY = [0, 1, 0, -1]
    let p = -1;
    if (status == "top" && board[posY][posX].stack[board[posY][posX].stack.length - 1].owner == player) {
      do {
        p++;
        let deltaX = posX + checkX[p];
        let deltaY = posY + checkY[p];
        if ((deltaX >= 0 && deltaX < parseInt(boardSize) && deltaY >= 0 && deltaY < parseInt(boardSize)) && helper[deltaY][deltaX] == "uncheck") {
          if (board[deltaY][deltaX].stack.length > 0) {
            if (board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].owner == "player" && (board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].type == "flatstone" || board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].type == "capstone")) {
              if (deltaY == parseInt(boardSize) - 1) {
                // setPlayerwin(true);
                // return;
                return true;
              }
              helper[posY][posX] = "checked";
              backtrackingPlayer(board, deltaX, deltaY, helper, status, player);
            }
          }
        }
      } while (p < 3);
    } else if (status == "left" && board[posY][posX].stack[board[posY][posX].stack.length - 1].owner == player) {
      do {
        p++;
        let deltaX = posX + checkX[p];
        let deltaY = posY + checkY[p];
        if ((deltaX >= 0 && deltaX < parseInt(boardSize) && deltaY >= 0 && deltaY < parseInt(boardSize)) && helper[deltaY][deltaX] == "uncheck") {
          if (board[deltaY][deltaX].stack.length > 0) {
            if (board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].owner == "player" && (board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].type == "flatstone" || board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].type == "capstone")) {
              if (deltaX == parseInt(boardSize) - 1) {
                // setPlayerwin(true);
                // return;
                return true;
              }
              helper[posY][posX] = "checked";
              backtrackingPlayer(board, deltaX, deltaY, helper, status, player);
            }
          }
        }
      } while (p < 3);
    }
}



export default {getNextMove};
