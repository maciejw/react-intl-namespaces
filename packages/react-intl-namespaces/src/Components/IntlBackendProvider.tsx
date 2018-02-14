import * as React from 'react';
import { IntlBackendContext } from '../context';
import { logger } from '../logger';
import { ObjectOmit } from '../types';

@IntlBackendContext.Define
export class IntlBackendProvider extends React.Component<
  IntlBackendProvider.Props
> {
  constructor(props: IntlBackendProvider.Props, context: {}) {
    super(props, context);
  }
  public render() {
    return this.props.children;
  }

  public getChildContext(): IntlBackendContext.Context {
    const defaultGetMessagesFromNamespaceFactory: IntlBackendProvider.GetMessagesFromNamespaceFactory = l => async (
      n,
      ins,
    ) => {
      logger.debug('[IntlBackendProvider]: getting messages for', n, ins);
      return {};
    };

    const defaultAddMissingMessageFactory: IntlBackendProvider.AddMissingMessageFactoryFactory = l => m => {
      logger.debug('[IntlBackendProvider]: missing message', m);
    };

    const defaultIncludeMetadata = false;
    const defaultShowIds = false;
    const defaultLoggingEnabled = false;
    const {
      getMessagesFromNamespaceFactory = defaultGetMessagesFromNamespaceFactory,
      addMissingMessageFactory = defaultAddMissingMessageFactory,
      defaultLocale,
      locale,
      loggingEnabled = defaultLoggingEnabled,
      includeMetadata = defaultIncludeMetadata,
      showIds = defaultShowIds,
    } = this.props;

    const getLocale: () => ReactIntl.IntlProvider.Props = () => ({
      defaultLocale,
      locale,
    });
    return {
      intlBackend: {
        addMissingMessage: addMissingMessageFactory(getLocale),
        getIntlProps: getLocale,
        getMessagesFromNamespace: getMessagesFromNamespaceFactory(getLocale),
        includeMetadata,
        loggingEnabled,
        showIds,
      },
    };
  }
}

export namespace IntlBackendProvider {
  export type GetMessagesFromNamespaceFactory = (
    getIntlConfig: () => ReactIntl.IntlProvider.Props,
  ) => IntlBackendContext.GetMessagesFromNamespace;

  export type AddMissingMessageFactoryFactory = (
    getIntlConfig: () => ReactIntl.IntlProvider.Props,
  ) => IntlBackendContext.AddMissingMessage;

  export interface ResourceProvider {
    getMessagesFromNamespaceFactory: GetMessagesFromNamespaceFactory;
    addMissingMessageFactory: AddMissingMessageFactoryFactory;
  }
  export interface Props
    extends ObjectOmit<ReactIntl.IntlProvider.Props, 'messages'>,
      Partial<IntlBackendContext.DevConfigProps>,
      Partial<ResourceProvider> {}
}
