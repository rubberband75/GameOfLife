
let grid = [[]];
let sideLength = 30;
let running = false;
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
        arr[i] = new Array(cols).fill(0);
    }
    return arr;
}

function initializeGrid() {
    let gridWidth = Math.ceil(($("#sketch-holder").innerWidth() / 2) / (sideLength)) * 2;
    let gridHeight = Math.ceil(($("#sketch-holder").innerHeight() / 2) / (sideLength)) * 2;

    xOffset = (gridWidth / 2 * sideLength) - $("#sketch-holder").innerWidth() / 2;
    yOffset = (gridHeight / 2 * sideLength) - $("#sketch-holder").innerHeight() / 2;

    grid = make2dArray(gridHeight, gridWidth);

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {

            grid[row][col] = { state: 0, color: getRandomColor() };

        }
    }

    drawGrid();

}



function drawCell(row, col, live = false, fillColor = color(255)) {
    let x = col * sideLength;
    let y = row * sideLength;

    stroke(32);
    strokeWeight(2);
    noFill();

    if(!colorize) fillColor = color(255);
    if (live) fill(fillColor);
    if (allOn) fill(fillColor);
    rect(col * sideLength, row * sideLength, sideLength, sideLength);
}

function drawGrid() {
    var canvas = createCanvas($("#sketch-holder").innerWidth(), $("#sketch-holder").innerHeight());
    canvas.parent('sketch-holder');
    background(0);
    translate(0 - xOffset, 0 - yOffset);

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            drawCell(row, col, grid[row][col].state, grid[row][col].color);
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
        return grid[row][col].state;
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

function getNeighbors(row, col) {
    if (grid[row][col] == null) return [];

    neighbors = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!(i == 0 && j == 0)) {
                if(getState(row + i, col + j)) neighbors.push(grid[row + i][col + j]);
            }
        }
    }

    return neighbors;
}

function getNextGeneration() {
    let nextGrid = make2dArray(grid.length, grid[0].length);

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {

            let fillColor = grid[row][col] ? grid[row][col].color : color(255);
            nextGrid[row][col] = { state: 0, color: fillColor };

        }
    }

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {

            let alive = grid[row][col].state
            let neighborCells = getNeighbors(row, col);
            let neighbors = neighborCells.length;

            if (alive == 0 && neighbors == 3) {
                nextGrid[row][col].state = 1;
                nextGrid[row][col].color = getNextColor(neighborCells);
            } else if (alive == 1 && (neighbors < 2 || neighbors > 3)) {
                nextGrid[row][col].state = 0;
            } else {
                nextGrid[row][col].state = grid[row][col].state;
            }
            
        }
    }

    grid = nextGrid;
    
}

function toggleCell(x, y){
    let col = floor((x + xOffset)/sideLength);
    let row = floor((y + yOffset)/sideLength);
    grid[row][col].state = int(!grid[row][col].state);
}

function getNextColor(neighbors) {
    let angles = [];
    for (let i = 0; i < neighbors.length; i++) {
        angles.push(getAngle(neighbors[i].color));
    }

    return getColorFromAngle(angleAverage(angles))
}


let canvas = document.getElementById('defaultCanvas0');

window.addEventListener("resize", function () {
    initializeGrid();
});

document.addEventListener("wheel", function (e) {
    if (e.deltaY > 0 && sideLength > 5) {
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

        case 70: //f
            colorize = !colorize;
            break;

        case 65: //a
            allOn = !allOn;
            break;
    }
});

document.addEventListener("mousedown", function(e) {
    try {
        toggleCell(e.clientX - $("#sketch-holder").offset().left , e.clientY - $("#sketch-holder").offset().top);        
    } catch (error) {
        //
    }
});


