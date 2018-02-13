import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { invariant } from '../invariant';
import { EditorPanel } from './EditorPanel';
import { EditorWindow } from './EditorWindow';

export class Editor extends React.Component<
  Editor.RequiredProps & Partial<Editor.OptionalProps>
> {
  public render() {
    return <EditorComponent {...Editor.defaultProps} {...this.props} />;
  }
}
class EditorComponent extends React.Component<
  Editor.RequiredProps & Editor.OptionalProps,
  Editor.State
> {
  private message: (ev: MessageEvent) => void;
  // prettier-ignore
  private keypress: (ev: KeyboardEvent) => void;
  // prettier-ignore
  private click: (e: MouseEvent) => void;
  // prettier-ignore
  private postMessage!: Promise<EditorWindow.PostMessage>;
  // prettier-ignore

  private editor: HTMLElement;

  constructor(props: Editor.RequiredProps & Editor.OptionalProps, context: {}) {
    super(props, context);
    this.state = {
      searchEnabled: true,
      showEditor: this.props.enabled,
      showIds: false,
    };

    let editor = document.getElementById('locize-editor');
    // invariant(editor === null, 'You should use only one Editor');

    editor = document.createElement('div');
    editor.id = 'locize-editor';
    document.body.appendChild(editor);
    this.editor = editor;

    this.click = (ev: MouseEvent) => this.lookupInEditor(ev);

    const { toggleKeyModifier, toggleKeyCode } = this.props;

    this.keypress = (ev: KeyboardEvent) => {
      if (ev[toggleKeyModifier] && ev.which === toggleKeyCode) {
        this.onSearchEnabled();
      }
    };
    this.message = (ev: MessageEvent) => {
      if (ev.data[toggleKeyModifier] && ev.data.which === toggleKeyCode) {
        this.onSearchEnabled();
      }
    };

    document.body.addEventListener('click', this.click);
    document.addEventListener('keypress', this.keypress);
    window.addEventListener('message', this.message);
  }

  public componentWillUnmount() {
    document.body.removeChild(this.editor);
    document.removeEventListener('keypress', this.keypress);
    window.removeEventListener('message', this.message);
  }

  public render() {
    const { searchEnabled, showIds } = this.state;
    return ReactDOM.createPortal(
      <div data-ignore-locize-editor="true">
        <EditorPanel
          showIds={showIds}
          searchEnabled={searchEnabled}
          onRefresh={() => this.onRefresh()}
          onSearchEnabled={() => this.onSearchEnabled()}
          onShowIds={() => this.onShowIds()}
          language={this.props.language}
          onChangeLanguage={this.props.onChangeLanguage}
          getLanguages={this.props.getLanguages}
        />
        <EditorWindow
          mode={this.props.mode}
          editorWidthInPixels={this.props.editorWidthInPixels}
          url={this.props.url}
          onOpen={i => this.open(i)}
        />
      </div>,
      this.editor,
    );
  }
  private onShowIds() {
    const { showIds: oldShowIds, ...rest } = this.state;
    const showIds = !oldShowIds;
    this.setState({ showIds, ...rest });
    this.props.onShowIds(showIds);
  }
  private open(callback: Promise<EditorWindow.PostMessage>) {
    this.postMessage = callback;
  }

  private isTranslatedOrIgnored(element: Element) {
    if (this.isHtmlElement(element)) {
      let e = element;
      while (e.tagName.toLowerCase() !== 'body') {
        if (
          e.dataset.ignoreLocizeEditor === 'true' ||
          e.dataset.translated === 'true'
        ) {
          return true;
        }
        if (e.parentElement === null) {
          return false;
        }
        e = e.parentElement;
      }
    }
    return false;
  }
  private isHtmlElement(element: Element): element is HTMLElement {
    return element instanceof HTMLElement;
  }

  private async lookupInEditor(e: MouseEvent) {
    if (!this.state.searchEnabled) {
      return;
    }
    e.preventDefault();

    if (e.srcElement) {
      const resourceContainer: HTMLElement | null = e.srcElement.parentElement;

      if (!resourceContainer || this.isTranslatedOrIgnored(resourceContainer)) {
        return;
      }

      const {
        ns,
        key,
        defaultMessage,
        description,
      } = resourceContainer.dataset;

      let message: Editor.SearchMessage;

      if (ns && key) {
        message = this.createMessage(ns, key, defaultMessage, description);

        const postMessage = await this.postMessage;

        if (this.props.mode === 'window') {
          if (!window.closed) {
            postMessage(message, this.props.url);
          }
        }
        if (this.props.mode === 'iframe') {
          postMessage(message, this.props.url);
        }
      } else {
        alert(
          `Missing key and namespace of resource, try search for a text or select ID mode`,
        );
      }
    }
  }
  private createMessage(
    ns: string,
    key: string,
    defaultMessage?: string,
    description?: string,
  ): Editor.SearchMessage {
    const { language: lng, projectId, version } = this.props;
    return {
      lng,
      message: 'searchForKey',
      ns,
      projectId,
      token: key,
      version,
    };
  }

  private onSearchEnabled() {
    const { searchEnabled } = this.state;
    this.setState({ searchEnabled: !searchEnabled });
  }
  private onRefresh() {
    this.props.onRefresh();
  }
}

export namespace Editor {
  export interface State {
    searchEnabled: boolean;
    showIds: boolean;
    showEditor: boolean;
  }
  export const defaultProps: Editor.OptionalProps = {
    editorWidthInPixels: 700,
    enabled: false,
    getLanguages: () => [],
    mode: 'iframe',
    onChangeLanguage: language => void 0,
    onRefresh: () => void 0,
    onShowIds: show => void 0,
    toggleKeyCode: 24,
    toggleKeyModifier: 'ctrlKey',
    url: 'https://www.locize.io',
    version: 'latest',
  };

  export interface OptionalProps {
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

  export interface RequiredProps {
    apiKey: string;
    projectId: string;
    referenceLanguage: string;
    language: string;
  }
  export interface SearchMessage {
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
