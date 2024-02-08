const HOLE_HEIGHT = 80;
const PIPE_WIDTH = 120;
let PIPE_INTERVAL = 1500;
let PIPE_SPEED = 0.33;
let SPEED_MULTIPLIER = 0.0001;

let pipes = []
let timeSinceLastPipe
let PassedPipecount

export function setupPipes() {
    PIPE_SPEED = 0.33;
    PIPE_INTERVAL = 1500;
    document.documentElement.style.setProperty("--pipe-width", PIPE_WIDTH);
    document.documentElement.style.setProperty("--hole-height", HOLE_HEIGHT);
    pipes.forEach(pipe => pipe.remove());
    timeSinceLastPipe = PIPE_INTERVAL;
    PassedPipecount = 0;
}

export function getSpeed() {
    return SPEED_MULTIPLIER
}

export function updatePipes(delta) {
    timeSinceLastPipe += delta
    PIPE_SPEED += SPEED_MULTIPLIER
    PIPE_INTERVAL -= 0.01
    if (timeSinceLastPipe > PIPE_INTERVAL) {
        timeSinceLastPipe -= PIPE_INTERVAL
        createPipe();
    }

    pipes.forEach(pipe => {
        if (pipe.left + PIPE_WIDTH < 0) {
            PassedPipecount += 1
            return pipe.remove()
        }
        pipe.left = pipe.left - delta * PIPE_SPEED
    })
}

export function getPassedPipescount() {
    return PassedPipecount
}

export function getPipeRects() {
    return pipes.flatMap(pipe => pipe.rects())
}

function createPipe() {
    const pipeElem = document.createElement("div")
    const topElem = createPipeSegment("top")
    const bottomElem = createPipeSegment("bottom")

    pipeElem.append(topElem)
    pipeElem.append(bottomElem)
    pipeElem.classList.add("pipe")
    pipeElem.style.setProperty(
        "--hole-top", randomNumberBetween(
            HOLE_HEIGHT * 4, (window.innerHeight - 150) - HOLE_HEIGHT * 0.8
        )
    )
    const pipe = {
        get left() {
            return parseFloat(getComputedStyle(pipeElem).getPropertyValue("--pipe-left")
            )
        },
        set left(value) {
            pipeElem.style.setProperty("--pipe-left", value)
        },
        remove() {
            pipes = pipes.filter(p => p !== pipe)
            pipeElem.remove()
        },
        rects() {
            return [
                topElem.getBoundingClientRect(),
                bottomElem.getBoundingClientRect(),
            ]
        },
    }
    pipe.left = window.innerWidth;
    document.body.append(pipeElem);
    pipes.push(pipe);
}

function createPipeSegment(position) {
    const segment = document.createElement("div");
    segment.classList.add("segment", position);
    return segment;
}

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}