//Color Functions ---------------------------------------------------

function getAngle(c) {
    let y = (Math.sin(0) * c.levels[0] + Math.sin(Math.PI * 2 / 3) * c.levels[1] + Math.sin(Math.PI * 4 / 3) * c.levels[2]) / 3;
    let x = (Math.cos(0) * c.levels[0] + Math.cos(Math.PI * 2 / 3) * c.levels[1] + Math.cos(Math.PI * 4 / 3) * c.levels[2]) / 3;
    return Math.atan2(y, x);
}

function angleAverage(angles = []) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < angles.length; i++) {
        x += Math.cos(angles[i]);
        y += Math.sin(angles[i]);
    }
    if (angles.length) {
        x = x / angles.length;
        y = y / angles.length;
    }
                
    //rounding errors caus a bias towards cyan whn the colors are nearly evenly spaced, and the average is 0
    //this attempts to correct that bias.
    if(x < 1e-4 && y < 1e-4){
        x += Math.random() / 100 * (Math.random() > 0.5 ? -1 : 1)
        y += Math.random() / 100 * (Math.random() > 0.5 ? -1 : 1)
    }

    return Math.atan2(y, x);
}

function colorCos(x, n = 2 * Math.PI) {
    x = (x + (2 * Math.PI / 3)) % n;
    if (x < n / 6) {
        return x / (n / 6);

    } else if (x >= n / 6 && x <= n / 2) {
        return 1;

    } else if (x > n / 2 && x <= 2 * n / 3) {
        return -(x / (n / 6)) + 4

    } else {
        return 0;
    }
}

function getColorFromAngle(angle) {
    // let r = Math.round(255 * colorCos(angle));
    // let g = Math.round(255 * colorCos(angle + (4 * Math.PI / 3)));
    // let b = Math.round(255 * colorCos(angle + (2 * Math.PI / 3)));

    let r = Math.round(255 * (Math.cos(angle) + 1) / 2 );
    let g = Math.round(255 * (Math.cos(angle + (4 * Math.PI / 3)) + 1) / 2);
    let b = Math.round(255 * (Math.cos(angle + (2 * Math.PI / 3)) + 1) / 2);
    return color(r, g, b);
}

function getRandomColor(){
    return getColorFromAngle(Math.random() * 2*Math.PI);
}