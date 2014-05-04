var canvas = <HTMLCanvasElement> document.getElementById("canvas");
var gl = <WebGLRenderingContext> canvas.getContext("webgl");
var startColorPicker = <HTMLInputElement>document.getElementById("startColor");
var endColorPicker = <HTMLInputElement>document.getElementById("endColor");
var swapColorsCheckBox = <HTMLInputElement> document.getElementById("swapColors");
var hsbRadio = <HTMLInputElement> document.getElementById("hsbRadio");
var rgbRadio = <HTMLInputElement> document.getElementById("rgbRadio");

var program: WebGLProgram;

var startColor = [1, 0, 0];
var endColor = [0, 0, 1]
var swapColors = false;
var gradientType = "HSB";
//var rect = new Rectangle(-2, -1.25, 2.5, 2.5);
var origRect = new Rectangle(-2, -1.0, 2.5, 2.0);
var rect = origRect;

function parseColor(color: string) {
    return [
        parseInt(color.substr(1, 2), 16) / 255,
        parseInt(color.substr(3, 2), 16) / 255,
        parseInt(color.substr(5, 2), 16) / 255
    ];
};

function formatComponent (color: number[], index: number) {
    var hex = Math.round(color[index] * 255).toString(16);
    var fullHex = "0" + hex;
    return fullHex.substr(fullHex.length - 2);
};

function formatColor (color: number[]) {
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
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            1.0, 1.0]),
        gl.STATIC_DRAW);
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

function zoom(clientCenterX: number, clientCenterY: number, factor: number) {
    var canvasX = clientCenterX - canvas.clientLeft;
    var canvasY = canvas.clientHeight - (clientCenterY - canvas.clientTop);
    var point = mapPoint(new Rectangle(0, 0, canvas.clientWidth, canvas.clientHeight), rect, new Point(canvasX, canvasY));
    rect = rect.scale(factor, factor).center(point.x, point.y);
    render();
}

program = createProgram();

startColorPicker.value = formatColor(startColor);
endColorPicker.value = formatColor(endColor);

startColorPicker.onchange = () => {
    startColor = parseColor(startColorPicker.value);
    render();
};

endColorPicker.onchange = () => {
    endColor = parseColor(endColorPicker.value);
    render();
};

swapColorsCheckBox.onchange = () => {
    swapColors = swapColorsCheckBox.checked;
    render();
};

hsbRadio.onclick = () => {
    if (hsbRadio.checked) gradientType = "HSB";
    render();
}

rgbRadio.onclick = () => {
    if (rgbRadio.checked) gradientType = "RGB";
    render();
}

canvas.oncontextmenu = e => {
    e.preventDefault();
    zoom(e.clientX, e.clientY, 4);
}

canvas.onclick = e => zoom(e.clientX, e.clientY, 0.25);

window.onkeydown = e => {
    var scaleFactor = 0.75;
    var nudgeDelta = 0.025 * rect.width;
    switch (e.keyCode) {
        case 13:    // Enter
        case 107:   // =
        case 187:   // +
            rect = rect.scale(scaleFactor, scaleFactor);
            break;
        case 189:   // -
            rect = rect.scale(1 / scaleFactor, 1 / scaleFactor);
            break;
        case 37:    // Left
            rect = rect.translate(-nudgeDelta, 0);
            break; 
        case 38:    // Up
            rect = rect.translate(0, nudgeDelta);
            break;
        case 39:    // Down
            rect = rect.translate(nudgeDelta, 0);
            break;
        case 40:    // Right
            rect = rect.translate(0, -nudgeDelta);
            break;
        case 27:    // Escape
            rect = origRect;
            break;
    }
    render();
};

render();
