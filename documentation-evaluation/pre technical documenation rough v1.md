


-Inputs

start button (eventlistner)
in = radiobuttons states, tabledict, ipadress
calculation: create from radiobutons states and tabledict the new tabledict
out = postthreads.run( new tableDict with timeintervals, ipadress)

stopbutton eventlistner
in = nothing
calculation = nothing
out = postthreads.stop

update eventlistner: // same as start button
in = radiobuttons states, tabledict, ipadress
calculation: create from radiobutons states and tabledict the new tabledict
out = postthreads.run( new tableDict with timeintervals, ipadress)

sendOnce eventlistner: 
in = radiobuttons states, tabledict, ipadress
calculation: create from radiobutons states and tabledict the new tabledict
out = postthreads.sendOnce( send first row new table dict and ipAdress)

ipAdress eventlister:
in = ipAdress string
calculation: check is ipAdress is correct
other actions: stop threads, change threads output visual to stopped
out= true

fileUpload eventlistner:
in = filename
calculation: convert filename to text
other actions: clear table,buttons, stop threads, change threads output visual to stopped
out = text

onPageload eventlistner
in = nothing
calculation: check localstorage for previous ip and tableDict.
out = nothing


CHECKS/ VALIDATION

- check if ipadress is added
- check ipadress is correct
- check if file is not empty
- check if file has correct delimiter 
- check if file has table with more than one row
- check if table has Id header


visualOuts

- create the table view with the radiobuttons
- create the buttons view
- add the correct ipAdress to ipAdressInputElement
- create the error views
- show if threads are running or stopped.


other functions
- convert file text to two dimensional array table
- convert tow dimensional array table to dict
- check localstorage for previous ip adress
- check localstorage for previous dict


processes

process 1: on page load check localStorage:

1-A-1: if localstorage has ipadress and dict data
1-A-2: create bootstrap table with radiobuttons
1-A-3: create the buttons

1-B-1: no localstorage ipadress and dict, do nothing

process 2: on file upload

2-A-1 stop threads 
2-A-1: check ip is added, check ip is correct, file is not empty, file has correct delim, has table with more than one row, check if Id header exists.
2-A-1: check ipAdress exists and if it is correct
2-A-2: if checks failed display the error messages

2B1: if checks are good create the bootstrap table with radiobuttons
2B2: create the buttons

process 3: ipAdress input field changed

3A1: stop the threads, update threads running to threads stopped
3A2: check ipAdress is correct
3A3: if ipadress is not correct, show error message thus remove table also remove buttons

3B1: if ipadress is correct, update the ipaddress

process 4: start button
4A1: stop threads
4A2: create threads
4A3: run threads

process 5: stop button
5A1: stop threads

process 6 update button:

6A1: stop threads
6A2: retrieve radiobutton data, which of the 4 states
6A3: create threads
6A4: run threads


process 7 update button:

7A1: stop threads
7A2: retrieve radiobutton data, which of the 4 states
7A2: create threads
7A3: run threads


classes

    class Validation

        checkIpAdressForErrors() // maybe class IpAdrres.checkForErrors()
            - check if ipadress is added
            - check ipadress is correct
        checkFileForErrors() // class File.checkForErrors()
            - check if file is not empty
            - check if file has correct delimiter 
            - check if file has table with more than one row
            - check if table has Id header

    class Input:
        -startButton click
        -stopButton click
        -updateButton click
        -sendOnceButton click
        -fileUpload change
        -onPageLoad change
        -ipAdress change

    class Views
    - create the table view with the radiobuttons
    - create the buttons view
    - add the correct ipAdress to ipAdressInputElement
    - create the error views
    - show if threads are running or stopped.


    class PostThreads
        - create the threads
        -run threads
        -stop threads

    class LocalStorage
        - save data
        - read data







