var CONST = {
    PROTO: {
        SHIP:   1,
        GUN:    2,
        BULLET: 3,
        IMAGE:  4,
    },
    EPSYLON_ANGLE: 0.05,
    EPSYLON_PX: 16,
    FPS: 30,
    OPERATIONS: {
        PLUS:     1,
        MINUS:    2,
        MULTIPLY: 3,
        DIVIDE:   4
    },
    STATES: {
        SHIP: {
            IDLE:       0,
            AIMING:     1,
            AIMED:      2,
            AIMINGBACK: 3
        },
        GUN: {
            IDLE:       0,
            AIMING:     1,
            AIMED:      2,
            AIMINGBACK: 3,
            FIRE_START: 4,
            FIRE_END:   5,
            SKIP:       6
        },
        BULLET: {
            ACTIVE:     1,
            BLASTED:    2
        }
    }
};
