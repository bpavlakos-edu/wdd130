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

        update_timer = 10; /*Adding a timer keeps it from lagging out*/
        // console.log("Mouse:["+mEvent.clientX+","+mEvent.clientY+","+mEvent.offsetX+","+mEvent.offsetY+"] Header:["+heroHeader.x+","+heroHeader.y+","+heroHeader.width+","+heroHeader.height+"]");
    }else{
        update_timer -= 2;
    }
}