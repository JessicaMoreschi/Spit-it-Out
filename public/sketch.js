/**

 * KEYS
 * space               : new noise seed
 * backspace           : clear screen
 * s                   : save png

 */

let mycanvas;

let font = 'typekaR';
let letters = 'empty message ';
let agents = [];
let init = 0; //useful later in order to keep a maximum number of agents
let agentCount = 0; // number of initial agents
let maxAgentCount = 10; // max number of agents
let noiseScale = 500; // you can modify it to change the vorticity of the flux
let noiseStrength = 10; // idem
let strokeWidth = 0.3;
let fontSizeMin = 14;
let overlayAlpha = 10; //quanto spariscono le scritte (scala 0-255)
let stepSize = 0.01; //step of the Agent movement at each frame

//Speech recognition settings //
let speechRec;
let lang = 'en-US'; //|| 'it-IT'
let vol_map;
let spoke = false;
let vol_zero;
let vol_text=4;
let vol, mic;

//firebase variables
let readData = []; //read data container
let texts;

function preload() {
  mySound = loadSound('../assets/sound/type.mp3');
}

function setup() {
  mycanvas = createCanvas(windowWidth, windowHeight / 100 * 85);
  mycanvas.parent('canvas');

  //FIREBASE SETTINGS
  database = firebase.database(); //start database
  texts = database.ref('texts'); //start collection
  //load data from storage
  texts.once("value", gotData);
  texts.on("value", updateData); //The “value” event is triggered when changes are made to the database

  //SPEECH RECOGNITION AND MIC
  speechRec = new p5.SpeechRec(lang, gotSpeech);
  mic = new p5.AudioIn();
  mic.start();

  colorMode(RGB, 150, 150, 150); //colorMode(mode, max1, max2, max3, [maxA])
  textFont(font, fontSizeMin);

  let micBtn = document.getElementById('panel').contentWindow.document.getElementById('micBtn'); //mic icon
  micBtn.addEventListener('mousedown', startMic);
  micBtn.addEventListener('mouseup', stopMic);

  mycanvas.mousePressed(writeOnCanvas);

  //gestione pannelli
  document.getElementById('panel').contentWindow.document.getElementById('arrowPanel4').addEventListener('click', closePanel) // to close panel
  document.getElementById('imgBtInfo').addEventListener('click', function(){document.getElementById('infoPanel').style.display='block'}) // to close panel

}; //end of setup


function draw() {
  frameRate(9); // to speed up or slow down the writings

  //volume
  vol = round(mic.getLevel(), 2);
  vol_map = map(vol, 0, 1, 10, 200);
  console.log("volume " + vol_map);

  // To catch the volume of the spoken phrase
  //console.log("vol0 " + vol_zero);
  // console.log("vol_text " + vol_text);
  if (vol_map > vol_zero+10){
    vol_text = vol_map;
    vol_zero =undefined;
  }

  // transparent white layer in order to make the text disappear
  //fill('rgba(255,255,255, overlayAlpha)');
  noStroke();
  fill(255, overlayAlpha)
  rect(0, 0, width, height, overlayAlpha);

  // Draw agents
    if (agentCount > maxAgentCount){
      init = agentCount - maxAgentCount;
    }
    for (let i = init; i < agentCount; i++) {
      agents[i].update(noiseScale, noiseStrength, strokeWidth);
    }

    let rCol=document.getElementById('panel').contentWindow.document.getElementById('slider1').value
    let gCol=document.getElementById('panel').contentWindow.document.getElementById('slider2').value
    let bCol=document.getElementById('panel').contentWindow.document.getElementById('slider3').value

    let sliderCol=document.getElementById('panel').contentWindow.document.getElementById('sliderCol');
    sliderCol.style.backgroundColor= color(rCol, gCol, bCol);

} //end of draw;

function gotData(data) { //load data from server
  let texts = data.val(); //The val() function returns an object.
  let keys = Object.keys(texts); // Grab the keys to iterate over the object
  agentCount = keys.length;
  // console.log("gotData: " + agentCount)
  for (let i = 0; i < keys.length; i++) { //for each object
    let userText = texts[keys[i]]; //assign his data to let userText
    agents[i] = new Agent(userText.xPos, userText.yPos, color(userText.rCol, userText.gCol, userText.bCol), userText.letters, userText.vol_text);
  }
}

function updateData(data) { //update text list
  let texts = data.val();
  let keys = Object.keys(texts);
  agentCount = keys.length;
    console.log("updateData: " + agentCount)
  for (let i = keys.length - 1; i < keys.length; i++) { //select last object
    let userText = texts[keys[i]];
    agents[i] = new Agent(userText.xPos, userText.yPos, color(userText.rCol, userText.gCol, userText.bCol), userText.letters, userText.vol_text);
  }
}


function writeOnCanvas() {
  if (spoke==true) {
  let rCol=document.getElementById('panel').contentWindow.document.getElementById('slider1').value
  let gCol=document.getElementById('panel').contentWindow.document.getElementById('slider2').value
  let bCol=document.getElementById('panel').contentWindow.document.getElementById('slider3').value

  agents[agentCount] = new Agent(mouseX, mouseY, color(rCol, gCol, bCol), letters, vol_text);
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
  //write data
  let data = { //crate user data
    xPos: mouseX,
    yPos: mouseY,
    rCol: rCol,
    gCol: gCol,
    bCol: bCol,
    letters: letters,
    vol_text: vol_text
  }
  texts.push(data); //push user data to the firebase collection
  spoke = false;
  let phrase=document.getElementById('panel').contentWindow.document.getElementById('phrase');
  phrase.innerHTML=""
  phrase.style.padding= '0 0 0 0';
  mySound.play();
  }

  //scomparsa pannelli
  parent.document.getElementById('panel').style.display = 'none';
  parent.document.getElementById('infoPanel').style.display = 'none';
}

function startMic() {
  vol_zero = vol_map;
  console.log("listening");
  // mic.start();
  let continuous = false; //continue recording
  let interim = false;
  spoke = true;
  speechRec.start(continuous, interim);
  document.getElementById('panel').contentWindow.document.getElementById('micBtn').style.backgroundImage = "url('../assets/image/04.2_Mic.gif')"
}

function stopMic() {
  document.getElementById('panel').contentWindow.document.getElementById('micBtn').style.backgroundImage = "url('../assets/image/04.1_Mic fermo.png')"
  console.log("stop")
}

function gotSpeech() {
  if (speechRec.resultValue) {
    let text = speechRec.resultString;
    letters = text + ' ';
    let phrase = document.getElementById('panel').contentWindow.document.getElementById('phrase');
    phrase.innerHTML = "' " + speechRec.resultString + " '"
    phrase.style.padding = '0 20px 20px 20px';
    console.log(speechRec.resultString)
    console.log("sono nella funzione gotspeech");
  }
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas('myDiaryPage', 'png');
  if (key == ' ') {
    let newNoiseSeed = floor(random(10000));
    noiseSeed(newNoiseSeed);
  }
  if (keyCode == DELETE || keyCode == BACKSPACE) background(255);
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight / 100 * 85);
}

function closePanel() {
  parent.document.getElementById('panel').contentWindow.document.getElementById('avanti').setAttribute('src', '../assets/image/avanzamento-03-03.png');
  parent.document.getElementById('panel').style.display = 'none';
  location.reload()
}
