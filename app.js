buttons = document.querySelectorAll(".btn");
// loop buttons and add onclick event
let selectedSimulation = 0;
buttons.forEach((button, index) => {
  console.log(button);
  button.addEventListener("click", () => {
    selectedSimulation = index;
    buttons.forEach((button) => {
      button.classList.remove("selected");
    });
    button.classList.add("selected");
  });
});

simSpeedEl = document.getElementById("sim-speed");
let speed = 0.4;
simSpeedEl.addEventListener("input", (e) => {
  speed = e.target.value / 100;
});

ctx = document.getElementById("life").getContext("2d");

width = window.innerWidth * 0.8;
height = window.innerHeight * 0.8;

ctx.canvas.width = width;
ctx.canvas.height = height;

draw = (x, y, color, size) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size ?? width, size ?? height);
};

particles = [];
// each particle has position(x,y), velocity(vx,vy) and color
particle = (x, y, color) => {
  return { x, y, vx: 0, vy: 0, color };
};

random = (seed) => {
  return Math.random() * seed;
}; // randomly set initial position of the particles from 0 to seed

createParticles = (number, color) => {
  group = [];
  for (let i = 0; i < number; i++) {
    group.push(particle(random(width), random(height), color));
    particles.push(group[i]);
  }
  return group;
};

// Rule to apply force of attraction between particles1 and particles2
// F = G * (m1 * m2) / r^2
// r = √(dx^2 + dy^2)
// m1 * m2 = 1 (let)
// g if positive, repulsion happens else attraction
rule = (particles1, particles2, g) => {
  for (let i = 0; i < particles1.length; i++) {
    fx = 0;
    fy = 0;
    for (let j = 0; j < particles2.length; j++) {
      p1 = particles1[i];
      p2 = particles2[j];

      // Calculating distance between two particles p1 and p2
      dx = p1.x - p2.x;
      dy = p1.y - p2.y;
      d = Math.sqrt(dx * dx + dy * dy);

      // Applying the force of attraction when distance is 0 to 80
      if (d > 0 && d < 80) {
        F = (g * 1) / d;
        fx += F * dx;
        fy += F * dy;
      }
    }

    // Updating position of particle based on velocity, 0.5 to slow down
    p1.vx = (p1.vx + fx) * speed;
    p1.vy = (p1.vy + fy) * speed;
    p1.x += p1.vx;
    p1.y += p1.vy;

    // Prevent leaving the canvas, Bounce back from wall
    if (p1.x <= 0 || p1.x >= width) {
      p1.vx *= -1;
    }
    if (p1.y <= 0 || p1.y >= height) {
      p1.vy *= -1;
    }
  }
};

orange = createParticles(500, "orange");
red = createParticles(500, "red");
green = createParticles(500, "green");
cyan = createParticles(500, "cyan");

s1 = () => {
  rule(red, red, 0.1);
  rule(orange, red, 0.15);
  rule(green, green, -0.7);
  rule(green, red, -0.2);
  rule(red, green, -0.1);
};

bird = () => {
  rule(green, green, -0.32);
  rule(green, red, -0.17);
  rule(green, orange, 0.34);
  rule(red, red, -0.1);
  rule(red, green, -0.34);
  rule(orange, orange, 0.15);
  rule(orange, green, -0.2);
};

s2 = () => {
  rule(green, green, 0.39);
  rule(green, red, -0.67);
  rule(green, orange, 0.66);
  rule(green, cyan, -0.27);
  rule(red, red, -0.28);
  rule(red, green, -0.67);
  rule(red, orange, -0.58);
  rule(red, cyan, -0.23);
  rule(orange, orange, -0.79);
  rule(orange, green, -0.66);
  rule(orange, red, -0.58);
  rule(orange, cyan, -0.223);
  rule(cyan, cyan, -0.06);
  rule(cyan, green, -0.27);
  rule(cyan, red, -0.23);
  rule(cyan, orange, -0.223);
};

s3 = () => {
  rule(red, red, 0.1);
  rule(red, orange, -0.1);
  rule(orange, orange, -0.01);
  rule(orange, green, -0.2);
  rule(green, red, -0.3);
  rule(red, orange, -0.01);
  rule(green, green, 0.01);
};

s4 = () => {};

rules = [bird, s2, s1, s3, s4];

update = () => {
  rules[selectedSimulation]();
  ctx.clearRect(0, 0, width, height);
  draw(0, 0, "black", null, { width: width, height: height });
  for (i = 0; i < particles.length; i++) {
    const { x, y, color } = particles[i];
    draw(x, y, color, 2);
  }
  requestAnimationFrame(update);
};

update();
