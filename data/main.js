//var x,y,z;


var rc;
var stateList = [];
var Socket;
var setTimeButton;
var d;
var displayTime = false;
var autoApplyToReal = false;
var autoRotate = false;

var rotationX = 0;
var rotationY = 0;
var rotationXDesired = 0;
var rotationYDesired = 0;


function initStateList()
{
  for (var i = 0; i < 512; i++)
  {
    stateList.push(0);
  }
}

function ClearData()
{
  for (var i = 0; i < 512; i++)
  {
    stateList[i] = 0;
  }
}


function setup() {
  try
  {
    Socket = new WebSocket('ws://' + window.location.hostname + ':81/');
  }
  catch (exception)
  {
    print(exception);
  }
  

  //createCanvas(400, 400);
  createCanvas(800,800,WEBGL);
  pixelDensity(1);
  initStateList();
  rc = createGraphics(800,800,WEBGL);
  rc.pixelDensity(1);
 rc.show();
 
 
 rc.style("position", "absolute");
 rc.style("top", "0");
 rc.style("opacity", "0.01");
//  rc.parent("hidden_opengl");
 button1 = createButton("Send data");
 button1.position(100, 19);
 button1.mousePressed(sendData);

 button2 = createButton("Clear");
 button2.position(200, 19);
 button2.mousePressed(ClearData);

  setTimeButton = createButton("Current time");
  setTimeButton.position(300, 19);
  setTimeButton.mousePressed(applyTimeToMatrix);


  upButton = createButton("UP");
  upButton.position(550, 60);
  upButton.size(60, 23);
  upButton.mousePressed(() => rotationYDesired = 0.03);
  upButton.mouseReleased(() => rotationYDesired = 0)

  downButton = createButton("DOWN");
  downButton.position(550, 85);
  downButton.size(60, 23)
  downButton.mousePressed(() => rotationYDesired = -0.03);
  downButton.mouseReleased(() => rotationYDesired = 0)

  rightButton = createButton("RIGHT");
  rightButton.position(613, 85);
  rightButton.size(60, 23)
  rightButton.mousePressed(() => rotationXDesired = 0.03);
  rightButton.mouseReleased(() => rotationXDesired = 0)


  leftButton = createButton("LEFT");
  leftButton.position(487, 85);
  leftButton.size(60, 23)
  leftButton.mousePressed(() => rotationXDesired = -0.03);
  leftButton.mouseReleased(() => rotationXDesired = 0)

 
    checkbox1 = createCheckbox('Display time', false);
    checkbox1.position(400, 19);
    checkbox1.changed(myCheckedEvent1);
    checkbox2 = createCheckbox('Auto send Data', false);
    checkbox2.position(510, 19);
    checkbox2.changed(myCheckedEvent2);
    checkbox3 = createCheckbox('Auto rotate', false);
    checkbox3.position(630, 19);
    checkbox3.changed(myCheckedEvent3);


    setInterval(timeLoop, 100);
}

function timeLoop()
{
  d = new Date();
  setTimeButton.elt.innerHTML = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  if (displayTime)
  {
    applyTimeToMatrix();
  }
}

function myCheckedEvent1() {
  if (this.checked()) {
    displayTime = true;
  } else {
    displayTime = false;
  }
}

function myCheckedEvent2() {
  if (this.checked()) {
    autoApplyToReal = true;
  } else {
    autoApplyToReal = false;
  }
}

function myCheckedEvent3() {
  if (this.checked()) {
    autoRotate = true;
  } else {
    autoRotate = false;
  }
}




