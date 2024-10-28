const WIDTH = 720;
const HEIGHT = 720;

let Line;

let N = 50;
let _maxForce = 0.2;
let _maxSpeed = 2;
// let _desiredSeparation = 10;
// let _separationCohesionRation = 0.4;
// let _maxEdgeLen = 10.5;

let _desiredSeparation;
let _separationCohesionRation;
let _maxEdgeLen;

let _restart;

// Cache configuration
const MAX_CACHE_FRAMES = 20;

class OptimizedCache {
    constructor(maxFrames) {
        this.frames = [];
        this.maxFrames = maxFrames;
    }
    
    add(nodes) {
        // Create new array of vectors for positions only
        const positions = nodes.map(node => 
            createVector(node.position.x, node.position.y)
        );
        
        // Add to frames array
        if (this.frames.length >= this.maxFrames) {
            this.frames.shift(); // Remove oldest frame
        }
        this.frames.push(positions);
    }
    
    draw() {
        background(220);
        
        // Draw from oldest to newest
        this.frames.forEach((positions, index) => {
            const alpha = map(index, 0, this.frames.length - 1, 50, 150);
            stroke(alpha);
            
            // Draw lines between positions
            for (let i = 0; i < positions.length; i++) {
                const next = (i + 1) % positions.length;
                line(
                    positions[i].x, positions[i].y,
                    positions[next].x, positions[next].y
                );
            }
        });
    }
}

let frame = 0;


function resetSim(){
    Line = new DifferentialLine(500, _maxForce, _maxSpeed, _desiredSeparation.value(), 
                               _separationCohesionRation.value(), _maxEdgeLen.value());

    let Ang = TWO_PI/N;
    let ray = 60;

    for (let a = 0; a < TWO_PI; a += Ang) {
        let x = WIDTH/2 + cos(a) * ray;
        let y = HEIGHT/2 + sin(a) * ray;
        Line.AddNode(new Node(x, y, _maxSpeed, _maxForce));
    }

    // Initialize cache
    lineCache = new OptimizedCache(MAX_CACHE_FRAMES);

    frame = 0;
}

let vertical_spacing = 0;
let text_x_position;

function setup() {

    _restart = createButton("Restart the Simulation");
    vertical_spacing += _restart.height + 200;
    _restart.position(WIDTH*1.05, vertical_spacing);
    _restart.mouseClicked(resetSim);

    _desiredSeparation = createSlider(1, 30, 10, 0);
    vertical_spacing += _desiredSeparation.height*3
    _desiredSeparation.position(WIDTH*1.05, vertical_spacing);
    let txt_sep = createDiv("Node Separation");
    txt_sep.style("color", "white");
    txt_sep.position(_desiredSeparation.x, _desiredSeparation.y+25);

    _separationCohesionRation = createSlider(0.5, 1.5, 1.01, 0);
    vertical_spacing += _separationCohesionRation.height*3.5
    _separationCohesionRation.position(WIDTH*1.05, vertical_spacing);
    let txt_rat = createDiv("Cohesion - Repulsion Ratio");
    txt_rat.style("color", "white");
    txt_rat.position(_separationCohesionRation.x, _separationCohesionRation.y+25);

    _maxEdgeLen = createSlider(0.5, 30, 11, 0);
    vertical_spacing += _maxEdgeLen.height*3.5
    _maxEdgeLen.position(WIDTH*1.05, vertical_spacing);
    let txt_len = createDiv("Max Edge Length");
    txt_len.style("color", "white");
    txt_len.position(_maxEdgeLen.x, _maxEdgeLen.y+25);


    Line = new DifferentialLine(500, _maxForce, _maxSpeed, _desiredSeparation.value(), 
                               _separationCohesionRation.value(), _maxEdgeLen.value());

    let Ang = TWO_PI/N;
    let ray = 60;

    for (let a = 0; a < TWO_PI; a += Ang) {
        let x = WIDTH/2 + cos(a) * ray;
        let y = HEIGHT/2 + sin(a) * ray;
        Line.AddNode(new Node(x, y, _maxSpeed, _maxForce));
    }

    // Initialize cache
    lineCache = new OptimizedCache(MAX_CACHE_FRAMES);

    createCanvas(WIDTH, HEIGHT);
    // noLoop();
}

function draw() {

    Line.Run(frame);

    lineCache.add(Line.nodes);
    
    if (frame % 1 == 0) {
        lineCache.draw();
    }

    frame++;
    
    Line.UpdateValues(_desiredSeparation.value(), _separationCohesionRation.value(), _maxEdgeLen.value());

}
