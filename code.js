let counter_Solved = Number(localStorage.getItem("Solved")) || 0;
let counter_Chats = Number(localStorage.getItem("Chats")) || 0;
let counter_Outbound = Number(localStorage.getItem("Outbound")) || 0;
let ticketNumberHistory = JSON.parse(localStorage.getItem("numbers")) || [];
let productivity = Number(localStorage.getItem("productivity")) || 0;
const API_URL = "https://2iiqoukpvctrtkq3wku3l6bzoy0qefiq.lambda-url.us-west-1.on.aws/";


let userNameDisplay = document.getElementById("userNameDisplay");

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
        alert(`Ticket ${ticket} was NOT logged to Excel (network error). Please try again.`);
    }
}


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
summary.innerText = productivity;



function storeCounters() {
    localStorage.setItem("Solved", counter_Solved);
    localStorage.setItem("Chats", counter_Chats);
    localStorage.setItem("Outbound", counter_Outbound);
    localStorage.setItem("numbers", JSON.stringify(ticketNumberHistory));
}

function resetCounters() {
    localStorage.setItem("Solved", 0);
    localStorage.setItem("Chats", 0);
    localStorage.setItem("Outbound", 0);
    
    
}

function showHistory(letter) {

    let total = counter_Solved+counter_Chats+counter_Outbound;
    ticketNumberHistory.push([user,Number(ticketNumber.value),letter,total]);
    summary.innerText = total
    
    
};

function incrementSolvedCount (){

    const category = 'Email Updated'
    counter_Solved++
    showHistory(category)
    storeCounters();
    send(userNameDisplay.innerText,ticketNumber.value,category)
    ticketNumber.value ='';
    
    
    return counter_Solved

}


function incrementChatsCount (){
    
    const category = 'Chat'
    counter_Chats++
    showHistory(category)
    storeCounters();
    send(userNameDisplay.innerText,ticketNumber.value,category)
    ticketNumber.value ='';

    return counter_Chats

}


function incrementOutboundCount (){

    const category = 'Call'
    counter_Outbound++;
    showHistory(category)
    storeCounters();
    send(userNameDisplay.innerText,ticketNumber.value,category)
    ticketNumber.value ='';

    return counter_Outbound

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

    solvedQuantity.innerText = 0;
    chatsQuantity.innerText = 0;
    outboundQuantity.innerText = 0;
    ticketNumber.value ='';

    }
    
});








