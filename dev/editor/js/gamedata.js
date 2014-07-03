var GameData = function (isDeveloper) {
    this.content = {};
    var uri = (isDeveloper) ? 'ajax/process.php?command=get&callback=?' : 'data/proto.js',
        dataType = (isDeveloper) ? 'jsonp' : 'json';
}

GameData.prototype.Find = function (key) {
    return this.content[key];
}

GameData.prototype.Sync = function (callback) {
    var self = this;

    //fix dynamic typization by this function
    var fixValueTypes = function (entry) {
        entry.type = parseInt(entry.type);
        switch(entry.type)
        {
            case CONST.PROTO.SHIP:
                entry.hp = parseFloat(entry.hp);
                if (entry.gunPlatforms && entry.gunPlatforms.length > 0)
                {
                    for (var i in entry.gunPlatforms)
                    {
                        entry.gunPlatforms[i].x = parseFloat(entry.gunPlatforms[i].x);
                        entry.gunPlatforms[i].y = parseFloat(entry.gunPlatforms[i].y);
                    }
                }
                break;
            case CONST.PROTO_GUN:
                entry.operationType = parseInt(entry.operationType);
                entry.difficulty = parseFloat(entry.difficulty);
                entry.damageMax = parseFloat(entry.damageMax);
                entry.damageMin = parseFloat(entry.damageMin);
                entry.bulletIntervalPerFire = parseFloat(entry.bulletIntervalPerFire);
                entry.bulletsPerFire = parseInt(entry.bulletsPerFire);
                break;
            case CONST.PROTO_BULLET:
                entry.speedMin = parseFloat(entry.speedMin);
                entry.speedMax = parseFloat(entry.speedMax);
                break;
            case CONST.PROTO_IMAGE:
                entry.rowsCount = parseInt(entry.rowsCount);
                entry.colsCount = parseInt(entry.colsCount);
                entry.anchor.x = parseFloat(entry.anchor.x);
                entry.anchor.y = parseFloat(entry.anchor.y);
                if (entry.animations && entry.animations.length > 0)
                {
                    for (var i in entry.animations)
                    {
                        entry.animations[i].speed = parseFloat(entry.animations[i].speed);
                    }
                }
                break;
        }
        return entry;
    };

    $.ajax({ "url": uri, "dataType": dataType, "cache": false }).done(function (resp) {
        //clear content refill it again
        self.content = {};
        if (resp.code == 1)
        {
            for (var sid in resp.data)
            {
                resp.data[sid].SID = sid;
                self.content[sid] = fixValueTypes(resp.data[sid]);
            }
        }
        callback(resp.code);
    });
}

GameData.prototype.FindAllImages = function () {
    return this.FindKeysByType(CONST.PROTO.IMAGE);
};

GameData.prototype.FindKeysByType = function (type) {
    var sids = [],
        entity;
    for (var sid in this.content) {
        entity = this.content[sid];
        if (entity.type == type) {
            sids.push(sid);
        }
    }
    return sids;
};