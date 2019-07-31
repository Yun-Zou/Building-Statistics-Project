"use strict";

// Storage Key for the RoomUsageList
const RoomUsageList_STORAGE_KEY = "ENG1003-RoomUseList";





// Class: RoomUsage
// Properties: 
// _roomNumber : String
// _address : String
// _lightsOn : Boolean
// _heatingCoolingOn : Boolean 
// _seatsUsed : Number
// _seatsTotal : Number
// _timeChecked : Date 
// Methods:
// constructor()
// get roomNumber() : String
// get address() : String
// get lightsOn() : Boolean
// get heatingCoolingOn() : Boolean
// get seatsUsed() : Number
// get seatsTotal() : Number
// get timeChecked() : Date
// set roomNumber(newRoomNumber : String)
// set address(newAddress : String)
// set lightsOn(newLightsOn : Boolean)
// set heatingCoolingOn(newHeatingCoolingOn : Boolean)
// set seatsUsed(newSeatsUsed : Number)
// set seatsTotal(newSeatsTotal : Number)
// set timeChecked(newTimeChecked : Date)
// initialiseFromPDO(roomUsageObject : Object)
class RoomUsage
{
	// Method: constructor
	// Params: none
	// Returns: none
	// Purpose: Initialise all attributes to null (they will be set later)
	constructor()
	{
		this._roomNumber = null; // stores the room number
		this._address = null; // stores the building address
		this._lightsOn = null; // stores whether the lights are on or off
		this._heatingCoolingOn = null; // stores whether the heating or cooling was on or off
		this._seatsUsed = null; // stores number of seats in use in the room
		this._seatsTotal = null; // stores total number of seats in the room
		this._timeChecked = null; // stores the time that the room usage data was stored
	}

	// Method: initialiseFromRoomUsagePDO
	// Params: roomUsageObject : Object (JSON object for a RoomUsage class instance)
	// Returns: none
	// Purpose: Initalise from public data object, which is a JSON object for a RoomUsage class instance
	initialiseFromPDO(roomUsageObject)
	{
		this._roomNumber = roomUsageObject._roomNumber;
		this._address = roomUsageObject._address;
		this._lightsOn = roomUsageObject._lightsOn;
		this._heatingCoolingOn = roomUsageObject._heatingCoolingOn;
		this._seatsUsed = roomUsageObject._seatsUsed;
		this._seatsTotal = roomUsageObject._seatsTotal;
		this._timeChecked = new Date(roomUsageObject._timeChecked);
	}


	// Attribute getters and setters
	// _roomNumber getter and setter
	get roomNumber()
	{
		return this._roomNumber;
	}
	set roomNumber(newRoomNumber)
	{
		this._roomNumber = newRoomNumber;
	}
	// _address getter and setter
	get address()
	{
		return this._address;
	}
	set address(newAddress)
	{
		this._address = newAddress;
	}
	// _lightsOn getter and setter
	get lightsOn()
	{
		return this._lightsOn;
	}
	set lightsOn(newLightsOn)
	{
		this._lightsOn = newLightsOn;
	}
	// _heatingCoolingOn getter and setter
	get heatingCoolingOn()
	{
		return this._heatingCoolingOn;
	}
	set heatingCoolingOn(newHeatingCoolingOn)
	{
		this._heatingCoolingOn = newHeatingCoolingOn;
	}
	// _seatsUsed getter and setter
	get seatsUsed()
	{
		return this._seatsUsed;
	}
	set seatsUsed(newSeatsUsed)
	{
		this._seatsUsed = newSeatsUsed;
	}
	// _seatsTotal getter and setter
	get seatsTotal()
	{
		return this._seatsTotal;
	}
	set seatsTotal(newSeatsTotal)
	{
		this._seatsTotal = newSeatsTotal;
	}
	// _timeChecked getter and setter
	get timeChecked()
	{
		return this._timeChecked;
	}
	set timeChecked(newTimeChecked)
	{
		this._timeChecked = newTimeChecked;
	}
}

// Class: RoomUsageList
// Properties:
// _roomList : Array
// Methods:
// contructor()
// addRoom(room : RoomUsage)
// get roomList : Array
// initialiseFromPDO(roomUsageListObject : Object)
// storeLocal(STORAGE_KEY : String)	
// aggregateBy(keyObject : Function) : Object
class RoomUsageList
{
	// Method: constructor
	// Params: none
	// Returns: none
	// Purpose: Initialises empty _roomList array
	constructor()
	{
		this._roomList = []; // 
	}

