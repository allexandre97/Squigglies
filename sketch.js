const WIDTH = 720;
const HEIGHT = 720;

let Line;

let N = 50;
let _maxForce = 0.2;
let _maxSpeed = 2;
let _desiredSeparation = 10;
let _separationCohesionRation = 0.4;
let _maxEdgeLen = 10.5;

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

            // for (let i = 0; i < positions.length; i++){

            //   let anchor_a = positions[i];
            //   let anchor_b = positions[(i+3)%positions.length];
            //   let control_a = positions[(i+1)%positions.length];
            //   let control_b = positions[(i+2)%positions.length];
            //   noFill();
            //   bezier(anchor_a.x, anchor_a.y,
            //          control_a.x, control_a.y,
            //          control_b.x, control_b.y,
            //          anchor_b.x, anchor_b.y
            //   );

            // }

        });
    }
}

function setup() {
    Line = new DifferentialLine(500, _maxForce, _maxSpeed, _desiredSeparation, 
                               _separationCohesionRation, _maxEdgeLen);

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

let frame = 0;

function draw() {

    Line.Run(frame);

    lineCache.add(Line.nodes);
    
    if (frame % 1 === 0) {
        lineCache.draw();
    }

    frame++;
}
