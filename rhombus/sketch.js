let r3over2 = Math.sqrt(3) / 2;

let rowOffset;
let colOffset;

let grid = [[]];
let sideLength = 20;
let running = true;
let colorize = true;
let allOn = false;

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
        arr[i] = new Array(cols).fill(null);
    }
    return arr;
}

function initializeGrid() {
    let gridWidth = Math.ceil((window.innerWidth / 2) / (r3over2 * sideLength)) * 4 + 1
    let gridHeight = (Math.ceil((window.innerHeight / 2) / (sideLength * 1.5)) * 2 + 1) * 2

    grid = make2dArray(gridHeight, gridWidth);

    rowOffset = grid.length / 2 - 1;
    colOffset = (grid[0].length - 1) / 2

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {

            let cellDir = getDirection(row - rowOffset, col - colOffset);

            // let fillColor = getColor(cellDir);
            // let fillColor = getColor2(row - rowOffset, col - colOffset);
            let fillColor = getRandomColor();

            if (cellDir) { grid[row][col] = { state: 0, dir: cellDir, color: fillColor }; }

        }
    }

    // console.log('initializing')
    drawGrid();

}



function getDirection(row, col) {
    if ((row % 4 == 0 && col % 4 == 0) || ((row - 2) % 4 == 0 && (col - 2) % 4 == 0)) {
        return 1;
    }

    if (((row + 1) % 4 == 0 && (col - 1) % 4 == 0) || ((row - 1) % 4 == 0 && (col + 1) % 4 == 0)) {
        return 2;
    }

    if (((row + 1) % 4 == 0 && (col + 1) % 4 == 0) || ((row - 1) % 4 == 0 && (col - 1) % 4 == 0)) {
        return 3;
    }

    return 0;
}

function getColor(dir) {
    if (dir == 1) return color(255, 0, 0);
    if (dir == 2) return color(0, 255, 0);
    if (dir == 3) return color(0, 0, 255);
    return color(255);
}

function getColor2(row, col) {
    let a = 0;
    if (col > 0) return getColorFromAngle(a);
    else return getColorFromAngle(a + Math.PI);
}

function drawRhombus(row, col) {
    let dir = getDirection(row, col);
    let x = col * r3over2 * sideLength / 2;
    let y = row * sideLength * 0.75;

    // top
    if (dir == 1) {
        quad(
            0 + x, 0 + y,
            -r3over2 * sideLength + x, -sideLength / 2 + y,
            0 + x, -sideLength + y,
            r3over2 * sideLength + x, -sideLength / 2 + y,
        )
    }

    // down left
    if (dir == 2) {
        y -= sideLength * 0.75;
        quad(
            x + r3over2 * sideLength / 2, y,
            x + r3over2 * sideLength / 2, y + sideLength,
            x - r3over2 * sideLength / 2, y + sideLength / 2,
            x - r3over2 * sideLength / 2, y - sideLength / 2,
        )
    }

    // down right
    if (dir == 3) {
        y -= sideLength * 0.75;
        quad(
            x - r3over2 * sideLength / 2, y,
            x - r3over2 * sideLength / 2, y + sideLength,
            x + r3over2 * sideLength / 2, y + sideLength / 2,
            x + r3over2 * sideLength / 2, y - sideLength / 2,
        )
    }
}

function drawCell(row, col, live = false, fillColor = color(255)) {
    let x = col * sideLength;
    let y = row * sideLength;
    let r = sideLength;

    stroke(32);
    strokeWeight(2);
    noFill();

    if(!colorize) fillColor = color(255);
    if (live) fill(fillColor);
    if (allOn) fill(fillColor);
    drawRhombus(row, col);
}

function drawGrid() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(0);
    translate(window.innerWidth / 2, window.innerHeight / 2);


    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (getDirection(row - rowOffset, col - colOffset)) {
                drawCell(row - rowOffset, col - colOffset, grid[row][col].state, grid[row][col].color);
            }
        }
    }

}

function randomize() {
    initializeGrid();
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (grid[row][col]) {
                grid[row][col].state = int(random(1) >= 0.7);
            }
        }
    }
}



function getState(row, col) {
    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
        if (grid[row][col]) {
            return grid[row][col].state;
        }
    }
    else return 0;
}

function countNeighbors(row, col) {
    if (grid[row][col] == null) return 0;

    sum = 0;
    if (grid[row][col].dir == 1) {
        sum += getState(row - 1, col - 3);
        sum += getState(row - 1, col - 1);
        sum += getState(row - 1, col + 1);
        sum += getState(row - 1, col + 3);

        sum += getState(row + 1, col - 3);
        sum += getState(row + 1, col - 1);
        sum += getState(row + 1, col + 1);
        sum += getState(row + 1, col + 3);

        // sum += getState(row + 0, col - 4);
        // sum += getState(row + 0, col + 4);
    }

    if (grid[row][col].dir == 2) {
        sum += getState(row - 2, col + 0);
        sum += getState(row - 1, col + 1);
        sum += getState(row + 0, col + 2);
        sum += getState(row + 1, col + 3);

        sum += getState(row - 1, col - 3);
        sum += getState(row + 0, col - 2);
        sum += getState(row + 1, col - 1);
        sum += getState(row + 2, col + 0);

        // sum += getState(row - 2, col - 2);
        // sum += getState(row + 2, col + 2);
    }

    if (grid[row][col].dir == 3) {
        sum += getState(row + 1, col - 3);
        sum += getState(row + 0, col - 2);
        sum += getState(row - 1, col - 1);
        sum += getState(row - 2, col + 0);

        sum += getState(row + 2, col + 0);
        sum += getState(row + 1, col + 1);
        sum += getState(row + 0, col + 2);
        sum += getState(row - 1, col + 3);

        // sum += getState(row + 2, col - 2);
        // sum += getState(row - 2, col + 2);
    }

    return sum;
}

