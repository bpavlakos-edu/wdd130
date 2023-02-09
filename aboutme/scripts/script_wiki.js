//Wiki Chase Generator Created By Bryce P, CSE-121b

//Global Constants
let pageList = []; //The global list to store the fetch result
let namespaceQueryObj = []; //The global list to store the namespaceQueryObjects

//Global updating variables
let keepNamespaceSelection = false;

//Settings (Updated by the UI)
let wikiRootSetting = "en.wikipedia.org";
let genNumSetting = 5; //
let namespaceSetting = "0"; //The parameter to send as the namespace
let apiPathSetting = "w/";//Wikipedia uses "wikipedia.org/w/api.php?"" while fandom.com uses "myWiki.fandom.com/api.php?"

//Frequently used HTML elements (for reducing memory intensive DOM calls)
//UI / Settings
const pageListElem = document.getElementById("pageListRoot"); //Page Ordered List
const genBtnElem = document.getElementById("genBtn"); //Generate button
const apiPathBox = document.getElementById("apiPathBox"); //api path box
//const rootUrlLabel = document.querySelector("label[for*=rUrlIn]");//The label above the Root wiki URL
const namespaceDropdown = document.getElementById("namespaceDropdown");//The dropdown menu for namespace

//List message elements
const errorMsgElem = document.querySelector("#errorItem");

//File handling buttons
//const loadFileButton = document.getElementById("inBtn");//It's really only a reference to the filePicker, no need to store it in memory
const saveFileButton = document.getElementById("outBtn");
const filePicker = document.getElementById("filePicker");

//Known API paths, stored in a dictionary-like object:
const knownApiPaths = {
    //These can be found by guessing, or by searching for "api.php" using the bottom of the chrome developer tools
    //w path
    "wikipedia.org":"w",
    "wikibooks.org":"w",
    "mediawiki.org":"w",
    "blender.org":"w",
    "audacityteam.org":"w",
    "biosector01.com":"w",
    "bulbapedia.bulbagarden.net":"w",
    //wiki path
    "inkscape.org":"wiki",
    //Blank
    "fandom.com":"",
}

/*Wikipedia API Parameters explained:
    //starts with api.php?
    //all request keys use the following syntax: keyName=value
    //Additional keys start with &
    origin=* //Set the request origin, setting it to "*" makes it ignore the setting, allowing for cross site requests without sending user data (https://www.mediawiki.org/wiki/Special:ApiSandbox)
    action=query //The request type, query means request from the api
    format=json //return the result in JSON format
    list=random //Get a list of random articles
    //Order of request parameters matters here
    rnnamespace=0 //Flag for random request, controls "namespace", 0 means actual page, 1 means talk page?, 2 means user page, 3 means talk on user page, * means any (and also means the setting is empty)
    rnlimit=5 //Flag for random request, controls the count request 5 articles see (https://www.mediawiki.org/wiki/API:Random#API_documentation) for other flags
*/

//Wikipedia API page request function
async function requestPages(rootUrl, inNum, nameSpaceNum){
    try {
        //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options
        //Optional second parameter for controlling settings: ,{mode:"cors",redirect:"follow"}
        //,{headers:{"Access-Control-Allow-Origin":"wit.audacityteam.org"}} //Attempted Manual header setting
        let fetchResponse = await fetch(`https://${rootUrl}/${apiPathSetting}api.php?origin=*&action=query&format=json&list=random&rnnamespace=${nameSpaceNum}&rnlimit=${inNum}`);
        if(fetchResponse.ok){
            let rawJsonObj = await fetchResponse.json(); //Convert to JSON object
            //Returns were changed to async results
            errorMsgElem.classList.toggle("hidden",true);
            storeAsyncResult(rawJsonObj["query"]["random"]); //Extract the applicable data from the json object (which is JsonObj -> query -> random) (Changed to pass to the async result function instead)
        }else{
            //Handle premission errors
            console.log(fetchResponse);
            errorMsgElem.textContent = "Unexpected Response: "+fetchResponse.statusText;
            errorMsgElem.classList.toggle("hidden",false);
            storeAsyncResult([]); //Return an empty list as the result (Changed to pass to the async result function instead)
        }
    } catch (error) {
        //Handle async errors
        console.log(error);
        errorMsgElem.textContent = "Response Error: "+error.message+". See the console for more details!";
        errorMsgElem.classList.toggle("hidden",false);
        storeAsyncResult([]); //Return an empty list as the result (Changed to pass to the async result function instead)
    }
}

