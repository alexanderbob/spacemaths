module Spacemaths {
    export class Utils {
        private static self: Utils = null;
        private game_w: number;
        private game_h: number;
        constructor() {
            if (Utils.self === null)
            {
                Utils.self = this;
            }
            this.game_w = 1080 * window.devicePixelRatio;
            this.game_h = 1920 * window.devicePixelRatio;
        }
        public static getInstance() {
            if (this.self === null)
            {
                Utils.self = new Utils();
            }
            return this.self;
        }
        public getGameSizes(): { w: number; h: number; } {
            return {w: this.game_w, h: this.game_h };
        }
    }
}