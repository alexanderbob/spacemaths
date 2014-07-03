var Utils = function(director) {
    this.Images = new ImagesHandler(false);
    this.GameData = new GameData(false);
    this.GetRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    this.CalcPercent = function(part, total) {
        return parseFloat( (part / total).toFixed(2) ) * 100;
    };
};