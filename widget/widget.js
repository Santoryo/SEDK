function addAlert(message, username, messageId, otherInfo) {
  const elem = document.createElement('div');
  elem.innerHTML = `<div class="message">This is my component! o fds</div>`;
  document.getElementById('main-container').appendChild(elem);
}function addCheer(message, username, amount) {
  const elem = document.createElement('div');
  elem.innerHTML = `<div class="message">This is a cheer component test 1 2 3 dn nm</div>`;
  document.getElementById('main-container').appendChild(elem);
}function addMessage(message, username, messageId, userInfo, messageTime) {
  const elem = document.createElement('div');
  elem.innerHTML = `<div class="message">
    <div>username</div>
    <span>[message]</span>
</div>`;
  document.getElementById('main-container').appendChild(elem);
}