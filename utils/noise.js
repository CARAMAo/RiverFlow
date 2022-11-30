var slopes = Array(100).fill().map( () => Math.random()*2 - 1 )

const noise1d = (x) => {
    x = x%99;
    const l = Math.floor(x);
    const r = l+1;
    const fract = x-l;

    const lSlope = slopes[l];
    const rSlope = slopes[r];

    lPos = lSlope * fract;
    rPos = -rSlope * (1-fract);

    const u = fract * fract * (3.0 - 2.0 * fract);  // cubic curve
    const n = (lPos*(1-u)) + (rPos*u);  // interpolate
    return (n+1)/2
}

const noise = (x) => {
    const octaveCount = 10;

    var value = 0;
    var amplitude = 1.0;
    var frequency = 1.50;

    var persistence = 0.03;

    var maxValue = 0;

    for(var i = 0; i < octaveCount; i++){
        value += amplitude * noise1d(x*frequency);
        maxValue += amplitude;

        amplitude *= persistence;
        frequency /= persistence;
    }

    return value/maxValue;
}

for(var i = 0; i< 50; i++){
    console.log(noise(i+1)*100);
}