"use strict";


let contentRef = document.getElementById("content");





// Function: generateHTML()
// Params: none
// Returns: html: (HTML code that affects display)
// Purpose: Changes the HTML depending on aggregate properties
function generateHTML()
{
	let html = "";
   
	let buckets = roomUsageList.aggregateBy(function(roomUsage){
		let hour24 = roomUsage.timeChecked.getHours();
		let hour12 = (hour24 % 12) || 12;
		let ampm = hour24 < 12 ? " am":" pm";
		let hour_str = hour12+ampm;
		return hour_str;
	});
	for(let i = 0;i<11;i++)
	{
		let key = (i+8)%12 || 12;
		key = key + (i < 4 ? " am":" pm");
		if(buckets.hasOwnProperty(key))
		{
			html+=generateBucketHTML(key,buckets[key]);
		}
	}
    if(html==="")
    {

        html = `<div class="mdl-cell mdl-cell--4-col">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <tbody>
                                <tr><td class="mdl-data-table__cell--non-numeric">No entries</td></tr>
                            </tbody>
                        </table>
                    </div>`;
        return html;
    }
	return html;
}


// Function: generateBucketHTML(key,bucketRoomUsageList)
// Params: key,bucketRoomUsageList
// Returns: html: (HTML code that affects display)
// Purpose: Changes the HTML depending on bucket choice
function generateBucketHTML(key,bucketRoomUsageList)
{
	let html = 
	`<div class="mdl-cell mdl-cell--4-col">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr><th class="mdl-data-table__cell--non-numeric">
                                    <h5>Worst occupancy for `+key+`</h5>
                                </th></tr>
                            </thead>
                            <tbody>`;



    // gets the worst five occupancies
    // apologies for this code it is awful, I will work on shortening it later if I have time
    let occupancy_obj = {};
    for(let i=0;i<bucketRoomUsageList.roomList.length;i++)
    {
    	let occupancy = bucketRoomUsageList.roomList[i].seatsUsed/bucketRoomUsageList.roomList[i].seatsTotal;
    	if(occupancy_obj.hasOwnProperty(occupancy)===false)
    	{
    		occupancy_obj[occupancy] = [];
    	}
    	occupancy_obj[occupancy].push(bucketRoomUsageList.roomList[i]);
    } 
    let occupancies = Object.keys(occupancy_obj);
    let ordered_occupancies = occupancies.sort();
    let worstRoomUsageList = new RoomUsageList();
    
    for(let i=0;i<5;i++)
    {
    	if(ordered_occupancies[i])
    	{
    		for(let j=0;j<occupancy_obj[ordered_occupancies[i]].length;j++)
    		{
    			worstRoomUsageList.addRoom(occupancy_obj[ordered_occupancies[i]][j]);
    		}
    	}
    	else
    	{
    		break;
    	}
    }
    for(let i=0;i<5;i++)
    {
    	if(worstRoomUsageList.roomList[i])
    	{
    		html+=generateRoomHTML(worstRoomUsageList.roomList[i]);
    	}
    	else
    	{
    		break;
    	}
    }

    html += 
                                `</tbody>
                        </table>
                    </div>`;
    return html;
}



// Function: generateRoomHTML(roomUsage)
// Params: roomUsage
// Returns: html: (HTML code that affects display)
// Purpose: Changes the HTML depending on roomUsage stats
function generateRoomHTML(roomUsage)
{	
	let address_str = roomUsage.address.split(",")[0] + "; " +roomUsage.roomNumber;

	let occupancy_pct = roomUsage.seatsUsed/roomUsage.seatsTotal*100;
	let occupancy_str = occupancy_pct.toFixed(1).toString();

	let heatingCooling_str = "";
	if(roomUsage.heatingCoolingOn)
	{
		heatingCooling_str = "On";
	}
	else
	{
		heatingCooling_str = "Off";
	}

	let lights_str = "";
	if(roomUsage.lightsOn)
	{
		lights_str = "On";
	}
	else
	{
		lights_str = "Off";
	}

	let time_str = "";
	time_str += (roomUsage.timeChecked.getDate()<10?"0"+roomUsage.timeChecked.getDate():roomUsage.timeChecked.getDate()) +"/"+
				((roomUsage.timeChecked.getMonth()+1)<10?"0"+(roomUsage.timeChecked.getMonth()+1):(roomUsage.timeChecked.getMonth()+1)) +"/"+
				roomUsage.timeChecked.getFullYear()+", "+
				(roomUsage.timeChecked.getHours()<10?"0"+roomUsage.timeChecked.getHours():roomUsage.timeChecked.getHours()) +":"+
				(roomUsage.timeChecked.getMinutes()<10?"0"+roomUsage.timeChecked.getMinutes():roomUsage.timeChecked.getMinutes()) +":"+
				(roomUsage.timeChecked.getSeconds()<10?"0"+roomUsage.timeChecked.getSeconds():roomUsage.timeChecked.getSeconds());




	let html = `<tr><td class="mdl-data-table__cell--non-numeric">
                                    <div><b>`+address_str+`</b></div>
                                    <div>Occupancy: `+occupancy_str+`%</div>
                                    <div>Heating/cooling: `+heatingCooling_str+`</div>
                                    <div>Lights: `+lights_str+`</div>
                                    <div><font color="grey">
                                            <i>`+time_str+`</i>
                                    </font></div>
                                </td></tr>`;
    return html;
}	



contentRef.innerHTML = generateHTML();


