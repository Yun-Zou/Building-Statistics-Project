"use strict";


// Global variables 

// Define references to inputs

let inputAddress = document.getElementById("address");
let inputUseAddress = document.getElementById("useAddress");
let inputRoomNumber = document.getElementById("roomNumber");
let inputLights = document.getElementById("lights");
let inputHeatingCooling = document.getElementById("heatingCooling");
let inputSeatsUsed = document.getElementById("seatsUsed");
let inputSeatsTotal = document.getElementById("seatsTotal");
let errorMessages = document.getElementById("errorMessages");

// API key for the geolocator 
let geocoderURL = "https://api.opencagedata.com/geocode/v1/json";

let geocoderData = {
    key: "45a5986d9d084b418136c266c7a8755d",
    q: "",
    pretty: 1,
    jsonp: "geocoderResponse"
};

let addressFormat;

currentLocation();

// Function: saveText()
// Params: none
// Returns: none
// Purpose: To create a roomUsage instance from the inputs, add this to the roomUsageList instance and save this to local storage
function saveText()
{	
	if (formIsValid()) // only runs if form is valid - runs formIsValid function which checks if all inputs are valid
	{
		// create empty roomUsage instance
		let roomUsage = new RoomUsage(); 
		// initialise all properties of the RoomUsage instance
		roomUsage.roomNumber = inputRoomNumber.value;
		roomUsage.address = inputAddress.value;
		roomUsage.lightsOn = inputLights.checked;
		roomUsage.heatingCoolingOn = inputHeatingCooling.checked;
		roomUsage.seatsUsed = Number(inputSeatsUsed.value);
		roomUsage.seatsTotal = Number(inputSeatsTotal.value);
		roomUsage.timeChecked = new Date(); // this gives us the current time in a Date instance
		// add roomUsage to roomUsageList
		roomUsageList.addRoom(roomUsage);
		// store roomUsageList in local storage
		roomUsageList.storeLocal(RoomUsageList_STORAGE_KEY);
		// give the user a message that the data has been saved
		errorMessages.style.color = "green";
		errorMessages.innerText = "Successfully Saved";
	}

}

// Function: clearText()
// Params: none
// Returns: none
// Purpose: To clear the inputs and return to the default state
// Notes: MDL has a list of classes for their elements that gives us information about the states. 
//        When we remove and add these from classList, we are essentially changing these states
function clearText()
{
	// reset buidling address text box
	inputAddress.value = ""; // clears value to empty string
	inputAddress.parentElement.classList.remove("is-dirty"); // removes class that states that text is in the box, making the label visible again

	// reset the automatic address checkbox
	inputUseAddress.checked = false;
	inputUseAddress.parentElement.classList.remove("is-checked"); // removes class that states the box is checked (visibly)

	// reset room number text box
	inputRoomNumber.value = "";
	inputRoomNumber.parentElement.classList.remove("is-dirty"); 

	// reset lights checkbox
	inputLights.checked = true;
	inputLights.parentElement.classList.add("is-checked"); // adds class that states the box is checked (visibly)

	// reset heating/cooling checkbox
	inputHeatingCooling.checked = true;
	inputHeatingCooling.parentElement.classList.add("is-checked");

	// reset number of seats in use text box
	inputSeatsUsed.value = "";
	inputSeatsUsed.parentElement.classList.remove("is-dirty"); 
	inputSeatsUsed.parentElement.classList.remove("is-invalid"); // removes class that states data is invalid (in-case it is when we clear)

	// resets total number of seats text box
	inputSeatsTotal.value = "";
	inputSeatsTotal.parentElement.classList.remove("is-dirty");
	inputSeatsUsed.parentElement.classList.remove("is-invalid");

	// resets error messages
	errorMessages.style.color = "#d50000";
	errorMessages.innerText = "";
}

// Function: formIsValid()
// Params: none
// Returns: isValid : Boolean
// Purpose: Checks if all input to the text fields are valid forms of input
function formIsValid()
{
	let isValid = true; // boolean which stores validity of form
	errorMessages.innerText = ""; // resets error mesages

	// if any of the following checks are true, the form will be returned invalid and an error message will be displayed

	// checks if building address is empty
	if (inputAddress.value === "")
	{
		errorMessages.innerText += "Address is empty\n";
		isValid = false;
	}
	// checks if room number is empty
	if (inputRoomNumber.value === "")
	{
		errorMessages.innerText += "Room Number is empty\n";
		isValid = false;
	}
	// checks if seats in use is empty
	if (inputSeatsUsed.value === "")
	{
		errorMessages.innerText += "Seats Used is empty\n";
		isValid = false;
	}
	// if seats in use isn't empty, check if it contains invalid characters
	else if (inputSeatsUsed.parentElement.classList.contains("is-invalid"))
	{
		errorMessages.innerText += "Seats Used should be a number\n";
		isValid = false;
	}
	// if seats in use contains all valid characters, check if it is not a positive integer
	else if (Number(inputSeatsUsed.value) < 0 || Number.isInteger(Number(inputSeatsUsed.value)) === false)
	{
		errorMessages.innerText += "Seats Used should be a positive integer\n";
		isValid = false;
	}
	// checks if seats in use is larger than total seats
	if (Number(inputSeatsUsed.value) > Number(inputSeatsTotal.value))
	{
		errorMessages.innerText += "Seats Used should be less than Seats Total\n";
		isValid = false;
	}
	// checks if total seats is empty
	if (inputSeatsTotal.value === "")
	{
		errorMessages.innerText += "Seats Total is empty\n";
		isValid = false;
	}
	// if total seats isn't empty, check if it contains invalid characters
	else if (inputSeatsTotal.parentElement.classList.contains("is-invalid"))
	{
		errorMessages.innerText += "Seats Total should be a number\n";
		isValid = false;
	}
	// if total seats contains all valid characters, checks if it is a positive integer
	else if (Number(inputSeatsTotal.value) < 0 || Number.isInteger(Number(inputSeatsTotal.value)) === false)
	{
		errorMessages.innerText += "Seats Total should be a positive integer\n";
		isValid = false;
	}
	if (isValid == false)
	{
		errorMessages.style.color = "#d50000"; 
	}
	return isValid; // returns the boolean storing validity of form
}


