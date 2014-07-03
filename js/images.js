var ImagesHandler = function (isDeveloper) {
    this.root = (isDeveloper) ? CONST.IMAGES_PATH + '/' : '';
    var buffer = {};

    var imgOnload = function () {
        buffer[this.DATA.path] = this;
        this.DATA.callback(this);
    };

    this.GetImage = function (path, callback) {
        if (path.indexOf(CONST.IMAGES_PATH) == -1)
        {
            path = this.root + path;
        }
        if (buffer[path])
        {
            callback(buffer[path]);
            return;
        }
        var img = new Image();
        img.src = path;
        img.DATA = { "path": path, "callback": callback };
        img.onload = imgOnload;
    };

    this.CreateActor = function (protoImage, callback) {
        //animation frames in data file is stored as string like "<Number>, <Number>, ..."
        //we need it to be an array
        var parseStringToArray = function (string) {
            return JSON.parse('[' + string + ']');
        };
        this.GetImage(protoImage.path, function (img) {
            var actor = new CAAT.Foundation.Actor().setRotationAnchor(protoImage.anchor.x, protoImage.anchor.y);
            if (protoImage.animations && protoImage.animations.length > 0) {
                var si = new CAAT.Foundation.SpriteImage().initialize(img, protoImage.rows, protoImage.cols);
                var animation;
                for (var key in protoImage.animations) {
                    animation = protoImage.animations[key];
                    si.addAnimation(animation.sid, parseStringToArray(animation.frames), animation.speed);
                }
                actor.setBackgroundImage(si);
            }
            else {
                actor.setBackgroundImage(img);
            }
            callback(actor, img);
        });
    };
};