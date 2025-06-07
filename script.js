const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
const layerCount = 3; // 3 layers for parallax
const speeds = [0.05, 0.1, 0.2]; // Slower speeds for distant stars
const baseStarCount = 50; // Base count of stars per layer
let shootingStar = null;

// Generate a random gray color for stars
function getRandomGrayColor() {
  const grayValue = Math.floor(Math.random() * 256);
  return `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
}

// Resize the canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createStars(); // Recreate stars based on new dimensions
}

// Create the starfield
function createStars() {
  stars = [];
  const scalingFactor = Math.max(canvas.width, canvas.height) / 1000; // Scale star count
  for (let i = 0; i < layerCount; i++) {
    const starCount = Math.floor(baseStarCount * scalingFactor * (i + 1));
    for (let j = 0; j < starCount; j++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        // size: Math.random() * (i + 1) + 0.5, // Larger stars for closer layers
        size: Math.random() * (i + 1) * 0.4 + 0.3, // Moderately small stars
        speed: speeds[i],
        opacity: Math.random(),
        baseOpacity: Math.random() * 0.5 + 0.5, // Base opacity for twinkling
        layer: i, // Track which layer the star belongs to
      });
    }
  }
}

// Update star positions and simulate twinkling
function updateStars() {
  stars.forEach((star) => {
    star.y -= star.speed; // All stars move upward
    star.opacity =
      star.baseOpacity + Math.sin(Date.now() * 0.001 * star.speed) * 0.3; // Smooth twinkle

    // Reset star position when it goes off-screen
    if (star.y < 0) {
      star.y = canvas.height;
      star.x = Math.random() * canvas.width;
    }
  });
}

// Draw the stars
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Add a dark radial blur gradient background
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 8, // Start small for a blur effect
    canvas.width / 2,
    canvas.height / 2,
    canvas.width // Expand to the edges
  );
  gradient.addColorStop(0, "rgba(1, 1, 1, 1)"); // Black at the edges
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw stars with parallax effect
  stars.forEach((star) => {
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}


// Animation loop
function animate() {
  updateStars();
  drawStars();
  requestAnimationFrame(animate);
}

// Handle resizing
window.addEventListener("resize", resizeCanvas);

// Initialize
resizeCanvas();
createStars();
animate();
