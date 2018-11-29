const expect = require('expect');
const {isRealString} = require('../../utils/validation');

describe('isRealString', () => {
  it('should reject string with only spaces', () => {
    const isString = isRealString('    ');
    expect(isString).toBe(false);
  })

  it('should reject non string values', () => {
    const isString = isRealString(false);
    expect(isString).toBe(false);
  })

  it('should return true', () => {
    const isString = isRealString('A string example');
    expect(isString).toBe(true);
  })
});
