function error(msg) {
    if (window.console) {
        if (window.console.error) {
            window.console.error(msg);
        } else if (window.console.log) {
            window.console.log(msg);
        }
    }
}

function loadShader(gl, shaderSource, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var lastError = gl.getShaderInfoLog(shader);
        error("*** Error compiling shader '" + shader + "':" + lastError);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function loadProgram(gl, shaders) {
    var program = gl.createProgram();
    for (var i = 0; i < shaders.length; ++i) {
        gl.attachShader(program, shaders[i]);
    }
    gl.linkProgram(program);
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var lastError = gl.getProgramInfoLog(program);
        error("Error in program linking:" + lastError);

        gl.deleteProgram(program);
        return null;
    }
    return program;
}
;

function createShaderFromScript(gl, scriptPath, shaderType) {
    var request = new XMLHttpRequest();
    request.open("GET", scriptPath, false);
    request.send();
    return loadShader(gl, request.responseText, shaderType);
}
//# sourceMappingURL=shaders.js.map
