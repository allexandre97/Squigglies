class QuadTree {
    
    constructor(points, x0, x1, y0, y1, maxPoints = 1) {

        this.points = [];
        this.x0 = x0;
        this.x1 = x1;
        this.y0 = y0;
        this.y1 = y1;
        this.maxPoints = maxPoints;
        
        this.midx = 0.5 * (x0 + x1);
        this.midy = 0.5 * (y0 + y1);
        
        // Insert points one by one instead of storing all at once
        for (const point of points) {
            this.insert(point);
        }
    }
    
    insert(point) {
        // If point is not in bounds, don't insert it
        if (point.x < this.x0 || point.x >= this.x1 || 
            point.y < this.y0 || point.y >= this.y1) {
            return;
        }
        
        // If we haven't subdivided yet
        if (!this.BranchSW) {
            // If we have room here, add the point
            if (this.points.length < this.maxPoints) {
                this.points.push(point);
                return;
            }
            
            // Otherwise, subdivide and redistribute points
            this.subdivide();
        }
        
        // Add point to appropriate quadrant
        if (point.x < this.midx) {
            if (point.y < this.midy) {
                this.BranchSW.insert(point);
            } else {
                this.BranchNW.insert(point);
            }
        } else {
            if (point.y < this.midy) {
                this.BranchSE.insert(point);
            } else {
                this.BranchNE.insert(point);
            }
        }
    }
    
    subdivide() {
        // Create the four children
        this.BranchSW = new QuadTree([], this.x0, this.midx, this.y0, this.midy, this.maxPoints);
        this.BranchNW = new QuadTree([], this.x0, this.midx, this.midy, this.y1, this.maxPoints);
        this.BranchNE = new QuadTree([], this.midx, this.x1, this.midy, this.y1, this.maxPoints);
        this.BranchSE = new QuadTree([], this.midx, this.x1, this.y0, this.midy, this.maxPoints);
        
        // Redistribute existing points to children
        for (const point of this.points) {
            if (point.x < this.midx) {
                if (point.y < this.midy) {
                    this.BranchSW.insert(point);
                } else {
                    this.BranchNW.insert(point);
                }
            } else {
                if (point.y < this.midy) {
                    this.BranchSE.insert(point);
                } else {
                    this.BranchNE.insert(point);
                }
            }
        }
        
        // Clear points from this node since they've been redistributed
        this.points = [];
    }
    
    findPointsInRadius(point, R) {
        let pointsInRange = [];
        let radiusSquared = R * R;
        
        function searchQuadTree(node) {
            if (!node) return;
            
            // Fast bounds check before processing points
            const dx = Math.abs(point.x - node.midx);
            const dy = Math.abs(point.y - node.midy);
            const halfWidth = (node.x1 - node.x0) / 2;
            const halfHeight = (node.y1 - node.y0) / 2;
            
            // If this node's region is too far from search point, skip it
            if (dx > halfWidth + R || dy > halfHeight + R) return;
            
            // Check points in this node
            for (const p of node.points) {
                const dx = p.x - point.x;
                const dy = p.y - point.y;
                const d = dx * dx + dy * dy;
                if (d <= radiusSquared) {
                    pointsInRange.push({
                        point: p,
                        distance: Math.sqrt(d)
                    });
                }
            }
            
            // If this node has children, search them too
            if (node.BranchSW) {
                searchQuadTree(node.BranchSW);
                searchQuadTree(node.BranchNW);
                searchQuadTree(node.BranchNE);
                searchQuadTree(node.BranchSE);
            }
        }
        
        searchQuadTree(this);
        return pointsInRange.sort((a, b) => a.distance - b.distance);
    }
}