	// Method: addRoom
	// Params: room : RoomUsage
	// Returns: none
	// Purpose: Adds a RoomUsage instance to the _roomList array
	addRoom(room)
	{
		this._roomList.push(room);
	}

	// getter for roomList array
	get roomList()
	{
		return this._roomList;
	}
	// Method: initialiseFromRoomUsageListPDO
	// Params: roomUsageListObject : Object (JSON object for a RoomUsageList class instance)
	// Purpose: Initialise from public data object, which is a JSON object for a roomUsageList class instance
	// 			Initialises all RoomUsage instances from PDO as well
	initialiseFromPDO(roomUsageListObject)
	{
		for(let i=0;i<roomUsageListObject._roomList.length;i++)
		{
			let newRoomUsage = new RoomUsage();
			newRoomUsage.initialiseFromPDO(roomUsageListObject._roomList[i]);
			this.addRoom(newRoomUsage);
		}
	}

	// Method: storeLocal
	// Params: STORAGE_KEY : String
	// Returns: none
	// Purpose: Stores the current RoomUsageList in local storage associated to the STORAGE_KEY
	storeLocal(STORAGE_KEY)
	{
		localStorage.setItem(STORAGE_KEY, JSON.stringify(this));
	}


	// Method: aggregateBy
	// Params: key : Function (callback)
	// Returns: none
	// Purpose: Splits the rooms into buckets based on keywords
	// 			keyFunction, is a callback that is run on each roomUsage instance, and will return which bucket the roomUsage fits into
	aggregateBy(keyFunction)
	{
		let buckets = {};
		for(let i=0;i<this.roomList.length;i++)
		{
			let key = keyFunction(this.roomList[i]);
			if (buckets.hasOwnProperty(key))
			{
				buckets[key].addRoom(this.roomList[i]);
			}
			else
			{
				let bucketRoomUsageList = new RoomUsageList();
				bucketRoomUsageList.addRoom(this.roomList[i]);
				buckets[key] = bucketRoomUsageList;
			}
		}
		return buckets;
	}
}

// Function: retrieveLocal
// Params: STORAGE_KEY : String
// Returns: none
// Purpose: Retrieves the RoomUsageList associated with the STORAGE_KEY. Sets the global roomUsageList to the retrieved roomUsageListObj.
function retrieveLocal(STORAGE_KEY)
{
	try
	{
		if (typeof(Storage) !== "undefined")
	    {
	        // Retrieve the stored JSON string and parse
	        // to a variable called roomUsageListObj.
	        // Use this to initialise an new instance of
	        // the RoomUsageList class.
	        let roomUsageListJSON = localStorage.getItem(STORAGE_KEY);
	        let roomUsageListObj = JSON.parse(roomUsageListJSON);
	        roomUsageList = new RoomUsageList();
	        roomUsageList.initialiseFromPDO(roomUsageListObj);
	    }
	    else if(typeof(Storage) === "undefined" )
	    {
	    	roomUsageList = new RoomUsageList();
	        console.log("Error: localStorage is not supported by current browser.");
	    }
	}
	catch (SyntaxError)
	{

	}
}
    
// example localStorage string
// {"_roomNumber": "166","_address": "15 Research Way, Clayton VIC 3170, Australia","_lightsOn": true,"_heatingCoolingOn": true,"_seatsUsed": 15,"_seatsTotal": 20,"_timeChecked": "2018-01-05T09:58:11.000000"}


// define roomUsageList instance to be used globally
let roomUsageList = new RoomUsageList();

// retrieve the most recent roomUsageListInstance stored locally (if it exists)
if(localStorage.getItem(RoomUsageList_STORAGE_KEY))
{
	retrieveLocal(RoomUsageList_STORAGE_KEY);
}


// Function: cloneGlobalRoomUsageList()
// Params: none
// Returns: clone: New instance
// Purpose: Clones a RoomUsageList from the local storage
function cloneGlobalRoomUsageList()
{
	let clone = new RoomUsageList();
	let roomUsageListJSON = localStorage.getItem(RoomUsageList_STORAGE_KEY);
	let roomUsageListObj = JSON.parse(roomUsageListJSON);
	clone.initialiseFromPDO(roomUsageListObj);
	return clone;
}
