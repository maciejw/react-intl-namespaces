/// <reference types="react" />
declare module "react-intl-namespaces-locize-editor/src/invariant/index" {
    import * as invariantNamespace from 'invariant';
    const invariant: invariantNamespace.InvariantStatic;
    export { invariant };
}
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
        private window;
        constructor(props: EditorWindow.Props, state: {});
        componentDidMount(): void;
        render(): JSX.Element | null;
    }
    export namespace EditorWindow {
        interface Props {
            url: string;
            onOpen: (window: Promise<Window>) => void;
            editorWidthInPixels: number;
            mode: 'iframe' | 'window';
        }
        const inlineStyles: (editorWidthInPixels: number) => Record<'container' | 'iframe', React.CSSProperties>;
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
