var Gun = function (gameData, sid, centerX, centerY, callback) {
    this.sid = sid;
    this.actor;
    var bulletsToFire = 0,
        self = this,
        proto = gameData.Find(sid),
        state = STATES.GUN_IDLE,
        lastFireTime = 0;

    Images.GetImage(gameData.Find(proto.imageId).path, function (img) {
        self.actor = new CAAT.Foundation.Actor().
                         setBackgroundImage(img).
                         centerOn(centerX, centerY).
                         enableEvents(false);
        if (callback)
            callback(self);
    })
    var doFire = function () {
        bulletsToFire--;
        if (bulletsToFire == 0) {
            state = STATES.GUN_IDLE;
        }
    }
    this.State = function () {
        return state;
    }
    this.Fire = function () {
        bulletsToFire += proto.bulletsPerFire;
        state = STATES.GUN_FIRING;
    }
    this.Move = function (dt) {
        if (state == STATES.GUN_FIRING && lastFireTime < dt - proto.bulletIntervalPerFire) {
            lastFireTime = dt;
            doFire();
            return STATES.MOVE_GUN_FIRED;
        }
        return STATES.MOVE_GUN_SKIP;
    }
};