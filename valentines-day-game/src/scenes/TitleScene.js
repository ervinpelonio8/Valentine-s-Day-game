import Phaser from 'phaser'

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('Title')
    }

    create() {
        const { width, height } = this.scale

        // ─── Background Music (loop across all scenes) ───
        if (!this.sound.get('bgm')) {
            this.sound.play('bgm', { loop: true, volume: 0.5 })
        } else if (!this.sound.get('bgm').isPlaying) {
            this.sound.play('bgm', { loop: true, volume: 0.5 })
        }

        // ─── Deep night sky background ───
        const bg = this.add.graphics()
        // Vertical gradient: deep indigo top → dark navy bottom
        const steps = 32
        for (let i = 0; i < steps; i++) {
            const t = i / steps
            const r = Math.floor(Phaser.Math.Linear(0x05, 0x0b, t))
            const g = Math.floor(Phaser.Math.Linear(0x06, 0x0f, t))
            const b = Math.floor(Phaser.Math.Linear(0x18, 0x1a, t))
            const color = (r << 16) | (g << 8) | b
            const sliceH = Math.ceil(height / steps)
            bg.fillStyle(color, 1)
            bg.fillRect(0, i * sliceH, width, sliceH + 1)
        }
        bg.setDepth(-50)

        // ─── Twinkling stars ───
        this.stars = []
        for (let i = 0; i < 120; i++) {
            const x = Math.random() * width
            const y = Math.random() * (height * 0.65)
            const size = Math.random() < 0.08 ? 2 : 1
            const star = this.add.rectangle(x, y, size, size, 0xffffff, 0.2 + Math.random() * 0.6)
            star.setDepth(-40)
            this.stars.push(star)

            // Twinkle animation
            this.tweens.add({
                targets: star,
                alpha: { from: star.alpha, to: 0.1 + Math.random() * 0.3 },
                duration: 1500 + Math.random() * 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: Math.random() * 2000
            })
        }

        // ─── Floating hearts particles ───
        const heartGfx = this.make.graphics({ x: 0, y: 0, add: false })
        heartGfx.fillStyle(0xf472b6, 1)
        heartGfx.fillCircle(4, 4, 4)
        heartGfx.generateTexture('title_particle', 8, 8)
        heartGfx.destroy()

        this.add.particles(0, 0, 'title_particle', {
            x: { min: 0, max: width },
            y: { min: height + 10, max: height + 20 },
            lifespan: 8000,
            speedX: { min: -10, max: 10 },
            speedY: { min: -40, max: -18 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.4, end: 0 },
            frequency: 400,
            blendMode: 'ADD',
            quantity: 1
        }).setDepth(-5)

        // ─── Decorative pixel hearts (left and right of title) ───
        this.createFloatingHeart(width * 0.12, height * 0.18, 0.7)
        this.createFloatingHeart(width * 0.88, height * 0.15, 0.5)
        this.createFloatingHeart(width * 0.08, height * 0.55, 0.4)
        this.createFloatingHeart(width * 0.92, height * 0.50, 0.6)
        this.createFloatingHeart(width * 0.20, height * 0.72, 0.3)
        this.createFloatingHeart(width * 0.80, height * 0.68, 0.35)

        // ─── "My Dearest Sab" heading ───
        const heading = this.add.text(width / 2, 70, 'My Dearest Sab,', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '18px',
            color: '#f9a8d4',
            shadow: {
                offsetX: 0, offsetY: 0, color: '#f472b6', blur: 12, fill: true, stroke: true
            }
        }).setOrigin(0.5).setDepth(10).setAlpha(0)

        // ─── Message body ───
        const message = this.add.text(width / 2, 160, [
            "It's been a blessed year to have you in my life.",
            "",
            "From the moment we met at that apartment door,",
            "through every walk, every laugh, every prayer, ",
            "God wove something beautiful between us.",
            "",
            "I thank you for being in my life."
        ].join('\n'), {
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: '#cbd5e1',
            lineSpacing: 6,
            align: 'center',
            wordWrap: { width: 560 }
        }).setOrigin(0.5).setDepth(10).setAlpha(0)

        // ─── Thin accent line ───
        const line = this.add.rectangle(width / 2, 285, 200, 1, 0xf472b6, 0.5)
            .setDepth(10).setAlpha(0)

        // ─── Small verse / signature ───
        const verse = this.add.text(width / 2, 305, '"Love bears all things, believes all things, hopes all things, endures all things" — 1 Corinthians 13:7', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontStyle: 'italic',
            color: '#64748b'
        }).setOrigin(0.5).setDepth(10).setAlpha(0)

        // ─── Ground area for characters ───
        const groundY = height - 55
        const groundGfx = this.add.graphics().setDepth(0)
        groundGfx.fillStyle(0x111827, 1)
        groundGfx.fillRect(0, groundY, width, 55)
        groundGfx.fillStyle(0x334155, 1)
        groundGfx.fillRect(0, groundY, width, 2)
        groundGfx.setAlpha(0)

        // ─── Characters ───
        // Both characters anchored from the bottom so their feet sit on the ground
        // Male character on the left
        const male = this.add.sprite(width / 2 - 30, groundY, 'characters', 0)
            .setOrigin(0.5, 1)
            .setScale(1.3)
            .setDepth(15)
            .setAlpha(0)

        // Female character on the right (facing left toward male)
        const female = this.add.sprite(width / 2 + 30, groundY, 'female', 0)
            .setOrigin(0.5, 1)
            .setScale(0.28)
            .setFlipX(true)
            .setDepth(15)
            .setAlpha(0)

        // ─── Pixel heart between them ───
        const heartBetween = this.add.image(width / 2, groundY - 50, 'memory')
            .setScale(1.2)
            .setDepth(16)
            .setAlpha(0)

        this.tweens.add({
            targets: heartBetween,
            y: groundY - 56,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        })

        // ─── "Relive Our Story" button ───
        const btnY = 370
        const btnW = 240
        const btnH = 40

        // Button glow (behind)
        const btnGlow = this.add.rectangle(width / 2, btnY, btnW + 12, btnH + 12, 0xf472b6, 0)
            .setDepth(9).setAlpha(0)

        this.tweens.add({
            targets: btnGlow,
            alpha: { from: 0, to: 0.15 },
            scaleX: { from: 1, to: 1.08 },
            scaleY: { from: 1, to: 1.15 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 1800
        })

        // Button background
        const btnBg = this.add.rectangle(width / 2, btnY, btnW, btnH, 0x1e293b, 0.9)
            .setStrokeStyle(1.5, 0xf472b6, 0.8)
            .setDepth(10)
            .setAlpha(0)

        // Button text
        const btnText = this.add.text(width / 2, btnY, '♥  Relive Our Story', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px',
            color: '#f9a8d4'
        }).setOrigin(0.5).setDepth(11).setAlpha(0)

        // ─── Button interaction ───
        btnBg.setInteractive({ useHandCursor: true })

        btnBg.on('pointerover', () => {
            btnBg.setFillStyle(0x334155, 1)
            btnText.setColor('#ffffff')
        })

        btnBg.on('pointerout', () => {
            btnBg.setFillStyle(0x1e293b, 0.9)
            btnText.setColor('#f9a8d4')
        })

        btnBg.on('pointerdown', () => {
            this.startGame()
        })

        // Also allow Space/Enter to start
        this.startKeys = this.input.keyboard.addKeys({
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        })
        this.canStart = false

        // ─── Hint at bottom ───
        const hint = this.add.text(width / 2, height - 16, 'Tap the button or press Enter to begin', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            color: '#475569'
        }).setOrigin(0.5).setDepth(10).setAlpha(0)

        // Pulse hint
        this.tweens.add({
            targets: hint,
            alpha: { from: 0, to: 0.6 },
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 2500
        })

        // ─── Staggered fade-in animation ───
        const fadeItems = [
            { target: heading, delay: 200, y: heading.y },
            { target: message, delay: 600, y: message.y },
            { target: line, delay: 900, y: line.y },
            { target: verse, delay: 1050, y: verse.y },
            { target: groundGfx, delay: 1200, y: 0 },
            { target: male, delay: 1400, y: male.y },
            { target: female, delay: 1500, y: female.y },
            { target: heartBetween, delay: 1650, y: heartBetween.y },
            { target: btnGlow, delay: 1800, y: btnGlow.y },
            { target: btnBg, delay: 1800, y: btnBg.y },
            { target: btnText, delay: 1850, y: btnText.y },
            { target: hint, delay: 2200, y: hint.y },
        ]

        fadeItems.forEach(item => {
            const startY = item.target === groundGfx ? 0 : item.y + 15
            if (item.target !== groundGfx) item.target.setY(startY)

            this.tweens.add({
                targets: item.target,
                alpha: 1,
                y: item.y,
                duration: 600,
                delay: item.delay,
                ease: 'Power2'
            })
        })

        // Allow starting after animations settle
        this.time.delayedCall(1900, () => { this.canStart = true })

        // Store reference for transition
        this.allElements = [heading, message, line, verse, groundGfx, male, female,
            heartBetween, btnGlow, btnBg, btnText, hint, bg]
    }

    createFloatingHeart(x, y, alpha) {
        const heart = this.add.image(x, y, 'memory')
            .setScale(0.6 + Math.random() * 0.5)
            .setAlpha(0)
            .setDepth(5)

        // Fade in
        this.tweens.add({
            targets: heart,
            alpha: alpha * 0.5,
            duration: 1000,
            delay: 500 + Math.random() * 1500,
            ease: 'Sine.easeIn'
        })

        // Gentle float
        this.tweens.add({
            targets: heart,
            y: y - 8 - Math.random() * 6,
            duration: 2500 + Math.random() * 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: Math.random() * 1000
        })
    }

    startGame() {
        if (!this.canStart) return
        this.canStart = false

        // Fade everything out, then transition
        this.tweens.add({
            targets: this.allElements,
            alpha: 0,
            duration: 600,
            ease: 'Sine.easeIn',
            onComplete: () => {
                this.scene.start('Game')
            }
        })
    }

    update() {
        if (!this.canStart) return

        if (Phaser.Input.Keyboard.JustDown(this.startKeys.enter) ||
            Phaser.Input.Keyboard.JustDown(this.startKeys.space)) {
            this.startGame()
        }
    }
}

