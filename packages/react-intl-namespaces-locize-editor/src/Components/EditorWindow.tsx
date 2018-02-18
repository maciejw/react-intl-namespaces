import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { DOMHelpers } from '../DOMHelpers';

import styles from './EditorWindow.css';

class IframeWindow extends React.Component<EditorWindow.Props> {
  public render() {
    const { container, iframe } = IframeWindow.inlineStyles(
      this.props.editorWidthInPixels,
    );
    return (
      <div className={styles.container} style={container}>
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
        if (e !== null) {
          DOMHelpers.EditorWindow.postMessage(
            e.contentWindow,
            message,
            targetOrigin,
            transfer,
          );
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

    let openedWindow: Window | null = null;

    const open = Promise.resolve<EditorWindow.PostMessage>(
      async (message, targetOrigin, transfer) => {
        openedWindow = await DOMHelpers.EditorWindow.openIfNecessary(
          window,
          openedWindow,
          windowOpenTimeout,
          url,
          'locize-editor',
          '',
          true,
        );
        DOMHelpers.EditorWindow.postMessage(
          openedWindow,
          message,
          targetOrigin,
          transfer,
        );
        DOMHelpers.EditorWindow.focus(openedWindow);
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
