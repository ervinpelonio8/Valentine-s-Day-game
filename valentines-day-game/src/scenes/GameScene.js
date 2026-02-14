import Phaser from 'phaser'
import { TIMELINE } from '../data/timeline'
import DebugEditor from '../tools/DebugEditor'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game')
    }

    initBackgroundConfig() {
        // ─── BACKGROUND SETTINGS ───
        // SET 'visible: true' to preview that background at the start of the game!
        // Adjust x, y, scaleX, scaleY manually here.
        this.bgConfigs = {
            // 1. City (Start -> ~1750)
            'city': {
                visible: false,
                timeline: { fadeInStart: 0, fadeInEnd: 200, fadeOutStart: 900, fadeOutEnd: 1000 },
                sky: { key: 'city_sky', x: 0, y: 0, scaleX: 1, scaleY: 1, type: 'tileSprite', scrollFactorX: 0.02 },
                far: { key: 'city_far', x: 0, y: 10, scaleX: 0.6, scaleY: 0.6, type: 'tileSprite', scrollFactorX: 0.1 }
            },
            'city2': {
                visible: false,
                timeline: { fadeInStart: 1707, fadeInEnd: 1800, fadeOutStart: 2371, fadeOutEnd: 2499 },
                sky: { key: 'city_sky', x: 0, y: 0, scaleX: 1, scaleY: 1, type: 'tileSprite', scrollFactorX: 0.02 },
                far: { key: 'city_far', x: 0, y: 10, scaleX: 0.6, scaleY: 0.6, type: 'tileSprite', scrollFactorX: 0.1 }
            },
            // 2. IT Park (2470 -> ~3800)
            'it_park': {
                visible: false,
                timeline: { fadeInStart: 2499, fadeInEnd: 2621, fadeOutStart: 2972, fadeOutEnd: 3137 },
                sky: { key: 'it_sky', x: 0, y: -50, scaleX: 0.5, scaleY: 0.5, type: 'tileSprite', scrollFactorX: 0.02 },
                far: { key: 'it_far', x: 0, y: -50, scaleX: 0.5, scaleY: 0.5, type: 'tileSprite', scrollFactorX: 0.1 },
                // near: { key: 'it_near', x: 0, y: 100, scaleX: 1, scaleY: 1, type: 'image', parallaxFactor: 0.2 }
                near: { key: 'it_near', x: 260, y: 100, scaleX: 1, scaleY: 1, type: 'image', parallaxFactor: 0.1 }
            },
            // 3. SM Seaside (Placeholder)
            'seaside': {
                visible: false,
                timeline: { fadeInStart: 3137, fadeInEnd: 3300, fadeOutStart: 3600, fadeOutEnd: 3700 },
                sky: { key: 'seaside_sky', x: 0, y: 0, scaleX: 0.3, scaleY: 0.3, type: 'tileSprite', scrollFactorX: 0.02 },
                // far: { key: 'seaside_far', x: 0, y: -50, scaleX: 0.8, scaleY: 0.5, type: 'image', parallaxFactor: 0.1 },
                near: { key: 'seaside_near', x: 280, y: 130, scaleX: 1.6, scaleY: 1, type: 'image', parallaxFactor: 0.1 }
            },
            // 4. CCLEX (~3800 -> ~5800)
            'cclex': {
                visible: false,
                timeline: { fadeInStart: 3675, fadeInEnd: 3775, fadeOutStart: 4043, fadeOutEnd: 4143 },
                sky: { key: 'cclex_sky', x: 0, y: 0, scaleX: 0.25, scaleY: 0.25, type: 'tileSprite', scrollFactorX: 0.05 },
                far: { key: 'cclex_far', x: 0, y: 0, scaleX: 1.2, scaleY: 1, type: 'tileSprite', scrollFactorX: 0.15 },
                near: { key: 'cclex_near', x: 310, y: 130, scaleX: 1.6, scaleY: 1, type: 'image', parallaxFactor: 0.1 }
            },
            // 5. Old Bridge
            'bridge': {
                visible: false,
                timeline: { fadeInStart: 4143, fadeInEnd: 4243, fadeOutStart: 4614, fadeOutEnd: 4714 },
                sky: { key: 'bridge_sky', x: 0, y: 10, scaleX: 0.6, scaleY: 0.6, type: 'tileSprite', scrollFactorX: 0.05 },
                far: { key: 'bridge_far', x: 310, y: 0, scaleX: 0.7, scaleY: 0.7, type: 'image', parallaxFactor: 0.08 },
                // near: { key: 'bridge_near', x: 0, y: 0, scaleX: 1, scaleY: 1, type: 'image' }
            },
            // 6. SM JMall
            'jmall': {
                visible: false,
                timeline: { fadeInStart: 4614, fadeInEnd: 4800, fadeOutStart: 5100, fadeOutEnd: 5194 },
                sky: { key: 'jmall_sky', x: 0, y: -50, scaleX: 0.5, scaleY: 0.5, type: 'tileSprite', scrollFactorX: 0.02 },
                far: { key: 'jmall_far', x: 0, y: 0, scaleX: 0.5, scaleY: 0.5, type: 'tileSprite', scrollFactorX: 0.1 },
                near: { key: 'jmall_near', x: 500, y: 140, scaleX: 1.6, scaleY: 1, type: 'image', parallaxFactor: 0.1 }
            },
            // 7. Alliance
            'alliance': {
                visible: false,
                timeline: { fadeInStart: 5180, fadeInEnd: 5205, fadeOutStart: 5650, fadeOutEnd: 5704 },
                sky: { key: 'alliance_sky', x: 0, y: -50, scaleX: 0.5, scaleY: 0.5, type: 'tileSprite', scrollFactorX: 0.02 },
                far: { key: 'alliance_far', x: 0, y: 0, scaleX: 0.5, scaleY: 0.5, type: 'tileSprite', scrollFactorX: 0.1 },
                near: { key: 'alliance_near', x: 300, y: 140, scaleX: 1.6, scaleY: 1, type: 'image', parallaxFactor: 0.1 }
            },
            // 8. Church
            'church': {
                visible: false,
                timeline: { fadeInStart: 5650, fadeInEnd: 5707, fadeOutStart: 6660, fadeOutEnd: 6705 },
                sky: { key: 'church_sky', x: 0, y: 50, scaleX: 0.5, scaleY: 0.5, type: 'tileSprite', scrollFactorX: 0.02 },
                far: { key: 'church_far', x: 0, y: 0, scaleX: 1, scaleY: 0.8, type: 'tileSprite', scrollFactorX: 0.02 },
                // near: { key: 'church_near', x: 0, y: 75, scaleX: 1, scaleY: 0.5, type: 'image' }
            },
            // 9. Bali
            'bali': {
                visible: false,
                timeline: { fadeInStart: 6713, fadeInEnd: 6800, fadeOutStart: 7600, fadeOutEnd: 7706 },
                sky: { key: 'bali_sky', x: 0, y: 0, scaleX: 0.7, scaleY: 0.7, type: 'tileSprite', scrollFactorX: 0.02 },
                far: { key: 'bali_far', x: 300, y: 0, scaleX: 1, scaleY: 1, type: 'image', parallaxFactor: 0.05 },
                near: { key: 'bali_near', x: 650, y: 0, scaleX: 1, scaleY: 1, type: 'image', parallaxFactor: 0.1 }
            },
            // 10. Colon
            'colon': {
                visible: false,
                timeline: { fadeInStart: 7717, fadeInEnd: 7834, fadeOutStart: 8600, fadeOutEnd: 8703 },
                sky: { key: 'colon_sky', x: 0, y: 0, scaleX: 0.5, scaleY: 0.5, type: 'tileSprite', scrollFactorX: 0.0001 },
                far: { key: 'colon_far', x: 330, y: 0, scaleX: 1.65, scaleY: 1,  type: 'image', parallaxFactor: 0.05, alpha: 0.4 },
                near: { key: 'colon_near', x: 750, y: 120, scaleX: 0.4, scaleY: 0.3, type: 'image', parallaxFactor: 0.1 }
            },
            // 11. Boljoon
            'boljoon': {
                visible: false,
                timeline: { fadeInStart: 8703, fadeInEnd: 8883, fadeOutStart: 9600, fadeOutEnd: 9715 },
                sky: { key: 'boljoon_sky', x: 0, y: 0, scaleX: 1, scaleY: 1, type: 'image' },
                far: { key: 'boljoon_far', x: 450, y: 150, scaleX: 1.5   , scaleY: 1, type: 'image', parallaxFactor: 0.05 },
                near: { key: 'boljoon_near', x: 850   , y: 80, scaleX: 1, scaleY: 1.2, type: 'image', parallaxFactor: 0.1  }
            },
            // 12. Saekyung
            'saekyung': {
                visible: false,
                timeline: { fadeInStart: 9715, fadeInEnd: 9825, fadeOutStart: 10600, fadeOutEnd: 10712 },
                sky: { key: 'saekyung_sky', x: 0, y: 0, scaleX: 1, scaleY: 1, type: 'image' },
                far: { key: 'saekyung_far', x: 450, y: 0, scaleX: 0.4, scaleY: 0.4, type: 'image', parallaxFactor: 0.05, alpha:0.6 },
                near: { key: 'saekyung_near', x: 970, y: 50, scaleX: 0.4, scaleY:0.3, type: 'image', parallaxFactor: 0.1 }
            },
            // 13. Barili
            'barili': {
                visible: false,
                timeline: { fadeInStart: 10712, fadeInEnd: 10848, fadeOutStart: 11000, fadeOutEnd: 12018 },
                sky: { key: 'barili_sky', x: 0, y: 0, scaleX: 0.5, scaleY: 0.6, type: 'tileSprite', scrollFactorX: 0.0001},
                far: { key: 'barili_far', x: 515, y: 0, scaleX: 1.7, scaleY: 1.4, type: 'image', parallaxFactor: 0.05, alpha:0.9 },
                // near: { key: 'barili_near', x: 300, y: 90, scaleX: 0.75, scaleY: 0.3, type: 'image', parallaxFactor: 0.05, alpha:1 }
            }
        }
    }

    create() {
        this.initBackgroundConfig()

        // ─── World size ───
        this.worldWidth = 13500
        const worldH = 540
        this.physics.world.setBounds(0, 0, this.worldWidth, worldH)

        // ─── Parallax sky layers ───
        this.createStars()
        console.log('DEBUG: church_near texture exists?', this.textures.exists('church_near'))
        this.createParallaxLayers()

        // ─── Ground ───
        const groundY = 470
        const groundH = 80
        const ground = this.add.rectangle(this.worldWidth / 2, groundY + groundH / 2, this.worldWidth, groundH, 0x111827)
        this.physics.add.existing(ground, true) // static body

        // Ground line accent
        this.add.rectangle(this.worldWidth / 2, groundY, this.worldWidth, 2, 0x334155)

        // ─── Date markers along the ground ───
        for (const m of TIMELINE) {
            this.add.text(m.x, groundY + 8, m.date, {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '7px',
                color: '#475569'
            }).setOrigin(0.5, 0)
        }

        // ─── Player (using spritesheet) ───
        this.player = this.physics.add.sprite(120, 200, 'characters', 8)
        // Set size based on unscaled frame dimensions (27x64)
        // Body approx 16x32 (bottom half)
        this.player.setSize(16, 32)
        this.player.setOffset(7, 33)
        this.player.setScale(1.1)
        this.player.setCollideWorldBounds(true)
        this.player.setDepth(20)
        this.player.setDepth(20)
        this.physics.add.collider(this.player, ground)

        // ─── Female Companion (Hidden until met) ───
        // Scale 0.24 for slightly smaller stature
        this.female = this.physics.add.sprite(-100, 200, 'female', 0)
        this.female.setScale(0.24)
        this.female.setSize(50, 100) // Approx body size
        this.female.setOffset(33, 140) // Center body
        this.female.setCollideWorldBounds(true)
        this.female.setDepth(19) // Slightly behind player
        this.female.setVisible(false)
        this.physics.add.collider(this.female, ground)

        this.femaleActive = false

        // ─── Camera ───
        this.cameras.main.setBounds(0, 0, this.worldWidth, worldH)
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08)

        // ─── Inputs ───
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            interact: Phaser.Input.Keyboard.KeyCodes.E,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D
        })

        // ─── Memory triggers ───
        this.memories = this.physics.add.staticGroup()
        this.seen = new Set()
        this.memoryIcons = []

        for (const m of TIMELINE) {
            const icon = this.memories.create(m.x, groundY - 20, 'memory')
            icon.setData('memory', m)
            icon.setScale(0.8)
            icon.setDepth(5)
            this.memoryIcons.push(icon)

            // Soft pulsing glow tween on each heart
            this.tweens.add({
                targets: icon,
                scaleX: 1.0,
                scaleY: 1.0,
                alpha: { from: 0.6, to: 1 },
                duration: 1200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: Math.random() * 800
            })
        }

        // ─── Overlap detection ───
        this.physics.add.overlap(this.player, this.memories, (_, icon) => {
            this.nearMemory = icon
        })

        // ─── UI elements (fixed to camera) ───
        this.hint = this.add.text(20, 20, '', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px',
            color: '#e5e7eb'
        }).setScrollFactor(0).setAlpha(0.9).setDepth(100)

        this.subtitle = this.add.text(20, 40, 'Arrow keys to walk  ·  Press E to remember', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: '#64748b'
        }).setScrollFactor(0).setAlpha(0.8).setDepth(100)

        // Progress bar (memories found)
        this.progressBg = this.add.rectangle(960 - 20, 20, 160, 6, 0x1e293b).setOrigin(1, 0).setScrollFactor(0).setDepth(100)
        this.progressFill = this.add.rectangle(960 - 20, 20, 0, 6, 0xf472b6).setOrigin(1, 0).setScrollFactor(0).setDepth(100)
        this.progressLabel = this.add.text(960 - 20, 30, '', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            color: '#64748b'
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(100)

        // ─── Particle emitter for ambient floating particles ───
        this.createAmbientParticles()

        // Reset each frame
        this.nearMemory = null
        this.overlayActive = false

        // Listen for resume
        this.events.on('resume-world', () => {
            this.physics.world.resume()
            this.overlayActive = false

            // Trigger female spawn if we just closed the 'meet' memory
            if (this.lastOpenedMemoryId === 'meet' && !this.femaleActive) {
                this.spawnFemale()
            }

            // Transition to ending after the final memory is closed
            if (this.lastOpenedMemoryId === 'final') {
                this.time.delayedCall(500, () => {
                    const fadeOut = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x050810, 0)
                        .setOrigin(0).setScrollFactor(0).setDepth(200)
                    this.tweens.add({
                        targets: fadeOut,
                        alpha: 1,
                        duration: 1500,
                        ease: 'Sine.easeIn',
                        onComplete: () => {
                            this.scene.start('Ending')
                        }
                    })
                })
            }
        })

        // Initialize Debug Tool
        // this.createDebugTool();
    }

    spawnFemale() {
        // If already active and not vanishing, nothing to do
        if (this.femaleActive && !this.femaleVanishing) return

        // If currently vanishing, stop that and fade back in
        if (this.femaleVanishing) {
            this.tweens.killTweensOf(this.female)
            this.femaleVanishing = false
        }

        this.femaleActive = true
        this.female.setVisible(true)

        // Force snap to player side if we are spawning/respawning
        // This prevents "chasing" from far away if she was hidden at a distance
        this.female.setPosition(this.player.x - 45, this.player.y)

        // If coming from invisible state/low alpha, set alpha to 0 for fade in
        if (this.female.alpha < 0.1) {
            this.female.setAlpha(0)
        }

        // Fade in
        this.tweens.add({
            targets: this.female,
            alpha: 1,
            duration: 800,
            ease: 'Power1'
        })
    }

    triggerFemaleVanish() {
        if (!this.femaleActive || this.femaleVanishing) return

        this.femaleActive = false // Stop AI
        this.femaleVanishing = true

        // Stop moving and play idle
        this.female.setVelocityX(0)
        this.female.anims.play('female-idle', true)

        // Fade out tween
        this.tweens.add({
            targets: this.female,
            alpha: 0,
            duration: 1500,
            ease: 'Power1',
            onComplete: () => {
                this.female.setVisible(false)
                this.femaleVanished = true // Mark as vanished so she doesn't pop back immediately
                this.femaleVanishing = false
            }
        })
    }

    // ─── Star field (static, far background) ───
    createStars() {
        const g = this.add.graphics()
        g.setScrollFactor(0.02) // barely moves
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * 2000
            const y = Math.random() * 400
            const size = Math.random() < 0.1 ? 2 : 1
            const alpha = 0.3 + Math.random() * 0.5
            g.fillStyle(0xffffff, alpha)
            g.fillRect(x, y, size, size)
        }
    }

    // ─── Parallax background layers ───
    createParallaxLayers() {
        // ─── 1. Generic Mountains (Initial Background) ───

        // Far mountains / horizon
        // this.bgMountainsFar = this.add.graphics()
        // this.bgMountainsFar.setScrollFactor(0.05)
        // this.bgMountainsFar.fillStyle(0x0f172a, 1)
        // this.drawMountains(this.bgMountainsFar, 380, 60, this.worldWidth * 0.3)

        // // Mid hills
        // this.bgMountainsMid = this.add.graphics()
        // this.bgMountainsMid.setScrollFactor(0.15)
        // this.bgMountainsMid.fillStyle(0x1e293b, 0.6)
        // this.drawMountains(this.bgMountainsMid, 420, 40, this.worldWidth * 0.5)

        // ─── Load All Backgrounds via Config ───
        this.createAllBackgrounds()
    }


    createAllBackgrounds() {
        this.backgroundLayers = {} // Store references: { 'seaside_sky': object, ... }

        Object.keys(this.bgConfigs).forEach(groupKey => {
            const config = this.bgConfigs[groupKey]
            const isVisible = config.visible

                // Iterate over 'sky', 'far', 'near'
                ;['sky', 'far', 'near'].forEach(layerType => {
                    if (!config[layerType]) return // Skip if not defined (e.g. no 'near' in Church)

                    const layerConfig = config[layerType]
                    let obj

                    // Create based on type
                    if (layerConfig.type === 'tileSprite') {
                        obj = this.add.tileSprite(layerConfig.x, layerConfig.y, this.scale.width, this.scale.height, layerConfig.key)
                            .setTileScale(layerConfig.scaleX, layerConfig.scaleY)
                    } else {
                        // Default to Image
                        obj = this.add.image(layerConfig.x, layerConfig.y, layerConfig.key)
                            .setScale(layerConfig.scaleX, layerConfig.scaleY)
                    }

                    obj.setOrigin(0, 0)
                    obj.setScrollFactor(0)

                    // Depth logic (simplified)
                    const depths = { sky: -20, far: -15, near: -10 }
                    obj.setDepth(depths[layerType] || -10)

                    // HACK: Tweaking depths for specific legacy layers to match original logic if needed
                    if (groupKey === 'city') obj.setDepth(depths[layerType] + 0)
                    if (groupKey === 'it_park') obj.setDepth(depths[layerType] + 1) // Sit above city?
                    if (groupKey === 'cclex') obj.setDepth(depths[layerType] + 2)

                    // Visibility
                    // If the group is set to 'visible: true' in config, show it fully opaque
                    // Otherwise, start hidden (alpha 0)
                    obj.setAlpha(isVisible ? 1 : 0)

                    // Store reference
                    this.backgroundLayers[`${groupKey}_${layerType}`] = obj
                })
        })
    }

    drawMountains(graphics, baseY, maxH, totalW) {
        graphics.beginPath()
        graphics.moveTo(0, 540)
        for (let x = 0; x <= totalW; x += 60) {
            const h = Math.sin(x * 0.003) * maxH * 0.5 + Math.sin(x * 0.007 + 1) * maxH * 0.5
            graphics.lineTo(x, baseY - Math.abs(h))
        }
        graphics.lineTo(totalW, 540)
        graphics.closePath()
        graphics.fill()
    }

    // ─── Ambient floating particles ───
    createAmbientParticles() {
        // Use simple graphics-drawn circles as particles
        const particleGraphics = this.make.graphics({ x: 0, y: 0, add: false })
        particleGraphics.fillStyle(0xf472b6, 1)
        particleGraphics.fillCircle(4, 4, 4)
        particleGraphics.generateTexture('particle_pink', 8, 8)
        particleGraphics.destroy()

        this.add.particles(0, 0, 'particle_pink', {
            x: { min: 0, max: this.worldWidth },
            y: { min: 100, max: 480 },
            lifespan: 6000,
            speedX: { min: -8, max: 8 },
            speedY: { min: -15, max: -5 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.3, end: 0 },
            frequency: 300,
            blendMode: 'ADD',
            quantity: 1
        }).setDepth(2)
    }

    update() {
        // If overlay is active, freeze controls
        if (this.overlayActive) return

        const speed = 220
        const body = this.player.body

        if (this.keys.left.isDown || this.keys.a.isDown) {
            body.setVelocityX(-speed)
            this.player.setFlipX(true)
            this.player.anims.play('male-walk', true)
        } else if (this.keys.right.isDown || this.keys.d.isDown) {
            body.setVelocityX(speed)
            this.player.setFlipX(false)
            this.player.anims.play('male-walk', true)
        } else {
            body.setVelocityX(0)
            body.setVelocityX(0)
            this.player.anims.play('male-idle', true)
        }

        // ─── Female Companion AI ───
        // ─── Female Companion Logic (Timeline Constraints) ───

        // Range 1: x=600 ('meet') to x=1400 ('disconnect')
        // Range 2: x=2200 ('reconnect') onwards
        const inRange = (this.player.x >= 600 && this.player.x <= 1400) || (this.player.x >= 2200)

        if (inRange) {
            // Should be present
            if (!this.femaleActive && !this.femaleVanishing) {
                this.spawnFemale()
            } else if (this.femaleVanishing) {
                // If she was vanishing but we walked back in range, bring her back
                this.spawnFemale()
            }
        } else {
            // Should be absent
            if (this.femaleActive) {
                this.triggerFemaleVanish()
            }
        }

        // AI Movement (only if active)
        if (this.femaleActive && this.female && !this.femaleVanishing) {
            const dist = this.player.x - this.female.x
            const absDist = Math.abs(dist)
            const followDist = 40 // Walk closer

            if (absDist > followDist) {
                // Move towards player
                const dir = Math.sign(dist)
                const fSpeed = 200
                if (this.female.body) this.female.setVelocityX(dir * fSpeed)
                this.female.setFlipX(dir < 0) // Flip if moving left
                this.female.anims.play('female-walk', true)
            } else {
                // Stand still
                if (this.female.body) this.female.setVelocityX(0)
                this.female.anims.play('female-idle', true)
            }

            // Reduced alpha between Bali (x=7200) and Charity (x=8200)
            if (this.player.x >= 7200 && this.player.x <= 8200) {
                this.female.setAlpha(0.6)
            } else if (this.female.alpha !== 1) {
                this.female.setAlpha(1)
            }
        }

        // Hint text when near a memory
        if (this.nearMemory) {
            const m = this.nearMemory.getData('memory')
            const already = this.seen.has(m.id)

            if (!already) {
                // First encounter — auto-open immediately
                this.openMemory(m)
            } else {
                this.hint.setText('✦ Press E to reread')
                this.subtitle.setText(m.date + ' — ' + m.title)

                const pressed =
                    Phaser.Input.Keyboard.JustDown(this.keys.interact) ||
                    Phaser.Input.Keyboard.JustDown(this.keys.space)
                if (pressed) {
                    this.openMemory(m)
                }
            }
        } else {
            this.hint.setText('')
            this.subtitle.setText('Arrow keys to walk  ·  Press E to remember')
        }

        // Update progress bar
        const pct = this.seen.size / TIMELINE.length
        this.progressFill.width = 160 * pct
        this.progressLabel.setText(`${this.seen.size} / ${TIMELINE.length} memories`)

        // Reset nearMemory for next frame
        this.nearMemory = null

        // ─── Parallax Logic ───
        const scrollX = this.cameras.main.scrollX

        // ─── BACKGROUND UPDATE LOOP ───

        // Helper to get layer object
        const getLayer = (key) => this.backgroundLayers[key]

        Object.keys(this.bgConfigs).forEach(groupKey => {
            const config = this.bgConfigs[groupKey]
            const timeline = config.timeline || { fadeInStart: 0, fadeInEnd: 0, fadeOutStart: 0, fadeOutEnd: 0 }

            // 1. Determine Visibility (Alpha)
            let alpha = 0

            if (config.visible) {
                // Manual override: Always visible
                alpha = 1
            } else {
                // Timeline logic
                if (scrollX < timeline.fadeInStart) {
                    alpha = 0
                } else if (scrollX < timeline.fadeInEnd) {
                    // Fading In
                    alpha = Phaser.Math.Percent(scrollX, timeline.fadeInStart, timeline.fadeInEnd)
                } else if (scrollX < timeline.fadeOutStart) {
                    // Fully visible
                    alpha = 1
                } else if (scrollX < timeline.fadeOutEnd) {
                    // Fading Out
                    alpha = 1 - Phaser.Math.Percent(scrollX, timeline.fadeOutStart, timeline.fadeOutEnd)
                } else {
                    // Gone
                    alpha = 0
                }
            }

            // 2. Update Layers (Position & Alpha)
            ;['sky', 'far', 'near'].forEach(layerType => {
                if (!config[layerType]) return

                const layerConfig = config[layerType]
                // Construct key, e.g., 'city_sky'
                const obj = getLayer(`${groupKey}_${layerType}`)

                if (obj) {
                    // Set Alpha (apply per-layer alpha multiplier if defined)
                    const layerAlpha = layerConfig.alpha !== undefined ? layerConfig.alpha : 1
                    obj.setAlpha(alpha * layerAlpha)

                    // Only process position if visible (optimization)
                    if (alpha > 0) {
                        if (layerConfig.type === 'tileSprite') {
                            // TileSprite Parallax
                            // Default scroll factors if not set: Sky=0.02, Far=0.1, Near=0.2
                            let factor = 0.1
                            if (layerType === 'sky') factor = 0.02
                            if (layerType === 'near') factor = 0.2

                            // Override from config if exists
                            if (layerConfig.scrollFactorX !== undefined) factor = layerConfig.scrollFactorX

                            // Apply
                            const scaleX = layerConfig.scaleX || 1
                            obj.tilePositionX = (scrollX * factor) / scaleX

                        } else {
                            // Image Parallax (Stretching)
                            let factor = 0
                            if (layerConfig.parallaxFactor !== undefined) {
                                factor = layerConfig.parallaxFactor
                                obj.x = layerConfig.x - (scrollX * factor)
                            }
                        }
                    }
                }
            })
        })

        console.log("Scroll x value: " + scrollX)

        if (this.debugEditor) {
            // this.debugEditor.update();
        }
    }

    createDebugTool() {
        this.debugEditor = new DebugEditor(this);

        // Register Layers
        // 1. City / IT Park
        if (this.bgCitySky) this.debugEditor.addLayer('1. City Sky', this.bgCitySky);
        if (this.bgCityFar) this.debugEditor.addLayer('1. City Far', this.bgCityFar);

        if (this.bgITSky) this.debugEditor.addLayer('1. IT Park Sky', this.bgITSky);
        if (this.bgITFar) this.debugEditor.addLayer('1. IT Park Far', this.bgITFar);
        if (this.bgITNear) this.debugEditor.addLayer('1. IT Park Near', this.bgITNear);

        // 2. SM Seaside
        if (this.bgSeasideSky) this.debugEditor.addLayer('2. Seaside Sky', this.bgSeasideSky);
        if (this.bgSeasideFar) this.debugEditor.addLayer('2. Seaside Far', this.bgSeasideFar);
        if (this.bgSeasideNear) this.debugEditor.addLayer('2. Seaside Near', this.bgSeasideNear);

        // 3. CCLEX
        if (this.bgCCLEXSky) this.debugEditor.addLayer('3. CCLEX Sky', this.bgCCLEXSky);
        if (this.bgCCLEXFar) this.debugEditor.addLayer('3. CCLEX Far', this.bgCCLEXFar);
        if (this.bgCCLEXNear) this.debugEditor.addLayer('3. CCLEX Near', this.bgCCLEXNear);

        // 4. Old Bridge
        if (this.bgBridgeSky) this.debugEditor.addLayer('4. Bridge Sky', this.bgBridgeSky);
        if (this.bgBridgeFar) this.debugEditor.addLayer('4. Bridge Far', this.bgBridgeFar);
        if (this.bgBridgeNear) this.debugEditor.addLayer('4. Bridge Near', this.bgBridgeNear);

        // 5. JMall
        if (this.bgJmallSky) this.debugEditor.addLayer('5. JMall Sky', this.bgJmallSky);
        if (this.bgJmallFar) this.debugEditor.addLayer('5. JMall Far', this.bgJmallFar);
        if (this.bgJmallNear) this.debugEditor.addLayer('5. JMall Near', this.bgJmallNear);

        // 6. Alliance
        if (this.bgAllianceSky) this.debugEditor.addLayer('6. Alliance Sky', this.bgAllianceSky);
        if (this.bgAllianceFar) this.debugEditor.addLayer('6. Alliance Far', this.bgAllianceFar);
        if (this.bgAllianceNear) this.debugEditor.addLayer('6. Alliance Near', this.bgAllianceNear);

        // 7. Church
        if (this.bgChurchSky) this.debugEditor.addLayer('7. Church Sky', this.bgChurchSky);
        if (this.bgChurchFar) this.debugEditor.addLayer('7. Church Far', this.bgChurchFar);

        // 8. Bali
        if (this.bgBaliSky) this.debugEditor.addLayer('8. Bali Sky', this.bgBaliSky);
        if (this.bgBaliFar) this.debugEditor.addLayer('8. Bali Far', this.bgBaliFar);
        if (this.bgBaliNear) this.debugEditor.addLayer('8. Bali Near', this.bgBaliNear);

        // 9. Colon
        if (this.bgColonSky) this.debugEditor.addLayer('9. Colon Sky', this.bgColonSky);
        if (this.bgColonFar) this.debugEditor.addLayer('9. Colon Far', this.bgColonFar);
        if (this.bgColonNear) this.debugEditor.addLayer('9. Colon Near', this.bgColonNear);

        // 10. Boljoon
        if (this.bgBoljoonSky) this.debugEditor.addLayer('10. Boljoon Sky', this.bgBoljoonSky);
        if (this.bgBoljoonFar) this.debugEditor.addLayer('10. Boljoon Far', this.bgBoljoonFar);
        if (this.bgBoljoonNear) this.debugEditor.addLayer('10. Boljoon Near', this.bgBoljoonNear);

        // 11. Saekyung
        if (this.bgSaekyungSky) this.debugEditor.addLayer('11. Saekyung Sky', this.bgSaekyungSky);
        if (this.bgSaekyungFar) this.debugEditor.addLayer('11. Saekyung Far', this.bgSaekyungFar);

        // 12. Barili
        if (this.bgBariliSky) this.debugEditor.addLayer('12. Barili Sky', this.bgBariliSky);
        if (this.bgBariliNear) this.debugEditor.addLayer('12. Barili Near', this.bgBariliNear);

        /* Add more layers here as needed */
    }

    openMemory(memory) {
        console.log('GameScene: openMemory called for', memory.id)
        this.seen.add(memory.id)
        this.overlayActive = true
        this.lastOpenedMemoryId = memory.id

        // Pause physics
        this.physics.world.pause()

        // Launch overlay scene
        this.scene.launch('MemoryOverlay', { memory, seen: this.seen.size, total: TIMELINE.length })
    }
}
