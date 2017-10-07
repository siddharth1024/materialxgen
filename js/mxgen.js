var m, myColorScheme, savedStack, currentColor, lastColor = "#FF0000";

function mxgen(targetElement, width, height) {
    this.setContextParameters(targetElement, width, height);
    this.inflate();
    this.setVariables();
    this.applySettings();
}

mxgen.prototype = {
    inflate: function () {
        document.getElementById(this.targetElement).width = this.width;
        document.getElementById(this.targetElement).height = this.height;

        this.c = document.getElementById(this.targetElement);
        this.ctx = this.c.getContext("2d");

        this.canvasWidth = this.width;
        this.canvasHeight = this.height;
        this.canvasMultiplier = (this.canvasWidth >= this.canvasHeight) ? this.canvasWidth : this.canvasHeight;
    },

    setContextParameters(targetElement, width, height) {
        this.targetElement = targetElement;
        this.width = width;
        this.height = height;
    },

    setVariables: function () {
        if (this.canvasHeight > this.canvasWidth) {
            this.canvasMultiplier *= 1.5;
        }
        this.refreshCartesian = 0;
        this.lightDistance = this.canvasMultiplier / 120;
        this.maxOffset = this.canvasMultiplier / 24;
        this.blurFactor = this.canvasMultiplier / 91.33;
        this.rotationFactor = 45;
        this.lightIndex = 1;
        this.minSize = this.canvasMultiplier * 0.055;
        this.maxSize = this.canvasMultiplier * 0.0892;
    },

    applySettings: function () {
        if (lockColor == true && lockGeometry == true) {
            this.applyLockedSettings();
        } else {
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.setLight(LIGHT_SOURCE);
            this.ctx.save();
            if (!lockColor) {
                myColorScheme = new ColorScheme(colorScheme);
            }
            if (lockColor == true && lockGeometry == true) {} else {
                lastColor = (this.background == null) ? "#000000" : this.background;
                this.background = myColorScheme.getNextColor();
                currentColor = this.background;
                this.setBackground();
            }
            if (!lockColor) {
                this.generateShadowProperties();
                if (lockGeometry) {
                    for (var i = 0; i < this.stack.length; i++) {
                        this.stack[i].parent = this;
                        this.stack[i].applySettings();
                    }
                } else {
                    this.stack = [];
                    for (var i = 0; i < 4; i++) {
                        this.addMaterial(this);
                    }
                }
            } else {
                for (var i = 0; i < this.stack.length; i++) {
                    this.stack[i].parent = this;
                    this.stack[i].applySettings();
                }
            }
            this.ctx.restore();
            this.applyOverlay();
        }
        savedStack = jQuery.extend({}, this.stack);
    },

    applySettingsBeta: function () {
        this.stack = jQuery.extend({}, savedStack);
        var t_LC = lockColor;
        var t_LG = lockGeometry;
        lockColor = lockGeometry = 1;
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.setLight(LIGHT_SOURCE);
        this.setBackground();
        this.ctx.save();
        this.generateShadowProperties();

        var array = $.map(this.stack, function (value, index) {
            return [value];
        });

        this.stack = array;

        for (var i = 0; i < this.stack.length; i++) {
            this.stack[i].parent = this;
            this.stack[i].applySettings();
        }
        this.ctx.restore();
        this.applyOverlay();
        lockColor = t_LC;
        lockGeometry = t_LG
        savedStack = jQuery.extend({}, this.stack);
        this.refreshCartesian = 0;
    },

    applyLockedSettings: function () {
        var t_LC = lockColor;
        var t_LG = lockGeometry;
        lockColor = lockGeometry = 1;
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.setLight(LIGHT_SOURCE);
        this.ctx.save();
        this.setBackground();
        this.generateShadowProperties();
        for (var i = 0; i < this.stack.length; i++) {
            this.stack[i].applySettings();
        }
        this.ctx.restore();
        this.applyOverlay();
        lockColor = t_LC;
        lockGeometry = t_LG
    },

    addMaterial: function (where) {
        this.stack.push(new material(where));
    },

    setBackground: function (color) {
        this.ctx.fillStyle = colorTransition(lastColor, currentColor, 1);
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    },

    placeAgain: function () {
        for (var i = 0; i < this.stack.length; i++) {
            this.stack[i].applySettings();
        }
    },

    generateShadowProperties: function () {
        var angle = getAngle(this.canvasWidth / 2, this.canvasHeight / 2, this.lightX, this.lightY);
        var shadowAngle = angle + 180;
        if (shadowAngle > 360) {
            shadowAngle = shadowAngle - 360;
        }
        this.shadowAngle = shadowAngle;
    },
    setLight: function (matrixIndex) {
        var x = this.canvasWidth / 2;
        var y = this.canvasHeight / 2;

        var lc = this.lightDistance;

        if ([1, 4, 7].indexOf(matrixIndex) > -1)
            x -= lc;
        if ([3, 6, 9].indexOf(matrixIndex) > -1)
            x += lc;
        if ([1, 2, 3].indexOf(matrixIndex) > -1)
            y += lc;
        if ([7, 8, 9].indexOf(matrixIndex) > -1)
            y -= lc;

        this.lightX = x;
        this.lightY = y;
        this.shadowDistance = this.lightDistance;
        if (matrixIndex == 5) this.shadowDistance = 0;
    },
    applyOverlay: function () {
        var layerCanvas = document.createElement("canvas");
        layerCanvas.width = this.canvasWidth;
        layerCanvas.height = this.canvasHeight;
        var l = layerCanvas.getContext("2d");
        var x = this.canvasWidth / 2;
        var y = this.canvasHeight / 2;
        var innerRadius = 1;
        var outerRadius = this.canvasMultiplier / 1.7;
        var grd = l.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
        grd.addColorStop(0, 'rgba(255,255,255,0.4)');
        grd.addColorStop(1, 'rgba(0,0,0,0.2)');
        l.fillStyle = grd;
        l.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.save();
        this.ctx.globalCompositeOperation = "overlay";
        this.ctx.drawImage(layerCanvas, 0, 0);
        this.ctx.restore();
    },
    downloadCanvas: function (e) {
        var dt = this.c.toDataURL('image/png');
        dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
        dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=mxgen_wall.png');
        e.href = dt;
    }
};

