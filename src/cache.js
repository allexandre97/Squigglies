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