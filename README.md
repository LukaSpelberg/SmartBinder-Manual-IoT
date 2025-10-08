# SmartBinder-Manual-IoT

## Introduction 
For this manual I'll guide you through the process of connecting your ESP8266 board to a database and ultimately to the app, to make your card collection transition seamlessly from physical to digital! We will make use of ArduinoIDE to write the code for the board, and then also make a simple app to see & track all your cards. This guide will also cover potential errors you could experience. This way we will all finish this guide with the same end result, no matter your level of coding skills! So lets start off with the parts you will need. 

## Parts. 
For this guide we will use the following items
- A nodeMCU esp8266 board.
- A LEDstrip
- [Arduino IDE](https://www.arduino.cc/en/software)
- A button module

## Step 1 - Set up 
In this step we will set up your ESP8266 board so every sensor is attached correctly. We'll start with the **LED strip**. Attaching the strip should be easy. Attach the **yellow** cable to **D1**, the **red** one to **3V** and the **black** one on **G**. 

<img width="500" alt="image" src="https://github.com/user-attachments/assets/a0731280-52d7-42e3-a33f-9091c6f67985" />

Now the only thing left is to attach the **button module**.
The button module has 3 pins, the left one says **"VCC"** The middle one **"OUT"** and the right one **"GND"**. Attach the VCC pin to **3V**. Attach the OUT to **D0**, and lastly attach GND to **G**.
<br>**⚠️Heads up!** Dont attach your **VCC** pin to a 5V pin. This could cause damage to your hardware. </br>


Once you have connected the **LEDstrip** & **the button module** you are good to go!
<br>Now that we are done with the physical part of the setup, its time to move on to the technical part. Open **Arduino IDE**, in this program we'll first need to make sure that it recognizes your board before you can send code to it. 
<br>Attach your board via cable to your computer so its connected. Then, go to tools > board > ESP8266 > **NodeMCU 1.0 (ESP-12E Module)**. You may need to scroll down in the last dropdown menu to find it. This will make the program recognize your board.
<br>Also make sure to select the correct **port**. Again, Tools > port > select your port. 
<br> **⚠️ If you get errors** relating to a port when you send code later down the line, make sure to try to switch the port number to a different one until it works!


## Step 2 - Creating a database


## Step 3 - Code for the ESP8266


## Step 4 - Code for the website.
