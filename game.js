// ===================================
// SOE INVADERS - Phase 5
// ===================================

// === CONFIGURATION ===
const CONFIG = {
    // Canvas
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,

    // Game timing
    GAME_DURATION: 60,
    COUNTDOWN_DURATION: 3,

    // Player
    PLAYER_WIDTH: 50,
    PLAYER_HEIGHT: 30,
    PLAYER_SPEED: 300,
    PLAYER_LIVES: 3,
    PLAYER_FIRE_COOLDOWN: 0.3,

    // Projectile
    PROJECTILE_WIDTH: 4,
    PROJECTILE_HEIGHT: 15,
    PROJECTILE_SPEED: 400,

    // Enemy types
    ENEMY_WIDTH: 40,
    ENEMY_HEIGHT: 30,
    ENEMY_TYPES: [
        {
            name: 'Unpatched Image',
            shortName: 'Unpatched',
            issue: 'Missing Security Patches',
            points: 100,
            baseSpeed: 35,
            color: '#ff4444',
            horizontalSpeed: 20
        },
        {
            name: 'Unsecured Image',
            shortName: 'Unsecured',
            issue: 'Missing Agents',
            points: 150,
            baseSpeed: 50,
            color: '#ff8800',
            horizontalSpeed: 30
        },
        {
            name: 'Incomplete Image',
            shortName: 'Incomplete',
            issue: 'No Monitoring/Backup',
            points: 200,
            baseSpeed: 65,
            color: '#ffff00',
            horizontalSpeed: 40
        }
    ],

    // Difficulty progression
    DIFFICULTY_LEVELS: [
        {
            time: 0,
            spawnInterval: 2.5,
            speedMultiplier: 1.0,
            description: 'Easy'
        },
        {
            time: 20,
            spawnInterval: 1.8,
            speedMultiplier: 1.3,
            description: 'Moderate'
        },
        {
            time: 40,
            spawnInterval: 1.2,
            speedMultiplier: 1.6,
            description: 'Challenging'
        }
    ],

    // Colors
    PLAYER_COLOR: '#00ff00',
    PROJECTILE_COLOR: '#ffffff',

    // Performance ratings
    PERFORMANCE_RATINGS: [
        { minScore: 0, rating: 'Cloud Rookie' },
        { minScore: 400, rating: 'Cloud Defender' },
        { minScore: 1200, rating: 'Cloud Guardian' },
        { minScore: 2400, rating: 'Gold Standard Hero' }
    ],

    // Branding
    BRANDING: {
        title: 'SOE INVADERS',
        subtitle: 'Cenitex Managed SOEs vs Marketplace Threats',
        organization: 'CONNECT',
        cloudProviders: ['AWS', 'Azure', 'OCI', 'VMware']
    },

    // Visual effects
    PARTICLE_COUNT: 12,
    PARTICLE_SPEED: 150,
    PARTICLE_LIFETIME: 0.6,
    SCREEN_SHAKE_DURATION: 0.1,
    SCREEN_SHAKE_INTENSITY: 2
};

// === GAME STATES ===
const GameStates = {
    WELCOME: 'welcome',
    INSTRUCTIONS: 'instructions',
    COUNTDOWN: 'countdown',
    GAMEPLAY: 'gameplay',
    PAUSED: 'paused',
    RESULTS: 'results'
};

// === GAME STATE ===
const GAME = {
    state: GameStates.WELCOME,
    score: 0,
    lives: CONFIG.PLAYER_LIVES,
    timeRemaining: CONFIG.GAME_DURATION,
    countdownRemaining: CONFIG.COUNTDOWN_DURATION,
    enemiesDestroyed: 0
};

// === INPUT STATE ===
const Input = {
    keys: {},
    mouse: {
        x: 0,
        y: 0,
        clicked: false,
        isActive: false
    },
    touch: {
        x: 0,
        y: 0,
        active: false,
        tapped: false
    }
};

