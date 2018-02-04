import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LocizeEditorBinding } from '../locizeEditorBinding';

class EditorWindow extends React.Component<EditorWindow.Props> {
  constructor(props: EditorWindow.Props, state: {}) {
    super(props, state);
  }
  public render() {
    return (
      <div
        style={EditorWindow.styles.container}
        data-ignorelocizeeditor=""
        data-translated=""
      >
        <iframe
          ref={e => this.props.onOpen(e)}
          style={EditorWindow.styles.iframe}
          data-ignorelocizeeditor=""
          data-translated=""
          src={this.props.url}
        />
      </div>
    );
  }
}
namespace EditorWindow {
  export interface Props {
    url?: string;
    onOpen: (iframe: HTMLIFrameElement | null) => void;
  }
  export const styles: Record<'container' | 'iframe', React.CSSProperties> = {
    container: {
      bottom: 0,
      boxShadow: '-3px 0 5px 0 rgba(0,0,0,0.5)',
      position: 'fixed',
      right: 0,
      top: 0,
      width: '700px',
      zIndex: 2000,
    },
    iframe: { height: '100%', width: '700px', border: 'none' },
  };
}

// tslint:disable-next-line:max-classes-per-file
class EditorPanel extends React.Component<EditorPanel.Props> {
  constructor(props: EditorPanel.Props, state: {}) {
    super(props, state);
  }

  public render() {
    return (
      <div
        data-ignorelocizeeditor=""
        data-translated=""
        style={EditorPanel.styles.panel}
      >
        <h4
          id="locize-title"
          data-ignorelocizeeditor=""
          style={{
            color: '#1976d2',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '14px',
            fontWeight: 300,
            margin: '0 0 5px 0',
          }}
        >
          locize editor
        </h4>
        <button
          onClick={() => this.props.clicked()}
          style={{
            ...EditorPanel.styles.button,
            ...(this.props.enabled
              ? EditorPanel.styles.buttonOn
              : EditorPanel.styles.buttonOff),
          }}
        >
          {this.props.enabled ? 'On' : 'Off'}
        </button>
      </div>
    );
  }
}
namespace EditorPanel {
  export interface Props {
    enabled: boolean;
    clicked: () => void;
  }

  export const styles: Record<
    'buttonOn' | 'buttonOff' | 'panel' | 'button',
    React.CSSProperties
  > = {
    button: {
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: '14px',
      fontWeight: 300,
      height: '30px',
      lineHeight: '30px',
      minWidth: '90px',
      outline: 'none',
      padding: '0',
      textAlign: 'center',
      textDecoration: 'none',
      textOverflow: 'ellipsis',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    },
    buttonOff: {
      backgroundColor: '#D50000',
    },
    buttonOn: {
      backgroundColor: '#54A229',
    },
    panel: {
      backgroundColor: '#fff',
      border: 'solid 1px #1976d2',
      bottom: '20px',
      boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.5)',
      fontFamily: 'Helvetica, Arial, sans-serif',
      padding: '10px',
      position: 'fixed',
      right: '20px',
      zIndex: 2001,
    },
  };
}
// tslint:disable-next-line:max-classes-per-file
export class Editor extends React.Component<
  Editor.Required & Partial<Editor.Optional>,
  Editor.State
> {
  private openedWindow: Window | undefined;
  // prettier-ignore
  private editor!: HTMLElement;
  constructor(props: Editor.Required & Editor.Optional, context: {}) {
    super(props, context);
    this.state = { enabled: true };
  }

  public componentWillMount() {
    let editor = document.getElementById('locize-editor');
    if (editor === null) {
      editor = document.createElement('div');
      editor.id = 'locize-editor';
      document.body.appendChild(editor);
    }
    this.editor = editor;
    document.body.addEventListener('click', e => this.lookupInEditor(e));
  }
  public componentWillUnmount() {
    document.body.removeChild(this.editor);
    document.body.removeEventListener('click', e => this.lookupInEditor(e));
  }

  public render() {
    const { enabled } = this.state;
    return ReactDOM.createPortal(
      [
        <EditorPanel key="1" enabled={enabled} clicked={() => this.toggle()} />,
        <EditorWindow
          key="2"
          url={this.props.url}
          onOpen={i => this.open(i)}
        />,
      ],
      this.editor,
    );
  }
  private get safeProps(): Editor.Required & Editor.Optional {
    const { children, ...rest } = this.props;
    return { ...Editor.defaultProps, ...rest };
  }
  private open(window: HTMLIFrameElement | null) {
    if (window) {
      this.openedWindow = window.contentWindow;
    } else {
      console.warn('no iframe');
    }
  }

  private lookupInEditor(e: MouseEvent) {
    e.preventDefault();

    const resourceContainer: HTMLElement | null = e.srcElement!.parentElement;
    if (!resourceContainer) {
      return;
    }
    const sendToEditor = () => {
      const {
        ns,
        key,
        defaultMessage,
        description,
      } = resourceContainer.dataset;

      let message = this.createMessage('', resourceContainer.innerText);

      if (ns && key) {
        message = this.createMessage(ns, key, defaultMessage, description);
      } else {
        console.warn('Missing ns and key in clicked element, trying with text');
      }

      if (this.openedWindow != null) {
        this.openedWindow.postMessage(message, this.safeProps.url);
        this.openedWindow.focus();
      } else {
        console.warn('No opened windows with locize.io');
      }
    };

    if (
      // this.props.autoOpen &&
      this.props.mode !== 'iframe' &&
      this.openedWindow &&
      this.openedWindow.closed
    ) {
      // this.open();
      // setTimeout(() => {
      //   send();
      // }, 3000);
    } else {
      sendToEditor();
    }

    const { toggleKeyModifier, toggleKeyCode } = this.safeProps;

    document.addEventListener('keypress', ev => {
      if (ev[toggleKeyModifier] && ev.which === toggleKeyCode) {
        this.toggle();
      }
    });

    // listen to key press on locize service to disable
    window.addEventListener('message', ev => {
      if (ev.data[toggleKeyModifier] && ev.data.which === toggleKeyCode) {
        this.toggle();
      }
    });
  }
  private createMessage(
    ns: string,
    key: string,
    defaultMessage?: string,
    description?: string,
  ): LocizeEditorBinding.SearchMessage {
    const { language: lng, projectId, version } = this.safeProps;
    return {
      lng,
      message: 'searchForKey',
      ns,
      projectId,
      token: key,
      version,
    };
  }

  private toggle() {
    const { enabled } = this.state;
    enabled ? this.off() : this.on();
  }
  private on() {
    this.setState({ enabled: true });
    document.body.addEventListener('click', this.lookupInEditor);
  }

  private off() {
    this.setState({ enabled: false });
    document.body.removeEventListener('click', this.lookupInEditor);
  }
}

export namespace Editor {
  export interface State {
    enabled: boolean;
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

  export const defaultProps: Editor.Optional = {
    enabled: false,
    mode: 'iframe',
    toggleKeyCode: 24,
    toggleKeyModifier: 'ctrlKey',
    url: 'https://www.locize.io',
    version: 'latest',
  };

  export interface Optional {
    enabled: boolean;
    toggleKeyCode: number;
    toggleKeyModifier: 'ctrlKey' | 'altKey' | 'shiftKey';
    mode: 'window' | 'iframe';
    url: string;
    version: string;
  }

  export interface Required {
    apiKey: string;
    projectId: string;
    referenceLanguage: string;
    language: string;
  }
}