function numberToLayer(number)
{
  if (number == 0)
  {
    return ([0,0,1,1,1,1,0,0,
             0,1,1,1,1,1,1,0,
             0,1,1,0,0,1,1,0,
             0,1,1,0,0,1,1,0,
             0,1,1,0,0,1,1,0,
             0,1,1,0,0,1,1,0,
             0,1,1,1,1,1,1,0,
             0,0,1,1,1,1,0,0]);
  }
  else if (number == 1)
  {
    return ([0,0,0,1,1,0,0,0,
             0,0,1,1,1,0,0,0,
             0,1,1,1,1,0,0,0,
             0,1,0,1,1,0,0,0,
             0,0,0,1,1,0,0,0,
             0,0,0,1,1,0,0,0,
             0,1,1,1,1,1,1,0,
             0,1,1,1,1,1,1,0]);
  }
  else if (number == 2)
  {
    return ([0,0,1,1,1,1,0,0,
             0,1,1,1,1,1,1,0,
             0,1,0,0,1,1,1,0,
             0,0,0,0,0,1,1,0,
             0,0,0,0,1,1,0,0,
             0,0,0,1,1,0,0,0,
             0,1,1,1,1,1,1,0,
             0,1,1,1,1,1,1,0]);
  }
  else if (number == 3)
  {
    return ([0,1,1,1,1,1,0,0,
             0,1,1,1,1,1,1,0,
             0,0,0,0,0,1,1,0,
             0,0,1,1,1,1,0,0,
             0,0,1,1,1,1,0,0,
             0,0,0,0,0,1,1,0,
             0,1,1,1,1,1,1,0,
             0,1,1,1,1,1,0,0]);
  }
  else if (number == 4)
  {
    return ([0,0,0,0,1,1,0,0,
             0,0,0,1,1,0,0,0,
             0,0,1,1,0,0,0,0,
             0,1,1,0,0,0,0,0,
             0,1,1,1,1,1,1,0,
             0,1,1,1,1,1,1,0,
             0,0,0,0,1,1,0,0,
             0,0,0,0,1,1,0,0]);
  }
  else if (number == 5)
  {
    return ([0,1,1,1,1,1,1,0,
             0,1,1,1,1,1,1,0,
             0,1,1,0,0,0,0,0,
             0,1,1,1,1,1,0,0,
             0,1,1,1,1,1,1,0,
             0,0,0,0,0,1,1,0,
             0,1,1,1,1,1,1,0,
             0,1,1,1,1,1,0,0]);
  }
  else if (number == 6)
  {
    return ([0,0,1,1,1,1,1,0,
             0,1,1,1,1,1,1,0,
             0,1,1,0,0,0,0,0,
             0,1,1,1,1,1,0,0,
             0,1,1,1,1,1,1,0,
             0,1,1,0,0,1,1,0,
             0,1,1,1,1,1,1,0,
             0,0,1,1,1,1,0,0]);
  }
  else if (number == 7)
  {
    return ([0,1,1,1,1,1,1,0,
             0,1,1,1,1,1,1,0,
             0,0,0,0,0,1,1,0,
             0,0,0,0,1,1,0,0,
             0,0,0,0,1,1,0,0,
             0,0,0,1,1,0,0,0,
             0,0,0,1,1,0,0,0,
             0,0,0,1,1,0,0,0]);
  }
  else if (number == 8)
  {
    return ([0,0,1,1,1,1,0,0,
             0,1,1,1,1,1,1,0,
             0,1,1,0,0,1,1,0,
             0,1,1,1,1,1,1,0,
             0,1,1,1,1,1,1,0,
             0,1,1,0,0,1,1,0,
             0,1,1,1,1,1,1,0,
             0,0,1,1,1,1,0,0]);
  }
  else if (number == 9)
  {
    return ([0,0,1,1,1,1,0,0,
             0,1,1,1,1,1,1,0,
             0,1,1,0,0,1,1,0,
             0,1,1,1,1,1,1,0,
             0,0,1,1,1,1,1,0,
             0,0,0,0,0,1,1,0,
             0,1,1,1,1,1,1,0,
             0,1,1,1,1,1,0,0]);
  }
  else
  {
    return ([0,0,0,0,0,0,0,0,
             0,0,0,1,1,0,0,0,
             0,0,0,1,1,0,0,0,
             0,0,0,0,0,0,0,0,
             0,0,0,0,0,0,0,0,
             0,0,0,1,1,0,0,0,
             0,0,0,1,1,0,0,0,
             0,0,0,0,0,0,0,0]);
  }
}

function applyNumberToMatrix(layerIndex, number)
{
  var layerNumber = numberToLayer(number);
  var startingNumber = 1 + 64 * layerIndex;
  for (var i = 0; i < 64; i++)
  {
    stateList[i + startingNumber - 1] = layerNumber[i];
  }
}


var oldTimeState = -1;

function applyTimeToMatrix()
{
  //var startingNumber = 65;
  //var layerNumber = numberToLayer(9);
  ClearData();
  var state = (d.getSeconds() % 20) * 3 + (Math.floor(d.getMilliseconds()/300));
  print("state :"+ state);
  if (state < 8)
  {
    print("test H :"+ Math.floor(d.getHours()/10));
    applyNumberToMatrix(state, Math.floor(d.getHours()/10));
  }
  else if (state < 16)
  {
    print("test HH:"+ d.getHours()%10);
    applyNumberToMatrix(state % 8, d.getHours() % 10);
  }
  else if (state < 24)
  {
    print("test :"+ -1);
    applyNumberToMatrix(state % 8, -1);
  }
  else if (state < 32)
  {
    print("test mm:"+ Math.floor(d.getMinutes()/10));
    applyNumberToMatrix(state % 8, Math.floor(d.getMinutes()/10));
  }
  else if (state < 40)
  {
    print("test mm:"+ d.getMinutes()%10);
    applyNumberToMatrix(state % 8, d.getMinutes()%10);
  }
  if (oldTimeState != state && autoApplyToReal)
  {
    sendData();
  }
  oldTimeState = state;


}

var matrixSize = 20; 
var ledSize = 7;

function sendData()
{
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
    if (Socket)
    {
      Socket.send(output);
    }

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




  rc.rotateX(rotationY);
  rc.rotateY(rotationX);
 
 
    // else
  // {
  //   rc.rotateX(0);
  //   rc.rotateY(0);
  // }

  
  rc.translate(matrixSize * -4,
            matrixSize * -4,
            matrixSize * 4);
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
                -matrixSize);
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
  if (autoApplyToReal)
  {
    sendData();
  }
}

function draw() {
  if (autoRotate)
  {
    rotationX += deltaTime * 0.0005;
    rotationY += deltaTime * 0.0005;
  }
  else
  {
    rotationX += rotationXDesired;
    rotationY += rotationYDesired;
  }
  resetMatrix();

  
  drawRayCastingBuffer();
  background(255);
  translate(0, 0, -300)

  // rotateX(millis() * 0.0005);
  // rotateY(millis() * 0.0005);
  
  
  rotateX(rotationY);
  rotateY(rotationX);
  
  translate(matrixSize * -4,
            matrixSize * -4,
            matrixSize * 4);
  
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
            if (stateList[number - 1] == 1)
            {
              fill('#ff3c3c');
            }
            else
            {
              fill('#ff5b5b')
            }
          }
          else if (stateList[number - 1] == 1)
          {
            fill('#ff0000');
          }
          else
          {
            noFill();
            strokeWeight(0.5);
            // fill('white');
          }
          
            box(ledSize);
          translate(matrixSize, 0, 0);
          number++;
        }
        translate(matrixSize * -8,
                  matrixSize, 0);    
      }
    
      translate(0, matrixSize * -8,
                -matrixSize);
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
  // gl.clear();

	var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
	gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	return (pixels);
}
