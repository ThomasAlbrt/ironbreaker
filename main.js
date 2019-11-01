let canvas = document.querySelector("canvas");
let playButton = document.querySelector("button");
let hero = document.getElementById("hero");
let cxt = canvas.getContext("2d");

let framesPerSec = 30;
let intervalId;

// Score

let score = 0;

// Ball settings

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let speedBallX = 5;
let speedBallY = 5;
const ballRadius = 10;

// Paddle settings

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const PADDLE_FROM_BOTTOM = 60;
const PADDLE_SPEED = 25;
let paddleX = 400;
let paddleY = canvas.height - PADDLE_FROM_BOTTOM;

// Bricks settings

const BRICK_COLUMNS = 10;
const BRICK_WIDTH = 80;
const BRICK_HEIGHT = 30;
const BRICK_GAP = 2;
const BRICK_ROWS = 8;
const BRICK_COLOR = ["#E2071C", "#FECA1E", "#02AC1E", "#DE1E7E", "#D4D"]
let bricksLeft = 0;
let brickArr = new Array(BRICK_COLUMNS * BRICK_ROWS);

// Input settings

const KEY_LEFT_ARROW = 37;
const KEY_RIGHT_ARROW = 39;

// Refresh the drawn and move functions every 30 fps

function updateAll() {
    moveAll();
    drawAll();

    if (bricksLeft == 0) {
        clearInterval(intervalId);
        drawText("60px Sabo", "YOU WON !!", (canvas.width / 2) / 2, canvas.height / 2);
    }
}

function isBrickAtRowCol(col, row) {
    if (col >= 0 && col < BRICK_COLUMNS && row >= 0 && row < BRICK_ROWS) {
        let brickIndexAtCoord = rowColToArrayIndex(col, row);
        return brickArr[brickIndexAtCoord];
    } else {
        return false;
    }
}

// Manage the way the ball reacts when hitting the bricks depending on the angle 

function ballBrickHandling() {
    let ballBrickCol = Math.floor(ballX / BRICK_WIDTH);
    let ballBrickRow = Math.floor(ballY / BRICK_HEIGHT);
    let brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

    if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLUMNS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {

        if (isBrickAtRowCol(ballBrickCol, ballBrickRow)) {
            brickArr[brickIndexUnderBall] = false;
            score += 100;
            bricksLeft--;

            let prevBallX = ballX - speedBallX;
            let prevBallY = ballY - speedBallY;
            let prevBrickCol = Math.floor(prevBallX / BRICK_WIDTH);
            let prevBrickRow = Math.floor(prevBallY / BRICK_HEIGHT);

            let bothTestsFailed = true;

            if (prevBrickCol != ballBrickCol) {
                if (isBrickAtRowCol(prevBrickCol, prevBrickRow) == false) {
                    speedBallX *= -1;
                    bothTestsFailed = false;
                }
            }
            if (prevBrickRow != ballBrickRow) {
                if (isBrickAtRowCol(prevBrickCol, prevBrickRow) == false) {
                    speedBallY *= -1;
                    bothTestsFailed = false;
                }
            }
            if (bothTestsFailed) {
                speedBallX *= -1;
                speedBallY *= -1;
            }
        }
    }
}

// Manage the way the ball interacts with the paddle

function ballPaddleHandling() {
    let paddleTop = canvas.height - PADDLE_FROM_BOTTOM;
    let paddleBottom = paddleTop + PADDLE_HEIGHT;
    let paddleRight = paddleX + PADDLE_WIDTH;
    let paddleLeft = paddleX;

    if (ballY + ballRadius > paddleTop && ballY < paddleBottom && ballX - ballRadius < paddleRight && ballX + ballRadius > paddleLeft) {
        speedBallY = 5;
        speedBallY *= -1;

        let paddleCenter = paddleX + PADDLE_WIDTH / 2;
        let distFromPaddleCenter = ballX - paddleCenter;
        speedBallX = distFromPaddleCenter * 0.35;
    }
}

