// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/classes/LocalStorageData.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocalStorageData = void 0;
/*
LocalStorageData class
EXPLANATION: This class is responsible for checking,reading and writing ipAdress and tableText to localStorage.
REMARKS:  none
 */

var LocalStorageData =
/** @class */
function () {
  function LocalStorageData() {}
  /*
  hasLocalData()
  EXPLANATION: Checks if localStorage has data.
  REMARKS:  none
  */


  LocalStorageData.prototype.hasLocalData = function () {
    if (localStorage.getItem("tableText") != undefined) {
      return true;
    } else {
      return false;
    }
  };
  /*
  readLocalData()
  EXPLANATION: read tableText and ipAdress from localstorage
  REMARKS:  none
  */


  LocalStorageData.prototype.readLocalData = function () {
    return [localStorage.getItem("tableText"), localStorage.getItem("ipAdress")];
  };

  LocalStorageData.prototype.writeLocalData = function (tableText, ipAdress) {
    localStorage.setItem("ipAdress", ipAdress);
    localStorage.setItem("tableText", tableText);
  };

  return LocalStorageData;
}();

exports.LocalStorageData = LocalStorageData;
},{}],"src/classes/PostThreads.ts":[function(require,module,exports) {
"use strict";
/*
  class postThreads
  EXPLANATION: This class creates/stores/interacts with the workerThreads. Each workerThread
  is a single post request, where each post request corresponds to a tableRow from the uploaded
  tableText
  REMARKS:
    */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostThreads = void 0;

var PostThreads =
/** @class */
function () {
  function PostThreads() {
    // array that stores all the current worker threads
    this.workerThreads = []; // the radiobuttons input consists out of several timeintervals identifiers. This dictionary is used
    // to convert these timeinterval identifiers to their corresponding seconds.

    this.secondsTowait = {
      zero: 15,
      one: 30,
      two: 60,
      three: 120
    };
  }
  /*
  stop()
  EXPLANATION: methods that terminates all the worker threads
  REMARKS: none
    */


  PostThreads.prototype.stop = function () {
    if (this.workerThreads != undefined) {
      this.workerThreads.forEach(function (workerThread) {
        workerThread.terminate();
      });
    }
  };
  /*
  sendOnce()
  EXPLANATION: This method immediately sends one tableRowDict..
  REMARKS: In ButtonEvents.ts this method is called always with the first tableRowDict out of the tableDict array
  ,thus in principle you could set tableDict as a class variable directly. And only send the first tableRowDict (tableDict[0])
  in this method.
  */


  PostThreads.prototype.sendOnce = function (tableRowDict) {
    fetch(this.ipAdress, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(tableRowDict),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function (res) {
      console.log("Request complete! response:", res);
    });
  };

  PostThreads.prototype.setIpAdress = function (ipAdressIn) {
    this.ipAdress = ipAdressIn;
  };
  /*
  start()
  EXPLANATION: For each tableRowDict in tableDict the corresponding radioButton group data is found by matching the ids.
  Then the radiobutton group selection , which can be a string of 0,1,2,3 is converted to their corresponding seconds  value
  with the help of the secondsTowait dictionary. The seconds value is then added as the "timeInterval" key to the tableRowDict.
  After this a workerThread is created, started and saved (this.workerThreads) for each tableRowDict in tableDict.
  REMARKS:
    */


  PostThreads.prototype.start = function (radioButtonsData, tableDict) {
    var _this = this;

    var workerThreadData = [];
    tableDict.forEach(function (tableRowDict) {
      radioButtonsData.forEach(function (radioButtonData) {
        var id = radioButtonData.split("_")[1];
        var selection = radioButtonData.split("_")[3];

        if (id == tableRowDict["Id"]) {
          var updatedTableDict = tableRowDict;

          if (selection == "0") {
            updatedTableDict["timeInterval"] = _this.secondsTowait.zero;
          } else if (selection == "1") {
            updatedTableDict["timeInterval"] = _this.secondsTowait.one;
          } else if (selection == "2") {
            updatedTableDict["timeInterval"] = _this.secondsTowait.two;
          } else if (selection == "3") {
            updatedTableDict["timeInterval"] = _this.secondsTowait.three;
          }

          workerThreadData.push(updatedTableDict);
        }
      });
    });
    this.stop();
    workerThreadData.forEach(function (element) {
      var worker = new Worker("/Worker.635e742c.js");
      worker.postMessage([element, _this.ipAdress]);

      _this.workerThreads.push(worker);
    });
  };

  return PostThreads;
}();

exports.PostThreads = PostThreads;
},{"./Worker.ts":[["Worker.635e742c.js","src/classes/Worker.ts"],"Worker.635e742c.js.map","src/classes/Worker.ts"]}],"src/classes/Views.ts":[function(require,module,exports) {
"use strict";
/*
views class
EXPLANATION: creates the views for errorDiv,buttonDiv,statusDiv, tableDiv
REMARKS: none
*/

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Views = void 0;

var Views =
/** @class */
function () {
  function Views() {
    // set public for 
    this.errorDiv = document.getElementById("errorDiv");
    this.tableDiv = document.getElementById("tableDiv");
    this.statusDiv = document.getElementById("statusDiv");
    this.buttonsDiv = document.getElementById("buttonsDiv");
  }
  /*
  clearNonStaticViews()
  EXPLANATION: clear the errorDiv,buttonDiv,statusDiv, tableDiv
  REMARKS: none
  */


  Views.prototype.clearNonStaticViews = function () {
    this.errorDiv.textContent = "";
    this.tableDiv.textContent = "";
    this.statusDiv.textContent = "";
    this.buttonsDiv.textContent = "";
  };
  /*
  tableView()
  EXPLANATION: creates all the elements needed for the html table. The html table exists out
  of rows, where each row is a dict from the tableDict array. Also each row has a radio button group
  containing 4 radioButtons. Each button in a radiogroup has a value as followed "radiogroup_1_button_2",
  the 1, corresponds to the Id of the dict in tableDict. The 2 corresponds to the second button in the radioGroup
  of this row.
  REMARKS: none
  */


  Views.prototype.tableView = function (tableDict) {
    this.tableDiv.textContent = ""; // clear tableDiv

    var tableNode = document.createElement("table"); // table parent element

    tableNode.className = "table"; // start header colums

    var theadNode = document.createElement("thead");
    var theadTrNode = document.createElement("tr");
    var dictKeys = Object.keys(tableDict[0]);
    dictKeys.forEach(function (dictkey) {
      var theadTrThNode = document.createElement("th");
      theadTrThNode.innerText = dictkey;
      theadTrThNode.scope = "col";
      theadTrNode.appendChild(theadTrThNode);
    });
    theadNode.appendChild(theadTrNode);
    tableNode.appendChild(theadNode); // end header colums
    // begin tbody

    var tbodyNode = document.createElement("tbody");
    tableDict.forEach(function (rowElement) {
      var trNode = document.createElement("tr");
      dictKeys.forEach(function (dictKey) {
        var tdNode = document.createElement("td");
        tdNode.innerText = rowElement[dictKey];
        trNode.appendChild(tdNode);
      }); // create the 4 radiobuttons

      var radioGroupNode = document.createElement("td");
      radioGroupNode.className = "form-check form-check-inline";

      for (var radioGroupIndex = 0; radioGroupIndex < 4; radioGroupIndex++) {
        var radioButtonNode = document.createElement("input");
        radioButtonNode.className = "m-1";
        radioButtonNode.type = "radio";
        radioButtonNode.name = "radioGroup_" + rowElement["Id"];
        radioButtonNode.id = "radioGroup_" + rowElement["Id"] + "_button_" + radioGroupIndex.toString(); //id correspond to tabledic dict Id, radioGroupIndex (0,1,2,3) coresponds to which radio button it is in the radio group

        radioButtonNode.value = "radioGroup_" + rowElement["Id"] + "_button_" + radioGroupIndex.toString();

        if (radioGroupIndex == 0) {
          radioButtonNode.checked = true; // set the first radiobutton in radiogroup as default
        }

        radioGroupNode.appendChild(radioButtonNode);
      } // end create the 4 radiobuttons


      trNode.append(radioGroupNode);
      tbodyNode.appendChild(trNode);
    });
    tableNode.appendChild(tbodyNode);
    this.tableDiv.appendChild(tableNode);
  };
  /*
  tableView()
  EXPLANATION: Creates the view for errorsDiv. Multiple erros can be shown at once.
  REMARKS: none
  */


  Views.prototype.errorsView = function (errorMessages) {
    this.errorDiv.textContent = "";
    var errorsDiv = document.createElement("div");
    errorMessages.forEach(function (errorMessage) {
      var errorDiv = document.createElement("div");
      errorDiv.className = "p-3 bg-warning";
      errorDiv.innerText = errorMessage;
      errorsDiv.appendChild(errorDiv);
    });
    this.errorDiv.appendChild(errorsDiv);
  };
  /*
  createButton()
  EXPLANATION: Method used by buttonsView() to create the start,stop,sendOnce and update button. I used
  a seperate method to prevent code duplication
  REMARKS: none
  */


  Views.prototype.createButton = function (className, innerText, id) {
    var button = document.createElement("button");
    button.className = className;
    button.innerText = innerText;
    button.id = id;
    return button;
  };
  /*
  buttonsView()()
  EXPLANATION: Creates the stop,start,update and sendOnce button
  REMARKS: Make "btn btn-primary mr-1" a constant, to prevent code duplication
  */


  Views.prototype.buttonsView = function () {
    this.buttonsDiv.textContent = "";
    var updateButton = this.createButton("btn btn-primary mr-1", "update", "updateButton");
    var startButton = this.createButton("btn btn-primary mr-1", "start", "startButton");
    var stopButton = this.createButton("btn btn-primary mr-1", "stop", "stopButton");
    var sendOnceButton = this.createButton("btn btn-primary mr-1", "sendOnce", "sendOnceButton");
    var buttons = document.createElement("div");
    buttons.appendChild(startButton);
    buttons.appendChild(updateButton);
    buttons.appendChild(stopButton);
    buttons.appendChild(sendOnceButton);
    this.buttonsDiv.appendChild(buttons);
  };
  /*
  statusView()()
  EXPLANATION: Creates the view for statusDiv
  REMARKS: Only two different messages are ever used,  "threads stopped" and "threads started",
  next hard code these messages in this function. To prevent spelling mistakes each this methods is
  used.
  */


  Views.prototype.statusView = function (message) {
    this.statusDiv.textContent = "";
    var status = document.createElement("div");
    status.innerText = message;
    this.statusDiv.appendChild(status);
  };

  return Views;
}();

exports.Views = Views;
},{}],"src/classes/Helpers.ts":[function(require,module,exports) {
"use strict";
/*
 Helpers class
 EXPLANATION: This class contains methods that are used for converting the tableText to a table text two-dimensional
 array (first array contains the table row, the second the table row value.). And to convert the table two-dimensional
 array to an table dict array (were each table row is a dict). Also it contains a method that is needed to read the radioButton groups input states. Each group can have
 one of 4 states.
 REMARKS: General remark maybe reshuffle all app methods in other classes. Maybe go for a more app component layout.
 For example, put every method  that is needed for the inputDiv to work in one class.
   */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Helpers = void 0;

var Helpers =
/** @class */
function () {
  function Helpers() {}
  /*
   tableTextToArray
   EXPLANATION: converts the tableText to an two-dimensional array
   REMARKS:  none
     */


  Helpers.prototype.tableTextToArray = function (tableText) {
    var tableArray = [];
    var tableRows = tableText.replace(/\n$/, "").split("\n"); // split rows, slice is done to remove last newline because else this will result in an empty array

    tableRows.forEach(function (tableRow) {
      var tableRowCellValues = tableRow.split(";"); // split colums

      tableArray.push(tableRowCellValues);
    });
    return tableArray;
  };
  /*
  tableTextToDict
  EXPLANATION: converts the tableText to an array of dictionaries. Where
  each dictionary in the array is a tableRow.
  REMARKS:  none
   */


  Helpers.prototype.tableTextToDict = function (tableText) {
    var tableArray = this.tableTextToArray(tableText);
    var headers = tableArray[0]; // these are the headers, these headers most contain an "Id" header.

    var tableRows = tableArray.slice(1); // remove the first row, because there are the headers

    var tableDict = [];

    for (var i = 0; i < tableRows.length; i++) {
      // loop throught row
      var tableRow = tableRows[i];
      var tableRowDict = {};

      for (var j = 0; j < tableRow.length; j++) {
        // loop through row elements
        var tableRowCellValue = tableRow[j];
        tableRowDict[headers[j]] = tableRowCellValue; // row element is added as value, header is the key
      }

      tableDict.push(tableRowDict);
    }

    return tableDict;
  };
  /*
  readRadioButtonStatus
  EXPLANATION: This methods loops throught all the radioButtons and saves the checked radioButtons.
  Since each radio button value is labeled with an table row Id and which of the 4 radioButtons it is
  from the corresponding radiobutton group. Only the checked radioButtons have to be search to get the timeinterval
  value (1,2,3,4) for each table row/radiobutton group.
  REMARKS:  none
   */


  Helpers.prototype.readRadioButtonStatus = function () {
    var radioButtons = document.querySelectorAll("input");
    var checkedRadioButtons = [];

    if (radioButtons != undefined) {
      // there shouldnt be undefined radioButtons, because each button has a default on creationg
      radioButtons.forEach(function (radioButton) {
        if (radioButton.type == "radio" && radioButton.checked == true) {
          checkedRadioButtons.push(radioButton.value);
        }
      });
    }

    return checkedRadioButtons;
  };

  return Helpers;
}();

exports.Helpers = Helpers;
},{}],"src/classes/Validation.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Validation = void 0;

