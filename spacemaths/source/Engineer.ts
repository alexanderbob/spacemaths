module Spacemaths {
    enum EngineerActionState { IDLE, MOVE_IN, MOVE_OUT };

    export class Engineer extends Phaser.Sprite {
        private action_state = EngineerActionState.IDLE;
        private move_in_coords = { x: 0, y: 0 };
        private move_out_coords = { x: 0, y: 0 };
        private move_epsylon = 5;
        private move_in_callback: Function;
        private move_out_callback: Function;
        private stage_office: StageOffice;
        constructor(game: Phaser.Game, x: number, y: number, move_in_callback: Function, move_out_callback: Function, stage_office: StageOffice) {
            super(game, x, y, 'engineer', 0);
            this.move_in_callback = move_in_callback;
            this.move_out_callback = move_out_callback;
            this.stage_office = stage_office;
            this.anchor.setTo(0.5, 0.5);
            /*this.game.physics.arcade.enableBody(this);*/
            game.add.existing(this);

            this.game.add.tween(this)
                .to({ rotation: Math.PI / 50 }, 250, Phaser.Easing.Linear.None, true)
                .to({ rotation: -Math.PI / 50 }, 250, Phaser.Easing.Linear.None, true)
                .loop()
                .start();
        }
        update() {
            
        }
        public move_in() {
            var tween = this.game.add.tween(this).to(
                {
                    x: this.move_in_coords.x,
                    y: this.move_in_coords.y
                }, 1000, Phaser.Easing.Linear.None, true
            );
            tween.onComplete.add(this.move_in_callback, this.stage_office);
        }
        public move_out() {
            var tween = this.game.add.tween(this).to(
                {
                    x: this.move_out_coords.x,
                    y: this.move_out_coords.y
                }, 1000, Phaser.Easing.Linear.None, true
            );
            tween.onComplete.add(this.move_out_callback, this.stage_office);
        }
        public setMoveInXY(x: number, y: number) {
            this.move_in_coords.x = x;
            this.move_in_coords.y = y;
        }
        public setMoveOutXY(x: number, y: number) {
            this.move_out_coords.x = x;
            this.move_out_coords.y = y;
        }
    }
}

