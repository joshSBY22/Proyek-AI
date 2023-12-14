import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'

// {type: "piece", owner: "enemy"} -->piece type

function App() {

  const [board, setBoard] = useState([]);
  const [boardSize, setBoardSize] = useState(4);
  const [turn, setTurn] = useState("player");
  const [selectedCell, setSelectedCell] = useState("");
  const [selectedTargetCell, setSelectedTargetCell] = useState("");

  const [selectedStone, setSelectedStone] = useState("flatstone");
  const [capstoneAvailable, setCapstoneAvailable] = useState(0);
  const [stoneAvailable, setStoneAvailable] = useState(0);
  
  const [enemySelectedStone, setEnemySelectedStone] = useState("flatstone");
  const [enemyCapstoneAvailable, setEnemyCapstoneAvailable] = useState(0);
  const [enemyStoneAvailable, setEnemyStoneAvailable] = useState(0);

  useEffect(()=>{
    setBoard([...board]);
  },[selectedCell, selectedTargetCell]);

  function initBoard(){
    let size = parseInt(boardSize);
    let newBoard = [];
    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        row.push({
          col: j,
          row: i,
          stack: []  
          // stack: [{type: "piece", owner: "enemy"}, {type: "piece", owner: "player"}]  
        });
      }
      newBoard.push(row);
    }
    setBoard(newBoard);

    //initialize stone
    if(size == 4){
      setStoneAvailable(15);
      setCapstoneAvailable(0);
      
      setEnemyStoneAvailable(15);
      setEnemyCapstoneAvailable(0);
    }else if(size == 5){
      setStoneAvailable(21);
      setCapstoneAvailable(1);

      setEnemyStoneAvailable(21);
      setEnemyCapstoneAvailable(1);
    }else if(size == 6){
      setStoneAvailable(30);
      setCapstoneAvailable(1);

      setEnemyStoneAvailable(30);
      setEnemyCapstoneAvailable(1);
    }else if(size == 7){
      setStoneAvailable(40);
      setCapstoneAvailable(2);

      setEnemyStoneAvailable(40);
      setEnemyCapstoneAvailable(2);
    }else if(size == 8){
      setStoneAvailable(50);
      setCapstoneAvailable(2);

      setEnemyStoneAvailable(50);
      setEnemyCapstoneAvailable(2);
    }
  }

  function nextTurn(){
    if(turn == "player"){
      setTurn("enemy");
    }else{
      setTurn("player");
    }
  }

  function resetSelected(){
    setSelectedCell("");
    setSelectedTargetCell("");
  }

  function isMoveStackValid(colStart, rowStart, colTarget, rowTarget){
    if(Math.abs(rowStart-rowTarget) > 1 || Math.abs(colStart-colTarget) > 1){
      alert("invalid move");
      return false; //move more than 1 tile distance
    }else if(Math.abs(rowStart-rowTarget) == 1 && Math.abs(colStart-colTarget) == 1){//cross move
      alert("invalid move");
      return false;
    }else{
      // alert("ok");
      return true;
    }
  }

  function isStackControlled(col, row, player){
    if(board[row][col].stack.length > 0){
      if(board[row][col].stack[board[row][col].stack.length-1].owner == player){
        return true;
      }else{
        alert("stack tidak di dalam kontrol");
        return false;
      }
    }else{
      alert("Cell kosong");
      return false; //empty cell
    }
  }

  function moveSinglePiece(colStart, rowStart, colTarget, rowTarget){
    let piece = board[rowStart][colStart].stack[0];
    
    //flatten first before add 
    if(board[rowTarget][colTarget].stack.length > 0){//memastikan target single piece yang dicek tidak kosong untuk mencegah error
      if(board[rowTarget][colTarget].stack[board[rowTarget][colTarget].stack.length-1].type == "wallstone" && selectedStone == "capstone" || enemySelectedStone == "capstone"){
        //flatten wall when capstone is put on the wall
        board[rowTarget][colTarget].stack[board[rowTarget][colTarget].stack.length-1].type = "flatstone";
      }
    }
    // alert(JSON.stringify(piece));
    //add new piece to the top of stack
    board[rowStart][colStart].stack.splice(0,1);
    board[rowTarget][colTarget].stack.push(piece);
  }

  function moveStackOfPiece(colStart, rowStart, colTarget, rowTarget){
    let jumlah = 0;
    if(Math.abs(colTarget-colStart) == 1){//horizontal stack move
      if(colTarget > colStart){
        //============== to right ===============
        alert("right");
        //move stack to variable to hold the stack
        let holdStack = board[rowStart][colStart].stack;
        board[rowStart][colStart].stack = [];

        for (let i = 0; i < boardSize-colStart; i++) {
          jumlah = prompt("Berapa piece yang diletakkan?", 1);
          let jum = parseInt(jumlah);
          let currentCol = colStart+i;
          let currentRow = rowStart;

          if(currentCol+1 > boardSize-1){//di bagian paling kanan papan
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }
          //masih eksperimen (case ada capstone ditop of stack dan top stack of next cell adalah wallstone belum jadi untuk 4 arah move & pengecekan walstone dan capstone gagal karena masih bisa ditumpuk sembarang piece baru) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          if((board[currentRow][currentCol+1].stack[board[currentRow][currentCol+1].stack.length-1] == "wallstone" && holdStack[holdStack.length-1].type != "capstone") || board[currentRow][currentCol+1].stack[board[currentRow][currentCol+1].stack.length-1] == "capstone"){//jika sebelahnya ada stack yang tidak bisa ditumpuki dan bukan case stack mengandung capstone dan sebelahnya wall

            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }else if(jum == holdStack.length){//all pieces left are moved
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }else if(board[currentRow][currentCol+1].stack[board[currentRow][currentCol+1].stack.length-1] == "wallstone" && holdStack[holdStack.length-1].type == "capstone"){//jika top of stack adalah capstone dan top of next stack adalah wall
            if(jumlah < holdStack.length){
              //letakan piece semua piece kecuali cap di current cell
              for (let j = 0; j < holdStack.length-1; j++) {
                board[currentRow][currentCol].stack.push(holdStack[j]);
              }

              //letakan capstone di piece terakhir ke next cellnya
              board[currentRow][currentCol+1].stack[board[currentRow][currentCol+1].stack.length-1].type == "flatstone";
              board[currentRow][currentCol+1].stack.push(holdStack[0]);
              break;
            }
          
          }
          //jika masih valid untuk mendrop piece
          for (let j = 0; j < jum; j++) {//drop piece sesuai jumlah
            board[currentRow][currentCol].stack.push(holdStack[0]); 
            holdStack.splice(0, 1);//hapus dari paling bawah
          }
          
        }

      }else{//to left
        //============== to left ===============
        alert("left");
        //move stack to variable to hold the stack
        let holdStack = board[rowStart][colStart].stack;
        board[rowStart][colStart].stack = [];

        for (let i = 0; i < colStart+1; i++) {
          jumlah = prompt("Berapa piece yang diletakkan?", 1);
          let jum = parseInt(jumlah);
          let currentCol = colStart-i;
          let currentRow = rowStart;

          if(currentCol-1 < 0){//di bagian paling kiri papan
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }
          if(board[currentRow][currentCol-1].stack[board[currentRow][currentCol-1].stack.length-1] == "wallstone" || board[currentRow][currentCol-1].stack[board[currentRow][currentCol-1].stack.length-1] == "capstone"){//jika sebelahnya ada stack yang tidak bisa ditumpuki
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }else if(jum == holdStack.length){//all pieces left are moved
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }
          //jika masih valid untuk mendrop piece
          for (let j = 0; j < jum; j++) {//drop piece sesuai jumlah
            board[currentRow][currentCol].stack.push(holdStack[0]); 
            holdStack.splice(0, 1);//hapus dari paling bawah
          }  
        }

      }

    }else{//vertical stack move
      if(rowTarget > rowStart){// to down
        //============== to down ===============
        alert("down");
        //move stack to variable to hold the stack
        let holdStack = board[rowStart][colStart].stack;
        board[rowStart][colStart].stack = [];

        for (let i = 0; i < boardSize - rowStart; i++) {
          jumlah = prompt("Berapa piece yang diletakkan?", 1);
          let jum = parseInt(jumlah);
          let currentCol = colStart;
          let currentRow = rowStart+i;

          if(currentRow+1 > boardSize-1){//di bagian paling bawah papan
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }
          if(board[currentRow+1][currentCol].stack[board[currentRow+1][currentCol].stack.length-1] == "wallstone" || board[currentRow+1][currentCol].stack[board[currentRow+1][currentCol].stack.length-1] == "capstone"){//jika bawahnya ada stack yang tidak bisa ditumpuki
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }else if(jum == holdStack.length){//all pieces left are moved
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }
          //jika masih valid untuk mendrop piece
          for (let j = 0; j < jum; j++) {//drop piece sesuai jumlah
            board[currentRow][currentCol].stack.push(holdStack[0]); 
            holdStack.splice(0, 1);//hapus dari paling bawah
          }
          
        }

      }else{//going up
        //============== to up ===============
        alert("up");
        //move stack to variable to hold the stack
        let holdStack = board[rowStart][colStart].stack;
        board[rowStart][colStart].stack = [];

        for (let i = 0; i < rowStart+1; i++) {
          jumlah = prompt("Berapa piece yang diletakkan?", 1);
          let jum = parseInt(jumlah);
          let currentCol = colStart;
          let currentRow = rowStart-i;

          if(currentRow-1 < 0){//di bagian paling atas papan
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }
          if(board[currentRow-1][currentCol].stack[board[currentRow-1][currentCol].stack.length-1] == "wallstone" || board[currentRow-1][currentCol].stack[board[currentRow-1][currentCol].stack.length-1] == "capstone"){//jika sebelahnya ada stack yang tidak bisa ditumpuki
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }else if(jum == holdStack.length){//all pieces left are moved
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }
          //jika masih valid untuk mendrop piece
          for (let j = 0; j < jum; j++) {//drop piece sesuai jumlah
            board[currentRow][currentCol].stack.push(holdStack[0]); 
            holdStack.splice(0, 1);//hapus dari paling bawah
          }  
        }

      }
    }    

  }

  function isMoveSingleValid(colStart, rowStart, colTarget, rowTarget){
    let piece = board[rowStart][colStart].stack[0];
    let topTargetPiece = board[rowTarget][colTarget].stack[board[rowTarget][colTarget].stack.length-1];
    if(board[rowTarget][colTarget].stack.length == 0){//move ke cell kosong
      return true;
    }
    if(piece.type == "flatstone"){
      if(topTargetPiece.type == "flatstone"){//flatstone hanya bisa dipindah ke atas flatstone lain tidak peduli warna
        return true;
      }else{
        alert("invalid move");
        return false;
      }
    }else if(piece.type == "wallstone"){
      if(topTargetPiece.type == "flatstone"){//wall juga hanya bisa dipindah ke atas flatstone tidak bisa diatas wall atau capstone
        return true;
      }else{
        alert("invalid move");
        return false;
      }
    }else{//piece capstone
      if(topTargetPiece.type != "capstone"){//capstone bisa dipindah ke atas segala jenis kecuali sesama capstone 
        return true;
      }else{
        alert("invalid move");
        return false;
      }
    }
  }

  function move(){
    if(selectedCell.row == selectedTargetCell.row && selectedCell.col == selectedTargetCell.col){//put new stone move
      if(isPutStoneValid(selectedCell.col, selectedCell.row)){
        if(selectedStone == "flatstone" || selectedStone == "wallstone"){
          if(stoneAvailable >= 1){
            // console.log("masuk");
            putNewStone(selectedCell.col, selectedCell.row, selectedStone);
            setStoneAvailable(stoneAvailable-1);//kurangi jumlah stone yg sudah dipakai
            nextTurn();
          }else{
            alert(selectedStone+ " tidak cukup");
            resetSelected();
          }
        }else if(selectedStone == "capstone"){
          if(capstoneAvailable >= 1){
            putNewStone(selectedCell.col, selectedCell.row, selectedStone);
            setCapstoneAvailable(capstoneAvailable-1);
            nextTurn();
          }else{
            alert(selectedStone+ " tidak cukup");
            resetSelected();
          }
        }
      }else{//move tidak valid
        resetSelected();
      }
      
    }else{//moving existing stone
      if(isStackControlled(selectedCell.col, selectedCell.row, turn) && isMoveStackValid(selectedCell.col, selectedCell.row, selectedTargetCell.col, selectedTargetCell.row)){
        if(board[selectedCell.row][selectedCell.col].stack.length == 1 && isMoveSingleValid(selectedCell.col, selectedCell.row, selectedTargetCell.col, selectedTargetCell.row)){//moving stack with single piece only
          moveSinglePiece(selectedCell.col, selectedCell.row, selectedTargetCell.col, selectedTargetCell.row);
          nextTurn();
        }else if(board[selectedCell.row][selectedCell.col].stack.length > 1){//move stack with multiple piece
          moveStackOfPiece(selectedCell.col, selectedCell.row, selectedTargetCell.col, selectedTargetCell.row);
          nextTurn();
        }
        resetSelected();
      }else{
        resetSelected();
      }
    }
  }

  function enemyMove(){
    if(selectedCell.row == selectedTargetCell.row && selectedCell.col == selectedTargetCell.col){//put new stone move
      if(isPutStoneValid(selectedCell.col, selectedCell.row)){
        if(enemySelectedStone == "flatstone" || enemySelectedStone == "wallstone"){
          if(enemyStoneAvailable >= 1){
            putNewStone(selectedCell.col, selectedCell.row, enemySelectedStone);
            setEnemyStoneAvailable(enemyStoneAvailable-1);//kurangi jumlah stone yg sudah dipakai
            nextTurn();
          }else{
            alert(enemySelectedStone+" tidak cukup");
            resetSelected();
          }
        }else if(enemySelectedStone == "capstone"){
          if(enemyCapstoneAvailable >= 1){
            putNewStone(selectedCell.col, selectedCell.row, enemySelectedStone);
            setEnemyCapstoneAvailable(enemyCapstoneAvailable-1);
            nextTurn();
          }else{
            alert(enemySelectedStone+ " tidak cukup");
            resetSelected();
          }
        }
      }else{//move tidak valid
        resetSelected();
      }
      
    }else{//moving existing stone
      if(isStackControlled(selectedCell.col, selectedCell.row, turn) && isMoveStackValid(selectedCell.col, selectedCell.row, selectedTargetCell.col, selectedTargetCell.row)){
        if(board[selectedCell.row][selectedCell.col].stack.length == 1 && isMoveSingleValid(selectedCell.col, selectedCell.row, selectedTargetCell.col, selectedTargetCell.row)){//moving stack with single piece only
          moveSinglePiece(selectedCell.col, selectedCell.row, selectedTargetCell.col, selectedTargetCell.row);
          nextTurn();
        }else if(board[selectedCell.row][selectedCell.col].stack.length > 1){//move stack with multiple piece
          moveStackOfPiece(selectedCell.col, selectedCell.row, selectedTargetCell.col, selectedTargetCell.row);
          nextTurn();
        }
        resetSelected();
      }else{
        resetSelected();
      }
    }
  }

  function isPutStoneValid(col, row){
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if(board[i][j].col == col && board[i][j].row == row){
          if(board[i][j].stack.length == 0){//kotak masih kosong
            // console.log("empty");
            return true;//valid
          }else{
            alert("Menaruh stone hanya bisa dicell kosong");
            return false;
            // let piece = board[i][j].stack[board[i][j].stack.length-1];//cek top of stack
            // if(piece.owner == turn){
            //   // console.log("Tidak bisa menaruh diatas stone sendiri");
            //   alert("Tidak bisa menaruh diatas stone sendiri");
            //   return false;
            // }
            // //jika diatas stone musuh
            // if(piece.type == "capstone"){
            //   alert("Tidak bisa menaruh diatas capstone");
            //   // console.log("Tidak bisa menaruh diatas capstone");
            //   return false;
            // }else if(piece.type == "wallstone"){
            //   if(turn == "player"){//cek jika yang ingin ditaruh adalah capstone
            //     if(selectedStone == "capstone"){
            //       return true;//valid
            //     }
            //   }else if(turn == "enemy"){
            //     if(enemySelectedStone == "capstone"){
            //       return true;
            //     }
            //   }
            //   alert("Tidak bisa menaruh diatas wall");
            //   // console.log("Tidak bisa menaruh diatas wall");
            //   return false;
            // }else{//musuh hanya flatstone
            //   return true;
            // }
              
          }
        }
        
      }
    }
  }
  
  function putNewStone(col, row, type){
    let newStone = {
      type: type,
      owner: turn,
    }
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if(board[i][j].col == col && board[i][j].row == row){
          // if(board[i][j].stack.length != 0){
          //   if(board[i][j].stack[board[i][j].stack.length-1].type == "wallstone" && selectedStone == "capstone" || enemySelectedStone == "capstone"){
          //     //flatten wall when capstone is put on the wall
          //     board[i][j].stack[board[i][j].stack.length-1].type = "flatstone";
          //   }
          // }
          board[i][j].stack.push(newStone);
          break;
        }
        
      }
    }

    setBoard([...board]);
    resetSelected();
    console.log("put new stone");
  }
  

  return (
    <>
      <h1 className='text-center'>Tak</h1>
      <div className="container-fluid">
        <div className="row d-flex justify-content-between">
          <div className="col-md-3">
            <input type="number" name="ukuran" id="ukuran" defaultValue={4} onChange={()=>{
              setBoardSize(document.getElementById('ukuran').value);
            }} min={3} max={6}/>
            <button onClick={initBoard}>Generate Board</button>
          </div>
          <div className="col-md-2">
            Selected: {selectedCell.row},{selectedCell.col}
          </div>
          <div className="col-md-2">
            Target: {selectedTargetCell.row},{selectedTargetCell.col}
          </div>
          <div className="col-md-2">
            Turn: {turn}
          </div>
        </div>

        {/* game board */}
        <div className="papan" style={{ minHeight: "250px"}}>
          {
            board.map((row, rowIdx)=>(//row
              <div className="row d-flex justify-content-start m-0" key={rowIdx}>
                {row.map((cell, cellIdx)=>(//per cell
                  <div className="kotak" key={cellIdx} style={{ backgroundColor: (selectedCell.col == cellIdx) && (selectedCell.row == rowIdx) ? "lightgreen":""}}  onClick={
                    ()=>{
                      if(selectedCell != "" && selectedTargetCell != ""){//confirm move
                        // setTimeout(()=>{}, 500);
                        if(turn == "player"){
                          move();
                        }else{
                          enemyMove();
                        }
                      }else if(selectedCell != ""){//jika sudah pilih current selected cell
                        setSelectedTargetCell(cell);
                      }else{
                        setSelectedCell(cell);
                      }
                    }
                  }>
                    {cell.stack.map((item, idx)=>(
                      <div className="" style={{ backgroundColor: (item.owner == "player" ? "green" : "red") }} width="40px" height="40px" key={idx}>
                        {idx}-{item.owner}-{item.type.substr(0, 1)} 
                      </div>
                    ))}
                  </div>
                ))}
              </div>
                
            ))
          }
    
        </div>
        <div className="row" id='userPiece'>
          <div className="col-md-3 d-flex justify-content-between">
            <button onClick={()=>{
              setSelectedStone("capstone");
            }}>Capstone Available:{capstoneAvailable}</button>
            <button onClick={()=>{
              setSelectedStone("flatstone");
            }}>Flat Stone Available:{stoneAvailable}</button>
            <button onClick={()=>{
              setSelectedStone("wallstone");
            }}>Wall Stone Available:{stoneAvailable}</button>
          </div>
          <div className="col-md-3">
            <div className="">Selected: {selectedStone}</div>
          </div>
        </div>

        <div className="row" id='enemyPiece'>
          <div className="col-md-3 d-flex justify-content-between">
            <button onClick={()=>{
              setEnemySelectedStone("capstone");
            }}>Capstone Available:{enemyCapstoneAvailable}</button>
            <button onClick={()=>{
              setEnemySelectedStone("flatstone");
            }}>Flat Stone Available:{enemyStoneAvailable}</button>
            <button onClick={()=>{
              setEnemySelectedStone("wallstone");
            }}>Wall Stone Available:{enemyStoneAvailable}</button>
          </div>
          <div className="col-md-3">
            <div className="">Enemy Selected: {enemySelectedStone}</div>
          </div>
        </div>
        <div className="row ps-2">
          <button onClick={resetSelected} style={{ width: "100px" }}>Cancel Select</button>
        </div>

      </div>
    </>
  )
}

export default App
