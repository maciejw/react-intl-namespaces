import * as React from "react";
import { IntlBackendContext } from "./context";

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
      console.log("[IntlBackendProvider]: getting messages for", n, ins);
      return {};
    };

    const defaultAddMissingMessageFactory: IntlBackendProvider.AddMissingMessageFactoryFactory = l => m => {
      console.log("[IntlBackendProvider]: missing message", m);
    };
    const defaultIncludeMetadata = false;
    const defaultShowIds = false;
    const {
      getMessagesFromNamespaceFactory = defaultGetMessagesFromNamespaceFactory,
      addMissingMessageFactory = defaultAddMissingMessageFactory,
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

  export interface Props
    extends ReactIntl.IntlProvider.Props,
      Partial<IntlBackendContext.DevConfigProps> {
    getMessagesFromNamespaceFactory?: GetMessagesFromNamespaceFactory;
    addMissingMessageFactory?: AddMissingMessageFactoryFactory;
  }
}
