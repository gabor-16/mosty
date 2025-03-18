const hitboxes = [];
const equations = [];

const getLineEquation = (p0, p1) => {
    //jeśli są równe to nie ma współczynnika a bo było by dzielenie przez zero
    if(p0[0] === p1[0])
    {
        return {a: null, b: p0[1]};
    }
    //a = (y2-y1)/(x2-x1)
    let a = (p1[1]-p0[1])/(p1[0]-p0[0]);
    // y = ax + b |-ax
    // b = y - ax
    let b = p0[1] - a*p0[0];
    return {a ,b};
}

const getLineEquations = (bridgeEdges) => {
    const quantity = bridgeEdges.length;
    for (let i = 0; i < quantity; i++)
    {
        equations.push([]);
        equations[i] = getLineEquation(bridgeVertices[bridgeEdges[i][0]], bridgeVertices[bridgeEdges[i][1]]);
    }
}

const addHitbox = (bridgeEdges, bridgeVertices) => {
    const quantity = bridgeEdges.length;


    for (let i = 0; i < quantity; i++)
    {
        const x1 = bridgeVertices[bridgeEdges[i][0]][0];
        const y1 = bridgeVertices[bridgeEdges[i][0]][1];
        const x2 = bridgeVertices[bridgeEdges[i][1]][0];
        const y2 = bridgeVertices[bridgeEdges[i][1]][1];

        const x_min = Math.min(x1, x2) - 20;
        const y_min = Math.min(y1, y2) - 20;
        const x_max = Math.max(x1, x2) + 20;
        const y_max = Math.max(y1, y2) + 20;

        hitboxes.push([x_min, y_min, x_max, y_max]);

    }
}

const showHitboxes = (hitboxes) => {
    const quantity = hitboxes.length;
    for (let i = 0; i< quantity; i++)
    {
        let lg = [hitboxes[i][0], hitboxes[i][1]];
        let pg = [hitboxes[i][2], hitboxes[i][1]];
        let ld = [hitboxes[i][0], hitboxes[i][3]];
        let pd = [hitboxes[i][2], hitboxes[i][3]];
        setCanvasStrokeColor("road");
        drawLine(lg[0], lg[1], pg[0], pg[1]);
        drawLine(pg[0], pg[1], pd[0], pd[1]);
        drawLine(pd[0], pd[1], ld[0], ld[1]);
        drawLine(ld[0], ld[1], lg[0], lg[1]);
    }
}

const checkHitboxInfliction = (rect1, rect2) => {
    const [x1, y1, x2, y2] = rect1;
    const [x3, y3, x4, y4] = rect2;

     if (x2 < x3 || x1 > x4 || y1 > y4 || y2 < y3) {
        return false;
    }
    return true;
}

const colliosionDetection = (equation1, equation2) => {

    let x, y;

    if (equation1.a === equation2.a && equation1.b === equation2.b) {
        console.log("Równoległe i identyczne, nieskończenie wiele punktów przecięcia");
        return { x: null, y: null };
    }

    if (equation1.a === null && equation2.a === null) {
        console.log("Obie linie są pionowe - brak przecięcia");
        return { x: null, y: null };
    }

    if (equation1.a === null) {
        x = equation1.b;
        y = equation2.a * x + equation2.b;
        return { x, y };
    }

    if (equation2.a === null) {
        x = equation2.b;
        y = equation1.a * x + equation1.b``;
        return { x, y };
    }

    x = (equation2.b - equation1.b) / (equation1.a - equation2.a);
    y = equation1.a * x + equation1.b;

    return { x, y };
}


const colliosionDetectionNeeded = (rect1, rect2, index1, index2) => {
    if(checkHitboxInfliction(rect1, rect2) === true)
    {
        colliosionDetection(equations[index1], equations[index2]);
    }
}

const start = () => {
    addHitbox(bridgeEdges, bridgeVertices);
    getLineEquations(bridgeEdges);
}