// === CANVAS SETUP ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// === ENTITY CLASSES ===

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PLAYER_WIDTH;
        this.height = CONFIG.PLAYER_HEIGHT;
        this.speed = CONFIG.PLAYER_SPEED;
        this.fireCooldown = 0;
    }

    update(deltaTime) {
        // Handle keyboard movement
        let keyboardMovement = false;
        if (Input.keys['ArrowLeft'] || Input.keys['a'] || Input.keys['A']) {
            this.x -= this.speed * deltaTime;
            keyboardMovement = true;
        }
        if (Input.keys['ArrowRight'] || Input.keys['d'] || Input.keys['D']) {
            this.x += this.speed * deltaTime;
            keyboardMovement = true;
        }

        // Handle touch movement (priority over mouse)
        if (!keyboardMovement && Input.touch.active) {
            const targetX = Input.touch.x - this.width / 2;
            const dx = targetX - this.x;

            // Smooth movement towards touch position
            if (Math.abs(dx) > 2) {
                const moveAmount = Math.sign(dx) * this.speed * deltaTime * 1.5;
                this.x += moveAmount;
            } else {
                this.x = targetX;
            }
        }
        // Handle mouse movement (only if no keyboard input, no touch, and mouse is active)
        else if (!keyboardMovement && !Input.touch.active && Input.mouse.isActive) {
            const targetX = Input.mouse.x - this.width / 2;
            const dx = targetX - this.x;

            // Smooth movement towards mouse position
            if (Math.abs(dx) > 2) {
                const moveAmount = Math.sign(dx) * this.speed * deltaTime * 1.5;
                this.x += moveAmount;
            } else {
                this.x = targetX;
            }
        }

        // Keep player within bounds
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > CONFIG.CANVAS_WIDTH) {
            this.x = CONFIG.CANVAS_WIDTH - this.width;
        }

        // Update fire cooldown
        if (this.fireCooldown > 0) {
            this.fireCooldown -= deltaTime;
        }

        // Handle firing - keyboard spacebar, mouse click, or touch tap
        if ((Input.keys[' '] || Input.mouse.clicked || Input.touch.tapped) && this.fireCooldown <= 0) {
            this.fire();
            this.fireCooldown = CONFIG.PLAYER_FIRE_COOLDOWN;
        }

        // Reset click/tap after processing
        if (Input.mouse.clicked) {
            Input.mouse.clicked = false;
        }
        if (Input.touch.tapped) {
            Input.touch.tapped = false;
        }
    }

    fire() {
        const projectileX = this.x + this.width / 2 - CONFIG.PROJECTILE_WIDTH / 2;
        const projectileY = this.y;
        projectiles.push(new Projectile(projectileX, projectileY));
    }

    draw(ctx) {
        // Draw player as rectangle with border
        ctx.fillStyle = CONFIG.PLAYER_COLOR;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = CONFIG.PLAYER_COLOR;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Draw "Cenitex SOE" label above player
        ctx.save();
        ctx.font = 'bold 9px "Courier New", monospace';
        ctx.fillStyle = CONFIG.PLAYER_COLOR;
        ctx.textAlign = 'center';
        ctx.shadowBlur = 5;
        ctx.shadowColor = CONFIG.PLAYER_COLOR;
        ctx.fillText('CENITEX SOE', this.x + this.width / 2, this.y - 5);
        ctx.shadowBlur = 0;
        ctx.restore();
    }
}

