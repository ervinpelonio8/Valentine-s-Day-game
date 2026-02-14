import Phaser from 'phaser'

export default class MemoryOverlay extends Phaser.Scene {
    constructor() {
        super('MemoryOverlay')
    }

    init(data) {
        this.memory = data.memory
        this.seenCount = data.seen || 0
        this.totalCount = data.total || 1
    }

    create() {
        console.log('MemoryOverlay: create called')
        try {
            if (!this.memory) {
                console.error('MemoryOverlay: No memory data received!')
                this.scene.stop()
                this.scene.resume('Game')
                return
            }

            const { width, height } = this.scale

            // ─── Dim background (fade in) ───
            this.bg = this.add.rectangle(0, 0, width, height, 0x000000, 0)
                .setOrigin(0)
                .setDepth(0)

            this.tweens.add({
                targets: this.bg,
                alpha: 0.7,
                duration: 300,
                ease: 'Sine.easeOut'
            })

            // ─── Panel dimensions ───
            const panelW = Math.min(700, width - 80)
            const panelH = 280
            const panelX = (width - panelW) / 2
            const panelY = (height - panelH) / 2

            console.log(`MemoryOverlay: Creating panel at ${panelX}, ${panelY}`)

            // ─── Panel background with border ───
            this.panel = this.add.rectangle(panelX, panelY, panelW, panelH, 0x0f172a, 0.95)
                .setOrigin(0)
                .setStrokeStyle(1, 0x334155, 1)
                .setDepth(1)
                .setAlpha(0)

            // ─── Pink accent line at top of panel ───
            this.accent = this.add.rectangle(panelX, panelY, panelW, 3, 0xf472b6, 1)
                .setOrigin(0)
                .setDepth(2)
                .setAlpha(0)

            // ─── Date label ───
            this.dateText = this.add.text(panelX + 28, panelY + 18, this.memory.date || '???', {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '9px',
                color: '#f472b6'
            }).setDepth(2).setAlpha(0)

            // ─── Title ───
            this.titleText = this.add.text(panelX + 28, panelY + 40, this.memory.title || 'Unknown', {
                fontFamily: 'Inter, sans-serif',
                fontSize: '22px',
                fontStyle: 'bold',
                color: '#e2e8f0'
            }).setDepth(2).setAlpha(0)

            // ─── Divider line ───
            this.divider = this.add.rectangle(panelX + 28, panelY + 72, panelW - 56, 1, 0x1e293b, 1)
                .setOrigin(0)
                .setDepth(2)
                .setAlpha(0)

            // ─── Body text ───
            this.bodyText = this.add.text(panelX + 28, panelY + 86, this.memory.text || '', {
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                color: '#cbd5e1',
                lineSpacing: 8,
                wordWrap: { width: panelW - 56 }
            }).setDepth(2).setAlpha(0)

            // ─── Footer hint ───
            this.footerText = this.add.text(panelX + 28, panelY + panelH - 36, '▸  Press Enter / Space / E to continue', {
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: '#64748b'
            }).setDepth(2).setAlpha(0)

            // ─── Animate everything in ───
            const elements = [this.panel, this.accent, this.dateText, this.titleText, this.divider, this.bodyText, this.footerText]
            elements.forEach((el, i) => {
                if (el) {
                    this.tweens.add({
                        targets: el,
                        alpha: 1,
                        y: el.y,
                        duration: 350,
                        delay: 80 + i * 60,
                        ease: 'Back.easeOut'
                    })
                }
            })

            // ─── Close controls ───
            this.closeKeys = this.input.keyboard.addKeys({
                enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
                space: Phaser.Input.Keyboard.KeyCodes.SPACE,
                esc: Phaser.Input.Keyboard.KeyCodes.ESC,
                e: Phaser.Input.Keyboard.KeyCodes.E
            })

            this.canClose = false
            this.time.delayedCall(400, () => { this.canClose = true })

            console.log('MemoryOverlay: create completed successfully')

        } catch (e) {
            console.error('MemoryOverlay: Error in create', e)
            // Attempt to unpause game if overlay crashes
            const gameScene = this.scene.get('Game')
            if (gameScene) gameScene.events.emit('resume-world')
            this.scene.stop()
        }
    }

    update() {
        if (!this.canClose) return

        const close =
            Phaser.Input.Keyboard.JustDown(this.closeKeys.enter) ||
            Phaser.Input.Keyboard.JustDown(this.closeKeys.space) ||
            Phaser.Input.Keyboard.JustDown(this.closeKeys.esc) ||
            Phaser.Input.Keyboard.JustDown(this.closeKeys.e)

        if (close) {
            // Fade out
            this.tweens.add({
                targets: [this.bg, this.panel, this.accent, this.dateText, this.titleText, this.divider, this.bodyText, this.footerText],
                alpha: 0,
                duration: 200,
                ease: 'Sine.easeIn',
                onComplete: () => {
                    const gameScene = this.scene.get('Game')
                    gameScene.events.emit('resume-world')
                    this.scene.stop()
                }
            })
        }
    }
}
