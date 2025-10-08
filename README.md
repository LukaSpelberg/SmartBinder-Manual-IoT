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
>**⚠️Heads up!** Dont attach your **VCC** pin to a 5V pin. This could cause damage to your hardware. </br>


Once you have connected the **LEDstrip** & **the button module** you are good to go!
<br>Now that we are done with the physical part of the setup, its time to move on to the technical part. Open **Arduino IDE**, in this program we'll first need to make sure that it recognizes your board before you can send code to it. 
<br>Attach your board via cable to your computer so its connected. Then, go to tools > board > ESP8266 > **NodeMCU 1.0 (ESP-12E Module)**. You may need to scroll down in the last dropdown menu to find it. This will make the program recognize your board.
<br>Also make sure to select the correct **port**. Again, Tools > port > select your port. 
>**⚠️ If you get errors** relating to a port when you send code later down the line, make sure to try to switch the port number to a different one until it works!


## Step 2 - Creating a database
Next, we will set up our database using **MongoDB**. MongoDB is a free online platform where you can store all sorts of data. This will be of use for us in this guide because we will want to store when a card gets scanned in the binder, to then send that data from the database to the app. So the connection we will make is from the **ESP8266** to the **Database** to the **website**. To archieve this, you will first need to make a [mongoDB account.](https://www.mongodb.com/cloud/atlas/register) 
If you are new to mongodb, you will get the screen below. If you already have an account, you can skip this step. Simply make a new **project** in your organisation page. 
For our guide we can do with the free version. Make sure to untick "preloading a **sample dataset**" as we won't need that. Also, I recommend always setting your database region to **Frankfurt**, or any other city from the EU. This will make sure that your data always falls under European data protection laws. 
<img width="2493" height="1211" alt="image" src="https://github.com/user-attachments/assets/a0dda43d-dd0a-43f9-ad34-15a74f054945" />

Now that we've activated our database, its time to do 2 things! First, we will set up the **database access**. When you have your new project open, there is a sidebar on the left hand side. Under the tab **security** is "database access". Click on that and then "**add database user**" In this screen you'll want to create a memorable username and Password. **Note these down** somewhere as we will use them later on. Scroll a bit down till you see "**built-in roles**". Click on that and make the user an **Atlas admin**. And thats it! click add user and you are good to go.

Now, we will still stay in the security tab, but this time move on to "**network access**". Click on the add IP adress button, and then "**Add current IP adress**". Hit confirm and we are practically done with step 2 already!
>**⚠️Important note** MongoDB works in a very secure way, by only allowing certain IP addresses to utilize the database. This security can sometimes come as an unpleasant suprise when you dont understand why the code is not working. If you are getting error messages later in this guide, always **check** if your current **IP adress is added** in this network tab!.




## Step 3 - Code for the ESP8266


## Step 4 - Code for the website.
