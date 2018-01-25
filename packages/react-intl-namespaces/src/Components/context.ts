import * as PropTypes from 'prop-types';
import { IntlBackendProvider } from './IntlBackendProvider';

export interface TranslatedMessages {
  [key: string]: string;
}

export namespace IntlBackendContext {
  export type GetMessagesFromNamespace = (
    namespace: string,
    includeNamespace: string[],
  ) => void;

  export type AddMissingMessage = (message: MessageMetadata) => void;

  export type RegisterNamespaceDownloadNotification = (
    callback: (
      resource: { namespace: string; messages: TranslatedMessages },
    ) => void,
  ) => void;

  export type GetIntlProps = () => ReactIntl.IntlProvider.Props;
  export interface MessageMetadata {
    key: string;
    namespace: string;
    defaultMessage?: string;
    description?: string;
  }

  export interface DevConfigProps {
    includeMetadata: boolean;
    showIds: boolean;
  }
  interface IntlBackend extends DevConfigProps {
    getMessagesFromNamespace: GetMessagesFromNamespace;
    getIntlProps: GetIntlProps;
    addMissingMessage: AddMissingMessage;
    registerNamespaceDownloadNotification: RegisterNamespaceDownloadNotification;
  }
  export interface Context {
    intlBackend: IntlBackend;
  }

  const intlBackendShape: PropTypes.ValidationMap<IntlBackend> = {
    getMessagesFromNamespace: PropTypes.func.isRequired,
  };

  const intlContextTypes: React.ValidationMap<Context> = {
    intlBackend: PropTypes.shape(intlBackendShape),
  };

  export function Define<P>(target: React.ComponentClass<P>) {
    target.childContextTypes = intlContextTypes;
  }
  export function Provide<P>(target: React.ComponentClass<P>) {
    target.contextTypes = { ...target.contextTypes, ...intlContextTypes };
  }
}

export namespace IntlNamespaceContext {
  interface IntlNamespace extends IntlBackendContext.DevConfigProps {
    getNameCurrentNamespace(): string;
    missingMessage(message: ReactIntl.FormattedMessage.MessageDescriptor): void;
  }
  export interface Context {
    intlNamespace: IntlNamespace;
  }
  const intlNamespaceShape: PropTypes.ValidationMap<IntlNamespace> = {
    missingMessage: PropTypes.func.isRequired,
  };
  const intlContextTypes: React.ValidationMap<Context> = {
    intlNamespace: PropTypes.shape(intlNamespaceShape),
  };

  export function Define<P>(target: React.ComponentClass<P>) {
    target.childContextTypes = intlContextTypes;
  }
  export function Provide<P>(target: React.ComponentClass<P>) {
    target.contextTypes = { ...target.contextTypes, ...intlContextTypes };
  }
}
