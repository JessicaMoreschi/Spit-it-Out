// The Agent class represents each sentence written on the canvas
class Agent{
  constructor(x0,y0, color, string, vol){
    this.pos = createVector(x0, y0); //current position
    this.nextPos = this.pos.copy(); //next position
    this.stepSize = random(1, 5); //step at each frame
    this.isOutside = false; //it tells if a sentence has reachd the edge of the canvas
    this.angle; //angle of the new position (with Perlin noise)
    this.letterIndex = 0; //for printing letters in the right order
    this.col = color;
    this.privateLetters = string;
    this.lettersLength = string.length;
    this.vol = vol;
  }

  update(noiseScale, noiseStrength, strokeWidth) {
    // It's the method which actually prints the text
    var newLetter = this.privateLetters.charAt(this.letterIndex); //it picks the next letter to be printed
    fill(this.col)
    var d = 0;
    this.pos = this.nextPos.copy();
    textSize(this.vol);

    while(d <= textWidth(newLetter)){
      // This while cicle it's for finding the next position at the right distance from the last letter, in order to print the new letter.
      // It continues until the new position is far enough from the last letter.
      this.angle = noise(this.nextPos.x / noiseScale , this.nextPos.y / noiseScale) * noiseStrength; //the direction of the text's movement is found with Perlin noise
      this.nextPos.x = this.nextPos.x + cos(this.angle) * stepSize; //the new position is computed
      this.nextPos.y = this.nextPos.y + sin(this.angle) * stepSize;
      this.isOutside = this.nextPos.x < 0 || this.nextPos.x > width || this.nextPos.y < 0 || this.nextPos.y > height; //1 if agent has reached the edge, 0 otherwise
      if (this.isOutside) { //when the agent reaches the edge of the canvas is randomly put inside the canvas again
        this.nextPos.set(random(width), random(height));
        this.pos = this.nextPos.copy();
        this.nextPos.x = this.nextPos.x + cos(this.angle) * stepSize;
        this.nextPos.y = this.nextPos.y + sin(this.angle) * stepSize;
        this.letterIndex = 0; //the sentence starts from the beginning
        newLetter = this.privateLetters.charAt(this.letterIndex); //the next letter becomes the first one
      }
      this.isOutside = false;
      d = p5.Vector.dist(this.nextPos, this.pos); //distance of the new position from the last letter
    } //end of while

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
