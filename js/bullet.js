var Bullet = function (gameData, bulletSID, centerX, centerY, angle, damage, callback) {
    var proto = gameData.Find(bulletSID),
        self = this;
    if (!proto) {
        return false;
    }
    proto.speedMin = parseFloat(proto.speedMin);
    proto.speedMax = parseFloat(proto.speedMax);
    this.speed = proto.speedMin + (proto.speedMax - proto.speedMin) * Math.random();
    this.damage = damage;
    this.actor;
    this.angle = angle;
    this.centerX = centerX;
    this.centerY = centerY;
    var protoProjectileImage = gameData.Find(proto.projectileImageId),
        protoBlastImage = gameData.Find(proto.blastImageId);
    Images.CreateActor(protoProjectileImage, function (actor, img) {
        actor.enableEvents(false).centerOn(centerX, centerY).setRotation(angle);
        self.actor = actor;
        callback(self);
    });
}

Bullet.prototype.Move = function () {
    this.centerX += Math.cos(this.angle) * this.speed;
    this.centerY += Math.sin(this.angle) * this.speed;
    this.actor.centerOn(this.centerX, this.centerY);

    var outOfBounds = this.actor.AABB.x1 < 0 && this.actor.AABB.x < 0;
    outOfBounds = outOfBounds || this.actor.AABB.x1 > CONST.CANVAS_SIZES.width && this.actor.AABB.x > CONST.CANVAS_SIZES.width;
    outOfBounds = outOfBounds || this.actor.AABB.y < 0 && this.actor.AABB.y1 < 0;
    outOfBounds = outOfBounds || this.actor.AABB.y1 > CONST.CANVAS_SIZES.height && this.actor.AABB.y > CONST.CANVAS_SIZES.height;
    return outOfBounds;
}