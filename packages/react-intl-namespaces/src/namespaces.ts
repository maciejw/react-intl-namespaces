import { IntlBackendContext } from './context';
import {
  NamespaceResource,
  NamespaceResourceTree,
  NamespaceResourceTreeNode,
} from './types';

/** functions responsible to deal with namespace related things */
export namespace IntlNamespaces {
  /** resource message converter */
  export namespace MessageConverter {
    function pathReducerFactory(finalValue: string, finalDepth: number) {
      return function pathReducer(
        acc: NamespaceResourceTreeNode | undefined,
        p: string,
        index: number,
      ) {
        if (acc !== undefined && typeof acc !== 'string') {
          if (p in acc) {
            return acc[p];
          } else {
            const currentDepth = index + 1;
            if (currentDepth === finalDepth) {
              acc[p] = finalValue;
            } else {
              return (acc[p] = {});
            }
          }
        }
      };
    }

    function joinMessagesReducer(acc: NamespaceResource, p: NamespaceResource) {
      return { ...acc, ...p };
    }

    function flattenTreeRec(
      value: NamespaceResourceTree | string,
      path: string[],
    ): NamespaceResource {
      if (typeof value === 'string') {
        return { [path.join('.')]: value };
      } else {
        return Object.getOwnPropertyNames(value)
          .map(p => flattenTreeRec(value[p], [...path, p]))
          .reduce(joinMessagesReducer, {});
      }
    }
    /**
     * converts resource in dot format { 'some.nested.resource':string } to nested object tree { some: { nested: {resource: string } }
     * @param resource flat resource in dot format
     * @returns nested resource object tree
     */
    export function buildTree(
      resource: NamespaceResource,
    ): NamespaceResourceTree {
      const result = {};
      Object.getOwnPropertyNames(resource)
        .map(p => ({
          path: p.split('.'),
          value: resource[p],
        }))
        .forEach(p => {
          p.path.reduce(pathReducerFactory(p.value, p.path.length), result);
        });

      return result;
    }
    /**
     * converts nested object tree { some: { nested: {resource: string } } to resource in dot format { 'some.nested.resource':string }
     * @param treeObject nested object tree
     * @returns flat resource in dot format
     */
    export function flattenTree(treeObject: NamespaceResourceTree) {
      return flattenTreeRec(treeObject, []);
    }
  }
  /**
   * formats resource id in format [namespace:some.resource(someParam1, someParam2)]
   * @param messageDescriptor
   * @param namespace
   * @param params
   */
  export function formatResourceId(
    messageDescriptor: ReactIntl.FormattedMessage.MessageDescriptor,
    namespace: string,
    params: string[],
  ) {
    const metadata = IntlNamespaces.getMessageMetadata(
      messageDescriptor,
      namespace,
    );

    return `[${metadata.namespace}${namespaceSeparator}${
      metadata.key
    } (${params.join(', ')})]`;
  }
  export function getMessageMetadata(
    messageDescriptor: ReactIntl.FormattedMessage.MessageDescriptor,
    namespace: string,
  ) {
    const { defaultMessage, description, id } = messageDescriptor;
    let missingMessage: IntlBackendContext.MessageMetadata = {
      defaultMessage,
      description,
      key: id,
      namespace,
    };
    if (IntlNamespaces.hasNamespace(id)) {
      const parsedId = IntlNamespaces.parseId(id);
      if (parsedId) {
        const { key: parsedKey, namespace: parsedNamespace } = parsedId;
        missingMessage = {
          defaultMessage,
          description,
          key: parsedKey,
          namespace: parsedNamespace,
        };
      }
    }
    return missingMessage;
  }

  export function removeNamespaceFromResource(
    messages: NamespaceResource,
    namespace: string,
  ) {
    const result: NamespaceResource = {};

    for (const key in messages) {
      if (messages.hasOwnProperty(key)) {
        const element = messages[key];
        const keyWithoutNamespace = removeNamespace(namespace, key);
        result[keyWithoutNamespace] = element;
      }
    }
    return result;
  }
  const namespaceSeparator = ':';

  export function removeNamespace(namespace: string, id: string) {
    const namespaceRegex = new RegExp(
      `^${namespace}${namespaceSeparator}`,
      'i',
    );
    return id.replace(namespaceRegex, '');
  }

  export function hasNamespace(id: string) {
    const namespaceRegex = new RegExp(`.+${namespaceSeparator}.+`, 'i');
    return namespaceRegex.test(id);
  }

  export function parseId(id: string) {
    const namespaceRegex = new RegExp(`(.+)${namespaceSeparator}(.+)`, 'i');

    const result = namespaceRegex.exec(id);

    if (result) {
      const [_, namespace, key] = result;
      return { namespace, key };
    }
  }
  export function addNamespaceToResource(
    resource: NamespaceResource,
    namespace: string,
  ) {
    const result: NamespaceResource = {};
    for (const id in resource) {
      if (resource.hasOwnProperty(id)) {
        const element = resource[id];
        if (hasNamespace(id)) {
          result[id] = element;
        } else {
          result[`${namespace}:${id}`] = element;
        }
      }
    }
    return result;
  }
}
