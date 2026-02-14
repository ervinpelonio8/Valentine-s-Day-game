import Phaser from 'phaser'

export default class EndingScene extends Phaser.Scene {
    constructor() {
        super('Ending')
    }

    create() {
        const { width, height } = this.scale
        this.climaxTriggered = false

        // ─── Generate particle textures (multiple colors) ───
        this.generateParticleTextures()

        // ─── Night sky gradient ───
        this.bg = this.add.graphics()
        this.drawSkyGradient(0x04, 0x04, 0x14, 0x0a, 0x0c, 0x1e)
        this.bg.setDepth(-50)

        // ─── Twinkling stars ───
        this.starObjects = []
        for (let i = 0; i < 180; i++) {
            const x = Math.random() * width
            const y = Math.random() * (height * 0.75)
            const size = Math.random() < 0.08 ? 2 : 1
            const baseAlpha = 0.15 + Math.random() * 0.55
            const star = this.add.rectangle(x, y, size, size, 0xffffff, baseAlpha)
            star.setDepth(-40)
            this.starObjects.push(star)
            this.tweens.add({
                targets: star,
                alpha: { from: baseAlpha, to: 0.05 + Math.random() * 0.2 },
                duration: 1000 + Math.random() * 2500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: Math.random() * 2000
            })
        }

        // ─── Ambient rising particles ───
        this.ambientParticles = this.add.particles(0, 0, 'p_pink', {
            x: { min: 0, max: width },
            y: { min: height + 10, max: height + 20 },
            lifespan: 7000,
            speedX: { min: -8, max: 8 },
            speedY: { min: -30, max: -12 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.2, end: 0 },
            frequency: 600,
            blendMode: 'ADD',
            quantity: 1
        }).setDepth(-5)

        // ─── Ground ───
        const groundY = height - 55
        this.groundY = groundY
        this.groundGfx = this.add.graphics().setDepth(0)
        this.groundGfx.fillStyle(0x111827, 1)
        this.groundGfx.fillRect(0, groundY, width, 55)
        this.groundGfx.fillStyle(0x334155, 1)
        this.groundGfx.fillRect(0, groundY, width, 2)

        // ─── "Will you be my Valentine?" header ───
        this.header = this.add.text(width / 2, 60, 'Will you be my Valentine?', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '16px',
            color: '#f9a8d4',
            shadow: { offsetX: 0, offsetY: 0, color: '#f472b6', blur: 16, fill: true, stroke: true }
        }).setOrigin(0.5).setDepth(30).setAlpha(0)

        this.tweens.add({
            targets: this.header,
            alpha: { from: 0, to: 1 },
            duration: 1200,
            ease: 'Sine.easeOut',
            delay: 300,
            onComplete: () => {
                this.tweens.add({
                    targets: this.header,
                    scaleX: { from: 1, to: 1.03 },
                    scaleY: { from: 1, to: 1.03 },
                    duration: 2000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                })
            }
        })