//Function to be called by requestPages.finally() to store the pages after they are generated
//Arrow functions are typically used to store async results
//But this is a little more complicated because it needs to trigger the UI updates too
function storeAsyncResult(asyncReturn){
    pageList = asyncReturn; //Store the async result
    updatePageList(); //Update contents of the <UL> element
    //console.log(asyncReturn); //Debugging
}

//Add the elements to the page
function updatePageList(){
    clearPageListElem();//Clear all children (Except the placeholder)
    let loopCount = pageList.length; //So we don't call the length every for loop (Computationally Expensive)
    if(loopCount > 0){
        // document.getElementById("emptyItem").style.display = "hidden"; //Manual style change is the alternate strategy
        document.getElementById("emptyItem").classList.toggle("hidden",true);//Force hiding the placeholder
        for(let i=0;i<loopCount;i++){
            pageListElem.appendChild(toPageLi(wikiRootSetting, pageList[i]));//This needs the wikiRoot as a parameter
        }
    }else{
        //Empty list
        document.getElementById("emptyItem").classList.toggle("hidden",false);//Force visibility of placeholder
    }
    
}

//Function to auto clear the entire page list
function clearPageListElem(){
    /*//Manual for loop version:
    //Unfortunately array functions are not usable on HTMLCollections, 
    //the alternative would be to use document.querySelectorAll("#pageListRoot > li"), which returns a nodeList
    //See: https://developer.mozilla.org/en-US/docs/Web/API/NodeList
    //But, I think that's slower than using the global we have stored in memory already
    let loopCount = pageListElem.children.length - 1; //So we don't call the length every for loop (Computationally Expensive)
    //length - 1 because we don't want to delete the placeholder element
    for(let i=1;i<loopCount;i++){
        pageListElem.removeChild(pageListElem.children[1]); //Repeatedly remove the first index
    }*/
    //Better version using advanced CSS selectors
    let pageListItems = document.querySelectorAll("ol#pageListRoot li:not(li#emptyItem):not(li#errorItem)"); //Get every li except for the placeholder
    pageListItems.forEach((nodeToRemove) => {pageListElem.removeChild(nodeToRemove);});//Remove all of the queired elements from the root <ol> element
}

//wiki API page to li node helper function
function toPageLi(wikiRoot, wikiPage){
    //<li><a href="url" target="_blank">Article Title Goes Here</a></li>
    //wikiDataToUrl(wikiRoot, wikiPage["id"])
    let returnNode = document.createElement("li");//Create the li
    returnNode.innerHTML = `<a href=${wikiDataToUrl(wikiRoot, wikiPage["id"])} target="_blank">${wikiPage["title"]}</a>`;//set the inner HTML to the template string
    return returnNode;
}

//Generate an actual URL using the wikiId and the ID from the query
function wikiDataToUrl(wikiRoot, wikiId){
    return `https://${wikiRoot}/w/index.php?curid=${wikiId}`;// https://wikiRoot/w/index.php?curid=wikiIdHere
}

/*Trigger namespace request*/
let previousFullUrl = wikiRootSetting+"/"+apiPathSetting;//Variable to keep track of the last saved Wiki URL, so that we avoid querying a site we have already queried
function checkNewUrlNamespaces(forceRequest = false){
    //console.log(previousNamespace,wikiRootSetting+"/"+apiPathSetting); //Debugging
    if(wikiRootSetting+"/"+apiPathSetting !== previousFullUrl || forceRequest){
        //If the full request path doesn't match the old one, check for new namespaces
        fetchNamespaces(wikiRootSetting);
        previousFullUrl = wikiRootSetting+"/"+apiPathSetting; //Store the previous full path
    }
    //Do nothing if it's the same namespace
}

