import { InltNamespaces } from './namespaces';

describe('InltNamespaces', () => {
  describe('hasNamespace', () => {
    it('should find namespace pattern in string', () => {
      const result = InltNamespaces.hasNamespace('test:test');
      expect(result).toBe(true);
    });
    it('should not find namespace pattern in string', () => {
      const result = InltNamespaces.hasNamespace('test');
      expect(result).toBe(false);
    });
    it('should not find namespace pattern in empty string', () => {
      const result = InltNamespaces.hasNamespace('');
      expect(result).toBe(false);
    });
  });
  describe('addNamespaceToMessages', () => {
    it('should add namespace prefix to object keys without namespace', () => {
      const result = InltNamespaces.addNamespaceToMessages(
        {
          key1: 'value',
          'ns1:key2': 'value',
        },
        'ns',
      );
      expect(result).toEqual({
        'ns1:key2': 'value',
        'ns:key1': 'value',
      });
    });
  });
  describe('removeNamespaceFromMessages', () => {
    it('should remove namespace prefix to object keys without namespace', () => {
      const result = InltNamespaces.removeNamespaceFromMessages(
        {
          'ns1:key2': 'value',
          'ns:key1': 'value',
        },
        'ns',
      );
      expect(result).toEqual({
        key1: 'value',
        'ns1:key2': 'value',
      });
    });
  });
  describe('getResourceKey', () => {
    it('should remove namespace prefix to object keys without namespace', () => {
      const result = InltNamespaces.getResourceKey(
        {
          defaultMessage: 'message text',
          id: 'message-id',
        },
        'ns',
        ['param1', 'param2'],
      );
      expect(result).toBe('[ns:message-id (param1,param2)]');
    });
  });
  describe('getMessageMetadata', () => {
    it('should remove namespace prefix to object keys without namespace', () => {
      const result = InltNamespaces.getMessageMetadata(
        {
          defaultMessage: 'message text',
          description: 'description text',
          id: 'message-id',
        },
        'ns',
      );
      expect(result).toEqual({
        defaultMessage: 'message text',
        description: 'description text',
        key: 'message-id',
        namespace: 'ns',
      });
    });
  });

  describe('parseId', () => {
    it('should parse namespace prefix and key from id', () => {
      const result = InltNamespaces.parseId('ns:message-id');
      expect(result).toEqual({
        key: 'message-id',
        namespace: 'ns',
      });
    });
  });
});
