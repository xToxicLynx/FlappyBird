const START_VELOCITY = 0.5;
const Gravity = 2.5;
const JUMP_HEIGHT = 0.75;
let birdVelocity = START_VELOCITY;
const birdElem = document.querySelector(".bird");
const BirdAnimation = ["images/Bird_idle.png", "images/Bird_fly_1.png", "images/Bird_fly_2.png"];
let Frame = 0;
const BirdImage = document.getElementById("anim");
let Clock = 0;

export function setupBird() {
    birdElem.style.setProperty("--bird-top", window.innerHeight / 2 - 150)
    birdVelocity = START_VELOCITY
    document.removeEventListener("keydown", handleJump)
    document.addEventListener("keydown", handleJump)
}

function handleJump(e) {
    if (e.code !== "Space") return;
    birdVelocity = JUMP_HEIGHT;
}

export function updateBird(delta) {
    Clock += delta
    birdVelocity -= Gravity * delta / 1000
    if (birdVelocity > 0) {
        birdElem.children[0].classList.remove("falling");
        birdElem.children[0].classList.add("jump");
    }
    else {
        birdElem.children[0].classList.remove("jump");
        birdElem.children[0].classList.add("falling");

    }
    birdElem.style.setProperty("--bird-top", getTop() - birdVelocity * delta)
    if (Clock > 150) {
        BirdImage.src = BirdAnimation[Frame];
        Frame = 1 - Frame;
        Clock = 0;
    }
}

function getTop() {
    return parseFloat(getComputedStyle(birdElem).getPropertyValue("--bird-top"))
}

export function getBirdRect() {
    return birdElem.getBoundingClientRect()
}