// Manage the way the ball interacts with the canvas

function ballMove() {
    ballX += speedBallX;
    ballY += speedBallY;

    if (ballX + ballRadius > canvas.width && speedBallX > 0) {
        speedBallX *= -1
    }
    if (ballX - ballRadius < 0 && speedBallX < 0) {
        speedBallX *= -1
    }
    if (ballY + ballRadius > canvas.height) {
        ballReset();
        brickReset();
        score = 0;
    }
    if (ballY - ballRadius < 0 && speedBallY < 0) {
        speedBallY *= -1
    }
}

// Put all elements on motion

function moveAll() {
    ballBrickHandling();
    ballMove();
    ballPaddleHandling();
}

// Create all the visual elements on the canvas


function drawAll() {
    drawRect(0, 0, canvas.width, canvas.height, "#5394FC");
    drawCircle(ballX, ballY, ballRadius, "white");
    drawRect(paddleX, paddleY, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
    drawBricks();
    drawText("20px Sabo", `Score : ${score}`, 10, 40);
}

// Set new position for the ball each time it goes off the bottom of the screen

function ballReset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    speedBallY = 3;
}

// Create rectangles (canvas, paddle, bricks)

function drawRect(x, y, rectWidth, rectHeight, fillColor) {
    cxt.fillStyle = fillColor;
    cxt.fillRect(x, y, rectWidth, rectHeight);
}

// Create a ball

function drawCircle(x, y, radius, fillColor) {
    cxt.fillStyle = fillColor;
    cxt.beginPath();
    cxt.arc(x, y, radius, 0, Math.PI * 2, true);
    cxt.fill();
}

// Displaying of the score

function drawText(font, text, x, y) {
    cxt.font = font;
    cxt.fillStyle = "white";
    cxt.fillText(text, x, y);
}

// Return index for each brick on the bricks array

function rowColToArrayIndex(col, row) {
    return col + BRICK_COLUMNS * row;
}

// Shuffle of the colors of the bricks

function colorBricks() {
    let colorIndex = Math.floor(Math.random() * BRICK_COLOR.length - 1)
    return BRICK_COLOR[colorIndex];
}

// Create bricks based on the number of the constant "BRICK_COLUMNS"

function drawBricks() {
    for (let row = 0; row < BRICK_ROWS; row++) {
        for (let col = 0; col < BRICK_COLUMNS; col++) {

            let arrayIndex = rowColToArrayIndex(col, row);

            if (brickArr[arrayIndex]) {
                drawRect(BRICK_WIDTH * col, BRICK_HEIGHT * row, BRICK_WIDTH - BRICK_GAP, BRICK_HEIGHT - BRICK_GAP, colorBricks());
            }
        }
    }
}

// Establish whether a brick should be displayed or not

function brickReset() {
    bricksLeft = 0;

    for (let i = 0; i < 3 * BRICK_COLUMNS; i++) {
        brickArr[i] = false;
    }

    for (let i = 3 * BRICK_COLUMNS; i < BRICK_COLUMNS * BRICK_ROWS; i++) {
        brickArr[i] = true;
        bricksLeft++;
    }
}

// Create an event based on keyboard keys in order to move the paddle with left et right arrows

document.addEventListener("keydown", keyPressed);

function keyPressed(evt) {
    switch (evt.keyCode) {
        case 37:
            if (paddleX > 0) {
                paddleX -= PADDLE_SPEED;
            }
            break;
        case 39:
            if (paddleX < canvas.width - PADDLE_WIDTH) {
                paddleX += PADDLE_SPEED;
            }
            break;
    }
}

// Create an event to display the canvas with a click on the play button

playButton.addEventListener("click", clickPlay);

function clickPlay() {
    hero.classList.add("hide");
    canvas.classList.remove("hide");
    canvas.classList.add("reveal");
    intervalId = setInterval(updateAll, 1000 / framesPerSec);
}

brickReset();