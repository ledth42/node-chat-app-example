const expect = require('expect');
const { Users } = require('../../utils/users');

let users;

beforeEach(() => {
  users = new Users();
  users.users = [
    {
      id: '1',
      name: 'User name 1',
      room: 'ROOM A',
    },
    {
      id: '2',
      name: 'User name 2',
      room: 'ROOM B',
    },
  ];
});
describe('Users', () => {
  it('should add new user', () => {
    const userList = new Users();
    const user = {
      id: '123',
      name: 'User name',
      room: 'ROOM A',
    };
    const resUsers = userList.addUser(user.id, user.name, user.room);
    expect(resUsers).toEqual(user);
  });

  it('should get all users', () => {
    const userList = users.getUserList('Room a');
    expect(userList).toEqual([users.users[0]]);
  });

  it('should remove user', () => {
    const user = users.removeUser('1');
    expect(user.id).toEqual('1');
  });
  it('should not remove user', () => {
    const user = users.removeUser('3');
    expect(user).toBeFalsy();
  });

  it('should return user if id exist', () => {
    const user = users.getUser('1');
    expect(user.id).toEqual('1');
  });

  it('should not return any user with id not exist', () => {
    const user = users.getUser('123');
    expect(user).toBeFalsy();
  });

  it('should return user by name', () => {
    const user = users.getUserByName('User name 1', 'ROOM A');
    expect(user.name).toEqual('User name 1');
  });

  it('should not return any user with name not exist', () => {
    const user = users.getUserByName('User name 12', 'ROOM A');
    expect(user).toBeFalsy();
  });
});
