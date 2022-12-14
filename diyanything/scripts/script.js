initialize_particles(65,5,20,20); //Initalize on script loading
//document.getElementById("particleContainer").onload = function(){
    //initialize_particles(10,10,20,20);
//}

function initialize_particles(particleXCount = 3, particleYCount = 3, particleXSize = 10, particleYSize = 10){
    //alert("Load successful");// Debugging alert
    //alert("Particle X Count: "+particleXCount) //Debugging alert
    
    //Update style sheet variables
    document.querySelector(":root").style.setProperty('--particleXCount',particleXCount);
    document.querySelector(":root").style.setProperty('--particleYCount',particleYCount);
    document.querySelector(":root").style.setProperty('--particleXSize',particleXSize+"px");
    document.querySelector(":root").style.setProperty('--particleYSize',particleYSize+"px");

    let particle_id = 0;
    let container = document.getElementById("particleContainer");
    //console.log(container);
    //let parser = new DOMParser() //Initalization for the parser
    for (let y = 0; y<particleYCount; y++){
        let rowContainer = document.createElement("div");
        rowContainer.classList= ["rowContainer cr"+y];
        for (let x = 0; x < particleXCount; x++){
            //let newParticle = parser.parseFromString('<div class="particle p'+particle_id+'"></div>',"text/html");
            //console.log(newParticle);
            //document.getElementById("particleContainer").appendChild(newParticle);
            let newParticle = document.createElement("div");
            newParticle.classList = ["particle p"+particle_id+" r"+y+" c"+x];
            //newParticle.innerText = ""+particle_id+","+x+","+y; //Debugging
            //console.log(newParticle);
            rowContainer.appendChild(newParticle);
            // container.appendChild(newParticle);
            particle_id++;
        }
        container.appendChild(rowContainer);
    }
}

/*Store the hero Header as a JavaScript variable*/
// var heroHeader = null;
// connectToHeader();
// function connectToHeader(){
    // heroHeader = document.getElementById("heroTitleContainer").getBoundingClientRect();
    /*Unused code:*/
    /*
    clientRect has the following variables:
    x = x position in document
    y = y position in document
    width = width
    height = height
    bottom: y position of the bottom
    top: y position of the top
    right: X position of the right side
    left: X position of the left side
    */
// }

// var minX = heroHeader.left;
// var maxX = heroHeader.right;
// var minY = heroHeader.top;
// var maxY = heroHeader.bottom;
// var Bwidth = heroHeader.width;
// var Bheight = heroHeader.height;

/*Update the hero title size*/
function updateHeroTitle(){
    let heroHeader = document.getElementById("heroTitleContainer").getBoundingClientRect();
    // minX = heroHeader.x;
    // maxX = heroHeader.x - heroHeader.width;
    // minY = heroHeader.y;
    // maxY = heroHeader.y - heroHeader.height;
    let minX = heroHeader.left;
    let maxX = heroHeader.right;
    let minY = heroHeader.top;
    let maxY = heroHeader.bottom;
    let Bwidth = heroHeader.width;
    let Bheight = heroHeader.height;
    // console.log(heroHeader.x+","+heroHeader.y+" "+minX+","+maxX+","+minY+","+maxY+","+Bwidth+","+Bheight);
    return [minX, maxX, minY, maxY, Bwidth, Bheight]
}

