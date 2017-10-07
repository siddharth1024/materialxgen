var menuShown = false;

$('#settings-icon').click(function (e) {
    if (menuShown) {
        $('#menu').animate({
            left: '100%'
        }, 300, function () {
            menuShown = !menuShown;
        });

        $('#settings-icon').animate({
            opacity: 0.5
        }, 300);
    } else {
        var iconRight = 10;
        var width = window.innerWidth - 300;

        $('#menu').animate({
            left: width
        }, 300, function () {
            menuShown = !menuShown;
        });

        $('#settings-icon').animate({
            right: iconRight,
            opacity: 0
        }, 300);
    }
});

$('#close-button').click(function (e) {
    if (menuShown) {
        $('#menu').animate({
            left: '100%'
        }, 300, function () {
            menuShown = !menuShown;
        });
        $('#settings-icon').animate({
            opacity: 0.5
        }, 300);
    } else {
        var iconRight = 10;
        var width = window.innerWidth - widths.menu;

        $('#menu').animate({
            left: width
        }, 300, function () {
            menuShown = !menuShown;
        });

        $('#settings-icon').animate({
            right: iconRight,
            opacity: 0
        }, 300);
    }
});

var LIGHT_SOURCE = 1;

function changeLightSource(value) {
    LIGHT_SOURCE = value;
    for (var i = 1; i < 10; i++) {
        var id = '#light-source-btn-' + i;
        $(id).removeClass('active');
    }
    $('#light-source-btn-' + value).addClass('active');
    updateLightSourceButtonsColors();
    m.lightIndex = LIGHT_SOURCE;

    m.applyLockedSettings();
}

for (var i = 1; i < 10; i++) {
    var id = '#light-source-btn-' + i;
    $(id).click(function (e) {
        var _this = $(this);
        changeLightSource(_this.data('number'));
    });
}

var downloadDialogShown = false;

$('#action-download').click(function (e) {
    e.preventDefault();
    if (downloadDialogShown) {
        $('#downloadDialog').animate({
            height: '0px'
        }, 300, function () {
            downloadDialogShown = !downloadDialogShown
        });
    } else {
        if (lightSourceVisible) {
            $('#lightSourceDiv').animate({
                height: '0px'
            }, 300, function () {
                lightSourceVisible = !lightSourceVisible
            });
        }
        $('#downloadDialog').animate({
            height: '70px'
        }, 300, function () {
            downloadDialogShown = !downloadDialogShown
        });
    }
});

var shareDialogShown = false;

$('#action-share').click(function (e) {
    e.preventDefault();
    if (downloadDialogShown) {
        $('#shareDialog').animate({
            height: '0px'
        }, 300, function () {
            downloadDialogShown = !downloadDialogShown
        });
    } else {
        $('#shareDialog').animate({
            height: '70px'
        }, 300, function () {
            downloadDialogShown = !downloadDialogShown
        });
    }
});

var lightSourceVisible = false;

$('#action-change-light').click(function (e) {
    e.preventDefault();
    if (lightSourceVisible) {
        $('#lightSourceDiv').animate({
            height: '0px'
        }, 300, function () {
            lightSourceVisible = !lightSourceVisible
        });
    } else {
        if (downloadDialogShown) {
            $('#downloadDialog').animate({
                height: '0px'
            }, 300, function () {
                downloadDialogShown = !downloadDialogShown
            });
        }
        $('#lightSourceDiv').animate({
            height: '100px'
        }, 300, function () {
            lightSourceVisible = !lightSourceVisible
        });
    }
});

var lockGeometry = false;

$('#action-lock-geo').click(function (e) {
    e.preventDefault();
    if (!lockGeometry) {
        $('#action-lock-geo').addClass('element-enabled');
        $('#action-lock-geo').css("background-color", accentColor);
        $('#action-lock-geo').hover(function (e) {
            $(this).css("background-color", accentColor)
        });
    } else {
        $('#action-lock-geo').removeClass('element-enabled');
        $('#action-lock-geo').css("background-color", "transparent");
        $('#action-lock-geo').hover(function (e) {
            $(this).css("background-color", e.type === "mouseenter" ? accentColor : "transparent")
        });
    }
    lockGeometry = !lockGeometry;
});

var lockColor = false;

$('#action-lock-color').click(function (e) {
    e.preventDefault();
    if (!lockColor) {
        $('#action-lock-color').addClass('element-enabled');
        $('#action-lock-color').css("background-color", accentColor);
        $('#action-lock-color').hover(function (e) {
            $(this).css("background-color", accentColor)
        });
    } else {
        $('#action-lock-color').removeClass('element-enabled');
        $('#action-lock-color').css("background-color", "transparent");
        $('#action-lock-color').hover(function (e) {
            $(this).css("background-color", e.type === "mouseenter" ? accentColor : "transparent")
        });
    }
    lockColor = !lockColor;
});

var colorScheme = "AdobeColors";

$('#action-refresh').click(function (e) {
    e.preventDefault();
    m.applySettings();
});

function setupDropdown() {
    var elements = $('select');
    elements.each(function () {
        var $this = $(this),
            numberOfOptions = $(this).children('option').length;

        $this.addClass('select-hidden');
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="select-styled"></div>');

        var $styledSelect = $this.next('div.select-styled');
        $styledSelect.text($this.children('option').eq(0).text());

        var $list = $('<ul />', {
            'class': 'select-options'
        }).insertAfter($styledSelect);

        for (var i = 0; i < numberOfOptions; i++) {
            $('<li />', {
                text: $this.children('option').eq(i).text(),
                rel: $this.children('option').eq(i).val()
            }).appendTo($list);
        }

        var $listItems = $list.children('li');

        $styledSelect.click(function (e) {
            e.stopPropagation();
            $('div.select-styled.active').each(function () {
                $(this).removeClass('active').next('ul.select-options').hide();
            });
            $(this).toggleClass('active').next('ul.select-options').toggle();
        });

        $listItems.click(function (e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active');
            $this.val($(this).attr('rel'));
            $list.hide();
            colorScheme = $this.val();
            myColorScheme = new ColorScheme(colorScheme);
            m.applySettings();
        });

        $(document).click(function () {
            $styledSelect.removeClass('active');
            $list.hide();
        });

    });
}


var infoWindow = false;

$('#action-info').click(function (e) {
    e.preventDefault();
    if (infoWindow) {
        $('#black-tint').animate({
            opacity: 0
        }, 300, function () {
            infoWindow = !infoWindow
            $('#black-tint').css("z-index", -10);
            $('#black-tint').css("visibility", "hidden");
        });
    } else {
        $('#black-tint').animate({
            "z-index": 45,
            opacity: 1
        }, 300, function () {
            infoWindow = !infoWindow
            $('#black-tint').css("visibility", "visible");
        });
    }
});

$(document).click(
    function () {
        if (infoWindow) {
            $('#black-tint').animate({
                opacity: 0
            }, 300, function () {
                infoWindow = !infoWindow
                $('#black-tint').css("z-index", -10);
                $('#black-tint').css("visibility", "hidden");
            });
        }
    }
);