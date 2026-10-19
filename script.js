let currentUser = { username: "Guest", pfp: "" };
let publicRoomCounter = 1;
let selectedMediaData = null;
let selectedMediaType = "";

// --- CALCULATOR FUNCTIONALITY ---
function pressCalc(val) {
    document.getElementById('calc-display').value += val;
}
function clearCalc() {
    document.getElementById('calc-display').value = '';
}
function calculateResult() {
    let display = document.getElementById('calc-display');
    
    // Check for the secret chat trigger code
    if (display.value === "00xy00") {
        clearCalc();
        document.getElementById('calculator-view').style.display = 'none';
        document.getElementById('login-view').style.display = 'flex';
        requestNotificationPermission();
        return;
    }
    
    try {
        display.value = eval(display.value);
    } catch(err) {
        display.value = 'Error';
    }
}

// --- LOGIN PROFILE CONFIG ---
function handleLogin() {
    let username = document.getElementById('username-input').value.trim();
    let pfpFile = document.getElementById('pfp-input').files[0];
    
    if(!username) {
        alert("Please enter a username!");
        return;
    }
    
    currentUser.username = username;
    document.getElementById('user-display-name').innerText = username;
    
    if(pfpFile) {
        let reader = new FileReader();
        reader.onload = function(e) {
            currentUser.pfp = e.target.result;
            let sidebarImg = document.getElementById('user-pfp');
            sidebarImg.src = e.target.result;
            sidebarImg.style.display = 'block';
        }
        reader.readAsDataURL(pfpFile);
    }
    
    document.getElementById('login-view').style.display = 'none';
    document.getElementById('chat-view').style.display = 'flex';
}

// --- CHAT SYSTEM LOGIC ---
function sendMessage() {
    let textInput = document.getElementById('message-input');
    let messageText = textInput.value.trim();
    
    if(!messageText && !selectedMediaData) return;
    
    let messageArea = document.getElementById('message-area');
    
    // Create Message Bubble element
    let bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    
    let imgHTML = currentUser.pfp ? `<img class="msg-pfp" src="${currentUser.pfp}">` : `<div class="msg-pfp" style="background:#ccc;"></div>`;
    
    let mediaHTML = "";
    if(selectedMediaData) {
        if(selectedMediaType.startsWith('image/')) {
            mediaHTML = `<img src="${selectedMediaData}" class="chat-media"><br><a href="${selectedMediaData}" download="image" class="download-link">💾 Download Image</a>`;
        } else if(selectedMediaType.startsWith('video/')) {
            mediaHTML = `<video src="${selectedMediaData}" controls class="chat-media"></video><br><a href="${selectedMediaData}" download="video" class="download-link">💾 Download Video</a>`;
        }
    }
    
    bubble.innerHTML = `
        ${imgHTML}
        <div class="msg-content">
            <div class="msg-username" onclick="sendFriendRequest('${currentUser.username}')">${currentUser.username}</div>
            <div>${messageText}</div>
            ${mediaHTML}
        </div>
    `;
    
    messageArea.appendChild(bubble);
    messageArea.scrollTop = messageArea.scrollHeight;
    
    // Reset inputs
    textInput.value = "";
    selectedMediaData = null;
    selectedMediaType = "";
}

// --- HANDLING ATTACHMENTS (Images/Videos/Gifs) ---
function handleMediaSelect() {
    let file = document.getElementById('media-input').files[0];
    if(!file) return;
    
    selectedMediaType = file.type;
    let reader = new FileReader();
    reader.onload = function(e) {
        selectedMediaData = e.target.result;
        alert("Media attached successfully! Press Send to post.");
    }
    reader.readAsDataURL(file);
}

// --- INTERACTIVE ACTIONS (Friend Requests & Modals) ---
function sendFriendRequest(name) {
    alert(`Sent a friend request to ${name}!`);
    sendNotification("Friend Request", `You sent a friend request to ${name}.`);
}

function openCreateModal() { document.getElementById('create-modal').style.display = 'flex'; }
function closeModal() {
    document.getElementById('create-modal').style.display = 'none';
    document.getElementById('private-modal').style.display = 'none';
}

function createPublicSubRoom() {
    let list = document.getElementById('rooms-list');
    let item = document.createElement('div');
    item.className = 'room-item';
    item.innerText = `💬 chat${publicRoomCounter}`;
    let roomName = `chat${publicRoomCounter}`;
    item.onclick = function() { switchRoom(roomName); };
    list.appendChild(item);
    
    publicRoomCounter++;
    closeModal();
}

function openPrivateSubMenu() {
    document.getElementById('create-modal').style.display = 'none';
    document.getElementById('private-modal').style.display = 'flex';
}

function inviteAllFriends() { alert("All your friends have been invited to this private session!"); }

function startPrivateChat() {
    let code = document.getElementById('join-code-input').value.trim();
    if(!code) { alert("Please input a Join Code!"); return; }
    
    let list = document.getElementById('rooms-list');
    let item = document.createElement('div');
    item.className = 'room-item';
    item.innerText = `🔒 Private Room (${code})`;
    item.onclick = function() { switchRoom(`Private Room (${code})`); };
    list.appendChild(item);
    
    closeModal();
}

function showFriendsList() {
    alert("Displaying Direct Friends List view (No other users can see these streams).");
    switchRoom("Friends Direct Chat");
}

function switchRoom(name) {
    document.getElementById('current-room-title').innerText = name;
    document.getElementById('message-area').innerHTML = ''; // Clears UI viewport simulator
}

// --- NOTIFICATION API ENGINE ---
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
}
function sendNotification(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body: body });
    }
}