let update_timer = 0;
document.onmousemove = function(mEvent){
    if(update_timer <= 0){
        let TitleData = updateHeroTitle();
        let minX = TitleData[0]
        let maxX = TitleData[1]
        let minY = TitleData[2]
        let maxY = TitleData[3]
        let Bwidth = TitleData[4]
        let Bheight = TitleData[5]
        /*
        Mouse events store the following information:
        clientX = x position on the screen
        clientY = y position on the screen
        offsetX = X position in the screen
        offsetY = Y position in the screen
        */
        /*Save the mouse position*/
        // document.querySelector(":root").style.setProperty("--mouseX",mEvent.clientX+"deg");
        // document.querySelector(":root").style.setProperty("--mouseY",mEvent.clientY+"deg");

        /*Use the mouse position to calculate rotation*/
        let maxTiltX = 22.5;
        let maxTiltY = 22.5;
        let mouseX = mEvent.clientX;
        let mouseY = mEvent.clientY;
        //tan(opposite / adjacent) = degrees for 2d rotation
        //Just use if statements
        // console.log("Mouse: "+mEvent.screenX+" "+mEvent.screenY+" "+mEvent.clientX+" "+mEvent.clientY+" "+mEvent.offsetX+" "+mEvent.offsetY+" "+mEvent.pageX+" "+mEvent.pageY)
        // console.log(mouseX+" "+mouseX+" "+minX+" "+maxX);
        // console.log(mouseY+" "+mouseY+" "+minY+" "+maxY);
        let tiltX = 0;
        if(mouseX <= minX / 2){
            tiltX = -maxTiltX;
        }else if( maxX * 2 <= mouseX ){
            tiltX = maxTiltX;
        }else{//((maxX-mouseX)/width)-0.5???
            tiltX = (-2 * (((maxX-mouseX) / Bwidth) - 0.5)) * maxTiltX;
        }
        /*Filter out ones that exceed maximum*/
        if(tiltX > maxTiltX){
            tiltX = maxTiltX;
        }else if(tiltX < -maxTiltX){
            tiltX = -maxTiltX;
        }
        // console.log("X "+tiltX+" "+((-2 * (((maxX-mouseX) / Bwidth) - 0.5))));

        let tiltY = 0;
        if(mouseY <= minY / 2){
            tiltY = -maxTiltY;
        }else if( maxY * 2 <= mouseY ){
            tiltY = maxTiltY;
        }else{//???
            /*Something is very wrong here*/
            //tiltY = -1 * (((maxY-mouseY) / Bheight) - 0.5) * maxTiltY;
            tiltY = ((-2 * (((maxY-mouseY) / Bheight) - 0.5)) * maxTiltY);
        }
        /*Filter out ones that exceed maximum*/
        if(tiltY > maxTiltY) {
            tiltY = maxTiltY;
        }else if(tiltY < -maxTiltY) {
            tiltY = -maxTiltY;
        }

        /*Flip X if Y is negative*/
        //if(tiltY < 0){
            //Attempted fixes
            // tiltX = -tiltX;
            // tiltY = -tiltY;
        //}

        /*Why is this happenging??? I must have messed up a calculation, I really need a way to visualize this...*/
        
        //It's because it was correct the first time!!!
        
        // console.log("Y "+tiltY+" "+(-2 * (((maxY-mouseY) / Bheight) - 0.5)));
        document.querySelector("#heroTitle").style.setProperty("--mouseX",tiltX+"deg");
        document.querySelector("#heroTitle").style.setProperty("--mouseY",-tiltY+"deg");
        //Do not update height:
        // document.querySelector("#heroTitle").style.setProperty("--titleW",Bwidth+"px");
        // document.querySelector("#heroTitle").style.setProperty("--titleH",Bheight+"px");
        /*Disabled update delay timer*/
        update_timer = 0; /*Adding a timer keeps it from lagging out*/
        // console.log("Mouse:["+mEvent.clientX+","+mEvent.clientY+","+mEvent.offsetX+","+mEvent.offsetY+"] Header:["+heroHeader.x+","+heroHeader.y+","+heroHeader.width+","+heroHeader.height+"]");
    }else{
        update_timer -= 2;
    }
}

//Checkbox evaluation
function evalCB(checkBoxIn){
    // if(document.getElementById('warningCBox').checked == true){
    let hiddenBox = document.getElementById('hiddenBox');
    if(checkBoxIn.checked == true){
        hiddenBox.classList.replace('hiddenContent','visibleContent'); 
    }else{
        hiddenBox.classList.replace('visibleContent','hiddenContent'); 
    }
}

