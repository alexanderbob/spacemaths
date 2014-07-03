var Ship = function (gameData, shipSID, callback) {
    var ship = gameData.Find(shipSID);
    if (!ship || ship.type != CONST.PROTO_SHIP) {
        return false;
    }
    var self = this;
    this.container = new CAAT.Foundation.ActorContainer().setRotation(0);
    this.ship;
    this.SID = shipSID;
    Images.CreateActor(gameData.Find(ship.imageId), function (actor, img) {
        var cx = (CONST.CANVAS_SIZES.width - img.width) / 2,
            cy = (CONST.CANVAS_SIZES.height - img.height) / 2;
        self.container.setSize(img.width, img.height).setPosition(cx, cy);
        actor.setPosition(0, 0).enableEvents(false);
        self.ship = actor;
        self.container.addChild(self.ship);
        if (callback)
            callback();
    });
    var guns = [],
        platformsCount = ship.gunPlatforms.length;
    this.GetGuns = function () {
        return guns;
    };
    this.GetGun = function (index) {
        if (index < 0 || index > platformsCount - 1) {
            return false;
        }
        return guns[index];
    };
    this.SetGun = function (index, gameData, gunSID, callback) {
        var gun = this.GetGun(index),
            proto = gameData.Find(gunSID);
        if (gun === false || !proto || proto.type != CONST.PROTO_GUN) {
            return false;
        }
        if (gun) {
            self.container.removeChild(gun.actor);
        }
        var coords = gameData.Find(shipSID).gunPlatforms[index];
        new Gun(gameData, gunSID, coords.x, coords.y, function (gun) {
            guns[index] = gun;
            self.container.addChild(gun.actor);
            if (callback)
                callback();
        });
        return true;
    };
    //function returns bullet actor, later we need to add it to Viewer bullets array and calc it position
    this.Fire = function (gunIndex, callback) {
        if (!guns[gunIndex]) {
            console.log('Ship: ' + this.SID + '; Gun ' + gunIndex + ' not found!');
            return false;
        }
        guns[gunIndex].Fire();
    };
}