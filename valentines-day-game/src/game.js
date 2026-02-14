import Phaser from 'phaser'
import Boot from './scenes/Boot'
import TitleScene from './scenes/TitleScene'
import GameScene from './scenes/GameScene'
import MemoryOverlay from './scenes/MemoryOverlay'
import EndingScene from './scenes/EndingScene'

export function createGame() {
    return new Phaser.Game({
        type: Phaser.AUTO,
        width: 960,
        height: 540,
        backgroundColor: '#0b0f1a',
        parent: 'app',
        physics: {
            default: 'arcade',
            arcade: { gravity: { y: 800 }, debug: false }
        },
        scene: [Boot, TitleScene, GameScene, MemoryOverlay, EndingScene],
        pixelArt: true,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    })
}
