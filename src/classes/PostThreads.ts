/*
  class postThreads
  EXPLANATION: This class creates/stores/interacts with the workerThreads. Each workerThread
  is a single post request, where each post request corresponds to a tableRow from the uploaded
  tableText 
  REMARKS:
    */



export class PostThreads {
  // array that stores all the current worker threads
  private workerThreads = [];

  // the radiobuttons input consists out of several timeintervals identifiers. This dictionary is used
  // to convert these timeinterval identifiers to their corresponding seconds.
  private secondsTowait = {
    zero: 15,
    one: 30,
    two: 60,
    three: 120,
  };
  private ipAdress;

  /*
  stop()
  EXPLANATION: methods that terminates all the worker threads
  REMARKS: none
    */
  public stop(): void {
    if (this.workerThreads != undefined) {
      this.workerThreads.forEach((workerThread) => {
        workerThread.terminate();
      });
    }
  }

    /*
  sendOnce()
  EXPLANATION: This method immediately sends one tableRowDict..
  REMARKS: In ButtonEvents.ts this method is called always with the first tableRowDict out of the tableDict array
  ,thus in principle you could set tableDict as a class variable directly. And only send the first tableRowDict (tableDict[0])
  in this method.
    */

  public sendOnce(tableRowDict:{}):void {
    fetch(this.ipAdress, {
      method: "POST",
      mode: "no-cors", // "no-cors is needed if you send data to another server"
      body: JSON.stringify(tableRowDict), // can only send string thus the table
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log("Request complete! response:", res);
    });
  }


  setIpAdress(ipAdressIn:string) {
    this.ipAdress = ipAdressIn;
  }

  /*
  start()
  EXPLANATION: For each tableRowDict in tableDict the corresponding radioButton group data is found by matching the ids.
  Then the radiobutton group selection , which can be a string of 0,1,2,3 is converted to their corresponding seconds  value
  with the help of the secondsTowait dictionary. The seconds value is then added as the "timeInterval" key to the tableRowDict.
  After this a workerThread is created, started and saved (this.workerThreads) for each tableRowDict in tableDict.
  REMARKS:
    */
  public  start(radioButtonsData:Array<string>, tableDict:Array<{}>):void {
    let workerThreadData = [];

    tableDict.forEach((tableRowDict) => {
      radioButtonsData.forEach((radioButtonData) => {
        const id = radioButtonData.split("_")[1];
        const selection = radioButtonData.split("_")[3];

        if (id == tableRowDict["Id"]) {
          let updatedTableDict = tableRowDict;
          if (selection == "0") {
            updatedTableDict["timeInterval"] = this.secondsTowait.zero;
          } else if (selection == "1") {
            updatedTableDict["timeInterval"] = this.secondsTowait.one;
          } else if (selection == "2") {
            updatedTableDict["timeInterval"] = this.secondsTowait.two;
          } else if (selection == "3") {
            updatedTableDict["timeInterval"] = this.secondsTowait.three;
          }
          workerThreadData.push(updatedTableDict);
        }
      });
    });

    this.stop();
    workerThreadData.forEach((element) => {
      let worker = new Worker("./Worker.ts");
      worker.postMessage([element, this.ipAdress]);
      this.workerThreads.push(worker);
    });
  }
}
