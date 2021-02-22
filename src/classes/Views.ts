
            /*
  views class
  EXPLANATION: creates the views for errorDiv,buttonDiv,statusDiv, tableDiv
  REMARKS: none
    */



export class Views{

    // set public for 
    private errorDiv = <HTMLInputElement>document.getElementById("errorDiv")
    private tableDiv = <HTMLInputElement>document.getElementById("tableDiv")
    private statusDiv = <HTMLInputElement>document.getElementById("statusDiv")
    private buttonsDiv = <HTMLInputElement>document.getElementById("buttonsDiv")
            /*
  clearNonStaticViews()
  EXPLANATION: clear the errorDiv,buttonDiv,statusDiv, tableDiv
  REMARKS: none
    */

    public clearNonStaticViews():void{
        this.errorDiv.textContent = ""
        this.tableDiv.textContent =""
        this.statusDiv.textContent=""
        this.buttonsDiv.textContent=""
    }

            /*
  tableView()
  EXPLANATION: creates all the elements needed for the html table. The html table exists out
  of rows, where each row is a dict from the tableDict array. Also each row has a radio button group
  containing 4 radioButtons. Each button in a radiogroup has a value as followed "radiogroup_1_button_2",
  the 1, corresponds to the Id of the dict in tableDict. The 2 corresponds to the second button in the radioGroup
  of this row. 
  REMARKS: none
    */
    public tableView(tableDict:Array<{}>):void{
        this.tableDiv.textContent ="" // clear tableDiv
        let tableNode = document.createElement("table"); // table parent element
        tableNode.className = "table";
        // start header colums
        let theadNode = document.createElement("thead");
        let theadTrNode = document.createElement("tr");
        const dictKeys = Object.keys(tableDict[0]);
        dictKeys.forEach((dictkey) => {
          let theadTrThNode = document.createElement("th");
          theadTrThNode.innerText = dictkey;
          theadTrThNode.scope = "col";
          theadTrNode.appendChild(theadTrThNode);
        });
        theadNode.appendChild(theadTrNode);
        tableNode.appendChild(theadNode);
        // end header colums
    
        // begin tbody
        let tbodyNode = document.createElement("tbody");
    
        tableDict.forEach((rowElement) => {
          let trNode = document.createElement("tr");
    
          dictKeys.forEach((dictKey) => {
            let tdNode = document.createElement("td");
            tdNode.innerText = rowElement[dictKey];
            trNode.appendChild(tdNode);
          });
          // create the 4 radiobuttons
          let radioGroupNode = document.createElement("td");
          radioGroupNode.className = "form-check form-check-inline";
          for (let radioGroupIndex = 0; radioGroupIndex < 4; radioGroupIndex++) {
            let radioButtonNode = document.createElement("input");
            radioButtonNode.className = "m-1";
            radioButtonNode.type = "radio";
            radioButtonNode.name = "radioGroup_" + rowElement["Id"];
            radioButtonNode.id =
              "radioGroup_" + rowElement["Id"] + "_button_" + radioGroupIndex.toString(); //id correspond to tabledic dict Id, radioGroupIndex (0,1,2,3) coresponds to which radio button it is in the radio group
            radioButtonNode.value =
              "radioGroup_" + rowElement["Id"] + "_button_" + radioGroupIndex.toString();
            if (radioGroupIndex == 0) {
              radioButtonNode.checked = true; // set the first radiobutton in radiogroup as default
            }
            radioGroupNode.appendChild(radioButtonNode);
          }
          // end create the 4 radiobuttons
    
          trNode.append(radioGroupNode);
    
          tbodyNode.appendChild(trNode);
        });
        tableNode.appendChild(tbodyNode);
   
        this.tableDiv.appendChild(tableNode)
    }

                /*
  tableView()
  EXPLANATION: Creates the view for errorsDiv. Multiple erros can be shown at once.
  REMARKS: none
    */

    public errorsView(errorMessages:Array<string>):void{
        this.errorDiv.textContent =""
        let errorsDiv = document.createElement("div");

        errorMessages.forEach(errorMessage => { // create for each error message a new bootstrap div
            let errorDiv = document.createElement("div");
            errorDiv.className = "p-3 bg-warning"
            errorDiv.innerText = errorMessage
            errorsDiv.appendChild(errorDiv)
        });

        this.errorDiv.appendChild(errorsDiv)
    }
                /*
  createButton()
  EXPLANATION: Method used by buttonsView() to create the start,stop,sendOnce and update button. I used
  a seperate method to prevent code duplication
  REMARKS: none
    */
    private createButton(className: string, innerText: string, id: string) {
        let button = document.createElement("button");
        button.className = className;
        button.innerText = innerText;
        button.id = id;
        return button;
      }

                /*
  buttonsView()()
  EXPLANATION: Creates the stop,start,update and sendOnce button
  REMARKS: Make "btn btn-primary mr-1" a constant, to prevent code duplication
    */
    public buttonsView(){
        this.buttonsDiv.textContent =""
        let updateButton = this.createButton(
          "btn btn-primary mr-1",
          "update",
          "updateButton"
        );
        let startButton = this.createButton(
          "btn btn-primary mr-1",
          "start",
          "startButton"
        );
        let stopButton = this.createButton(
          "btn btn-primary mr-1",
          "stop",
          "stopButton"
        );
        let sendOnceButton = this.createButton(
          "btn btn-primary mr-1",
          "sendOnce",
          "sendOnceButton"
        );
    
        const buttons = document.createElement("div");
        buttons.appendChild(startButton);
        buttons.appendChild(updateButton);
        buttons.appendChild(stopButton);
        buttons.appendChild(sendOnceButton);
        this.buttonsDiv.appendChild(buttons)

    }

                /*
  statusView()()
  EXPLANATION: Creates the view for statusDiv
  REMARKS: Only two different messages are ever used,  "threads stopped" and "threads started",
  next hard code these messages in this function. To prevent spelling mistakes each this methods is
  used.
    */
    public statusView(message:string):void{
        this.statusDiv.textContent = ""
        let status = document.createElement("div");
        status.innerText = message;
        this.statusDiv.appendChild(status)
    }


}