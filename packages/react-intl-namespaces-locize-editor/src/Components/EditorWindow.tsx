import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as styles from './EditorWindow.css';

function delay(timeout: number = 0) {
  return new Promise<void>(resolve => {
    window.setTimeout(resolve, timeout);
  });
}
export class EditorWindow extends React.Component<EditorWindow.Props> {
  // prettier-ignore
  private window: Window | undefined;
  constructor(props: EditorWindow.Props, state: {}) {
    super(props, state);
  }

  public componentDidMount() {
    if (this.props.mode === 'window') {
      const openedWindow = window.open(
        this.props.url,
        'locize-editor',
        '',
        true,
      );

      if (openedWindow !== null) {
        this.props.onOpen(
          new Promise(async resolve => {
            await delay(3000);
            resolve((message, targetOrigin, transfer) => {
              openedWindow.postMessage(message, targetOrigin, transfer);
              openedWindow.focus();
            });
          }),
        );
      }
    }
  }

  public render() {
    switch (this.props.mode) {
      case 'iframe':
        const { container, iframe } = EditorWindow.inlineStyles(
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
              ref={e => {
                if (e !== null) {
                  this.props.onOpen(
                    Promise.resolve<EditorWindow.PostMessage>(
                      (message, targetOrigin, transfer) => {
                        e.contentWindow.postMessage(
                          message,
                          targetOrigin,
                          transfer,
                        );
                      },
                    ),
                  );
                }
              }}
              style={iframe}
              src={this.props.url}
            />
          </div>
        );
      case 'window':
        return null;
    }
  }
}
export namespace EditorWindow {
  export interface Props {
    url: string;
    onOpen: (callback: Promise<PostMessage>) => void;
    editorWidthInPixels: number;
    mode: 'iframe' | 'window';
  }
  export interface PostMessage {
    (message: any, targetOrigin: string, transfer?: any[]): void;
  }
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
