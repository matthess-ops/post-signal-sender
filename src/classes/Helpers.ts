 /*
  Helpers class 
  EXPLANATION: This class contains methods that are used for converting the tableText to a table text two-dimensional
  array (first array contains the table row, the second the table row value.). And to convert the table two-dimensional
  array to an table dict array (were each table row is a dict). Also it contains a method that is needed to read the radioButton groups input states. Each group can have
  one of 4 states.
  REMARKS: General remark maybe reshuffle all app methods in other classes. Maybe go for a more app component layout.
  For example, put every method  that is needed for the inputDiv to work in one class. 
    */



export class Helpers {

 /*
  tableTextToArray
  EXPLANATION: converts the tableText to an two-dimensional array
  REMARKS:  none
    */

  
  public tableTextToArray(tableText:string) {
    let tableArray = [];
    let tableRows = tableText.replace(/\n$/, "").split("\n"); // split rows, slice is done to remove last newline because else this will result in an empty array
    tableRows.forEach((tableRow) => {
      let tableRowCellValues = tableRow.split(";"); // split colums
      tableArray.push(tableRowCellValues);
    });
    return tableArray;
  }

   /*
  tableTextToDict
  EXPLANATION: converts the tableText to an array of dictionaries. Where
  each dictionary in the array is a tableRow.
  REMARKS:  none
    */

  public tableTextToDict(tableText:string):Array<{}> {
    let tableArray = this.tableTextToArray(tableText);
    const headers = tableArray[0]; // these are the headers, these headers most contain an "Id" header.
    const tableRows = tableArray.slice(1); // remove the first row, because there are the headers
    let tableDict = [];
    for (let i = 0; i < tableRows.length; i++) {
      // loop throught row

      const tableRow = tableRows[i];

     
        let tableRowDict = {};
        for (let j = 0; j < tableRow.length; j++) {
          // loop through row elements
          const tableRowCellValue = tableRow[j];
          tableRowDict[headers[j]] = tableRowCellValue; // row element is added as value, header is the key
        }
        tableDict.push(tableRowDict);
    }
    return tableDict;
  }
   /*
  readRadioButtonStatus
  EXPLANATION: This methods loops throught all the radioButtons and saves the checked radioButtons. 
  Since each radio button value is labeled with an table row Id and which of the 4 radioButtons it is
  from the corresponding radiobutton group. Only the checked radioButtons have to be search to get the timeinterval
  value (1,2,3,4) for each table row/radiobutton group.
  REMARKS:  none
    */

  public readRadioButtonStatus(): Array<string> {
    const radioButtons = document.querySelectorAll("input");
    const checkedRadioButtons = [];

    if (radioButtons != undefined) { // there shouldnt be undefined radioButtons, because each button has a default on creationg
      radioButtons.forEach((radioButton) => {
        if (radioButton.type == "radio" && radioButton.checked == true) {
          checkedRadioButtons.push(radioButton.value);
        }
      });
    }
    return checkedRadioButtons;
  }
}
