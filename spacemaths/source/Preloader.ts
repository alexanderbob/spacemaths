 module Spacemaths {
    export class Preloader extends Phaser.State {
        preloadBar: Phaser.Sprite;
        preload() {
            //  Set-up our preloader sprite
            var sizes = Utils.getInstance().getGameSizes(),
                bar_img = <HTMLImageElement>this.game.cache.getImage('preloadBar'),
                cx = (sizes.w - bar_img.width) * 0.5,
                cy = (sizes.h - bar_img.height) * 0.5;
            this.preloadBar = this.add.sprite(cx, cy, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            //  Load our actual games assets
            this.load.image('table_clock', 'assets/clock.png');
            this.load.image('table_clock_arrow', 'assets/clock_arrow.png');
            this.load.image('engineer', 'assets/engineer.png');
            this.load.image('hand_left', 'assets/hand_left.png');
            this.load.image('hand_right', 'assets/hand_right.png');
            this.load.image('paper', 'assets/paper.png');
            this.load.image('wall_picture', 'assets/picture.png');
            this.load.image('wall_picture_frame', 'assets/picture_frame.png');
            this.load.image('table', 'assets/table.png');
            this.load.image('wall', 'assets/wall.png');
            this.load.image('floor', 'assets/floor.png');
            this.load.image('battery', 'assets/battery.png');
            this.load.image('computer', 'assets/computer.png');
            this.load.image('door_back', 'assets/door_back.png');
            this.load.spritesheet('door', 'assets/door.png', 272, 650, 2);
            /*this.load.audio('music', 'assets/title.mp3', true);
            this.load.spritesheet('simon', 'assets/simon.png', 58, 96, 5);
            this.load.image('level1', 'assets/level1.png');*/
        }
 
        create() {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        }
 
        startMainMenu() {
            //this.game.state.start('MainMenu', true, false);
            this.game.state.start('StageOffice', true, false);
        }
 
    }
 
}

