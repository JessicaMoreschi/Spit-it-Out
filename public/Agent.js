class Agent{
  constructor(x0,y0, color, string, vol){
    this.pos = createVector(x0, y0); //current position
    this.nextPos = this.pos.copy(); //next position
    this.stepSize = random(1, 5);
    this.isOutside = false;
    this.angle;
    this.letterIndex = 0; //it's for printing letters in the right order
    this.col = color;
    this.privateLetters = string;
    this.lettersLength = string.length;
    this.vol = vol;
  }

  update(noiseScale, noiseStrength, strokeWidth) {
    // it's the method which actually prints the phrases
    var newLetter = this.privateLetters.charAt(this.letterIndex);
    fill(this.col)
    var d = 0;
    this.pos = this.nextPos.copy();
    textSize(max(this.vol, d));

    while(d <= textWidth(newLetter)){
    //this while cicle it's for finding the next position at the right distance from the last letter, in order to print the new one
    this.angle = noise(this.nextPos.x / noiseScale , this.nextPos.y / noiseScale) * noiseStrength; //the direction of the phrase's movement is found with random noise
    this.nextPos.x = this.nextPos.x + cos(this.angle) * stepSize;
    this.nextPos.y = this.nextPos.y + sin(this.angle) * stepSize;
    this.isOutside = this.nextPos.x < 0 || this.nextPos.x > width || this.nextPos.y < 0 || this.nextPos.y > height;
    if (this.isOutside) { //when the agent reaches the edge of the canvas is randomly put inside the canvas again
      this.nextPos.set(random(width), random(height));
      this.pos = this.nextPos.copy();
      this.nextPos.x = this.nextPos.x + cos(this.angle) * stepSize;
      this.nextPos.y = this.nextPos.y + sin(this.angle) * stepSize;
      this.letterIndex = 0;
    }
    this.isOutside = false;
    d = p5.Vector.dist(this.nextPos, this.pos);
  } //fine while

    newLetter = this.privateLetters.charAt(this.letterIndex);

    push();
    translate(this.pos.x, this.pos.y);
    let angle = atan2(this.nextPos.y - this.pos.y, this.nextPos.x - this.pos.x);
    rotate(angle);
    text(newLetter, 0, 0);
    pop();

    this.letterIndex++; //when the phrases is over, it starts again
      if (this.letterIndex >= this.lettersLength) {
        this.letterIndex = 0;
    }

  } //end of update
}; //end of class Agent