        // ─── Instruction hint ───
        this.hint = this.add.text(width / 2, 100, 'Walk to him…', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: '#64748b'
        }).setOrigin(0.5).setDepth(30).setAlpha(0)

        this.tweens.add({
            targets: this.hint,
            alpha: 0.7,
            duration: 800,
            delay: 1500,
            ease: 'Sine.easeOut'
        })

        // ─── Male character ───
        this.male = this.add.sprite(width * 0.35, groundY, 'characters', 0)
            .setOrigin(0.5, 1).setScale(1.3).setDepth(15).setAlpha(0)

        this.tweens.add({ targets: this.male, alpha: 1, duration: 800, delay: 500, ease: 'Power2' })

        // ─── Female character (player-controlled) ───
        this.female = this.add.sprite(width * 0.8, groundY, 'female', 0)
            .setOrigin(0.5, 1).setScale(0.28).setFlipX(true).setDepth(15).setAlpha(0)

        this.tweens.add({ targets: this.female, alpha: 1, duration: 800, delay: 700, ease: 'Power2' })

        // ─── Input ───
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D
        })

        // ─── Mobile Touch Controls ───
        this.touchLeft = false
        this.touchRight = false
        this.createMobileControls()

        this.canControl = false
        this.time.delayedCall(1500, () => { this.canControl = true })

        // ─── Decorative floating hearts ───
        for (let i = 0; i < 8; i++) {
            const side = i % 2 === 0 ? 0.05 + Math.random() * 0.15 : 0.80 + Math.random() * 0.15
            this.createFloatingHeart(width * side, height * (0.1 + Math.random() * 0.6), 0.25 + Math.random() * 0.3)
        }
    }

    // ─── Particle texture generation ───
    generateParticleTextures() {
        const colors = {
            'p_pink': 0xf472b6,
            'p_rose': 0xfb7185,
            'p_gold': 0xfbbf24,
            'p_white': 0xf1f5f9,
            'p_lavender': 0xc084fc,
            'p_peach': 0xfda4af,
            'p_soft_gold': 0xfde68a
        }
        Object.entries(colors).forEach(([key, color]) => {
            if (!this.textures.exists(key)) {
                const g = this.make.graphics({ x: 0, y: 0, add: false })
                g.fillStyle(color, 1)
                g.fillCircle(4, 4, 4)
                g.generateTexture(key, 8, 8)
                g.destroy()
            }
        })

        // Soft glow orb (larger, softer)
        if (!this.textures.exists('p_glow')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false })
            g.fillStyle(0xffffff, 0.6)
            g.fillCircle(8, 8, 8)
            g.fillStyle(0xffffff, 0.3)
            g.fillCircle(8, 8, 12)
            g.generateTexture('p_glow', 24, 24)
            g.destroy()
        }

        // Tiny sparkle
        if (!this.textures.exists('p_spark')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false })
            g.fillStyle(0xffffff, 1)
            g.fillRect(1, 0, 1, 3)
            g.fillRect(0, 1, 3, 1)
            g.generateTexture('p_spark', 3, 3)
            g.destroy()
        }
    }

    createMobileControls() {
        const { width, height } = this.scale
        const btnSize = 52
        const margin = 16
        const btnY = height - margin - btnSize / 2
        const btnAlpha = 0.35

        // Left arrow button
        const leftBtn = this.add.rectangle(margin + btnSize / 2, btnY, btnSize, btnSize, 0x1e293b, 0.6)
            .setStrokeStyle(1.5, 0xf472b6, 0.5)
            .setDepth(200).setAlpha(btnAlpha)
            .setInteractive()

        this.add.text(margin + btnSize / 2, btnY, '◀', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '16px',
            color: '#f9a8d4'
        }).setOrigin(0.5).setDepth(201).setAlpha(btnAlpha)

        // Right arrow button
        const rightBtn = this.add.rectangle(margin + btnSize + 12 + btnSize / 2, btnY, btnSize, btnSize, 0x1e293b, 0.6)
            .setStrokeStyle(1.5, 0xf472b6, 0.5)
            .setDepth(200).setAlpha(btnAlpha)
            .setInteractive()

        this.add.text(margin + btnSize + 12 + btnSize / 2, btnY, '▶', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '16px',
            color: '#f9a8d4'
        }).setOrigin(0.5).setDepth(201).setAlpha(btnAlpha)

        leftBtn.on('pointerdown', () => { this.touchLeft = true })
        leftBtn.on('pointerup', () => { this.touchLeft = false })
        leftBtn.on('pointerout', () => { this.touchLeft = false })

        rightBtn.on('pointerdown', () => { this.touchRight = true })
        rightBtn.on('pointerup', () => { this.touchRight = false })
        rightBtn.on('pointerout', () => { this.touchRight = false })
    }

    drawSkyGradient(r1, g1, b1, r2, g2, b2) {
        const { width, height } = this.scale
        const steps = 32
        this.bg.clear()
        for (let i = 0; i < steps; i++) {
            const t = i / steps
            const r = Math.floor(Phaser.Math.Linear(r1, r2, t))
            const g = Math.floor(Phaser.Math.Linear(g1, g2, t))
            const b = Math.floor(Phaser.Math.Linear(b1, b2, t))
            const color = (r << 16) | (g << 8) | b
            const sliceH = Math.ceil(height / steps)
            this.bg.fillStyle(color, 1)
            this.bg.fillRect(0, i * sliceH, width, sliceH + 1)
        }
    }

    createFloatingHeart(x, y, alpha) {
        const heart = this.add.image(x, y, 'memory')
            .setScale(0.4 + Math.random() * 0.5)
            .setAlpha(alpha * 0.4)
            .setDepth(5)

        this.tweens.add({
            targets: heart,
            y: y - 6 - Math.random() * 8,
            duration: 2500 + Math.random() * 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: Math.random() * 1000
        })

        return heart
    }

    update() {
        if (this.climaxTriggered || !this.canControl) return

        const speed = 30
        const moveLeft = this.keys.left.isDown || this.keys.a.isDown || this.touchLeft
        const moveRight = this.keys.right.isDown || this.keys.d.isDown || this.touchRight

        if (moveLeft) {
            this.female.x -= speed * (1 / 60)
            this.female.setFlipX(true)
            this.female.anims.play('female-walk', true)
        } else if (moveRight) {
            this.female.x += speed * (1 / 60)
            this.female.setFlipX(false)
            this.female.anims.play('female-walk', true)
        } else {
            this.female.anims.play('female-idle', true)
        }

        this.female.x = Phaser.Math.Clamp(this.female.x, 50, this.scale.width - 50)

        if (Math.abs(this.female.x - this.male.x) < 45) {
            this.triggerClimax()
        }
    }

    triggerClimax() {
        this.climaxTriggered = true
        this.canControl = false
        const { width, height } = this.scale
        const meetX = (this.male.x + this.female.x) / 2

        // Stop female, face male
        this.female.anims.play('female-idle', true)
        this.female.setFlipX(true)

        // Fade hint
        this.tweens.add({ targets: this.hint, alpha: 0, duration: 400 })

        // ════════════════════════════════════════════
        // PHASE 1: Characters slide together (0ms)
        // ════════════════════════════════════════════
        this.tweens.add({ targets: this.male, x: meetX - 18, duration: 800, ease: 'Sine.easeInOut' })
        this.tweens.add({ targets: this.female, x: meetX + 18, duration: 800, ease: 'Sine.easeInOut' })

        // ════════════════════════════════════════════
        // PHASE 2: Heart appears + first sparkle ring (800ms)
        // ════════════════════════════════════════════
        this.time.delayedCall(800, () => {
            const heartY = this.groundY - 100
            this.centralHeart = this.add.image(meetX, heartY + 20, 'memory')
                .setScale(0).setDepth(25)

            this.tweens.add({
                targets: this.centralHeart,
                scaleX: 2.5, scaleY: 2.5, y: heartY,
                duration: 600, ease: 'Back.easeOut'
            })

            // Sparkle ring around heart
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2
                const radius = 35
                const sx = meetX + Math.cos(angle) * radius
                const sy = heartY + Math.sin(angle) * radius
                const spark = this.add.image(meetX, heartY, 'p_spark')
                    .setScale(0).setDepth(26).setAlpha(0.9)

                this.tweens.add({
                    targets: spark,
                    x: sx, y: sy,
                    scaleX: 1.5, scaleY: 1.5,
                    alpha: 0,
                    duration: 800,
                    delay: 300 + i * 40,
                    ease: 'Power2'
                })
            }

            // Heart pulse
            this.time.delayedCall(600, () => {
                this.tweens.add({
                    targets: this.centralHeart,
                    scaleX: 2.8, scaleY: 2.8,
                    duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
                })
            })
        })

        // ════════════════════════════════════════════
        // PHASE 3: Massive particle explosion (1400ms)
        // ════════════════════════════════════════════
        this.time.delayedCall(1400, () => {
            // Wave 1: Pink burst
            this.add.particles(meetX, this.groundY - 45, 'p_pink', {
                speed: { min: 80, max: 280 },
                angle: { min: 180, max: 360 },
                lifespan: 2500,
                scale: { start: 0.7, end: 0 },
                alpha: { start: 0.9, end: 0 },
                blendMode: 'ADD',
                emitting: false
            }).setDepth(22).explode(50)

            // Wave 2: Gold burst (slightly delayed)
            this.time.delayedCall(150, () => {
                this.add.particles(meetX, this.groundY - 50, 'p_gold', {
                    speed: { min: 50, max: 220 },
                    angle: { min: 180, max: 360 },
                    lifespan: 3000,
                    scale: { start: 0.5, end: 0 },
                    alpha: { start: 0.8, end: 0 },
                    blendMode: 'ADD',
                    emitting: false
                }).setDepth(22).explode(40)
            })

            // Wave 3: White sparkles
            this.time.delayedCall(300, () => {
                this.add.particles(meetX, this.groundY - 40, 'p_white', {
                    speed: { min: 100, max: 300 },
                    angle: { min: 0, max: 360 },
                    lifespan: 2000,
                    scale: { start: 0.4, end: 0 },
                    alpha: { start: 1, end: 0 },
                    blendMode: 'ADD',
                    emitting: false
                }).setDepth(22).explode(35)
            })

            // Wave 4: Rose petals outward
            this.time.delayedCall(450, () => {
                this.add.particles(meetX, this.groundY - 50, 'p_rose', {
                    speed: { min: 40, max: 180 },
                    angle: { min: 0, max: 360 },
                    lifespan: 3500,
                    scale: { start: 0.6, end: 0 },
                    alpha: { start: 0.7, end: 0 },
                    blendMode: 'ADD',
                    emitting: false
                }).setDepth(22).explode(30)
            })
        })

        // ════════════════════════════════════════════
        // PHASE 4: Screen flash + warm glow (1800ms)
        // ════════════════════════════════════════════
        this.time.delayedCall(1800, () => {
            // Quick white flash
            const flash = this.add.rectangle(width / 2, height / 2, width, height, 0xffffff, 0).setDepth(50)
            this.tweens.add({
                targets: flash,
                alpha: { from: 0, to: 0.35 },
                duration: 200,
                yoyo: true,
                ease: 'Sine.easeOut',
                onComplete: () => flash.destroy()
            })

            // Lingering warm pink glow
            const warmGlow = this.add.rectangle(width / 2, height / 2, width, height, 0xf472b6, 0).setDepth(18)
            this.tweens.add({
                targets: warmGlow,
                alpha: 0.1,
                duration: 2000,
                yoyo: true,
                repeat: 2,
                ease: 'Sine.easeInOut'
            })

            // Gold warm overlay
            const goldGlow = this.add.rectangle(width / 2, height / 2, width, height, 0xfbbf24, 0).setDepth(17)
            this.tweens.add({
                targets: goldGlow,
                alpha: 0.05,
                duration: 2500,
                delay: 500,
                yoyo: true,
                repeat: 1,
                ease: 'Sine.easeInOut'
            })
        })

        // ════════════════════════════════════════════
        // PHASE 5: Flowing light orbs + sky transformation (2000ms)
        // ════════════════════════════════════════════
        this.time.delayedCall(2000, () => {
            // "Yes. ♥" header change
            this.tweens.add({
                targets: this.header,
                alpha: 0, duration: 400, ease: 'Sine.easeIn',
                onComplete: () => {
                    this.header.setText('Yes. ♥')
                    this.header.setFontSize('22px')
                    this.tweens.add({ targets: this.header, alpha: 1, duration: 800, ease: 'Sine.easeOut' })
                }
            })

            // Floating light orbs that drift across the scene
            const orbColors = ['p_pink', 'p_gold', 'p_lavender', 'p_peach', 'p_soft_gold']
            for (let i = 0; i < 20; i++) {
                const startX = Math.random() * width
                const startY = height * 0.3 + Math.random() * height * 0.5
                const orb = this.add.image(startX, startY,
                    orbColors[Math.floor(Math.random() * orbColors.length)])
                    .setScale(0).setDepth(12).setAlpha(0).setBlendMode('ADD')

                const targetScale = 0.4 + Math.random() * 0.8
                this.tweens.add({
                    targets: orb,
                    scaleX: targetScale, scaleY: targetScale,
                    alpha: { from: 0, to: 0.3 + Math.random() * 0.4 },
                    x: startX + (Math.random() - 0.5) * 200,
                    y: startY - 80 - Math.random() * 150,
                    duration: 3000 + Math.random() * 3000,
                    delay: i * 150,
                    ease: 'Sine.easeOut',
                    onComplete: () => {
                        this.tweens.add({
                            targets: orb,
                            alpha: 0,
                            y: orb.y - 30,
                            duration: 1500,
                            ease: 'Sine.easeIn',
                            onComplete: () => orb.destroy()
                        })
                    }
                })
            }

            // Brighten the stars
            this.starObjects.forEach((star, i) => {
                this.tweens.add({
                    targets: star,
                    alpha: 0.6 + Math.random() * 0.4,
                    duration: 2000,
                    delay: i * 8,
                    ease: 'Sine.easeOut'
                })
            })

            // Continuous sparkle fountain from characters
            this.add.particles(meetX, this.groundY - 30, 'p_spark', {
                speed: { min: 20, max: 90 },
                angle: { min: 220, max: 320 },
                lifespan: 2000,
                scale: { start: 1.2, end: 0 },
                alpha: { start: 0.8, end: 0 },
                blendMode: 'ADD',
                frequency: 60,
                quantity: 2
            }).setDepth(21)
        })

        // ════════════════════════════════════════════
        // PHASE 6: Second massive burst (2800ms)
        // ════════════════════════════════════════════
        this.time.delayedCall(2800, () => {
            // Radial light rays from center
            for (let i = 0; i < 16; i++) {
                const angle = (i / 16) * Math.PI * 2
                const ray = this.add.rectangle(
                    meetX, this.groundY - 45,
                    2, 0, 0xf9a8d4, 0.6
                ).setOrigin(0.5, 1).setRotation(angle).setDepth(19)

                this.tweens.add({
                    targets: ray,
                    height: 80 + Math.random() * 60,
                    alpha: 0,
                    duration: 1200,
                    delay: i * 30,
                    ease: 'Power2'
                })
            }

            // Another explosion — celebration burst
            this.add.particles(meetX, this.groundY - 50, 'p_lavender', {
                speed: { min: 60, max: 250 },
                angle: { min: 0, max: 360 },
                lifespan: 2500,
                scale: { start: 0.6, end: 0 },
                alpha: { start: 0.8, end: 0 },
                blendMode: 'ADD',
                emitting: false
            }).setDepth(22).explode(45)

            this.add.particles(meetX, this.groundY - 50, 'p_soft_gold', {
                speed: { min: 40, max: 200 },
                angle: { min: 0, max: 360 },
                lifespan: 3000,
                scale: { start: 0.4, end: 0 },
                alpha: { start: 0.7, end: 0 },
                blendMode: 'ADD',
                emitting: false
            }).setDepth(22).explode(35)
        })

        // ════════════════════════════════════════════
        // PHASE 7: Final messages + magical atmosphere (3500ms)
        // ════════════════════════════════════════════
        this.time.delayedCall(3500, () => {
            // Fade header
            this.tweens.add({
                targets: this.header,
                alpha: 0, y: this.header.y - 20,
                duration: 600, ease: 'Sine.easeIn'
            })

            // Move characters to center bottom and keep them visible
            const centerX = width / 2
            this.tweens.add({
                targets: this.male,
                x: centerX - 18,
                y: this.groundY,
                duration: 1200,
                delay: 200,
                ease: 'Sine.easeInOut'
            })
            this.tweens.add({
                targets: this.female,
                x: centerX + 18,
                y: this.groundY,
                duration: 1200,
                delay: 200,
                ease: 'Sine.easeInOut'
            })

            // Move central heart to follow them to center
            if (this.centralHeart) {
                this.tweens.add({
                    targets: this.centralHeart,
                    x: centerX,
                    duration: 1200,
                    delay: 200,
                    ease: 'Sine.easeInOut'
                })
            }

            // ── Sky transforms to warm aurora ──
            this.time.delayedCall(600, () => {
                // Overlay gradient shift — deep purple to warm rose
                const aurora = this.add.graphics().setDepth(-45).setAlpha(0)
                const steps = 32
                for (let i = 0; i < steps; i++) {
                    const t = i / steps
                    const r = Math.floor(Phaser.Math.Linear(0x1a, 0x10, t))
                    const g = Math.floor(Phaser.Math.Linear(0x05, 0x04, t))
                    const b = Math.floor(Phaser.Math.Linear(0x2e, 0x22, t))
                    const color = (r << 16) | (g << 8) | b
                    const sliceH = Math.ceil(height / steps)
                    aurora.fillStyle(color, 1)
                    aurora.fillRect(0, i * sliceH, width, sliceH + 1)
                }
                this.tweens.add({ targets: aurora, alpha: 1, duration: 2000, ease: 'Sine.easeInOut' })
            })

            // ── Staggered final messages ──
            const messages = [
                { text: 'Happy Valentine\'s Day, Sab', y: 65, size: '16px', color: '#f9a8d4', font: '"Press Start 2P", monospace', delay: 0, glow: true },
                { text: '♥', y: 115, size: '28px', color: '#f472b6', font: '"Press Start 2P", monospace', delay: 500, glow: true },
                { text: 'Through every season, every prayer, every step, ', y: 170, size: '13px', color: '#e2e8f0', font: 'Inter, sans-serif', delay: 1000 },
                { text: 'I choose you. I choose us.', y: 200, size: '15px', color: '#ffffff', font: 'Inter, sans-serif', delay: 1500, bold: true },
                { text: 'Let\'s keep walking together.', y: 235, size: '13px', color: '#cbd5e1', font: 'Inter, sans-serif', delay: 2000 },
                { text: '"A cord of three strands is not quickly broken."', y: 295, size: '11px', color: '#a78bfa', font: 'Inter, sans-serif', delay: 2800, italic: true },
                { text: '— Ecclesiastes 4:12', y: 320, size: '10px', color: '#7c3aed', font: 'Inter, sans-serif', delay: 3000, italic: true },
            ]

            this.finalTexts = []
            messages.forEach(msg => {
                const style = {
                    fontFamily: msg.font,
                    fontSize: msg.size,
                    fontStyle: msg.italic ? 'italic' : (msg.bold ? 'bold' : 'normal'),
                    color: msg.color,
                    align: 'center',
                }
                if (msg.glow) {
                    style.shadow = { offsetX: 0, offsetY: 0, color: '#f472b6', blur: 18, fill: true, stroke: true }
                }
                const txt = this.add.text(width / 2, msg.y + 15, msg.text, style)
                    .setOrigin(0.5).setDepth(35).setAlpha(0)

                this.finalTexts.push(txt)

                this.tweens.add({
                    targets: txt,
                    alpha: 1, y: msg.y,
                    duration: 900,
                    delay: msg.delay,
                    ease: 'Power2'
                })
            })

            // ── Massive celebration particle effects ──

            // 1. Golden rain from above
            this.time.delayedCall(400, () => {
                this.add.particles(0, 0, 'p_soft_gold', {
                    x: { min: 0, max: width },
                    y: -10,
                    lifespan: 5000,
                    speedY: { min: 15, max: 50 },
                    speedX: { min: -20, max: 20 },
                    scale: { start: 0.4, end: 0 },
                    alpha: { start: 0.5, end: 0 },
                    blendMode: 'ADD',
                    frequency: 40,
                    quantity: 3
                }).setDepth(10)
            })

            // 2. Pink confetti rising
            this.time.delayedCall(600, () => {
                this.add.particles(0, 0, 'p_pink', {
                    x: { min: 0, max: width },
                    y: { min: height + 5, max: height + 15 },
                    lifespan: 6000,
                    speedY: { min: -50, max: -20 },
                    speedX: { min: -25, max: 25 },
                    scale: { start: 0.5, end: 0 },
                    alpha: { start: 0.6, end: 0 },
                    blendMode: 'ADD',
                    frequency: 50,
                    quantity: 3
                }).setDepth(10)
            })

            // 3. Lavender sparkle drift
            this.time.delayedCall(800, () => {
                this.add.particles(0, 0, 'p_lavender', {
                    x: { min: -20, max: width + 20 },
                    y: { min: 50, max: height - 50 },
                    lifespan: 4000,
                    speedY: { min: -10, max: 10 },
                    speedX: { min: -10, max: 10 },
                    scale: { start: 0.3, end: 0 },
                    alpha: { start: 0.4, end: 0 },
                    blendMode: 'ADD',
                    frequency: 80,
                    quantity: 2
                }).setDepth(10)
            })

            // 4. White sparkle rain (heavier)
            this.time.delayedCall(1000, () => {
                this.add.particles(0, 0, 'p_spark', {
                    x: { min: 0, max: width },
                    y: -5,
                    lifespan: 3500,
                    speedY: { min: 30, max: 80 },
                    speedX: { min: -30, max: 30 },
                    scale: { start: 1.5, end: 0 },
                    alpha: { start: 0.7, end: 0 },
                    blendMode: 'ADD',
                    frequency: 30,
                    quantity: 4
                }).setDepth(11)
            })

            // 5. Rose petal side streams
            this.time.delayedCall(1200, () => {
                // From the left
                this.add.particles(0, 0, 'p_rose', {
                    x: -10,
                    y: { min: 100, max: 400 },
                    lifespan: 5000,
                    speedX: { min: 20, max: 60 },
                    speedY: { min: -15, max: 15 },
                    scale: { start: 0.5, end: 0 },
                    alpha: { start: 0.5, end: 0 },
                    blendMode: 'ADD',
                    frequency: 100,
                    quantity: 2
                }).setDepth(10)

                // From the right
                this.add.particles(0, 0, 'p_peach', {
                    x: width + 10,
                    y: { min: 100, max: 400 },
                    lifespan: 5000,
                    speedX: { min: -60, max: -20 },
                    speedY: { min: -15, max: 15 },
                    scale: { start: 0.5, end: 0 },
                    alpha: { start: 0.5, end: 0 },
                    blendMode: 'ADD',
                    frequency: 100,
                    quantity: 2
                }).setDepth(10)
            })

            // 6. Orbiting glow orbs around center
            this.time.delayedCall(1500, () => {
                for (let i = 0; i < 8; i++) {
                    const orb = this.add.image(width / 2, height / 2, 'p_glow')
                        .setScale(0.3 + Math.random() * 0.5)
                        .setAlpha(0)
                        .setBlendMode('ADD')
                        .setDepth(13)

                    const radius = 80 + Math.random() * 120
                    const speed = 3000 + Math.random() * 4000
                    const startAngle = (i / 8) * Math.PI * 2

                    // Custom orbit via timeline
                    this.tweens.add({
                        targets: orb,
                        alpha: { from: 0, to: 0.3 + Math.random() * 0.3 },
                        duration: 1000,
                        delay: i * 200,
                        ease: 'Sine.easeOut'
                    })

                    // Orbit animation
                    this.tweens.addCounter({
                        from: 0,
                        to: 360,
                        duration: speed,
                        repeat: -1,
                        delay: i * 200,
                        onUpdate: (tween) => {
                            const angle = startAngle + Phaser.Math.DegToRad(tween.getValue())
                            orb.x = width / 2 + Math.cos(angle) * radius
                            orb.y = height / 2 + Math.sin(angle) * radius * 0.5
                        }
                    })
                }
            })

            // 7. Periodic celebration bursts every ~2 seconds
            for (let burst = 0; burst < 4; burst++) {
                this.time.delayedCall(1800 + burst * 2000, () => {
                    const bx = width * 0.2 + Math.random() * width * 0.6
                    const by = height * 0.2 + Math.random() * height * 0.4
                    const colors = ['p_pink', 'p_gold', 'p_lavender', 'p_rose']
                    const c = colors[Math.floor(Math.random() * colors.length)]

                    this.add.particles(bx, by, c, {
                        speed: { min: 30, max: 120 },
                        angle: { min: 0, max: 360 },
                        lifespan: 2000,
                        scale: { start: 0.5, end: 0 },
                        alpha: { start: 0.7, end: 0 },
                        blendMode: 'ADD',
                        emitting: false
                    }).setDepth(14).explode(25)

                    // Mini flash at burst center
                    const miniFlash = this.add.circle(bx, by, 15, 0xffffff, 0.4).setDepth(15)
                    this.tweens.add({
                        targets: miniFlash,
                        alpha: 0,
                        scaleX: 3, scaleY: 3,
                        duration: 500,
                        ease: 'Power2',
                        onComplete: () => miniFlash.destroy()
                    })
                })
            }
        })

        // ════════════════════════════════════════════
        // PHASE 8: Fade to title (13000ms)
        // ════════════════════════════════════════════
        this.time.delayedCall(13000, () => {
            const fadeOut = this.add.rectangle(0, 0, width, height, 0x050810, 0)
                .setOrigin(0).setDepth(100)

            this.tweens.add({
                targets: fadeOut,
                alpha: 1,
                duration: 3000,
                ease: 'Sine.easeIn',
                onComplete: () => {
                    this.scene.start('Title')
                }
            })
        })
    }
}
