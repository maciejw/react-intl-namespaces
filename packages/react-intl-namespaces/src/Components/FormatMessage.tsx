import * as React from 'react';
import * as ReactIntl from 'react-intl';
import { IntlNamespaceContext } from './context';
import { InltNamespaces } from './namespaces';

@IntlNamespaceContext.Provide
export class FormatMessage extends ReactIntl.FormattedMessage {
  public context: IntlNamespaceContext.Context;
  constructor(props: ReactIntl.FormattedMessage.Props, context: {}) {
    super(props, context);
  }
  public render() {
    const result = super.render();

    if (this.context.intlNamespace.includeMetadata) {
      const currentNamespace = this.context.intlNamespace.getNameCurrentNamespace();
      const metadata = InltNamespaces.getMessageMetadata(
        this.props,
        currentNamespace,
      );

      return React.createElement(
        'span',
        {
          'data-default-message': metadata.defaultMessage,
          'data-description': metadata.description,
          'data-key': metadata.key,
          'data-ns': metadata.namespace,
        },
        result,
      );
    } else {
      return result;
    }
  }
}
