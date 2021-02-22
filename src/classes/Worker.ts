/*
  self.onmessage()
  EXPLANATION: Sends each timeInterval seconds a post request to the ipAdress of interest
  REMARKS: none
    */


self.onmessage = e => {

    const tableRowDict = e.data[0]
    const ipAdress =  e.data[1]
    const timeInterval =tableRowDict["timeInterval"]
    setInterval(()=>{
      fetch(ipAdress, {
        method: "POST",
        mode: 'no-cors',
        body: JSON.stringify(tableRowDict),
        headers: {
          'Content-Type': 'application/json'
        },
      
      }).then(res => {
        console.log("Request complete! response:", res);
      });
    
    
    },timeInterval*1000)

   

  };