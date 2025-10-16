# SmartBinder-Manual-IoT

## Introduction 
For this manual I'll guide you through the process of connecting your ESP8266 board to a database and ultimately to the app, to make your card collection transition seamlessly from physical to digital! We will make use of ArduinoIDE to write the code for the board, and then also make a simple app to see & track all your cards. This guide will also cover potential errors you could experience. This way we will all finish this guide with the same end result, no matter your level of coding skills! So lets start off with the parts you will need. 

## Parts. 
For this guide we will use the following items
- A nodeMCU esp8266 board.
- A LEDstrip
- [Arduino IDE](https://www.arduino.cc/en/software)
- A button module

## Table of contents 
[Step 1 - Set up](#step-1---set-up)
<br>[Step 2 - Creating a database](#step-2---creating-a-database)
<br>[Step 3 - Creating an API for the ESP8266](step-3---creating-an-api-for-the-esp8266)
<br>[Step 3.1 - Hosting the API](#step-31-hosting-the-code)
<br>[Step 4 - Code for the ESP8266](#step-4---code-for-the-esp8266)
<br>[Step 5 - Code for the webapp](#step-5---code-for-the-website)

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
![Frame 20](https://github.com/user-attachments/assets/124f080a-7ace-4fe8-a955-1b1625d8b5dd)


Now that we've activated our database, its time to do 2 things! First, we will set up the **database access**. When you have your new project open, there is a sidebar on the left hand side. Under the tab **security** is "database access". Click on that and then "**add database user**" In this screen you'll want to create a memorable username and Password. **Note these down** somewhere as we will use them later on. Scroll a bit down till you see "**built-in roles**". Click on that and make the user an **Atlas admin**. And thats it! click add user and you are good to go.

Now, we will still stay in the security tab, but this time move on to "**network access**". Click on the add IP adress button, and then "**Add current IP adress**". Hit confirm and we are practically done with step 2 already!
>**⚠️Important note** MongoDB works in a very secure way, by only allowing certain IP addresses to utilize the database. This security can sometimes come as an unpleasant suprise when you dont understand why the code is not working. If you are getting error messages later in this guide, always **check** if your current **IP adress is added** in this network tab!.

## Step 3 - Creating an API for the ESP8266
Next, we will make an API for the ESP8266. The reason we're doing this is so that the board gets a point where it can send **data** to. I've tried to do this in MongoDB, but sadly, they decided to end their service of offering **HTTP endpoints** in september 2025. That means that the easy way wont be working for us! (thanks mongoDB) So lets dive into a more manual way, but also a bit more complicated. I will try to explain it as clearly as possible, so there wont arise any confusion while following this guide! What we're going to do is make our very own **API**. We will do this with the [official documentation](https://www.mongodb.com/docs/atlas/app-services/data-api/migration/data-api-tutorial/#std-label-data-api-custom-express-alternative) by **mongoDB** themselves, but I will explain it more thorogouly in here, as we will also make a **few changes** to the **code** that they provide.

First of all, open your **IDE program**. I will use **VSC** but any should do, and **clone** the following **repository**. If you've never cloned something before, cloning essentially means that you download someone else his work locally on your computer. Cloning is basically a fancy word for downloading, and you do it in a fancy way aswell. You can clone a repository by opening **the folder** where you want the code to be **located**. Then you open your **terminal**, and paste this **message** in there. "git clone https://github.com/abhishekmongoDB/data-api-alternative.git" Once its done, **open** the **new folder** that you have, and once again open **the terminal**. This time we will **type** the following text into the terminal: **"npm install".** This will install all the **libraries** we need. <img width="2559" height="1366" alt="image" src="https://github.com/user-attachments/assets/ce42ddc3-c3e7-4691-a674-c1804fbe6cf2" />
Good job! thats the first part done. 
>⚠️You might need to log in with your **Github account** first. You will probably be prompted with a log-in screen if you try to clone something without being **signed in**. Make your account, and then **repeat the process** again.

Next we need to create a **new file**, look at the left side of your screen to see all your files, right click in the **blank part**, and choose "new file.." then name it **".env"**

>⚠️Make sure to **not** put anything **in front** of the dot for it to work properly. Also make sure that the file landed in the **root** of your folder! this means, that it does not show up in any of the **subfolders** like for example "routes" or "utils"
Navigate to your file, and paste the following inside of it.
```
# Replace with your deployment credentials
MONGO_URI="<MONGO_URI>"

# Replace with your locally defined secrets for basic proxy auth
API_KEY="<API_KEY>"
API_SECRET="<API_SECRET>"

# Project variables
PORT=7438
RATE_LIMIT_WINDOW_MS=900000 # 15 minutes in milliseconds
RATE_LIMIT_MAX=100 # Maximum requests per window
RATE_LIMIT_MESSAGE=Too many requests, please try again later.
```
You will need to **replace** a few of these things with your own **values**
**Replace** "<API_KEY>" & "<API_SECRET>"  with your own defined **Key & secrets**. Think of these as **passwords**, you can create them yourself, as they are just **for you**.
Next replace "<MONGO_URI>" with your **connection string**. This is an example of a connection string: mongodb+srv://USERNAME:PASSWORD@YOURCLUSTER.PROJECTID.mongodb.net. You can find your connection string by navigating to the **project overview** on mongoDB. Then click **connect** on your clusters. Choose **drivers** in the pop-up that appears, and copy the connection string.
![Frame 21](https://github.com/user-attachments/assets/785c2934-ed48-4dd9-92ff-bb6b1e296441)
 as you can see the connection string includes **the database user** we've made in the previous step. Use **your password** that you've noted down and **replace** it with the placeholder in the copied string. If you forgot your password you can always **create a new user**. Just don't forget to change the username aswell. Once you have yours, replace it with <MONGO_URI>!. 

Next, navigate to **utils** > **logging.js** in this file, delete this line ```new winston.transports.File({ filename: 'logs/api.log' })```  We need to delete this because it has conflicts with our hosting provider later in this guide. In short the official mongoDB documentation is build for Local use on your computer. You can't write a log to such a folder via a hosting provider.

Another change we have to make is in the **index.js** file. navigate to that file and then paste the following **code** below const app = express(); on line 13. ```app.set('trust proxy', true); ``` 
>⚠️We need to add this because vercel will otherwise give us the following **error message** "ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false (default). This could indicate a misconfiguration which would prevent express-rate-limit from accurately identifying users." This essentially means that a rate limit would occur before Vercel can detect whether the user has the correct credentials. If you are experiencing this error, then you need to add that line of code.

Once you have all that, its time to **commit** it to your **github profile**. navigate to the **branch icon** at the sidebar, and you will see the screen to commit your files. At first, you will probably see the commit button **greyed out**. This is because it still acts like the code is from the person that we've cloned it from. To **remove this**, we need to click the **3 dots > remote > remove remote**, like you see in the screenshot ![Frame 26](https://github.com/user-attachments/assets/23c255c0-92fa-4864-846b-1239badf762a)
 Now we can make our own repository, click **publish branch**, and choose **public** repository. Now that its commited we can move on to the next step, hosting!

### Step 3.1 Hosting the code.

For this step we will **host** our created **API**. The **reason** for this is that when we **run it locally**, it will use **localhost** as our link. The ESP8266 cant target this, because the localhost is, as the name implies local. It only runs on **your computer**. For this reason we need to use a **third party**, that hosts the API for us. For this tutorial I will choose **Vercel** as hosting provider. Create an **account** at [Vercel](https://vercel.com/signup) once you've made an account, in the overview, click on add **new project** ![Frame 22](https://github.com/user-attachments/assets/ec67d388-7cfc-466d-b93e-da6eca40914c)
 We will create a new project by **importing** our git repository, thats the reason why we commited the code to our profile. Click on github and **link vercel** to your account. Once connected, it will display all your repositories. Select **"data-api-alternative"**. Once selected you will see the create project screen. A very **important** thing is that we need to add the contents of our **.env file** here. You can do this in 2 ways: Adding the whole file, or pasting every single variable manually. Both work in our case. Once you have added your .env variables, click **deploy**! 
![Frame 25](https://github.com/user-attachments/assets/855069bb-05ea-4b95-8cc3-cf99bdf021fb)
Vercel will now start **building**, this can take a while. If you've followed the instructions correctly, then now the API should be able to **insert items**. You can test this
>⚠️ Most of the **errors** that can occur in this proces happen with the changes we make to the **cloned repository**. Make sure you've done all of them, as they are all **critical** for it to work. Another cause for errors could be that your **IP adress** isn't whitelisted. Check that mongoDB has your IP whitelisted for the **connection** to work. The last common cause could be that the **variables** from the .env file aren't properply imported. Check again that you have every single variable correctly written without spelling mistakes. Also check that your **connection string** matches with the password en username in your database user.

## Step 4 - Code for the ESP8266

Now, we are going to write the code for the ESP8266 board, so that it can mimick the experience of the actual SmartBinder. First of all, open your arduino IDE and click new sketch. Copy the code down below, this will be our foundation 
```
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
 #include <avr/power.h> // Required for 16 MHz Adafruit Trinket
#endif

#define BUTTON_PIN D0

#define PIN        D1 // On Trinket or Gemma, suggest changing this to 1

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS 12 // Popular NeoPixel ring size

Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

#define DELAYVAL 500 // Time (in milliseconds) to pause between pixels


// === CONFIGURATIE ===
char ssid[] = "WIFi/Hotspot name";         // Vul hier de naam van je WiFi in
char pass[] = "WIFI/hotspotPassword";  // Vul hier je WiFi-wachtwoord in


int pulses = 0;

WiFiClient client;

void setup() {
  #if defined(__AVR_ATtiny85__) && (F_CPU == 16000000)
  clock_prescale_set(clock_div_1);
#endif
  // END of Trinket-specific code.

  pinMode(BUTTON_PIN, INPUT);

  pixels.begin(); // INITIALIZE NeoPixel strip object (REQUIRED)

  Serial.begin(9600);
  while (!Serial) { ; }

  text.reserve(JSON_BUFF_DIMENSION);

  Serial.println("Verbinden met WiFi...");
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi verbonden!");

  
}



void loop() {

}
```

As always, there are a few things we need to change here. Lets start with the WiFi credentials. Under Configurate, you need to switch the placeholders with your hotspot credentials or wifi credentials. Thats for now the only thing we need to tweak. Now let's also look at adding things. First, we need to make some code with the ledstrip. I've made this with the help of this [guide](https://www.tweaking4all.com/hardware/arduino/adruino-led-strip-effects). If you are interested in playing more with your LEDStrip make sure to check out more of their stuff! We will be using parts of their Fade in/Fade out code. This is sadly made for a different type of LEDstrip than ours, so we need to tweak it a bit. 
Use this snippet and paste it ABOVE your void loop() 
```
void FadeInOut(byte red, byte green, byte blue){
  float r, g, b;
     
  for(int k = 0; k < 256; k=k+1) {
    r = (k/256.0)*red;
    g = (k/256.0)*green;
    b = (k/256.0)*blue;
    setAll(r,g,b);
    showStrip();
    delay(3);
  }
     
  for(int k = 255; k >= 0; k=k-2) {
    r = (k/256.0)*red;
    g = (k/256.0)*green;
    b = (k/256.0)*blue;
    setAll(r,g,b);
    showStrip();
    delay(3);
  }
}
```
Most of this code works nicely, but we need to change specifically how we set the colors on our LEDstrip and how we tell it to show them. These two lines are the culprits on both for loops: ```setAll(r,g,b); showStrip();`` Our ledstrip always wants us to define what the color of every pixel needs to be, in this code, they just casually ask it to set everything to one color, but thats not the correct Syntax. Also, showstrip is not the correct syntax for our ledstrip either. So what we're going to do is replace those lines in BOTH for loops. 
```
  for (int i = 0; i < NUMPIXELS; i++) {
    pixels.setPixelColor(i, pixels.Color(r, g, b));
      }
    pixels.show();
```
Copy this, and paste it. 
>⚠️ Make sure that you replace the lines for both the for loops. The FadeInOut consists of a forloop that makes the color fade in, and a forloop that makes the color fade out, its important that we adjust to both loops.

Now that we have the cool effect that we need for the LEDS, its time to implement our actual card interaction! 
I've written this code for that: 
```
 if (digitalRead(BUTTON_PIN) == HIGH) {
      while (pulses < 4) {
        fadeInOut(0xff, 0xff, 0xff);
        pulses = pulses + 1; 
      }
      for (int i = 0; i < NUMPIXELS; i++) {
        pixels.setPixelColor(i, pixels.Color(0, 150, 0));
      }
      pixels.show();

      delay(5000);
      pixels.clear();
      pixels.show();
      pulses = 0; 
    }
```
What this does if that when you press the button, it counts the amount of pulses it has done. If its below 4, it calls the cool LEDeffect we just added. After its 4, it switches to the green light to show you thats it's done. This way we're essentially mimicking a loading state. The fadein/out serves as the loading animation, and the green light shows that its done!

Next, we're going to make sure that the ESP8266 can send data to the API we made in the previous step. to make this work we need to make sure that the board can make an HTTPS POST request. This is a fancy word in code that basically means that you want to transfer a set of data to someplace. For this part of the code I have used [this guide](https://randomnerdtutorials.com/esp8266-nodemcu-http-get-post-arduino/#http-post) as help. Once again, if you are interested in more ESP8266 tutorials, this is the place to go. Especially for things that have to do with connecting to apps or the internet. 
>⚠️The problem with this guide is that it wants us to write an HTTP request. Apparantly i have been disproven and you can actually send HTTP requests instead of HTTPS requests to your API. But that doesn't matter, HTTPS is cooler anyways. The issue is that we can't follow this guide step by step and need to make a few tweaks ourselfs, but thats okay.

First go to the top of your file and remove "#include <ESP8266WiFi.h>" Instead include these 2 libraries instead, #include <WiFiClientSecure.h> #include <ESP8266HTTPClient.h>. As i've said above, there are a lot of issues that arise when you are trying to send HTTPS requests with an HTTP module, and the wifi library was one of the culprits. We will instead use WiFIClientsecure, its basically the same thing, but made for HTTPS.

Then we will define our API link. We define this by using "const char* API_URL =" You can find your actual link on your vercel dashboard that you've made it in the previous step. Mine looks like this: ```const char* API_URL = "https://data-api-alternative-tau.vercel.app/api/insertOne"; ``` 
>⚠️Its important that you add /api/insertOne at the end of your link. This is because the ESP8266 wont do anything if you just send it to the main link of your API. You need to call a function for the API to use, and to insert a new document we need the insertOne document.

Also add these 2 lines below that ```unsigned long lastTime = 0;
unsigned long timerDelay = 5000;```

The last part in the configuration is setting both clients properly up 
```
WiFiClientSecure client;
HTTPClient http;
```
Replace wificlient; client with wificlientsecure as thats the library we're using now. 

in the void setup you'll want to add one line of code 
```
client.setInsecure();
```
This makes the ESP8266 skip the SSL verification, in our use case this is ideal, because we know the adress its sending to, and the ESP8266 has a very low amount of memory, so we don't want to add unnecessary steps.
Now that we're finally done with the setup, its time to get to the real work! We will want the HTTP request to start at the end of our function that we already have (if digitalread(button_pin) == high) 
We need to paste the following things 
```
 http.begin(client, API_URL);
 http.addHeader("Content-Type", "application/json");
 http.addHeader("x-api-key", "your API key that you made in the previous step");
 http.addHeader("x-api-secret", "your API Secret that you made it in the previous step");
```

What this does is the following, http.begin starts the HTTP process and calls our api_url that we defined earlier as the adress, then we ask the ESP to send a json file to it. We then need to add headers to the message. I first put everything in one huge JSON string, but it does not accept that. as it needs the important information probably first in the "subject" of the message. Once it has that we can start to define the document. paste this below the httpheaders you just pasted in your document!
```
int httpResponseCode = http.POST("{\"database\":\"SmartBinder\",\"collection\":\"cards\",\"document\":{\"energy\":\"fire\",\"HP\":\"300\",\"image\":\"https://raw.githubusercontent.com/LukaSpelberg/SmartBinder-Manual-IoT/refs/heads/main/image%2010.png\"}}"); 
```
This is the tricky part, because the syntax is very confusing and gave me a real headache. But trust me, once you understand the syntax its not as confusing as you might think. You start the message off by letting it know your database and collection. Those are the first two things i declare. Every object needs to be written like this \"object\":\"value\" this is basically the same as object:value but with some extra steps.
>⚠️ Also a thing to point out, the ESP8266 has a lot of trouble with images, because of the low RAM it has. Your only option is to host an image somewhere, and use the link in the JSON, like i did. I have chosen github itself as hosting as that was the easiest for me.

Once you have the httpResonsecode in your file, you are almost done! Simply end the http section with an "http.end()" and thats all! Just to check, your function should now look something like this:
```   
   if (digitalRead(BUTTON_PIN) == HIGH) {
      while (pulses < 4) {
        fadeInOut(0xff, 0xff, 0xff);
        pulses = pulses + 1; 
      }
      for (int i = 0; i < NUMPIXELS; i++) {
        pixels.setPixelColor(i, pixels.Color(0, 150, 0));
      }
      pixels.show();

      delay(500);
      pixels.clear();
      pixels.show();
      pulses = 0;

     http.begin(client, API_URL);
      http.addHeader("Content-Type", "application/json");
      http.addHeader("x-api-key", "Banaan");
      http.addHeader("x-api-secret", "Plant");
      int httpResponseCode = http.POST("{\"database\":\"SmartBinder\",\"collection\":\"cards\",\"document\":{\"cardId\":\"alakazam-001\",\"energy\":\"fire\",\"HP\":\"300\",\"image\":\"https://raw.githubusercontent.com/LukaSpelberg/SmartBinder-Manual-IoT/refs/heads/main/image%2010.png\"}}");
      http.end();
    }
```
>⚠️ This part is by far the most troublesome part of the guide, so i'll give you a few tools to check for what could go wrong.
><br> - Use vercel!!! Vercel is your best friend in these situations! It has a very elaborate logging system which exactly tells you what is going wrong, for example if it's experiencing an internal error (so something with the API itself) or that your ESP8266 is encountering an error. You can find the logs by clicking on your most recent deployment, and navigating to the logs tab in the navigation.
><br> - Check if the item you are trying to add does not already exist in mongoDB. When i wrote this guide, I was testing like crazy and didn't notice that it was actually working. MongoDB does not allow default items by default, and I didnt notice, so i constantly thought something else was going wrong.
><br> - If you are getting 403 forbidden errors something is going wrong on the ESP8266 side of things. Check if you have the right syntax for the keys, in our repository they will look like this x-api-key and this x-api-secret. its very case sensitive so make sure you get it right. Another issue could be that you have the wrong link, or skipped a few steps when we were setting up the HTTP library and the wifisecure library.
><br> - If you are getting 505 internal errors, make sure you have added app.set('trust proxy', true); to index.js in your repository. Without this line vercel won't trust the ESP8266 and the process will immidiately fail.
><br> - If you are still getting errors even after trying the above 4 suggestions, it might be worthwhile to add debugging to your HTTP part of the code. Write them yourself or ask chatGPT for a debugging snippet. IF you do this, make sure to paste the debugging lines above the line "http.end();" As we end the http service from here, and any functions that invoke http won't work after that.



## Step 5 - Code for the website.
Okay so quick check! If you arrived at this step you have:
 - Made your own database
 - Used the API alternative from MongoDB
 - Have hosted it on vercel
 - Made the LEDS and the button work for the ESP8266
 - Made the HTTPS request work for the ESP8266

If so, Congratulations! We are almost done. If you dont have any of those things, you can look back in the guide. On most checkpoints I have added solutions to potential errors, check if any of those help your situation. 
For the last part of this guide, we will create a simple webapp to show our database card! All the hard work will finally pay off.

Now dont worry, I wont instruct you how to build a website from scratch, I have made my own website for you to use, and you can download it by once again cloning a reposity, this time mine. For the people who would like the instructions for this again: 
You can clone a repository by opening **the folder** where you want the code to be **located**. Then you open your **terminal**, and paste this **message** in there. "git clone https://github.com/LukaSpelberg/SmartBinder-Manual-IoT.git" Once its done, **open** the **new folder** that you have, and once again open **the terminal**. This time we will **type** the following text into the terminal: **"npm install".** This will install all the **libraries** we need.

Once you have cloned the repository and typed npm install, you only need to do one last thing: create an .env document. We have also done this in the past, so you probably know how to do this by now. Create a document called ".env" in the root of your folder.
the document only has one thing in it:
```
MONGODB_URI=
```
In here you will need to paste your database connection string. You can simply copy the string from your previous .env file in the API.

Once you have all this, type in the terminal "npm run dev". This will let the terminal start a server on your local computer. hold control, and click on the link in your teminal. This will open your default browser, and hooray! your card has been added to the app!
<img width="2579" height="1388" alt="Frame 27" src="https://github.com/user-attachments/assets/4776708b-f733-4116-ab5a-4f860fa567bb" />


With all these steps finally done, you have found a way to send documents to a database and display them on an app. 

Here is a showcase video of the guide in action! https://youtu.be/lqxe38ZlvGY 

>⚠️ If you encountered any issues with the website, or any other part of this guide that are still unresolved, don't be scared to drop a new issue on this repo. I will read them all, and try to help you if I can. This way, we can all make a finished product!

### Sources
This guide has been made with the help of the [official documentation of MongoDB.](https://www.mongodb.com/docs/atlas/app-services/data-api/migration/data-api-tutorial/#std-label-data-api-custom-express-alternative)
<br>I have also used code of this [public repository](https://github.com/abhishekmongoDB/data-api-alternative.)
<br>I used this website for the [LED strip fading](https://www.tweaking4all.com/hardware/arduino/adruino-led-strip-effects)
<br>And last but not least this site to make [HTTPS requests:](https://randomnerdtutorials.com/esp8266-nodemcu-http-get-post-arduino/#http-post)


