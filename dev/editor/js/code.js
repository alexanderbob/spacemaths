/*
    TODO: make developer console to show any output from using it. currently it is done through console.log

    11.12.13:
    we have a little problem if texture center will be not @(0.5, 0.5), so looks like we should use actor.setPositionAnchor(x, y)
    to fix that problem.
    also, need to add more support to animations (currently only FLY for bullets)

    need to separate different entities from viewer.js (Gun, Bullet, Ship) to different files and include them in real
    SpaceMaths project
*/

var CONST_DEV = {
    SIDEXISTS_CORRECT: 1,
    SIDEXISTS_NOTFOUND: 2,
    SIDEXISTS_INCORRECTTYPE: 3,

    IMAGES_PATH: '../../files/img',

    CANVAS_SIZES: {
        width: 640,
        height: 768
    }
};

var TCONST_DEV = {
    SID_MUST_BE_FILLED: "SID не может быть пустым",
    SID_ALREADY_EXISTS: "Указанный SID уже существует",
    UPDATE_ON_EXIST: "Действие полностью удалит текущие данные (все предыдущие версии сохраняются в history). Продолжить?",
    MAXHEALTH_MUST_BE_POSITIVE: "Max Health должно быть больше нуля",
    NOTFOUND: "Указанный %s не найден",
    TYPE_MISMATCH: "Указанный идентификатор в %s должен быть типа %s"
};

