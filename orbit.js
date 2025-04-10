// Keep track of which elements have physics bodies
const elementsWithBodies = new Map();

// Set gravity to 0 for top-down view
world.gravity.y = 0;
world.gravity.x = 0;

// Create a fixed point at the center of the screen
const centerPoint = Bodies.circle(
    window.innerWidth / 2,
    window.innerHeight / 2,
    10,
    {
        isStatic: true,
        render: { visible: false },
        mass: 15000 // Much higher mass for stronger gravitational pull
    }
);

World.add(world, centerPoint);

// Create physics bodies for all boxes initially
boxes.forEach((el, index) => {
    const rect = el.getBoundingClientRect();

    // Create physics body at current position
    const body = Bodies.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rect.width,
        rect.height,
        {
            collisionFilter: {
                group: -1 // All bodies with group -1 will not collide with each other
            }
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

// Add hover event listeners to create orbit effect
boxes.forEach((el, index) => {
    el.addEventListener('mouseenter', () => {
        if (el.classList.contains('orbiting')) return;

        const { body } = elementsWithBodies.get(el);

        const dx = body.position.x - centerPoint.position.x;
        const dy = body.position.y - centerPoint.position.y;
        const angle = Math.atan2(dy, dx);

        const orbitalSpeed = 0.8;
        Body.setVelocity(body, {
            x: Math.cos(angle + Math.PI / 2) * orbitalSpeed,
            y: Math.sin(angle + Math.PI / 2) * orbitalSpeed
        });

        el.classList.add('orbiting');

        // TODO: setTimeout remove orbiting after 10 seconds. box should return to its original position
        //  I will prob have to store original positions in setup.js for this .. 
    });
});

// Apply gravitational forces
function applyGravity() {
    elementsWithBodies.forEach(({ body }, el) => {
        if (el.classList.contains('orbiting')) {
            const dx = centerPoint.position.x - body.position.x;
            const dy = centerPoint.position.y - body.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate gravitational force
            const G = 0.001;
            const force = G * centerPoint.mass * body.mass / (distance * distance);
            const angle = Math.atan2(dy, dx);

            // Apply gravitational force toward center
            Body.applyForce(body, body.position, {
                x: Math.cos(angle) * force,
                y: Math.sin(angle) * force
            });

            // Calculate and apply tangential force
            const tangentialForce = force * 0.7; // Adjust this multiplier to control orbit shape
            Body.applyForce(body, body.position, {
                x: Math.cos(angle + Math.PI / 2) * tangentialForce,
                y: Math.sin(angle + Math.PI / 2) * tangentialForce
            });
        }
    });
}

// Sync DOM elements with physics and add 3D effect
(function update() {
    applyGravity();

    elementsWithBodies.forEach(({ body, width, height }, el) => {
        el.style.left = `${body.position.x - width / 2}px`;
        el.style.top = `${body.position.y - height / 2}px`;
        el.style.transform = `rotate(${body.angle}rad)`;
    });

    requestAnimationFrame(update);
})();
