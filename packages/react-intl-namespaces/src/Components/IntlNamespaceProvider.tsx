import invariant from 'invariant';
import * as React from 'react';
import { IntlBackendContext, IntlNamespaceContext } from '../context';
import { IntlNamespaces } from '../namespaces';
import { ResourceFromNamespace } from '../types';
import { IntlProvider } from './IntlProvider';

@IntlNamespaceContext.Define
@IntlBackendContext.Provide
export class IntlNamespaceProvider extends React.Component<
  IntlNamespaceProvider.Props,
  IntlNamespaceProvider.State
> {
  // prettier-ignore
  public context!: IntlBackendContext.Context;
  constructor(
    props: IntlNamespaceProvider.Props,
    context: IntlBackendContext.Context,
  ) {
    this.state = { messages: {} };
  }

  public componentDidMount() {
    this._isMounted = true;
  }

  public componentWillUnmount() {
    this._isMounted = false;
  }

  public componentWillMount() {
    const { namespace, includeNamespace = [] } = this.props;

    invariant(
      this.context.intlBackend !== undefined,
      'Missing intlBackend context. Use IntlNamespaceProvider inside IntlBackendProvider',
    );
    const { getMessagesFromNamespace } = this.context.intlBackend;

    const namespaceLoadedNotification = (resource: ResourceFromNamespace) => {
      this.namespaceLoadedNotification(resource);
    };

    getMessagesFromNamespace(
      namespaceLoadedNotification,
      namespace,
      includeNamespace,
    );
  }

  public getChildContext(): IntlNamespaceContext.Context {
    const { namespace } = this.props;
    const {
      getMessagesFromNamespace,
      addMissingMessage,
      includeMetadata,
      showIds,
      loggingEnabled,
    } = this.context.intlBackend;

    return {
      intlNamespace: {
        includeMetadata,
        getNameOfCurrentNamespace() {
          return namespace;
        },
        loggingEnabled,
        missingMessage: messageDescriptor => {
          const missingMessage = IntlNamespaces.getMessageMetadata(
            messageDescriptor,
            namespace,
          );

          addMissingMessage(missingMessage);
        },
        showIds,
      },
    };
  }

  public render() {
    const { getIntlProps } = this.context.intlBackend;
    const props = getIntlProps();
    const messages =
      (Object.keys(this.state.messages).length > 0 && this.state.messages) ||
      this.props.messages;
    return (
      <IntlProvider {...props} messages={messages}>
        {this.props.children}
      </IntlProvider>
    );
  }

  private namespaceLoadedNotification({
    namespace: messagesNamespace,
    resource: messages,
  }: ResourceFromNamespace) {
    const { namespace, includeNamespace = [] } = this.props;
    if (messagesNamespace === namespace && this._isMounted) {
      const newState = {
        messages: { ...this.state.messages, ...messages },
      };
      this.setState(newState);
    }
    if (includeNamespace.includes(messagesNamespace) && this._isMounted) {
      messages = IntlNamespaces.addNamespaceToResource(
        messages,
        messagesNamespace,
      );
      const newState = {
        messages: { ...this.state.messages, ...messages },
      };

      this.setState(newState);
    }
  }
}

export namespace IntlNamespaceProvider {
  export interface State {
    messages: { [key: string]: string };
  }
  export interface Props {
    namespace: string;
    includeNamespace?: string[];
    messages?: object;
  }
}
