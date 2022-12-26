  let mycanvas;
  let font = 'typekaR';
  let letters = 'empty message '; //variable phrase of recording speech
  let agents = []; //array of agents that contain phrases
  let init = 0; //useful later in order to keep a maximum number of agents
  let agentCount = 0; // number of initial agents
  let maxAgentCount = 15; // max number of agents
  let noiseScale = 500; // you can modify it to change the vorticity of the flux
  let noiseStrength = 10; // same
  let strokeWidth = 0.3;
  let fontSizeMin = 14;
  let overlayAlpha = 10; //how much the text disappear (range 0-255)
  let stepSize = 0.01; //step of the Agent movement at each frame

  //Speech recognition settings //
  let speechRec;
  let lang = 'en-US'; //this is for english library, for italian we will change in 'it-IT'
  let vol_map; //volume changed with map function
  let spoke = false;
  let vol_zero;
  let vol_text = 10;
  let vol, mic; //value get by the microphone

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

    //mic icon
    let micBtn = document.getElementById('panel').contentWindow.document.getElementById('micBtn');
    micBtn.addEventListener('mousedown', startMic);
    micBtn.addEventListener('mouseup', stopMic);

    mycanvas.mousePressed(writeOnCanvas);

    // possible action of the panel. Get element from html index
    // document.getElementById('panel').contentWindow.document.getElementById('arrowPanel4').addEventListener('click', closePanel);
    document.getElementById('imgBtInfo').addEventListener('click', function() { //info icon action
      document.getElementById('infoPanel').style.display = 'block'
    });

  }; //end of setup


  function draw() {
    frameRate(9); // to speed up or slow down the writings

    //volume
    vol = round(mic.getLevel(), 2); //round function calculates the integer closest to the parameter
    vol_map = map(vol, 0, 1, 10, 22); //Re-maps a number from one range to another
    //console.log("volume " + vol_map);

    // To catch the volume of the spoken phrase
    if (vol_map > vol_zero + 2) {
      vol_text = vol_map; //var set the font size
      vol_zero = undefined;
    }

    // transparent white layer in order to make the text disappear
    noStroke();
    fill(255, overlayAlpha)
    rect(0, 0, width, height, overlayAlpha);

    // Draw agents
    if (agentCount > maxAgentCount) {
      init = agentCount - maxAgentCount;
    }
    for (let i = init; i < agentCount; i++) {
      agents[i].update(noiseScale, noiseStrength, strokeWidth);
    }
    //define the phrase color frome slider panel
    let rCol = document.getElementById('panel').contentWindow.document.getElementById('slider1').value
    let gCol = document.getElementById('panel').contentWindow.document.getElementById('slider2').value
    let bCol = document.getElementById('panel').contentWindow.document.getElementById('slider3').value

    let sliderCol = document.getElementById('panel').contentWindow.document.getElementById('sliderCol');
    sliderCol.style.backgroundColor = color(rCol, gCol, bCol);

  } //end of draw;

  function gotData(data) { //load data from server
    let texts = data.val(); //The val() function returns an object.
    let keys = Object.keys(texts); // Grab the keys to iterate over the object
    agentCount = keys.length;

    for (let i = 0; i < keys.length; i++) { //for each object
      let userText = texts[keys[i]]; //assign his data to let userText
      agents[i] = new Agent(userText.xPos, userText.yPos, color(userText.rCol, userText.gCol, userText.bCol), userText.letters, userText.vol_text);
    }
  }

  function updateData(data) { //update text list
    let texts = data.val();
    let keys = Object.keys(texts);
    agentCount = keys.length;

    for (let i = keys.length - 1; i < keys.length; i++) { //select last object
      let userText = texts[keys[i]];
      agents[i] = new Agent(userText.xPos, userText.yPos, color(userText.rCol, userText.gCol, userText.bCol), userText.letters, userText.vol_text);
    }
  }


  function writeOnCanvas() { //add the spoken words to the canvas
    if (spoke == true) {
      let rCol = document.getElementById('panel').contentWindow.document.getElementById('slider1').value
      let gCol = document.getElementById('panel').contentWindow.document.getElementById('slider2').value
      let bCol = document.getElementById('panel').contentWindow.document.getElementById('slider3').value

      agents[agentCount] = new Agent(mouseX, mouseY, color(rCol, gCol, bCol), letters, vol_text);

      if (getAudioContext().state !== 'running') {//volume check
        getAudioContext().resume(); //if it is not running, activate it.
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
      let phrase = document.getElementById('panel').contentWindow.document.getElementById('phrase');
      phrase.innerHTML = ""
      phrase.style.padding = '0 0 0 0';
      mySound.play();//the song will start when the phrase is add
    }

    //panel elimination
    parent.document.getElementById('panel').style.display = 'none';
    parent.document.getElementById('infoPanel').style.display = 'none';
  }

  function startMic() {
    vol_zero = vol_map;
    vol_text = 10;

    let continuous = false; // give results just once
    let interim = false; // wait for the speaker to pause
    spoke = true;
    speechRec.start(continuous, interim);
    document.getElementById('panel').contentWindow.document.getElementById('micBtn').style.backgroundImage = "url('../assets/image/04.2_Mic.gif')"
  }

  function stopMic() {
    document.getElementById('panel').contentWindow.document.getElementById('micBtn').style.backgroundImage = "url('../assets/image/04.1_Mic fermo.png')"
  }

  function gotSpeech() {
    if (speechRec.resultValue) { // the engine get information
      let text = speechRec.resultString; // string from speech recognition
      letters = text + ' ';
      let phrase = document.getElementById('panel').contentWindow.document.getElementById('phrase');
      phrase.innerHTML = "' " + speechRec.resultString + " '" //show to the user
      phrase.style.padding = '0 20px 20px 20px';
      }
  }

  function keyReleased() {
    if (key == 's' || key == 'S') saveCanvas('myDiaryPage', 'png'); //to downlod the image of the screen
    if (key == ' ') {
      let newNoiseSeed = floor(random(10000));//change the direction fo letters randomly
      noiseSeed(newNoiseSeed);
    }
    if (keyCode == DELETE || keyCode == BACKSPACE) background(255); //delete old gray letter
  };

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight / 100 * 85);
  }