/*Request valid namespaces*/
/*Fetch call and JSON conversion*/
async function fetchNamespaces(wikiRoot){
    try {
        let queryUrl = `https://${wikiRoot}/${apiPathSetting}api.php?origin=*&action=query&meta=siteinfo&siprop=namespaces&formatversion=2&format=json`;
        let response = await fetch(queryUrl);
        if(response.ok){
            let rawJsonObj = await response.json();
            //Async Storage Function
            //console.log(rawJsonObj);
            // return rawJsonObj; //Promise is not complete when passed
            storeAsyncNamespaces(rawJsonObj['query']['namespaces']); //Call the storage function
        }else{
            //Error
            storeAsyncNamespaces([]);
        }
    } catch (error) {
        //Error
        storeAsyncNamespaces([]);
    }
}

//2nd async request, get namespaces from wikis to confirm they are working
//Function to store async result in global object
function storeAsyncNamespaces(asyncReturn){
    //{"id":namespaceEntry["id"],"name":namespaceEntry["name"]}
    //console.log(asyncReturn); //Debugging
    namespaceQueryObj = asyncReturn;
    //console.log(namespaceQueryObj);//Debugging
    updateNamespaceList(); //Update the list
}

//Callback function to write global object to element
function updateNamespaceList(){
    //console.log(namespaceQueryObj); //Debugging
    //namespaceQueryObj = namespaceQueryObj.map((namespaceEntry) => {return {"id":namespaceEntry["id"],"name":namespaceEntry["name"]};});
    //let newList = [];
    namespaceDropdown.replaceChildren(); //Clear all child nodes
    for(entryId in namespaceQueryObj){
        // newList.push({"id":namespaceQueryObj[entryId]["id"],"name":namespaceQueryObj[entryId]["name"]});
        // console.log(entryId); //Debugging
        namespaceDropdown.appendChild(namespaceEntryToSelectOption(namespaceQueryObj[entryId]));
    }
    //Add the any page option if the list isn't empty
    if(namespaceDropdown.children.length > 0){
        if(!keepNamespaceSelection){
            //This if statement was added to support JSON loading of namespace selection, 
            //the following line resets the setting to 0, which changes the namespaceDropdown value at the end of this funciton
            namespaceSetting = "0"; //Default is set to 0, which is articles
        }else{
            keepNamespaceSelection = false; //Reset the flag for next time, if it's set to true
        }
        namespaceDropdown.appendChild(generateSelectOption("*","Any Page"));
    }else{
        namespaceSetting = "*"; //Default is set to 0, which is articles
        namespaceDropdown.appendChild(generateSelectOption("*","Invalid Wiki"))
    }
    namespaceDropdown.value = namespaceSetting;
    //console.log(newList); //Debugging
}

//Function overload, for auto filling the parameters for the next function
function namespaceEntryToSelectOption(namespaceEntry){
    return generateSelectOption(namespaceEntry["id"],namespaceEntry["name"]);
}

//Generate the option element
function generateSelectOption(valueStr, textContentStr){
    let newNode = document.createElement("option");
    newNode.value = valueStr; //Store the value of the option
    if(textContentStr === "" && valueStr === 0){
        //Namespace 0 usually has a blank name value, but it means wikipedia articles
        textContentStr = "Articles";
    }
    newNode.textContent = textContentStr; //Store the text
    return newNode; //Return the full node
}



//Setting Event listeners
genBtnElem.addEventListener("click",genBtnFun);//Generate Button click
document.getElementById("rootUrlBox").addEventListener("change",(eventIn) => {wikiRootChange(eventIn);});//Root Wiki Change, use an arrow function to pass the event to the function call
document.getElementById("ranNumBox").addEventListener("change",(eventIn)=>{genNumSetting = parseInt(eventIn.target.value)??0;});//Generate number change, use a simple arrow function to set the global setting
document.getElementById("namespaceDropdown").addEventListener("change",(eventIn)=>{namespaceChange(eventIn);});//Namespace
apiPathBox.addEventListener("change",(eventIn)=>{apiPathChange(eventIn);});

//File input event listeners
//()=>{filePicker.dispatchEvent(new Event("click"));} //Arrow functions for dispatching the "click" event doesn't work, 
//But the activating the "click()" function works instead (note: doing "elem.click" by itself as the callback function parameter doesn't work...)
document.getElementById("inBtn").addEventListener("click",()=>{filePicker.click();}); //The load file button simply triggers the click event for the invisible file picker
saveFileButton.addEventListener("click",saveJSONFile);
//file input "change" is the even that triggers when a file is chosen, credit to the event listener in this example on MDN: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#examples
filePicker.addEventListener("change",(eventIn)=>{loadJSONFile(eventIn)}); //Call the loadJSONFile when data is loaded, pass the source event so we have access to the files attribute