// Function: currentLocation()
// Params: none
// Returns: none
// Purpose: Track user's position
function currentLocation()
{
    // Geolocation options
	let positionOptions = {
	enableHighAccuracy: true
	};
	
    // If coordinates are able to be determined, call function geolocationSucess, otherwise call geolocationError
	navigator.geolocation.watchPosition(geolocationSuccess,geolocationError,positionOptions);
    
}

// Function: geolocationSuccess(position)
// Params: Coordinates of position as object with attributes latitude and longitude, with their respective values;
// Returns: none
// Purpose: Track user's position
function geolocationSuccess(position)
{
    // Sets value of attribute q of geocoder object to coordinates to 7 decimal places 
    geocoderData.q = position.coords.latitude.toFixed(7) + "," + position.coords.longitude.toFixed(7);
    console.log(geocoderData.q);
}

// Function: geolocationError()
// Params: none
// Returns: none
// Purpose: Outputs an error message if coordinates cannot be determined
function geolocationError()
{
    // Error message on observation HTML page
	console.log("Error finding location");
	errorMessages.style.color = "#FFC300";
	errorMessages.innerText+= "Location tracking disabled.\n";
}

// Function: geocodeResponse(addressObject)
// Params: addressObject: Object (Holds information from geocoder response)
// Returns: none
// Purpose: Prints the location of the building from the object sent by geocoder response
function geocoderResponse(addressObject)
{
    
    let addressData = addressObject;
    console.log(addressData.results[0])
    // If the location found is a building, print the address
    if(addressData.results[0].building)
    {
    	addressFormat = addressData.results[0].formatted;
    	inputAddress.value = addressFormat;
	    inputAddress.parentElement.classList.add("is-dirty");
	    inputAddress.readOnly = true;
	}
    
    // Otherwise, print error message
	else
	{
		errorMessages.innerText += "Location does not contain building\n";
	}
    
    
}

// Function: locateAddress()
// Params: none
// Returns: none
// Purpose: Checks if id 'useAddress' button is checked upon input, and will call for jsonpRequest function if it is, or clear text if not 
function locateAddress()
{    
        // If button is checked, make a geocoder website request for current location 
        if (inputUseAddress.checked === true)
        {
            jsonpRequest(geocoderURL,geocoderData);
                       
        }
    
        // Clears text box if button is not checked
        else
        {
            inputAddress.value = "";
            inputAddress.readOnly = false;
            inputAddress.parentElement.classList.remove("is-dirty");
        }
}

// Function: jsonpRequest(URL,data)
// Params: URL : String (URL of geocoder website without JSONP parameters), data : Object (JSONP parameters for geocoder site)
// Returns: none
// Purpose: Encodes JSONP parameters and appends it to plain URL, then making web request of new URL
function jsonpRequest(URL,data)
{
    // Initial parameters value
    let parameters = "";
    
    // Run for every attribute in data object
    for (let key in data)
    {
        
        // Encode the key and value parameters from data object
        let jsonKey = encodeURIComponent(key);
        let jsonValue = encodeURIComponent(data[key]);
        
        // Concatenate characters according to JSONP format
        if (data.hasOwnProperty(key))
        {
            if (parameters.length == 0)
            {
                parameters += "?";
            }
            else
            {
                parameters += "&";
            }

        	parameters += jsonKey + "=" + jsonValue;
        
        }
    }
    
    // Concatenate URL and JSONP parameters
    let jsonpURL = URL + parameters;
    
    // Remove any existing web requests
    let removeRequest = document.getElementById("geocoderRequest");
    removeRequest.parentNode.removeChild(removeRequest);
    
    // Create new web request
    let geocoderRequestForm = document.createElement('script');
    geocoderRequestForm.src = jsonpURL;
    geocoderRequestForm.id = 'geocoderRequest';
    document.body.appendChild(geocoderRequestForm);
}

// Function: geocodeResponse(addressObject)
// Params: none
// Returns: none
// Purpose: Callback function for geocoder which will display address if building of user can be found, otherwise display error message
function geocoderResponse(addressObject)
{
    // Address object from geocoder response
    let addressData = addressObject;
    
    // Output address on observation page if address format displays building name
    if(addressData.results[0].building)
    {
    	addressFormat = addressData.results[0].formatted;
    	inputAddress.value = addressFormat;
	    inputAddress.parentElement.classList.add("is-dirty");
	    inputAddress.readOnly = true;
	}
    
	else
	{
		errorMessages.innerText += "Innaccurate position, could not find building: Please enter manually\n";
	} 
    
}
