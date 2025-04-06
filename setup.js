/**
 * MATTER.JS SETUP
 */

const { Engine, World, Bodies, Runner, Body, Composite, Constraint } = Matter;

// Create engine and world
const engine = Engine.create();
const world = engine.world;

// Set gravity (default is already { y: 1 })
world.gravity.y = 0.5;

// Create a runner to continuously update the physics
const runner = Runner.create();
Runner.run(runner, engine);


/**
 * INITIAL BOX POSITIONS
 */

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