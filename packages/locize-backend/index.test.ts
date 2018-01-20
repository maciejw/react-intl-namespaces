import { interpolate } from './index';

describe('interpolate', () => {
  it('should interpolate template string with provided values', () => {
    const result = interpolate('some ${interpolated} text ${count}.', {
      count: 5,
      interpolated: 'interpolated',
    });
    expect(result).toBe('some interpolated text 5.');
  });
});
