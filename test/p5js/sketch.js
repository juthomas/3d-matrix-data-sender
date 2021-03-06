//var x,y,z;


var rc;
var stateList = [];
var Socket;

function initStateList()
{
  for (var i = 0; i < 512; i++)
  {
    stateList.push(0);
  }
}

function setup() {
  Socket = new WebSocket('ws://' + window.location.hostname + ':81/');
  //createCanvas(400, 400);
  createCanvas(400,400,WEBGL);
  pixelDensity(1);
  initStateList();
  rc = createGraphics(400,400,WEBGL);
  rc.pixelDensity(1);
 rc.show();
 rc.style("display", "inline");
 button = createButton("Send data");
 button.position(150, 19);
 button.mousePressed(sendData);
}

var matrixSize = 20; 
var ledSize = 7;

function sendData(){
  var output = "[data]{"
  var number = 1;
  for (var z = 0; z < 8; z++)
  {
      output += "{";
      for (var y = 0; y < 8; y++)
      {
       output += "{";

        for (var x = 0; x < 8; x++)
        {
          output += stateList[number - 1].toString();
          number++;
        }
        output += "}";
      }
      output += "}";
    }
    output += "}";
    print(output);
    Socket.send(output);
}

function numberToHexaColor(rgb)
{
    var hex = Number(rgb).toString(16);
    while (hex.length < 6)
    {
        hex = "0" + hex;
    }
    return ("#" + hex);
}

function drawRayCastingBuffer()
{
  rc.resetMatrix();
  rc.background(255);
  rc.translate(0, 0, -300)
  rc.rotateX(millis() * 0.0005);
  rc.rotateY(millis() * 0.0005);
  
  
  rc.translate(matrixSize * -4,
            matrixSize * -4,
            matrixSize * -4);
  rc.noStroke();
  var number = 1;
  for (var z = 0; z < 8; z++)
  {
      
      for (var y = 0; y < 8; y++)
      {
        for (var x = 0; x < 8; x++)
        {
            rc.fill(numberToHexaColor(number));
          //print(numberToHexaColor(number));
          rc.box(ledSize);
          rc.translate(matrixSize, 0, 0);
          number += 1;
        }
        rc.translate(matrixSize * -8,
                  matrixSize, 0);    
      }
    
      rc.translate(0, matrixSize * -8,
                matrixSize);
  }
}

var pointedObj;

function mousePressed()
{
  print("clic");
  pointedObj
  print(pointedObj);
  if (pointedObj > 0)
  {
    print("Yes");
    stateList[pointedObj - 1] = stateList[pointedObj - 1] == 1 ? 0 : 1;
  }
}

function draw() {
  resetMatrix();
  drawRayCastingBuffer();
  background(255);
  translate(0, 0, -300)
  rotateX(millis() * 0.0005);
  rotateY(millis() * 0.0005);
  
  
  translate(matrixSize * -4,
            matrixSize * -4,
            matrixSize * -4);
  
  var mouseObj = getObject(mouseX, mouseY);
  pointedObj = mouseObj;

  //print(mouseObj);
  
  var number = 1;
  for (var z = 0; z < 8; z++)
  {
      
      for (var y = 0; y < 8; y++)
      {
        for (var x = 0; x < 8; x++)
        {
          if (number == mouseObj)
          {
            fill('pink');
          }
          else if (stateList[number - 1] == 1)
          {
            fill('red');
          }
          else
          {
            fill('white');
          }
          
            box(ledSize);
          translate(matrixSize, 0, 0);
          number++;
        }
        translate(matrixSize * -8,
                  matrixSize, 0);    
      }
    
      translate(0, matrixSize * -8,
                matrixSize);
  }


}

function colorArrayToNumber(col)
{
    var number = col[0] * 256 * 256;
    number += col[1] * 256;
    number +=col[2];
    return (number);

}

function getObject(mx, my)
{
    if (mx > width || my > height) {
		return 0;
	}
	var gl = rc.elt.getContext('webgl');
    var pix = getPixels();
	var index = 4 * ((gl.drawingBufferHeight-my) * gl.drawingBufferWidth + mx);
    	var col = [
		pix[index + 0],
		pix[index + 1],
		pix[index + 2],
		pix[index + 3]];
//	return cor;
    
    //print(colorArrayToNumber(col));
    return (colorArrayToNumber(col) > 512 ? -1 : colorArrayToNumber(col));
}

function getPixels() {
	var gl = rc.elt.getContext('webgl');
	var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
	gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	return (pixels);
}
