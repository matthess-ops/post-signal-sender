import { LocalStorageData } from "./LocalStorageData";
import { PostThreads } from "./PostThreads";
import { Views } from "./Views";
import { Validation } from "./Validation";
import { Helpers } from "./Helpers";
import {ButtonEvents} from "./ButtonEvents"

       /*
  MainEvents class
  EXPLANATION: This is the main class, from where the app is instantiated/runned/controlled. The app
  as on app creation 3 main events that can occur.
  1:onPageLoad(): To prevent the user for constantly uploading a tableText. OnPageLoad checks if a previous
  tableText and ipAdress is in localSTorage. If this is case this data used, until the user changes the ipAdress and/or
  uploads another tableText
  2: ipAdressInputEvent(): If a user changes the ipAdress, the ipAdress is checked,saved and running threads stopped
  3: fileUploadEvent(): If a user uploads a new cvs file, this file is checked,saved and running threads stopped.
  REMARKS:  The code is getting spaghettified, in a larger app the classes should be changed to reflect components.

    */

export class MainEvents {


  public fileUploadInput = <HTMLInputElement>(
    document.getElementById("fileUploadInput")
  );
  public ipAdressInput = <HTMLInputElement>(
    document.getElementById("ipAdressInput")
  );

    // load all classes that are needed.
  private localStorageData:LocalStorageData = new LocalStorageData(); // for checking,reading,writing to localStorage
  private postThreads:PostThreads = new PostThreads(); // class that stops and starts the post request threads, or sends a single post request
  private views:Views = new Views(); // class that creates views
  private helpers:Helpers = new Helpers(); // class that contain tableText conversions to array and dict. And reads radioButton states
  private validation:Validation = new Validation(); // class that validates the uploaded tableText and ipAdress input

  private ipAdress:string = "";
  private tableText:string = "";

         /*
  ipAdressInputEvent()
  EXPLANATION: Creates an event listner for ipAdress input. And updated this.ipAdress
  REMARKS:  none
    */
  private ipAdressInputEvent(): void {
    this.ipAdressInput = <HTMLInputElement>(
      document.getElementById("ipAdressInput")
    );

    this.ipAdressInput.addEventListener("input", (e) => {
        this.ipAdress = this.ipAdressInput.value
        this.ipAdressAndTextCheck();
    });
  }

 
         /*
  fileUploadEvent()
  EXPLANATION: creates an event listner for file uploads. And reads the text of the file upload. And it
  updates this.tableText
  REMARKS:  none
    */
  private fileUploadEvent():void {
    this.fileUploadInput.addEventListener("input", () => {
      let reader = new FileReader();

      reader.addEventListener("load", (e) => {
        const tableTextIn = e.target.result.toString();
        this.tableText = tableTextIn;
   
        this.ipAdressAndTextCheck();

      });

      reader.readAsBinaryString(this.fileUploadInput.files[0]);
    });
  }
         /*
  onPageLoad()
  EXPLANATION: On each page load, on page load should be run. It checks localStorage for an
  tableText and ipAdress. If an tableText and ipAdress exist their class variable this.tableTExt and 
  this.ipAdress are updated.
  REMARKS:  none
    */
  private onPageLoad():void {

    if (this.localStorageData.hasLocalData() == true) {
      const localData= this.localStorageData.readLocalData();
      this.tableText =  localData[0]
      this.ipAdress = localData[1]
      this.ipAdressInput.value = this.ipAdress
      this.ipAdressAndTextCheck()
    } 
  }
         /*
  ipAdressInputEvent()
  EXPLANATION: After the 3 main events, this method is called. It validates tableText and ipAdress and
  saves them to localStorage. Then is loads the views for tableDiv, statusDiv and buttonsDiv. Followed by
  launching the event listners for the buttons. If validation fails it loads the view for errorDiv. 
  REMARKS:  none
    */
  private ipAdressAndTextCheck():void {
    const ipAdressValidation = this.validation.validateIpAdress(this.ipAdress)
    const tableTextValidation = this.validation.validateText(this.tableText)
    this.views.clearNonStaticViews()

    if(ipAdressValidation == true && tableTextValidation == true){
  
      this.localStorageData.writeLocalData(this.tableText,this.ipAdress)
      this.postThreads.setIpAdress(this.ipAdress)
      const tableDict = this.helpers.tableTextToDict(this.tableText)


      this.views.tableView(tableDict)
      this.views.statusView("Post threads not running")
      this.views.buttonsView()
      const buttonEvents = new ButtonEvents(this.postThreads,tableDict)
      buttonEvents.startListners()
    }else{
      this.views.errorsView(this.validation.validationErrors);


    }

}
         /*
  runEvents()
  EXPLANATION: Launching the 3 main events. 
  REMARKS:  none
    */
  public runEvents() {
    this.onPageLoad()
    this.fileUploadEvent();
    this.ipAdressInputEvent();
  }
}
