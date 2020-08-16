function updateRoomList() {
  roomsList.innerHTML = `
    <h2>Room ${socket.room} for ${numPlayers} players.</h2>
    <p>players:</p>
    <div id="players">${
      users
      .map(u => `<span>${u.userID}</span>`)
      .join(' &nbsp; ')
    }</div>
  `
}

if (queryString.match(/\bgame=/)) {
  // User is inside a game room.

  body.classList.add('lobby2')

  socket.on('youAreTheOwner', ()=> {
    isRoomOwner = true;
    notify("You'r the owner. Don't disconnect.")
  })

  socket.on('numPlayers', (num)=> {
    numPlayers = num;
  })

  socket.on('forgotingRoom', ()=> {
    debug("The server is forgoting this room.")
  })

} else {
  // User is in the public lobby.

  body.classList.add('lobby1')

  socket.on('rooms', (rooms)=> {
    if (rooms.length) {
      roomsList.innerHTML = '<p>Public rooms:</p>'
      rooms.forEach( ([id, num, tot]) => {
        let link = mkEl('a')
        link.href = '?game=' + id
        link.innerText = `Players: ${num} of ${tot}`
        roomsList.appendChild(link)
      })
    } else {
      roomsList.innerHTML = 'There are no public rooms yet.'
    }
  })

  let label = mkEl('label')
  label.style.fontWeight = 'bold'
  label.innerHTML = 'Create a new room:'
  lobby.appendChild(label)

  label = mkEl('label')
  label.innerText = 'Players:'
  lobby.appendChild(label)
  const inputNum = mkEl('input')
  inputNum.id = 'inputNum'
  inputNum.type = 'number'
  inputNum.min = 2
  inputNum.max = 10
  inputNum.value = 2
  label.appendChild(inputNum)

  label = mkEl('label')
  lobby.appendChild(label)
  const inputPub = mkEl('input')
  inputPub.type = 'checkbox'
  inputPub.checked = true
  label.appendChild(inputPub)
  label.appendChild(mkEl('span', 'Public'))

  const btCreate = mkEl('button')
  btCreate.id = 'btCreateRoom'
  btCreate.innerText = 'Create'
  lobby.appendChild(btCreate)
  btCreateRoom.onclick = ()=> {
    socket.emit('creteRoom', {num:inputNum.value, pub:inputPub.checked})
  }
  socket.on('romCreated', (gameID)=> {
    document.location.href = `?game=${gameID}${DEBUG_MODE?'&debug=on':''}`
  })
}