var Main = function () {
    var protoSelect = document.getElementById('prototype'),
        _curProtoForm = 0,
        protoForms = [],

        protoMaskInput = document.getElementById('searchSIDInput'),
        protoSearchTextNode = document.getElementById('searchStatusText'),
        protoListTable = document.getElementById('searchSIDResultTable'),
        imagesFormDiv = document.getElementById('imagesFormDiv'),
        backgroundDiv = document.getElementById('backgroundDiv'),
        gameData = new GameData(true),
        viewer = new Viewer(gameData),
        explorer = new Explorer(viewer, document.getElementById('canvasExplorer'), gameData);

    protoForms[CONST.PROTO.SHIP] = document.getElementById('protoShipForm');
    protoForms[CONST.PROTO.GUN] = document.getElementById('protoGunForm');
    protoForms[CONST.PROTO.BULLET] = document.getElementById('protoBulletForm');
    protoForms[CONST.PROTO.IMAGE] = document.getElementById('protoImageForm');

    protoSelect.onchange = function(event) {
        changeProtoForm(this.value);
    };

    //adding more events here
    setTimeout(function() {
        document.getElementById('addNewShipPlatformButton').onclick = function(event) { addNewPlatformBtnClick(event); };
        document.getElementById('addNewAnimationButton').onclick = function(event) { addNewAnimationBtnClick(event); };
        document.getElementById('saveProtoShipFormButton').onclick = function(event) { sendSaveRequest(event); };
        document.getElementById('saveProtoGunFormButton').onclick = function(event) { sendSaveRequest(event); };
        document.getElementById('saveProtoBulletFormButton').onclick = function(event) { sendSaveRequest(event); };
        document.getElementById('saveProtoImageFormButton').onclick = function (event) { sendSaveRequest(event); };
        document.getElementById('showImagesFormDiv').onclick = function (event) { showImagesForm(event); };
        document.getElementById('viewProtoImageButton').onclick = function (event) { viewer.InspectProtoImage(this.form.imagePath.value); };
        document.getElementById('addShipToExplorerButton').onclick = function (event) { addShipToExplorer(gatherInputsFromForm(this.form)); };
        initializeImageFilesAutocomplete(initializeImagesForm);
    }, 0);

    var addShipToExplorer = function (data) {
        explorer.AddNewShip(data);
    };

    var initializeImagesForm = function (files) {
        files.sort(function (a, b) {
            if (a > b)
                return 1;
            else if (a < b)
                return -1;
            return 0;
        });
        function imagesFormImgClick(event) {
            var fileName = event.data.fileName;
            protoForms[CONST.PROTO.IMAGE].imagePath.value = fileName;
            hideImagesForm();
        };
        function appendImageToImagesForm(root, fileName) {
            var img = new Image();
            img.src = CONST_DEV.IMAGES_PATH + '/' + fileName;
            img.onload = function () {
                var node = document.createElement('div');
                node.className = 'img';
                node.style.backgroundImage = 'url(' + CONST_DEV.IMAGES_PATH + '/' + fileName + ')';
                root.appendChild(node);
                root.appendChild(createNode('div', { style: 'text-align: center' }, fileName + '<br>' + img.width + ' × ' + img.height));
            }
        }
        var h = document.documentElement.clientHeight * 0.8;
        var w = document.documentElement.clientWidth * 0.8;
        imagesFormDiv.style.height = h + 'px';
        imagesFormDiv.style.width = w + 'px';
        imagesFormDiv.style.left = (document.documentElement.clientWidth - w) / 2 + 'px';
        imagesFormDiv.style.top = (document.documentElement.clientHeight - h) / 2 + 'px';
        var child, img, title;
        for (var i in files)
        {
            child = createNode('div');
            child.className = 'wrapper';
            appendImageToImagesForm(child, files[i]);
            imagesFormDiv.appendChild(child);
            $(child).on('click', { fileName: files[i] }, imagesFormImgClick);
        }
    };

    var hideImagesForm = function() {
        backgroundDiv.style.display = 'none';
        imagesFormDiv.style.display = 'none';
        $(document).remove('click', openImagesFormDocumentClick);
    };

    var openImagesFormDocumentClick = function (event) {
        if (event.currentTarget.activeElement == backgroundDiv)
        {
            hideImagesForm();
        }
    }

    var showImagesForm = function (event) {
        backgroundDiv.style.display = 'block';
        imagesFormDiv.style.display = 'block';
        $(document).on('click', openImagesFormDocumentClick);
    };

    this.RefreshSIDList = function() {
        sendDownloadRequest();
    };

    var initializeImageProtoAutocomplete = function (data) {
        $("input[name=imageproto], input[name=blastproto]").autocomplete({ source: data });
    };

    var initializeImageFilesAutocomplete = function (callback) {
        $.ajax({
            url: 'ajax/process.php?command=getfiles&callback=?',
            dataType: 'jsonp',
            cache: false
        }).done(function (resp) {
            $( protoForms[CONST.PROTO.IMAGE].imagePath ).autocomplete({ source: resp.data });
            callback(resp.data);
        }).fail(function (info) {
            console.log(JSON.stringify(info));
        });
    };

    var sendSaveRequest = function(event) {
        var btn = event.currentTarget;
        var params = gatherInputsFromForm(event.currentTarget.form);
        var validity = validateFormInputs(params);
        var canContinue = true;
        if (validity.code == 0)
        {
            alert(validity.message);
            return;
        }
        btn.disabled = true;
        setSearchText('Saving...');
        $.ajax({
            url: 'ajax/process.php?command=update&callback=?',
            dataType: 'jsonp',
            data: params,
            cache: false
        }).done(function(resp) {
            btn.disabled = false;
            if (resp.code == 1)
            {
                setSearchText('');
                //update list
                sendDownloadRequest();
            }
            else
            {
                setSearchText(resp.message);
                alert(resp.debug);
                console.log(resp.debug);
            }
        }).fail(function (info) {
            console.log(JSON.stringify(info));
            btn.disabled = false;
            setSearchText('Error occured!');
        });
    };

    var validateFormInputs = function (params) {
        var result = {code: 0, message: ''};
        if (params.SID.length == 0)
        {
            result.message = TCONST_DEV.SID_MUST_BE_FILLED;
            return result;
        }
        else if (gameData.content[params.SID] == CONST_DEV.SIDEXISTS_CORRECT && params.SID != params.prevSID)
        {
            result.message = TCONST_DEV.SID_ALREADY_EXISTS + ". " + TCONST_DEV.UPDATE_ON_EXIST;
            return result;
        }
        var checkForSID = function (sid, type) {
            if (typeof gameData.Find(sid) == 'undefined')
                return CONST_DEV.SIDEXISTS_NOTFOUND;
            if (gameData.Find(sid).type != type)
                return CONST_DEV.SIDEXISTS_INCORRECTTYPE;
            return CONST_DEV.SIDEXISTS_CORRECT;
        };
        switch (params.type)
        {
            case CONST.PROTO.SHIP:
                if (params.maxHealth <= 0)
                {
                    result.message = TCONST_DEV.MAXHEALTH_MUST_BE_POSITIVE;
                    return result;
                }
                var searchSID = checkForSID(params.imageId, CONST.PROTO.IMAGE);
                if (searchSID == CONST_DEV.SIDEXISTS_NOTFOUND)
                {
                    result.message = TCONST_DEV.NOTFOUND
                                        .replace('%s', 'Image Proto');
                    return result;
                }
                else if (searchSID == CONST_DEV.SIDEXISTS_INCORRECTTYPE)
                {
                    result.message = TCONST_DEV.TYPE_MISMATCH
                                        .replace('%s', 'Image Proto')
                                        .replace('%s', 'Image');
                    return result;
                }
                break;
            case CONST.PROTO.GUN:
                var searchSID = checkForSID(params.imageId, CONST.PROTO.IMAGE);
                if (searchSID == CONST_DEV.SIDEXISTS_NOTFOUND)
                {
                    result.message = TCONST_DEV.NOTFOUND
                                        .replace('%s', 'Image Proto');
                    return result;
                }
                else if (searchSID == CONST_DEV.SIDEXISTS_INCORRECTTYPE)
                {
                    result.message = TCONST_DEV.TYPE_MISMATCH
                                        .replace('%s', 'Image Proto')
                                        .replace('%s', 'Image');
                    return result;
                }
                searchSID = checkForSID(params.bulletProto, CONST.PROTO.BULLET);
                if (searchSID == CONST_DEV.SIDEXISTS_NOTFOUND)
                {
                    result.message = TCONST_DEV.NOTFOUND
                                        .replace('%s', 'Bullet Proto');
                    return result;
                }
                else if (searchSID == CONST_DEV.SIDEXISTS_INCORRECTTYPE)
                {
                    result.message = TCONST_DEV.TYPE_MISMATCH
                                        .replace('%s', 'Bullet Proto')
                                        .replace('%s', 'Bullet');
                    return result;
                }
                break;
            case CONST.PROTO.BULLET:
                var searchSID = checkForSID(params.projectileImageId, CONST.PROTO.IMAGE);
                if (searchSID == CONST_DEV.SIDEXISTS_NOTFOUND)
                {
                    result.message = TCONST_DEV.NOTFOUND
                                        .replace('%s', 'Image Default');
                    return result;
                }
                else if (searchSID == CONST_DEV.SIDEXISTS_INCORRECTTYPE)
                {
                    result.message = TCONST_DEV.TYPE_MISMATCH
                                        .replace('%s', 'Image Default')
                                        .replace('%s', 'Image');
                    return result;
                }
                searchSID = checkForSID(params.blastImageId, CONST.PROTO.IMAGE);
                if (searchSID == CONST_DEV.SIDEXISTS_NOTFOUND)
                {
                    result.message = TCONST.NOTFOUND
                                        .replace('%s', 'Blast Proto');
                    return result;
                }
                else if (searchSID == CONST_DEV.SIDEXISTS_INCORRECTTYPE)
                {
                    result.message = TCONST_DEV.TYPE_MISMATCH
                                        .replace('%s', 'Blast Proto')
                                        .replace('%s', 'Image');
                    return result;
                }
                break;
            //TODO: check for correct IMAGE inputs
        }
        result.code = 1;
        return result;
    };

    var gatherInputsFromForm = function(form) {
        var type = parseInt(form.type.value);
        var params = {
            SID: form.SID.value,
            prevSID: form.prevSID.value,
            "type": type
        };
        switch (type)
        {
            case CONST.PROTO.SHIP:
                params.hp = parseInt(form.maxhealth.value);
                params.imageId = form.imageproto.value;
                params.gunPlatforms = [];
                var platformX = form.elements.platformX;
                var platformY = form.elements.platformY;
                if (platformX)
                {
                    if (platformX.length)
                    {
                        var len = platformX.length;
                        for (var i = 0; i < len; i++)
                        {
                            params.gunPlatforms[i] = {
                                x: parseInt(platformX[i].value),
                                y: parseInt(platformY[i].value)
                            };
                        }
                    }
                    else
                    {
                        params.gunPlatforms[0] = {
                            x: parseInt(platformX.value),
                            y: parseInt(platformY.value)
                        };
                    }
                }
                break;
            case CONST.PROTO.GUN:
                params.imageId = form.imageproto.value;
                params.bulletProto = form.bulletproto.value;
                params.difficulty = parseFloat(form.difficulty.value);
                params.operationType = parseInt(form.operationType.value);
                params.needAim = form.needAim.checked;
                params.damageMin = parseInt(form.damageMin.value);
                params.damageMax = parseInt(form.damageMax.value);
                params.bulletsPerFire = parseInt(form.bulletsPerFire.value);
                params.bulletIntervalPerFire = parseFloat(form.bulletIntervalPerFire.value);
                break;
            case CONST.PROTO.BULLET:
                params.speedMin = parseInt(form.speedMin.value);
                params.speedMax = parseInt(form.speedMax.value);
                params.projectileImageId = form.imageproto.value;
                params.blastImageId = form.blastproto.value;
                break;
            case CONST.PROTO.IMAGE:
                params.path = form.imagePath.value;
                params.rows = parseInt(form.rowsCount.value);
                params.cols = parseInt(form.colsCount.value);
                params.anchor = {
                    x: parseFloat(form.anchorX.value),
                    y: parseFloat(form.anchorY.value)
                };
                params.animations = [];
                var arrSID = form.elements.animationSID;
                if (arrSID)
                {
                    var len = arrSID.length;
                    var arrFrames = form.elements.frames;
                    var arrSpeed = form.elements.speed;
                    var arrCycled = form.elements.cycled;
                    if (len)
                    {
                        for (var i = 0; i < len; i++)
                        {
                            params.animations[i] = {
                                frames: arrFrames[i].value,
                                sid: arrSID[i].value,
                                speed: parseInt(arrSpeed[i].value),
                                cycled: arrCycled[i].checked
                            }
                        }
                    }
                    else
                    {
                        params.animations[0] = {
                            frames: arrFrames.value,
                            sid: arrSID.value,
                            speed: parseInt(arrSpeed.value),
                            cycled: arrCycled.checked
                        }
                    }
                }
                break;
        }
        return params;
    };
    
    var changeProtoForm = function (val) {
        $("#searchSIDResultTable td").removeClass("selected");
        var i = _curProtoForm;
        if (protoForms[i])
        {
            protoForms[i].style.display = 'none';
            for (var j in protoForms[i].elements)
            {
                //do not clear type form input: its system specific
                var input = protoForms[i].elements[j];
                if (j != 'type' && input.type != 'button')
                {
                    if (input.type != 'checkbox')
                        input.value = '';
                    else
                        input.checked = false;
                }
            }
        }
        _curProtoForm = val;
        i = _curProtoForm;
        if (protoForms[i])
        {
            protoForms[i].style.display = 'block';
        }
    };

    var setSearchText = function(str) {
        protoSearchTextNode.textContent = str;
    };

    var removeRowClick = function(event) {
        var element = event.currentTarget;
        //        Button      TD         TR
        var row = element.parentNode.parentNode;
        row.parentNode.removeChild(row);
    };

    var addNewPlatformBtnClick = function(event) {
        //button's parent is TD, TD's parent is TR
        addNewPlatform(event.currentTarget.parentNode.parentNode);
    };
    
    var addNewAnimationBtnClick = function(event) {
        addNewAnimation(event.currentTarget.parentNode.parentNode);
    };

    var addNewPlatform = function(tr, data) {
        var row = createNode('tr');
        var cell = createNode('th');
        var children = tr.parentNode.children;
        var len = children.length;

        var removeBtn = createNode('input', {'type': 'button', 'value': 'Remove'});
        removeBtn.onclick = function(event) { removeRowClick(event); };
        cell.appendChild(removeBtn);
        row.appendChild(cell);

        cell = createNode('td', { style: 'text-align: center' });
        cell.appendChild( document.createTextNode('Center X:') );
        var params = { 'name': 'platformX', 'type': 'number', 'placeholder': '[0, WIDTH]', 'step': '0.001' };
        params.style = 'float: right; width: 100px; height: 20px;';
        if (data)
        {
            params.value = data.x;
        }
        cell.appendChild(createNode('input', params));
        cell.appendChild(createNode('br'));
        cell.appendChild( document.createTextNode('Center Y:') );
        params.name = 'platformY';
        params.placeholder = '[0, HEIGHT]';
        if (data)
        {
            params.value = data.y;
        }
        cell.appendChild(createNode('input', params));
        row.appendChild(cell);
        return tr.parentNode.insertBefore(row, children[len - 1]);
    };

    var addNewAnimation = function(tr, data) {
        var row = createNode('tr');
        var cell = createNode('th');
        var children = tr.parentNode.children;
        var len = children.length;

        var removeBtn = createNode('input', {'type': 'button', 'value': 'Remove'});
        removeBtn.onclick = function(event) { removeRowClick(event); };
        cell.appendChild(removeBtn);
        row.appendChild(cell);
        
        cell = createNode('td');
        
        var params = {'type': 'text', 'placeholder': 'ANIMATION_SID', 'name': 'animationSID'};
        if (data)
        {
            params.value = data.sid;
        }
        cell.appendChild( createNode('input', params));
        cell.appendChild(createNode('br'));
        params = {'type': 'text', 'placeholder': 'frames', 'name': 'frames'};
        if (data)
        {
            params.value = data.frames;
        }
        cell.appendChild( createNode('input', params) );
        cell.appendChild(createNode('br'));
        params = {'type': 'number', 'placeholder': 'speed in msec', 'step': '1', 'name': 'speed'};
        if (data)
        {
            params.value = data.speed;
        }
        cell.appendChild(createNode('input', params));
        cell.appendChild(createNode('br'));
        cell.appendChild( document.createTextNode('Is cycled:' ) );
        params = { 'type': 'checkbox', 'name': 'cycled' };
        if (data)
        {
            params.checked = data.cycled;
        }
        cell.appendChild(createNode('input', params));
        row.appendChild(cell);
        return tr.parentNode.insertBefore(row, children[len - 1]);
    };

    var sendDownloadRequest = function(callback) {
        setSearchText('Loading...');
        gameData.Sync(function (code) {
            if (code==1)
            {
                processDownloadCallback(gameData);
                setSearchText('');
            }
            else
            {
                setSearchText('Error occured. Open console for more info');
                console.log(resp.debug);
            }
        });
    };

    var processDownloadCallback = function(data) {
        initializeImageProtoAutocomplete(gameData.FindAllImages());
        refreshSIDList();
    };

    var cellClick = function (event) {
        var cell = event.currentTarget;
        inspectPrototype(gameData.content[cell.textContent]);
        //clear all currently selected class
        $("#searchSIDResultTable td").removeClass("selected");
        //apply selected classname to currently selected cell
        $(cell).addClass("selected");
    };

    var inspectPrototype = function(data) {
        if (!data)
        {
            return;
        }
        changeProtoForm(data.type);
        updateProtoForm(data);
        protoSelect.value = data.type;
    };

    var updateProtoForm = function(data) {
        if (!data)
        {
            return;
        }

        var form = protoForms[data.type];
        form.SID.value = data.SID;
        form.prevSID.value = data.SID;
        switch (parseInt(data.type))
        {
            case CONST.PROTO.SHIP:
            {
                var tr = document.getElementById('protoShipAddNewRow');
                var next = tr.nextElementSibling;
                var len = 0;
                if (data.gunPlatforms)
                {
                    len = data.gunPlatforms.length;
                }
                var cell;
                for (var i = 0; i < len; i++)
                {
                    //if we have input field
                    if (next.nextElementSibling)
                    {
                        cell = next.children[1];
                        cell.children[0].value = data.gunPlatforms[i].x;
                        //children[1] is <br>
                        cell.children[2].value = data.gunPlatforms[i].y;
                        next = next.nextElementSibling;
                    }
                    else
                    {
                        addNewPlatform(next, data.gunPlatforms[i]);
                    }
                }
                if (next)
                {
                    var temp = next.previousElementSibling;
                    //if we next.nextElementSibling - need to remove them
                    while (temp.nextElementSibling.nextElementSibling)
                    {
                        tr.parentNode.removeChild(temp.nextElementSibling);
                    }
                }

                form.maxhealth.value = data.hp;
                form.imageproto.value = data.imageId;
                break;
            }
            case CONST.PROTO.GUN:
            {
                form.operationType.value = data.operationType;
                form.imageproto.value = data.imageId;
                form.bulletproto.value = data.bulletProto;
                form.difficulty.value = data.difficulty;
                form.needAim.checked = data.needAim;
                form.damageMin.value = data.damageMin;
                form.damageMax.value = data.damageMax;
                form.bulletsPerFire.value = data.bulletsPerFire;
                form.bulletIntervalPerFire.value = data.bulletIntervalPerFire;
                break;
            }
            case CONST.PROTO.BULLET:
            {
                form.speedMin.value = data.speedMin;
                form.speedMax.value = data.speedMax;
                form.imageproto.value = data.projectileImageId;
                form.blastproto.value = data.blastImageId;
                break;
            }
            case CONST.PROTO.IMAGE:
            {
                //TODO: save values according to proto data
                form.imagePath.value = data.path;
                form.rowsCount.value = data.rows;
                form.colsCount.value = data.cols;
                form.anchorX.value = data.anchor.x;
                form.anchorY.value = data.anchor.y;
                //clear animation rows
                var tr = document.getElementById('protoImageAddNewRow');
                var next = tr.nextElementSibling;
                var len = 0;
                if (data.animations)
                {
                    len = data.animations.length;
                }
                var cell;
                for (var i = 0; i < len; i++)
                {
                    //if we have input field
                    if (next.nextElementSibling)
                    {
                        cell = next.children[1];
                        cell.children[0].value = data.animations[i].sid;
                        //children[1] is <br>
                        cell.children[2].value = data.animations[i].frames;
                        cell.children[4].value = data.animations[i].speed;
                        cell.children[6].checked = data.animations[i].cycled;
                        next = next.nextElementSibling;
                    }
                    else
                    {
                        addNewAnimation(next, data.animations[i]);
                    }
                }
                if (next)
                {
                    var temp = next.previousElementSibling;
                    //if we next.nextElementSibling - need to remove them
                    while (temp.nextElementSibling.nextElementSibling)
                    {
                        tr.parentNode.removeChild(temp.nextElementSibling);
                    }
                }
                break;
            }
        }
    };

    //update SID List according to current PROTO values
    var refreshSIDList = function() {
        while (protoListTable.children.length > 0)
        {
            protoListTable.removeChild( protoListTable.children[0] );
        }
        var tr;
        var td;
        var className;
        var appendEntries = function (root, type, array) {
            var tr, td, className;
            switch (type) {
                case CONST.PROTO.BULLET: className = 'bullet'; break;
                case CONST.PROTO.GUN: className = 'gun'; break;
                case CONST.PROTO.IMAGE: className = 'image'; break;
                case CONST.PROTO.SHIP: className = 'ship'; break;
            }
            for (var i in array)
            {
                tr = createNode('tr');
                    td = createNode('td');
                    td.className = className;
                    td.textContent = array[i];
                tr.appendChild(td);
                td.onclick = function (event) {
                    cellClick(event);
                };
                root.appendChild(tr);
            }
        };

        appendEntries(protoListTable, CONST.PROTO.SHIP, gameData.FindKeysByType(CONST.PROTO.SHIP));
        appendEntries(protoListTable, CONST.PROTO.GUN, gameData.FindKeysByType(CONST.PROTO.GUN));
        appendEntries(protoListTable, CONST.PROTO.BULLET, gameData.FindKeysByType(CONST.PROTO.BULLET));
        appendEntries(protoListTable, CONST.PROTO.IMAGE, gameData.FindKeysByType(CONST.PROTO.IMAGE));
    };
};

var createNode = function(name, attributes, innerHTML) {
    var node = document.createElement(name);
    if (attributes)
    {
        for (var key in attributes)
        {
            node.setAttribute(key, attributes[key]);
        }
    }
    if (innerHTML)
    {
        node.innerHTML = innerHTML;
    }
    return node;
};