function getNeighbors(row, col) {
    if (grid[row][col] == null) return [];

    sum = [];
    if (grid[row][col].dir == 1) {
        if (getState(row - 1, col - 3)) sum.push(grid[row - 1][col - 3]);
        if (getState(row - 1, col - 1)) sum.push(grid[row - 1][col - 1]);
        if (getState(row - 1, col + 1)) sum.push(grid[row - 1][col + 1]);
        if (getState(row - 1, col + 3)) sum.push(grid[row - 1][col + 3]);

        if (getState(row + 1, col - 3)) sum.push(grid[row + 1][col - 3]);
        if (getState(row + 1, col - 1)) sum.push(grid[row + 1][col - 1]);
        if (getState(row + 1, col + 1)) sum.push(grid[row + 1][col + 1]);
        if (getState(row + 1, col + 3)) sum.push(grid[row + 1][col + 3]);

        if(getState(row + 0, col - 4)) sum.push(grid[row + 0][col - 4]);
        if(getState(row + 0, col + 4)) sum.push(grid[row + 0][col + 4]);
    }

    if (grid[row][col].dir == 2) {
        if (getState(row - 2, col + 0)) sum.push(grid[row - 2][col + 0]);
        if (getState(row - 1, col + 1)) sum.push(grid[row - 1][col + 1]);
        if (getState(row + 0, col + 2)) sum.push(grid[row + 0][col + 2]);
        if (getState(row + 1, col + 3)) sum.push(grid[row + 1][col + 3]);

        if (getState(row - 1, col - 3)) sum.push(grid[row - 1][col - 3]);
        if (getState(row + 0, col - 2)) sum.push(grid[row + 0][col - 2]);
        if (getState(row + 1, col - 1)) sum.push(grid[row + 1][col - 1]);
        if (getState(row + 2, col + 0)) sum.push(grid[row + 2][col + 0]);

        if(getState(row - 2, col - 2)) sum.push(grid[row - 2][col - 2]);
        if(getState(row + 2, col + 2)) sum.push(grid[row + 2][col + 2]);
    }

    if (grid[row][col].dir == 3) {
        if (getState(row + 1, col - 3)) sum.push(grid[row + 1][col - 3]);
        if (getState(row + 0, col - 2)) sum.push(grid[row + 0][col - 2]);
        if (getState(row - 1, col - 1)) sum.push(grid[row - 1][col - 1]);
        if (getState(row - 2, col + 0)) sum.push(grid[row - 2][col + 0]);

        if (getState(row + 2, col + 0)) sum.push(grid[row + 2][col + 0]);
        if (getState(row + 1, col + 1)) sum.push(grid[row + 1][col + 1]);
        if (getState(row + 0, col + 2)) sum.push(grid[row + 0][col + 2]);
        if (getState(row - 1, col + 3)) sum.push(grid[row - 1][col + 3]);

        if(getState(row + 2, col - 2)) sum.push(grid[row + 2][col - 2]);
        if(getState(row - 2, col + 2)) sum.push(grid[row - 2][col + 2]);
    }

    return sum;
}

function getNextGeneration() {
    let nextGrid = make2dArray(grid.length, grid[0].length);

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {

            let cellDir = getDirection(row - rowOffset, col - colOffset);
            let fillColor = grid[row][col] ? grid[row][col].color : color(255);
            if (cellDir) { nextGrid[row][col] = { state: 0, dir: cellDir, color: fillColor }; }

        }
    }

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (grid[row][col]) {
                let alive = grid[row][col].state
                let neighborCells = getNeighbors(row, col);
                let neighbors = neighborCells.length;
                // if (allOn) neighborCells.push(grid[row][col])

                if (alive == 0 && (neighbors >= 3 && neighbors <= 3)) {
                    nextGrid[row][col].state = 1;
                    nextGrid[row][col].color = getNextColor(neighborCells);
                } else if (alive == 1 && (neighbors < 2 || neighbors > 3)) {
                    nextGrid[row][col].state = 0;
                } else {
                    nextGrid[row][col].state = grid[row][col].state;
                }
            }
        }
    }

    grid = nextGrid;

}

function toggleCell(x, y) {
    // let col = floor((x + xOffset)/sideLength);
    // let row = floor((y + yOffset)/sideLength);
    // grid[row][col] = int(!grid[row][col]);
}


function getNextColor(neighbors) {
    let angles = [];
    for (let i = 0; i < neighbors.length; i++) {
        angles.push(getAngle(neighbors[i].color));
    }

    return getColorFromAngle(angleAverage(angles))
}



window.addEventListener("resize", function () {
    // console.log('handle resize event...');
    initializeGrid();
});

document.addEventListener("wheel", function (e) {
    if (e.deltaY > 0 && sideLength > 10) {
        sideLength -= 1;
    } else {
        sideLength += 1;
    }
    // console.log((floor(((window.innerHeight / 2.0) - (sideLength / 2.0)) / (1.5 * sideLength)) + 1) * 2)
    initializeGrid();
});

document.addEventListener("keydown", function (event) {
    console.log(event.which);
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

        case 70: //f
            colorize = !colorize;
            break;

        case 65: //a
            allOn = !allOn;
            break;
    }
});

document.addEventListener("mousedown", function (e) {
    toggleCell(e.clientX, e.clientY);
});
