/*
 * Copyright 2018, warszawski.pro
 * Copyrights licensed under the MIT License
 * See the accompanying LICENSE file for terms.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ReactDOM = require('react-dom');

class EditorWindow extends React.Component {
    constructor(props, state) {
        super(props, state);
    }
    render() {
        return (React.createElement("div", { style: EditorWindow.styles.container, "data-ignorelocizeeditor": "", "data-translated": "" },
            React.createElement("iframe", { ref: e => this.props.onOpen(e), style: EditorWindow.styles.iframe, "data-ignorelocizeeditor": "", "data-translated": "", src: this.props.url })));
    }
}
(function (EditorWindow) {
    EditorWindow.styles = {
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
})(EditorWindow || (EditorWindow = {}));
// tslint:disable-next-line:max-classes-per-file
class EditorPanel extends React.Component {
    constructor(props, state) {
        super(props, state);
    }
    render() {
        return (React.createElement("div", { "data-ignorelocizeeditor": "", "data-translated": "", style: EditorPanel.styles.panel },
            React.createElement("h4", { id: "locize-title", "data-ignorelocizeeditor": "", style: {
                    color: '#1976d2',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontSize: '14px',
                    fontWeight: 300,
                    margin: '0 0 5px 0',
                } }, "locize editor"),
            React.createElement("button", { onClick: () => this.props.clicked(), style: Object.assign({}, EditorPanel.styles.button, (this.props.enabled
                    ? EditorPanel.styles.buttonOn
                    : EditorPanel.styles.buttonOff)) }, this.props.enabled ? 'On' : 'Off')));
    }
}
(function (EditorPanel) {
    EditorPanel.styles = {
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
})(EditorPanel || (EditorPanel = {}));
// tslint:disable-next-line:max-classes-per-file
class exports.Editor extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { enabled: true };
    }
    componentWillMount() {
        let editor = document.getElementById('locize-editor');
        if (editor === null) {
            editor = document.createElement('div');
            editor.id = 'locize-editor';
            document.body.appendChild(editor);
        }
        this.editor = editor;
        document.body.addEventListener('click', e => this.lookupInEditor(e));
    }
    componentWillUnmount() {
        document.body.removeChild(this.editor);
        document.body.removeEventListener('click', e => this.lookupInEditor(e));
    }
    render() {
        const { enabled } = this.state;
        return ReactDOM.createPortal([
            React.createElement(EditorPanel, { key: "1", enabled: enabled, clicked: () => this.toggle() }),
            React.createElement(EditorWindow, { key: "2", url: this.props.url, onOpen: i => this.open(i) }),
        ], this.editor);
    }
    get safeProps() {
        const _a = this.props, { children } = _a, rest = __rest(_a, ["children"]);
        return Object.assign({}, exports.Editor.defaultProps, rest);
    }
    open(window) {
        if (window) {
            this.openedWindow = window.contentWindow;
        }
        else {
            console.warn('no iframe');
        }
    }
    lookupInEditor(e) {
        e.preventDefault();
        const resourceContainer = e.srcElement.parentElement;
        if (!resourceContainer) {
            return;
        }
        const sendToEditor = () => {
            const { ns, key, defaultMessage, description, } = resourceContainer.dataset;
            let message = this.createMessage('', resourceContainer.innerText);
            if (ns && key) {
                message = this.createMessage(ns, key, defaultMessage, description);
            }
            else {
                console.warn('Missing ns and key in clicked element, trying with text');
            }
            if (this.openedWindow != null) {
                this.openedWindow.postMessage(message, this.safeProps.url);
                this.openedWindow.focus();
            }
            else {
                console.warn('No opened windows with locize.io');
            }
        };
        if (
        // this.props.autoOpen &&
        this.props.mode !== 'iframe' &&
            this.openedWindow &&
            this.openedWindow.closed) {
            // this.open();
            // setTimeout(() => {
            //   send();
            // }, 3000);
        }
        else {
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
    createMessage(ns, key, defaultMessage, description) {
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
    toggle() {
        const { enabled } = this.state;
        enabled ? this.off() : this.on();
    }
    on() {
        this.setState({ enabled: true });
        document.body.addEventListener('click', this.lookupInEditor);
    }
    off() {
        this.setState({ enabled: false });
        document.body.removeEventListener('click', this.lookupInEditor);
    }
}
(function (Editor) {
    Editor.defaultProps = {
        enabled: false,
        mode: 'iframe',
        toggleKeyCode: 24,
        toggleKeyModifier: 'ctrlKey',
        url: 'https://www.locize.io',
        version: 'latest',
    };
})(exports.Editor || (exports.Editor = {}));
