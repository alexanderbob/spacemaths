module Spacemaths {

    export class StageLevelSelect extends Phaser.State {
        button_space: Phaser.Button;
        button_moon: Phaser.Button;
        button_mars: Phaser.Button;

        create() {
            var height = this.game.world.height;
            this.button_space = this.add.button(
                this.game.world.centerX, 0.1 * height,
                'buttons_level', this.selectSpace, this, 0, 0, 2, 0);
            this.button_moon = this.add.button(
                this.game.world.centerX, 0.4 * height,
                'buttons_level', this.selectMoon, this, 3, 3, 5, 3);
            this.button_mars = this.add.button(
                this.game.world.centerX, 0.7 * height,
                'buttons_level', this.selectMars, this, 6, 6, 8, 6);
            this.button_space.anchor.x = 0.5;
            this.button_mars.anchor.x = 0.5;
            this.button_moon.anchor.x = 0.5;
        }

        selectSpace() {
            //(<Game>this.game).transitions.to('StageOffice');
            this.startStage();
        }

        selectMoon() {
            //(<Game>this.game).transitions.to('StageOffice');
            this.startStage();
        }

        selectMars() {
            //(<Game>this.game).transitions.to('StageOffice');
            this.startStage();
        }

        private startStage() {
            this.stage.game.add.tween(this.button_space).to({
                x: -this.button_space.width
            }, 500, Phaser.Easing.Linear.None, true);
            this.stage.game.add.tween(this.button_moon).to({
                x: this.game.world.width + this.button_moon.width
            }, 500, Phaser.Easing.Linear.None, true);
            this.stage.game.add.tween(this.button_mars).to({
                y: this.game.world.height
            }, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.loadOffice, this);
        }

        private loadOffice() {
            this.game.state.start('StageOffice', true, false);
        }
    }
}