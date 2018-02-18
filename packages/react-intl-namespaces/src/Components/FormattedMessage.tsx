import invariant from 'invariant';
import * as React from 'react';
import * as ReactIntl from 'react-intl';
import { IntlNamespaceContext } from '../context';
import { IntlNamespaces } from '../namespaces';

/** */
@IntlNamespaceContext.Provide
export class FormattedMessage extends ReactIntl.FormattedMessage {
  // prettier-ignore
  public context!: IntlNamespaceContext.Context;
  constructor(
    props: ReactIntl.FormattedMessage.Props,
    context: IntlNamespaceContext.Context,
  ) {
    invariant(
      context.intlNamespace !== undefined,
      'Missing intlNamespace context. Use IntlNamespaceProvider inside IntlBackendProvider',
    );
    super(props, context);
  }

  public render() {
    const result = super.render();

    if (this.context.intlNamespace.includeMetadata) {
      const currentNamespace = this.context.intlNamespace.getNameOfCurrentNamespace();
      const metadata = IntlNamespaces.getMessageMetadata(
        this.props,
        currentNamespace,
      );

      return React.createElement(
        'span',
        {
          'data-default-message': metadata.defaultMessage,
          'data-description': metadata.description,
          'data-key': metadata.key,
          'data-namespace': metadata.namespace,
        },
        result,
      );
    } else {
      return result;
    }
  }
}
