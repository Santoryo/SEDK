let totalMessages = 0;
let messagesLimit = 30;
window.addEventListener('onEventReceived', async function (obj) {
    controller(obj.detail);
});
function controller(detail) {
    totalMessages++;
    switch (detail.listener) {
    case 'message':
        addMessage(detail.event.renderedText, detail.event.data.displayName, totalMessages, detail.event.data);
        break;
    case 'cheer-latest':
        addCheer('HAS CHEERED', detail.event.name, detail.event.amount);
        break;
    }
}
function addAlert(message, username, messageId, otherInfo) {
    const elem = document.createElement('div');
    elem.innerHTML = `<div class="message">This is my component! o fds</div>`;
    document.getElementById('main-container').appendChild(elem);
}
function addCheer(message, username, amount) {
    const elem = document.createElement('div');
    elem.innerHTML = `<div class="message">This is a cheer component test 1 2 3 dn nm</div>`;
    document.getElementById('main-container').appendChild(elem);
}
function addMessage(message, username, messageId, userInfo) {
    let randomNum = Math.floor(Math.random() * 1000);
    const elem = document.createElement('div');
    elem.innerHTML = `<div class="message">
    <div>username</div>
    <span>${ message }</span>
    <span>Random num: ${ randomNum }</span>
</div>`;
    document.getElementById('main-container').appendChild(elem);
    console.log('Successfully appended message to the DOM ' + message);
}
function addUwu(owo, xd, haha, meme, heeeee) {
    const elem = document.createElement('div');
    elem.innerHTML = `<span id="${ owo }">
  ${ xd }
</span>`;
    document.getElementById('main-container').appendChild(elem);
}