import { setupBird, updateBird, getBirdRect } from "./bird.js"
import { setupPipes, updatePipes, getPassedPipescount, getPipeRects, getSpeed } from "./pipe.js"

document.addEventListener("keydown", handleStart, { once: true });
const title = document.querySelector(".title");
const subtitle = document.querySelector(".subtitle");
let speed = 0.33

let Scoreboard = document.getElementById("scoreboard");
let Score = document.getElementById("score");
let Highscore = document.getElementById("highscore");
let Hscore = 0;
let Medal = document.getElementById("medal");
const floor = document.getElementById("floor");
let gameoverElem = document.getElementById("gameover");

let lastTime;

function handleStart() {
    title.classList.add("hide");
    Scoreboard.classList.add("hide");
    gameoverElem.classList.add("hide");
    Medal.src = ""
    setupBird();
    setupPipes();
    speed = 0.33;
    lastTime = null;
    window.requestAnimationFrame(updateLoop);

}

function updateLoop(time) {
    if (lastTime == null) {
        lastTime = time;
        window.requestAnimationFrame(updateLoop);
        return;
    }
    const delta = time - lastTime;
    updateBird(delta);
    updatePipes(delta);
    updateFloor(delta);
    Score.innerText = getPassedPipescount();
    if (getPassedPipescount() > Hscore) {
        Hscore ++
        Highscore.innerText = Hscore;
    }
    if (checkLose()) return handleLose()
    lastTime = time 
    window.requestAnimationFrame(updateLoop);
}

function checkLose() {
    const birdRect = getBirdRect();
    const insidePipe = getPipeRects().some(rect => isCollsion(birdRect, rect));
    const outsideWorld = birdRect.top < 0 || birdRect.bottom > (window.innerHeight - 160);
    return outsideWorld || insidePipe;
}

function isCollsion(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    )
}

export let gameOver = false;

function handleLose() {
    setTimeout(() => {
        if (getPassedPipescount() >= 25) {
            Medal.src = "images/bronze_medal.png"
        }
        if (getPassedPipescount() >= 50) {
            Medal.src = "images/silver_medal.png"
        }
        if (getPassedPipescount() >= 100) {
            Medal.src = "images/gold_medal.png"
        }
        Scoreboard.classList.remove("hide");
        gameoverElem.classList.remove("hide");
        document.addEventListener("keydown", handleStart, { once: true })
    }, 100)
}

function restart() {
    title.classList.remove("hide");
    subtitle.classList.remove("hide");
} 

function updateFloor(delta) {
    speed += getSpeed()
    let x = window.getComputedStyle(floor).getPropertyValue('--x')
    floor.style.setProperty("--x", x - delta * speed)
}