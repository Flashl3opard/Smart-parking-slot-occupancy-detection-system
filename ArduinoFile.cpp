#include <WiFi.h>
#include <WebServer.h>

// -------- WIFI CONFIG --------
const char* ssid = "<Your-Hotspot-SSID>";
const char* password = "<Your-Hotspot-Password>";

// -------- ULTRASONIC PINS --------
#define TRIG 5
#define ECHO 18

// Built-in LED for ESP32 (usually GPIO 2)
#define LED 2

WebServer server(80);

long duration;
int distance;

// -------- GET DISTANCE FUNCTION --------
int getDistance() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  duration = pulseIn(ECHO, HIGH);
  int dist = duration * 0.034 / 2;
  return dist;
}

// -------- API HANDLER --------
void handleDistance() {
  int dist = getDistance();

  // LED trigger logic
  if (dist < 20) {
    digitalWrite(LED, HIGH);  // LED ON
  } else {
    digitalWrite(LED, LOW);   // LED OFF
  }

  // ------------- CORS FIX -------------
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Headers", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  // For OPTIONS preflight
  if (server.method() == HTTP_OPTIONS) {
    server.send(200);
    return;
  }
  // ------------------------------------

  // Send JSON response
  String json = "{\"distance\": " + String(dist) + "}";
  server.send(200, "application/json", json);
}

// -------- SETUP --------
void setup() {
  Serial.begin(115200);

  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  pinMode(LED, OUTPUT);
  digitalWrite(LED, LOW);

  // Connect WiFi
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected!");
  Serial.print("ESP32 IP: ");
  Serial.println(WiFi.localIP());

  // Route
  server.on("/distance", handleDistance);
  server.begin();

  Serial.println("HTTP Server started...");
}

// -------- LOOP --------
void loop() {
  server.handleClient();
}
