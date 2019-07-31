"use strict";

let statsRef = document.getElementById("stats");
statsRef.innerHTML = "";

//calling the displayStats function
displayStats();


function displayCard(buildings)
{
	let html = '';
	let data = {
	  	numObs:0,
	    numWasteObs:0,
	    seatUsed:0,
	    seatTotal:0,
	    lightOn:0,
	    heatCoolOn:0,
	    seatAve:0,
	    lightAve:0,
	    heatCoolAve:0
	    };
    data.numObs = buildings.length;
    for(let i=0;i<data.numObs;i++)
    {
    	// gets number of wasterful observations
    	if((buildings[i].seatsUsed==0)&&(buildings[i].lightsOn||buildings[i].heatingCoolingOn))
    	{
    		data.numWasteObs++;
    	}
    	// gets total seats used and total seats total
    	data.seatUsed += buildings[i].seatsUsed;
    	data.seatTotal += buildings[i].seatsTotal;
    	// gets lights on
    	data.lightOn += buildings[i].lightsOn;
    	// gets heating/cooling on
    	data.heatCoolOn += buildings[i].heatingCoolingOn;
    }
    data.seatAve = data.seatUsed/data.seatTotal;
    data.lightAve = data.lightOn/data.numObs;
    data.heatCoolAve = data.heatCoolOn/data.numObs;

    html = `<div class="mdl-cell mdl-cell--4-col">
                        <table class="observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr><th class="mdl-data-table__cell--non-numeric`+((data.numWasteObs!==0)?" mdl-color--red-200":" mdl-color--green-200")+`">
                                    <h4>
                                        `+buildings[0].address.split(",")[0]+	`
                                    </h4>
                                </th></tr>
                            </thead>
                            <tbody>
                                <tr><td class="mdl-data-table__cell--non-numeric`+((data.numWasteObs!==0)?" mdl-color--red-100":" mdl-color--green-100")+`">
                                    Observations: `+data.numObs+`<br />
                                    Wasteful observations: `+data.numWasteObs+`<br />
                                    Average seat utilisation: `+(data.seatAve*100).toFixed(1)+`%<br />
                                    Average lights utilisation: `+(data.lightAve*100).toFixed(1)+`%<br />
                                    Average heating/cooling utilisation: `+(data.heatCoolAve*100).toFixed(1)+`%
                                </td></tr>
                            </tbody>
                        </table>
                    </div>`;

    statsRef.innerHTML += html;




}


function displayStats()
{	
    if (roomUsageList.roomList.length === 0)
    {
        statsRef.innerHTML = `<div class="mdl-cell mdl-cell--4-col">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <tbody>
                                <tr><td class="mdl-data-table__cell--non-numeric">No entries</td></tr>
                            </tbody>
                        </table>
                    </div>`;
        return;
    }

    let uniqueBuildingsObj = roomUsageList.aggregateBy(function(roomUsage){
    	return roomUsage.address;
    });
    for(let key in uniqueBuildingsObj)
    {
    	displayCard(uniqueBuildingsObj[key].roomList);
    } 

    
}




                    





