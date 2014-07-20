var canvas = document.getElementById("canvas");
var gl = canvas.getContext("experimental-webgl", { preserveDrawingBuffer: true });
var startColorPicker = document.getElementById("startColor");
var endColorPicker = document.getElementById("endColor");
var swapColorsCheckBox = document.getElementById("swapColors");
var hsbRadio = document.getElementById("hsbRadio");
var rgbRadio = document.getElementById("rgbRadio");
var downloadLink = document.getElementById("downloadLink");

var program;

var startColor = [1, 0, 0];
var endColor = [0, 0, 1];
var swapColors = false;
var gradientType = "HSB";

//var rect = new Rectangle(-2, -1.25, 2.5, 2.5);
var origRect = new Rectangle(-2, -1.0, 2.5, 2.0);
var rect = origRect;

function parseColor(color) {
    return [
        parseInt(color.substr(1, 2), 16) / 255,
        parseInt(color.substr(3, 2), 16) / 255,
        parseInt(color.substr(5, 2), 16) / 255
    ];
}
;

function formatComponent(color, index) {
    var hex = Math.round(color[index] * 255).toString(16);
    var fullHex = "0" + hex;
    return fullHex.substr(fullHex.length - 2);
}
;

function formatColor(color) {
    return "#" + formatComponent(color, 0) + formatComponent(color, 1) + formatComponent(color, 2);
}

function createProgram() {
    var vertexShader = createShaderFromScript(gl, "vertex.txt", gl.VERTEX_SHADER);
    var fragmentShader = createShaderFromScript(gl, "fragment.txt", gl.FRAGMENT_SHADER);
    var program = loadProgram(gl, [vertexShader, fragmentShader]);
    gl.useProgram(program);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // Create a buffer and put a single clipspace rectangle in
    // it (2 triangles)
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    return program;
}

function render() {
    gl.uniform4f(rectLocation, rect.left, rect.top, rect.width, rect.height);
    var rectLocation = gl.getUniformLocation(program, "rect");
    gl.uniform4f(rectLocation, rect.left, rect.top, rect.width, rect.height);
    var resolutionLocation = gl.getUniformLocation(program, "resolution");
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    var startColorLocation = gl.getUniformLocation(program, "startColor");
    gl.uniform3fv(startColorLocation, swapColors ? endColor : startColor);
    var endColorLocation = gl.getUniformLocation(program, "endColor");
    gl.uniform3fv(endColorLocation, swapColors ? startColor : endColor);
    var useHsbLocation = gl.getUniformLocation(program, "useHsb");
    gl.uniform1i(useHsbLocation, gradientType == "HSB" ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function zoom(clientCenterX, clientCenterY, factor) {
    var canvasX = clientCenterX - canvas.clientLeft;
    var canvasY = canvas.clientHeight - (clientCenterY - canvas.clientTop);
    var canvasRect = new Rectangle(canvas.clientLeft, canvas.clientTop, canvas.clientWidth, canvas.clientHeight);
    var point = mapPoint(canvasRect, rect, new Point(canvasX, canvasY));
    rect = rect.scale(factor, factor).center(point.x, point.y);
    render();
}

program = createProgram();

startColorPicker.value = formatColor(startColor);
endColorPicker.value = formatColor(endColor);

startColorPicker.onchange = function () {
    startColor = parseColor(startColorPicker.value);
    render();
};

endColorPicker.onchange = function () {
    endColor = parseColor(endColorPicker.value);
    render();
};

swapColorsCheckBox.onchange = function () {
    swapColors = swapColorsCheckBox.checked;
    render();
};

hsbRadio.onclick = function () {
    if (hsbRadio.checked)
        gradientType = "HSB";
    render();
};

rgbRadio.onclick = function () {
    if (rgbRadio.checked)
        gradientType = "RGB";
    render();
};

canvas.oncontextmenu = function (e) {
    e.preventDefault();
    zoom(e.clientX, e.clientY, 4);
};

canvas.onclick = function (e) {
    return zoom(e.clientX, e.clientY, 0.25);
};

downloadLink.onclick = function () {
    downloadLink.href = canvas.toDataURL();
};

window.onkeydown = function (e) {
    var scaleFactor = 0.75;
    var nudgeDelta = 0.025 * rect.width;
    switch (e.keyCode) {
        case 13:
        case 107:
        case 187:
            rect = rect.scale(scaleFactor, scaleFactor).center(rect.left + rect.width / 2, rect.top + rect.height / 2);
            break;
        case 189:
            rect = rect.scale(1 / scaleFactor, 1 / scaleFactor).center(rect.left + rect.width / 2, rect.top + rect.height / 2);
            break;
        case 37:
            rect = rect.translate(-nudgeDelta, 0);
            break;
        case 38:
            rect = rect.translate(0, nudgeDelta);
            break;
        case 39:
            rect = rect.translate(nudgeDelta, 0);
            break;
        case 40:
            rect = rect.translate(0, -nudgeDelta);
            break;
        case 27:
            rect = origRect;
            break;
    }
    render();
};

render();
//# sourceMappingURL=app.js.map