class Enemy {
    constructor(x, y, type, speedMultiplier = 1.0) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.ENEMY_WIDTH;
        this.height = CONFIG.ENEMY_HEIGHT;
        this.type = type;
        this.speed = type.baseSpeed * speedMultiplier;
        this.horizontalSpeed = type.horizontalSpeed * speedMultiplier;
        this.points = type.points;
        this.direction = Math.random() < 0.5 ? -1 : 1; // Random horizontal direction
    }

    update(deltaTime) {
        // Vertical movement (downward)
        this.y += this.speed * deltaTime;

        // Horizontal movement (side to side)
        this.x += this.horizontalSpeed * this.direction * deltaTime;

        // Bounce off walls
        if (this.x <= 0 || this.x + this.width >= CONFIG.CANVAS_WIDTH) {
            this.direction *= -1;
            // Clamp position to keep within bounds
            if (this.x < 0) this.x = 0;
            if (this.x + this.width > CONFIG.CANVAS_WIDTH) {
                this.x = CONFIG.CANVAS_WIDTH - this.width;
            }
        }
    }

    draw(ctx) {
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.type.color;

        // Draw enemy with type-specific color
        ctx.fillStyle = this.type.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw border for visual distinction
        ctx.strokeStyle = this.type.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        ctx.shadowBlur = 0;

        // Draw issue label below enemy
        ctx.save();
        ctx.font = '8px "Courier New", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 3;
        ctx.shadowColor = '#000000';
        ctx.fillText(this.type.issue, this.x + this.width / 2, this.y + this.height + 10);
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    isOffScreen() {
        return this.y > CONFIG.CANVAS_HEIGHT;
    }

    reachedBottom() {
        return this.y + this.height >= CONFIG.CANVAS_HEIGHT;
    }
}

class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PROJECTILE_WIDTH;
        this.height = CONFIG.PROJECTILE_HEIGHT;
        this.speed = CONFIG.PROJECTILE_SPEED;
    }

    update(deltaTime) {
        this.y -= this.speed * deltaTime;
    }

    draw(ctx) {
        // Glow effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = CONFIG.PROJECTILE_COLOR;
        ctx.fillStyle = CONFIG.PROJECTILE_COLOR;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;

        // Draw "SOE" label next to projectile
        ctx.save();
        ctx.font = '7px "Courier New", monospace';
        ctx.fillStyle = CONFIG.PLAYER_COLOR;
        ctx.textAlign = 'left';
        ctx.shadowBlur = 5;
        ctx.shadowColor = CONFIG.PLAYER_COLOR;
        ctx.fillText('SOE', this.x + 7, this.y + this.height / 2 + 2);
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    isOffScreen() {
        return this.y + this.height < 0;
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * CONFIG.PARTICLE_SPEED * 2;
        this.vy = (Math.random() - 0.5) * CONFIG.PARTICLE_SPEED * 2;
        this.life = CONFIG.PARTICLE_LIFETIME;
        this.maxLife = CONFIG.PARTICLE_LIFETIME;
        this.color = color;
        this.size = Math.random() * 3 + 2;
    }

    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.life -= deltaTime;
        this.vy += 200 * deltaTime; // Gravity
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }

    isDead() {
        return this.life <= 0;
    }
}

// === GAME ARRAYS ===
let player;
let enemies = [];
let projectiles = [];
let particles = [];

// === VISUAL EFFECTS ===
let screenShake = {
    duration: 0,
    intensity: 0
};

function createParticles(x, y, color, count = CONFIG.PARTICLE_COUNT) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function triggerScreenShake() {
    screenShake.duration = CONFIG.SCREEN_SHAKE_DURATION;
    screenShake.intensity = CONFIG.SCREEN_SHAKE_INTENSITY;
}

// === SPAWN SYSTEM ===
let spawnTimer = 0;

function getCurrentDifficulty() {
    const elapsedTime = CONFIG.GAME_DURATION - GAME.timeRemaining;
    let difficulty = CONFIG.DIFFICULTY_LEVELS[0];

    for (let level of CONFIG.DIFFICULTY_LEVELS) {
        if (elapsedTime >= level.time) {
            difficulty = level;
        }
    }

    return difficulty;
}

function spawnEnemy() {
    const difficulty = getCurrentDifficulty();

    // Randomly select enemy type
    const randomType = CONFIG.ENEMY_TYPES[Math.floor(Math.random() * CONFIG.ENEMY_TYPES.length)];

    // Random spawn position at top
    const x = Math.random() * (CONFIG.CANVAS_WIDTH - CONFIG.ENEMY_WIDTH);
    const y = -CONFIG.ENEMY_HEIGHT;

    enemies.push(new Enemy(x, y, randomType, difficulty.speedMultiplier));
}