//Event Listener Helper Functions (Calls the appropriate functions and runs any needed code)
//Generate Button
function genBtnFun(){
    requestPages(wikiRootSetting, genNumSetting, namespaceSetting);
}

//For updating the Wikipedia URL
function wikiRootChange(eventIn){
    wikiRootSetting = eventIn.target.value ?? ""; //Get the value of the event target (which is the Url Input Element)

    /*Obsolete patch
    //Patch for adding support for fandom.com
    if(wikiRootSetting.indexOf("fandom.com") >= 0){
        //Fandom.com
        //rootUrlLabel.textContent = "Root Wiki URL (fandom.com detected): ";
        //apiPathSetting = "";
        apiPathBox.value = "";
    }else{
        //Wikipedia.org
        //rootUrlLabel.textContent = "Root Wiki URL (standard wiki type detected): ";
        //apiPathSetting = "w/";
        apiPathBox.value = "w";
    }*/

    detectKnownApiPath(); //detect if the URL has an available hardcoded path to auto fill it
    
    //Disable and enable the generate button using the HTML attribute "disabled"
    if(wikiRootSetting === ""){
        genBtnElem.disabled = true;
    }else{
        //Non-empty namespace requested
        genBtnElem.disabled = false;
    }
    checkNewUrlNamespaces(); //Check for the namespaces if the URL changes
}

//Function to check request the Api path be replaced by a known one if possible, if successful it will trigger the apiPathBox "change" event
function detectKnownApiPath(){
    //Update the API path if it's known
    let lastApiPath = apiPathBox.value;
    apiPathBox.value = checkForKnownWikiPath(); //Update the path box first
    if(lastApiPath !== apiPathBox.value){
        apiPathBox.dispatchEvent(new Event("change")); //Then use it's event to change the actual value
    }
}

//For updating the wiki path (ex. /wiki/ /w/ or "" (for fandom) )
function apiPathChange(eventIn){
    apiPathSetting = eventIn.target.value; //Get the value from the calling <input> element (which is the apiPathBox)
    //Non empty paths need a "/"
    if(apiPathSetting !== ""){
        apiPathSetting += "/";
    }
}

//Helper function for updating the wikiPath
function checkForKnownWikiPath(){
    let domain = wikiRootSetting.split(".").splice(-2,2).join(".")??"";//Split into a list by each dot, pull out the last 2 items, and then join them using ".", return "" if this operation fails
    //console.log(domain);//Debugging
    return knownApiPaths[domain]??apiPathBox.value;//Check the master list, return the current value if it's not located in the dictionary
}

//Generate Number has an arrow function

//For updating the namespace using the dropdown list
function namespaceChange(eventIn){
    let namespaceKey = eventIn.target.value??"any"; //Get the value from the <select> element
    //console.log(namespaceKey); //Debugging
    if(namespaceKey === "*"){
        //No namespace parameter in API request
        namespaceSetting = "*";
    }else{
        //Articles Only = 0
        //Talk Pages Only = 1
        //User pages Only = 2
        //User Talk pages only = 3
        namespaceSetting = namespaceKey + ""; //Convert it to a string before storing it
    }
}

fetchNamespaces("en.wikipedia.org"); //Test Function turned inital load function

// requestNamespaces("en.wikipedia.org").then((returnVal)=>{namespaceTest = returnVal;}).finally((returnVal)=>{console.log(returnVal);});
// requestNamespaces("en.wikipedia.org").then((returnVal)=>{storeAsyncNamespaces(returnVal);});

//Test of an async function call, while also storing it, arrow functions are used to pass the return value to the storage function
//requestPages("en.wikipedia.org",5,0).then((returnVal)=>{storeAsyncResult(returnVal);}); //Failed usage of .then() due to a syntax error
//requestPages("en.wikipedia.org",5,0);

//JSONify

//To JSON

