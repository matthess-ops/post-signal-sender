
import {Helpers} from "./Helpers"


         /*
  Validation Class
  EXPLANATION: This class validates the fileupload text and ipAdress input. If a validation failes
  it saves an appropiate errorMessage.
  REMARKS:  Maybe split ipAdress and tableText validation in seperate classes
    */


export class Validation{
    // all available errorMessages. For testing purposes put this method on public
    public errorMessages: { [id: string] : string; } = {
        textIsEmpty: "The uploaded file does not contain any text",
        delimeterIsNotFound: "The ; delimiter is not found in the uploaded text",
        onlyOneRow: "The uploaded file only contains one row, should be least two a header row and one or multiple data rows",
        noIdHeader: "The uploaded file does not contain an Id header in the header row, the header row should be the first row",
        noIpAdress: "Enter ip adress",
        ipAdressIsInWrongFormat: "The entered ipAdress is not valid." 
      }

    private textErrors:Array<string> = []
    private ipErrors:Array<string> =[]
    private tableText:string;
    private ipAdress:string;
         /*
  hasIpAdress()
  EXPLANATION: Validates if an ipAdress is entered
  REMARKS:  none
    */
    private hasIpAdress():boolean{
        if(this.ipAdress == "" || this.ipAdress == undefined){
            this.ipErrors.push(this.errorMessages.noIpAdress)

            return false
        }else{
            return true
        }
    }
         /*
  isIpAdressCorrect()
  EXPLANATION: checks if the ipAdress is in the correct format
  REMARKS:  none
    */
    private isIpAdressCorrect():boolean{

        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      const resultCheck = pattern.test(this.ipAdress);
      if ( resultCheck == true){
          return true
      }else{
        this.ipErrors.push(this.errorMessages.ipAdressIsInWrongFormat)

          return false
      }

    }
         /*
  validateIpAdress()
  EXPLANATION: validates the ipAdress for hasipAdress() and isIpAdressCorrect()
  REMARKS:  none
    */
    public validateIpAdress(ipAdress):boolean{
        this.ipErrors = []
        this.ipAdress = ipAdress
        if(this.hasIpAdress() ==true){
            if(this.isIpAdressCorrect() == true){
                return true
            }else{
                return false
            }
        }else{
            return false
        }
    }
         /*
  validationErrors()
  EXPLANATION: concatenates and returns the tableText and ipAdress validation ErrorMessages
  REMARKS:  none
    */
    get validationErrors():Array<string>{
      
        return this.ipErrors.concat(this.textErrors)
    }

             /*
  fileNotEmpty()
  EXPLANATION: checks if the uploaded text file contains any text
  REMARKS:  none
    */
    private fileNotEmpty():boolean{
        if(this.tableText ==""){
            this.textErrors.push(this.errorMessages.textIsEmpty)

            return false
        }else{
            return true
        }
    }
             /*
  hasDelimiter()
  EXPLANATION: checks if the uploaded text has the ";" delimeter
  REMARKS: Problem with this function is if a row cell contain a value that has ";" delimiter
    */
    private hasDelimiter():boolean{
        const tableRows = this.tableText.split(";")
        
        if(tableRows.length >1){
            return true
        }else{
            this.textErrors.push(this.errorMessages.delimeterIsNotFound)

            return false
        }

    }


             /*
  hasMoreThanOneRow()
  EXPLANATION: checks if the uploaded table consist out of more than one row, a valid table
  should contain a header row and at least one data row.
  REMARKS: none
    */
    private hasMoreThanOneRow():boolean{
        let tableArray = new Helpers().tableTextToArray(this.tableText)
        if(tableArray.length > 1){
            return true
        }else{
            this.textErrors.push(this.errorMessages.onlyOneRow)

            return false
        }
    }

            /*
  hasIdHeader()
  EXPLANATION: checks if the first row of the table array contains a cell value with a string of "Id"
  REMARKS: none
    */
    private hasIdHeader():boolean{
        let tableArray = new Helpers().tableTextToArray(this.tableText.slice(0,-1))
        let headerFound = false
        const headers = tableArray[0]
        headers.forEach(header => {
            if(header == "Id"){
                headerFound = true
            }
        });

        if(headerFound == false){
            this.textErrors.push(this.errorMessages.noIdHeader)

        }

        return headerFound
    }
            /*
  validateText()
  EXPLANATION: Validates the uploaded textfile (tableText) for all text associated checks. 
  REMARKS: none
    */
    public validateText(tableText:string):boolean{
        this.tableText =  tableText
        this.textErrors = []
        if(this.fileNotEmpty() == true){
            if(this.hasDelimiter() == true){
                // const tableTextToArray =  new Helpers().tableTextToArray(this.tableText)
                if(this.hasMoreThanOneRow() == true){
                    if(this.hasIdHeader() == true){
                        return true
                    }else{
                        return false
                    }

                }else{
                    return false
                }
            }else{
                return false
            }
        }else{
            return false
        }
    }
}