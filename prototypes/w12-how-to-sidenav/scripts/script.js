let enabled = false; //Variable to store

onpageshow
//Hide or show quick links
function toggleQuickLinks(){
    if(window.innerWidth <= 750){
       //Add a way to detect if the media query is active
       let navLinks = document.querySelectorAll("#lessonNav a"); //Get all the links in the lesson nav
       for(let i= 0; i<navLinks.length; i++){
           navLinks[i].classList.toggle("show"); //Turn them on or off
       }
    }else{
        //Remove the hide selector
        //let navLinks = document.querySelectorAll("#lessonNav a hide");
        //for(let i = 0; i<navLinks)
    }
}