"use strict";
const container = document.querySelector(".container");
const board = document.querySelector(".board")
const boxes = document.querySelectorAll(".box");
const reset = document.querySelector(".reset");
const newBtn = document.querySelector(".new-btn");
const title = document.querySelector("#title")
const msgCont = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");
const clickSound = new Audio('/assets/audio/click.mp3');
const winSound = new Audio('/assets/audio/win.mp3');
const scoreXElement = document.querySelector("#score-x");
const scoreOElement = document.querySelector("#score-o");
const toggle = document.querySelector(".toggle")
const prev = document.querySelector(".prev")
const next = document.querySelector(".next")


const winningPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
]
let scoreX = 0;
let scoreO = 0;


let history = [];
let currentMoveIndex = -1;


let turnX = true;


const disableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = true;
    })
}
const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
    })
}

const saveHistory = () => {
    const currentBoardState = [];
    boxes.forEach((box)=>{
        currentBoardState.push(box.innerHTML);
    })
    history.push(currentBoardState);
    currentMoveIndex = history.length-1;
}
const renderHistory = (boardState) => {
boxes.forEach((box, index)=>{
    box.innerHTML = boardState[index];
    disableBoxes();
})
}
function animateElement(element, animation) {
  element.classList.add('animate__animated', animation);

  element.addEventListener('animationend', () => {
    element.classList.remove('animate__animated', animation);
  }, { once: true }); 
}
const removeWinLines = () => {
    for (let i = 0; i < winningPatterns.length; i++) {
        board.classList.remove(`win-pat-${i}`);
    }
};


const showWinner = (winner) => {
    if (winner === "X") {
        scoreX++;
        scoreXElement.textContent = `Player X : ${scoreX}`;
    } else {
        scoreO++;
        scoreOElement.textContent = `Player O : ${scoreO}`;
    }
    title.classList.remove('active'); 
    msg.classList.add('active');    

    animateElement(msg, 'animate__pulse');

    winSound.play();
    msg.innerHTML = `The Winner is ${winner}!`;
    msgCont.style.display = "flex";
    toggle.classList.remove("hide")
    reset.classList.add("hide");
    disableBoxes();
};

const checkPattern = () => {
    for (let i = 0; i < winningPatterns.length; i++) {
        const pattern = winningPatterns[i];
        const box1val = boxes[pattern[0]].innerHTML;
        const box2val = boxes[pattern[1]].innerHTML;
        const box3val = boxes[pattern[2]].innerHTML;
        if (box1val !== "" && box2val !== "" && box3val !== "") {
            if (box1val == box2val && box1val == box3val) {
                showWinner(box1val);
                board.classList.add(`win-pat-${i}`);
                return
            }
        }
    }
}
const resetGame = (e) => {
    turnX = true;
    enableBoxes();
    boxes.forEach(box => {
        box.innerHTML = "";
    });

    msg.classList.remove('active'); 
    title.classList.add('active');

    animateElement(title, 'animate__pulse');
    
    reset.classList.remove("hide");
    toggle.classList.add("hide");
    container.style.display = "block";

    //remove winning line
    removeWinLines(); 


    //reset scores
    if(e.target===reset){
    scoreX = 0;
    scoreO = 0;
    scoreXElement.textContent = `Player X : ${0}`;
    scoreOElement.textContent = `Player O : ${0}`;
    }
    //reset history
    history = [];
    currentMoveIndex = -1;
    saveHistory();
};


boxes.forEach(box => {
    box.addEventListener("click", () => {
        
        clickSound.play();
        if (turnX) {
            box.innerHTML = "X";
            turnX = false;
        } else {
            box.innerHTML = "O";
            turnX = true;
        }
        
        box.disabled = true;
        
        saveHistory();
        checkPattern()  ;

        
    })

})

reset.addEventListener("click", resetGame);
newBtn.addEventListener("click", resetGame);

prev.addEventListener("click", ()=>{
    if(currentMoveIndex>0){
    removeWinLines(); 
    currentMoveIndex--;
    renderHistory(history[currentMoveIndex])
    }
})

next.addEventListener("click", ()=>{
    if(currentMoveIndex<history.length - 1){
    removeWinLines(); 
    currentMoveIndex++;
    renderHistory(history[currentMoveIndex]);
    }
})

saveHistory();