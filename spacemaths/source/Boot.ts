module Spacemaths {
    export class Boot extends Phaser.State {
        preload() {
            this.load.image('preloadBar', 'assets/loader.png');
        }
        create() {
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;
            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            //this.stage.disableVisibilityChange = true;

            //this.game.scale.setScreenSize(true);
            if (this.game.device.desktop)
            {
                //  If you have any desktop specific settings, they can go in here
                //this.scale.pageAlignHorizontally = true;
            }
            else
            {
                //  Same goes for mobile settings.
                this.game.scale.forcePortrait = true;
            }            

            this.game.scale.minWidth = 480;
            this.game.scale.minHeight = 800;
            this.game.scale.maxHeight = 1920;
            this.game.scale.maxWidth = 1080;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.game.scale.setShowAll();
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.refresh();
            this.game.scale.setScreenSize(true);
            this.game.scale.setExactFit();

            /*var ow = parseInt(this.game.canvas.style.width, 10);
            var oh = parseInt(this.game.canvas.style.height, 10);
            var r = Math.max(window.innerWidth / ow, window.innerHeight / oh);
            var nw = ow * r;
            var nh = oh * r;
            this.game.canvas.style.width = nw + "px";
            this.game.canvas.style.height = nh + "px";
            this.game.canvas.style.marginLeft = (window.innerWidth / 2 - nw / 2) + "px";
            this.game.canvas.style.marginTop = (window.innerHeight / 2 - nh / 2) + "px";
            document.getElementById("content").style.width = window.innerWidth + "px";
            document.getElementById("content").style.height = window.innerHeight + "px";//The css for body includes 1px top margin, I believe this is the cause for this -1
            document.getElementById("content").style.overflow = "hidden";*/


            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.game.state.start('Preloader', true, false);

            var self = this;
            window.addEventListener('resize', function (event) {
                self.game.scale.setExactFit();
                self.game.scale.refresh();
            });
        }
    }
}