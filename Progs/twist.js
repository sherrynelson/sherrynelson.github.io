"use strict";

//twist.js by Sherry Nelson:
//Variation of ex. programs "gasket2.js" combined with "rotatingSquare2.js"

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;
var theta = 0.0;
//set points of equilateral triangle centered around origin:
var vertices = [
	vec2( -0.86, -0.5 ),
            vec2(  0,  1 ),
            vec2(  0.86, -0.5 )
	];

window.onload = function init()
{
    var colors = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

 //  Initialize our data for the Sierpinski Gasket
    //



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

//var cBuffer = gl.createBuffer();
 //   gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  //  gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

   // var vColor = gl.getAttribLocation( program, "vColor" );
   // gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
  //  gl.enableVertexAttribArray( vColor );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
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

    //gl.clear( gl.COLOR_BUFFER_BIT );
    //gl.drawArrays( gl.TRIANGLES, 0, 3 );
   render();
};

function triangle( a, b, c )
{
 // TODO: add colors  for one triangle


	var a_twist = twist(a);
	var b_twist = twist(b);
	var c_twist = twist(c);
//console.log("Twisted pts: a=" + a_twist + " b=" + b_twist + " c=" + c_twist);
    points.push( a_twist, b_twist, b_twist, c_twist, c_twist, a_twist );
	//colors.push(Math.random(), Math.random(), Math.random());
}
function twist(vec){
	var x = vec[0];
	var y = vec[1];
	//d= distance from origin
	var d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	//the rotated x position of this point:
	var x_rot = x*Math.cos(d*theta) - y*Math.sin(d*theta);
	//the rotated y position of this point:
	var y_rot = x*Math.sin(d*theta) + y*Math.cos(d*theta);

	var vec_rot = vec2(x_rot, y_rot);
//console.log("func twist: vec=" + vec + " x rot " + x_rot);
	return vec_rot;
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count === 0 ) {
	console.log("a=" + a + " b=" + b + " c=" + c );
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

	//ADD: include  middle triangles:
        divideTriangle( ab, ac, bc, count );
	
	//console.log("a=" + a + " b=" + b + " c=" + c + " count =" + count);
	//console.log("ab=" + ab + " bc=" + bc + " ac=" + ac + " count =" + count);
    }
}

function render()
{
    points = [];
    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, points.length );
    //gl.drawArrays( gl.TRIANGLES, 0, points.length );
    points = [];
}



