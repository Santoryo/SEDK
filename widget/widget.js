let totalMessages = 0;
let messagesLimit = 30;
window.addEventListener("onEventReceived", async function (obj) {
  // @ts-ignore
  controller(obj.detail);
});

/**
 *
 * @param {SEDK.Detail} detail
 */
function controller(detail) {
  totalMessages++;
  switch (detail.listener) {
    case "message":
      addMessage(detail.event.renderedText, detail.event.data.displayName, totalMessages, detail.event.data);
      break;
    case "subscriber-latest":
      addAlert("has just subscribed the channel!", detail.event.name, totalMessages);
      break;
    case "cheer-latest":
      addAlert("has just cheered the channel!", detail.event.name, totalMessages);
      break;
  }
}
function addMessage(message, username, messageId, userInfo) {
  const elem = document.createElement('div');
  elem.innerHTML = `<div class="message" id="m${messageId}">
    <div>${username}</div>
    <span>${message}</span>
</div>
`;
  document.getElementById('main-container').appendChild(elem);
  console.log("Successfully appended message to the DOM " + message);
}
function addAlert(message, user, messageId) {
  const elem = document.createElement('div');
  elem.innerHTML = `<div class="alert" id="m${messageId}">
    <div>${user}</div>
    <span>${message}</span>
</div>`;
  document.getElementById('main-container').appendChild(elem);
}