// === COLLISION DETECTION ===
function checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function checkCollisions() {
    // Projectiles vs Enemies
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let projectileHit = false;
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (projectiles[i] && enemies[j] && checkCollision(projectiles[i], enemies[j])) {
                const enemy = enemies[j];

                // Add score
                GAME.score += enemy.points;
                GAME.enemiesDestroyed++;

                // Create particle explosion
                const particleX = enemy.x + enemy.width / 2;
                const particleY = enemy.y + enemy.height / 2;
                createParticles(particleX, particleY, enemy.type.color);

                // Remove enemy
                enemies.splice(j, 1);

                // Mark projectile for removal
                projectileHit = true;
                break;
            }
        }

        // Remove projectile if it hit something
        if (projectileHit) {
            projectiles.splice(i, 1);
        }
    }

    // Enemies reaching bottom (lose life)
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].reachedBottom()) {
            const enemy = enemies[i];

            // Create particles at bottom
            const particleX = enemy.x + enemy.width / 2;
            const particleY = CONFIG.CANVAS_HEIGHT - 10;
            createParticles(particleX, particleY, '#ff0000', 8);

            // Screen shake on life lost
            triggerScreenShake();

            enemies.splice(i, 1);
            GAME.lives--;

            if (GAME.lives <= 0) {
                GAME.state = GameStates.RESULTS;
            }
        }
    }
}

// === UPDATE ===
function update(deltaTime) {
    switch (GAME.state) {
        case GameStates.COUNTDOWN:
            updateCountdown(deltaTime);
            break;
        case GameStates.GAMEPLAY:
            updateGameplay(deltaTime);
            break;
    }
}

function updateCountdown(deltaTime) {
    GAME.countdownRemaining -= deltaTime;
    if (GAME.countdownRemaining <= 0) {
        GAME.state = GameStates.GAMEPLAY;
    }
}

function updateGameplay(deltaTime) {
    // Update timer
    GAME.timeRemaining -= deltaTime;
    if (GAME.timeRemaining <= 0) {
        GAME.timeRemaining = 0;
        GAME.state = GameStates.RESULTS;
        return;
    }

    // Update screen shake
    if (screenShake.duration > 0) {
        screenShake.duration -= deltaTime;
    }

    // Update player
    player.update(deltaTime);

    // Update projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].update(deltaTime);
        if (projectiles[i].isOffScreen()) {
            projectiles.splice(i, 1);
        }
    }

    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update(deltaTime);
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(deltaTime);
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }

    // Spawn enemies based on current difficulty
    const difficulty = getCurrentDifficulty();
    spawnTimer += deltaTime;
    if (spawnTimer >= difficulty.spawnInterval) {
        spawnEnemy();
        spawnTimer = 0;
    }

    // Check collisions
    checkCollisions();
}

// === RENDER ===
function render() {
    // Apply screen shake
    ctx.save();
    if (screenShake.duration > 0) {
        const shakeX = (Math.random() - 0.5) * screenShake.intensity;
        const shakeY = (Math.random() - 0.5) * screenShake.intensity;
        ctx.translate(shakeX, shakeY);
    }

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.CANVAS_HEIGHT);
    gradient.addColorStop(0, '#0a0a2a');
    gradient.addColorStop(0.5, '#0a0a1a');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Draw starfield effect
    drawStarfield();

    switch (GAME.state) {
        case GameStates.WELCOME:
            renderWelcome();
            break;
        case GameStates.INSTRUCTIONS:
            renderInstructions();
            break;
        case GameStates.COUNTDOWN:
            renderCountdown();
            break;
        case GameStates.GAMEPLAY:
            renderGameplay();
            break;
        case GameStates.PAUSED:
            renderPaused();
            break;
        case GameStates.RESULTS:
            renderResults();
            break;
    }

    ctx.restore();
}

