"use strict";

//when flag=pen-flag;penguins turn,when flag=bear-flag;bear`s turn
let flag="pen-flag";

//count turn number
let counter=9;

//class="square" を取得
const squares = document.getElementsByClassName("square");

//Array に変換
//https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/from
const squaresArrray = Array.from(squares);

//get squares element
const a_1 = document.getElementById("a_1");
const a_2 = document.getElementById("a_2");
const a_3 = document.getElementById("a_3");
const b_1 = document.getElementById("b_1");
const b_2 = document.getElementById("b_2");
const b_3 = document.getElementById("b_3");
const c_1 = document.getElementById("c_1");
const c_2 = document.getElementById("c_2");
const c_3 = document.getElementById("c_3");

//NewGame button acquired
const newgamebtn_display = document.getElementById("newgame-btn");
const newgamebtn = document.getElementById("btn90");

//Win or Lose Judgment Line
const line1 = JudgLine(squaresArrray,["a_1","a_2","a_3"]);
const line2 = JudgLine(squaresArrray,["b_1","b_2","b_3"]);
const line3 = JudgLine(squaresArrray,["c_1","c_2","c_3"]);
const line4 = JudgLine(squaresArrray,["a_1","b_1","c_1"]);
const line5 = JudgLine(squaresArrray,["a_2","b_2","c_2"]);
const line6 = JudgLine(squaresArrray,["a_3","b_3","c_3"]);
const line7 = JudgLine(squaresArrray,["a_1","b_2","c_3"]);
const line8 = JudgLine(squaresArrray,["a_3","b_2","c_1"]);

const lineArray = [line1,line2,line3,line4,line5,line6,line7,line8];

let winningLine = null;

//message
const msgtxt1 = '<p class="image"><img src ="img/penguins.jpg" width=61px height=61px></p><p class="text">Penguins Attack!(your turn)</p>';
const msgtxt2 = '<p class="image"><img src ="img/whitebear.jpg" width=61px height=61px></p><p class="text">WhiteBear Attack!(computer turn)</p>';
const msgtxt3 = '<p class="image"><img src ="img/penguins.jpg" width=61px height=61px></p><p class="text animate__animated animate__lightSpeedInRight">Penguins Win!!</p>';
const msgtxt4 = '<p class="image"><img src ="img/whitebear.jpg" width=61px height=61px></p><p class="text animate__animated animate__lightSpeedInLeft">WhiteBear Win!!</p>';
const msgtxt5 = '<p class="image"><img src ="img/penguins.jpg" width=61px height=61px><img src ="img/whitebear.jpg" width=61px height=61px></p><p class="text animate__bounceIn">Draw!!</p>';

//sound
let gameSound = ["sound/click_sound1.mp3","sound/click_sound2.mp3","sound/penwin_sound.mp3","sound/bearwin_sound.mp3","sound/draw_sound.mp3"]
//*********************************************
//ページ全体が読み込まれたタイミングで実行するコード
//*********************************************
window.addEventListener("DOMContentLoaded",
    function(){
        //message(最初はpenguinsのターンから)
        setMessage("pen-turn");
        //squareがクリック可能かを判断するクラスを追加
        squaresArrray.forEach(function (square){
            square.classList.add("js-clickable");
        });
    },false
);

// ***********************************
// Win or Lose Judgment Line配列化
// ***********************************
//JavaScriptでfilterを使う方法：https://teachacademy.jp/magazine/15575
function JudgLine(targetArray, idArray){
    return targetArray.filter(function(e) {
        return (e.id === idArray[0] || e.id === idArray[1] || e.id ===idArray[2]);
    });
}

//************************************
//squareをくりっくしたときにイベント発火
//*************************************
//クリックしたsquareに,penguinsかbearを表示、画像を表示したsquareはクリックできないようにする,win or lose judgmentの呼び出し

squaresArrray.forEach(function(square){
    square.addEventListener('click',() =>  {
        let gameOverFlg = isSelect(square); //game statusを返却

        //GameOverではない場合、熊のターン(auto)
        if(gameOverFlg === "0"){
            const squaresBox = document.getElementById("squaresBox");
            squaresBox.classList.add("js-unclickable"); //squaresBoxをクリックできないようにする
            setTimeout(
                function(){
                    bearTurn();
                },
                "1000"
            );
        }
    });
});

