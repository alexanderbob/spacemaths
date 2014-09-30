module Spacemaths {

    export class Game extends Phaser.Game {
        public transitions: Phaser.Plugin.StateTransition;

        constructor() {
            var utils = Utils.getInstance(),
                sizes = utils.getGameSizes();
            //super(480, 800, Phaser.AUTO, 'content', null);
            super(sizes.w, sizes.h, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('StageOffice', StageOffice, false);
            this.state.add('StageDayResults', StageDayResults, false);
            this.state.add('StageLevelSelect', StageLevelSelect, false);
            this.state.start('Boot');

        }

    }

}  