// Simple starfield background
let stars = [];
function initStars() {
    for (let i = 0; i < 50; i++) {
        stars.push({
            x: Math.random() * CONFIG.CANVAS_WIDTH,
            y: Math.random() * CONFIG.CANVAS_HEIGHT,
            size: Math.random() * 2,
            alpha: Math.random() * 0.5 + 0.3
        });
    }
}

function drawStarfield() {
    for (let star of stars) {
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1;
}

function renderWelcome() {
    ctx.textAlign = 'center';

    // Title with glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ff00';
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 64px "Courier New", monospace';
    ctx.fillText(CONFIG.BRANDING.title, CONFIG.CANVAS_WIDTH / 2, 140);
    ctx.shadowBlur = 0;

    // Subtitle with cyan glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';
    ctx.fillStyle = '#00ffff';
    ctx.font = '22px "Courier New", monospace';
    ctx.fillText(CONFIG.BRANDING.subtitle, CONFIG.CANVAS_WIDTH / 2, 190);
    ctx.shadowBlur = 0;

    // Organization badge
    ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.fillRect(CONFIG.CANVAS_WIDTH / 2 - 80, 210, 160, 35);
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(CONFIG.CANVAS_WIDTH / 2 - 80, 210, 160, 35);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillText(CONFIG.BRANDING.organization, CONFIG.CANVAS_WIDTH / 2, 235);

    // Cloud providers
    ctx.fillStyle = '#888888';
    ctx.font = '14px "Courier New", monospace';
    ctx.fillText('Gold Standard SOEs across:', CONFIG.CANVAS_WIDTH / 2, 280);

    const providers = CONFIG.BRANDING.cloudProviders.join('  •  ');
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillText(providers, CONFIG.CANVAS_WIDTH / 2, 305);

    // Instructions with pulse effect
    const pulseAlpha = 0.5 + Math.sin(Date.now() / 300) * 0.3;
    ctx.globalAlpha = pulseAlpha;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffff00';
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.fillText('Press SPACE to Start', CONFIG.CANVAS_WIDTH / 2, 380);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#aaaaaa';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText('Press I for Instructions', CONFIG.CANVAS_WIDTH / 2, 420);

    // Decorative lines
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 460);
    ctx.lineTo(700, 460);
    ctx.stroke();

    // Footer message
    ctx.fillStyle = '#888888';
    ctx.font = '14px "Courier New", monospace';
    ctx.fillText('Cenitex Gold Standard SOEs eliminate marketplace image risks', CONFIG.CANVAS_WIDTH / 2, 500);
    ctx.fillText('Engineered with GitHub Actions & HashiCorp Packer', CONFIG.CANVAS_WIDTH / 2, 525);
}