// *********************************
// show penguin or bear in clicked square
// make unable to click the shown placed 
// win or lose 決定の呼び出し
// *********************************
function isSelect(selectSquare){
    let gameOverFlg = "0";
    if(flag == "pen-flag"){
        //click sound
        let music = new Audio(gameSound[0]);
        music.currentTime = 0;
        music.play(); //再生

        selectSquare.classList.add("js-pen-checked");
        selectSquare.classList.add("js-unclickable");
        selectSquare.classList.remove("js-clickable");//square がクリック可能かを判断するクラスを削除       
        //penguins win
        if(isWinner("penguins")){
            setMessage("pen-win"); //display win message
            gameOver("penguins");
            return gameOverFlg = "1";
        }
        setMessage("bear-turn");
        flag = "bear-flag";

    }else{
        //click sound
        let music = new Audio(gameSound[1]);
        music.currentTime = 0;
        music.play(); //再生

        selectSquare.classList.add("js-bear-checked");
        selectSquare.classList.add("js-unclickable");   
        selectSquare.classList.remove("js-clickable");
        //white-bear win
        if(isWinner("bear")){
            setMessage("bear-win"); //display win message
            gameOver("bear");
            return gameOverFlg = "1";
        }
        setMessage("pen-turn");
        flag = "pen-flag"; 
    }
    
    //ターン数カウンター-1にする
    counter--;

    //ターン数＝０になったらDRAW
    if(counter === 0){
        setMessage("draw");
        gameOver("draw");
        return gameOverFlg = "1";
    }
    return gameOverFlg = "0";

}
// **********************************
// 勝敗判定
// ***********************************
//classListの使い方まとめ：https://qiita.com/tomokichi_ruby/items/2460c5902d19b81cace5
function isWinner(symbol){
    //some: 一つでも条件を満たさればTrue返す
    const result = lineArray.some(function (line){
        //every: 全ての条件を満たさればTrueを返す
        const subResult = line.every(function (square) {
            if (symbol === "penguins") {
                return square.classList.contains("js-pen-checked");
            }
            if (symbol === "bear") {
                return square.classList.contains("js-bear-checked");
            }
        });
        //trueを返したLineをWinningLineに代入
        if(subResult) {winningLine = line}

        return subResult;
    });
    return result;
}

// ********************************
// メセージ切り替え関数
// *********************************

function setMessage(id){
    switch(id){
        case "pen-turn":
            document.getElementById("msgtext").innerHTML=msgtxt1;
            break;
        case "bear-turn":
            document.getElementById("msgtext").innerHTML=msgtxt2;
            break;
        case "pen-win":
            document.getElementById("msgtext").innerHTML=msgtxt3;
            break;
        case "bear-win":
            document.getElementById("msgtext").innerHTML=msgtxt4;
            break;
        case "draw":
            document.getElementById("msgtext").innerHTML=msgtxt5;
            break;
        default:
            document.getElementById("msgtext").innerHTML=msgtxt1;
    }
}

// ***********************************
// ゲーム終了時の処理
// ***********************************


function gameOver(status){
    //GameOver sound
    let w_sound 
    switch(status){
        case "penguins":
            w_sound = gameSound[2];
            break;
        case "bear":
            w_sound = gameSound[3];
            break;
        case "draw":
            w_sound = gameSound[4];
            break;
    }

    let music = new Audio(w_sound);
    music.currentTime = 0;
    music.play(); //再生
    //all square unclickable
    //squaresArrray.forEach(function (square) {
     //   square.classList.add("js-unclickable");
    //});
    squaresBox.classList.add("js-unclickable"); //squaresBoxをクリックできないようにする
    //display New Game button display
    newgamebtn_display.classList.remove("js-hidden");
    
    //winEffect
    if(status === "penguins"){
        //winner-line penguins high-light
        if(winningLine){
            winningLine.forEach(function (square){
                square.classList.add("js-pen_highLight");
            });
        }
        //penguins win!! ==> snow color is pink
        $(document).snowfall({
            flakeColor :"rgb(255,240,245)",
            maxSpeed : 3,
            minSpeed : 1,
            maxSize : 20,
            minSize : 10,
            round : true //make snow`s shape round
        });

    }else if(status === "bear"){
        //winner-line bear high-light
        if(winningLine){
            winningLine.forEach(function (square){
                square.classList.add("js-bear_highLight");
            });
        }
        //whitebear win!! ==>snow color is blue
        $(document).snowfall({
            flakeColor :"rgb(175,238,238)",
            maxSpeed : 3,
            minSpeed : 1,
            maxSize : 20,
            minSize : 10,
            round : true //make snow`s shape round
        });
    }
}

// **********************************
// NewGameボタン　クリック時、ゲーム初期化
// **********************************
newgamebtn.addEventListener("click", function()  {
   //penguin`s turn
   flag = "pen-flag";
   // count turn 
   counter = 9;
   winningLine = null;
   squaresArrray.forEach(function (square){
       square.classList.remove("js-pen-checked");
       square.classList.remove("js-bear-checked");
       square.classList.remove("js-unclickable");
       square.classList.remove("js-pen_highLight");
       square.classList.remove("js-bear_highLight");
       square.classList.add("js-clickable");
   });

    squaresBox.classList.remove("js-unclickable"); //square-boxクリックができるようにする
   setMessage("pen-turn");
   newgamebtn_display.classList.add("js-hidden");

   //snowfall stop
   $(document).snowfall("clear");
});

// *********************
// 熊のターン
// *********************
function bearTurn(){
    let gameOverFlg = "0";

    //クリックできるマス目をランダム時選ぶ
    const bearSquare = squaresArrray.filter(function(square){
        return square.classList.contains("js-clickable");
    });

    let n = Math.floor(Math.random() * bearSquare.length);
    gameOverFlg = isSelect(bearSquare[n]);

    //GameOverではない場合
    if(gameOverFlg === "0"){
        squaresBox.classList.remove("js-unclickable");//squares-boxをクリックできるようにする
    }
}