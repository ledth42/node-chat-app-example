const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('../../utils/message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const message = generateMessage('Admin', 'Hi');
    expect(message).toMatchObject({from: 'Admin', message: 'Hi'});
    expect(message).toHaveProperty('createdAt');
    expect(typeof message.createdAt).toBe('number');
  })
});

describe('generateLocationMessage', () => {
  it('should generate correct location message object', () => {
    const message = generateLocationMessage('Admin', '21.0423672', '105.7883154');
    expect(message).toMatchObject({from: 'Admin', url: 'https://www.google.com/maps?q=21.0423672,105.7883154'});
    expect(message).toHaveProperty('createdAt');
    expect(typeof message.createdAt).toBe('number');
  })
});
