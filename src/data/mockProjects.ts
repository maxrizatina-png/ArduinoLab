import { Project } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Joystick-Controlled LEDs',
    image: 'https://picsum.photos/seed/joyled/400/300',
    difficulty: 'Easy',
    description:
      'Control four LEDs with a joystick module. The joystick X and Y axes map to different LEDs, making this a great introduction to analog input and digital output on the Arduino UNO.',
    instructions: `Materials:
- Arduino UNO
- Joystick module (KY-023)
- 4x LEDs (any color)
- 4x 220Ω resistors
- Breadboard + jumper wires

Steps:
1. Connect joystick VCC → 5V, GND → GND, VRx → A0, VRy → A1.
2. Connect each LED anode through a 220Ω resistor to pins 8, 9, 10, 11.
3. Connect all LED cathodes to GND.
4. Upload the code and tilt the joystick to light up different LEDs.`,
    arduinoCode: `int joyX = A0;
int joyY = A1;

int ledUp    = 8;
int ledDown  = 9;
int ledLeft  = 10;
int ledRight = 11;

void setup() {
  pinMode(ledUp,    OUTPUT);
  pinMode(ledDown,  OUTPUT);
  pinMode(ledLeft,  OUTPUT);
  pinMode(ledRight, OUTPUT);
}

void loop() {
  int x = analogRead(joyX);
  int y = analogRead(joyY);

  digitalWrite(ledUp,    y < 300 ? HIGH : LOW);
  digitalWrite(ledDown,  y > 700 ? HIGH : LOW);
  digitalWrite(ledLeft,  x < 300 ? HIGH : LOW);
  digitalWrite(ledRight, x > 700 ? HIGH : LOW);

  delay(100);
}`,
    classCode: 'ARD101',
  },
  {
    id: '2',
    title: 'I2C LCD Display',
    image: 'https://picsum.photos/seed/lcddisplay/400/300',
    difficulty: 'Easy',
    description:
      'Display custom text on a 16×2 LCD using the I2C protocol. I2C reduces the wiring from 16 pins down to just 4, making it much easier to connect to the Arduino.',
    instructions: `Materials:
- Arduino UNO
- 16×2 LCD with I2C backpack module
- Jumper wires

Steps:
1. Connect I2C LCD: VCC → 5V, GND → GND, SDA → A4, SCL → A5.
2. Open the Arduino Library Manager and install "LiquidCrystal I2C" by Frank de Brabander.
3. Upload the code below.
4. If the screen is blank, turn the contrast potentiometer on the I2C module until text appears.`,
    arduinoCode: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Number one");
  lcd.setCursor(0, 1);
  lcd.print("party anthem, oh");
}

void loop() {}`,
    youtubeVideoId: 'dQw4w9WgXcQ',
    youtubeAuthor: 'Riza Max',
    classCode: 'ARD102',
  },
  {
    id: '3',
    title: 'Distance Measuring Sensor',
    image: 'https://picsum.photos/seed/ultrason/400/300',
    difficulty: 'Easy',
    description:
      'Measure distances in real time with an HC-SR04 ultrasonic sensor and display the result on an I2C LCD. A perfect project for learning how ultrasonic ranging works.',
    instructions: `Materials:
- Arduino UNO
- HC-SR04 ultrasonic sensor
- 16×2 LCD with I2C backpack
- Breadboard + jumper wires

