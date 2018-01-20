import { IntlBackendContext, TranslatedMessages } from './context';

export namespace InltNamespaces {
  export function getResourceKey(
    messageDescriptor: ReactIntl.FormattedMessage.MessageDescriptor,
    namespace: string,
    params: string[],
  ) {
    const metadata = InltNamespaces.getMessageMetadata(
      messageDescriptor,
      namespace,
    );
    return `[${metadata.namespace}${namespaceSeparator}${
      metadata.key
    } (${params})]`;
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
    if (InltNamespaces.hasNamespace(id)) {
      const parsedId = InltNamespaces.parseId(id);
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

  export function removeNamespaceFromMessages(
    messages: TranslatedMessages,
    namespace: string,
  ) {
    const result: TranslatedMessages = {};

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
  export function addNamespaceToMessages(
    messages: TranslatedMessages,
    namespace: string,
  ) {
    const result: TranslatedMessages = {};
    for (const id in messages) {
      if (messages.hasOwnProperty(id)) {
        const element = messages[id];
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
