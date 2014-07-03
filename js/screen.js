var Screen = new function() {
    var _nativeW = 1280;
    var _nativeH = 768;
    var _offsetX = 0;
    var _offsetY = 0;
    var _scale = 1;

    //check scaling parameter @ launch
    var autoScale = window.location.hash.indexOf('autoscale') > -1;

    var interval = setInterval(function() {
        var parent = document.getElementById('i');
        if (parent)
        {
            clearInterval(interval);
            //got some problems with Firefox, think we should round value to .XX
            if (!autoScale)
            {
                parent.style.marginLeft = Math.round(-_nativeW / 2) + 'px';
                parent.style.marginTop = Math.round(-_nativeH / 2) + 'px';
            }
            else
            {
                var _scrW = window.innerWidth;
                var _scrH = window.innerHeight;
                _scale = Math.min( _scrW / _nativeW, _scrH / _nativeH);
                _scrW = _nativeW * _scale;
                _scrH = _nativeH * _scale;
                parent.style.marginLeft = Math.round(-_scrW / 2)+'px';
                parent.style.marginTop = Math.round(-_scrH / 2)+'px';
            }
        }
    });

    this.AutoScale = function() {
        return autoScale;
    };
    this.Scale = function() {
        return _scale;
    };
    this.NativeWidth = function() {
        return _nativeW;
    };
    this.NativeHeight = function() {
        return _nativeH;
    };
};