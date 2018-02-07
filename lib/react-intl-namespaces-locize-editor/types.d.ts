/// <reference types="react" />
declare module "react-intl-namespaces-locize-editor/src/ui" {
    export function initUI(on: () => void, off: () => void): (on: boolean) => void;
    export function appendIframe(url: string, options: {
        bodyStyle: string;
        iframeContainerStyle: string;
        iframeStyle: string;
    }): Window;
}
declare module "react-intl-namespaces-locize-editor/src/utils" {
    export function isWindow(obj: any): boolean;
    export function getWindow(elem: Document): false | Window | Document;
    export function offset(elem: Element): {
        bottom: number;
        left: number;
        right: number;
        top: number;
    };
    export function getDomPath(e: Element | null): string;
    export function getClickedElement(e: MouseEvent): HTMLElement | undefined;
    export function removeNamespace(str: string): string;
    export function getElementNamespace(str: string, el: Element): string;
    export function getQueryVariable(variable: string): string | false;
}
declare module "react-intl-namespaces-locize-editor/src/locizeEditorBinding" {
    export class LocizeEditorBinding {
        enabled: boolean;
        options: LocizeEditorBinding.EditorOptions & LocizeEditorBinding.BackendOptions;
        toggleUI?: (on: boolean) => void;
        locizeInstance: Window | null;
        constructor({url, enabled, enableByQS, toggleKeyCode, toggleKeyModifier, lngOverrideQS, autoOpen, mode, iframeContainerStyle, iframeStyle, bodyStyle, backend}?: Partial<LocizeEditorBinding.EditorOptions & LocizeEditorBinding.BackendOptions>);
        handler(e: MouseEvent): void;
        open(): void;
        on(): void;
        off(): void;
    }
    export namespace LocizeEditorBinding {
        type LocizeMode = 'window' | 'iframe';
        interface SearchMessage {
            message: 'searchForKey';
            projectId: string;
            version: string;
            lng: string;
            ns: string;
            token: string;
            defaultMessage?: string;
            description?: string;
        }
        interface BackendOptions {
            backend: {
                projectId: string;
                apiKey: string;
                version?: string;
                referenceLng: string;
            };
        }
        interface ApplicationOptions {
            language: string;
        }
        interface EditorOptions {
            url: string;
            enabled: boolean;
            enableByQS: string;
            toggleKeyCode: number;
            toggleKeyModifier: 'ctrlKey' | 'altKey' | 'shiftKey';
            lngOverrideQS: string;
            autoOpen: boolean;
            mode: 'window' | 'iframe';
            iframeContainerStyle: string;
            iframeStyle: string;
            bodyStyle: string;
            handler?: (m: SearchMessage) => void;
        }
        function getMode(): LocizeMode | false;
    }
}
declare module "react-intl-namespaces-locize-editor/src/Components/Editor" {
    import * as React from 'react';
    export class Editor extends React.Component<Editor.Required & Partial<Editor.Optional>, Editor.State> {
        private openedWindow;
        private editor;
        constructor(props: Editor.Required & Editor.Optional, context: {});
        componentWillMount(): void;
        componentWillUnmount(): void;
        render(): React.ReactPortal;
        private readonly safeProps;
        private open(window);
        private lookupInEditor(e);
        private createMessage(ns, key, defaultMessage?, description?);
        private toggle();
        private on();
        private off();
    }
    export namespace Editor {
        interface State {
            enabled: boolean;
        }
        interface SearchMessage {
            message: 'searchForKey';
            projectId: string;
            version: string;
            lng: string;
            ns: string;
            token: string;
            defaultMessage?: string;
            description?: string;
        }
        const defaultProps: Editor.Optional;
        interface Optional {
            enabled: boolean;
            toggleKeyCode: number;
            toggleKeyModifier: 'ctrlKey' | 'altKey' | 'shiftKey';
            mode: 'window' | 'iframe';
            url: string;
            version: string;
        }
        interface Required {
            apiKey: string;
            projectId: string;
            referenceLanguage: string;
            language: string;
        }
    }
}
declare module "react-intl-namespaces-locize-editor/index" {
    export { Editor } from "react-intl-namespaces-locize-editor/src/Components/Editor";
}
