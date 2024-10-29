class Node {
    constructor(_x = 0.0, _y = 0.0, maxS = 1.0, maxF = 1.0) {
        // Pre-allocate vectors
        this.position = createVector(_x, _y);
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.acceleration = createVector(0, 0);
        this.tempVector = createVector(0, 0); // Reusable vector for calculations
        
        this.maxForce = maxF;
        this.maxSpeed = maxS;
        this.maxSpeedSquared = maxS * maxS; // Cache squared value
    }
    
    Update() {
        // Use SIMD-friendly operations
        this.velocity.x += this.acceleration.x + random(-0.1, 0.1);
        this.velocity.y += this.acceleration.y + random(-0.1, 0.1);
        
        const speedSq = this.velocity.x * this.velocity.x + 
                        this.velocity.y * this.velocity.y;
                       
        if (speedSq > this.maxSpeedSquared) {
            const scale = this.maxSpeed / sqrt(speedSq);
            this.velocity.x *= scale;
            this.velocity.y *= scale;
        }
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.acceleration.x = this.acceleration.y = 0;
    }

    ApplyForce(force){
        this.acceleration.add(force);
    }


    Seek(other_position){
        
        let vector = other_position.sub(this.position);
        vector.setMag(this.maxSpeed);
        let steer = vector.sub(this.velocity);
        steer.limit(this.maxForce);

        return steer;
    }

    Draw(){
        fill(0);
        circle(this.position.x, this.position.y, 50)
    }
}