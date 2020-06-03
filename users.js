const users = [];

const addUser = (id, room, name) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);

  if(existingUser){
    return {error : "Username is taken"};
  }
  const user = {id, name, room};

  users.push(user);

  return {user};
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1){
    return users.splice(index, 1)[0];
  }
}

const getUser = (id) => {
  return users.find((user) => user.id === id);
}

const getUserInRoomCount = (room) => (users.filter((user) => {return (user.room === room)})).length;

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {addUser, removeUser, getUser, getUsersInRoom, getUserInRoomCount};