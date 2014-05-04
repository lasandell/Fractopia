class Color {
    constructor(public red: number, public blue: number, public green: number) { }
}

class Point {
    constructor(public x: number, public y: number) { }
}

class Rectangle {
    constructor(public left: number, public top: number, public width: number, public height: number) { }

    move(left: number, top: number) {
        return new Rectangle(left, top, this.width, this.height);
    }

    translate(dx: number, dy: number) {
        return this.move(this.left + dx, this.top + dy)
    }

    center(x: number, y: number) {
        return this.move(x - this.width / 2, y - this.height / 2);
    }

    resize(width: number, height: number) {
        return new Rectangle(this.left, this.top, width, height);
    }

    scale(sw: number, sh: number) {
        return this.resize(this.width * sw, this.height * sh);
    }
}

function mapPoint(from: Rectangle, to: Rectangle, p: Point) {
    return new Point(
        (p.x - from.left) / from.width * to.width + to.left,
        (p.y - from.top) / from.height * to.height + to.top);
}
