import Phaser from 'phaser'

export default class Boot extends Phaser.Scene {
    constructor() {
        super('Boot')
    }

    preload() {
        // Show a simple loading message
        const { width, height } = this.scale
        this.add.text(width / 2, height / 2, 'Loading our story…', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '12px',
            color: '#94a3b8'
        }).setOrigin(0.5)

        // Load the character spritesheet
        // Image is 116x260, 4 cols x 4 rows
        // Frame size: 29x65
        this.load.spritesheet('characters', '/assets/sprite male.png', {
            frameWidth: 29,
            frameHeight: 65
        })

        // Load female spritesheet (4x4, 468x1036 -> 117x259 per frame)
        this.load.spritesheet('female', '/assets/spritesheet female.png', {
            frameWidth: 117,
            frameHeight: 259
        })

        // Load CCLEX Parallax layers
        this.load.image('cclex_sky', '/assets/cclex/sky.png')
        this.load.image('cclex_far', '/assets/cclex/far.png')
        this.load.image('cclex_near', '/assets/cclex/near.png')

        // Load City Background (600-1400)
        this.load.image('city_sky', '/assets/city background/sky.png')
        this.load.image('city_far', '/assets/city background/far.png')
        // Load IT Park Background (After Friends ~3000)
        this.load.image('it_sky', '/assets/it_park/sky.png')
        this.load.image('it_far', '/assets/it_park/far.png')
        this.load.image('it_near', '/assets/it_park/near.png')

        // ─── 2. SM Seaside ───
        this.load.image('seaside_sky', '/assets/SM Seaside/sky.png')
        this.load.image('seaside_far', '/assets/SM Seaside/far.png')
        this.load.image('seaside_near', '/assets/SM Seaside/near.png')

        // ─── 4. Old Bridge Park ─── (CCLEX is already loaded above at 3)
        this.load.image('bridge_sky', '/assets/old bridge park/sky.png')
        this.load.image('bridge_far', '/assets/old bridge park/far.png')
        this.load.image('bridge_near', '/assets/old bridge park/near.png')

        // ─── 5. SM JMall ───
        this.load.image('jmall_sky', '/assets/SM JMall/sky.png')
        this.load.image('jmall_far', '/assets/SM JMall/far.png')
        this.load.image('jmall_near', '/assets/SM JMall/near.png')

        // ─── 6. Alliance ───
        this.load.image('alliance_sky', '/assets/Alliance/sky.png')
        this.load.image('alliance_far', '/assets/Alliance/far.png')
        this.load.image('alliance_near', '/assets/Alliance/near.png')

        // ─── 7. Church ───
        this.load.image('church_sky', '/assets/Church/sky.png')
        this.load.image('church_far', '/assets/Church/far.png')
        this.load.image('church_near', '/assets/Church/near.png')

        // ─── 8. Bali ───
        this.load.image('bali_sky', '/assets/Bali/sky.png')
        this.load.image('bali_far', '/assets/Bali/far.png')
        this.load.image('bali_near', '/assets/Bali/near.png')

        // ─── 9. Colon ───
        this.load.image('colon_sky', '/assets/Colon/sky.png')
        this.load.image('colon_far', '/assets/Colon/far.png')
        this.load.image('colon_near', '/assets/Colon/near2.png')

        // ─── 10. Boljoon ───
        this.load.image('boljoon_sky', '/assets/Boljoon/sky.png')
        this.load.image('boljoon_far', '/assets/Boljoon/far.png')
        this.load.image('boljoon_near', '/assets/Boljoon/near.png')

        // ─── 11. Saekyung ───
        this.load.image('saekyung_sky', '/assets/Saekyung/sky.png')
        this.load.image('saekyung_far', '/assets/Saekyung/far.png')
        this.load.image('saekyung_near', '/assets/Saekyung/near.png')

        // ─── 12. Barili ───
        this.load.image('barili_sky', '/assets/Barili/sky.png')
        this.load.image('barili_far', '/assets/Barili/far.png')
        this.load.image('barili_near', '/assets/Barili/near.png')

        // ─── Background Music ───
        this.load.audio('bgm', '/assets/background-music.mp3')

    }

    create() {
        // ─── Generate heart sprite via Graphics API ───
        this.generateHeartTexture()

        // ─── Create walk animations ───
        // Male walk cycle (All frames 0-15 in sequence)
        this.anims.create({
            key: 'male-idle',
            frames: [{ key: 'characters', frame: 0 }],
            frameRate: 1,
            repeat: -1
        })

        this.anims.create({
            key: 'male-walk',
            frames: this.anims.generateFrameNumbers('characters', { start: 0, end: 15 }),
            frameRate: 8,
            repeat: -1
        })

        // Female walk cycle
        this.anims.create({
            key: 'female-idle',
            frames: [{ key: 'female', frame: 0 }],
            frameRate: 1,
            repeat: -1
        })

        this.anims.create({
            key: 'female-walk',
            frames: this.anims.generateFrameNumbers('female', { start: 0, end: 15 }),
            frameRate: 8,
            repeat: -1
        })

        this.scene.start('Title')
    }

    generateHeartTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false })
        const s = 3

        const p = 0xf472b6 // pink
        const h = 0xf9a8d4 // highlight

        const pixels = [
            [0, 1, 1, 0, 0, 1, 1, 0],
            [1, 2, 2, 1, 1, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 1],
            [0, 2, 2, 2, 2, 2, 2, 0],
            [0, 0, 2, 2, 2, 2, 0, 0],
            [0, 0, 0, 2, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ]

        const colors = { 1: h, 2: p }

        for (let y = 0; y < pixels.length; y++) {
            for (let x = 0; x < pixels[y].length; x++) {
                const c = pixels[y][x]
                if (c !== 0) {
                    g.fillStyle(colors[c], 1)
                    g.fillRect(x * s, y * s, s, s)
                }
            }
        }

        g.generateTexture('memory', 8 * s, 8 * s)
        g.destroy()
    }
}
