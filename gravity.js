// Keep track of which elements have physics bodies
const elementsWithBodies = new Map();

world.gravity.y = 0.5;

// Add walls and floor
const wallThickness = 50;
const floor = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + wallThickness / 2, window.innerWidth, wallThickness, {
    isStatic: true,
});

const leftWall = Bodies.rectangle(-wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight * 2, {
    isStatic: true,
});

const rightWall = Bodies.rectangle(window.innerWidth + wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight * 2, {
    isStatic: true,
});

World.add(world, [floor, leftWall, rightWall]);

// Add hover event listeners
boxes.forEach((el, index) => {
    el.addEventListener('mouseenter', () => {
        if (!elementsWithBodies.has(el)) {
            const rect = el.getBoundingClientRect();

            // Create physics body at current position
            const body = Bodies.rectangle(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                rect.width,
                rect.height,
                {
                    restitution: 0.6, // bounciness
                    friction: 1,    // reduce friction for more spin
                    frictionAir: 0.01 // reduce air friction for more spin
                }
            );

            // Add random initial angular velocity for spinning
            Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);

            // Add slight horizontal velocity for more interesting movement
            Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 2,
                y: 0
            });

            setTimeout(() => {
                World.add(world, body);
                el.classList.add('falling');
            }, 1000);
            elementsWithBodies.set(el, { body, width: rect.width, height: rect.height });
            el.classList.add('triggered');
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
