   /*
  LocalStorageData class
  EXPLANATION: This class is responsible for checking,reading and writing ipAdress and tableText to localStorage.
  REMARKS:  none
    */
export class LocalStorageData{
       /*
  hasLocalData()
  EXPLANATION: Checks if localStorage has data. 
  REMARKS:  none
    */
    public hasLocalData():boolean{
        if(localStorage.getItem("tableText") != undefined){
            return true
        }else{
            return false
        }
    }
       /*
  readLocalData()
  EXPLANATION: read tableText and ipAdress from localstorage
  REMARKS:  none
    */
    public readLocalData():Array<string>{
        return [localStorage.getItem("tableText"),localStorage.getItem("ipAdress")]
      
    }

    public writeLocalData(tableText:string,ipAdress:string){
        localStorage.setItem("ipAdress",ipAdress)
        localStorage.setItem("tableText",tableText)

    }


}