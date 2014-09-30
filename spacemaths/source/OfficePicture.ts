module Spacemaths {
    export class OfficePicture {
        private group: Phaser.Group;
        private stage: Phaser.State;
        constructor(stage: Phaser.State, frame_image: string, picture_image: string, frame_xy: { x: number; y: number }, picture_y: number) {
            this.stage = stage;

            this.group = stage.add.group();
            this.group.z = 1;
            this.group.x = frame_xy.x;
            this.group.y = frame_xy.y;

            this.group.create(0, 0, frame_image);
            this.group.create(0, picture_y, picture_image);
            this.group.setAll('anchor.x', 0.5);
            this.group.setAll('anchor.y', 0);
        }
        update() {

        }
        public doShatter() {
            var tween = this.stage.game.add.tween(this.group)
                .to({ angle: 3 }, 200, Phaser.Easing.Linear.None, true)
                .to({ angle: 1 }, 250, Phaser.Easing.Linear.None, true)
                .to({ angle: 2 }, 300, Phaser.Easing.Linear.None, true)
                .to({ angle: 0 }, 400, Phaser.Easing.Linear.None, true)
            ;
        }
    }
}

