class DifferentialLine {
    constructor(maxNodes, maxForce, maxSpeed, desSeparation, cohesionRatio, edLen) {

        // Pre-calculate frequently used values
        this.desiredSeparationSq = desSeparation * desSeparation;
        this.edgeLengthSq = edLen * edLen;
        this.searchRadius = edLen * 5;
        
        // Pre-allocate arrays
        this.forces = new Array(maxNodes);
        this.tempVectors = new Array(maxNodes).fill().map(() => createVector(0, 0));
        
        this.nodes             = [];
        this.maxNodes          = maxNodes;
        this.maxForce          = maxForce;
        this.maxSpeed          = maxSpeed;
        this.desiredSeparation = desSeparation;
        this.cohesionratio     = cohesionRatio;
        this.edgeLength        = edLen;
    }

    AddNode(node){
        this.nodes.push(node);
    }

    AddNodeAtIndex(node, index){
        this.nodes.splice(index, 0, node);
    }

    PruneNodes(start = 0){

        if (this.nodes.length >= this.maxNodes) return;

        let break_loop = false;
        let n = 0;

        for (let i = 0; i < this.nodes.length; i++) {
            
            let j = (i+1) % this.nodes.length;

            let nodeA = this.nodes[i];
            let nodeB = this.nodes[j];

            let vector = p5.Vector.sub(nodeA.position, nodeB.position);
            let d      = sqrt(vector.x*vector.x + vector.y*vector.y);

            if (d > this.edgeLength){
                let midpoint = p5.Vector.add(nodeA.position, nodeB.position);
                midpoint = p5.Vector.mult(midpoint, 0.5);

                this.AddNodeAtIndex(new Node(midpoint.x, midpoint.y, this.maxSpeed, this.maxForce), j);
                break_loop = true;
                break;
            }
            n++;
        }

        if (break_loop == true){
            this.PruneNodes(n + start);
        }

        return break_loop;

    }


    CombinedForces(){

        const forces = new Array(this.nodes.length);
        const tempVecs = this.tempVectors;

        let i_p_1;
        let i_m_1;

        for (let i = 0; i < this.nodes.length; i++){

            const node = this.nodes[i];
            const force = tempVecs[i];
            force.set(0, 0);
            
            // Use squared distances to avoid sqrt operations
            const neighbors = this.Tree.findPointsInRadius(node.position, this.searchRadius);
            
            // Batch vector operations
            for (let j = 1; j < neighbors.length; j++) {
                const neighbor = neighbors[j].point;
                const dx = neighbor.x - node.position.x;
                const dy = neighbor.y - node.position.y;
                const sqDist = dx * dx + dy * dy;
                
                if (sqDist > 0 && sqDist < this.desiredSeparationSq) {
                    const invSqrt = 1 / sqrt(sqDist);
                    force.x -= dx * invSqrt;
                    force.y -= dy * invSqrt;
                }
            }

            if (force.magSq() > 0) {
                force.setMag(this.maxSpeed);
                force.sub(node.velocity);
                force.limit(this.maxForce);
            }
            ////////////////////////////////

            // HANDLES COHESION FORCE
            let cohesion = createVector(0,0);
            if (i == 0){
                i_p_1 = i+1;
                i_m_1 = this.nodes.length - 1;
            }
            else{
                i_p_1 = (i+1) % this.nodes.length;
                i_m_1 = i - 1;
            }

            let sum = createVector(0,0);
            sum.add(p5.Vector.add(this.nodes[i_m_1].position, this.nodes[i_p_1].position));
            sum.div(2);
            cohesion.add(this.nodes[i].Seek(sum));

            force.mult(this.cohesionratio);

            forces[i] = p5.Vector.add(force, cohesion);

        }

        return forces;
    }

    Differentiate(){

        let Forces = this.CombinedForces();

        for (let i = 0; i < this.nodes.length; i++){

            this.nodes[i].ApplyForce(Forces[i]);
            this.nodes[i].Update();

        }
    }

    updateTree(){
        let positions = [];
        for (const node of this.nodes){
            positions.push(createVector(node.position.x, node.position.y));
        }
        this.Tree = new QuadTree(positions, 0, WIDTH, 0, HEIGHT);

    }

    Run(n_step) {
        this.Tree;
        // Only rebuild tree every 4 frames and when nodes have moved significantly
        if (n_step == 0 || this.needsTreeUpdate()) {
            this.updateTree();
        }
        this.Differentiate();
        this.PruneNodes();
    }

    needsTreeUpdate() {
        // Check if any node has moved more than a threshold
        const threshold = this.edgeLength * 0.1;
        return this.nodes.some(node => 
            node.velocity.magSq() > threshold * threshold
        );
    }

    Draw(){

        for (let i = 0; i < this.nodes.length; i++) {
            
            let j = (i+1) % this.nodes.length;

            const nodeA = this.nodes[i];
            const nodeB = this.nodes[j];
            // circle(nodeA.position.x, nodeA.position.y, 5);
            line(nodeA.position.x, nodeA.position.y, 
                 nodeB.position.x, nodeB.position.y);
            
        }
    }

};