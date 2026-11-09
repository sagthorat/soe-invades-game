# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SOE-Game-Connect** – A browser-based HTML5 arcade game called **SOE Invaders**, developed for CONNECT, an organisation-wide customer demonstration event.

The game demonstrates the benefits of centrally managed Gold Standard Server Operating Environments (SOEs) compared with generic cloud marketplace images.

**Core message:**

"Marketplace images get you started. Gold Standard SOEs get you production-ready."

The game represents Gold Standard SOEs managed across AWS, Azure, OCI and VMware using GitHub Actions and HashiCorp Packer.

### Objectives

- Create a fun, simple and engaging arcade experience.
- Target both technical and non-technical customers.
- Keep gameplay to approximately 60 seconds and the complete experience to 1–3 minutes.
- Clearly communicate the operational benefits of managed SOEs.
- Run directly in a browser without installation or backend dependencies.

## Project Status

This is a new/empty repository.

The initial development scope is to deliver a fully playable SOE Invaders game, followed by visual enhancements and optional features.

Development priorities:

1. Core gameplay and game mechanics.
2. CONNECT branding and visual polish.
3. Responsive and touchscreen support.
4. Optional enhancements such as sound, leaderboard and fullscreen mode.

Update this file as the project structure and architecture are established.

## Commands

To be added once build/test/run commands are defined.

The initial implementation should preferably be a self-contained HTML file that can be opened directly in Chrome or Edge without a build process.

## Architecture

### Technology Stack

Use:
- HTML5.
- CSS3.
- Vanilla JavaScript.
- HTML5 Canvas.

Avoid unnecessary frameworks, backend services, databases, authentication and external APIs.

### Implementation Approach

Prefer a single self-contained HTML file containing HTML, CSS and JavaScript.

Separate files are acceptable if they improve maintainability without adding unnecessary complexity.

Use:
- `requestAnimationFrame` for the game loop.
- Delta-time-based movement where appropriate.
- Canvas rendering.
- Collision detection.
- JavaScript classes or functions for game objects and game management.

Keep the architecture simple and maintainable.

Suggested logical components:

- GameController
- Player
- Enemy
- Projectile
- CollisionManager
- ScoreManager
- UIManager

### Game Flow

Implement the following game states:

1. Welcome screen.
2. Instructions screen.
3. 3-second countdown.
4. Active gameplay.
5. Game over or timer expiry.
6. Results screen.
7. Replay or return to welcome screen.

### Gameplay

The player controls a Gold Standard SOE defence platform positioned at the bottom of the screen.

Marketplace image threats spawn at the top and descend towards the cloud environment.

The player must eliminate threats using projectiles before they reach the bottom.

**Player characteristics:**
- Starts at the bottom centre.
- Moves horizontally.
- Fires projectiles upwards.
- Cannot move outside game boundaries.
- Starts with three lives.

**Enemy types:**

| Enemy | Represents | Points |
|---|---|---:|
| Unpatched Image | Missing security patches | 100 |
| Unsecured Image | Missing security controls | 150 |
| Incomplete Image | Missing monitoring or backup configuration | 200 |

Enemies must:
- Have visually distinct appearances.
- Spawn at the top of the screen.
- Move downwards and horizontally.
- Increase in speed and spawn frequency as gameplay progresses.
- Be destroyed when hit by projectiles.
- Reduce player lives when they reach the bottom.

**Projectiles:**

Represent the ability of managed SOEs to eliminate operational risks.

They travel upwards, destroy enemies on collision and disappear when leaving the screen.

**Scoring:**

Award points for destroying enemies. Display score, remaining lives and timer prominently throughout gameplay.

**Difficulty progression:**

| Elapsed Time | Difficulty |
|---|---|
| 0–20 seconds | Easy |
| 20–40 seconds | Moderate |
| 40–60 seconds | Challenging |

The game ends when the timer expires or all player lives are lost.

### SOE Differentiation

The game must reinforce the distinction between generic marketplace images and managed Gold Standard SOEs.

Marketplace image threats represent:
- Missing security patches.
- Missing security controls.
- Monitoring integration gaps.
- Backup configuration gaps.
- Configuration inconsistencies.

The Gold Standard SOE represents:
- Security by design.
- Consistent configuration.
- Automated patching and updates.
- Monitoring and backup integration.
- Repeatable automated image builds.

### Results Screen

Display:
- Final score.
- Number of threats eliminated.
- Remaining lives.
- Performance rating.
- Play Again button.
- Return to Welcome Screen button.

**Performance ratings:**

| Score | Rating |
|---|---|
| 0–500 | Cloud Rookie |
| 501–1500 | Cloud Defender |
| 1501–3000 | Cloud Guardian |
| 3001+ | Gold Standard Hero |

Keep scoring thresholds configurable.

Display the following educational message:

"Why fight operational issues after deployment?

Gold Standard SOEs are engineered, secured, patched and configured through automated pipelines using GitHub Actions and HashiCorp Packer.

Available across AWS, Azure, OCI and VMware.

Build once. Deploy consistently. Start production-ready."

## Development Guidelines

### Visual Design

Use a modern retro arcade style.

Design requirements:
- Dark background with vibrant arcade colours.
- Cloud-themed environment.
- Simple animations and visual effects.
- Clear score, timer and lives indicators.
- Minimal text during gameplay.
- Responsive layout for desktops and large touchscreen displays.

Include configurable CONNECT branding, organisation logo and cloud provider references.

Use placeholders where actual logos are unavailable.

The game should feel like a genuine arcade experience, not a corporate presentation disguised as a game.

### Controls

Support the following controls:

| Input | Action |
|---|---|
| Left / Right Arrow | Move |
| A / D | Move |
| Spacebar | Fire |
| Escape | Pause / Resume |
| Mouse movement | Move |
| Mouse click | Fire |
| Touch / Drag | Move |
| Touchscreen tap | Fire |

Prevent browser scrolling when gameplay keys are pressed.

Touchscreen support is important for CONNECT demonstrations.

### Configuration

Provide a central configuration section for:

- Game duration.
- Starting lives.
- Enemy spawn rate and movement speed.
- Player movement speed.
- Projectile speed.
- Enemy scoring.
- Performance rating thresholds.
- Difficulty progression.
- CONNECT branding.

Avoid hardcoding configurable values throughout the game logic.

### Browser and Performance Requirements

Support current versions of:
- Google Chrome.
- Microsoft Edge.

Requirements:
- Target approximately 60 FPS.
- Minimal loading time.
- No unnecessary network requests.
- Responsive to browser resizing.
- No significant CPU usage when idle.
- No vertical scrolling during gameplay.
- Restart without refreshing the browser.

The game must run locally by opening the HTML file directly in a browser.

### Security and Privacy

The game must:
- Run entirely in the browser.
- Not interact with real cloud environments.
- Not make AWS, Azure, OCI or VMware API calls.
- Not require cloud credentials.
- Not collect customer information.
- Not transmit player data externally.
- Not use external analytics.
- Not require internet connectivity during gameplay.

All cloud