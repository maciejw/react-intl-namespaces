import * as React from 'react';
import { IntlBackendContext, IntlNamespaceContext } from '../context';
import { invariant } from '../invariant';
import { InltNamespaces } from '../namespaces';
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
    super(props, context);

    this.state = { messages: {} };
  }

  public componentWillMount() {
    const { namespace, includeNamespace = [] } = this.props;

    if (this.context.intlBackend === undefined) {
      invariant(
        false,
        'Missing intlBackend context. Use IntlNamespaceProvider inside IntlBackendProvider',
      );
    }
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
    } = this.context.intlBackend;

    return {
      intlNamespace: {
        includeMetadata,
        getNameOfCurrentNamespace() {
          return namespace;
        },
        missingMessage: messageDescriptor => {
          const missingMessage = InltNamespaces.getMessageMetadata(
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
    return (
      <IntlProvider {...props} messages={this.state.messages}>
        {this.props.children}
      </IntlProvider>
    );
  }

  private namespaceLoadedNotification({
    namespace: messagesNamespace,
    resource: messages,
  }: ResourceFromNamespace) {
    const { namespace, includeNamespace = [] } = this.props;
    if (messagesNamespace === namespace) {
      const newState = {
        messages: { ...this.state.messages, ...messages },
      };

      this.setState(newState);
    }
    if (includeNamespace.includes(messagesNamespace)) {
      messages = InltNamespaces.addNamespaceToResource(
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
  }
}
