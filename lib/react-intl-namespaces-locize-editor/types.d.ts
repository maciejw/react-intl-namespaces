/// <reference types="react" />
declare module "react-intl-namespaces-locize-editor/src/classnames/index" {
    import * as classNames from 'classnames-ts';
    const cn: classNames.ClassNamesFn;
    export { cn as classNames };
}
declare module "react-intl-namespaces-locize-editor/src/Components/EditorPanel" {
    import * as React from 'react';
    export class EditorPanel extends React.Component<EditorPanel.Props, EditorPanel.State> {
        constructor(props: EditorPanel.Props, state: EditorPanel.State);
        render(): JSX.Element;
    }
    export namespace EditorPanel {
        interface State {
            pinned: boolean;
        }
        interface Props {
            searchEnabled: boolean;
            showIds: boolean;
            onRefresh: () => void;
            onSearchEnabled: () => void;
            onShowIds: () => void;
            language: string;
            onChangeLanguage: (language: string) => void;
            getLanguages: () => string[];
        }
    }
}
declare module "react-intl-namespaces-locize-editor/src/Components/EditorWindow" {
    import * as React from 'react';
    export class EditorWindow extends React.Component<EditorWindow.Props> {
        render(): JSX.Element;
    }
    export namespace EditorWindow {
        interface Props {
            url: string;
            onOpen: (callback: Promise<PostMessage>) => void;
            editorWidthInPixels: number;
            windowOpenTimeout: number;
            mode: 'iframe' | 'window';
            window: Window;
        }
        type PostMessage = (message: any, targetOrigin: string, transfer?: any[]) => void;
    }
}
declare module "react-intl-namespaces-locize-editor/src/Components/Editor" {
    import * as React from 'react';
    export class Editor extends React.Component<Editor.RequiredProps & Partial<Editor.OptionalProps>> {
        render(): JSX.Element;
    }
    export namespace Editor {
        interface State {
            searchEnabled: boolean;
            showIds: boolean;
            showEditor: boolean;
        }
        const defaultProps: Editor.OptionalProps;
        interface OptionalProps {
            editorWidthInPixels: number;
            enabled: boolean;
            toggleKeyCode: number;
            toggleKeyModifier: 'ctrlKey' | 'altKey' | 'shiftKey';
            mode: 'window' | 'iframe';
            url: string;
            version: string;
            onShowIds: (show: boolean) => void;
            onChangeLanguage: (language: string) => void;
            getLanguages: () => string[];
            onRefresh: () => void;
        }
        interface RequiredProps {
            apiKey: string;
            projectId: string;
            referenceLanguage: string;
            language: string;
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
    }
}
declare module "react-intl-namespaces-locize-editor/index" {
    export { Editor } from "react-intl-namespaces-locize-editor/src/Components/Editor";
}
