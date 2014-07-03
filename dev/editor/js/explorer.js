var Explorer = function (_viewer, _rootElement, _gameData) {
    this.root = _rootElement;
    this.viewer = _viewer;
    this.gameData = _gameData;
    var self = this;
    var onRotationSliderUpdate = function (event, ui) {
        self.viewer.RotateActorTo(this.DATA.actor, ui.value);
        this.parentNode.nextElementSibling.textContent = ui.value.toFixed(2);
    };

    var addGunFormSubmit = function (event) {
        event.preventDefault();
        var gunData = self.gameData.Find(this.sid.value);
        if (!gunData)
        {
            console.log('entered gun SID not found');
            return false;
        }
        var viewerShip = this.DATA.entry,
            gunSID = this.sid.value,
            form = this;
        this.sid.disabled = true;
        var gunIndex = this.DATA.index,
            curRow = form.parentElement;
        //if we already have a gun, we need to remove rotationSliderRow before inserting new one
        if (viewerShip.GetGun(gunIndex))
        {
            curRow.parentElement.removeChild(curRow.nextElementSibling);
        }
        viewerShip.SetGun(gunIndex, self.gameData, gunSID, function () {
            console.log('gun ' + gunSID + ' successfully');
            $(form.fireBtn).off('click', fireButtonClick);
            form.fireBtn.style.display = '';
            form.sid.disabled = false;
            $(form.fireBtn).on('click', {"ship": viewerShip, "gunIndex": gunIndex}, fireButtonClick);
            //event is called from form, createRotationSliderRow returns table row. 
            //we need to get ancestor of form and append row to element next to form
            curRow.parentElement.insertBefore(createRotationSliderRow(viewerShip.GetGun(gunIndex).actor), curRow.nextElementSibling);
        });
        return false;
    }

    var fireButtonClick = function (event) {
        event.data.ship.Fire(event.data.gunIndex, function (bullet) {
            bullet.actor.playAnimation('FLY');
            self.viewer.AddBullet(bullet);
        });        
    };

    var addGunPlatformRow = function (index, viewerShip) {
        var shipData = self.gameData.Find(viewerShip.SID);
        if (!shipData)
        {
            return false;
        }
        var platformData = shipData.gunPlatforms[index];
        if (!platformData)
        {
            return false;
        }
        var tr = createNode('tr');
        tr.appendChild(createNode("th", {}, 'Platform (' + platformData.x + ', ' + platformData.y + ')'));
        var form = createNode('form');
        var td = createNode('td');
        form.DATA = { "entry": viewerShip, "index": index };
        var input = createNode('input', { 'type': 'text', 'name': 'sid', 'placeholder': 'GUN SID' });
        $(input).autocomplete({ source: self.gameData.FindKeysByType(CONST.PROTO_GUN) });
            td.appendChild(input);
            td.appendChild(createNode('input', { 'type': 'submit', 'value': 'Place' }));
            td.appendChild(createNode('input', { type: 'button', value: 'Fire', style: 'display: none', name: 'fireBtn' }));
        $(form).on('submit', addGunFormSubmit);
        form.appendChild(td);
        tr.appendChild(form);
        return tr
    };

    var createRotationSliderRow = function (actorToRotate) {
        var tr = createNode('tr');
        tr.appendChild( createNode('th', {}, 'Rotation:') );

        td = createNode('td');
        var rotation = createNode('div', { 'class': 'rotation-slider' });
        $(rotation).slider({
            value: 0,
            orientation: "horizontal",
            range: "min",
            animate: true,
            step: 0.01,
            min: 0,
            max: 2 * Math.PI,
            slide: onRotationSliderUpdate
        });
        rotation.DATA = {
            actor: actorToRotate
        };
        td.appendChild(rotation);
        tr.appendChild(td);
        td = createNode('td', {}, '0.00');
        tr.appendChild(td);
        return tr;
    };

    this.AddNewShip = function (shipData) {
        var viewerContainerIndex = this.viewer.AddShip(shipData.SID);

        var ul = createNode('ul');
        ul.className = 'ship-proto-ul';
        var li = createNode('li');
        li.className = 'root';

        var table = createNode('table');
        var tr = createNode('tr');
        var td = createNode('td', { 'colspan': 3 });
        var nameClass = '';
        switch (shipData.type)
        {
            case CONST.PROTO_SHIP: { nameClass = 'ship'; break; }
            case CONST.PROTO_GUN: { nameClass = 'gun'; break; }
            case CONST.PROTO_BULLET: { nameClass = 'bullet'; break; }
            case CONST.PROTO_IMAGE: { nameClass = 'image'; break; }
        }
        td.appendChild(createNode('span', { 'class': nameClass }, shipData.SID));
        var removeButton = createNode('input', { type: 'button', value: '×', style: 'float: right' }),
            self = this;
        removeButton.DATA = {
            index: viewerContainerIndex,
            viewer: this.viewer,
            root: this.root,
            nodeToRemove: ul
        };
        removeButton.onclick = this.RemoveShipByButtonClick;
        td.appendChild(removeButton);
        tr.appendChild(td);
        table.appendChild(tr);
        

        table.appendChild( createRotationSliderRow( this.viewer.containers[viewerContainerIndex].container ) );
        for (var i in shipData.gunPlatforms)
        {
            table.appendChild( addGunPlatformRow(i, this.viewer.containers[viewerContainerIndex]) );
        }
        li.appendChild(table);
        ul.appendChild(li);
        this.root.appendChild(ul);
    };

};

//these parameters are set @Explorer.AddNewShip function
Explorer.prototype.RemoveShipByButtonClick = function (event) {
    this.DATA.viewer.RemoveShipByIndex(this.DATA.index);
    this.DATA.root.removeChild(this.DATA.nodeToRemove);
}