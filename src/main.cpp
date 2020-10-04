#include <Arduino.h>
#include "user_interface.h"// for os_timer
#include "FS.h"// for open file on flash


#include <WebSocketsServer.h>// Socket server library in 'lib' folder
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#define TIMER_UPDATE 5000

os_timer_t myTimer;
const char* ssid = "Livebox-75C0";
const char* password = "ipW2j3EzJQg6LF9Er6";

#define D0 16
#define D1 5
#define D2 4
#define D3 0
#define D4 2
#define D5 14
#define D6 12
#define D7 13

WebSocketsServer webSocket = WebSocketsServer(81);
ESP8266WebServer server(80);

const char* wl_status_to_string(int ah) {
	switch (ah) {
		case WL_NO_SHIELD: return "WL_NO_SHIELD";
		case WL_IDLE_STATUS: return "WL_IDLE_STATUS";
		case WL_NO_SSID_AVAIL: return "WL_NO_SSID_AVAIL";
		case WL_SCAN_COMPLETED: return "WL_SCAN_COMPLETED";
		case WL_CONNECTED: return "WL_CONNECTED";
		case WL_CONNECT_FAILED: return "WL_CONNECT_FAILED";
		case WL_CONNECTION_LOST: return "WL_CONNECTION_LOST";
		case WL_DISCONNECTED: return "WL_DISCONNECTED";
		default: return "ERROR NOT VALID WL";
	}
}


const String matrix_3d = "[data] \
{\
	{{1, 1, 1, 1, 1, 1, 1, 1},\
	{1, 0, 0, 0, 0, 0, 0, 1},\
	{1, 0, 0, 0, 0, 0, 0, 1},\
	{1, 0, 0, 0, 0, 0, 0, 1},\
	{1, 0, 0, 0, 0, 0, 0, 1},\
	{1, 0, 0, 0, 0, 0, 0, 1},\
	{1, 0, 0, 0, 0, 0, 0, 1},\
	{1, 1, 1, 1, 1, 1, 1, 1}},\
\
	{{1, 0, 0, 0, 0, 0, 0, 1},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{1, 0, 0, 0, 0, 0, 0, 1}},\
\
	{{1, 0, 0, 0, 0, 0, 0, 1},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{1, 0, 0, 0, 0, 0, 0, 1}},\
\
	{{1, 0, 0, 0, 0, 0, 0, 1},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{1, 0, 0, 0, 0, 0, 0, 1}},\
\
	{{1, 0, 0, 0, 0, 0, 0, 1},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{1, 0, 0, 0, 0, 0, 0, 1}},\
\
	{{1, 0, 0, 0, 0, 0, 0, 1},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{1, 0, 0, 0, 0, 0, 0, 1}},\
\
	{{1, 0, 0, 0, 0, 0, 0, 1},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{0, 0, 0, 0, 0, 0, 0, 0},\
	{1, 0, 0, 0, 0, 0, 0, 1}},\
\
	{{1, 1, 1, 1, 1, 1, 1, 1},\
	{1, 0, 0, 0, 0, 0, 0, 1},\
	{1, 0, 0, 0, 0, 0, 0, 1},\
	{1, 0, 0, 0, 0, 0, 0, 1},\
	{1, 0, 0, 0, 0, 0, 0, 1},\
	{1, 0, 0, 0, 0, 0, 0, 1},\
	{1, 0, 0, 0, 0, 0, 0, 1},\
	{1, 1, 1, 1, 1, 1, 1, 1}},\
}\
";

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length){
	if (type == WStype_TEXT)
	{
		for(size_t i = 0; i < length; i++)
		{
			Serial.print((char) payload[i]);
		}
		Serial.println();
	}
}

void fixedLoop(void *pArg)// delay function didnt work in this scope
{
	// String sensorValue =  String(analogRead(A0)) + ", " ;
	// char sendValue[sensorValue.length() + 1];
	// sensorValue.toCharArray(sendValue, sensorValue.length() + 1);
	// webSocket.broadcastTXT(sendValue, sensorValue.length());

	// delay(5000);

	// Serial.println(matrix_3d);



}

void setup() {
	Serial.setTimeout(10);
	Serial.begin(115200);
  WiFi.begin(ssid, password);

  uint64_t timeStamp = millis();
	while (WiFi.status() != WL_CONNECTED)
	{
		if(millis() - timeStamp > 10000)
		{
			ESP.restart();
			Serial.println("restarting");
			
		}
		delay(500);
		Serial.println(wl_status_to_string(WiFi.status()));
	}
	Serial.println("");
	Serial.print("Connected to ");
	Serial.println(ssid);
	Serial.print("IP address: ");
	Serial.println(WiFi.localIP());

	SPIFFS.begin();

	server.serveStatic("/", SPIFFS, "/index.html");
	server.serveStatic("/main.js", SPIFFS, "/main.js");
	server.serveStatic("/main.css", SPIFFS, "/main.css");


	// server.on("/", [](){
	// server.send(200, "text/html", WebPage);
	// });


	if (!MDNS.begin("matrix"))
	{
	Serial.println("dns error");
	}
	else
	{
	Serial.println("dns ok");
	}
	server.begin();

	webSocket.begin();
	webSocket.onEvent(webSocketEvent);

	os_timer_setfn(&myTimer, fixedLoop, NULL);
	os_timer_arm(&myTimer, TIMER_UPDATE, true);


  // put your setup code here, to run once:
}

/*
void loop() {
	Serial.println(matrix_3d);
	delay(5000);
}
*/


void loop() {
	MDNS.update();
	webSocket.loop();
	server.handleClient();
	

	if (Serial.available() > 0){
		char c[] = {(char)Serial.read()};
		webSocket.broadcastTXT(c, sizeof(c));
	}
}