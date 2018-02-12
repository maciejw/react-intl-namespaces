import { IntlNamespaces } from './namespaces';
import { NamespaceResource, NamespaceResourceTree } from './types';

describe('IntlNamespaces', () => {
  describe('MessageConverter', () => {
    const tree: NamespaceResourceTree = {
      '1a': {
        '2a': {
          '3a': '3av',
          '3b': '3bv',
        },
        '2b': '2bv',
      },
      '1b': '1bv',
    };
    const flatObject: NamespaceResource = {
      ['1a.2a.3a']: '3av',
      ['1a.2a.3b']: '3bv',
      ['1a.2b']: '2bv',
      ['1b']: '1bv',
    };

    it('should flatten deep object', () => {
      const result = IntlNamespaces.MessageConverter.flattenTree(tree);
      expect(result).toEqual(flatObject);
    });
    it('should flatten empty object', () => {
      const result = IntlNamespaces.MessageConverter.flattenTree({});
      expect(result).toEqual({});
    });

    it('should flatten object', () => {
      const result = IntlNamespaces.MessageConverter.flattenTree({
        prefix: {
          res1: 'val2',
        },
        res1: 'val1',
      });
      expect(result).toEqual({ 'prefix.res1': 'val2', res1: 'val1' });
    });

    it('should build deep object', () => {
      const result = IntlNamespaces.MessageConverter.buildTree(flatObject);

      expect(result).toEqual(tree);
    });
    it('should build empty object', () => {
      const result = IntlNamespaces.MessageConverter.buildTree({});
      expect(result).toEqual({});
    });
  });

  describe('hasNamespace', () => {
    it('should find namespace pattern in string', () => {
      const result = IntlNamespaces.hasNamespace('test:test');
      expect(result).toBe(true);
    });
    it('should not find namespace pattern in string', () => {
      const result = IntlNamespaces.hasNamespace('test');
      expect(result).toBe(false);
    });
    it('should not find namespace pattern in empty string', () => {
      const result = IntlNamespaces.hasNamespace('');
      expect(result).toBe(false);
    });
  });
  describe('addNamespaceToMessages', () => {
    it('should add namespace prefix to object keys without namespace', () => {
      const result = IntlNamespaces.addNamespaceToResource(
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
      const result = IntlNamespaces.removeNamespaceFromResource(
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
    it('should get resource key with namespace id and params', () => {
      const result = IntlNamespaces.getResourceKey(
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
    it('should get message metadata from own namespace', () => {
      const result = IntlNamespaces.getMessageMetadata(
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
    it('should get message metadata from another namespace', () => {
      const result = IntlNamespaces.getMessageMetadata(
        {
          defaultMessage: 'message text',
          description: 'description text',
          id: 'another:message-id',
        },
        'ns',
      );
      expect(result).toEqual({
        defaultMessage: 'message text',
        description: 'description text',
        key: 'message-id',
        namespace: 'another',
      });
    });
  });

  describe('parseId', () => {
    it('should parse namespace prefix and key from id', () => {
      const result = IntlNamespaces.parseId('ns:message-id');
      expect(result).toEqual({
        key: 'message-id',
        namespace: 'ns',
      });
    });
  });
});
