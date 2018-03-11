let a = 0.0;
let r = 0;
let g = 0;
let b = 0;

let r2 = 0;
let g2 = 0;
let b2 = 0;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
    createCanvas(window.innerWidth, window.innerHeight);
    fill(color(255, 0, 0));
    rect(30, 30 + (255 - r), 70, r);

    fill(color(0, 255, 0));
    rect(130, 30 + (255 - g), 70, g);

    fill(color(0, 0, 255));
    rect(230, 30 + (255 - b), 70, b);

    fill(color(r, g, b));
    rect(30, 315, 270, 30);


    //--------------------------------
    line(365, 30, 365, 350);
    //--------------------------------

    fill(color(255, 0, 0));
    rect(430, 30 + (255 - r2), 70, r2);

    fill(color(0, 255, 0));
    rect(530, 30 + (255 - g2), 70, g2);

    fill(color(0, 0, 255));
    rect(630, 30 + (255 - b2), 70, b2);

    fill(color(r2, g2, b2));
    rect(430, 315, 270, 30);
    

}


function colorCos(x, n = 2*PI) {
    x = (x + (2*PI/3)) % n;
    if (x < n / 6) {
        return x / (n / 6);

    } else if (x >= n / 6 && x <= n/2) {
        return 1;

    } else if(x > n/2 && x <= 2*n/3){
        return -(x / (n / 6)) + 4

    } else {
        return 0;
    }
}


setInterval(function () {
    a = (a + 0.2) % (2 * PI);

    r = 255 * (cos(a) + 1) / 2;
    g = 255 * (cos(a + (4 * PI / 3)) + 1) / 2;
    b = 255 * (cos(a + (2 * PI / 3)) + 1) / 2;

    r2 = 255 * colorCos(a);
    g2 = 255 * colorCos(a + (4 * PI / 3));
    b2 = 255 * colorCos(a + (2 * PI / 3));

}, 100);



function angleAverage(angles=[]){
    let x = 0;
    let y = 0;
    for(let i = 0; i < angles.length; i++){
        x += Math.cos(angles[i]);
        y += Math.sin(angles[i]);
    }
    if(angles.length){
        x = x/angles.length;
        y = y/angles.length;
    }

    return Math.atan2(y, x);
}