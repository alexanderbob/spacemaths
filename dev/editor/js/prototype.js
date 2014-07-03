Array.prototype.isSIDExists = function (sid, type) {
    for (var i in this)
    {
        if (this[i].SID == sid)
        {
            if (typeof type !== 'undefined')
                return (this[i].type == type) ? CONST.SIDEXISTS_CORRECT : CONST.SIDEXISTS_INCORRECTTYPE;
            else
                return CONST.SIDEXISTS_CORRECT;
        }
    }
    return CONST.SIDEXISTS_NOTFOUND;
};

Array.prototype.getProtoBySID = function (sid) {
    for (var i in this)
    {
        if (this[i].SID == sid)
        {
            return this[i];
        }
    }
    return false;
};