//Quick link globals

let quickLinks = document.getElementsByClassName("quickLink");
let chapterHeaderList = document.getElementsByClassName("sectionContainer");
//toolbox page patch
let dlHeaderList = document.getElementsByClassName("dlsectionContainer");
if(dlHeaderList != null){
    if(dlHeaderList.length >= 1){
        chapterHeaderList = dlHeaderList;
    }
}
let currentChapter = 0;
let lastPos = [];
let maxChapter = chapterHeaderList.length;
let inititalizedList = false; //Prevent the code from updating like crazy
let YposList = [];//Store the ypos
let disableScrollTracking = false;
let debuggerText = document.querySelector("#quickLinkBox h2");
let previousChapter = -1;

//Things to check when this isn't working:
//Does the number of sectionContainers equal the number of quick links?
//Do the sections overlap?


updateQuickLinks();
function updateQuickLinks(){
    if(quickLinks.length == 0){
        disableScrollTracking = true;
    }
    if(!disableScrollTracking){
        let scrollYCapture = scrollY;
        let screenYCapture = window.innerHeight;
        if(!inititalizedList){
            YposList = [];
            for(let i=0;i<maxChapter;i++){
                let boundingBox = chapterHeaderList[i].getBoundingClientRect();
                let minY = boundingBox.top;
                let maxY = boundingBox.bottom;
                YposList.push([minY,maxY]);
                //debuggerText.textContent = ""+scrollYCapture;
                //debuggerText.textContent = ""+screenYCapture;
                //quickLinks[i].textContent = ""+minY+", "+maxY;//Debugging line
                // if(minY <= scrollYCapture && scrollYCapture <= maxY){
                    // currentChapter = i;
                    // lastPos = structuredClone([minY,maxY]);
                    // console.log("Chapter: "+currentChapter);
                // }
                if(minY * 1.5 < window.innerHeight){
                    currentChapter = i;
                }
            }
            if(previousChapter != currentChapter && previousChapter != -1){
                quickLinks[previousChapter].classList.toggle("scrolled");
                quickLinks[currentChapter].classList.toggle("scrolled");
                previousChapter = currentChapter;
            }else if(previousChapter == -1){
                previousChapter = 0;
            }
            
            //Do this over and over again!!!

            //inititalizedList = false; //Done with initalization

        }else{
            //This never worked!!! And since it's not intensive to repeat initalization, just do that over and over again!!!

            //Figure out the next chapter
            console.log("Last Chapter: "+currentChapter);
            console.log(scrollYCapture);
            //Repeat until the mouse is within range
            while(!(scrollYCapture >= lastPos[0] && scrollYCapture <= lastPos[1])){
                
                if(scrollYCapture < lastPos[0]){
                    currentChapter--;
                }else if(scrollYCapture > lastPos[1]){
                    currentChapter++;
                }
                if(currentChapter >= maxChapter + 1){
                    currentChapter = maxChapter;
                    lastPos = structuredClone(YposList[maxChapter]);
                    break;/*Get out of the loop*/
                }else if(currentChapter < 0){
                    currentChapter = 0;
                    lastPos = structuredClone(YposList[1]);
                    break;/*Get out of the loop*/
                }
                lastPos = structuredClone(YposList[currentChapter]);
            }
            //Only update if the chapter doesn't match
            if(currentChapter > 0 && currentChapter < maxChapter + 1 ){
                lastPos = YposList[currentChapter];
            }

        }
    }
    
}

//Quick link tracker on scroll event
document.onscroll = function(scrollEvent){
    if(!disableScrollTracking){
        updateQuickLinks();
    }
    // console.log(scrollY);
}

//Was going to be a function to toggle the scrolled class on and off
//But I ended up doing it in the loop
function quickLinkChange(){
    let lastQuickLink = document.querySelectorAll(".scrolled");
}

