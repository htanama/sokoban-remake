const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const timerElement = document.getElementById('timer');
const messageElement = document.getElementById('message');
const scoreElement = document.getElementById('score');
const winMessageElement = document.getElementById('winMessage');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

const tileSize = 40;
let player = { x: 1, y: 1 };
let boxes = [];
let walls = [];
let circles = [];
let gameStarted = false;
let score = 0;

let timer = 0;
let timerInterval;

// Load the player image
const playerImage = new Image();
playerImage.src = 'player.png'; // Replace with the actual path to your player image

// Load the box image
const boxImage = new Image();
boxImage.src = 'box.webp'; // Replace with the actual path to your box image

// Load the wall image
const wallImage = new Image();
wallImage.src = 'wall.png'; // Replace with the actual path to your wall image

// Load the green box image
const greenBoxImage = new Image();
greenBoxImage.src = 'greenBox.png'; // Replace with the actual path to your green box image

// Ensure all images are loaded before calling draw
playerImage.onload = function() {
    boxImage.onload = function() {
        console.log('boxImage loaded');
        wallImage.onload = function() {
            // Call the draw function to render the initial state
            draw();                    
        };
    };
};  


function randomizePositions() {
    boxes = [];
    walls = [];
    circles = [];

    // Randomize walls
    for (let i = 0; i < 20; i++) {
        let wall;
        do {
            wall = { x: Math.floor(Math.random() * (canvas.width / tileSize)), y: Math.floor(Math.random() * (canvas.height / tileSize)) };
        } while (walls.some(w => w.x === wall.x && w.y === wall.y) || (wall.x === player.x && wall.y === player.y));
        walls.push(wall);
    }

    // Create walls around the edges of the canvas
    for (let i = 0; i < canvas.width / tileSize; i++) {
        walls.push({ x: i, y: 0 });
        walls.push({ x: i, y: (canvas.height / tileSize) - 1 });
    }
    for (let i = 0; i < canvas.height / tileSize; i++) {
        walls.push({ x: 0, y: i });
        walls.push({ x: (canvas.width / tileSize) - 1, y: i });
    }

    // Randomize circles
    for (let i = 0; i < 5; i++) {
        let circle;
        do {
            circle = { x: Math.floor(Math.random() * (canvas.width / tileSize)), y: Math.floor(Math.random() * (canvas.height / tileSize)) };
        } while (walls.some(wall => wall.x === circle.x && wall.y === circle.y) || circles.some(c => c.x === circle.x && c.y === circle.y) || (circle.x === player.x && circle.y === player.y));
        circles.push(circle);
    }

    // Randomize boxes
    for (let i = 0; i < 5; i++) {
        let box;
        do {
            box = { x: Math.floor(Math.random() * (canvas.width / tileSize)), y: Math.floor(Math.random() * (canvas.height / tileSize)), onCircle: false }; // New property
        } while (walls.some(wall => wall.x === box.x && wall.y === box.y) || circles.some(c => c.x === box.x && c.y === box.y) || boxes.some(b => b.x === box.x && b.y === box.y) || (box.x === player.x && box.y === player.y));
        boxes.push(box);
    }
}

/*
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw walls
    ctx.fillStyle = '#000';
    walls.forEach(wall => {
        ctx.fillRect(wall.x * tileSize, wall.y * tileSize, tileSize, tileSize);
    });

    // Draw circles
    ctx.fillStyle = '#FF0000';
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x * tileSize + tileSize / 2, circle.y * tileSize + tileSize / 2, tileSize / 4, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Draw boxes
    boxes.forEach(box => {
        ctx.fillStyle = box.onCircle ? '#00FF00' : '#A52A2A'; // Different color for boxes on circles
        ctx.fillRect(box.x * tileSize, box.y * tileSize, tileSize, tileSize);
    });

    // Draw player
    ctx.fillStyle = '#008000';
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}
    
function movePlayer(dx, dy) {
    if (!gameStarted) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (walls.some(wall => wall.x === newX && wall.y === newY)) {
        return; // Collision with wall
    }

    const box = boxes.find(box => box.x === newX && box.y === newY);
    if (box) {
        // Prevent pushing boxes that are on circles
        if (box.onCircle) return; // Can't push boxes that are already on circles

        const boxNewX = box.x + dx;
        const boxNewY = box.y + dy;

        if (walls.some(wall => wall.x === boxNewX && wall.y === boxNewY) ||
            boxes.some(b => b.x === boxNewX && b.y === boxNewY)) {
            return; // Collision with wall or another box
        }

        box.x = boxNewX;
        box.y = boxNewY;

        // Check if box is on a circle
        const circle = circles.find(circle => circle.x === box.x && circle.y === box.y);
        if (circle) {
            box.onCircle = true; // Mark the box as being on a circle
            score++;
            scoreElement.textContent = `Score: ${score}`;

            // Check if all boxes are on circles
            if (boxes.every(b => b.onCircle)) {
                winMessageElement.style.display = 'block';
                clearInterval(timerInterval);
            }
        }
    }

    player.x = newX;
    player.y = newY;
    draw();
}
    
window.addEventListener('keydown', (e) => {
    if (!gameStarted) return; // Disable movement if the game hasn't started
    switch (e.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
});

*/


