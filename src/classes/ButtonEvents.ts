import { Helpers } from "./Helpers";
import { PostThreads } from "./PostThreads";
import { Views } from "./Views";



  /*
  ButtonEvents class 
  EXPLANATION: ButtonEvents class is not instantiated on page load. It gets instantiated
  after the inputdata (tableText, ipadress) are validated. This class
  is responsible for setting up the eventlistners for the start,stop,update and
  sendOnce buttons.
  REMARKS: The startButtonInput, stopButtonInput,sendOnceButtoninput and stopButtonInput functionality could
  be in theory be put in one method. Since alot of code is duplicated (postThreads.stop, postThreads.start). By
  passing the needed functionality as arguments.
    */


export class ButtonEvents {
  private startButton = document.getElementById("startButton");
  private stopButton = document.getElementById("stopButton");
  private updateButton = document.getElementById("updateButton");
  private sendOnceButton = document.getElementById("sendOnceButton");
  private helpers = new Helpers();
  private views = new Views();
  private postThreads: PostThreads;
  private tableDict: Array<{}>;

  /*
  constructor()
  EXPLANATION: postThreads methods are used after the evenlistners are triggerd. tableDict
  is used as argument in some postThreads methods
  REMARKS: could set tableDict directly in PostThreads, however the PostThreads.sendOnce method
  would need to be rewritten. See PostThreads.ts for more information
    */
  constructor(postThreads: PostThreads, tableDict: Array<{}>) {
    this.postThreads = postThreads;
    this.tableDict = tableDict;
  }
  /*
  startListners()
  EXPLANATION: launches the button event listners
  REMARKS: none
    */
  public startListners(): void {
    this.startButtonInput();
    this.stopButtonInput();
    this.updateButtonInput();
    this.sendOnceButtonInput();
  }
  /*
  startButtonInput()
  EXPLANATION: stop the current running threads, before launching new threads.
  REMARKS: none
    */
  private startButtonInput(): void {
    this.startButton.addEventListener("click", () => {
      this.postThreads.stop();
      this.postThreads.start( this.helpers.readRadioButtonStatus(), this.tableDict);
      this.views.statusView("threads running");
    });
  }
  /*
updateButtonInput()
  EXPLANATION: stops the current running threads, before launchin the newly updated threads
  REMARKS: This function is exactly the same as startButtonInput, thus the redundant code 
  should be but in a seperate methods, which can be used by bot startButtonInput and updateButtoninput
    */
  private updateButtonInput():void {
    this.updateButton.addEventListener("click", () => {
      this.postThreads.stop();
      this.postThreads.start(this.helpers.readRadioButtonStatus(), this.tableDict);
      this.views.statusView("threads running");
    });
  }

  /*
  sendOnceButtonInput()
  EXPLANATION: After event this function immediatly sends the first tableRowDict (tableDict[0]),
  it is handy to have for immediate debugging to the target app.
  REMARKS: this method could be replaced by only using the funciton sendOnce methods in PostThreads,
  see PostThreads.ts for more information.
    */
  private sendOnceButtonInput():void {
    this.sendOnceButton.addEventListener("click", () => {
      this.postThreads.stop();
      this.views.statusView("Threads stopped");
      this.postThreads.sendOnce(this.tableDict[0]);
    });
  }
  /*
  sendOnceButtonInput()
  EXPLANATION: After event stops the current threads
  REMARKS:none
    */
  private stopButtonInput():void {
    this.stopButton.addEventListener("click", () => {
      this.postThreads.stop();
      this.views.statusView("Threads stopped");
    });
  }
}
