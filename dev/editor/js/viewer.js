var Viewer = function(gameData) {
    this.actor;
    this.gameData = gameData;
    this.containers = [];
    this.bullets = [];
    var director = new CAAT.Foundation.Director().
            initialize(CONST.CANVAS_SIZES.width, CONST.CANVAS_SIZES.height, document.getElementById('canvas')).
            setClear(false);
    CAAT.loop(30);
    this.director = director;
    this.scene = director.createScene();
    this.currentImage = '';
    this.bg = new CAAT.Foundation.ActorContainer().
            setBounds(0, 0, director.width, director.height).
            setFillStyle('#000');
    this.scene.addChild(this.bg);
    var self = this;
    var addBullet = function (viewerShip, gun) {
        var gunProto = gameData.Find(gun.sid),
                sid = gunProto.bulletProto,
                actor = gun.actor,
                angle = viewerShip.container.rotationAngle + actor.rotationAngle,
                actorOffsetW = Math.cos(angle) * actor.width / 2,
                actorOffsetH = Math.sin(angle) * actor.height / 2,
                cx = (actor.AABB.x1 + actor.AABB.x) / 2 + actorOffsetW,
                cy = (actor.AABB.y + actor.AABB.y1) / 2 + actorOffsetH;
        gunProto.damageMax = parseFloat(gunProto.damageMax);
        gunProto.damageMin = parseFloat(gunProto.damageMin);
        var damage = gunProto.damageMin + (gunProto.damageMax - gunProto.damageMin) * Math.random();
        new Bullet(gameData, sid, cx, cy, angle, damage, function (bullet) {
            self.bullets.push(bullet);
            self.scene.addChild(bullet.actor);
        });
    };
    var move = function (dt) {
        var toRemove = [];
        for (var i in self.bullets)
        {
            //if is outOfScreenBounds
            if (self.bullets[i].Move())
            {
                self.scene.removeChild(self.bullets[i]);
                toRemove.push(i);
            }
        }
        for (var i in toRemove)
        {
            self.bullets.splice(toRemove[i], 1);
        }

        var guns;
        //check containers and look for any firing guns
        for (var viewerShipIndex in self.containers)
        {
            guns = self.containers[viewerShipIndex].GetGuns();
            for (var gunIndex in guns)
            {
                switch (guns[gunIndex].Move(dt))
                {
                    case STATES.MOVE_GUN_FIRED:
                        addBullet(self.containers[viewerShipIndex], guns[gunIndex]);
                        break;
                }
            }
        }
    }
    this.scene.onRenderStart = move;
};

Viewer.prototype.RotateActorTo = function (actor, val) {
    actor.setRotation(val);
}

Viewer.prototype.InspectProtoImage = function (path) {
    var self = this;
    if (path == this.currentImage) {
        return;
    }
    Images.GetImage(path, function (img) {
        if (self.actor) {
            self.bg.removeChild(self.actor);
        }
        self.actor = new CAAT.Foundation.Actor()
                    .setBackgroundImage(img)
                    .centerOn(CONST.CANVAS_SIZES.width / 2, CONST.CANVAS_SIZES.height / 2)
                    .setRotationAnchor(0.5, 0.5);
        self.bg.addChild(self.actor);
    });
}

Viewer.prototype.AddShip = function (shipSID) {
    var index = this.containers.length;
    var viewerShip = new Ship(this.gameData, shipSID, function () {
        console.log('Ship ' + shipSID + ' added ok');
    });
    this.containers.push(viewerShip);
    this.scene.addChild(viewerShip.container);
    return index;
}

Viewer.prototype.RemoveShipByIndex = function (index) {
    if (!this.containers[index])
    {
        return false;
    }
    this.scene.removeChild(this.containers[index].container);
    this.containers.splice(index, 1);
    return true;
}

Viewer.prototype.RemoveShip = function (viewerShip) {
    for (var i in this.containers)
    {
        if (this.containers[i] == viewerShip)
        {
            this.scene.removeChild(viewerShip.container);
            this.containers.splice(i, 1);
            return true;
        }
    }
    return false;
}