function movePlayer(dx, dy) {
    if (!gameStarted) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (walls.some(wall => wall.x === newX && wall.y === newY)) {
        return; // Collision with wall
    }

    const box = boxes.find(box => box.x === newX && box.y === newY);
    if (box) {
        // Prevent pushing boxes that are on circles
        if (box.onCircle) return; // Can't push boxes that are already on circles

        const boxNewX = box.x + dx;
        const boxNewY = box.y + dy;

        if (walls.some(wall => wall.x === boxNewX && wall.y === boxNewY) ||
            boxes.some(b => b.x === boxNewX && b.y === boxNewY)) {
                return; // Collision with wall or another box
        }

        box.x = boxNewX;
        box.y = boxNewY;

        // Check if box is on a circle
        const circle = circles.find(circle => circle.x === box.x && circle.y === box.y);
        if (circle) {
            console.log('Box is on a circle. Changing image to greenBox.');
            box.onCircle = true; // Mark the box as being on a circle
            box.image = greenBoxImage; // Change the box image to greenBox
            score++;
            scoreElement.textContent = `Score: ${score}`;

            // Check if all boxes are on circles
            if (boxes.every(b => b.onCircle)) {
                winMessageElement.style.display = 'block';
                clearInterval(timerInterval);
            }
        }else{
            console.log('Box is not on a circle. Resetting image to boxImage.');
            box.onCircle = false; // If the box is moved off the circle
            box.image = boxImage; // Reset the box image to the original image
        }
    }

    player.x = newX;
    player.y = newY;
    draw();
}       

function drawPlayer() {
    ctx.drawImage(playerImage, player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

function drawBoxes() {
    boxes.forEach(box => {
        ctx.drawImage(boxImage, box.x * tileSize, box.y * tileSize, tileSize, tileSize);
    });
}

function drawWalls() {
    walls.forEach(wall => {
        ctx.drawImage(wallImage, wall.x * tileSize, wall.y * tileSize, tileSize, tileSize);
    });
}

function drawCircles() {
    ctx.fillStyle = '#FF0000';
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x * tileSize + tileSize / 2, circle.y * tileSize + tileSize / 2, tileSize / 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}                    

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawWalls();
    drawCircles();
    drawBoxes();
    drawPlayer();
}

greenBoxImage.onload = function() {
    console.log('Green box image loaded');
};



// Add event listeners for key presses
document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'ArrowUp':
            movePlayer(0, -1);
            break;
            case 'ArrowDown':
            movePlayer(0, 1);
            break;
            case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
            case 'ArrowRight':
            movePlayer(1, 0);
            break;
        }
});        


function startGame() {
    gameStarted = true;
    messageElement.style.display = 'none';
    winMessageElement.style.display = 'none';
    timer = 0;
    timerElement.textContent = `Time: ${timer}`;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = `Time: ${timer}`;
    }, 1000);
}

function resetGame() {
    gameStarted = false;
    messageElement.style.display = 'block';
    winMessageElement.style.display = 'none';
    player = { x: 1, y: 1 }; // Start position for the player
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    randomizePositions();
    clearInterval(timerInterval);
    timer = 0;
    timerElement.textContent = `Time: ${timer}`;
    draw();
}


startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);

resetGame(); // Initialize the game with randomized positions
