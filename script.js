const gameContainer = document.getElementById("game-container");
const score = document.getElementById("score");
const gameMenu = document.getElementById("game-menu");
const startButton = document.getElementById("start-button");
const gameOver = document.getElementById("game-over");
const playAgain = document.getElementById("play-again");
const menu = document.getElementById("menu");
const damage = document.getElementById("damage");

let playerScore = 0;
let heart = 3;
let isGameStarted = false;
const bullets = [];

var trackAudio = new Audio("audios/track.mp3");
var shotgunAudio = new Audio("audios/shotgun.mp3");
var bloodAudio = new Audio("audios/blood.mp3");

const apiKey = "88b9f61a9fff1753ad0c186774bbc601";

async function getWeather() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Baku&appid=${apiKey}&units=metric`);
        const data = await response.json();
        const temperature = data.main.temp;
        document.getElementById("temperature").textContent = `${temperature} °C`;
    }
    
    catch (error) {
        console.log(error);
    }
}
window.addEventListener("load", getWeather);

function load() {
    requestAnimationFrame(load);
    trackAudio.play();
}
requestAnimationFrame(load);

startButton.addEventListener("click", () => {
    isGameStarted = true;
    playerScore = 0;
    heart = 3;
    score.textContent = "Score: " + playerScore;
    document.getElementById("heart-count").textContent = heart;
    gameMenu.style.display = "none";
    gameContainer.style.display = "block";
    
    var children = Array.from(gameContainer.children);
    for (var i = 0; i < children.length; i++) {
        if (children[i].className == "zombie") {
            gameContainer.removeChild(children[i]);
        }
    }
    
    setInterval(createZombie, 1500);
    gameLoop();
});

playAgain.addEventListener("click", () => {
    isGameStarted = true;
    playerScore = 0;
    heart = 3;
    score.textContent = "Score: " + playerScore;
    document.getElementById("heart-count").textContent = heart;
    gameOver.style.display = "none";
    
    var children = Array.from(gameContainer.children);
    for (var i = 0; i < children.length; i++) {
        if (children[i].className == "zombie") {
            gameContainer.removeChild(children[i]);
        }
    }
    
    setInterval(createZombie, 1500);
    gameLoop();
});

menu.addEventListener("click", () => {
    gameOver.style.display = "none";
    gameContainer.style.display = "none";
    gameMenu.style.display = "flex";

    var children = Array.from(gameContainer.children);
    for (var i = 0; i < children.length; i++) {
        if (children[i].className == "zombie") {
            gameContainer.removeChild(children[i]);
        }
    }
});

function createZombie() {
    if (isGameStarted) {
        const zombie = document.createElement("div");
        zombie.classList.add("zombie");
        zombie.style.left = gameContainer.clientWidth + "px";
        zombie.style.bottom = "10px";
        gameContainer.appendChild(zombie);

        var randomSpeed = generateRandomFloatInRange(0.5, 5);

        const moveZombie = () => {
            if (zombie.offsetLeft > -50) {
                zombie.style.left = zombie.offsetLeft - randomSpeed + "px";

                bullets.forEach((bullet, index) => {
                    if (checkCollision(bullet, zombie)) {
                        gameContainer.removeChild(bullet);
                        bullets.splice(index, 1);
                        
                        gameContainer.removeChild(zombie);
                        var bloodAudioCopy = bloodAudio.cloneNode();
                        bloodAudioCopy.play();
                        playerScore += 10;
                        score.textContent = "Score: " + playerScore;
                    }
                });

                requestAnimationFrame(moveZombie);
            }
            
            else {
                if (isGameStarted) {
                    gameContainer.removeChild(zombie);
                    heart--;
                    document.getElementById("heart-count").textContent = heart;

                    damage.classList.add("active");
                    setTimeout(function() {
                        damage.classList.remove("active");
                    }, 400);
                    
                    if (heart == 0) {
                        isGameStarted = false;
                        gameOver.style.display = "block";
                        document.getElementById("game-over-score").textContent = "Score: " + playerScore;
                    }
                }
            }
        };

        moveZombie();
    }
}

function createBullet() {
    if (isGameStarted) {
        const bullet = document.createElement("div");
        bullet.classList.add("bullet");
        gameContainer.appendChild(bullet);
        bullets.push(bullet);
        var shotgunAudioCopy = shotgunAudio.cloneNode();
        shotgunAudioCopy.play();
		
		const muzzle = document.createElement("div");
		muzzle.classList.add("muzzle");
        gameContainer.appendChild(muzzle);
		setTimeout(function() {
            gameContainer.removeChild(muzzle);
        }, 100);

        const moveBullet = () => {
            if (bullet.offsetLeft < gameContainer.clientWidth) {
                bullet.style.left = bullet.offsetLeft + 15 + "px";
                requestAnimationFrame(moveBullet);
            }
            
            else {
                gameContainer.removeChild(bullet);
                bullets.shift();
            }
        };

        moveBullet();
    }
}

gameContainer.addEventListener("click", (event) => {
    if (isGameStarted) {
        createBullet();
    }
});

function checkCollision(bullet, zombie) {
    const bulletRect = bullet.getBoundingClientRect();
    const zombieRect = zombie.getBoundingClientRect();
    
    return (
        bulletRect.left < zombieRect.right &&
        bulletRect.right > zombieRect.left &&
        bulletRect.top < zombieRect.bottom &&
        bulletRect.bottom > zombieRect.top
    );
}

function generateRandomFloatInRange(min, max) {
    return (Math.random() * (max - min + 1)) + min;
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
}
