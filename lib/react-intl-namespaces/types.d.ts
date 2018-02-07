/// <reference types="react" />
declare module "react-intl-namespaces/src/types" {
    /**
     * https://github.com/gcanti/typelevel-ts/blob/master/src/index.ts#L150
     */
    export type StringOmit<L1 extends string, L2 extends string> = ({
        [P in L1]: P;
    } & {
        [P in L2]: never;
    } & {
        [key: string]: never;
    })[L1];
    /**
     * https://github.com/gcanti/typelevel-ts/blob/master/src/index.ts#L169
     */
    export type ObjectOmit<O, K extends string> = Pick<O, StringOmit<keyof O, K>>;
    export interface MessageDescriptor<T extends string> extends ReactIntl.FormattedMessage.MessageDescriptor {
        id: T;
    }
    export type Messages<T extends string> = {
        [P in T]: MessageDescriptor<P>;
    };
    export type NamespaceResourceTreeNode = NamespaceResourceTree | string;
    export interface NamespaceResourceTree {
        [key: string]: NamespaceResourceTreeNode;
    }
    export interface MessageMetadata {
        defaultMessage?: string;
        description?: string;
        key: string;
        namespace: string;
    }
    export interface NamespaceResource {
        [key: string]: string;
    }
    export interface ResourceFromNamespace {
        namespace: string;
        resource: NamespaceResource;
    }
    export interface ResourceServer {
        getLanguages(): Promise<string[]>;
        getNamespace(ns: string): Promise<NamespaceResource>;
        addMissing(ns: string, missingResources: NamespaceResource): Promise<void>;
        updateModified(ns: string, modifiedResources: NamespaceResource, replace?: boolean): Promise<void>;
    }
    export type MessageMetadataToNamespaceResourceReducer = (acc: NamespaceResource, message: MessageMetadata) => NamespaceResource;
}
declare module "react-intl-namespaces/src/context" {
    import { ResourceFromNamespace } from "react-intl-namespaces/src/types";
    export namespace IntlBackendContext {
        type GetMessagesFromNamespace = (namespaceLoadedNotification: (resource: ResourceFromNamespace) => void, namespace: string, includeNamespace: string[]) => void;
        type AddMissingMessage = (message: MessageMetadata) => void;
        type GetIntlProps = () => ReactIntl.IntlProvider.Props;
        interface MessageMetadata {
            key: string;
            namespace: string;
            defaultMessage?: string;
            description?: string;
        }
        interface DevConfigProps {
            includeMetadata: boolean;
            showIds: boolean;
            loggingEnabled: boolean;
        }
        interface IntlBackend extends DevConfigProps {
            getMessagesFromNamespace: GetMessagesFromNamespace;
            getIntlProps: GetIntlProps;
            addMissingMessage: AddMissingMessage;
        }
        interface Context {
            intlBackend: IntlBackend;
        }
        function Define<P>(target: React.ComponentClass<P>): void;
        function Provide<P>(target: React.ComponentClass<P>): void;
    }
    export namespace IntlNamespaceContext {
        interface IntlNamespace extends IntlBackendContext.DevConfigProps {
            getNameOfCurrentNamespace(): string;
            missingMessage(message: ReactIntl.FormattedMessage.MessageDescriptor): void;
        }
        interface Context {
            intlNamespace: IntlNamespace;
        }
        const intlContextTypes: React.ValidationMap<Context>;
        function Define<P>(target: React.ComponentClass<P>): void;
        function Provide<P>(target: React.ComponentClass<P>): void;
    }
}
declare module "react-intl-namespaces/src/invariant/index" {
    const invariant: any;
    export { invariant };
}
declare module "react-intl-namespaces/src/namespaces" {
    import { IntlBackendContext } from "react-intl-namespaces/src/context";
    import { NamespaceResource, NamespaceResourceTree } from "react-intl-namespaces/src/types";
    export namespace InltNamespaces {
        namespace MessageConverter {
            function buildTree(resource: NamespaceResource): NamespaceResourceTree;
            function flattenTree(treeObject: NamespaceResourceTree): NamespaceResource;
        }
        function getResourceKey(messageDescriptor: ReactIntl.FormattedMessage.MessageDescriptor, namespace: string, params: string[]): string;
        function getMessageMetadata(messageDescriptor: ReactIntl.FormattedMessage.MessageDescriptor, namespace: string): IntlBackendContext.MessageMetadata;
        function removeNamespaceFromResource(messages: NamespaceResource, namespace: string): NamespaceResource;
        function removeNamespace(namespace: string, id: string): string;
        function hasNamespace(id: string): boolean;
        function parseId(id: string): {
            namespace: string;
            key: string;
        } | undefined;
        function addNamespaceToResource(resource: NamespaceResource, namespace: string): NamespaceResource;
    }
}
declare module "react-intl-namespaces/src/Components/FormattedMessage" {
    import * as ReactIntl from 'react-intl';
    import { IntlNamespaceContext } from "react-intl-namespaces/src/context";
    export class FormattedMessage extends ReactIntl.FormattedMessage {
        context: IntlNamespaceContext.Context;
        constructor(props: ReactIntl.FormattedMessage.Props, context: IntlNamespaceContext.Context);
        render(): {} | null | undefined;
    }
}
declare module "react-intl-namespaces/src/Components/IntlProvider" {
    import * as React from 'react';
    import * as ReactIntl from 'react-intl';
    import { IntlNamespaceContext } from "react-intl-namespaces/src/context";
    export class IntlProvider extends ReactIntl.IntlProvider {
        context: IntlNamespaceContext.Context;
        constructor(props: ReactIntl.IntlProvider.Props, context: {});
        getChildContext(): {
            intl: {
                formatDate(value: ReactIntl.DateSource, options?: ReactIntl.IntlComponent.DateTimeFormatProps | undefined): string;
                formatTime(value: ReactIntl.DateSource, options?: ReactIntl.IntlComponent.DateTimeFormatProps | undefined): string;
                formatRelative(value: ReactIntl.DateSource, options?: (ReactIntl.FormattedRelative.PropsBase & {
                    now?: any;
                }) | undefined): string;
                formatNumber(value: number, options?: ReactIntl.FormattedNumber.PropsBase | undefined): string;
                formatPlural(value: number, options?: ReactIntl.FormattedPlural.Base | undefined): "style" | "other" | "zero" | "one" | "two" | "few" | "many";
                formatHTMLMessage(messageDescriptor: ReactIntl.FormattedMessage.MessageDescriptor, values?: {
                    [key: string]: ReactIntl.MessageValue;
                } | undefined): string;
                locale: string;
                formats: any;
                messages: {
                    [id: string]: string;
                };
                defaultLocale: string;
                defaultFormats: any;
                now(): number;
                formatMessage: (messageDescriptor: ReactIntl.FormattedMessage.MessageDescriptor, values?: {
                    [key: string]: ReactIntl.MessageValue;
                } | undefined) => string;
            };
        };
        render(): React.ReactNode;
    }
}
declare module "react-intl-namespaces/src/Components/IntlBackendProvider" {
    import * as React from 'react';
    import { IntlBackendContext } from "react-intl-namespaces/src/context";
    import { ObjectOmit } from "react-intl-namespaces/src/types";
    export class IntlBackendProvider extends React.Component<IntlBackendProvider.Props> {
        constructor(props: IntlBackendProvider.Props, context: {});
        render(): React.ReactNode;
        getChildContext(): IntlBackendContext.Context;
    }
    export namespace IntlBackendProvider {
        type GetMessagesFromNamespaceFactory = (getIntlConfig: () => ReactIntl.IntlProvider.Props) => IntlBackendContext.GetMessagesFromNamespace;
        type AddMissingMessageFactoryFactory = (getIntlConfig: () => ReactIntl.IntlProvider.Props) => IntlBackendContext.AddMissingMessage;
        interface ResourceProvider {
            getMessagesFromNamespaceFactory: GetMessagesFromNamespaceFactory;
            addMissingMessageFactory: AddMissingMessageFactoryFactory;
        }
        interface Props extends ObjectOmit<ReactIntl.IntlProvider.Props, 'messages'>, Partial<IntlBackendContext.DevConfigProps>, Partial<ResourceProvider> {
        }
    }
}
declare module "react-intl-namespaces/src/Components/IntlNamespaceProvider" {
    import * as React from 'react';
    import { IntlBackendContext, IntlNamespaceContext } from "react-intl-namespaces/src/context";
    export class IntlNamespaceProvider extends React.Component<IntlNamespaceProvider.Props, IntlNamespaceProvider.State> {
        context: IntlBackendContext.Context;
        constructor(props: IntlNamespaceProvider.Props, context: IntlBackendContext.Context);
        componentWillMount(): void;
        getChildContext(): IntlNamespaceContext.Context;
        render(): JSX.Element;
        private namespaceLoadedNotification({namespace: messagesNamespace, resource: messages});
    }
    export namespace IntlNamespaceProvider {
        interface State {
            messages: {
                [key: string]: string;
            };
        }
        interface Props {
            namespace: string;
            includeNamespace?: string[];
        }
    }
}
declare module "react-intl-namespaces/src/defineMessages" {
    import { Messages } from "react-intl-namespaces/src/types";
    export function defineMessages<T extends string>(messages: Messages<T>): Messages<T>;
}
declare module "react-intl-namespaces/src/delay" {
    export interface Cancelable {
        cancel: () => void;
    }
    export class CancelablePromise<T> implements Promise<T>, Cancelable {
        cancel: () => void;
        [Symbol.toStringTag]: 'Promise';
        private promise;
        constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void, cancel: () => void);
        then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
        catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<T | TResult>;
    }
    export function delay(timeout?: number): Promise<void> & Cancelable;
}
declare module "react-intl-namespaces/src/resourceProvider" {
    import { MessageMetadata, MessageMetadataToNamespaceResourceReducer, NamespaceResource, ResourceFromNamespace, ResourceServer } from "react-intl-namespaces/src/types";
    export const reduceMessageMetadataToNamespaceResource: MessageMetadataToNamespaceResourceReducer;
    export function hasKeys(obj: {}): boolean;
    export function getMissingResources(originalResources: NamespaceResource, potentialyMissingResources: NamespaceResource): NamespaceResource;
    export function getModifiedResources(originalResources: NamespaceResource, potentialyModifiedResources: NamespaceResource): NamespaceResource;
    export class ResourceProvider {
        private scheduleDownloadDelay;
        private namespaces;
        private messages;
        private server;
        constructor(server: ResourceServer);
        requestNamespace(notification: (resourceFromNamespace: ResourceFromNamespace) => void, ...namespaces: string[]): void;
        requestMessage(message: MessageMetadata): void;
        private cancelDownload();
        private scheduleDownload();
        private download(namespaces);
        private checkForMissingOrModified(resourceFromNamespace);
        private scheduleUpdate(missingOrModifiedQueue);
    }
}
declare module "react-intl-namespaces/index" {
    export { FormattedMessage } from "react-intl-namespaces/src/Components/FormattedMessage";
    export { IntlProvider } from "react-intl-namespaces/src/Components/IntlProvider";
    export { IntlBackendProvider } from "react-intl-namespaces/src/Components/IntlBackendProvider";
    export { IntlNamespaceProvider } from "react-intl-namespaces/src/Components/IntlNamespaceProvider";
    export { InltNamespaces } from "react-intl-namespaces/src/namespaces";
    export { defineMessages } from "react-intl-namespaces/src/defineMessages";
    export { ResourceProvider } from "react-intl-namespaces/src/resourceProvider";
}
declare module "react-intl-namespaces/contracts" {
    export { MessageMetadata, NamespaceResource, ResourceServer } from "react-intl-namespaces/src/types";
}
