import * as React from 'react';
import * as ReactIntl from 'react-intl';
import { IntlNamespaceContext } from '../context';
import { invariant } from '../invariant';
import { InltNamespaces } from '../namespaces';

@IntlNamespaceContext.Provide
export class FormattedMessage extends ReactIntl.FormattedMessage {
  // prettier-ignore
  public context!: IntlNamespaceContext.Context;
  constructor(
    props: ReactIntl.FormattedMessage.Props,
    context: IntlNamespaceContext.Context,
  ) {
    if (context.intlNamespace === undefined) {
      invariant(
        false,
        'Missing intlNamespace context. Use IntlNamespaceProvider inside IntlBackendProvider',
      );
    }
    super(props, context);
  }

  public render() {
    const result = super.render();

    if (this.context.intlNamespace.includeMetadata) {
      const currentNamespace = this.context.intlNamespace.getNameOfCurrentNamespace();
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
