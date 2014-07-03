var ShipProto1 = {
    hp: 100,
    imageId: 'ship_1',
    gunPlatforms: [
        {x: 45, y: 30}/*,
        {x: 80, y: 30}*/
    ]
};

var ShipProto2 = {
    hp: 150,
    imageId: 'ship_2',
    gunPlatforms: [
        {x: 86, y: 50}
    ]
};

var ShipProto3 = {
    hp: 150,
    imageId: 'ship_blue',
    gunPlatforms: [
        {x: 0, y: 0}
    ]
};

var BulletProto1 = {
    speedMin: 50,
    speedMax: 50,
    projectileImageId: 'bullet_1',
    blastImageId: 'blast_1',
    rows: 4,
    cols: 1,
    animation: {
        'fly': {
            frames: [0, 1, 2, 3],
            speed: 150,
            cycled: true
        }
    }
};

var BulletProto2 = {
    speedMin: 50,
    speedMax: 50,
    projectileImageId: 'rocket_1',
    blastImageId: 'blast_1',
    rows: 3,
    cols: 1,
    animation: {
        'fly': {
            frames: [0, 1, 2],
            speed: 100,
            cycled: true
        }
    }
};

var BulletProto3 = {
    speedMin: 200,
    speedMax: 250,
    projectileImageId: 'bullet_2',
    blastImageId: 'blast_1',
    rows: 1,
    cols: 1
};

var GunProto1 = {
    imageId: 'gun_1',
    operationType: CONST.OPERATIONS.PLUS,
    difficulty: 1,
    bulletProto: BulletProto1,
    needAim: true,
    damageMin: 5,
    damageMax: 15,
    rotationAnchor: {
        x: 0.286,
        y: 0.5
    }
};

var GunProto2 = {
    imageId: 'gun_1',
    operationType: CONST.OPERATIONS.MULTIPLY,
    difficulty: 1,
    bulletProto: BulletProto2,
    needAim: true,
    damageMin: 5,
    damageMax: 15,
    rotationAnchor: {
        x: 0.286,
        y: 0.5
    }
};

var GunProto3 = {
    imageId: 'gun_2',
    operationType: CONST.OPERATIONS.MINUS,
    difficulty: 1,
    bulletProto: BulletProto3,
    needAim: true,
    damageMin: 5,
    damageMax: 15
};