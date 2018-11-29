class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room: room.toUpperCase() };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const user = this.getUser(id);
    if (user) {
      this.users = this.users.filter(u => u.id !== id);
    }
    return user;
  }

  getUser(id) {
    return this.users.find(user => user.id === id);
  }

  getUserByName(name) {
    return this.users.find(user => user.name === name);
  }

  getUserList(room) {
    return this.users.filter(user => user.room === room.toUpperCase());
  }
}

module.exports = { Users };
