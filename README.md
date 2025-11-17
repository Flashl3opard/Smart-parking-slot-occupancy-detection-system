# 🅿️ Parking Slot Detection System

A simple and efficient **IoT-based parking slot detection system** using **ESP8266 + Ultrasonic Sensor + Next.js UI**.  
The system detects whether a car is present in the slot and updates the UI in real-time.

---

## 📸 Project Preview

- Shows **IMG3 / IMG4** based on distance
- Manual override mode
- Floating circular icon buttons
- ESP updates distance every 500ms
- Clean UI + Real-time feed

---

# ✅ Features

- Real-time ultrasonic distance detection
- Automatic image switching
- Manual control override
- ESP8266 REST API (`/distance`) endpoint
- Clean modern UI
- Accepts dynamic IP address input
- Fully responsive web interface

---

# 📦 Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd <project-folder>

in cmd: `npm install` and `npm run dev`
The project will be live at:
👉 `http://localhost:3000`
```

🛠️ Circuit Diagram

Connections (ESP8266 + HC-SR04):

Sensor Pin ESP8266 Pin
VCC - 3.3V / Vin
GND - GND
TRIG - D5 (GPIO 14)
ECHO - D6 (GPIO 12)

Arduino Code (Upload to ESP8266)

```
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";

ESP8266WebServer server(80);

#define TRIG D5
#define ECHO D6

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);

  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");
  Serial.println(WiFi.localIP());

  server.on("/distance", []() {
    long duration;
    digitalWrite(TRIG, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG, LOW);

    duration = pulseIn(ECHO, HIGH);
    int distance = duration * 0.034 / 2;

    String json = "{\"distance\": " + String(distance) + "}";
    server.send(200, "application/json", json);
  });

  server.begin();
}

void loop() {
  server.handleClient();
}
```

🌐 Getting the ESP8266 IP Address

Upload the Arduino code

Open Serial Monitor (115200 baud)

Reset the ESP8266

Look for:

```
Connected!
192.168.x.x
```

## 💻 Using the Next.js Dashboard

- Start the Next.js app
- Enter the ESP8266 IP in the input box
- Click Connect
- UI loads with real-time image switching
- Manual override button lets you toggle manually
- Floating circular icon buttons for control