var Helpers_1 = require("./Helpers");
/*
Validation Class
EXPLANATION: This class validates the fileupload text and ipAdress input. If a validation failes
it saves an appropiate errorMessage.
REMARKS:  Maybe split ipAdress and tableText validation in seperate classes
*/


var Validation =
/** @class */
function () {
  function Validation() {
    // all available errorMessages. For testing purposes put this method on public
    this.errorMessages = {
      textIsEmpty: "The uploaded file does not contain any text",
      delimeterIsNotFound: "The ; delimiter is not found in the uploaded text",
      onlyOneRow: "The uploaded file only contains one row, should be least two a header row and one or multiple data rows",
      noIdHeader: "The uploaded file does not contain an Id header in the header row, the header row should be the first row",
      noIpAdress: "Enter ip adress",
      ipAdressIsInWrongFormat: "The entered ipAdress is not valid."
    };
    this.textErrors = [];
    this.ipErrors = [];
  }
  /*
  hasIpAdress()
  EXPLANATION: Validates if an ipAdress is entered
  REMARKS:  none
  */


  Validation.prototype.hasIpAdress = function () {
    if (this.ipAdress == "" || this.ipAdress == undefined) {
      this.ipErrors.push(this.errorMessages.noIpAdress);
      return false;
    } else {
      return true;
    }
  };
  /*
  isIpAdressCorrect()
  EXPLANATION: checks if the ipAdress is in the correct format
  REMARKS:  none
  */


  Validation.prototype.isIpAdressCorrect = function () {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    var resultCheck = pattern.test(this.ipAdress);

    if (resultCheck == true) {
      return true;
    } else {
      this.ipErrors.push(this.errorMessages.ipAdressIsInWrongFormat);
      return false;
    }
  };
  /*
  validateIpAdress()
  EXPLANATION: validates the ipAdress for hasipAdress() and isIpAdressCorrect()
  REMARKS:  none
  */


  Validation.prototype.validateIpAdress = function (ipAdress) {
    this.ipErrors = [];
    this.ipAdress = ipAdress;

    if (this.hasIpAdress() == true) {
      if (this.isIpAdressCorrect() == true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  Object.defineProperty(Validation.prototype, "validationErrors", {
    /*
    validationErrors()
    EXPLANATION: concatenates and returns the tableText and ipAdress validation ErrorMessages
    REMARKS:  none
    */
    get: function get() {
      return this.ipErrors.concat(this.textErrors);
    },
    enumerable: false,
    configurable: true
  });
  /*
  fileNotEmpty()
  EXPLANATION: checks if the uploaded text file contains any text
  REMARKS:  none
  */

  Validation.prototype.fileNotEmpty = function () {
    if (this.tableText == "") {
      this.textErrors.push(this.errorMessages.textIsEmpty);
      return false;
    } else {
      return true;
    }
  };
  /*
  hasDelimiter()
  EXPLANATION: checks if the uploaded text has the ";" delimeter
  REMARKS: Problem with this function is if a row cell contain a value that has ";" delimiter
  */


  Validation.prototype.hasDelimiter = function () {
    var tableRows = this.tableText.split(";");

    if (tableRows.length > 1) {
      return true;
    } else {
      this.textErrors.push(this.errorMessages.delimeterIsNotFound);
      return false;
    }
  };
  /*
  hasMoreThanOneRow()
  EXPLANATION: checks if the uploaded table consist out of more than one row, a valid table
  should contain a header row and at least one data row.
  REMARKS: none
  */


  Validation.prototype.hasMoreThanOneRow = function () {
    var tableArray = new Helpers_1.Helpers().tableTextToArray(this.tableText);

    if (tableArray.length > 1) {
      return true;
    } else {
      this.textErrors.push(this.errorMessages.onlyOneRow);
      return false;
    }
  };
  /*
  hasIdHeader()
  EXPLANATION: checks if the first row of the table array contains a cell value with a string of "Id"
  REMARKS: none
  */


  Validation.prototype.hasIdHeader = function () {
    var tableArray = new Helpers_1.Helpers().tableTextToArray(this.tableText.slice(0, -1));
    var headerFound = false;
    var headers = tableArray[0];
    headers.forEach(function (header) {
      if (header == "Id") {
        headerFound = true;
      }
    });

    if (headerFound == false) {
      this.textErrors.push(this.errorMessages.noIdHeader);
    }

    return headerFound;
  };
  /*
  validateText()
  EXPLANATION: Validates the uploaded textfile (tableText) for all text associated checks.
  REMARKS: none
  */


  Validation.prototype.validateText = function (tableText) {
    this.tableText = tableText;
    this.textErrors = [];

    if (this.fileNotEmpty() == true) {
      if (this.hasDelimiter() == true) {
        // const tableTextToArray =  new Helpers().tableTextToArray(this.tableText)
        if (this.hasMoreThanOneRow() == true) {
          if (this.hasIdHeader() == true) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return Validation;
}();

exports.Validation = Validation;
},{"./Helpers":"src/classes/Helpers.ts"}],"src/classes/ButtonEvents.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ButtonEvents = void 0;

var Helpers_1 = require("./Helpers");

var Views_1 = require("./Views");
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


var ButtonEvents =
/** @class */
function () {
  /*
  constructor()
  EXPLANATION: postThreads methods are used after the evenlistners are triggerd. tableDict
  is used as argument in some postThreads methods
  REMARKS: could set tableDict directly in PostThreads, however the PostThreads.sendOnce method
  would need to be rewritten. See PostThreads.ts for more information
    */
  function ButtonEvents(postThreads, tableDict) {
    this.startButton = document.getElementById("startButton");
    this.stopButton = document.getElementById("stopButton");
    this.updateButton = document.getElementById("updateButton");
    this.sendOnceButton = document.getElementById("sendOnceButton");
    this.helpers = new Helpers_1.Helpers();
    this.views = new Views_1.Views();
    this.postThreads = postThreads;
    this.tableDict = tableDict;
  }
  /*
  startListners()
  EXPLANATION: launches the button event listners
  REMARKS: none
    */


  ButtonEvents.prototype.startListners = function () {
    this.startButtonInput();
    this.stopButtonInput();
    this.updateButtonInput();
    this.sendOnceButtonInput();
  };
  /*
  startButtonInput()
  EXPLANATION: stop the current running threads, before launching new threads.
  REMARKS: none
    */


  ButtonEvents.prototype.startButtonInput = function () {
    var _this = this;

    this.startButton.addEventListener("click", function () {
      _this.postThreads.stop();

      _this.postThreads.start(_this.helpers.readRadioButtonStatus(), _this.tableDict);

      _this.views.statusView("threads running");
    });
  };
  /*
  updateButtonInput()
  EXPLANATION: stops the current running threads, before launchin the newly updated threads
  REMARKS: This function is exactly the same as startButtonInput, thus the redundant code
  should be but in a seperate methods, which can be used by bot startButtonInput and updateButtoninput
    */


  ButtonEvents.prototype.updateButtonInput = function () {
    var _this = this;

    this.updateButton.addEventListener("click", function () {
      _this.postThreads.stop();

      _this.postThreads.start(_this.helpers.readRadioButtonStatus(), _this.tableDict);

      _this.views.statusView("threads running");
    });
  };
  /*
  sendOnceButtonInput()
  EXPLANATION: After event this function immediatly sends the first tableRowDict (tableDict[0]),
  it is handy to have for immediate debugging to the target app.
  REMARKS: this method could be replaced by only using the funciton sendOnce methods in PostThreads,
  see PostThreads.ts for more information.
    */


  ButtonEvents.prototype.sendOnceButtonInput = function () {
    var _this = this;

    this.sendOnceButton.addEventListener("click", function () {
      _this.postThreads.stop();

      _this.views.statusView("Threads stopped");

      _this.postThreads.sendOnce(_this.tableDict[0]);
    });
  };
  /*
  sendOnceButtonInput()
  EXPLANATION: After event stops the current threads
  REMARKS:none
    */


  ButtonEvents.prototype.stopButtonInput = function () {
    var _this = this;

    this.stopButton.addEventListener("click", function () {
      _this.postThreads.stop();

      _this.views.statusView("Threads stopped");
    });
  };

  return ButtonEvents;
}();

exports.ButtonEvents = ButtonEvents;
},{"./Helpers":"src/classes/Helpers.ts","./Views":"src/classes/Views.ts"}],"src/classes/MainEvents.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MainEvents = void 0;

var LocalStorageData_1 = require("./LocalStorageData");

var PostThreads_1 = require("./PostThreads");

var Views_1 = require("./Views");

var Validation_1 = require("./Validation");

var Helpers_1 = require("./Helpers");

var ButtonEvents_1 = require("./ButtonEvents");
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


var MainEvents =
/** @class */
function () {
  function MainEvents() {
    this.fileUploadInput = document.getElementById("fileUploadInput");
    this.ipAdressInput = document.getElementById("ipAdressInput"); // load all classes that are needed.

    this.localStorageData = new LocalStorageData_1.LocalStorageData(); // for checking,reading,writing to localStorage

    this.postThreads = new PostThreads_1.PostThreads(); // class that stops and starts the post request threads, or sends a single post request

    this.views = new Views_1.Views(); // class that creates views

    this.helpers = new Helpers_1.Helpers(); // class that contain tableText conversions to array and dict. And reads radioButton states

    this.validation = new Validation_1.Validation(); // class that validates the uploaded tableText and ipAdress input

    this.ipAdress = "";
    this.tableText = "";
  }
  /*
  ipAdressInputEvent()
  EXPLANATION: Creates an event listner for ipAdress input. And updated this.ipAdress
  REMARKS:  none
  */


  MainEvents.prototype.ipAdressInputEvent = function () {
    var _this = this;

    this.ipAdressInput = document.getElementById("ipAdressInput");
    this.ipAdressInput.addEventListener("input", function (e) {
      _this.ipAdress = _this.ipAdressInput.value;

      _this.ipAdressAndTextCheck();
    });
  };
  /*
  fileUploadEvent()
  EXPLANATION: creates an event listner for file uploads. And reads the text of the file upload. And it
  updates this.tableText
  REMARKS:  none
  */


  MainEvents.prototype.fileUploadEvent = function () {
    var _this = this;

    this.fileUploadInput.addEventListener("input", function () {
      var reader = new FileReader();
      reader.addEventListener("load", function (e) {
        var tableTextIn = e.target.result.toString();
        _this.tableText = tableTextIn;

        _this.ipAdressAndTextCheck();
      });
      reader.readAsBinaryString(_this.fileUploadInput.files[0]);
    });
  };
  /*
  onPageLoad()
  EXPLANATION: On each page load, on page load should be run. It checks localStorage for an
  tableText and ipAdress. If an tableText and ipAdress exist their class variable this.tableTExt and
  this.ipAdress are updated.
  REMARKS:  none
  */


  MainEvents.prototype.onPageLoad = function () {
    if (this.localStorageData.hasLocalData() == true) {
      var localData = this.localStorageData.readLocalData();
      this.tableText = localData[0];
      this.ipAdress = localData[1];
      this.ipAdressInput.value = this.ipAdress;
      this.ipAdressAndTextCheck();
    }
  };
  /*
  ipAdressInputEvent()
  EXPLANATION: After the 3 main events, this method is called. It validates tableText and ipAdress and
  saves them to localStorage. Then is loads the views for tableDiv, statusDiv and buttonsDiv. Followed by
  launching the event listners for the buttons. If validation fails it loads the view for errorDiv.
  REMARKS:  none
  */


  MainEvents.prototype.ipAdressAndTextCheck = function () {
    var ipAdressValidation = this.validation.validateIpAdress(this.ipAdress);
    var tableTextValidation = this.validation.validateText(this.tableText);
    this.views.clearNonStaticViews();

    if (ipAdressValidation == true && tableTextValidation == true) {
      this.localStorageData.writeLocalData(this.tableText, this.ipAdress);
      this.postThreads.setIpAdress(this.ipAdress);
      var tableDict = this.helpers.tableTextToDict(this.tableText);
      this.views.tableView(tableDict);
      this.views.statusView("Post threads not running");
      this.views.buttonsView();
      var buttonEvents = new ButtonEvents_1.ButtonEvents(this.postThreads, tableDict);
      buttonEvents.startListners();
    } else {
      this.views.errorsView(this.validation.validationErrors);
    }
  };
  /*
  runEvents()
  EXPLANATION: Launching the 3 main events.
  REMARKS:  none
  */


  MainEvents.prototype.runEvents = function () {
    this.onPageLoad();
    this.fileUploadEvent();
    this.ipAdressInputEvent();
  };

  return MainEvents;
}();

exports.MainEvents = MainEvents;
},{"./LocalStorageData":"src/classes/LocalStorageData.ts","./PostThreads":"src/classes/PostThreads.ts","./Views":"src/classes/Views.ts","./Validation":"src/classes/Validation.ts","./Helpers":"src/classes/Helpers.ts","./ButtonEvents":"src/classes/ButtonEvents.ts"}],"src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var MainEvents_1 = require("./classes/MainEvents");

var mainEvents = new MainEvents_1.MainEvents();
mainEvents.runEvents();
},{"./classes/MainEvents":"src/classes/MainEvents.ts"}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51256" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map