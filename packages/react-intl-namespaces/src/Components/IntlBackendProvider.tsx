import * as React from 'react';
import { IntlBackendContext } from './context';

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
      console.log('[IntlBackendProvider]: getting messages for', n, ins);
      return {};
    };

    const defaultAddMissingMessageFactory: IntlBackendProvider.AddMissingMessageFactoryFactory = l => m => {
      console.log('[IntlBackendProvider]: missing message', m);
    };

    const defaultRegisterNamespaceDownloadNotification: IntlBackendContext.RegisterNamespaceDownloadNotification = resource => {
      console.log('[IntlBackendProvider]: namespace downloaded', resource);
    };
    const defaultIncludeMetadata = false;
    const defaultShowIds = false;
    const {
      getMessagesFromNamespaceFactory = defaultGetMessagesFromNamespaceFactory,
      addMissingMessageFactory = defaultAddMissingMessageFactory,
      registerNamespaceDownloadNotification = defaultRegisterNamespaceDownloadNotification,
      defaultLocale,
      locale,
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
        registerNamespaceDownloadNotification,
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

  export type RegisterNamespaceDownloadNotification = IntlBackendContext.RegisterNamespaceDownloadNotification;

  export interface ResourceProvider {
    getMessagesFromNamespaceFactory: GetMessagesFromNamespaceFactory;
    addMissingMessageFactory: AddMissingMessageFactoryFactory;
    registerNamespaceDownloadNotification: IntlBackendContext.RegisterNamespaceDownloadNotification;
  }
  export interface Props
    extends ReactIntl.IntlProvider.Props,
      Partial<IntlBackendContext.DevConfigProps>,
      Partial<ResourceProvider> {}
}
