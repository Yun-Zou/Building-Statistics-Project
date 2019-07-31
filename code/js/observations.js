"use strict";
// create a function which will be activated on a click will perform 

let observationsRef = document.getElementById("observations");
   

retrieveLocal(RoomUsageList_STORAGE_KEY);


let pageRoomUsageList = cloneGlobalRoomUsageList();
for(let i=0;i<pageRoomUsageList.roomList.length;i++)
{
	pageRoomUsageList.roomList[i].globalIndex = i;
}
for(let i=0;i<roomUsageList.roomList.length;i++)
{
	roomUsageList.roomList[i].globalIndex = i;
}


displayRetrievedRoomUsageList();



// Function: displayRetrievedRoomUsageList
//
//
//
function displayRetrievedRoomUsageList() 
{
	if (pageRoomUsageList===undefined)
	{
		observationsRef.innerHTML = `<div class="mdl-cell mdl-cell--4-col">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <tbody>
                                <tr><td class="mdl-data-table__cell--non-numeric">No entries</td></tr>
                            </tbody>
                        </table>
                    </div>`;
        return;
	}
    if (pageRoomUsageList.roomList.length === 0)
    {
        observationsRef.innerHTML = `<div class="mdl-cell mdl-cell--4-col">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <tbody>
                                <tr><td class="mdl-data-table__cell--non-numeric">No entries</td></tr>
                            </tbody>
                        </table>
                    </div>`;
        return;
    }
    // First sort observations according to their date and time.

    let month = ["Jan.","Feb.","Mar.","Apr.","May.","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec."];
    let onOffConverter = new Array();
    onOffConverter[true] = "On"
    onOffConverter[false] = "Off"
    
    let observations = '';
    // This for loop should be able to print new observation onto the observation.html
    // with the newest ones on top of the page.
    for(let i=pageRoomUsageList.roomList.length-1; i>=0; i--)
    {
        
        //Create an array to let a boolean value equal to its corresponding on/off value
        
        
        // create a new block of observation in observation.html
        // each time as in the following format.
        observations += '<div class="mdl-cell mdl-cell--4-col">'
            + '<table class="observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp">'
            + '<thead>'
            + '<tr><th class="mdl-data-table__cell--non-numeric">'
            + '<h4 class="date">'
            + pageRoomUsageList.roomList[i].timeChecked.getDate()+" "+month[pageRoomUsageList.roomList[i].timeChecked.getMonth()]+ "<br/>"
            + '</h4>'
            + '<h4 style="white-space:normal;">'
            + pageRoomUsageList.roomList[i].address.split(",")[0] + "<br/>"
            + "Rm: " + pageRoomUsageList.roomList[i].roomNumber + "<br/>"
            + '</h4>'
            + '</th></tr>'
            + '</thead>'
            + '<tbody>'
            + '<tr><td class="mdl-data-table__cell--non-numeric">'
            + "Time: " + (pageRoomUsageList.roomList[i].timeChecked.getHours()<10?"0"+pageRoomUsageList.roomList[i].timeChecked.getHours():pageRoomUsageList.roomList[i].timeChecked.getHours()) +":"+
                         (pageRoomUsageList.roomList[i].timeChecked.getMinutes()<10?"0"+pageRoomUsageList.roomList[i].timeChecked.getMinutes():pageRoomUsageList.roomList[i].timeChecked.getMinutes()) +":"+
                         (pageRoomUsageList.roomList[i].timeChecked.getSeconds()<10?"0"+pageRoomUsageList.roomList[i].timeChecked.getSeconds():pageRoomUsageList.roomList[i].timeChecked.getSeconds())+ "<br/>"
            + "Lights: " + onOffConverter[pageRoomUsageList.roomList[i].lightsOn] + "<br/>"
            + "Heating/Cooling: " + onOffConverter[pageRoomUsageList.roomList[i].heatingCoolingOn] + "<br/>"
            + "Seat usage: " + pageRoomUsageList.roomList[i].seatsUsed + "/" + pageRoomUsageList.roomList[i].seatsTotal + "<br/>"
            + '<button class="mdl-button mdl-js-button mdl-button--icon" onclick="deleteObservationAtIndex('+i+');">'
            + '<i class="material-icons">delete</i>'
            + '</button>'
            + '</td></tr>'
            + '</tbody>'
            + '</table>'
            + '</div>';
        // Print retrieved data into html through "observation" id.
        observationsRef.innerHTML = observations;
    } 
    
}

// This function will delete a room entry, by deleting the specified element of the roomlist array, storing it in local storage then reloading the page
function deleteObservationAtIndex(i)
{
	let currentElement = observationsRef.childNodes[pageRoomUsageList.roomList.length-i-1].previousElementSibling;
	observationsRef.removeChild(observationsRef.childNodes[pageRoomUsageList.roomList.length-i-1]);
	while (currentElement!==null)
	{	
		let new_i = Number(currentElement.getElementsByTagName("button")[0].getAttribute("onclick").split("(")[1].split(")")[0])-1;
		currentElement.getElementsByTagName("button")[0].setAttribute("onclick","deleteObservationAtIndex("+new_i+");");
		currentElement = currentElement.previousElementSibling;

	}
	console.log(roomUsageList.roomList[pageRoomUsageList.roomList[i].globalIndex])
	roomUsageList.roomList.splice(pageRoomUsageList.roomList[i].globalIndex,1);
	
    pageRoomUsageList.roomList.splice(i,1);


    
    roomUsageList.storeLocal(RoomUsageList_STORAGE_KEY);
    

    for(let j=i;j<pageRoomUsageList.roomList.length;j++)
    {
    	pageRoomUsageList.roomList[j].globalIndex--;
    }

}

// Function: search()
// Params: none
// Returns: searchValue
// Purpose: Create new instance of observations to be displayed
function search()
{
	let searchElement = document.getElementById("searchField");
    let searchValue = searchElement.value.toString().toLowerCase();
    if(searchValue === "")
    {
    	pageRoomUsageList = cloneGlobalRoomUsageList();
		for(let i=0;i<pageRoomUsageList.roomList.length;i++)
		{
			pageRoomUsageList.roomList[i].globalIndex = i;
		}
		for(let i=0;i<roomUsageList.roomList.length;i++)
		{
			roomUsageList.roomList[i].globalIndex = i;
		}
    }
    else
    {
    	pageRoomUsageList = roomUsageList.aggregateBy(function(roomUsage){
    		let building_address = roomUsage.address.toLowerCase();
    		let room_number = roomUsage.roomNumber.toLowerCase();
    		if ((building_address.indexOf(searchValue) !== -1) || (room_number.indexOf(searchValue) !== -1))
    		{
    			return searchValue;
    		}
    	})[searchValue];
    }
    console.log(pageRoomUsageList);




    displayRetrievedRoomUsageList();
    
}