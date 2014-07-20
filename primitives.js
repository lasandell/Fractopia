var Color = (function () {
    function Color(red, blue, green) {
        this.red = red;
        this.blue = blue;
        this.green = green;
    }
    return Color;
})();

var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
})();

var Rectangle = (function () {
    function Rectangle(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
    Rectangle.prototype.move = function (left, top) {
        return new Rectangle(left, top, this.width, this.height);
    };

    Rectangle.prototype.translate = function (dx, dy) {
        return this.move(this.left + dx, this.top + dy);
    };

    Rectangle.prototype.center = function (x, y) {
        return this.move(x - this.width / 2, y - this.height / 2);
    };

    Rectangle.prototype.resize = function (width, height) {
        return new Rectangle(this.left, this.top, width, height);
    };

    Rectangle.prototype.scale = function (sw, sh) {
        return this.resize(this.width * sw, this.height * sh);
    };
    return Rectangle;
})();

function mapPoint(from, to, p) {
    return new Point((p.x - from.left) / from.width * to.width + to.left, (p.y - from.top) / from.height * to.height + to.top);
}
//# sourceMappingURL=primitives.js.map
