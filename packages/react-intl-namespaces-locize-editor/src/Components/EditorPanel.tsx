import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { classNames } from '../classnames';
import * as styles from './EditorPanel.css';

export class EditorPanel extends React.Component<
  EditorPanel.Props,
  EditorPanel.State
> {
  constructor(props: EditorPanel.Props, state: EditorPanel.State) {
    super(props, state);
    this.state = { pinned: true };
  }

  public render() {
    const languages = this.props.getLanguages();
    return (
      <div
        className={classNames(styles.panel, {
          [styles.pinned]: this.state.pinned,
        })}
      >
        {
          <span className={classNames(styles.content)}>
            <div className={styles.title}>locize editor</div>
            {languages.length > 0 && (
              <select
                className={styles.select}
                value={this.props.language}
                onChange={e => this.props.onChangeLanguage(e.target.value)}
              >
                {languages.map(l => (
                  <option key={l} value={l} className={styles.option}>
                    {l}
                  </option>
                ))}
              </select>
            )}{' '}
            <button
              onClick={() => this.props.onSearchEnabled()}
              className={classNames(styles.button, {
                [styles.buttonOn]: this.props.searchEnabled,
                [styles.buttonOff]: !this.props.searchEnabled,
              })}
            >
              {this.props.searchEnabled ? 'On' : 'Off'}
            </button>{' '}
            <button
              onClick={() => this.props.onShowIds()}
              className={classNames(styles.button, {
                [styles.buttonOn]: this.props.showIds,
                [styles.buttonOff]: !this.props.showIds,
              })}
            >
              id's
            </button>{' '}
            <button
              onClick={() => this.props.onRefresh()}
              className={classNames(styles.button, styles.buttonOn)}
            >
              refresh
            </button>{' '}
          </span>
        }
        <button
          className={classNames(styles.button, styles.pin, styles.buttonOn, {
            [styles.pinned]: this.state.pinned,
            [styles.buttonOn]: this.state.pinned,
            [styles.unpinned]: !this.state.pinned,
            [styles.buttonOff]: !this.state.pinned,
          })}
          onClick={() => this.setState({ pinned: !this.state.pinned })}
        >
          {' '}
        </button>
      </div>
    );
  }
}
export namespace EditorPanel {
  export interface State {
    pinned: boolean;
  }
  export interface Props {
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
