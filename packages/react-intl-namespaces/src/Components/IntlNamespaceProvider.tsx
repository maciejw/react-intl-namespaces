import * as React from "react";
import {
  IntlBackendContext,
  IntlNamespaceContext,
  TranslatedMessages,
} from "./context";
import { IntlProvider } from "./IntlProvider";
import { InltNamespaces } from "./namespaces";

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

  public async componentDidMount() {
    const { namespace, includeNamespace = [] } = this.props;
    const { getMessagesFromNamespace } = this.context.intlBackend;
    const messages = await getMessagesFromNamespace(
      namespace,
      includeNamespace,
    );
    this.setState({ messages: { ...this.state.messages, ...messages } });
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
        showIds,
        getNameCurrentNamespace() {
          return namespace;
        },
        missingMessage(
          messageDescriptor: ReactIntl.FormattedMessage.MessageDescriptor,
        ) {
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
