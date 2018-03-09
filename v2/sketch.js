
let grid = [[]];
let sideLength = 60;
let running = false;

function setup() {
    initializeGrid();
    randomize();
}

function draw() {
    drawGrid();

    if (running) {
        getNextGeneration();
    }
}



function make2dArray(rows, cols) {
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(cols).fill(0);
    }
    return arr;
}

function initializeGrid() {
    let gridWidth = Math.ceil((window.innerWidth / 2) / (sideLength)) * 2;
    let gridHeight = Math.ceil((window.innerHeight / 2) / (sideLength)) * 2;

    xOffset = (gridWidth / 2 * sideLength) - window.innerWidth / 2;
    yOffset = (gridHeight / 2 * sideLength) - window.innerHeight / 2;

    grid = make2dArray(gridHeight, gridWidth);

    drawGrid();

}



function drawCell(row, col, live = false) {
    let x = col * sideLength;
    let y = row * sideLength;

    stroke(32);
    strokeWeight(2);
    noFill();

    if (live) fill(255);
    rect(col * sideLength, row * sideLength, sideLength, sideLength);
}

function drawGrid() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(0);
    translate(0 - xOffset, 0 - yOffset);

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            drawCell(row, col, grid[row][col]);
        }
    }

}

function randomize() {
    initializeGrid();
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            grid[row][col] = int(random(1) >= 0.7);
        }
    }
}


function getState(row, col) {
    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
        return grid[row][col];
    }
    else return 0;
}

function countNeighbors(row, col) {
    sum = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!(i == 0 && j == 0)) {
                sum += getState(row + i, col + j);
            }
        }
    }
    return sum;
}

function getNextGeneration() {
    let nextGrid = make2dArray(grid.length, grid[0].length);

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {

            let alive = grid[row][col]
            let neighbors = countNeighbors(row, col);

            if (alive == 0 && neighbors == 3) {
                nextGrid[row][col] = 1;
            } else if (alive == 1 && (neighbors < 2 || neighbors > 3)) {
                nextGrid[row][col] = 0;
            } else {
                nextGrid[row][col] = grid[row][col];
            }
            
        }
    }

    grid = nextGrid;
    
}

function toggleCell(x, y){
    let col = floor((x + xOffset)/sideLength);
    let row = floor((y + yOffset)/sideLength);
    grid[row][col] = int(!grid[row][col]);
}




let canvas = document.getElementById('defaultCanvas0');

document.addEventListener("resize", function () {
    initializeGrid();
});

document.addEventListener("wheel", function (e) {
    if (e.deltaY > 0 && sideLength > 10) {
        sideLength -= 1;
    } else {
        sideLength += 1;
    }
    initializeGrid();
});

document.addEventListener("keydown", function (event) {
    // console.log(event.which);
    switch (event.which) {
        case 32: //space
            running = !running;
            break;

        case 82: //r
            randomize();
            break;

        case 67: //c
            initializeGrid();
            running = false;
            break;

        case 39: //right arrow
            getNextGeneration();
            break;
    }
});

document.addEventListener("mousedown", function(e) {
    toggleCell(e.clientX, e.clientY);
});
