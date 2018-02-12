import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { delay } from 'react-intl-namespaces/src/delay';

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

      console.log(openedWindow);

      if (openedWindow !== null) {
        this.props.onOpen(
          new Promise(async resolve => {
            await delay(3000);
            resolve(openedWindow);
          }),
        );
        // this.window = openedWindow;
      }
    }
  }

  public render() {
    switch (this.props.mode) {
      case 'iframe':
        return (
          <div
            style={
              EditorWindow.styles(this.props.editorWidthInPixels).container
            }
            data-ignore-locize-editor="true"
          >
            <iframe
              ref={e => {
                if (e !== null) {
                  this.props.onOpen(
                    new Promise(resolve => {
                      resolve(e.contentWindow);
                    }),
                  );
                }
              }}
              style={EditorWindow.styles(this.props.editorWidthInPixels).iframe}
              data-ignore-locize-editor="true"
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
    onOpen: (window: Promise<Window>) => void;
    editorWidthInPixels: number;
    mode: 'iframe' | 'window';
  }

  export const styles: (
    editorWidthInPixels: number,
  ) => Record<
    'container' | 'iframe',
    React.CSSProperties
  > = editorWidthInPixels => ({
    container: {
      bottom: 0,
      boxShadow: '-3px 0 5px 0 rgba(0,0,0,0.5)',
      position: 'fixed',
      right: 0,
      top: 0,
      width: `${editorWidthInPixels}px`,
      zIndex: 2000,
    },
    iframe: {
      border: 'none',
      height: '100%',
      width: `${editorWidthInPixels}px`,
    },
  });
}
