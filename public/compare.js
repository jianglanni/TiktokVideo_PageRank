let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
  heartButtons[i].lastElementChild.style.display = "none";
  add_listener(i);
} // for loop

let video_rows = [-1, -1];
let choice = -1;
let enemy = -1;

sendGetRequest("/getTwoVideos").then((video_list)=> {
    for (let i=0; i<2; i++) {
        video_rows[i] = video_list[i].rowIdNum;
        addVideo(video_list[i].url, videoElmts[i]);
    }
}).then(loadTheVideos).catch((err)=>{console.log("ERROR", err);});

let next_button = document.getElementById("next_button");
next_button.addEventListener("click", next_trigger);

function set_pref(target) {
    choice = target;
    enemy = (target+1) % 2;
    heartButtons[target].classList.remove("unloved");
    heartButtons[target].classList.add("loved");
    heartButtons[target].firstElementChild.style.display = "none";
    heartButtons[target].lastElementChild.style.display = "inline";

    heartButtons[enemy].classList.remove("loved");
    heartButtons[enemy].classList.add("unloved");
    heartButtons[enemy].lastElementChild.style.display = "none";
    heartButtons[enemy].firstElementChild.style.display = "inline";
}

function add_listener(target) {
    heartButtons[target].addEventListener("click", ()=>{set_pref(target);});
}

function next_trigger() { 
    sendPostRequest("/insertPref", {"better": video_rows[choice], "worse": video_rows[enemy]}).then((res)=>{
        if (res == "continue") {
            location.reload();
        } else {
            window.location = "/winner.html";
        }
    }).catch((err)=>{console.log(err);});
}

async function sendGetRequest(url) {
  params = {
    method: 'GET', 
  };
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.json();
    return data;
  } else {
    throw Error(response.status);
  }
}

async function sendPostRequest(url,data) {
  params = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data) };
  console.log("about to send post request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}