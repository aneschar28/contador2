let counter_Solved = Number(localStorage.getItem("Solved")) || 0;
let counter_Chats = Number(localStorage.getItem("Chats")) || 0;
let counter_Outbound = Number(localStorage.getItem("Outbound")) || 0;
let ticketNumberHistory = JSON.parse(localStorage.getItem("numbers") || "[]");
let saver = JSON.parse(localStorage.getItem("nosend") || "[]");
const API_URL = "https://2iiqoukpvctrtkq3wku3l6bzoy0qefiq.lambda-url.us-west-1.on.aws/";


let userNameDisplay = document.getElementById("userNameDisplay");



function userName() {

    let user = prompt("What is your name?");

    while (user === null || user.trim() === "") {
        user = prompt("you must type your name");
    }

    return user;
}

let user = userName();
userNameDisplay.innerText = user

function ticketNumberLock() {

    if (ticketNumber.value === null || ticketNumber.value.trim() === "") {
        alert('Please enter ticket number!')
    }

}



const ticketNumber = document.getElementById("myInput");
const info_box = document.getElementById("info-box");

const solvedQuantity = document.getElementById("solvedQuantity");
const addSolved = document.getElementById("addSolved");

const chatsQuantity = document.getElementById("chatsQuantity");
const addChats = document.getElementById("addChats");

const outboundQuantity = document.getElementById("outboundQuantity");
const addOutbound = document.getElementById("addOutbound");

const resetmemory = document.getElementById("resetmemory");

const summary = document.getElementById("productivity");

solvedQuantity.innerText = counter_Solved;
chatsQuantity.innerText = counter_Chats;
outboundQuantity.innerText = counter_Outbound;
summary.innerText = counter_Solved+ counter_Chats+ counter_Outbound;
info_box.innerHTML = "<ol>" + ticketNumberHistory.map(ticket => `<li>${ticket[1]} | ${ticket[2]}</li>`).join("") + "</ol>";





function storeCounters() {
    localStorage.setItem("Solved", counter_Solved);
    localStorage.setItem("Chats", counter_Chats);
    localStorage.setItem("Outbound", counter_Outbound);
    localStorage.setItem("numbers", JSON.stringify(ticketNumberHistory));
    localStorage.setItem("nosend", JSON.stringify(saver));
}

function resetCounters() {
    localStorage.setItem("Solved", 0);
    localStorage.setItem("Chats", 0);
    localStorage.setItem("Outbound", 0);
    localStorage.setItem("numbers", JSON.stringify([]));
    localStorage.setItem("nosend", JSON.stringify([]));
    
}

function showHistory(letter) {

    let total = counter_Solved+counter_Chats+counter_Outbound;
    ticketNumberHistory.push([user,Number(ticketNumber.value.replace(/\D/g, "")),letter,total]);
    console.log(ticketNumberHistory);
    info_box.innerHTML = "<ol>" + ticketNumberHistory.map(ticket => `<li>${ticket[1]} | ${ticket[2]}</li>`).join("") + "</ol>";
    summary.innerText = total;
    
    
};

function incrementSolvedCount (){

    const category = 'Email Updated'
    counter_Solved++
    showHistory(category)
    send(userNameDisplay.innerText,ticketNumber.value,category);
    storeCounters();
    ticketNumber.value ='';
    
    
    return counter_Solved

}


function incrementChatsCount (){
    
    const category = 'Chat'
    counter_Chats++
    showHistory(category)
    send(userNameDisplay.innerText,ticketNumber.value,category)
    storeCounters();
    ticketNumber.value ='';

    return counter_Chats

}


function incrementOutboundCount (){

    const category = 'Call'
    counter_Outbound++;
    showHistory(category)
    send(userNameDisplay.innerText,ticketNumber.value,category)
    storeCounters();
    ticketNumber.value ='';

    return counter_Outbound

}

async function send(user, ticket, type) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, ticket, type }),
        });
        if (!res.ok) {
            console.error("Excel sync failed:", await res.text());
            alert(`Ticket ${ticket} was NOT logged to Excel. Please try again.`);
            
        }
    } catch (error) {
        console.error("Network error:", error);
        saver.push([user,ticket,type]);
        storeCounters();
        console.log(saver)
        alert(`Ticket ${ticket} was NOT logged to Excel (network error). Please try again.`);
        
    }
}



addSolved.addEventListener("click", function() {

    if (ticketNumber.value === null || ticketNumber.value.trim() === "") {
        alert('Please enter ticket number!')
    }else{

        incrementSolvedCount();
        solvedQuantity.innerText = counter_Solved

    }
    
});


addChats.addEventListener("click", function() {

    if (ticketNumber.value === null || ticketNumber.value.trim() === "") {
        alert('Please enter ticket number!')
    }else{

        incrementChatsCount();
        chatsQuantity.innerText = counter_Chats

    }

   
});


addOutbound.addEventListener("click", function() {

    if (ticketNumber.value === null || ticketNumber.value.trim() === "") {
        alert('Please enter ticket number!')
    }else{

        incrementOutboundCount();
        outboundQuantity.innerText = counter_Outbound

    }

    
});


resetmemory.addEventListener("click", function() {

    if (confirm("Are you sure you want to reset all counters?")) {
        
    resetCounters();
    counter_Solved = 0;
    counter_Chats = 0;
    counter_Outbound = 0;
    ticketNumberHistory = [];
    saver = [];

    solvedQuantity.innerText = 0;
    chatsQuantity.innerText = 0;
    outboundQuantity.innerText = 0;
    summary.innerText = 0;
    ticketNumber.value ='';
    info_box.innerHTML = "";

    }
    
});

async function send2(user, ticket, type) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, ticket, type }),
        });

        if (!res.ok) {
            throw new Error("Server error: " + res.status);
        }

        return true;

    } catch (error) {
        console.log("Sending saved data failed:", error);
        return false;
    }
}


let isRetrying = false;

setInterval(async function() {

    if (isRetrying || saver.length === 0) return;

    isRetrying = true;

    try {
        while (saver.length > 0) {

            let ticket = saver[0];

            const success = await send2(
                ticket[0],
                ticket[1],
                ticket[2]
            );

            if (success) {

                saver.shift();
                storeCounters();

            } else {

                break;

            }
        }

    } finally {
        isRetrying = false;
    }

}, 300000);





