"use strict";

//twist.js by Sherry Nelson:
//Variation of ex. programs "gasket2.js" combined with "rotatingSquare2.js"

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;
var theta = 0.0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

 //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);



    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
   // gl.bufferData( gl.ARRAY_BUFFER, 8*Math.pow(3,6), gl.STATIC_DRAW );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

   document.getElementById("theta_slider").onchange = function() {
	theta = document.getElementById("theta_slider").value * Math.PI/180;;
	render();
   };
   document.getElementById("subdiv_slider").onchange = function() {
	NumTimesToSubdivide = document.getElementById("subdiv_slider").value;
        render();
    };

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
};

function triangle( a, b, c )
{
	var a_twist = twistNscale(a);
	var b_twist = twistNscale(b);
	var c_twist = twistNscale(c);
//console.log("Twisted pts: a=" + a_twist + " b=" + b_twist + " c=" + c_twist);
    points.push( a_twist, b_twist, c_twist );
}
function twistNscale(vec){
	var x = vec[0];
	var y = vec[1];
	//set theta to an  arbitrary angle (45 degrees) to rotate triangle:
//	var theta = 45 * Math.PI/180;
	//d= distance from origin
	var d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	//the rotated x position of this point:
	var x_rot = x*Math.cos(d*theta) - y*Math.sin(d*theta);
	//the rotated y position of this point:
	var y_rot = x*Math.sin(d*theta) + y*Math.cos(d*theta);

	//scale down by half to make triangle fit on canvas:
	var vec_rot = vec2(x_rot/2, y_rot/2);
//console.log("func twist: vec=" + vec + " x rot " + x_rot);
	return vec_rot;
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );

	//EDIT: include  middle triangles:
        divideTriangle( ab, ac, bc, count );
	
	//console.log("a=" + a + " b=" + b + " c=" + c + " count =" + count);
	//console.log("ab=" + ab + " bc=" + bc + " ac=" + ac + " count =" + count);
    }
}

function render()
{
   var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];
    points = [];
    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    points = [];
}



