function detectmob() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    } else {
        return false;
    }
}

var mobile;

function performDownload(e, width, height) {
    multiplyFactor = 1;
    var h = jQuery.extend({}, m);
    h.setContextParameters("hiddenCanvas", width, height);
    h.inflate();
    h.setVariables();
    h.refreshCartesian = 1;
    h.applySettingsBeta();
    h.downloadCanvas(e);
    document.getElementById("hiddenCanvas").innerHTML = "";
    console.log("ColorScheme : ", r);
}

var multiplyFactor = 0;
var time = 0;
var reqAnimFrame;
var mobile = false;
var docWidth = document.body.clientWidth;
var docHeight = document.body.clientHeight;

function animate() {
    if ((!(multiplyFactor >= 1))) {
        reqAnimFrame(animate);
        draw();
        multiplyFactor = easeOutCubic(time);
        time += 0.03;
    } else {
        window.cancelAnimationFrame(reqAnimFrame);
    }
}

function draw() {
    m.setContextParameters("backyard", docWidth, docHeight);
    m.inflate();
    m.setVariables();
    m.refreshCartesian = 1;
    m.applySettingsBeta();
}

function hex2rgb(hex) {
    var bigint = parseInt(hex.slice(0), 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return r + "," + g + "," + b;
}

function colorTransition(xa, xb, i) {
    if (i != 1) {

        a = new colz.Color(xa);
        b = new colz.Color(xb);

        c = new colz.Color(xa);

        c.setHue(b.hsl.h * i);
        c.setSat(b.hsl.s * i);
        c.setLum(b.hsl.l * i);

        return c.rgb.toString();
    }
    return xb;
}

function hexToRGBA(hex, alpha) {
    var h = "0123456789ABCDEFabcdef";
    var r = h.indexOf(hex[1]) * 16 + h.indexOf(hex[2]);
    var g = h.indexOf(hex[3]) * 16 + h.indexOf(hex[4]);
    var b = h.indexOf(hex[5]) * 16 + h.indexOf(hex[6]);
    return "rgba(" + r + ", " + g + ", " + b + "," + alpha + ")";
}

function ColorLuminance(hex, lum) {

    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    var rgb = "#",
        c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
}

var accentColor, accentColorSecondary, accentColorBackground;

function updateGlobalAccent() {

    accentColor = hexToRGBA(r[2], 0.5);
    var col = r[5];
    accentColorSecondary = ColorLuminance(col, -0.8);
    accentColorBackground = ColorLuminance(col, -0.6);

    $("#menu").css("background-color", accentColorSecondary);

    $("#close-button").hover(function (e) {
        $(this).css("background-color", e.type === "mouseenter" ? accentColor : "transparent")
    });

    $(".grid-element").hover(function (e) {
        $(this).css("background-color", e.type === "mouseenter" ? accentColor : "transparent")
    });

    updateLightSourceButtonsColors();

    $(".element-enabled").hover(function (e) {
        $(this).css("background-color", e.type === "mouseenter" ? accentColor : "transparent")
    });

    $(".button-a").hover(function (e) {
        $(this).css("background-color", e.type === "mouseenter" ? accentColor : "transparent")
    });

    $(".element-enabled").css("background-color", accentColor);

    $("#shareDialog").find(" > img").hover(function (e) {
        $(this).css("background-color", e.type === "mouseenter" ? accentColor : "transparent")
    });

    $(".select-styled").hover(function (e) {
        $(this).css("background-color", e.type === "mouseenter" ? accentColor : "transparent")
    });

    $(".select-options").css("background-color", accentColorBackground);

    var obj = $('.select-options').find(" > li");

    for (var i = 0; i < obj.length; i++) {
        $(obj[i]).hover(function (e) {
            $(this).css("background-color", e.type === "mouseenter" ? accentColor : "transparent")
        });
    }
}

function updateLightSourceButtonsColors() {
    var ls = $(".light-source-btn");
    for (var i = 0; i < ls.length; i++) {
        if (!$(ls[i]).hasClass("active")) {
            $(ls[i]).css("background-color", "transparent");
            $(ls[i]).hover(function (e) {
                $(this).css("background-color", e.type === "mouseenter" ? accentColor : "transparent")
            });
        } else {
            $(ls[i]).css("background-color", accentColor);
            $(ls[i]).hover(function (e) {
                $(this).css("background-color", accentColor);
            });
        }
    }
    $('.active').css("background-color", accentColor);
}

function easeOutCubic(t) {
    return (--t) * t * t + 1
}

function paintAndAnimate() {
    if (mobile) {
        multiplyFactor = 1;
        time = 1;
    } else {
        multiplyFactor = 0;
        time = 0;
        reqAnimFrame(animate);
    }
    m.applySettings();
    updateGlobalAccent();
}

window.onload = function () {
    docWidth = document.body.clientWidth;
    docHeight = document.body.clientHeight;
    //mobile = detectmob();
    mobile = false;
    if (mobile) {
        multiplyFactor = 1;
        time = 1;
    }
    setupDropdown();
    m = new mxgen("backyard", docWidth, docHeight);
    if (!mobile) {
        reqAnimFrame = window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.requestAnimationFrame;
        reqAnimFrame(animate);
    }
    updateGlobalAccent();
    updateLightSourceButtonsColors();

    document.getElementById("backyard").addEventListener('click', paintAndAnimate);

    document.getElementById("download-1920").addEventListener('click', function () {
        performDownload(this, 1920, 1080);
    }, false);

    document.getElementById("download-2560").addEventListener('click', function () {
        performDownload(this, 2560, 1440);
    }, false);

    document.getElementById("download-1080").addEventListener('click', function () {
        performDownload(this, 1080, 1920);
    }, false);

    document.getElementById("download-720").addEventListener('click', function () {
        performDownload(this, 720, 1280);
    }, false);

    $(window).resize(function () {
        docWidth = document.body.clientWidth;
        docHeight = document.body.clientHeight;
        m.setContextParameters("backyard", docWidth, docHeight);
        m.inflate();
        m.setVariables();
        m.refreshCartesian = 1;
        m.applySettingsBeta();
    });
};