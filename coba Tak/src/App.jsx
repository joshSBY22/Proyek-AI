import { useEffect, useState } from 'react'
import PlayerAi from './PlayerAi';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

const { getNextMove } = PlayerAi;

// import './App.css'

// {type: "piece", owner: "enemy"} -->piece type

function App() {

  const [board, setBoard] = useState([]);
  const [boardSize, setBoardSize] = useState(3);
  const [turn, setTurn] = useState("player");
  const [selectedCell, setSelectedCell] = useState("");
  const [selectedTargetCell, setSelectedTargetCell] = useState("");

  const [posCheck, setPoscheck] = useState("top");
  const [checkY, setY] = useState([0, 1, 0, -1]);
  const [checkX, setX] = useState([1, 0, -1, 0]);
  const [playerWin, setPlayerwin] = useState(false);
  const [enemyWin, setEnemywin] = useState(false);

  const [selectedStone, setSelectedStone] = useState("flatstone");
  const [capstoneAvailable, setCapstoneAvailable] = useState(0);
  const [stoneAvailable, setStoneAvailable] = useState(0);

  const [enemySelectedStone, setEnemySelectedStone] = useState("flatstone");
  const [enemyCapstoneAvailable, setEnemyCapstoneAvailable] = useState(0);
  const [enemyStoneAvailable, setEnemyStoneAvailable] = useState(0);

  const [userInitial, setUserInitial] = useState(0);
  const [enemyInitial, setEnemyInitial] = useState(0);

  const [tempMove, setTempMove] = useState("");
  useEffect(() => {
    setBoard([...board]);
  }, [selectedCell, selectedTargetCell]);

  function initBoard() {
    let size = parseInt(boardSize);
    let newBoard = [];
    /*
      misal newBoard[0]={
        row[0]
      }
    */
    for (let i = 0; i < size; i++) {
      let row = []; //berisi banyak col
      /* 
        misal row[0]={
          {...}, {...},{...},{...}
        }
      */
      for (let j = 0; j < size; j++) {
        row.push({
          col: j, //koordinat y
          row: i, //koordinat x
          stack: []
          // stack: [{type: "piece", owner: "enemy"}, {type: "piece", owner: "player"}]  
        });
      }
      newBoard.push(row);
    }
    setBoard(newBoard);

    //initialize stone
    if (size == 3) {
      setStoneAvailable(10);
      setCapstoneAvailable(0);

      setEnemyStoneAvailable(10);
      setEnemyCapstoneAvailable(0);
    } else if (size == 4) {
      setStoneAvailable(15);
      setCapstoneAvailable(0);

      setEnemyStoneAvailable(15);
      setEnemyCapstoneAvailable(0);
    } else if (size == 5) {
      setStoneAvailable(21);
      setCapstoneAvailable(1);

      setEnemyStoneAvailable(21);
      setEnemyCapstoneAvailable(1);
    } else if (size == 6) {
      setStoneAvailable(30);
      setCapstoneAvailable(1);

      setEnemyStoneAvailable(30);
      setEnemyCapstoneAvailable(1);
    } else if (size == 7) {
      setStoneAvailable(40);
      setCapstoneAvailable(2);

      setEnemyStoneAvailable(40);
      setEnemyCapstoneAvailable(2);
    } else if (size == 8) {
      setStoneAvailable(50);
      setCapstoneAvailable(2);

      setEnemyStoneAvailable(50);
      setEnemyCapstoneAvailable(2);
    }
  }

  function nextTurn() {
    if (turn == "player") {
      setTurn("enemy");

    } else {
      setTurn("player");
    }
  }

  function resetSelected() {
    setSelectedCell("");
    setSelectedTargetCell("");
  }

  function isMoveStackValid(colStart, rowStart, colTarget, rowTarget) {
    if (Math.abs(rowStart - rowTarget) > 1 || Math.abs(colStart - colTarget) > 1) {
      alert("invalid move");
      return false; //move more than 1 tile distance
    } else if (Math.abs(rowStart - rowTarget) == 1 && Math.abs(colStart - colTarget) == 1) {//cross move
      alert("invalid move");
      return false;
    } else {
      // alert("ok");
      return true;
    }
  }

  function isStackControlled(col, row, player) {
    if (board[row][col].stack.length > 0) {
      if (board[row][col].stack[board[row][col].stack.length - 1].owner == player) {
        return true;
      } else {
        alert("stack tidak di dalam kontrol");
        return false;
      }
    } else {
      alert("Cell kosong");
      return false; //empty cell
    }
  }

  function moveSinglePiece(colStart, rowStart, colTarget, rowTarget) {
    if (userInitial == 1 && enemyInitial == 1) {//if both user and enemy has already done their initial move
      let piece = board[rowStart][colStart].stack[0];

      //flatten first before add 
      if (board[rowTarget][colTarget].stack.length > 0) {//memastikan target single piece yang dicek tidak kosong untuk mencegah error

        console.log(board[rowStart][colStart].stack[0].type);
        if (board[rowTarget][colTarget].stack[board[rowTarget][colTarget].stack.length - 1].type == "wallstone" && piece.type == "capstone") {
          //flatten wall when capstone is put on the wall
          board[rowTarget][colTarget].stack[board[rowTarget][colTarget].stack.length - 1].type = "flatstone";
        }
      }
      // alert(JSON.stringify(piece));
      //add new piece to the top of stack
      board[rowStart][colStart].stack.splice(0, 1);
      board[rowTarget][colTarget].stack.push(piece);
    }
  }

  function moveStackOfPiece(colStart, rowStart, colTarget, rowTarget, valid) {
    let jumlah = 0;
    if (Math.abs(colTarget - colStart) == 1) {//horizontal stack move
      if (colTarget > colStart) {
        //============== to right ===============
        alert("right");
        //condition if 
        //1. target cell is not empty and the top stack of target cell is a capstone
        //2. target cell is not empty and (the top stack of target cell is a wallstone and top stack of current cell is not capstone) 
        if (board[rowStart][colStart + 1].stack.length != 0 && (board[rowStart][colStart + 1].stack[board[rowStart][colStart + 1].stack.length - 1].type == "capstone" || (board[rowStart][colStart + 1].stack[board[rowStart][colStart + 1].stack.length - 1].type == "wallstone" && board[rowStart][colStart].stack[board[rowStart][colStart].stack.length - 1].type != "capstone"))) {
          valid.value = false; //invalid move
        }

        //move stack to variable to hold the stack
        let holdStack = board[rowStart][colStart].stack;
        board[rowStart][colStart].stack = [];
        for (let i = 0; i < boardSize - colStart; i++) {
          let validInput = true;
          do {
            jumlah = prompt("Berapa piece yang diletakkan?", 1);
            if (parseInt(jumlah) < 0) {
              validInput = false;
              alert("Jumlah tidak valid");
            } else if (i > 0 && parseInt(jumlah) < 1) {//jika bukan prompt pertama minimal harus drop satu (hanya prompt pertama yang boleh diisi 0)
              validInput = false;
              alert("Jumlah Piece yang diletakan minimal 1");
            } else if (parseInt(jumlah) > holdStack.length) {//jika jumlah yang diinputkan melebihi jumlah yang ada di holdstack
              validInput = false;
              alert("Jumlah Piece tidak mencukupi");
            } else {
              validInput = true;
            }
          } while (!validInput);
          let jum = parseInt(jumlah);
          let currentCol = colStart + i;
          let currentRow = rowStart;

          // console.log(currentCol+" "+currentRow);
          // console.log(board[currentRow][currentCol].stack);
          if (currentCol + 1 > boardSize - 1) {//di bagian paling kanan papan
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);//cancel move, return stack from holdStack to board
            }
            break;
          }

          //masih eksperimen (case ada capstone ditop of stack dan top stack of next cell adalah wallstone belum jadi untuk 4 arah move & pengecekan walstone dan capstone gagal karena masih bisa ditumpuk sembarang piece baru) 
          //1. top of next stack = wallstone AND top of current stack != capstone
          //2. top of next stack = capstone 
          //invalid condition
          if (board[currentRow][currentCol + 1].stack.length != 0 &&
            (
              (board[currentRow][currentCol + 1].stack[board[currentRow][currentCol + 1].stack.length - 1].type == "wallstone" && holdStack[holdStack.length - 1].type != "capstone")
              ||
              board[currentRow][currentCol + 1].stack[board[currentRow][currentCol + 1].stack.length - 1].type == "capstone")) {//jika sebelahnya ada stack yang tidak bisa ditumpuki dan bukan case stack mengandung capstone dan sebelahnya wall

            if (i == 1) {//jika pertama kali stack dipindah, gerakan dibatalkan
              valid.value = false;
              for (let j = 0; j < holdStack.length; j++) {
                board[currentRow][currentCol - 1].stack.push(holdStack[j]);
              }
            } else {
              //move the stack that's being hold in holdStack back to board[][]
              for (let j = 0; j < holdStack.length; j++) {
                board[currentRow][currentCol].stack.push(holdStack[j]);
              }
            }
            break;

          } else if (jum == holdStack.length) {//all pieces left are moved

            if (holdStack.length == 1) {//last piece to put
              if (holdStack[0].type == "capstone") {//last piece is capstone
                if (board[currentRow][currentCol].stack.length == 0) {//jika current target kosong
                  board[currentRow][currentCol].stack.push(holdStack[0]);
                } else if (board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type == "wallstone") {//jika top of target adalah wall maka diratakan jadi flat
                  board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type = "flatstone";
                  board[currentRow][currentCol].stack.push(holdStack[0]);
                } else {//top of target flat stone
                  board[currentRow][currentCol].stack.push(holdStack[0]);
                }

              } else {//last piece is a wallstone
                board[currentRow][currentCol].stack.push(holdStack[0]);
              }

            } else {//sisa piece lebih dari satu
              if (board[currentRow][currentCol].stack.length == 0) {//current empty
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow][currentCol].stack.push(holdStack[j]);
                }
              } else if (board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type == "wallstone") {//kembalikan ke sebelumnya
                //current cell's top stack is a wallstone
                if (i == 1) {
                  valid.value = false;
                }
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow][currentCol - 1].stack.push(holdStack[j]);
                }
              } else {//top of current flat
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow][currentCol].stack.push(holdStack[j]);
                }
              }

            }
            break;

          } else if (board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1] == "wallstone") {//jika top of current stack adalah wallstone
            if (i == 1) {
              valid.value = false;
            }
            //kembalikan posisi semula
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol - 1].stack.push(holdStack[j]);
            }
            resetSelected();
            break;
          } else { //top stack is not a wallstone
            //jika masih valid untuk mendrop piece
            //cek apakah stack target yang akan ditumpuk boleh didrop
            //jika stack target kosong berarti valid
            //jika stack target tidak kosong tetapi top adalah flat maka valid
            //jika stack target ada isinya dan topnya bukan flat maka tidak valid 
            if (board[currentRow][currentCol].stack.length != 0 && board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type != "flatstone") {
              if (i == 1) {//gerakan kedua sejak peletakan pertama, batalkan move dan turn tetap
                valid.value = false;
                //kembalikan posisi semula
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow][currentCol - 1].stack.push(holdStack[j]);
                }
                resetSelected();
                break;
              } else {//sudah diatas 2 kali meletakan stack, sisa stack diletakan ke cell sebelumnya, turn berganti
                //drop semua stack yang tersisa
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow][currentCol - 1].stack.push(holdStack[j]);
                }
                resetSelected();
                break;
              }

            } else { //valid to drop
              for (let j = 0; j < jum; j++) {//drop piece sesuai jumlah
                board[currentRow][currentCol].stack.push(holdStack[0]);
                holdStack.splice(0, 1);//hapus dari paling bawah (index 0)
              }
            }

          }

        }

      } else {//to left
        //============== to left ===============
        alert("left");

        if (board[rowStart][colStart - 1].stack.length != 0 && (board[rowStart][colStart - 1].stack[board[rowStart][colStart - 1].stack.length - 1].type == "capstone"
          ||
          (board[rowStart][colStart - 1].stack[board[rowStart][colStart - 1].stack.length - 1].type == "wallstone" && board[rowStart][colStart].stack[board[rowStart][colStart].stack.length - 1].type != "capstone"))) {
          valid.value = false;
        }
        //move stack to variable to hold the stack
        let holdStack = board[rowStart][colStart].stack;
        board[rowStart][colStart].stack = [];

        for (let i = 0; i < colStart + 1; i++) {
          let validInput = true;
          do { //input validation
            jumlah = prompt("Berapa piece yang diletakkan?", 1);
            if (parseInt(jumlah) < 0) {
              validInput = false;
              alert("Jumlah tidak valid");
            } else if (i > 0 && parseInt(jumlah) < 1) {//jika bukan prompt pertama minimal harus drop satu (hanya prompt pertama yang boleh diisi 0)
              validInput = false;
              alert("Jumlah Piece yang diletakan minimal 1");
            } else if (parseInt(jumlah) > holdStack.length) {//jika jumlah yang diinputkan melebihi jumlah yang ada di holdstack
              validInput = false;
              alert("Jumlah Piece tidak mencukupi");
            } else {
              validInput = true;
            }
          } while (!validInput);

          let jum = parseInt(jumlah);
          let currentCol = colStart - i;
          let currentRow = rowStart;
          if (currentCol - 1 < 0) {//di bagian paling kiri papan
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }
          if (board[currentRow][currentCol - 1].stack.length != 0 &&
            (
              (board[currentRow][currentCol - 1].stack[board[currentRow][currentCol - 1].stack.length - 1].type == "wallstone" && holdStack[holdStack.length - 1].type != "capstone")
              ||
              board[currentRow][currentCol - 1].stack[board[currentRow][currentCol - 1].stack.length - 1].type == "capstone"
            )) {//jika sebelahnya ada stack yang tidak bisa ditumpuki               
            if (i == 1) {//jika pertama kali stack dipindah, gerakan dibatalkan
              valid.value = false;
              for (let j = 0; j < holdStack.length; j++) {
                board[currentRow][currentCol + 1].stack.push(holdStack[j]);
              }
            } else {
              //move the stack that's being hold in holdStack back to board[][]
              for (let j = 0; j < holdStack.length; j++) {
                board[currentRow][currentCol].stack.push(holdStack[j]);
              }
            }
            break;
          } else if (jum == holdStack.length) { //all pieces left are moved      
            if (holdStack.length == 1) {//last piece to put
              if (holdStack[0].type == "capstone") {//last piece is capstone
                if (board[currentRow][currentCol].stack.length == 0) {//jika current target kosong
                  board[currentRow][currentCol].stack.push(holdStack[0]);
                } else if (board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type == "wallstone") {//jika top of target adalah wall maka diratakan jadi flat
                  board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type = "flatstone";
                  board[currentRow][currentCol].stack.push(holdStack[0]);
                } else {//top of target flat stone
                  board[currentRow][currentCol].stack.push(holdStack[0]);
                }

              } else {//last piece is a wallstone
                board[currentRow][currentCol].stack.push(holdStack[0]);
              }

            } else {//sisa piece lebih dari satu
              if (board[currentRow][currentCol].stack.length == 0) {//current empty
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow][currentCol].stack.push(holdStack[j]);
                }
              } else if (board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type == "wallstone") {//kembalikan ke sebelumnya
                //current cell's top stack is a wallstone
                if (i == 1) {
                  valid.value = false;
                }
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow][currentCol + 1].stack.push(holdStack[j]);
                }
              } else {//top of current flat
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow][currentCol].stack.push(holdStack[j]);
                }
              }

            }
            break;
            //-----------
            // for (let j = 0; j < holdStack.length; j++) {
            //   board[currentRow][currentCol].stack.push(holdStack[j]);
            // }
            // break;
          } else {//top of stack not a wallstone

            if (board[currentRow][currentCol].stack.length != 0 && board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type != "flatstone") {
              if (i == 1) {//gerakan kedua sejak peletakan pertama, batalkan move dan turn tetap
                valid.value = false;
                //kembalikan posisi semula
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow][currentCol + 1].stack.push(holdStack[j]);
                }
                resetSelected();
                break;
              } else {//sudah diatas 2 kali meletakan stack, sisa stack diletakan ke cell sebelumnya, turn berganti
                //drop semua stack yang tersisa
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow][currentCol + 1].stack.push(holdStack[j]);
                }
                resetSelected();
                break;
              }

            } else { //valid to drop
              for (let j = 0; j < jum; j++) {//drop piece sesuai jumlah
                board[currentRow][currentCol].stack.push(holdStack[0]);
                holdStack.splice(0, 1);//hapus dari paling bawah (index 0)
              }
            }
          }

        }

      }

    } else {//vertical stack move
      if (rowTarget > rowStart) {// to down
        //============== to down ===============
        alert("down");
        if (board[rowStart + 1][colStart].stack.length != 0 &&
          (board[rowStart + 1][colStart].stack[board[rowStart + 1][colStart].stack.length - 1].type == "capstone"
            ||
            (board[rowStart + 1][colStart].stack[board[rowStart + 1][colStart].stack.length - 1].type == "wallstone" && board[rowStart][colStart].stack[board[rowStart][colStart].stack.length - 1].type != "capstone"))
        ) {
          valid.value = false;
        }

        //move stack to variable to hold the stack
        let holdStack = board[rowStart][colStart].stack;
        board[rowStart][colStart].stack = [];
        for (let i = 0; i < boardSize - rowStart; i++) {
          let validInput = true;
          do { //input validation
            jumlah = prompt("Berapa piece yang diletakkan?", 1);
            if (parseInt(jumlah) < 0) {
              validInput = false;
              alert("Jumlah tidak valid");
            } else if (i > 0 && parseInt(jumlah) < 1) {//jika bukan prompt pertama minimal harus drop satu (hanya prompt pertama yang boleh diisi 0)
              validInput = false;
              alert("Jumlah Piece yang diletakan minimal 1");
            } else if (parseInt(jumlah) > holdStack.length) {//jika jumlah yang diinputkan melebihi jumlah yang ada di holdstack
              validInput = false;
              alert("Jumlah Piece tidak mencukupi");
            } else {
              validInput = true;
            }
          } while (!validInput);

          let jum = parseInt(jumlah);
          let currentCol = colStart;
          let currentRow = rowStart + i;
          if (currentRow + 1 > boardSize - 1) {//di bagian paling bawah papan
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }
          if (board[currentRow + 1][currentCol].stack.length != 0 &&
            (
              (board[currentRow + 1][currentCol].stack[board[currentRow + 1][currentCol].stack.length - 1].type == "wallstone" && holdStack[holdStack.length - 1].type != "capstone")
              ||
              board[currentRow + 1][currentCol].stack[board[currentRow + 1][currentCol].stack.length - 1].type == "capstone"
            )) {//jika sebelahnya ada stack yang tidak bisa ditumpuki               
            if (i == 1) {//jika pertama kali stack dipindah, gerakan dibatalkan
              valid.value = false;
              for (let j = 0; j < holdStack.length; j++) {
                board[currentRow + 1][currentCol].stack.push(holdStack[j]);
              }
            } else {
              //move the stack that's being hold in holdStack back to board[][]
              for (let j = 0; j < holdStack.length; j++) {
                board[currentRow][currentCol].stack.push(holdStack[j]);
              }
            }
            break;
          } else if (jum == holdStack.length) { //all pieces left are moved      
            if (holdStack.length == 1) {//last piece to put
              if (holdStack[0].type == "capstone") {//last piece is capstone
                if (board[currentRow][currentCol].stack.length == 0) {//jika current target kosong
                  board[currentRow][currentCol].stack.push(holdStack[0]);
                } else if (board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type == "wallstone") {//jika top of target adalah wall maka diratakan jadi flat
                  board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type = "flatstone";
                  board[currentRow][currentCol].stack.push(holdStack[0]);
                } else {//top of target flat stone
                  board[currentRow][currentCol].stack.push(holdStack[0]);
                }

              } else {//last piece is a wallstone
                board[currentRow][currentCol].stack.push(holdStack[0]);
              }

            } else {//sisa piece lebih dari satu
              if (board[currentRow][currentCol].stack.length == 0) {//current empty
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow][currentCol].stack.push(holdStack[j]);
                }
              } else if (board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type == "wallstone") {//kembalikan ke sebelumnya
                //current cell's top stack is a wallstone
                if (i == 1) {
                  valid.value = false;
                }
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow - 1][currentCol].stack.push(holdStack[j]);
                }
              } else {//top of current flat
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow][currentCol].stack.push(holdStack[j]);
                }
              }

            }
            break;
          } else {//top of stack not a wallstone
            if (board[currentRow][currentCol].stack.length != 0 && board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type != "flatstone") {
              if (i == 1) {//gerakan kedua sejak peletakan pertama, batalkan move dan turn tetap
                valid.value = false;
                //kembalikan posisi semula
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow - 1][currentCol].stack.push(holdStack[j]);
                }
                resetSelected();
                break;
              } else {//sudah diatas 2 kali meletakan stack, sisa stack diletakan ke cell sebelumnya, turn berganti
                //drop semua stack yang tersisa
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow - 1][currentCol].stack.push(holdStack[j]);
                }
                resetSelected();
                break;
              }

            } else { //valid to drop
              for (let j = 0; j < jum; j++) {//drop piece sesuai jumlah
                board[currentRow][currentCol].stack.push(holdStack[0]);
                holdStack.splice(0, 1);//hapus dari paling bawah (index 0)
              }
            }
          }

        }

      } else {//going up
        //============== to up ===============
        alert("up");
        if (board[rowStart - 1][colStart].stack.length != 0 &&
          (board[rowStart - 1][colStart].stack[board[rowStart - 1][colStart].stack.length - 1].type == "capstone"
            ||
            (board[rowStart - 1][colStart].stack[board[rowStart - 1][colStart].stack.length - 1].type == "wallstone" && board[rowStart][colStart].stack[board[rowStart][colStart].stack.length - 1].type != "capstone"))
        ) {
          valid.value = false;
        }

        //move stack to variable to hold the stack
        let holdStack = board[rowStart][colStart].stack;
        board[rowStart][colStart].stack = [];
        for (let i = 0; i < rowStart + 1; i++) {
          let validInput = true;
          do { //input validation
            jumlah = prompt("Berapa piece yang diletakkan?", 1);
            if (parseInt(jumlah) < 0) {
              validInput = false;
              alert("Jumlah tidak valid");
            } else if (i > 0 && parseInt(jumlah) < 1) {//jika bukan prompt pertama minimal harus drop satu (hanya prompt pertama yang boleh diisi 0)
              validInput = false;
              alert("Jumlah Piece yang diletakan minimal 1");
            } else if (parseInt(jumlah) > holdStack.length) {//jika jumlah yang diinputkan melebihi jumlah yang ada di holdstack
              validInput = false;
              alert("Jumlah Piece tidak mencukupi");
            } else {
              validInput = true;
            }
          } while (!validInput);

          let jum = parseInt(jumlah);
          let currentCol = colStart;
          let currentRow = rowStart - i;
          if (currentRow - 1 < 0) {//di bagian paling atas papan
            for (let j = 0; j < holdStack.length; j++) {
              board[currentRow][currentCol].stack.push(holdStack[j]);
            }
            break;
          }
          if (board[currentRow - 1][currentCol].stack.length != 0 &&
            (
              (board[currentRow - 1][currentCol].stack[board[currentRow - 1][currentCol].stack.length - 1].type == "wallstone" && holdStack[holdStack.length - 1].type != "capstone")
              ||
              board[currentRow - 1][currentCol].stack[board[currentRow - 1][currentCol].stack.length - 1].type == "capstone"
            )) {//jika sebelahnya ada stack yang tidak bisa ditumpuki               
            if (i == 1) {//jika pertama kali stack dipindah, gerakan dibatalkan
              valid.value = false;
              for (let j = 0; j < holdStack.length; j++) {
                board[currentRow - 1][currentCol].stack.push(holdStack[j]);
              }
            } else {
              //move the stack that's being hold in holdStack back to board[][]
              for (let j = 0; j < holdStack.length; j++) {
                board[currentRow][currentCol].stack.push(holdStack[j]);
              }
            }
            break;
          } else if (jum == holdStack.length) { //all pieces left are moved      
            if (holdStack.length == 1) {//last piece to put
              if (holdStack[0].type == "capstone") {//last piece is capstone
                if (board[currentRow][currentCol].stack.length == 0) {//jika current target kosong
                  board[currentRow][currentCol].stack.push(holdStack[0]);
                } else if (board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type == "wallstone") {//jika top of target adalah wall maka diratakan jadi flat
                  board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type = "flatstone";
                  board[currentRow][currentCol].stack.push(holdStack[0]);
                } else {//top of target flat stone
                  board[currentRow][currentCol].stack.push(holdStack[0]);
                }

              } else {//last piece is a wallstone
                board[currentRow][currentCol].stack.push(holdStack[0]);
              }

            } else {//sisa piece lebih dari satu
              if (board[currentRow][currentCol].stack.length == 0) {//current empty
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow][currentCol].stack.push(holdStack[j]);
                }
              } else if (board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type == "wallstone") {//kembalikan ke sebelumnya
                //current cell's top stack is a wallstone
                if (i == 1) {
                  valid.value = false;
                }
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow + 1][currentCol].stack.push(holdStack[j]);
                }
              } else {//top of current flat
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow][currentCol].stack.push(holdStack[j]);
                }
              }

            }
            break;
          } else {//top of stack not a wallstone
            if (board[currentRow][currentCol].stack.length != 0 && board[currentRow][currentCol].stack[board[currentRow][currentCol].stack.length - 1].type != "flatstone") {
              if (i == 1) {//gerakan kedua sejak peletakan pertama, batalkan move dan turn tetap
                valid.value = false;
                //kembalikan posisi semula
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow + 1][currentCol].stack.push(holdStack[j]);
                }
                resetSelected();
                break;
              } else {//sudah diatas 2 kali meletakan stack, sisa stack diletakan ke cell sebelumnya, turn berganti
                //drop semua stack yang tersisa
                for (let j = 0; j < holdStack.length; j++) {
                  board[currentRow + 1][currentCol].stack.push(holdStack[j]);
                }
                resetSelected();
                break;
              }

            } else { //valid to drop
              for (let j = 0; j < jum; j++) {//drop piece sesuai jumlah
                board[currentRow][currentCol].stack.push(holdStack[0]);
                holdStack.splice(0, 1);//hapus dari paling bawah (index 0)
              }
            }
          }

        }

      }
    }

  }

  function isMoveSingleValid(colStart, rowStart, colTarget, rowTarget) {

    let piece = board[rowStart][colStart].stack[0];
    let topTargetPiece = board[rowTarget][colTarget].stack[board[rowTarget][colTarget].stack.length - 1];
    if (board[rowTarget][colTarget].stack.length == 0) {//move ke cell kosong
      return true;
    }
    if (piece.type == "flatstone") {
      if (topTargetPiece.type == "flatstone") {//flatstone hanya bisa dipindah ke atas flatstone lain tidak peduli warna
        return true;
      } else {
        alert("invalid move");
        return false;
      }
    } else if (piece.type == "wallstone") {
      if (topTargetPiece.type == "flatstone") {//wall juga hanya bisa dipindah ke atas flatstone tidak bisa diatas wall atau capstone
        return true;
      } else {
        alert("invalid move");
        return false;
      }
    } else {//piece capstone
      if (topTargetPiece.type != "capstone") {//capstone bisa dipindah ke atas segala jenis kecuali sesama capstone 
        return true;
      } else {
        alert("invalid move");
        return false;
      }
    }
  }

  function isPutStoneValid(col, row) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].col == col && board[i][j].row == row) {
          if (board[i][j].stack.length == 0) {//kotak masih kosong
            // console.log("empty");
            return true;//valid
          } else {
            alert("Menaruh stone hanya bisa dicell kosong");
            return false;
          }
        }

      }
    }
  }

  function move() {
    if (userInitial == 0 && selectedStone != "flatstone") {//add initial step condition must be flatstone
      alert("invalid stone type for initial step");
      resetSelected();
    } else {
      if (selectedCell.row == selectedTargetCell.row && selectedCell.col == selectedTargetCell.col) {//put new stone move
        if (isPutStoneValid(selectedCell.col, selectedCell.row)) {
          if (selectedStone == "flatstone" || selectedStone == "wallstone") {
            if (stoneAvailable >= 1) {
              // console.log("masuk");

              putNewStone(selectedCell.col, selectedCell.row, selectedStone);

              setStoneAvailable(stoneAvailable - 1);//kurangi jumlah stone yg sudah dipakai
              // checkGameTop();
              nextTurn();
              // console.log("current turn : " + turn);
            } else {
              alert(selectedStone + " tidak cukup");
              resetSelected();
            }
          } else if (selectedStone == "capstone") {
            if (capstoneAvailable >= 1) {
              putNewStone(selectedCell.col, selectedCell.row, selectedStone);
              setCapstoneAvailable(capstoneAvailable - 1);
              // checkGameTop();
              nextTurn();
            } else {
              alert(selectedStone + " tidak cukup");
              resetSelected();
            }
          }
        } else {//move tidak valid
          resetSelected();
        }

      } else {//moving existing stone
        if (isStackControlled(selectedCell.col, selectedCell.row, turn) && isMoveStackValid(selectedCell.col, selectedCell.row, selectedTargetCell.col, selectedTargetCell.row)) {
          if (board[selectedCell.row][selectedCell.col].stack.length == 1 && isMoveSingleValid(selectedCell.col, selectedCell.row, selectedTargetCell.col, selectedTargetCell.row)) {//moving stack with single piece only
            moveSinglePiece(selectedCell.col, selectedCell.row, selectedTargetCell.col, selectedTargetCell.row);
            // checkGameTop();
            nextTurn();
          } else if (board[selectedCell.row][selectedCell.col].stack.length > 1) {//move stack with multiple piece
            let valid = {
              value: true
            };
            moveStackOfPiece(selectedCell.col, selectedCell.row, selectedTargetCell.col, selectedTargetCell.row, valid);
            // alert(valid.value);
            if (valid.value == true) {
              // checkGameTop();
              nextTurn();
            }
          }
          resetSelected();
        } else {
          resetSelected();
        }
      }

    }

  }
  
  function enemyMove() {
    //put new stone movement
    if (tempMove.moveType == "place") {
      if (board[tempMove.row][tempMove.col].stack.length == 0) {
        putNewStone(tempMove.col, tempMove.row, tempMove.type);
        //revert if clash with player piece

        if (tempMove.type == "capstone") {
          setEnemyCapstoneAvailable(enemyCapstoneAvailable - 1);//kurangi jumlah stone yg sudah dipakai
        } else {
          setEnemyStoneAvailable(enemyStoneAvailable - 1);//kurangi jumlah stone yg sudah dipakai
        }
        // checkGameTop();
        nextTurn();
      } else {      //clash with other player piece
        console.log("bentrok")
        //cari tempat kosong lagi
        let isFirstTurn = false;
        if (enemyInitial == 0) {
          isFirstTurn = true;
        }

        let pieceLeft = {
          stone: enemyStoneAvailable,
          capstone: enemyCapstoneAvailable
        }
        let temp = getNextMove(board, "enemy", pieceLeft, isFirstTurn);
        putNewStone(temp.col, temp.row, temp.type);

        if (temp.type == "capstone") {
          setEnemyCapstoneAvailable(enemyCapstoneAvailable - 1);//kurangi jumlah stone yg sudah dipakai
        } else {
          setEnemyStoneAvailable(enemyStoneAvailable - 1);//kurangi jumlah stone yg sudah dipakai
        }
        // checkGameTop();
        nextTurn();
      }
    } else if (tempMove.moveType == "move") {
      //move single only
      if (board[tempMove.row][tempMove.col].stack.length == 1) {
        //check direction
        if (tempMove.direction == "left") {
          moveSinglePiece(tempMove.col, tempMove.row, tempMove.col - 1, tempMove.row);
        } else if (tempMove.direction == "right") {
          moveSinglePiece(tempMove.col, tempMove.row, tempMove.col + 1, tempMove.row);

        } else if (tempMove.direction == "up") {
          moveSinglePiece(tempMove.col, tempMove.row, tempMove.col, tempMove.row - 1);

        } else {//down
          moveSinglePiece(tempMove.col, tempMove.row, tempMove.col, tempMove.row + 1);

        }
      }
      // checkGameTop();
      nextTurn();
    } else {//move stack

    }
  }

  function backtrackingPlayer(posX, posY, helper, status) {
    let p = -1;
    if (status == "top" && board[posY][posX].stack[board[posY][posX].stack.length - 1].owner == "player") {
      do {
        p++;
        let deltaX = posX + checkX[p];
        let deltaY = posY + checkY[p];
        if ((deltaX >= 0 && deltaX < parseInt(boardSize) && deltaY >= 0 && deltaY < parseInt(boardSize)) && helper[deltaY][deltaX] == "uncheck") {
          if (board[deltaY][deltaX].stack.length > 0) {
            if (board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].owner == "player" && (board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].type == "flatstone" || board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].type == "capstone")) {
              if (deltaY == parseInt(boardSize) - 1) {
                setPlayerwin(true);
                return;
              }
              helper[posY][posX] = "checked";
              backtrackingPlayer(deltaX, deltaY, helper, status);
            }
          }
        }
      } while (p < 3);
    } else if (status == "left" && board[posY][posX].stack[board[posY][posX].stack.length - 1].owner == "player") {
      do {
        p++;
        let deltaX = posX + checkX[p];
        let deltaY = posY + checkY[p];
        if ((deltaX >= 0 && deltaX < parseInt(boardSize) && deltaY >= 0 && deltaY < parseInt(boardSize)) && helper[deltaY][deltaX] == "uncheck") {
          if (board[deltaY][deltaX].stack.length > 0) {
            if (board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].owner == "player" && (board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].type == "flatstone" || board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].type == "capstone")) {
              if (deltaX == parseInt(boardSize) - 1) {
                setPlayerwin(true);
                return;
              }
              helper[posY][posX] = "checked";
              backtrackingPlayer(deltaX, deltaY, helper, status);
            }
          }
        }
      } while (p < 3);
    }
  }

  function backtrackingEnemy(posX, posY, helper, status) {
    let p = -1;
    if (status == "top" && board[posY][posX].stack[board[posY][posX].stack.length - 1].owner == "enemy") {
      do {
        p++;
        let deltaX = posX + checkX[p];
        let deltaY = posY + checkY[p];
        // console.log(p)
        if ((deltaX >= 0 && deltaX < parseInt(boardSize) && deltaY >= 0 && deltaY < parseInt(boardSize)) && helper[deltaY][deltaX] == "uncheck") {
          if (board[deltaY][deltaX].stack.length > 0) {
            if (board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].owner == "enemy" && (board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].type == "flatstone" || board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].type == "capstone")) {
              if (deltaY == parseInt(boardSize) - 1) {
                setEnemywin(true);
                
                return;
              }
              helper[posY][posX] = "checked"
              backtrackingEnemy(deltaX, deltaY, helper, status);
            }
          }
        }
      } while (p < 3);
    } else if (status == "left" && board[posY][posX].stack[board[posY][posX].stack.length - 1].owner == "enemy") {
      do {
        p++;
        let deltaX = posX + checkX[p];
        let deltaY = posY + checkY[p];
        // console.log(p)
        if ((deltaX >= 0 && deltaX < parseInt(boardSize) && deltaY >= 0 && deltaY < parseInt(boardSize)) && helper[deltaY][deltaX] == "uncheck") {
          if (board[deltaY][deltaX].stack.length > 0) {
            if (board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].owner == "enemy" && (board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].type == "flatstone" || board[deltaY][deltaX].stack[board[deltaY][deltaX].stack.length - 1].type == "capstone")) {
              if (deltaX == parseInt(boardSize) - 1) {
                setEnemywin(true);
                console.log("oon")
                return;
              }
              helper[posY][posX] = "checked"
              backtrackingEnemy(deltaX, deltaY, helper, status);
            }
          }
        }
      } while (p < 3);
    }
  }

  function checkGameTop() {
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
          return;
        }
        backtrackingPlayer(i, 0, helper, status);
      }
    }
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
        if (enemyWin == true) {
          return;
        }
        backtrackingEnemy(i, 0, helper, status);
      }
    }
    if (enemyWin == false && playerWin == false) {
      checkGameLeft();
    }
  }

  function checkGameLeft() {
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
          return;
        }
        backtrackingPlayer(0, i, helper, status);
      }
    }
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
        if (enemyWin == true) {
          return;
        }
        backtrackingEnemy(0, i, helper, status);
      }
    }
  }

  useEffect(() => {
    if (board[0]) {
      checkGameTop()
    }
  }, [board]);

  useEffect(() => {
    checkWin();
  }, [playerWin]);

  useEffect(() => {
    checkWin();
  }, [enemyWin]);

  function checkWin() {
    if (playerWin == true) {
      alert('you win!');
      window.location.href = "/"
    }
    if (enemyWin == true) {
      alert("enemy win!")
      window.location.href = "/"
    }
  }

  function putNewStone(col, row, type) {
    let newStone = {
      type: type,
      owner: turn,
    }
    if (userInitial == 0) {
      //langkah pertama dari user
      newStone.owner = "enemy";
      setUserInitial(1);
    } else if (enemyInitial == 0) {
      newStone.owner = "player";
      setEnemyInitial(1);
    }

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].col == col && board[i][j].row == row) {
          if (board[i][j].stack.length != 0) {
            //initial step bentrok, cari tempat kosong lagi
            console.log("bentrok 2")
            board[i][j + 1].stack.push(newStone);
          } else {//aman, initial step tidak bentrok
            board[i][j].stack.push(newStone);
          }
          break;
        }

      }
    }

    setBoard([...board]);
    resetSelected();
    console.log("put new stone");
  }

  //enemy ai move
  useEffect(() => {
    // console.log(board);
    if(turn == "enemy"){
      //ai move
      let isFirstTurn = false;
      if(enemyInitial == 0){
        isFirstTurn = true;
      }

      let pieceLeft = {
        stone: enemyStoneAvailable,
        capstone: enemyCapstoneAvailable
      }
      let result = getNextMove(board, turn, pieceLeft, isFirstTurn);
      setBoard(result.boardState);
      
      //kurangi jumlah stone yang ditaruh
      if(result.moveType == "place"){
        if(result.type == "capstone"){
          setEnemyCapstoneAvailable(enemyCapstoneAvailable-1);
        }else{
          setEnemyStoneAvailable(enemyStoneAvailable-1);
        }
      }
      // checkGameTop();
      nextTurn();
    }
  }, [turn]);


  return (
    <>
      <h1 className='text-center'>Tak</h1>
      <div className="container-fluid">
        <div className="row d-flex justify-content-between">
          <div className="col-md-3">
            <input type="number" name="ukuran" id="ukuran" defaultValue={3} onChange={() => {
              setBoardSize(document.getElementById('ukuran').value);
            }} min={3} max={8} />
            <button className='btn btn-primary ms-2' onClick={initBoard}>Generate Board</button>
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
        <div className="papan d-flex justify-content-center" style={{ minHeight: "250px" }}>
          <div>
            {
              board.map((row, rowIdx) => (//row
                <div className="row d-flex justify-content-start m-0" key={rowIdx}>
                  {row.map((cell, cellIdx) => (//per cell
                    <div className="kotak" key={cellIdx} style={{ color: "white", backgroundColor: (selectedCell.col == cellIdx) && (selectedCell.row == rowIdx) ? "lightgreen" : "" }} onClick={
                      () => {
                        if (selectedCell != "" && selectedTargetCell != "") {//confirm move
                          // setTimeout(()=>{}, 500);
                          if (turn == "player") {
                            move();
                          } else {
                      
                            // enemyMove();
                          }
                        } else if (selectedCell != "") {//jika sudah pilih current selected cell
                          setSelectedTargetCell(cell);
                        } else {
                          setSelectedCell(cell);
                        }
                      }
                    }>
                      {cell.stack.map((item, idx) => (
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

        </div>
        <div className="row" id='userPiece'>
          <div className="col-md-3 d-flex justify-content-between">
            <button onClick={() => {
              setSelectedStone("capstone");
            }}>Capstone Available:{capstoneAvailable}</button>
            <button onClick={() => {
              setSelectedStone("flatstone");
            }}>Flat Stone Available:{stoneAvailable}</button>
            <button onClick={() => {
              setSelectedStone("wallstone");
            }}>Wall Stone Available:{stoneAvailable}</button>
          </div>
          <div className="col-md-3">
            <div className="">You Selected: {selectedStone}</div>
          </div>
        </div>

        <div className="row" id='enemyPiece'>
          <div className="col-md-3 d-flex justify-content-between">
            <button onClick={() => {
              setEnemySelectedStone("capstone");
            }}>Capstone Available:{enemyCapstoneAvailable}</button>
            <button onClick={() => {
              setEnemySelectedStone("flatstone");
            }}>Flat Stone Available:{enemyStoneAvailable}</button>
            <button onClick={() => {
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
