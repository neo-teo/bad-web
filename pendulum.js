// Keep track of which elements have physics bodies
const elementsWithBodies = new Map();

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
                    frictionAir: 0.001, // reduce air friction for more spin
                    collisionFilter: {
                        group: -1 // All bodies with group -1 will not collide with each other
                    }
                }
            );

            let threadLength = 100;

            // Create a fixed point at the box's initial position
            const fixedPoint = Bodies.circle(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2 - threadLength,
                5,
                {
                    isStatic: true,
                    render: { visible: true }, // Hide the fixed point
                    collisionFilter: {
                        group: -1 // Same group as the body
                    }
                }
            );

            // Create a constraint (the "thread")
            const constraint = Constraint.create({
                pointA: { x: fixedPoint.position.x, y: fixedPoint.position.y },
                bodyB: body,
                length: threadLength,
                render: { visible: true }
            });

            // Add random initial angular velocity for spinning
            // Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.01);

            // Add slight horizontal velocity for initial swing
            Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 5,
                y: 0
            });

            setTimeout(() => {
                World.add(world, [body, fixedPoint, constraint]);
                el.classList.add('falling');
            }, 300);

            elementsWithBodies.set(el, {
                body,
                width: rect.width,
                height: rect.height,
                constraint
            });
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
