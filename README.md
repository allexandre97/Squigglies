# Welcome to Squigglies 

## What is this?

Squigglies is a little program that simulates [differential line growth](https://inconvergent.net/generative/differential-line/). It is built using JavaScript and the P5.js library.

![A GIF file showing an example of the squiggly simulation](squigglies.gif  "A gif of what you can expect running this program.")

## Differential Line Growth

Putting it simply, differential line growth is an algorithm able to replicate some growth patterns an shapes observed in simple organisms such as molds or lichens and, more importantly, it's cool to look at! 

The algorithm is described as follows:

1. A series of nodes are positioned one after the other.
2. The nodes are consecutively connected by edges.
3. Two type of forces act on the nodes:
    * Attraction/Repulsion forces: They act on nodes that are within a radius of each other, connected or not. Take the form of, for example $F \propto \frac{1}{r}$, which are purely repulsive, as is the case of this code. Other options include forces scaling with the inverse of the square of the radius or Lennard-Jones-type forces, which have an attractive and a repulsive region.
    * Cohesion forces: They act only on nodes that are directly connected to each other. They try to keep consecutive nodes aligned with each other. My implementation involves adding, for each node, a displacement towards the midpoint between its previous and next node that is proportional to how far the node is from said midpoint.
4. Once the forces are computed, evolve the system with a simple integration scheme. Nothing fancy is needed, a forward Euler scheme is used here and it is stable enough.
5. Once the positions of the nodes are updated, iterate over all edges. If any edge is larger than a given threshold, add a new node in the midpoint of said edge.
6. Repeat steps iii. to v. as much as you would like!

My implementation includes a couple of extra variables. Node separation tells you roughly the average equilibrium distance between any two nodes. The Cohesion - Repulsion ration tells you how important each of these forces are with respect to each other. Moreover, there is also a hard limit on the maximum number of nodes a squiggly line can have, mainly for performance issues as this is intended to run interactively. I also have implemented a quadtree as a spatial partitioning scheme that alleviates the $\mathcal{O}(N^2)$ performance of the Attraction/Repulsion step to a best-case-scenario of $\mathcal{O}(N\log(N))$.

## How do I run this?

Just clone the repository into your machine and open the index.html file with a web browser! Of course, feel free to modify whatever you want. As you may have seen, frontend is not my thing at all, so if anyone wants to improve it I will be more than happy :)