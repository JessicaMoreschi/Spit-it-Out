/**
 * noise values (noise 2d) are used to animate a bunch of agents.
 *
 * KEYS
 * space               : new noise seed
 * backspace           : clear screen
 * s                   : save png
 *
 * to do
 *
 */

var x = 0;
var y = 0;
var stepSize = 0.01;

var font = 'Georgia';
var letters = 'ciao ';
//'Così tra questa immensità s\'annega il pensier mio: e il naufragar m\'è dolce in questo mare.'
var fontSizeMin = 14;

//impostazioni riconoscimento vocale //
let lang = 'en-US'; //|| 'it-IT'
let speechRec = new p5.SpeechRec(lang, gotSpeech);
let vol_map;
let vol2 = 1;

//impostazioni firebase
var readData = []; //read data container
var texts;

//variabile globale slider
var slider1Val=100

//inizio sketch
var sketch = function(p) {
  var agents = [];
  var init = 0;
  var agentCount = 0; // initial agents
  var maxAgentCount = 10; // max agents
  var noiseScale = 500; // you can modify it to change the vorticity of the flux
  var noiseStrength = 10;
  // var overlayAlpha = 10;
  //var agentAlpha = 10;
  var strokeWidth = 0.3;


  p.setup = function() {
    //FIREBASE SETTINGS
    database = firebase.database(); //start database
    texts = database.ref('texts'); //start collection
    //END FIREBASE SETTINGS

    p.createCanvas(p.windowWidth, p.windowHeight);

    mic = new p5.AudioIn();
    mic.start();

    p.colorMode(p.RGB, 240, 240, 240); //colorMode(mode, max1, max2, max3, [maxA])
    p.textFont(font, fontSizeMin);

    b1 = p.createButton('microfono');
    b1.position(p.width / 2 * 1.7, p.height / 2 * 0.1);
    b1.mousePressed(listener);
    b1.id('startBtn');

    //load data from storage
    texts.once("value", gotData)

    function gotData(data) { //load data from server
      var texts = data.val(); //The val() function returns an object.
      var keys = Object.keys(texts); // Grab the keys to iterate over the object
      agentCount = keys.length;
      for (var i = 0; i < keys.length; i++) { //for each object
        var userText = texts[keys[i]]; //assign his data to var userText
        agents[i] = new Agent(userText.xPos, userText.yPos, p.color(userText.rCol, userText.gCol, userText.bCol), userText.letters, userText.vol_map);
      }
    }

    texts.on("value", updateData); //The “value” event is triggered when changes are made to the database
    function updateData(data) { //update text list
      var texts = data.val();
      var keys = Object.keys(texts);
      agentCount = keys.length;
      for (var i = keys.length - 1; i < keys.length; i++) { //select last object
        var userText = texts[keys[i]];
        agents[i] = new Agent(userText.xPos, userText.yPos, p.color(userText.rCol, userText.gCol, userText.bCol), userText.letters, userText.vol_map);
      }
    }

  };


  p.draw = function() {
    console.log("draw "+slider1Val)//non funziona
    p.frameRate(9); // questo per far brutalmente rallentare le scritte
    // //volume
    vol = p.round(mic.getLevel(), 2);
    vol_map = p.map(vol, 0, 1, 1, 150);
    // console.log("volume " + vol_map);


    if (p.getAudioContext().state !== 'running') {
      p.text('non funziona audio', p.width / 2, p.height / 2);
    } else {
      p.text('audio abilitato', p.width / 2, p.height / 2);
    }


    p.fill('rgba(255,255,255, 0.05)');
    p.noStroke();
    p.rect(0, 0, p.width, p.height);

    // Draw agents
    for (var i = 0; i < agentCount; i++) {
      agents[i].update(noiseScale, noiseStrength, strokeWidth);
    }

  } //fine draw;

  p.keyReleased = function() {
    if (p.key == 's' || p.key == 'S') p.saveCanvas(gd.timestamp(), 'png');
    if (p.key == ' ') {
      var newNoiseSeed = p.floor(p.random(10000));
      p.noiseSeed(newNoiseSeed);
    }
    if (p.keyCode == p.DELETE || p.keyCode == p.BACKSPACE) p.background(255);
  };

  p.mouseClicked = function() {
    agents[agentCount] = new Agent(p.mouseX, p.mouseY, p.color(p.random(240), 80, 60), letters, vol_map);
    if (p.getAudioContext().state !== 'running') {
      p.getAudioContext().resume();
    }

    //write data
    var data = { //crate user data
      xPos: p.mouseX,
      yPos: p.mouseY,
      rCol: p.random(240),
      gCol: 80,
      bCol: 60,
      letters: letters,
      vol_map: vol_map
    }
    texts.push(data); //push user data to the firebase collection
  }

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }

}; //fine sketch

var myp5 = new p5(sketch);

function listener() {
  let continuous = true; //continua a registrare
  let interim = false;
  speechRec.start(continuous, interim);
  console.log("listening");
}

function gotSpeech() {
  if (speechRec.resultValue) {
    let text = speechRec.resultString;
    letters = text + ' ';
    console.log(speechRec.resultString)
    console.log("sono nella funzione gotspeech");
  }
}

function micGif() {
  document.getElementById('micBtn').style.backgroundImage = "url('../assets/image/04.2_Mic.gif')";
  // listener()
}

function getSlider(){
  slider1Val=document.getElementById('slider1').value
  console.log("fuori p5 "+slider1Val) //funziona
}

function micPng() {
  document.getElementById('micBtn').style.backgroundImage = "url('../assets/image/04.1_Mic fermo.png')"
}
