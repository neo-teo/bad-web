const { Engine, World, Bodies, Runner, Body, Composite } = Matter;

// Create engine and world
const engine = Engine.create();
const world = engine.world;

// Set gravity (default is already { y: 1 })
world.gravity.y = 0.5;

// Create a runner to continuously update the physics
const runner = Runner.create();
Runner.run(runner, engine);

// Select all the DOM elements
const boxes = Array.from(document.querySelectorAll('.box'));
const container = document.querySelector('.box-container');

// Position boxes in a grid
function positionBoxes() {
    const boxWidth = 100;
    const boxHeight = 100;
    const gap = 20;
    const marginTop = 20;
    const marginLeft = 20;
    const containerWidth = container.offsetWidth;
    const maxColumns = Math.floor((containerWidth + gap) / (boxWidth + gap));

    boxes.forEach((box, index) => {
        const row = Math.floor(index / maxColumns);
        const col = index % maxColumns;

        const x = marginLeft + col * (boxWidth + gap);
        const y = marginTop + row * (boxHeight + gap);

        box.style.left = `${x}px`;
        box.style.top = `${y}px`;
    });
}

// Initial positioning
positionBoxes();

// Reposition on window resize
window.addEventListener('resize', positionBoxes);

// Keep track of which elements have physics bodies
const elementsWithBodies = new Map();

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