function material(parent) {
    this.parent = parent;
    this.applySettings();
}

material.prototype = {
    applySettings: function () {
        this.randomize();
        this.rotate(this.angle);
        this.displace();
        this.buildShadow(this.angle - this.parent.shadowAngle, this.parent.shadowDistance);
        this.parent.ctx.fillStyle = this.color;
        this.parent.ctx.fillRect(this.x, this.y, this.radius, this.radius);
        this.x = this.x - Number(this.xOffset);
        this.y = this.y - Number(this.yOffset);
    },

    buildShadow: function (shadowAngle, distance) {
        var newPoint = getPointByAngle(this.x, this.y, shadowAngle - this.angle, distance);
        this.parent.ctx.shadowBlur = this.parent.blurFactor * multiplyFactor;
        this.parent.ctx.shadowOffsetX = newPoint.x * multiplyFactor;
        this.parent.ctx.shadowOffsetY = newPoint.y * multiplyFactor;
        var opacity = 0.5 * 1;
        this.parent.ctx.shadowColor = 'rgba(0, 0, 0, ' + opacity + ')';
        this.parent.ctx.fillStyle = "#000000";
    },

    rotate: function (angle) {
        this.parent.ctx.translate(this.parent.canvasWidth / 2, this.parent.canvasHeight / 2);
        var finalAngle = (angle * (3.1415 / 180)) * multiplyFactor;
        this.parent.ctx.rotate(finalAngle);
        this.parent.ctx.translate(-this.parent.canvasWidth / 2, -this.parent.canvasHeight / 2);
    },

    displace: function () {
        this.x = this.x + Number(this.xOffset);
        this.y = this.y + Number(this.yOffset);
    },
    randomize: function () {
        if (this.parent.refreshCartesian) {
            var rad = (this.parent.canvasMultiplier * this.radiusToCanvasRatio);
            this.radius = rad - ((rad / 5) * (1 - multiplyFactor));
            this.x = (this.parent.canvasWidth / 2 - this.radius / 2) // * multiplyFactor;
            this.y = (this.parent.canvasHeight / 2 - this.radius / 2) // * multiplyFactor;
            this.xOffset = (this.xOffsetRatio * this.parent.canvasMultiplier) * multiplyFactor;
            this.yOffset = (this.yOffsetRatio * this.parent.canvasMultiplier) * multiplyFactor;
        }
        if (!lockGeometry && !this.parent.refreshCartesian) {
            this.radius = getRandomInt(this.parent.minSize, this.parent.maxSize);
            this.radiusToCanvasRatio = this.radius / this.parent.canvasMultiplier;
            this.x = this.parent.canvasWidth / 2 - this.radius / 2;
            this.y = this.parent.canvasHeight / 2 - this.radius / 2;
            this.angle = getRandomInt(-this.parent.rotationFactor, this.parent.rotationFactor);
            this.xOffset = getRandomInt(-this.parent.maxOffset, this.parent.maxOffset);
            this.yOffset = getRandomInt(-this.parent.maxOffset, this.parent.maxOffset);
            this.xOffsetRatio = this.xOffset / this.parent.canvasMultiplier;
            this.yOffsetRatio = this.yOffset / this.parent.canvasMultiplier;
        }
        if (!lockColor && !this.parent.refreshCartesian) {
            this.color = myColorScheme.getNextColor();
        }
    }
};

function getRandomInt(min, max) {
    return (((Math.random() * (max - min + 1)) << 0) + min);
}

function getPointByAngle(fromX, fromY, angle, distance) {
    angle *= 3.1415 / 180;
    var toX = distance * Math.cos(angle);
    var toY = distance * Math.sin(angle);
    return {
        x: toX,
        y: toY
    }
}

function getAngle(x1, y1, x2, y2) {
    var angle = Math.atan2(y2 - y1, x2 - x1);
    angle = angle * 57.296;
    if (angle < 0) {
        angle += 360;
    }
    return angle;
}

function getDistance(x1, y1, x2, y2) {
    var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    return d;
}