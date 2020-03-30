function BDMapInit(map, json) {

    const isPCequipt = document.body.clientWidth > 450;


    var isNumc = 1,
        defaultCity = '泉州',
        defaultPoint = '118.611836,24.918225',
        defaultZoom = 15,
        copyright = ' ';
    if (typeof(json) != 'undefined') {
        isNumc = typeof(json.isNumc) == 'undefined' ? isNumc : json.isNumc,
            defaultCity = typeof(json.city) == 'undefined' ? defaultCity : (json.city == '' ? defaultCity : json.city),
            defaultPoint = typeof(json.point) == 'undefined' ? defaultPoint : (json.point == '' ? defaultPoint : json.point),
            defaultZoom = typeof(json.zoom) == 'undefined' ? defaultZoom : json.zoom,
            copyright = typeof(json.copyright) == 'undefined' ? copyright : json.copyright;
    }
    var default_longitude = defaultPoint.split(',')[0],
        default_latitude = defaultPoint.split(',')[1];

    map.enableScrollWheelZoom();
    map.enableContinuousZoom();
    var point = new BMap.Point(default_longitude, default_latitude);


    if (isNumc == 1)
        map.centerAndZoom(point, defaultZoom);
    else
        map.centerAndZoom(defaultCity, defaultZoom);
    var mapType1 = new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP] });
    var mapType2 = new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT });
    var overView = new BMap.OverviewMapControl();
    var overViewOpen = new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT });
    map.addControl(mapType1);
    map.addControl(mapType2);
    map.setCurrentCity(defaultCity);
    map.addControl(overView);
    if (isPCequipt) {
        var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_TOP_RIGHT });
        map.addControl(cr);
        var bs = map.getBounds();
        cr.addCopyright({ id: 1, content: '<a class="b_copyright">' + copyright + '</a>', bounds: bs });
    }


    map.enableContinuousZoom();
    var size = new BMap.Size(180, 10);
    map.addControl(new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        offset: size,

    }));
}


function createMapPoint(dataJson, paramJson) {
    const isPCequipt = document.body.clientWidth > 450;

    var l_point = dataJson.l_point,
        r_point = dataJson.r_point,
        title = dataJson.title,
        description = dataJson.description,
        image = dataJson.image,
        visitor_count = dataJson.visitor_count,
        equipment = dataJson.equipment,
        dragging = typeof(dataJson.dragging) == 'undefined' ? false : dataJson.dragging,
        isInfo = typeof(dataJson.isInfo) == 'undefined' ? true : dataJson.isInfo,
        style = typeof(dataJson.style) == 'undefined' ? "" : dataJson.style,
        iconImg = typeof(dataJson.icon) == 'undefined' ? "" : dataJson.icon;

    var showDetails = typeof(paramJson) == 'undefined' ? false : typeof(paramJson.showDetails) == 'undefined' ? false : paramJson.showDetails;
    if (showDetails) isInfo = false;

    var point = new BMap.Point(l_point, r_point);

    var $iconJson = {}
    if (iconImg != "") {
        var size = new BMap.Size(30, 30);
        var iconOptions = {

            anchor: new BMap.Size(5, 10)
        }
        var icon = new BMap.Icon(iconImg, size, iconOptions);
        $iconJson = { "icon": icon }
    }


    var marker = new BMap.Marker(point);
    map.addOverlay(marker);


    if (dragging) marker.enableDragging();
    else marker.disableDragging();
    if (showDetails) title = description;
    var $labelJson = { "point": point, "title": title, "style": style, "showDetails": showDetails }
    createMapLabel(marker, $labelJson);

    if (isInfo) {
        var $infoJson = { "point": point, "title": title, "description": description, "image": image, "visitor_count": visitor_count, "equipment": equipment };
        createMapInfoWindow(marker, $infoJson, isPCequipt);
    }

}


function createMapLabel(marker, json) {
    var point = json.point,
        title = json.title,
        style = json.style;
    var showDetails = json.showDetails;


    var l_opts = {
        position: point,
        offset: new BMap.Size(15, -25)
    }

    var color = '#fff',
        backgroundColor = style == '' ? 'red' : style,
        borderColor = style == '' ? 'red' : 'transparent';

    var styleJson = {
        color: "inherit",
        backgroundColor: "red",
        fontSize: "12px",

        padding: "5px 8px",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "red",
        borderRadius: "3px",
        fontFamily: "微软雅黑"
    }
    var label = new BMap.Label('<div class="bdLabel ' + style + '">' + title + '</div>', l_opts);
    label.setStyle(styleJson);
    marker.setLabel(label);

    var $parent = $('.bdLabel').parents('.BMapLabel');
    if (showDetails) $parent.addClass('hasDetail');
    else $parent.removeClass('hasDetail');

}


function createMapInfoWindow(marker, json, isPCequipt) {
    var title = json.title,
        description = json.description,
        image = json.image,
        point = json.point,
        visitor_count = json.visitor_count,
        equipment = json.equipment;

    var content = '<div class="bdInfoWindow">' + "<img src='./img_zs/" + image + "'>" + "<p>介绍：" + description + " </p>" + "<p>设备：" + equipment + " 台<p/>" + "<p>人流量：" + visitor_count + " 人次/天<p/>" + '</div>';

    var infoOptionsPc = {

        "width": 450,

        "height": 550,
        "title": title,
        enableMessage: true
    }

    var infoOptionsPhone = {

        "width": 250,

        "height": 400,

        "title": title,
        enableMessage: true
    }



    if (isPCequipt) {

        var infoWindow = new BMap.InfoWindow(content, infoOptionsPc);
        marker.addEventListener("click", function() {
            map.openInfoWindow(infoWindow, point);
        });
    } else {

        var infoWindow = new BMap.InfoWindow(content, infoOptionsPhone);
        marker.addEventListener("click", function() {
            map.openInfoWindow(infoWindow, point);
        });
    }

}

function getTagNameOfElement(ID) {
    var tagName = document.getElementById(ID).tagName.toLocaleLowerCase(); //
    return tagName;
}

function assignValue2Element(id, value, json) {
    var isHTML = typeof(json) == 'undefined' ? false : (typeof(json.isHTML) == 'undefined' ? false : json.isHTML);

    if (getTagNameOfElement(id) == 'input') document.getElementById(id).value = value;
    else {
        if (isHTML) document.getElementById(id).innerText = value;
        else document.getElementById(id).innerHTML = value;
    }

}