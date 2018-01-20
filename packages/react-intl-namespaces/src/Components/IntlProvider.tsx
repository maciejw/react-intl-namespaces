import * as React from 'react';
import * as ReactIntl from 'react-intl';
import { IntlNamespaceContext, TranslatedMessages } from './context';
import { InltNamespaces } from './namespaces';

@IntlNamespaceContext.Provide
export class IntlProvider extends ReactIntl.IntlProvider {
  public context: IntlNamespaceContext.Context;
  constructor(props: ReactIntl.IntlProvider.Props, context: {}) {
    super(props, context);
  }
  public getChildContext() {
    const result = super.getChildContext();

    const { formatMessage: intlFormatMessage, ...rest } = result.intl;

    const formatMessage = (
      messageDescriptor: ReactIntl.FormattedMessage.MessageDescriptor,
      values?: { [key: string]: ReactIntl.MessageValue },
    ) => {
      const messages: TranslatedMessages = this.props.messages || {};
      const {
        getNameCurrentNamespace,
        missingMessage,
      } = this.context.intlNamespace;

      if (!messages.hasOwnProperty(messageDescriptor.id)) {
        missingMessage(messageDescriptor);
      }

      if (this.context.intlNamespace.showIds) {
        return InltNamespaces.getResourceKey(
          messageDescriptor,
          getNameCurrentNamespace(),
          Object.getOwnPropertyNames(values || {}),
        );
      } else {
        return intlFormatMessage(messageDescriptor, values);
      }
    };

    return {
      intl: {
        formatMessage,
        ...rest,
      },
    };
  }
  public render() {
    return super.render();
  }
}
