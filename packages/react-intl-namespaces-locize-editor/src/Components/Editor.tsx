import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { logger } from 'react-intl-namespaces';
import { DOMHelpers } from '../DOMHelpers';
import { EditorPanel } from './EditorPanel';
import { EditorWindow } from './EditorWindow';

import styles from './Editor.css';

export class Editor extends React.Component<
  Editor.RequiredProps & Partial<Editor.OptionalProps>
> {
  public render() {
    return <EditorComponent {...Editor.defaultProps} {...this.props} />;
  }
}
export class EditorComponent extends React.Component<
  Editor.RequiredProps & Editor.OptionalProps,
  Editor.State
> {
  private message: (ev: MessageEvent) => void;

  private keypress: (ev: KeyboardEvent) => void;

  private click: (e: MouseEvent) => void;

  // prettier-ignore
  private postMessage!: Promise<EditorWindow.PostMessage>;

  private editor: HTMLElement;

  constructor(props: Editor.RequiredProps & Editor.OptionalProps, context: {}) {
    super(props, context);
    this.state = {
      pinned: true,
      searchEnabled: true,
      showEditor: this.props.enabled,
      showIds: false,
    };

    this.click = (ev: MouseEvent) => {
      this.lookupInEditor(ev);
    };

    const { toggleKeyModifier, toggleKey } = this.props;

    this.keypress = (ev: KeyboardEvent) => {
      if (ev[toggleKeyModifier] && ev.key === toggleKey) {
        this.onToggleSearch();
      }
    };
    this.message = (ev: MessageEvent) => {
      if (ev.data[toggleKeyModifier] && ev.data.key === toggleKey) {
        this.onToggleSearch();
      }
    };
    this.setSearchDomState(this.state.searchEnabled);

    this.editor = DOMHelpers.Editor.createTargetElement(
      this.props.document,
      this.props.editorId,
    );

    props.document.body.addEventListener('click', this.click);
    props.document.addEventListener('keypress', this.keypress);
    props.window.addEventListener('message', this.message);
  }

  public componentWillUnmount() {
    this.props.document.body.removeChild(this.editor);
    this.props.document.body.removeEventListener('click', this.click);
    this.props.document.removeEventListener('keypress', this.keypress);
    this.props.window.removeEventListener('message', this.message);
  }

  public render() {
    const { searchEnabled, showIds } = this.state;
    return ReactDOM.createPortal(
      <div data-ignore-editor="true">
        <EditorPanel
          showIds={showIds}
          searchEnabled={searchEnabled}
          onRefresh={() => this.onRefresh()}
          onToggleSearch={() => this.onToggleSearch()}
          onShowIds={() => this.onShowIds()}
          language={this.props.language}
          onChangeLanguage={this.props.onChangeLanguage}
          languages={this.props.languages}
          pinned={this.state.pinned}
          onTogglePinned={() => this.onTogglePinned()}
        />
        <EditorWindow
          mode={this.props.mode}
          editorWidthInPixels={this.props.editorWidthInPixels}
          windowOpenTimeout={3000}
          window={window}
          url={this.props.url}
          pinned={this.state.pinned}
          onOpen={callback => this.open(callback)}
        />
      </div>,
      this.editor,
    );
  }
  private onTogglePinned() {
    const pinned = !this.state.pinned;
    this.setState({ pinned });
  }
  private setSearchDomState(searchEnabled: boolean) {
    DOMHelpers.Editor.toggleClass(
      this.props.document.body,
      searchEnabled,
      styles.searchEnabled,
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

  private async lookupInEditor(e: MouseEvent) {
    if (!this.state.searchEnabled) {
      return;
    }
    e.preventDefault();

    const resourceContainer = DOMHelpers.Editor.locateResourceContext(e.target);

    if (resourceContainer) {
      const { namespace, key, defaultMessage, description } = resourceContainer;
      const message = this.createMessage(
        namespace,
        key,
        defaultMessage,
        description,
      );
      const postMessage = await this.postMessage;

      postMessage(message, this.props.url);
    } else {
      logger.warn(
        `Missing key and namespace of resource, try search for a text or select ID mode`,
      );
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

  private onToggleSearch() {
    const searchEnabled = !this.state.searchEnabled;
    this.setState({ searchEnabled });

    this.setSearchDomState(searchEnabled);
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
    pinned: boolean;
  }
  export const defaultProps: Editor.OptionalProps = {
    document,
    editorId: 'locize-editor',
    editorWidthInPixels: 700,
    enabled: false,
    languages: [],
    mode: 'iframe',
    onChangeLanguage: language => void 0,
    onRefresh: () => void 0,
    onShowIds: show => void 0,
    toggleKey: 'Enter',
    toggleKeyModifier: 'ctrlKey',
    url: 'https://www.locize.io',
    version: 'latest',
    window,
  };

  export interface OptionalProps {
    window: Window;
    document: Document;
    editorId: string;
    editorWidthInPixels: number;
    enabled: boolean;
    toggleKey: string;
    toggleKeyModifier: 'ctrlKey' | 'altKey' | 'shiftKey';
    mode: 'window' | 'iframe';
    url: string;
    version: string;
    onShowIds: (show: boolean) => void;
    onChangeLanguage: (language: string) => void;
    languages: string[];
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
