function __scene1(director) {
    var STATE = {
        PREPARING: 0,
        ACTIVE: 1
    };

    var curState = STATE.PREPARING;
    var ship1, ship2, gui, scene, questionSystem, display, bullets;
    var utils = new Utils(director);

    var Gun = function(proto, position) {
        var status = CONST.GUN_STATUS.IDLE;
        var img = utils.GetImage(proto.imageId);
        if (!img)
        {
            img = utils.AddImage(proto.imageId, 1, 1);
        }
        this.Actor = new CAAT.Foundation.Actor().
                        setBackgroundImage(img).
                        setPosition(position.x, position.y).
                        enableEvents(false);
        var _proto = proto;
        this.SetStatus = function(newStatus) {
            status = newStatus;
        };
        this.Status = function() {
            return status;
        };
        this.OperationType = function() {
            return _proto.operationType;
        };
        this.Difficulty = function() {
            return _proto.difficulty;
        };
        this.NeedAim = function() {
            return _proto.needAim;
        };
        this.Damage = function() {
            return {'min': proto.damageMin, 'max': proto.damageMax};
        };
        this.BulletProto = function() {
            return proto.bulletProto;
        };
        this.RotationAnchor = function() {
            return _proto.rotationAnchor;
        };
    };

    var Spaceship = function(proto, guns, targetPosition, name) {
        var _state = CONST.SHIP_STATUS.IDLE;
        var _guns = [];
        var _shipImage = utils.GetImage(proto.imageId);
        var _healthCur = proto.hp;
        var _healthMax = proto.hp;
        var _name = name;
        var _platformToFireIndex = 0;
        var _targetPos = targetPosition;
        var _targetAimAngle = 0;
        var _gunRotateSpeed = 0.25 * Math.PI / CONST.FPS;
        var _targetShip;
        var _container;
        var _fireQueue = new function() {
            var queue = [];
            this.Add = function(targetShip, targetAimAngle, rotationSpeed, gun) {
                var id = queue.length;
                queue[id] = {
                    'targetShip': targetShip,
                    'targetAngle': targetAimAngle,
                    'rotateSpeed': rotationSpeed,
                    'gun': gun
                };
                return id;
            };
            this.Clear = function() {
                queue.splice(0, queue.length - 1);
            };
            this.Move = function(steps) {
                var data, actor;
                var len = queue.length;
                var movedGuns = [];
                for (var i = 0; i < len; i++)
                {
                    if (movedGuns[i])
                    {
                        continue;
                    }
                    data = queue[i];
                    actor = data.Actor;
                    switch (data.gun.Status())
                    {
                        case CONST.GUN_STATUS.AIMING: {
                            var newAngle = actor.rotationAngle + data.rotateSpeed;
                            data.gun.Actor.setRotation( newAngle );
                            if (Math.abs(newAngle - data.targetAngle) <= CONST.EPSYLON_ANGLE)
                            {
                                data.gun.SetStatus(CONST.GUN_STATUS.AIMED);
                            }
                            break;
                        }
                        case CONST.GUN_STATUS.AIMED: {
                            var angle = data.targetAngle+ _container.rotationAngle;
                            //select global rotation and set bullet coords just before gun, not in it
                            var dmg = data.gun.Damage();
                            var damage = utils.getRandomInt(dmg['min'], dmg['max']);
                            var aabb = data.gun.Actor.AABB;
                            var x = aabb.x + aabb.width / 2 + Math.cos(angle) * aabb.width;
                            var y = aabb.y + aabb.height / 2 + Math.sin(angle) * aabb.height;
                            bullets.PushBullet(
                                data.gun.BulletProto(),
                                {
                                    'x': x,
                                    'y': y
                                },
                                _targetShip,
                                damage
                            );
                            _targetShip = null;
                            _state = CONST.SHIP_STATUS.AIMINGBACK;
                            _gunRotateSpeed = -_gunRotateSpeed;
                            _targetAimAngle = 0;
                            break;
                            break;
                        }
                    }
                    movedGuns[i] = true;
                }
            };
            this.GetById = function(id) {
                return queue[id];
            };
        };

        //if not initialized
        if (!_shipImage)
        {
            _shipImage = utils.AddImage(proto.imageId, 1, 1);
        }
        //chosing initial coords based on targetPosition
        var initialCoords = {x: 0, y: 0};
        //right part
        var scrW = Screen.NativeWidth();
        var scrH = Screen.NativeHeight();
        var temp = scrW;
        var _angle = 0;
        if (targetPosition.x > temp)
        {
            initialCoords.x = utils.getRandomInt(temp, temp * 2);
            //selecting y according to chosen x
            if (initialCoords < scrW / 2)
            {
                initialCoords.y = utils.getRandomInt(-scrH / 2, -_shipImage.height);
            }
            else
            {
                initialCoords.y = utils.getRandomInt(-scrH / 2, scrH / 2 -_shipImage.height);
            }
        }
        else
        {
            initialCoords.x = utils.getRandomInt(-temp, temp);
            //selecting y according to chosen x
            if (initialCoords.x < 0)
            {
                initialCoords.y = utils.getRandomInt(scrH / 2, scrH + _shipImage.height);
            }
            else
            {
                initialCoords.y = utils.getRandomInt(scrH, 1.5 * scrH);
            }
        }
        //calculating speed according to target and initial positions.
        //flying time should be equals for any ship and do not depend on flying distance
        temp = Math.sqrt((targetPosition.x - initialCoords.x) * (targetPosition.x - initialCoords.x) + (targetPosition.y - initialCoords.y) * (targetPosition.y - initialCoords.y));
        var _speed = temp / (3 * CONST.FPS);
        _angle = Math.atan2(targetPosition.y - initialCoords.y, targetPosition.x - initialCoords.x);
        this.Container = new CAAT.Foundation.ActorContainer().
                            setSize(_shipImage.width, _shipImage.height).
                            centerAt(initialCoords.x, initialCoords.y).
                            setRotation(_angle);
        _container = this.Container;
        var shipActor = new CAAT.Foundation.Actor().
                            setBackgroundImage(_shipImage).
                            enableEvents(false);
        this.Container.addChild(shipActor);
        //initialize guns
        var len = guns.length;
        for (var i = 0; i < len; i++)
        {
            if (proto.gunPlatforms[i])
            {
                _guns[i] = new Gun(guns[i], {'x': proto.gunPlatforms[i].x, 'y': proto.gunPlatforms[i].y});
                /*var gun = guns[i];
                var img = utils.GetImage(gun.imageId);
                if (!img)
                {
                    img = utils.AddImage(gun.imageId, 1, 1);
                }
                _guns[i] = {
                    actor: new CAAT.Foundation.Actor().
                                setBackgroundImage( img ).
                                setPosition(proto.gunPlatforms[i].x, proto.gunPlatforms[i].y).
                                enableEvents(false),
                    operationType: gun.operationType,
                    difficulty: gun.difficulty,
                    bulletProto: gun.bulletProto,
                    damageMin: gun.damageMin,
                    damageMax: gun.damageMax
                };*/
                this.Container.addChild(_guns[i].Actor);
            }
        }

        this.Health = function() {
            return {'cur': _healthCur, 'max': _healthMax, 'percent': utils.CalcPercent(_healthCur, _healthMax)};
        };
        this.ChangeHealth = function(value) {
            _healthCur += value;
            if (_healthCur > _healthMax)
            {
                _healthCur = _healthMax;
            }
            else if (_healthCur < 0)
            {
                console.log('ship ' + _name + ' dies');
                _healthCur = _healthMax;
                bullets.RemoveAllBullets();
            }
        };
        this.Fire = function(targetShip) {
            var angle = this.Container.rotationAngle;// + gun.actor.rotationAngle;
            var containerAABB = this.Container.AABB;
            var targetContainerAABB = targetShip.Container.AABB;
            var x = ( targetContainerAABB.x + targetContainerAABB.x1 - containerAABB.x - containerAABB.x1 ) / 2;
            var y = ( targetContainerAABB.y + targetContainerAABB.y1 - containerAABB.y - containerAABB.y1 ) / 2;
            _targetAimAngle = Math.atan2(y, x) - angle;
            _state = CONST.SHIP_STATUS.AIMING;
            _targetShip = targetShip;
            //TODO: choose shortest way to rotate gun
            if (_targetAimAngle > angle)
            {
                if (_gunRotateSpeed < 0)
                {
                    _gunRotateSpeed = -_gunRotateSpeed;
                }
            }
            else
            {
                if (_gunRotateSpeed > 0)
                {
                    _gunRotateSpeed = -_gunRotateSpeed;
                }
            }
        };
        //randomly select platform to fire
        this.ActivatePlatform = function() {
            _platformToFireIndex = utils.getRandomInt(0, _guns.length - 1);
            var p = _guns[_platformToFireIndex];
            return { 'operation': p.OperationType(), 'difficulty': p.Difficulty() };
        };
        this.Move = function(steps) {
            switch (_state)
            {
                case CONST.SHIP_STATUS.AIMINGBACK:
                {
                    var newAngle = _guns[_platformToFireIndex].Actor.rotationAngle + _gunRotateSpeed;
                    if (Math.abs(newAngle - _targetAimAngle) <= CONST.EPSYLON_ANGLE)
                    {
                        _state = CONST.SHIP_STATUS.IDLE;
                    }
                    else
                    {
                        //TODO: bring back centered rotation when imgs are ready
                        var anchor = _guns[_platformToFireIndex].RotationAnchor();
                        if (anchor)
                        {
                            _guns[_platformToFireIndex].Actor.setRotationAnchored( newAngle, anchor.x, anchor.y );
                        }
                        else
                        {
                            _guns[_platformToFireIndex].Actor.setRotation(newAngle);
                        }
                    }
                    break;
                }
                case CONST.SHIP_STATUS.AIMING:
                {
                    var newAngle = _guns[_platformToFireIndex].Actor.rotationAngle + _gunRotateSpeed;
                    if (Math.abs(newAngle - _targetAimAngle) <= CONST.EPSYLON_ANGLE)
                    {
                        _state = CONST.SHIP_STATUS.AIMED;
                    }
                    else
                    {
                        var anchor = _guns[_platformToFireIndex].RotationAnchor();
                        if (anchor)
                        {
                            _guns[_platformToFireIndex].Actor.setRotationAnchored( newAngle, anchor.x, anchor.y );
                        }
                        else
                        {
                            _guns[_platformToFireIndex].Actor.setRotation(newAngle);
                        }
                    }
                    break;
                }
                case CONST.SHIP_STATUS.AIMED:
                {
                    var angle = _targetAimAngle + this.Container.rotationAngle;
                    //select global rotation and set bullet coords just before gun, not in it
                    var gun = _guns[_platformToFireIndex];
                    var dmg = gun.Damage();
                    var damage = utils.getRandomInt(dmg['min'], dmg['max']);
                    var aabb = gun.Actor.AABB;
                    var x = aabb.x + aabb.width / 2 + Math.cos(angle) * aabb.width;
                    var y = aabb.y + aabb.height / 2 + Math.sin(angle) * aabb.height;
                    bullets.PushBullet(
                        gun.BulletProto(),
                        {
                            'x': x,
                            'y': y
                        },
                        _targetShip,
                        damage
                    );
                    _targetShip = null;
                    _state = CONST.SHIP_STATUS.AIMINGBACK;
                    _gunRotateSpeed = -_gunRotateSpeed;
                    _targetAimAngle = 0;
                    break;
                }
                case CONST.SHIP_STATUS.IDLE:
                default:
                {
                    return;
                }
            }
        };
        this.Fly = function() {
            var container = this.Container;
            container.setPosition(
                container.x + Math.cos(_angle) * _speed,
                container.y + Math.sin(_angle) * _speed
            );
        };
        this.AtPosition = function() {
            var a = this.Container.AABB;
            return  a.x + a.width / 3 <= _targetPos.x
                    && a.x1 - a.width / 3 >= _targetPos.x
                    && a.y + a.height / 3 <= _targetPos.y
                    && a.y1 - a.height / 3 >= _targetPos.y;
        };
    };
    var UI = function(w, h, font) {
        var _initialW = w;
        var _initialH = h;
        //enemy ship
        var dx = 4;
        var dy = 4;
        this.EnemyHealthbar = new CAAT.Foundation.Actor().
            setBounds(dx, dy, w, h).
            setFillStyle('#005D1D').
            enableEvents(false);
        /*this.EnemyText = new CAAT.Foundation.UI.TextActor().
            setFont(font).
            setLocation(dx + w, dy + h).
            setText('');*/
        this.EnemyText = new CAAT.Foundation.UI.TextActor().
            setFont(font).
            setLocation(dx, dy / 2)./*
            setText('100').*/
            setAlign("right");

        //my ship
        this.MyHealthbar = new CAAT.Foundation.Actor().
            setBounds(4, Screen.NativeHeight() - h - 4, w, h).
            setFillStyle('#005D1D').
            enableEvents(false);
        this.MyText = new CAAT.Foundation.UI.TextActor().
            setFont(font).
            setLocation(dx, Screen.NativeHeight() - font.height).
            setAlign('right');

        this.UpdateData = function(myHealthData, enemyHealthData) {
            var w = enemyHealthData.cur / enemyHealthData.max * _initialW;
            var temp = this.EnemyHealthbar;
            temp.setSize(w, _initialH);
            temp = this.EnemyText;
            temp.setText(enemyHealthData.cur.toString());
            var x = (temp.width > w) ? temp.width : w;
            temp.setLocation(x, temp.y);

            temp = this.MyHealthbar;
            w = myHealthData.cur / myHealthData.max * _initialW;
            temp.setSize(w, _initialH);
            temp = this.MyText;
            temp.setText(myHealthData.cur.toString());
            x = (temp.width > w) ? temp.width : w;
            temp.setLocation(x, temp.y);
        };
    };
    var textButtonClick = function(event) {
        var key = event.source.DATA.value;
        questionSystem.AddKey( key );
    };
    var applyResponseClick = function(event) {
        var isCorrect = questionSystem.CheckAnswer();
        var shipToFire = questionSystem.EnemyShip();
        var victimShip = questionSystem.PlayerShip();
        if (isCorrect)
        {
            shipToFire = questionSystem.PlayerShip();
            victimShip = questionSystem.EnemyShip();
        }
        else
        {
            console.log('incorrect answer. question: ' + questionSystem.Question() + '; got answer: ' + questionSystem.Input());
        }
        shipToFire.Fire(victimShip);
        //victimShip.ChangeHealth(-damage);
        var platformData = shipToFire.ActivatePlatform();
        questionSystem.UpdateQuestion( platformData.operation, platformData.difficulty );
    };
    var removeClick = function(event) {
        questionSystem.Backspace();
    };
    var numpadInit = function(director, scene) {
        var dx = director.width / 2;
        var dy = 140;
        var btn = null;
        var btnWidth = 155;
        var btnHeight = 155;
        var marginLeft = 4;
        var marginBottom = 4;
        //1 to 8
        var val = 1;
        var x = 0;
        var y = 0;
        for (var i = 0; i < 2; i++)
        {
            for (var j = 0; j < 4; j++)
            {
                x = dx + (btnWidth + marginLeft) * j;
                y = dy + (btnHeight + marginBottom) * i;
                btn = createTextButton(director, x, y, btnWidth, btnHeight, val++, 56);
                btn.mouseClick = textButtonClick;
                scene.addChild(btn);
            }
        }
        i = 2;
        j = 0;
        //9
        x = dx + (btnWidth + marginLeft) * j++;
        y = dy + (btnHeight + marginBottom) * i;
        btn = createTextButton(director, x, y, btnWidth, btnHeight, 9, 56);
        btn.mouseClick = textButtonClick;
        scene.addChild(btn);
        //0
        x = dx + (btnWidth + marginLeft) * j++;
        y = dy + (btnHeight + marginBottom) * i;
        btn = createTextButton(director, x, y, btnWidth, btnHeight, 0, 56);
        btn.mouseClick = textButtonClick;
        scene.addChild(btn);
        //.
        x = dx + (btnWidth + marginLeft) * j++;
        y = dy + (btnHeight + marginBottom) * i;
        btn = createTextButton(director,  x, y, btnWidth, btnHeight, '-', 56);
        btn.mouseClick = textButtonClick;
        scene.addChild(btn);
        //.
        x = dx + (btnWidth + marginLeft) * j++;
        y = dy + (btnHeight + marginBottom) * i;
        btn = createTextButton(director, x, y, btnWidth, btnHeight, '.', 56);
        btn.mouseClick = textButtonClick;
        scene.addChild(btn);
        //response
        x = dx;
        y = dy + (btnHeight + marginBottom) * (++i);
        btn = createTextButton(director, x, y, director.width / 4 - 6, 145, 'Remove', 56);
        btn.mouseClick = removeClick;
        scene.addChild(btn);
        //backspace
        x = dx + director.width / 4 - 2;
        y = dy + (btnHeight + marginBottom) * i;
        btn = createTextButton(director, x, y, director.width / 4 - 6, 145, 'Response', 56);
        btn.mouseClick = applyResponseClick;
        scene.addChild(btn);
    };
    var createTextButton = function(director, posx, posy, w, h, text, fontsize) {
        var actor= new CAAT.Foundation.Actor().
            setSize( w, h ).
            setPosition( posx, posy);
        actor.paint= function( director, time ) {
            var ctx= director.ctx;
            ctx.fillStyle = this.pointed ? 'orange' : '#f3f';
            ctx.fillRect(0,0,this.width,this.height );

            ctx.strokeStyle = this.pointed ? 'red' : 'black';
            ctx.strokeRect(0,0,this.width,this.height );

            ctx.strokeStyle = 'white';
            ctx.font = fontsize + 'px Segoe WP, Trebuchet MS, Sans-Serif';
            ctx.fillStyle = 'black';
            var textw = ctx.measureText(text).width;
            ctx.fillText(
                text,
                (w - textw) / 2,
                (h + fontsize) / 2
            );
        };
        actor.DATA = {value: text};
        return actor;
    };
    var createDisplay = function(director, x, y, w, h, fontsize, questionref) {
        var actor = new CAAT.Foundation.Actor().
            setSize(w, h).
            setPosition(x, y).
            enableEvents(false);
        actor.QUESTION = questionref;
        actor.FONTSIZE = fontsize;
        actor.paint = function(director, time) {
            var ctx= director.ctx;
            ctx.fillStyle = '#004EFF';
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(0, 0, this.width, this.height );
            ctx.strokeStyle = 'white';
            ctx.font = this.FONTSIZE + 'px Segoe WP, Trebuchet MS, Sans-Serif';
            ctx.fillStyle = 'black';
            var text = this.QUESTION.Question() + ' = ' + this.QUESTION.Input();
            var textw = ctx.measureText(text).width;
            ctx.fillText(
                text,
                (w - textw) / 2,
                (h + 56) / 2
            );
        };
        return actor;
    };
    var QuestionSystem = function(playerShip, enemyShip) {
        var _operator = CONST.OPERATIONS.PLUS;
        var _val1 = 0;
        var _val2 = 0;
        var _answer = 0;
        var _inputAsString = '';
        var _input = [];
        var _playerShip = playerShip;
        var _enemyShip = enemyShip;

        var arrToString = function(arr) {
            var len = arr.length;
            var ret = '';
            for (var i = 0; i < len; i++)
            {
                ret += arr[i];
            }
            return ret;
        };
        var clearInput = function() {
            while (_input.length > 0)
            {
                _input.pop();
            }
            _inputAsString = '';
        };

        this.PlayerShip = function() {
            return _playerShip;
        };
        this.EnemyShip = function() {
            return _enemyShip;
        };
        this.Val1 = function() {
            return _val1;
        };
        this.Val2 = function() {
            return _val2;
        };
        this.Operator = function() {
            return _operator;
        };
        this.Input = function() {
            return _inputAsString;
        };
        this.Question = function() {
            var temp = _val2;
            var oper = _operator;
            switch (_operator)
            {
                case CONST.OPERATIONS.PLUS: {oper = '+'; break;}
                case CONST.OPERATIONS.MINUS: {oper = '-'; break;}
                case CONST.OPERATIONS.MULTIPLY: {oper = '*'; break;}
                case CONST.OPERATIONS.DIVIDE: {oper = '/'; break;}
            }

            if (_operator == CONST.OPERATIONS.MINUS && _val2 < 0)
            {
                temp = Math.abs(_val2);
                oper = '+';
            }
            else if (_operator == CONST.OPERATIONS.PLUS && _val2 < 0)
            {
                temp = Math.abs(_val2);
                oper = '-';
            }
            return _val1 + ' ' + oper + ' ' + temp;
        };
        //operationType from CONST.OPERATION
        this.UpdateQuestion = function(operationType, difficulty) {
            clearInput();
            _operator = operationType;
            switch (_operator)
            {
                case CONST.OPERATIONS.PLUS:
                {
                    _val1 = utils.getRandomInt(-49, 49);
                    _val2 = utils.getRandomInt(-49, 49);
                    _answer = _val1 + _val2;
                    break;
                }
                case CONST.OPERATIONS.MINUS:
                {
                    _val1 = utils.getRandomInt(-49, 49);
                    _val2 = utils.getRandomInt(-49, 49);
                    _answer = _val1 - _val2;
                    break;
                }
                case CONST.OPERATIONS.MULTIPLY:
                {
                    _val1 = utils.getRandomInt(-9, 9);
                    _val2 = utils.getRandomInt(-9, 9);
                    _answer = _val1 * _val2;
                    break;
                }
                case CONST.OPERATIONS.DIVIDE:
                {
                    _val1 = 5;
                    _val2 = 1;
                    _answer = parseInt(_val1 / _val2);
                    break;
                }
            }
        };
        this.CheckAnswer = function()
        {
            if (_answer == parseInt(_inputAsString))
            {
                return true;
            }
            return false;
        };
        this.Backspace = function() {
            if (_input.length == 0)
                return;
            _input.pop();
            _inputAsString = arrToString(_input);
        };
        this.AddKey = function(val) {
            var len = _input.length;
            if (len < 6)
            {
                if (val == '-')
                {
                    if (len == 0)
                    {
                        _input[0] = '-';
                    }
                }
                else if (val == '.')
                {
                    if (len > 0 && _inputAsString.indexOf('.') == -1)
                        _input[len] = val;
                }
                else
                {
                    _input[len] = val;
                }
                _inputAsString = arrToString(_input);
            }
        };
    };
    var onRenderStart = function(director_time) {
        switch (curState)
        {
            case STATE.PREPARING: {
                var ship1Ready = ship1.AtPosition();
                if (!ship1Ready)
                {
                    ship1.Fly();
                }
                var ship2Ready = ship2.AtPosition();
                if (!ship2Ready)
                {
                    ship2.Fly();
                }
                if (ship1Ready && ship2Ready)
                {
                    gui = new UI(director.width / 2 - 8, 40, font);
                    gui.UpdateData(ship1.Health(), ship2.Health());
                    scene.addChild(gui.MyHealthbar);
                    scene.addChild(gui.MyText);
                    scene.addChild(gui.EnemyHealthbar);
                    scene.addChild(gui.EnemyText);

                    bullets = new Bullets();
                    questionSystem = new QuestionSystem(ship1, ship2);
                    numpadInit(director, scene);
                    display = createDisplay(director, director.width / 2, 4, director.width / 2 - 8, 130, 68, questionSystem);
                    scene.addChild(display);

                    var platformData = ship1.ActivatePlatform();
                    questionSystem.UpdateQuestion(platformData.operation, platformData.difficulty);
                    curState = STATE.ACTIVE;
                }
                break;
            }
            case STATE.ACTIVE: {
                var bullet;
                var list = bullets.List();
                //here we should move every bullet and check its collisions with other ships
                for (var i = 0; i < list.length; i++)
                {
                    bullet = list[i];
                    if (bullet.AtTarget())
                    {
                        bullet.DoDamage();
                        bullets.removeBullet(bullet, true);
                        i--;
                        gui.UpdateData(ship1.Health(), ship2.Health());
                    }
                    else if (!bullet.OnScreen())
                    {
                        bullets.removeBullet(bullet);
                        i--;
                    }
                    else
                    {
                        bullet.Move(1 / CONST.FPS);
                    }
                }
                ship1.Move(1);
                ship2.Move(1);
                break;
            }
        }
    };
    var Bullet = function(bulletProto, sourceXY, targetShip, damage, speed) {
        var img = utils.GetImage(bulletProto.projectileImageId);
        var blastImg = utils.GetImage(bulletProto.blastImageId);
        //TODO: set animations @utils.AddImage, not here
        if (!img)
        {
            img = utils.AddImage(bulletProto.projectileImageId, bulletProto.rows, bulletProto.cols, bulletProto.animation);
        }
        if (!blastImg)
        {
            blastImg = utils.AddImage(bulletProto.blastImageId, 1, 1);
        }

        var aabb = targetShip.Container.AABB;
        //get rectangle to fire and choose random location there
        var dest = {
            x: aabb.x + aabb.width / 4,
            y: aabb.y + aabb.height / 4,
            x1: aabb.x1 - aabb.width / 4,
            y1: aabb.y1 - aabb.height / 4
        };
        var _angle = Math.atan2(
            utils.getRandomInt(dest.y + img.singleHeight, dest.y1 - img.singleHeight) - sourceXY.y,
            utils.getRandomInt(dest.x + img.singleWidth, dest.x1 - img.singleWidth) - sourceXY.x
        );
        var _targetShip = targetShip;
        var _dmg = damage;
        var _speed = speed;
        var _blastImg = blastImg;

        this.actor = new CAAT.Foundation.Actor().
            setBackgroundImage(img).
            centerOn(sourceXY.x, sourceXY.y).
            enableEvents(false).
            setRotation(_angle).
            playAnimation('fly');

        this.Explode = function() {
            //TODO: change img position according to difference between sizes
            this.actor.setBackgroundImage(_blastImg).centerOn(this.actor.x, this.actor.y).setDiscardable(true).setFrameTime(scene.time, 500);
        };
        this.DoDamage = function() {
            _targetShip.ChangeHealth(-_dmg);
            this.Explode();
        };
        this.Kill = function() {
            scene.removeChild(this.actor);
        };
        this.AtTarget = function() {
            var a = this.actor.AABB;
            var b = dest;
            return Math.abs((a.x1 + a.x - b.x1 - b.x) / 2) <= CONST.EPSYLON_PX
                && Math.abs((a.y1 + a.y - b.y1 - b.y) / 2) <= CONST.EPSYLON_PX;

        };
        this.OnScreen = function() {
            var actor = this.actor;
            return actor.x >= 0 && actor.y >= 0 && actor.x + actor.height <= Screen.NativeWidth() * 0.5 && actor.height + actor.y <= Screen.NativeHeight();
        };
        this.Move = function(moves) {
            var nx = this.actor.x + Math.cos(_angle) * _speed * moves;
            var ny = this.actor.y + Math.sin(_angle) * _speed * moves;
            this.actor.setPosition(nx, ny);
        };
    };
    var Bullets = function() {
        var list = [];
        this.List = function() {
            return list;
        };
        this.PushBullet = function(bulletProto, sourceXY, targetShip, dmg) {
            var spd = utils.getRandomInt(bulletProto.speedMin, bulletProto.speedMax);
            var newBlt = new Bullet(bulletProto, sourceXY, targetShip, dmg, spd);
            list[list.length] = newBlt;
            scene.addChild(newBlt.actor);
            return newBlt;
        };
        this.removeBullet = function(bullet, doNotKill) {
            var len = list.length;
            var i = 0;
            while (i < len)
            {
                if (list[i] != bullet)
                {
                    i++;
                }
                else
                {
                    var blt = list[i];
                    list.splice(i, 1);
                    if (!doNotKill)
                    {
                        blt.Kill();
                    }
                    return true;
                }
            }
            return false;
        };
        this.RemoveAllBullets = function() {
            var len = list.length;
            for (var i = 0; i < len; i++)
            {
                list[i].Explode();
            }
            list.splice(0, len);
        };
    };
    //************************************* INITIALIZATION HERE ****************************************************//
    // an image of 7 rows by 3 columns
    /*var ci= new CAAT.Foundation.SpriteImage().initialize(
        director.getImage('botones'), 7, 3 );*/
    scene = director.createScene().setFillStyle("#000");
    var bgImage = utils.AddImage('bg_space1', 1, 1);
    //background
    var bgActor = new CAAT.Foundation.Actor().
        setBackgroundImage( bgImage ).
        setPosition(0, 0).
        enableEvents(false);
    scene.addChild(bgActor);

    var font = new CAAT.Module.Font.Font().
        setFont('"Righteous"').
        setFontSize(38, "px").
        setFillStyle( '#ccc' ).
        setStrokeStyle('#bbb').
        setStrokeSize(.5).
        createDefault(2);

    ship1 = new Spaceship(ShipProto2, [GunProto3/*, GunProto1*/], {x: 160, y: 500}, 'player');
    scene.addChild(ship1.Container);

    ship2 = new Spaceship(ShipProto1, [GunProto2/*, GunProto1*/], {x: 400, y: 150}, 'enemy');
    scene.addChild(ship2.Container);

    scene.onRenderStart = onRenderStart;
}