<p align="center">
  <img src="assets/logo/Logo_ext.png" width="300" />
</p>

### Team members:
-  Brambilla Chiara
-  Crippa Alessandra
-  Moreschi Jessica
-  Repetto Matteo

### Course
[Creative Coding 2020/2021](https://drawwithcode.github.io/2020/)<br>
**Politecnico di Milano** - Scuola del Design<br>
**Faculty:** Michele Mauri, Andrea Benedetti, Tommaso Elli.


## Concept

Our patience has been severely tested because of the lockdown implications. We faced a lot
of different problems, unexpected events and other things that have threatened our mental
integrity. But we can bring out the best from this situation: Now it’s your chance to tell
everyone how you’re feeling… through creativity!

We present you... **Spit It Out!**
"Spit It Out" is phrase used to incentive to say what you are really thinking (in italian
can be translated as “sputa il rospo”, “sputalo fuori”).

It's is a common space that presents a diary as collaborative canvas: people will create 
a masterpiece of “**words traces**”. Step by step, the site will ask some questions to the user 
in order to generate a “river of words”. The final result it’s an artwork in which all 
the bad and good feelings dance together.

<p align="center">
  <img src="assets/readme/Concept.png" width="800" />
</p>


The aim of the project is giving voice to **deep feelings**, whatever they are. Together users 
will create an amazing and unpredictable artwork that will be shaped by the interaction of 
each other.

The entire experience is designed to work on computer and the mic is required.


## Design Challenges

In oreder to reflect an effective way the concept, a strong visual identity was necessary. A first part of the project was to research some inspirations and works with an hand drawn look and a sort of "diary mood". Infact, the site could be seen as a sort of public diary in which people can write their thougths without their identity being made public (no login or entering name is necessary). 

### Inspirations

The design and visual identity of this project was inspired by some exiting works (not only works about web and internet, but also about graphic design and typography). Here some links and images to discover them:
- [Paper textures](https://www.behance.net/gallery/105236297/Free-Download-8x-Detail-Paper-Texture-Collection?tracking_source=search_projects_recommended%7Cfree%20paper%20texture) by **Freeject.net Design**
- [Elude](https://www.behance.net/gallery/108994253/Elude) by **Herman Scheer**
- [Travel Bug](https://www.behance.net/gallery/38800427/Travel-Bug?tracking_source=search%7Cquotes) by **Lara Resch**
- [Memories Book Design](https://www.behance.net/gallery/106580687/Memories-Book-Design?tracking_source=search_projects_recommended%7Csecret%20book) by **Wanran Ding**

<p float="left">
  <img src="assets/readme/Elude.png" width="340"/>
  <img src="assets/readme/Memories.png" width="320"/>
  <img src="assets/readme/BugTravel.png" width="340"/>
</p>  

### Visual identity

**Logo** <br>
The logo is composed of two aspects: the title of the site (Spit It Out) and a stylized megaphone, who
represents the voice (a key element of the experience). Another characteristic is the texture applied
on the logo, who gives a hand drawn look.
<p align="center">
 <img src="assets/logo/Logo_ext.png" width="700"/>
</p>

There are also two alternatives of the logo, one without textures and one more "shortened" with only 
the initial letters S.I.O.
<p align="center">
 <img src="assets/readme/Logos.png" width="700"/>
</p>

**Palette and textures** <br>
The color palette is very simple, composed by only two main colors (black and white) which resembles **ink**
and **paper**. The two textures too were selected to remember paper and ink.

<p align="center">
 <img src="assets/readme/Palette.png" width="800"/>
</p>

**Fonts** <br>
The site uses two different fonts: the one called "**Fraktion Sans**" is used in standard texts, the other one called "**Typeka**", instead, is used in titles and underlined words (and it recalls typewriter's letters).

<p align="center">
 <img src="assets/readme/Fonts-08.png" width="800"/>
</p>

**Animations** <br>
The last but not the least is the large use of animations. They have been realized to be used as hover (so they can be triggered by passing the mouse on it) or as simple visual effects (such as the titles of the sections). All these animations follow the previous rules of the visual identity.
<p float="left" align="center">
   <img src="assets/image/06.2_Diary.gif" width="200">      
   <img src="assets/image/04.3_Mic.gif" width="150">
   <img src="assets/image/08.2_Bottone pieno.gif" width="150">
   <img src="assets/image/09.2_Bottone traccia.gif" width="150">
</p> 

### UX

The UX have been designed to be simple and easy to understand for the users. The site presents two different main sections: one is "**Home page**" (reachable in any moment by pressing on the button with site's logo settled in the top-left of the page), in which you can find a welcome message, informations about what kind of site it is and the credits. The other one section is called "**Diary**" (reachable by pressing the diary in the top-right part of the site or the button "write in the diary" in the Home page) and it's where you can find the messages levead by other users around the world.

<p align="center">
  <img src="assets/readme/UX.png" width="900">
</p>

Users can insert their messages by pressing the button "Write in the diary" settled in the section Diary. By pressing it, a window will appear and step by step it will be explained how to insert a message:
- First it will be asked how they felt during the quarantine. Depending on the emotions chosen by moving the sliders, the stroke will have a certain **color** (each slider is releated to a specific channel f the colour method RGB).
- Second it will be asked to "spit it out" what thay are really feeling by holding with the mouse the mic icon. More high the **voice volume** is, more big the stroke of words will appear on the canvas.
- As third and final step it will be asked to click on the canvas of the site to see the final result.

<p align="center">
  <img src="assets/readme/UX2.png" width="900">
</p>


## Code challenges
<ol>
  <li>  
    
<b>Preload sentences</b><br>
As first thing, it had been necessary to undesrtand how to preserve all the sentences that users have left in the canvas. Therefore, it was necessary to store the data given by the users on a server. The solution? Use "**Firebase** server". Firebase is a Google's platfrom that helps to develop apps in a high-quality way; it has a lot of interesting functions, such as the possibility to store data given by users and control them (for example, you can delete or modify them). <br>

That's how it was introduced in the code: the  function **gotData()** is called in the **setup()** with the function **texts.once("value", gotData)**, which provides the access to the Firebase storage. Then, For each element (called "**keys**") of the database array, it creates a new "agent" (sentence that will appear in the canvas) with defined parameters for Agent constructor (mouse position, personalized colour, text and font size) picked from Firebase's storage.

  </li>
  
  <li>
  
<b>Update sentences</b> <br>
Another chellenge relted to the previous one, was to make visible the changes made by other users in real time. This means that the database must be constantly checked, but only the last element of the array must be loaded on change. <br>

So, the function **texts.on("value", updateData)** have been introduced. This function does a constant check of the firebase database: each time it changes, it triggers the function **updateData()**. This function is the same of the previous one (**gotData()**): the difference is that it creates a new **agent** only for the last element of the firebase database array (it means that each time a new sentence is stored, it will appear on the everyone's canvas).

  </li>
   
  <li>
  
<b>Audio and recording</b><br>
we use p5.speech library a Speech synthesis and recognition for p5.js
is a p5 extension to provide Web Speechp. It consists of an object class (p5.SpeechRec) along with an accessor function to listen for text, change parameters such as recognition models, etc.
Continuous propriety is a boolean to set whether the speech recognition engine will give results continuously (true) or just once (false = default).
Interim propriety is a boolean to determine whether the speech recognition engine will give faster, partial results (true) or wait for the speaker to pause (false = default).
We also used the microphone to set the font size. we get the volume with the class new p5.AudioIn() that is based on the  p5.sound library.
  </li>

  <li>
  
<b>write on canvas agent</b><br>
The function writeOnCanvas()is triggered when the canvas is clicked, right after recording a new phrase.
It creates a new instance of the class Agent, containing as initial position the mouse position, and also containing the new phrase pronounced by the user, the right dimension of the letters based on the speech volume and the color selected by the user.
Moreover it sends the new data information to Firebase (with the texts.push(data) function), in order to keep track of all people’s thoughts. 
  </li>
  
  <li>
  
<b>How to represent each phrase: Agent class</b><br>
One of the main points of our project was facing the challenge of writing people’s thoughts on the canvas with Perlin noise.
In order to do so we created a new class Agent that represents the beginning of each phrase (which moves randomly at each frame) and contains the current position, the words of the entire phrase, the color, the size, and other parameters. 
(Non so se questo codice che mostra come è fatta la classe Agent lo volete mettere, secondo me ci starebbe bene qua sotto, nel caso eccolo)
The main method of the Agent class is update(), in which a while cycle is aimed at finding the new agents’ position at each frame (in order to print the new letter) and the distance from the previous letter.
The angle of the movement direction at each frame is found with Perlin noise.
Then, when the new position is sufficiently far from the last letter, the function prints the new letter on the canvas.
  </li>

  <li>
  
<b>index.html</b><br>
The last but not he least, was to give a diary-look to some sentences by adding a function that “type-writes” them in **real time**. But the real challenge was to trigger the function **only one time** and only when **the user is in the correct section**. <br>

The function **currentSection()** have been helpful to evaluate in which website section the user is: it constantly checks the url and compares it with an if condition. After detecting the section, it calls the right function **type()** (it manages to tirgger it only once by a comparison with the previous url).
This last function creates a new element of the class **"Typewriter**" (that generates strings with a typewriter look) and provides sending the methods properties.
  </li>
</ol>

## Credits
Fonts used:
[Fraktion Sans](https://www.behance.net/gallery/96836357/Fraktion-Sans-Typeface),
[Typeka](https://fonts.adobe.com/fonts/typeka)

Libraries: P5js, Firebase
