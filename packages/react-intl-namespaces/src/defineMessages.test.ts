import { defineMessages } from './defineMessages';

describe('defineMessages', () => {
  it('should return supplied messages', () => {
    const messages = defineMessages<'Property-1' | 'Property-2'>({
      'Property-1': { id: 'Property-1', defaultMessage: 'Message1' },
      'Property-2': { id: 'Property-2', defaultMessage: 'Message2' },
    });

    expect(messages).toEqual({
      'Property-1': {
        defaultMessage: 'Message1',
        id: 'Property-1',
      },
      'Property-2': {
        defaultMessage: 'Message2',
        id: 'Property-2',
      },
    });
  });
});
