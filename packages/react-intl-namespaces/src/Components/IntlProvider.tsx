import invariant from 'invariant';
import * as React from 'react';
import * as ReactIntl from 'react-intl';
import { IntlNamespaceContext } from '../context';
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

    invariant(
      this.context.intlNamespace !== undefined,
      'Missing intlNamespace context. Use IntlNamespaceProvider inside IntlBackendProvider',
    );

    const {
      getNameOfCurrentNamespace,
      missingMessage,
      showIds,
    } = this.context.intlNamespace;

    const formatMessage = (
      messageDescriptor: ReactIntl.FormattedMessage.MessageDescriptor,
      values: { [key: string]: ReactIntl.MessageValue } = {},
    ) => {
      if (!this.hasResource(messageDescriptor.id)) {
        missingMessage(messageDescriptor);
      }

      if (showIds) {
        return IntlNamespaces.formatResourceId(
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
  private hasResource(id: string) {
    const resource: NamespaceResource = this.props.messages || {};
    return resource.hasOwnProperty(id);
  }
}
