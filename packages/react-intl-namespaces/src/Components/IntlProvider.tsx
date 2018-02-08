import * as React from 'react';
import * as ReactIntl from 'react-intl';
import { IntlNamespaceContext } from '../context';
import { invariant } from '../invariant';
import { IntlNamespaces } from '../namespaces';
import { NamespaceResource } from '../types';

@IntlNamespaceContext.Provide
export class IntlProvider extends ReactIntl.IntlProvider {
  // prettier-ignore
  public context!: IntlNamespaceContext.Context;
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
      const resource: NamespaceResource = this.props.messages || {};
      if (this.context.intlNamespace === undefined) {
        invariant(
          false,
          'Missing intlNamespace context. Use IntlNamespaceProvider inside IntlBackendProvider',
        );
      }

      const {
        getNameOfCurrentNamespace,
        missingMessage,
      } = this.context.intlNamespace;

      if (!resource.hasOwnProperty(messageDescriptor.id)) {
        missingMessage(messageDescriptor);
      }

      if (this.context.intlNamespace.showIds) {
        return IntlNamespaces.getResourceKey(
          messageDescriptor,
          getNameOfCurrentNamespace(),
          Object.getOwnPropertyNames(values),
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
