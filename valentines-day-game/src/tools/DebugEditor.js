import { TIMELINE } from '../data/timeline';

export default class DebugEditor {
    constructor(scene) {
        this.scene = scene;
        this.active = false;
        this.layers = [];
        this.selectedLayerIndex = 0;
        this.speed = 1; // Movement speed modifier

        // Create UI Container
        this.uiText = scene.add.text(10, 80, '', {
            fontFamily: 'monospace',
            fontSize: '12px',
            backgroundColor: '#000000aa',
            color: '#00ff00',
            padding: { x: 10, y: 10 }
        }).setScrollFactor(0).setDepth(1000).setVisible(false);

        // Input Keys
        this.keys = scene.input.keyboard.addKeys({
            toggle: Phaser.Input.Keyboard.KeyCodes.T,
            tab: Phaser.Input.Keyboard.KeyCodes.TAB,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            print: Phaser.Input.Keyboard.KeyCodes.P,
            prev: Phaser.Input.Keyboard.KeyCodes.OPEN_BRACKET,
            next: Phaser.Input.Keyboard.KeyCodes.CLOSED_BRACKET,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT
        });

        // Debounce for toggle/tab
        this.lastInputTime = 0;
    }

    addLayer(name, object) {
        if (!object) return;
        this.layers.push({
            name: name,
            object: object,
            // Try to detect if it's a TileSprite (has tileScale) or Image (has scale)
            isTileSprite: object.setTileScale !== undefined
        });
    }

    update() {
        const time = this.scene.time.now;

        // Toggle Editor
        if (this.keys.toggle.isDown && time > this.lastInputTime + 300) {
            this.active = !this.active;
            this.uiText.setVisible(this.active);
            this.lastInputTime = time;
            console.log(this.active ? "Debug Editor: ON" : "Debug Editor: OFF");
        }

        if (!this.active) return;

        // Cycle Layers (TAB)
        if (this.keys.tab.isDown && time > this.lastInputTime + 300) {
            this.selectedLayerIndex = (this.selectedLayerIndex + 1) % this.layers.length;
            this.lastInputTime = time;
        }

        if (this.layers.length === 0) {
            this.uiText.setText("No layers registered.");
            return;
        }

        const current = this.layers[this.selectedLayerIndex];
        const obj = current.object;
        const isShift = this.keys.shift.isDown;
        const moveSpeed = isShift ? 10 : 1;
        const scaleSpeed = isShift ? 0.1 : 0.01;

        // Position (Arrows)
        // For TileSprites, we might want to move the actual Y position, or the tilePositionY
        // Usually backgrounds are positioned absolutely.
        if (this.keys.up.isDown) obj.y -= moveSpeed;
        if (this.keys.down.isDown) obj.y += moveSpeed;
        // X is usually handled by scroll, but let's allow offsetting
        if (this.keys.left.isDown) obj.x -= moveSpeed;
        if (this.keys.right.isDown) obj.x += moveSpeed;

        // Scale (WASD)
        // Handle both TileSprite (tileScaleX/Y) and regular Sprite (scaleX/Y)
        if (current.isTileSprite) {
            if (this.keys.w.isDown) obj.tileScaleY += scaleSpeed;
            if (this.keys.s.isDown) obj.tileScaleY -= scaleSpeed;
            if (this.keys.d.isDown) obj.tileScaleX += scaleSpeed;
            if (this.keys.a.isDown) obj.tileScaleX -= scaleSpeed;
        } else {
            if (this.keys.w.isDown) obj.scaleY += scaleSpeed;
            if (this.keys.s.isDown) obj.scaleY -= scaleSpeed;
            if (this.keys.d.isDown) obj.scaleX += scaleSpeed;
            if (this.keys.a.isDown) obj.scaleX -= scaleSpeed;
        }

        // Teleport ( [ / ] )
        if (this.keys.prev.isDown && time > this.lastInputTime + 300) {
            this.teleport(-1);
            this.lastInputTime = time;
        }
        if (this.keys.next.isDown && time > this.lastInputTime + 300) {
            this.teleport(1);
            this.lastInputTime = time;
        }

        // Print (P)
        if (this.keys.print.isDown && time > this.lastInputTime + 500) {
            this.printValues();
            this.lastInputTime = time;
        }

        // Update UI Text
        this.updateUI(current);
    }

    teleport(direction) {
        // Find nearest timeline event
        const playerX = this.scene.player.x;
        let bestIndex = -1;
        let minDiff = Infinity;

        TIMELINE.forEach((event, index) => {
            const diff = Math.abs(event.x - playerX);
            if (diff < minDiff) {
                minDiff = diff;
                bestIndex = index;
            }
        });

        let targetIndex = bestIndex + direction;
        // Clamp
        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex >= TIMELINE.length) targetIndex = TIMELINE.length - 1;

        const targetX = TIMELINE[targetIndex].x;
        this.scene.player.setX(targetX);
        console.log(`Teleported to: ${TIMELINE[targetIndex].title} (${targetX})`);
    }

    updateUI(current) {
        const obj = current.object;
        let scaleX, scaleY;
        
        if (current.isTileSprite) {
            scaleX = obj.tileScaleX.toFixed(3);
            scaleY = obj.tileScaleY.toFixed(3);
        } else {
            scaleX = obj.scaleX.toFixed(3);
            scaleY = obj.scaleY.toFixed(3);
        }

        this.uiText.setText(
            `[DEBUG EDITOR DEBUG MODE]\n` +
            `-----------------------\n` +
            `LAYER: ${current.name} (${this.selectedLayerIndex + 1}/${this.layers.length})\n` +
            `POS  : X=${obj.x.toFixed(1)}, Y=${obj.y.toFixed(1)}\n` +
            `SCALE: X=${scaleX}, Y=${scaleY}\n` +
            `-----------------------\n` +
            `[TAB] Next Layer\n` +
            `[ARROWS] Move Position (Shift for fast)\n` +
            `[W/S] Scale Height\n` +
            `[A/D] Scale Width\n` +
            `[ / ] Teleport Timeline\n` +
            `[P] Print to Console`
        );
    }

    printValues() {
        console.log("--- DEBUG EDITOR VALUES ---");
        this.layers.forEach(l => {
            const obj = l.object;
            if (l.isTileSprite) {
                console.log(`${l.name}: Pos(${obj.x.toFixed(1)}, ${obj.y.toFixed(1)}), TileScale(${obj.tileScaleX.toFixed(4)}, ${obj.tileScaleY.toFixed(4)})`);
            } else {
                console.log(`${l.name}: Pos(${obj.x.toFixed(1)}, ${obj.y.toFixed(1)}), Scale(${obj.scaleX.toFixed(4)}, ${obj.scaleY.toFixed(4)})`);
            }
        });
        console.log("---------------------------");
        // Also show alert for user visibility
        // alert("Values printed to console (F12)");
    }
}