//Create a JSON Object containing all data that will be loaded later
function saveJSONString(){
    let jsonData = {
        //Global lists:
        "pageList":pageList,
        //Don't store namespace options, because we will refresh them automatically
        
        //Setting values:
        "rootUrl":wikiRootSetting,//Root wikipedia URL
        "apiPathSetting":apiPathSetting,//Internal api path setting, includes the "/"
        "namespaceSetting":namespaceSetting, //Currently selected namespace
        "genNum":genNumSetting,//Page to generate count

        //UI values that differ from their internal setting
        "uiApiPath": apiPathBox.value, //Current api path in box, remember to trigger it's "change" event when loading it from the JSON file to auto query the namespaces
    };
    //JSON is a built-in module like math: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
    return JSON.stringify(jsonData);
}

//Load JSON string
function loadJSONString(jsonString){
    try {
        let jsonData = JSON.parse(jsonString); //Parse JSON data and store it as an object
        
        //Load data from the JSON object to memory
        //Global lists
        pageList = jsonData.pageList; //Page list

        //Setting Values
        wikiRootSetting = jsonData.rootUrl; //Root wikipedia URL
        namespaceSetting = jsonData.namespaceSetting; //Currently selected namespace
        apiPathSetting = jsonData.apiPathSetting; //Internal api path setting, includes the "/"
        genNumSetting = jsonData.genNum; //Internal generate count

        //Update UI
        document.getElementById("rootUrlBox").value = wikiRootSetting; //Wiki root textbox value
        apiPathBox.value = jsonData.uiApiPath; //Value in the api path box
        document.getElementById("ranNumBox").value = genNumSetting; //Generate count in number box value
        namespaceDropdown.value = namespaceSetting; //Namespace dropdown option //Will be changed when its forced //Doesn't work because it's overwritten when it's filled with new values
        keepNamespaceSelection = true; //Trigger the keepNamespaceSelection flag so it's not changed by updateNamespaceList()
        checkNewUrlNamespaces(); //Update the namespace dropdown menu using the API query functions
        errorMsgElem.classList.toggle("hidden",true); //Hide the error element (which is normally handled by the fetch request)
        updatePageList(); //Update the page list
    } catch (error) {
        //File failed to load
        console.log("JSON failed to load, please verify the JSON file is correct!");
        console.log("File Content length: "+jsonString.length);
    }
}


//File handling functions (Triggered by buttons)
//Function to 
/* function clickLoadFile(){
    filePicker.dispatchEvent("click"); //Simulate the file chooser being clicked
} */

//Load the file from the computer
//Triggered by "valid" event from the filePicker
function loadJSONFile(eventIn){
    try{
        //How to access the files in the file input element https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
        let fileObj = eventIn.target.files[0];//Get the "files" attribute from the event target, which is the file input element, we only want 1 file, so we are getting it's first item
        let fReader = new FileReader();
        //Callback function
        fReader.addEventListener("load", () => {
            loadJSONString(fReader.result??""); //Load the JSON string
            //Credit for solution: https://css-tricks.com/snippets/jquery/clear-a-file-input/#comment-1606952
            eventIn.target.value = null; //Reset the file picker so a file can be reloaded when it has an identical name
        });
        fReader.readAsText(fileObj);
    } catch(error){
        console.log("File loading failed!");
        console.log(error);
    }
}

//Save the file to the computer
function saveJSONFile(){
    //Simple file downloading based on this tutorial: https://www.tutorialspoint.com/how-to-create-and-save-text-file-in-javascript
    let invisibleDownloadLink = document.createElement("a"); //Create the <a> (link) element
    //Alternative type: "application/json"
    let dlFileObj = new Blob([saveJSONString()],{type:"text/plain"}); //Create a blob object to store the JSON string in, the input is required to be captured inside []
    invisibleDownloadLink.href = URL.createObjectURL(dlFileObj); //Use the URL library to turn the blob into an actual file
    //Set the name to something identifiable
    let dateText = (new Date()).toISOString().replaceAll(":","_").replaceAll("-","_").replaceAll(".","_"); //Use the date object to generate a unique name, replace all unusual characters with "_"
    invisibleDownloadLink.download = "wiki_chase_"+wikiRootSetting.replaceAll(".","_")+"_"+namespaceSetting+"_"+pageList.length+"_"+dateText+".JSON"; //Set the link name, also allows us to use it to download the JSON
    invisibleDownloadLink.click(); //Click the invisible link
    URL.revokeObjectURL(invisibleDownloadLink.href);//Delete the URL object from memory 
    //(NOTE: This will trigger the live server to reset!)
}

/*function filePickerUpdate(){

}*/