function renderInstructions() {
    ctx.textAlign = 'center';

    // Title
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 36px "Courier New", monospace';
    ctx.fillText('HOW TO PLAY', CONFIG.CANVAS_WIDTH / 2, 60);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px "Courier New", monospace';

    const instructions = [
        'OBJECTIVE:',
        '  Use Cenitex managed SOEs to eliminate marketplace threats',
        '',
        'KEYBOARD CONTROLS:',
        '  Arrow Keys or A/D - Move left and right',
        '  Spacebar - Fire Cenitex SOE solutions',
        '  ESC - Pause game',
        '',
        'MOUSE/TOUCH CONTROLS:',
        '  Move Mouse/Drag - Player follows position',
        '  Click/Tap - Fire Cenitex SOE solutions',
        '',
        'MARKETPLACE IMAGE THREATS:',
        '  Missing Security Patches (Red) - 100 points',
        '  Missing Agents (Orange) - 150 points',
        '  No Monitoring/Backup (Yellow) - 200 points',
        '',
        'GAMEPLAY:',
        '  • Eliminate threats before they reach your environment',
        '  • You have 3 lives - lose one when a threat reaches bottom',
        '  • Difficulty increases every 20 seconds',
        '  • Survive 60 seconds to complete the mission'
    ];

    let y = 110;
    for (let line of instructions) {
        if (line.includes('Unpatched')) {
            ctx.fillStyle = CONFIG.ENEMY_TYPES[0].color;
        } else if (line.includes('Unsecured')) {
            ctx.fillStyle = CONFIG.ENEMY_TYPES[1].color;
        } else if (line.includes('Incomplete')) {
            ctx.fillStyle = CONFIG.ENEMY_TYPES[2].color;
        } else {
            ctx.fillStyle = '#ffffff';
        }
        ctx.fillText(line, 80, y);
        y += 24;
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillText('Press SPACE to Start Game', CONFIG.CANVAS_WIDTH / 2, 540);

    ctx.fillStyle = '#888888';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText('Press ESC to return to menu', CONFIG.CANVAS_WIDTH / 2, 575);
}

function renderCountdown() {
    // Draw game entities in background
    renderGameEntities();

    // Dark overlay with gradient
    const overlayGradient = ctx.createRadialGradient(
        CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2, 50,
        CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2, 400
    );
    overlayGradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
    overlayGradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
    ctx.fillStyle = overlayGradient;
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Countdown number with pulsing glow
    const countNumber = Math.ceil(GAME.countdownRemaining);
    const scale = 1 + (1 - GAME.countdownRemaining % 1) * 0.2;

    ctx.save();
    ctx.translate(CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 40);
    ctx.scale(scale, scale);

    ctx.shadowBlur = 40;
    ctx.shadowColor = '#ffff00';
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 120px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(countNumber, 0, 0);

    ctx.restore();

    // Get ready text with glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 32px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GET READY!', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 - 80);
    ctx.shadowBlur = 0;
}

function renderGameplay() {
    renderGameEntities();
    renderGameUI();
}

function renderGameEntities() {
    // Draw particles (behind entities)
    for (let particle of particles) {
        particle.draw(ctx);
    }

    // Draw enemies
    for (let enemy of enemies) {
        enemy.draw(ctx);
    }

    // Draw projectiles
    for (let projectile of projectiles) {
        projectile.draw(ctx);
    }

    // Draw player (on top)
    if (player) {
        // Player glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = CONFIG.PLAYER_COLOR;
        player.draw(ctx);
        ctx.shadowBlur = 0;
    }
}

function renderGameUI() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px "Courier New", monospace';

    // Score
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${GAME.score}`, 20, 30);

    // Lives with hearts
    const livesText = `LIVES: ${GAME.lives}`;
    ctx.fillText(livesText, 20, 60);

    // Timer
    ctx.textAlign = 'right';
    const timeText = `TIME: ${Math.ceil(GAME.timeRemaining)}s`;
    ctx.fillText(timeText, CONFIG.CANVAS_WIDTH - 20, 30);

    // Difficulty indicator
    const difficulty = getCurrentDifficulty();
    ctx.font = '16px "Courier New", monospace';
    let difficultyColor = '#00ff00';
    if (difficulty.description === 'Moderate') difficultyColor = '#ffff00';
    if (difficulty.description === 'Challenging') difficultyColor = '#ff4444';

    ctx.fillStyle = difficultyColor;
    ctx.fillText(difficulty.description, CONFIG.CANVAS_WIDTH - 20, 60);
}

function renderPaused() {
    // Draw game entities in background
    renderGameEntities();
    renderGameUI();

    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Paused text
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 56px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 - 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px "Courier New", monospace';
    ctx.fillText('Press ESC to resume', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 40);
}

function renderResults() {
    ctx.textAlign = 'center';

    // Title with glow
    const titleColor = GAME.lives > 0 ? '#00ff00' : '#ff4444';
    const titleText = GAME.lives > 0 ? 'MISSION COMPLETE' : 'MISSION ENDED';
    ctx.shadowBlur = 25;
    ctx.shadowColor = titleColor;
    ctx.fillStyle = titleColor;
    ctx.font = 'bold 48px "Courier New", monospace';
    ctx.fillText(titleText, CONFIG.CANVAS_WIDTH / 2, 70);
    ctx.shadowBlur = 0;

    // Stats panel
    ctx.fillStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.fillRect(150, 95, 500, 130);
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(150, 95, 500, 130);

    ctx.fillStyle = '#ffffff';
    ctx.font = '22px "Courier New", monospace';
    ctx.fillText(`Final Score: ${GAME.score}`, CONFIG.CANVAS_WIDTH / 2, 130);
    ctx.fillText(`Threats Eliminated: ${GAME.enemiesDestroyed}`, CONFIG.CANVAS_WIDTH / 2, 165);

    const livesColor = GAME.lives > 0 ? '#00ff00' : '#ff4444';
    ctx.fillStyle = livesColor;
    ctx.fillText(`Lives Remaining: ${GAME.lives}`, CONFIG.CANVAS_WIDTH / 2, 200);

    // Performance rating with special colors
    const rating = getPerformanceRating(GAME.score);
    let ratingColor = '#ffff00';
    if (rating === 'Gold Standard Hero') ratingColor = '#ffd700';
    if (rating === 'Cloud Guardian') ratingColor = '#00ffff';
    if (rating === 'Cloud Rookie') ratingColor = '#888888';

    ctx.shadowBlur = 20;
    ctx.shadowColor = ratingColor;
    ctx.fillStyle = ratingColor;
    ctx.font = 'bold 36px "Courier New", monospace';
    ctx.fillText(`⭐ ${rating} ⭐`, CONFIG.CANVAS_WIDTH / 2, 255);
    ctx.shadowBlur = 0;

    // Educational message box
    ctx.fillStyle = 'rgba(0, 255, 0, 0.05)';
    ctx.fillRect(80, 285, 640, 150);
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 285, 640, 150);

    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillText('Why choose Cenitex Gold Standard SOEs?', CONFIG.CANVAS_WIDTH / 2, 310);

    ctx.fillStyle = '#cccccc';
    ctx.font = '13px "Courier New", monospace';
    const message = [
        'Cenitex Gold Standard SOEs are pre-engineered, secured,',
        'patched and configured through automated pipelines using',
        'GitHub Actions and HashiCorp Packer.',
        '',
        'Available across AWS, Azure, OCI and VMware.',
        'Build once. Deploy consistently. Start production-ready.'
    ];

    let y = 335;
    for (let line of message) {
        ctx.fillText(line, CONFIG.CANVAS_WIDTH / 2, y);
        y += 18;
    }

    // Controls with pulse
    const pulseAlpha = 0.6 + Math.sin(Date.now() / 400) * 0.3;
    ctx.globalAlpha = pulseAlpha;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ff00';
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillText('Press SPACE to Play Again', CONFIG.CANVAS_WIDTH / 2, 500);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#888888';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText('Press ESC for Main Menu', CONFIG.CANVAS_WIDTH / 2, 535);

    // CONNECT branding footer
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillText('Presented by ' + CONFIG.BRANDING.organization, CONFIG.CANVAS_WIDTH / 2, 575);
}

function getPerformanceRating(score) {
    let rating = CONFIG.PERFORMANCE_RATINGS[0].rating;
    for (let r of CONFIG.PERFORMANCE_RATINGS) {
        if (score >= r.minScore) {
            rating = r.rating;
        }
    }
    return rating;
}

// === GAME LOOP ===
let lastTime = 0;

function gameLoop(timestamp) {
    const deltaTime = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    update(deltaTime);
    render();

    requestAnimationFrame(gameLoop);
}

// === INPUT HANDLING ===
window.addEventListener('keydown', (e) => {
    Input.keys[e.key] = true;

    // Prevent page scroll on arrow keys and spacebar
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }

    handleStateInput(e.key);
});

window.addEventListener('keyup', (e) => {
    Input.keys[e.key] = false;
});

// Mouse event listeners
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    Input.mouse.x = e.clientX - rect.left;
    Input.mouse.y = e.clientY - rect.top;
    Input.mouse.isActive = true;
});

canvas.addEventListener('mouseleave', () => {
    Input.mouse.isActive = false;
});

canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    if (GAME.state === GameStates.GAMEPLAY) {
        Input.mouse.clicked = true;
    }
});

canvas.addEventListener('click', (e) => {
    e.preventDefault();

    // Handle menu clicks
    if (GAME.state === GameStates.WELCOME ||
        GAME.state === GameStates.INSTRUCTIONS ||
        GAME.state === GameStates.RESULTS) {
        // These are handled by keyboard for now
        // Could add clickable buttons in the future
    }
});

// Touch event listeners
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    Input.touch.x = (touch.clientX - rect.left) * (CONFIG.CANVAS_WIDTH / rect.width);
    Input.touch.y = (touch.clientY - rect.top) * (CONFIG.CANVAS_HEIGHT / rect.height);
    Input.touch.active = true;

    // Tap to fire during gameplay
    if (GAME.state === GameStates.GAMEPLAY) {
        Input.touch.tapped = true;
    }

    // Tap to start/navigate menus
    if (GAME.state === GameStates.WELCOME ||
        GAME.state === GameStates.INSTRUCTIONS ||
        GAME.state === GameStates.RESULTS) {
        // Simulate spacebar press for menus
        handleStateInput(' ');
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        Input.touch.x = (touch.clientX - rect.left) * (CONFIG.CANVAS_WIDTH / rect.width);
        Input.touch.y = (touch.clientY - rect.top) * (CONFIG.CANVAS_HEIGHT / rect.height);
        Input.touch.active = true;
    }
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    Input.touch.active = false;
});

canvas.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    Input.touch.active = false;
});

function handleStateInput(key) {
    switch (GAME.state) {
        case GameStates.WELCOME:
            if (key === ' ') {
                startGame();
            } else if (key === 'i' || key === 'I') {
                GAME.state = GameStates.INSTRUCTIONS;
            }
            break;

        case GameStates.INSTRUCTIONS:
            if (key === ' ') {
                startGame();
            } else if (key === 'Escape') {
                GAME.state = GameStates.WELCOME;
            }
            break;

        case GameStates.GAMEPLAY:
            if (key === 'Escape') {
                GAME.state = GameStates.PAUSED;
            }
            break;

        case GameStates.PAUSED:
            if (key === 'Escape') {
                GAME.state = GameStates.GAMEPLAY;
            }
            break;

        case GameStates.RESULTS:
            if (key === ' ') {
                startGame();
            } else if (key === 'Escape') {
                GAME.state = GameStates.WELCOME;
            }
            break;
    }
}

// === GAME INITIALIZATION ===
function initGame() {
    // Create player at bottom center
    const playerX = (CONFIG.CANVAS_WIDTH - CONFIG.PLAYER_WIDTH) / 2;
    const playerY = CONFIG.CANVAS_HEIGHT - CONFIG.PLAYER_HEIGHT - 20;
    player = new Player(playerX, playerY);

    // Clear arrays
    enemies = [];
    projectiles = [];
    particles = [];

    // Reset game state
    GAME.score = 0;
    GAME.lives = CONFIG.PLAYER_LIVES;
    GAME.timeRemaining = CONFIG.GAME_DURATION;
    GAME.countdownRemaining = CONFIG.COUNTDOWN_DURATION;
    GAME.enemiesDestroyed = 0;
    spawnTimer = 0;

    // Reset screen shake
    screenShake.duration = 0;
    screenShake.intensity = 0;
}

function startGame() {
    initGame();
    GAME.state = GameStates.COUNTDOWN;
}

// === START ===
initStars(); // Initialize starfield
GAME.state = GameStates.WELCOME;
requestAnimationFrame(gameLoop);
