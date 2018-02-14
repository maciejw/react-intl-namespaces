import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as styles from './EditorWindow.css';

function delay(timeout: number = 0) {
  return new Promise<void>(resolve => {
    window.setTimeout(resolve, timeout);
  });
}

class IframeWindow extends React.Component<EditorWindow.Props> {
  public render() {
    const { container, iframe } = IframeWindow.inlineStyles(
      this.props.editorWidthInPixels,
    );
    return (
      <div
        className={styles.container}
        style={container}
        data-ignore-locize-editor="true"
      >
        <iframe
          className={styles.iframe}
          ref={e => this.iframeRef(e)}
          style={iframe}
          src={this.props.url}
        />
      </div>
    );
  }

  private iframeRef(e: HTMLIFrameElement | null) {
    const open = Promise.resolve<EditorWindow.PostMessage>(
      (message, targetOrigin, transfer) => {
        if (e !== null && e.contentWindow !== null) {
          e.contentWindow.postMessage(message, targetOrigin, transfer);
        }
      },
    );
    this.props.onOpen(open);
  }
}
namespace IframeWindow {
  export const inlineStyles: (
    editorWidthInPixels: number,
  ) => Record<
    'container' | 'iframe',
    React.CSSProperties
  > = editorWidthInPixels => ({
    container: {
      width: `${editorWidthInPixels}px`,
    },
    iframe: {
      width: `${editorWidthInPixels}px`,
    },
  });
}

class FullWindow extends React.Component<EditorWindow.Props> {
  public componentDidMount() {
    const { url, window, windowOpenTimeout } = this.props;
    const openWindow = () => window.open(url, 'locize-editor', '', true);

    let openedWindow: Window | null = null;

    const open = Promise.resolve<EditorWindow.PostMessage>(
      async (message, targetOrigin, transfer) => {
        if (openedWindow === null || openedWindow.closed) {
          openedWindow = openWindow();
          await delay(windowOpenTimeout);
        }
        if (openedWindow !== null) {
          openedWindow.postMessage(message, targetOrigin, transfer);
          openedWindow.focus();
        }
      },
    );
    this.props.onOpen(open);
  }

  public render() {
    return null;
  }
}

export class EditorWindow extends React.Component<EditorWindow.Props> {
  public render() {
    switch (this.props.mode) {
      case 'iframe':
        return <IframeWindow {...this.props} />;
      case 'window':
        return <FullWindow {...this.props} />;
    }
  }
}
export namespace EditorWindow {
  export interface Props {
    url: string;
    onOpen: (callback: Promise<PostMessage>) => void;
    editorWidthInPixels: number;
    windowOpenTimeout: number;
    mode: 'iframe' | 'window';
    window: Window;
  }
  export type PostMessage = (
    message: any,
    targetOrigin: string,
    transfer?: any[],
  ) => void;
}
