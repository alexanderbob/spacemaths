module Spacemaths {

    export class MainMenu extends Phaser.State {
        playButton: Phaser.Button;

        create() {
            this.playButton = this.add.button(
                this.game.world.centerX,
                this.game.world.centerY,
                'button_startgame',
                this.playClicked,
                this,
                0, 1, 2
                );
            this.playButton.anchor.setTo(0.5, 0.5);
            /*this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;

            this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);

            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(this.logo).to({ y: 220 }, 2000, Phaser.Easing.Elastic.Out, true, 2000);*/

            //this.input.onDown.addOnce(this.fadeOut, this);
        }
        playClicked() {
            this.fadeOut();
        }
        fadeOut() {
            var tween = this.add.tween(this.playButton).to({ y: 0 }, 2000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        }
        startGame() {
            //this.game.state.start('StageOffice', true, false);
            (<Game>this.game).transitions.to('StageLevelSelect');
        }
    }

}

