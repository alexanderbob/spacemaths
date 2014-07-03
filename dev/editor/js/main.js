var main,
    Images = new ImagesHandler(true);
window.onload = function() {
    main = new Main();
    main.RefreshSIDList();

    $('#clearFormsButton').on('click', function () {
        $('.protoForm [type=text], .protoForm [type=number], .protoForm [name=prevSID]').val('');
    });
};
