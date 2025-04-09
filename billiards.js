// Keep track of which elements have physics bodies
const elementsWithBodies = new Map();

// Keep track of last trigger time for each element
const lastTriggerTimes = new Map();
const DEBOUNCE_TIME = 3000; // 3 seconds in milliseconds

// Set gravity to 0 for top-down view
world.gravity.y = 0;
world.gravity.x = 0;

// Add walls around the viewport
const wallThickness = 50;
const floor = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + wallThickness / 2, window.innerWidth, wallThickness, {
    isStatic: true,
    restitution: 0.8 // Bouncy walls
});

const ceiling = Bodies.rectangle(window.innerWidth / 2, -wallThickness / 2, window.innerWidth, wallThickness, {
    isStatic: true,
    restitution: 0.8
});

const leftWall = Bodies.rectangle(-wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight * 2, {
    isStatic: true,
    restitution: 0.8
});

const rightWall = Bodies.rectangle(window.innerWidth + wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight * 2, {
    isStatic: true,
    restitution: 0.8
});

World.add(world, [floor, ceiling, leftWall, rightWall]);

// Create physics bodies for all boxes initially
boxes.forEach((el, index) => {
    const rect = el.getBoundingClientRect();

    // Set higher density for image boxes
    const density = el.tagName === 'IMG' ? 0.01 : 0.00001;

    // Create physics body at current position
    const body = Bodies.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rect.width,
        rect.height,
        {
            restitution: 0.8, // High bounciness for pool-like collisions
            friction: 0.04,   // Low friction to keep things moving
            frictionAir: 0.01, // Air resistance to eventually slow down
            density: density    // Higher density for images
        }
    );

    // Add to world immediately
    World.add(world, body);
    el.classList.add('falling');

    elementsWithBodies.set(el, {
        body,
        width: rect.width,
        height: rect.height
    });
});

// Add hover event listeners to apply force to boxes
boxes.forEach((el, index) => {
    el.addEventListener('mouseenter', () => {
        const now = Date.now();
        const lastTrigger = lastTriggerTimes.get(el) || 0;

        // Only trigger if enough time has passed
        if (now - lastTrigger >= DEBOUNCE_TIME) {
            const { body } = elementsWithBodies.get(el);

            // Calculate random direction
            const angle = Math.random() * Math.PI * 2; // Random angle in radians
            const forceMagnitude = el.tagName === 'IMG' ? 2 : 0.002; // Higher force for lighter boxes

            // Apply force in the calculated direction
            Body.applyForce(body, body.position, {
                x: Math.cos(angle) * forceMagnitude,
                y: Math.sin(angle) * forceMagnitude
            });

            // Update last trigger time
            lastTriggerTimes.set(el, now);

            el.classList.add('cueball');
            setTimeout(() => {
                el.classList.remove('cueball');
            }, DEBOUNCE_TIME);
        }
    });
});

// Sync DOM elements with physics
(function update() {
    elementsWithBodies.forEach(({ body, width, height }, el) => {
        el.style.left = `${body.position.x - width / 2}px`;
        el.style.top = `${body.position.y - height / 2}px`;
        el.style.transform = `rotate(${body.angle}rad)`;
    });

    requestAnimationFrame(update);
})(); 