import * as React from 'react';
import {
  IntlBackendContext,
  IntlNamespaceContext,
  TranslatedMessages,
} from './context';
import { IntlProvider } from './IntlProvider';
import { InltNamespaces } from './namespaces';

@IntlNamespaceContext.Define
@IntlBackendContext.Provide
export class IntlNamespaceProvider extends React.Component<
  IntlNamespaceProvider.Props,
  IntlNamespaceProvider.State
> {
  public context: IntlBackendContext.Context;
  constructor(
    props: IntlNamespaceProvider.Props,
    context: IntlBackendContext.Context,
  ) {
    super(props, context);

    this.state = { messages: {} };
  }

  public componentWillMount() {
    const { namespace, includeNamespace = [] } = this.props;
    const {
      getMessagesFromNamespace,
      registerNamespaceDownloadNotification,
    } = this.context.intlBackend;
    getMessagesFromNamespace(namespace, includeNamespace);
    registerNamespaceDownloadNotification(resource =>
      this.namespaceDownloadNotification(resource),
    );
  }

  public getChildContext(): IntlNamespaceContext.Context {
    const { namespace } = this.props;
    const {
      getMessagesFromNamespace,
      addMissingMessage,
      includeMetadata,
      showIds,
    } = this.context.intlBackend;

    const messageKeys = Object.getOwnPropertyNames(this.state.messages);

    return {
      intlNamespace: {
        includeMetadata,
        showIds,
        getNameCurrentNamespace() {
          return namespace;
        },
        missingMessage(
          messageDescriptor: ReactIntl.FormattedMessage.MessageDescriptor,
        ) {
          if (messageKeys.includes(messageDescriptor.id)) {
            return;
          }
          const missingMessage = InltNamespaces.getMessageMetadata(
            messageDescriptor,
            namespace,
          );
          addMissingMessage(missingMessage);
        },
      },
    };
  }

  public render() {
    const { getIntlProps } = this.context.intlBackend;
    const props = getIntlProps();
    return (
      <IntlProvider {...props} messages={this.state.messages}>
        {this.props.children}
      </IntlProvider>
    );
  }

  private namespaceDownloadNotification({
    namespace: messagesNamespace,
    messages,
  }: {
    namespace: string;
    messages: TranslatedMessages;
  }) {
    const { namespace, includeNamespace = [] } = this.props;
    if (messagesNamespace === namespace) {
      this.setState({
        messages: { ...this.state.messages, ...messages },
      });
    }
    if (includeNamespace.includes(messagesNamespace)) {
      messages = InltNamespaces.addNamespaceToMessages(
        messages,
        messagesNamespace,
      );

      this.setState({
        messages: { ...this.state.messages, ...messages },
      });
    }
  }
}

export namespace IntlNamespaceProvider {
  export interface State {
    messages: TranslatedMessages;
  }
  export interface Props {
    namespace: string;
    includeNamespace?: string[];
  }
}
