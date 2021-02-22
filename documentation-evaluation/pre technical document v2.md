Goal:

Create an app that sends one or more post requests to an ipAdress at the user specified time intervals (30, 60, 120 and 150 seconds). 

The user uploads an table in cvs format (; delimited). After upload of the file the content of the file needs to checked for the following, is the file empty, is the file ; delimited, does the file contain more than one row, does the first row contain
a column header "id". 

Also the user needs to enter an ipAdress. If the ipAdress is correct and the file passes all the checks. Then for each row in the table an html table row element is generated, containing the data of the rows plus four radio buttons, of which the first is default. The first radio button corresponds to an time interval of 30 seconds, the second 60, third 120 and the fourth 150 seconds. Also the ipAdress is saved to localstorage. And the table data is first converted to json and then also saved in localStorage

Under the table 3 buttons are created, a start,stop and update button. After pressing the start button. The row data plus corresponding radiobutton selections are retrieved. For which each a worker thread is made. These threads send an post request to the entered ipAdress at the user specified radiobutton time interval. The body of a post request is the row data, converted to json.

the stop button is responsable for stopping all the worker threads. The update button, stops the threads followed by creating new threads.

Above the buttons an html element (status element) is created that shows, if the threads are running or not. 

If the threads are running. And the ipAdress is changed, the ipAdress is checked and updated and the threads are stopped and the status element updated to stopped.

IF the threads are running. And the new file is uploaded. The threads are stopped. The html table, buttons and status element are updated. 

If the ipAdress check and or the file checks dont pass. Then instead of the html table an corresponding error message is shown.

On page load, localStorage is checked for an ipAdress and the table json data. For which then an html table is generated. The buttons and the status element.

All this should be made responsive, bootstrap

html document layout

1: header
2a: div container = fileupload and ipadress input element
2b: div container id = "errors_div" 

3: div container id = "table_div" 
4: div container id = "status_div"
4: div container id = "buttons_div"



Processes/sequence

proces 1: on page load

1A1: check localstorage for and ipAdress and table.json

1B1: if ipAdress and table.json exists
1B2: read the ipAdress and table.json data
1B3: stop post threads if they are running
1B4: create the html table and radiobuttons ->table_div
1B5: create the status element -> status_div
1B6: create the start,stop and update button ->button_div

1C1: if ipadress and table.json doest not exists
1C2: do nothing, wait for user input

process 2: ipAdress is entered

2A1: stop threads
2A2: check ipAdress is correct

2B1: if ipAdress is not correct
2B2: remove buttons
2B2: creact error message (ipAdresss is not correct)

2C1: if ipAdress is correct
2C2: update ipAdress

process 3: file upload

3A1: stop threads
3A2: check file upload, is text empty, is delimiter ;, contain more than one row, id header exists

3B1: if file is good:
3B2: check if ipAdress exists

3B2A1: if ipAdress does not exists show error message enter ipAdress

3B2B1: if ipAdress exists
3B2B2: create the html table and radiobuttons ->table_div
3B2B3: create the status element -> status_div
3B2B4: create the start,stop and update button ->button_div

process 4: start button

4A1: if start button is pressed
4A2 stop threads
4A3: retrieve html table and radiobuttons data
4A4: for each html table row and radiobutton set create a postthread
4A5: run the postthreads
4A6: create the status element -> status_div

process 5: update button // i can use the start button process here

4A1: if update button is pressed
4A2 stop threads
4A3: retrieve html table and radiobuttons data
4A4: for each html table row and radiobutton set create a postthread
4A5: run the postthreads
4A6: update the status element -> status_div

process 6: stop button

6A1: if stop button is pressed.
6A2: stop threads
6A3: update the status element -> status_div 

process 7: send once button

7A1: if sendOnce button is pressed
7A2 stop threads
7A3: retrieve html table and radiobuttons data
7A4: create for first row in html table and radiobuttons data a postthreads
7A5: run threads





    
        