function quickLinkToggle(){
    let quickLinkBox = document.getElementById("quickLinkBox");
    if (window.innerWidth <= 800){ //Media query
        quickLinkBox.classList.toggle("visible");
    }else{
        quickLinkBox.classList.toggle("visible",false); //Force to off
    }
}

//Hex explorer
const hexTextList = {
    int: ["int32 / dword (32 bit integer)","4 bytes (32 bits)","1","Unknown, it doesn't exceed the signed / unsigned threshold for this data type","Little Endian"],
    float: ["Float (Float32 32)","4 bytes (32 bits)","1.0","Cannot be signed","Little Endian"],
    short: ["Int16 / word (16 bit integer)","2 bytes (16 bits)","4","Unknown, it doesn't exceed the signed / unsigned threshold for this data type","Little Endian"],
    stringzero: ["Zero Terminated String","Currently 21 bytes (including short and 0 terminator), varies in size",'"Hex editing is fun!"',"Strings Don't have Endianess, but the string length short is Little Endian"],
    int_s: ["Int32 / dword (32 bit integer)","4 bytes (32 bits)","-1","Signed","Little Endian"],
    int_be: ["Int32 / dword (32 bit integer)","4 bytes (32 bits)","12","Unknown, it doesn't exceed the signed / unsigned threshold for this data type","Big Endian"],
    color: ["Color RGBA","4 byte entries","RGBA (36, 141, 250, 255)","Signed","Not Applicable, Single Bytes Don't Have Endianess"],
    header: ["Header","4 bytes, typically 4 bytes, varies in size","Not applicable","Not Applicable, Headers do not have Endianess"],
    matrix: ["Matrix","64 bytes (16 float32 entries)","[1.0 0.0 0.0 0.0], [0.0 1.0 0.0 0.0], [0.0 0.0 1.0 0.0], [0.0 0.0 0.0 1.0]","Cannot be signed","Little Endian"],
}
//Update the hex info panel, and mark the current item as "active"
function updateHexBox(callerNameStr){
    let currentActiveList = document.querySelectorAll('div.hex.active, div.ansi.active, .desc.active');
    let activeListLen = currentActiveList.length; //Store the length
    //Remove the active status from all active items
    for(let i = 0; i<activeListLen; i++){
        let curItem = currentActiveList[i];
        let curClassName = curItem.classList[1];//Get the name of the item (it's the second item)
        if(curClassName == callerNameStr){ //If it's identical to the one that's trying to activate return early
            return;
        }else{//Remove it if it doesn't contain the input string
            console.log("Removing: "+curClassName);
            curItem.classList.toggle("active",false);
        }
    }
    //Set the desired hex and ascii display to active
    let activationElemList = document.querySelectorAll("."+callerNameStr);
    console.log(activationElemList);
    let activeElemLength = activationElemList.length;
    for(let i = 0; i<activeElemLength;i++){
        let elemToActivate = activationElemList[i];
        elemToActivate.classList.toggle("active",true);
    }
    //Update the description
    let descriptionEntry = hexTextList[callerNameStr];
    document.getElementById("nameLabel").textContent = "Data Type: "+descriptionEntry[0];
    document.getElementById("lengthLabel").textContent = "Length: "+descriptionEntry[1];
    document.getElementById("valueLabel").textContent = "Value: "+descriptionEntry[2];
    document.getElementById("signedLabel").textContent = "Signed or Unsigned: "+descriptionEntry[3];
    document.getElementById("byteOrderLabel").textContent = "Byte Order: "+descriptionEntry[4];

    //Not applicable, I just added more entries //Activate the corresponding text box

}
function linkHover(in_name, set_state=true){
    let target_elements = document.querySelectorAll("."+in_name);
    for (let i = 0; i < target_elements.length; i++) {
        target_elements[i].classList.toggle("hov",set_state); //Set it to what the function call says (ex called false will force it off!!!)
    }
}