Steps:
1. HC-SR04: VCC → 5V, GND → GND, TRIG → pin 9, ECHO → pin 10.
2. I2C LCD: VCC → 5V, GND → GND, SDA → A4, SCL → A5.
3. Install the LiquidCrystal_I2C library.
4. Upload the code and point the sensor at objects to see live distance readings.`,
    wiringDiagram: 'https://picsum.photos/seed/ultrasonwire/600/400',
    arduinoCode: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
const int trigPin = 9;
const int echoPin = 10;

void setup() {
  lcd.init();
  lcd.backlight();
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long dur = pulseIn(echoPin, HIGH);
  float cm  = dur * 0.034 / 2.0;

  lcd.setCursor(0, 0);
  lcd.print("Target Distance:");
  lcd.setCursor(0, 1);
  lcd.print(cm, 1);
  lcd.print(" cm        ");

  delay(300);
}`,
    classCode: 'ARD103',
  },
  {
    id: '4',
    title: 'Simple Thermometer',
    image: 'https://picsum.photos/seed/thermom/400/300',
    difficulty: 'Easy',
    description:
      'Build a digital thermometer with a DS18B20 sensor and show live temperature in both Celsius and Fahrenheit on an I2C LCD.',
    instructions: `Materials:
- Arduino UNO
- DS18B20 temperature sensor
- 4.7 kΩ resistor (pull-up)
- 16×2 LCD with I2C backpack
- Breadboard + jumper wires

Steps:
1. DS18B20: VCC → 5V, GND → GND, Data → pin 2. Add 4.7 kΩ resistor between Data and 5V.
2. I2C LCD: VCC → 5V, GND → GND, SDA → A4, SCL → A5.
3. Install OneWire and DallasTemperature libraries.
4. Upload and watch the temperature update every second.`,
    wiringDiagram: 'https://picsum.photos/seed/thermowire/600/400',
    arduinoCode: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <OneWire.h>
#include <DallasTemperature.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
OneWire oneWire(2);
DallasTemperature sensors(&oneWire);

void setup() {
  lcd.init();
  lcd.backlight();
  sensors.begin();
}

void loop() {
  sensors.requestTemperatures();
  float c = sensors.getTempCByIndex(0);
  float f = c * 9.0 / 5.0 + 32.0;

  lcd.setCursor(0, 0);
  lcd.print("Now Temperature:");
  lcd.setCursor(0, 1);
  lcd.print(c, 1);
  lcd.print("C ");
  lcd.print(f, 1);
  lcd.print("F");

  delay(1000);
}`,
    classCode: 'ARD104',
  },
  {
    id: '5',
    title: 'Arduino Remote Controlled Car',
    image: 'https://picsum.photos/seed/rccar99/400/300',
    difficulty: 'Medium',
    description:
      'Build an IR-controlled 4-wheel car using an Arduino UNO, L298N motor driver, and KY-022 IR receiver. Four DC motors are powered by 18650 batteries. A standard TV remote controls direction. Perfect for learning how motor drivers and wireless signals work together.',
    instructions: `Materials:
- 4 wheels + 4 DC motors
- Arduino UNO
- L298N motor driver
- KY-022 IR receiver
- Remote control (any NEC IR remote)
- 4× 18650 lithium batteries + case
- Flat base (hard cardboard works great)
- Zip ties + jumper wires

Steps:
1. Build the chassis: attach 4 motors at the corners with zip ties.
2. Mount wheels on the motor shafts.
3. L298N ↔ Arduino: IN1→4, IN2→5, IN3→6, IN4→7.
4. Connect left motors to OUT1/OUT2, right motors to OUT3/OUT4.
5. Battery case (+) → L298N 12V, L298N 5V → Arduino VIN.
6. KY-022 data pin → Arduino pin 8, VCC → 5V, GND → GND.
7. Install IRremote library (v4+).
8. Upload the code. Press each directional button and note the hex code in Serial Monitor. Adjust CMD_* constants if needed.`,
    wiringDiagram: 'https://picsum.photos/seed/carwire/600/400',
    arduinoCode: `#include <IRremote.hpp>

const uint8_t IR_PIN = 8;

// L298N pins
const uint8_t IN1 = 4; // Left motor
const uint8_t IN2 = 5;
const uint8_t IN3 = 6; // Right motor
const uint8_t IN4 = 7;

// Remote codes (adjust ONLY if Serial shows different)
const uint32_t CMD_FWD   = 0x18; // 2
const uint32_t CMD_BACK  = 0x52; // 8
const uint32_t CMD_LEFT  = 0x10; // 4
const uint32_t CMD_RIGHT = 0x5A; // 6
const uint32_t CMD_STOP  = 0x1C; // 5

void setup() {
  Serial.begin(9600);
  IrReceiver.begin(IR_PIN, ENABLE_LED_FEEDBACK);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  stopMotors();
}

void loop() {
  if (IrReceiver.decode()) {
    uint32_t code = IrReceiver.decodedIRData.command;
    Serial.println(code, HEX);
    if      (code == CMD_FWD)   forward();
    else if (code == CMD_BACK)  backward();
    else if (code == CMD_LEFT)  turnLeft();
    else if (code == CMD_RIGHT) turnRight();
    else if (code == CMD_STOP)  stopMotors();
    IrReceiver.resume();
  }
}

void forward()    { m(HIGH,LOW,HIGH,LOW); }
void backward()   { m(LOW,HIGH,LOW,HIGH); }
void turnLeft()   { m(LOW,HIGH,HIGH,LOW); }
void turnRight()  { m(HIGH,LOW,LOW,HIGH); }
void stopMotors() { m(LOW,LOW,LOW,LOW);   }

void m(int a,int b,int c,int d){
  digitalWrite(IN1,a); digitalWrite(IN2,b);
  digitalWrite(IN3,c); digitalWrite(IN4,d);
}`,
    youtubeVideoId: 'dQw4w9WgXcQ',
    youtubeAuthor: 'Riza Max',
    classCode: 'ARD201',
  },
  {
    id: '6',
    title: 'LED Traffic Light',
    image: 'https://picsum.photos/seed/traffic8/400/300',
    difficulty: 'Easy',
    description:
      'Simulate a traffic light with three LEDs and a timed loop. A classic beginner project for learning digital output and the delay function.',
    instructions: `Materials:
- Arduino UNO
- Red, Yellow, Green LEDs
- 3× 220Ω resistors
- Breadboard + jumper wires

Steps:
1. Red LED anode → 220Ω → pin 11.
2. Yellow LED anode → 220Ω → pin 10.
3. Green LED anode → 220Ω → pin 9.
4. All cathodes → GND.
5. Upload and watch the light cycle!`,
    arduinoCode: `const int RED    = 11;
const int YELLOW = 10;
const int GREEN  = 9;

void setup() {
  pinMode(RED,    OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN,  OUTPUT);
}

void loop() {
  // Red
  set(HIGH, LOW, LOW); delay(5000);

  // Red + Yellow (prepare to go)
  set(HIGH, HIGH, LOW); delay(2000);

  // Green
  set(LOW, LOW, HIGH); delay(5000);

  // Yellow (prepare to stop)
  set(LOW, HIGH, LOW); delay(2000);
}

void set(int r, int y, int g) {
  digitalWrite(RED,    r);
  digitalWrite(YELLOW, y);
  digitalWrite(GREEN,  g);
}`,
    classCode: 'ARD105',
  },
  {
    id: '7',
    title: 'Servo Motor Control',
    image: 'https://picsum.photos/seed/servo42/400/300',
    difficulty: 'Easy',
    description:
      'Control a servo motor with a potentiometer. Rotate the knob to move the servo arm in real time — a building block for robotic arms and camera gimbals.',
    instructions: `Materials:
- Arduino UNO
- SG90 servo motor
- 10 kΩ potentiometer
- Breadboard + jumper wires

Steps:
1. Servo: signal (orange) → pin 9, VCC → 5V, GND → GND.
2. Potentiometer: outer pins → 5V and GND, middle pin → A0.
3. Upload the code.
4. Turn the potentiometer — the servo follows!`,
    arduinoCode: `#include <Servo.h>

Servo servo;
const int POT = A0;

void setup() {
  servo.attach(9);
}

void loop() {
  int raw = analogRead(POT);
  int angle = map(raw, 0, 1023, 0, 180);
  servo.write(angle);
  delay(15);
}`,
    classCode: 'ARD106',
  },
  {
    id: '8',
    title: 'Keypad Door Lock',
    image: 'https://picsum.photos/seed/keylock/400/300',
    difficulty: 'Medium',
    description:
      'Build a PIN-based door lock with a 4×4 membrane keypad and a servo motor. Enter the correct 4-digit code to unlock; wrong code triggers an LED warning.',
    instructions: `Materials:
- Arduino UNO
- 4×4 membrane keypad
- SG90 servo motor
- Red + Green LEDs
- 2× 220Ω resistors
- Breadboard + jumper wires

Steps:
1. Keypad rows → pins 2,3,4,5; columns → pins 6,7,8,9.
2. Servo signal → pin 10.
3. Green LED anode → 220Ω → pin 11; Red → pin 12.
4. Install the Keypad library by Mark Stanley.
5. Upload, enter 1234 to unlock, any other 4 digits triggers the red LED.`,
    wiringDiagram: 'https://picsum.photos/seed/lockwire/600/400',
    arduinoCode: `#include <Keypad.h>
#include <Servo.h>

const char* PASSWORD = "1234";
char input[5] = "";
int pos = 0;

Servo lock;

const byte ROWS = 4, COLS = 4;
char keys[ROWS][COLS] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};
byte rowPins[ROWS] = {2,3,4,5};
byte colPins[COLS] = {6,7,8,9};
Keypad kpad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

void setup() {
  lock.attach(10);
  lock.write(0); // locked
  pinMode(11, OUTPUT); // green
  pinMode(12, OUTPUT); // red
}

void loop() {
  char key = kpad.getKey();
  if (!key) return;
  if (pos < 4) input[pos++] = key;
  if (pos == 4) {
    input[4] = '\\0';
    if (strcmp(input, PASSWORD) == 0) {
      digitalWrite(11, HIGH);
      lock.write(90); delay(3000);
      lock.write(0);
      digitalWrite(11, LOW);
    } else {
      digitalWrite(12, HIGH); delay(1000); digitalWrite(12, LOW);
    }
    pos = 0; memset(input, 0, sizeof(input));
  }
}`,
    classCode: 'ARD202',
  },
];
