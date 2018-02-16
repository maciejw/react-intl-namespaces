/*
 * Copyright 2018, warszawski.pro
 * Copyrights licensed under the MIT License
 * See the accompanying LICENSE file for terms.
 */

function __$$styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

import { Component, createElement } from 'react';
import { createPortal } from 'react-dom';

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
}

// tslint:disable-next-line:no-var-requires
const cn = require('classnames');

var button = "EditorPanel_button__1e0Ek";
var buttonOff = "EditorPanel_buttonOff__1UA40";
var buttonOn = "EditorPanel_buttonOn__3KVwF";
var option = "EditorPanel_option__NtFOH";
var panel = "EditorPanel_panel__3LKp-";
var pinned = "EditorPanel_pinned__Eo4hX";
var content = "EditorPanel_content___ZbhI";
var select = "EditorPanel_select__kLatd";
var title = "EditorPanel_title__30jSv";
var pin = "EditorPanel_pin__2Pup8";
var unpinned = "EditorPanel_unpinned__rJvDg";
var css = ".EditorPanel_button__1e0Ek {\r\n  border: none;\r\n  color: #fff;\r\n  cursor: pointer;\r\n  font-family: Helvetica, Arial, sans-serif;\r\n  font-size: 14px;\r\n  font-weight: 300;\r\n  height: 30px;\r\n  line-height: 30px;\r\n  min-width: 90px;\r\n  outline: none;\r\n  padding: 0 2px;\r\n  text-align: center;\r\n  text-decoration: none;\r\n  text-overflow: ellipsis;\r\n  text-transform: uppercase;\r\n  white-space: nowrap;\r\n}\r\n.EditorPanel_button__1e0Ek:hover {\r\n  opacity: 0.9;\r\n}\r\n.EditorPanel_button__1e0Ek:active {\r\n  padding: 0 1px 0 3px;\r\n}\r\n.EditorPanel_buttonOff__1UA40 {\r\n  background-color: #d50000;\r\n}\r\n.EditorPanel_buttonOn__3KVwF {\r\n  background-color: #54a229;\r\n}\r\n.EditorPanel_option__NtFOH {\r\n  text-transform: uppercase;\r\n}\r\n.EditorPanel_panel__3LKp- {\r\n  background-color: #fff;\r\n  border: solid 1px #1976d2;\r\n  bottom: 2px;\r\n  -webkit-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, .5);\r\n          box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, .5);\r\n  font-family: Helvetica, Arial, sans-serif;\r\n  padding: 10px;\r\n  position: fixed;\r\n  right: 18px;\r\n  z-index: 2001;\r\n  -webkit-user-select: none;\r\n     -moz-user-select: none;\r\n      -ms-user-select: none;\r\n          user-select: none;\r\n}\r\n.EditorPanel_panel__3LKp-.EditorPanel_pinned__Eo4hX {\r\n  max-width: 1000px;\r\n}\r\n.EditorPanel_panel__3LKp- .EditorPanel_content___ZbhI {\r\n  display: none;\r\n  float: left;\r\n}\r\n.EditorPanel_panel__3LKp-.EditorPanel_pinned__Eo4hX .EditorPanel_content___ZbhI {\r\n  display: block;\r\n  width: auto;\r\n}\r\n.EditorPanel_select__kLatd {\r\n  width: 50px;\r\n  border: none;\r\n  -webkit-box-sizing: content-box;\r\n          box-sizing: content-box;\r\n  font-family: Helvetica, Arial, sans-serif;\r\n  font-size: 14px;\r\n  font-weight: 300;\r\n  padding: 6px;\r\n  text-transform: uppercase;\r\n}\r\n\r\n.EditorPanel_title__30jSv {\r\n  color: #1976d2;\r\n  font-family: Helvetica, Arial, sans-serif;\r\n  font-size: 14px;\r\n  font-weight: 300;\r\n  margin: 0 0 5px 0;\r\n}\r\n\r\n.EditorPanel_pin__2Pup8 {\r\n  height: 52px;\r\n  min-width: 20px;\r\n  float: right;\r\n  margin-left: 5px;\r\n}\r\n.EditorPanel_pin__2Pup8:active {\r\n  padding: 0;\r\n  padding: initial;\r\n}\r\n.EditorPanel_pin__2Pup8:after {\r\n  font-size: 30px;\r\n}\r\n.EditorPanel_pin__2Pup8.EditorPanel_pinned__Eo4hX:after {\r\n  content: '\\203A';\r\n}\r\n.EditorPanel_pin__2Pup8.EditorPanel_unpinned__rJvDg:after {\r\n  content: '\\2039';\r\n}\r\n";
__$$styleInject(css);

class EditorPanel$1 extends Component {
    constructor(props, state) {
        super(props, state);
        this.state = { pinned: true };
    }
    render() {
        const languages = this.props.getLanguages();
        return (createElement("div", { className: cn(panel, {
                [pinned]: this.state.pinned,
            }) },
            createElement("span", { className: cn(content) },
                createElement("div", { className: title }, "locize editor"),
                languages.length > 0 && (createElement("select", { className: select, value: this.props.language, onChange: e => this.props.onChangeLanguage(e.target.value) }, languages.map(l => (createElement("option", { key: l, value: l, className: option }, l))))),
                ' ',
                createElement("button", { onClick: () => this.props.onSearchEnabled(), className: cn(button, {
                        [buttonOn]: this.props.searchEnabled,
                        [buttonOff]: !this.props.searchEnabled,
                    }) }, this.props.searchEnabled ? 'On' : 'Off'),
                ' ',
                createElement("button", { onClick: () => this.props.onShowIds(), className: cn(button, {
                        [buttonOn]: this.props.showIds,
                        [buttonOff]: !this.props.showIds,
                    }) }, "id's"),
                ' ',
                createElement("button", { onClick: () => this.props.onRefresh(), className: cn(button, buttonOn) }, "refresh"),
                ' '),
            createElement("button", { className: cn(button, pin, buttonOn, {
                    [pinned]: this.state.pinned,
                    [buttonOn]: this.state.pinned,
                    [unpinned]: !this.state.pinned,
                    [buttonOff]: !this.state.pinned,
                }), onClick: () => this.setState({ pinned: !this.state.pinned }) }, ' ')));
    }
}

var container = "EditorWindow_container__JbpaF";
var iframe = "EditorWindow_iframe__3xfPU";
var css$1 = ".EditorWindow_container__JbpaF {\r\n  bottom: 0;\r\n  -webkit-box-shadow: -3px 0 5px 0 rgba(0, 0, 0, .5);\r\n          box-shadow: -3px 0 5px 0 rgba(0, 0, 0, .5);\r\n  position: fixed;\r\n  right: 0;\r\n  top: 0;\r\n  z-index: 2000;\r\n}\r\n\r\n.EditorWindow_iframe__3xfPU {\r\n  border: none;\r\n  height: 100%;\r\n}\r\n";
__$$styleInject(css$1);

function delay(timeout = 0) {
    return new Promise(resolve => {
        window.setTimeout(resolve, timeout);
    });
}
class IframeWindow extends Component {
    render() {
        const { container: container$$1, iframe: iframe$$1 } = IframeWindow.inlineStyles(this.props.editorWidthInPixels);
        return (createElement("div", { className: container, style: container$$1, "data-ignore-locize-editor": "true" },
            createElement("iframe", { className: iframe, ref: e => this.iframeRef(e), style: iframe$$1, src: this.props.url })));
    }
    iframeRef(e) {
        const open = Promise.resolve((message, targetOrigin, transfer) => {
            if (e !== null && e.contentWindow !== null) {
                e.contentWindow.postMessage(message, targetOrigin, transfer);
            }
        });
        this.props.onOpen(open);
    }
}
(function (IframeWindow) {
    IframeWindow.inlineStyles = editorWidthInPixels => ({
        container: {
            width: `${editorWidthInPixels}px`,
        },
        iframe: {
            width: `${editorWidthInPixels}px`,
        },
    });
})(IframeWindow || (IframeWindow = {}));
class FullWindow extends Component {
    componentDidMount() {
        const { url, window, windowOpenTimeout } = this.props;
        const openWindow = () => window.open(url, 'locize-editor', '', true);
        let openedWindow = null;
        const open = Promise.resolve((message, targetOrigin, transfer) => __awaiter(this, void 0, void 0, function* () {
            if (openedWindow === null || openedWindow.closed) {
                openedWindow = openWindow();
                yield delay(windowOpenTimeout);
            }
            if (openedWindow !== null) {
                openedWindow.postMessage(message, targetOrigin, transfer);
                openedWindow.focus();
            }
        }));
        this.props.onOpen(open);
    }
    render() {
        return null;
    }
}
class EditorWindow$1 extends Component {
    render() {
        switch (this.props.mode) {
            case 'iframe':
                return createElement(IframeWindow, Object.assign({}, this.props));
            case 'window':
                return createElement(FullWindow, Object.assign({}, this.props));
        }
    }
}

class Editor extends Component {
    render() {
        return createElement(EditorComponent, Object.assign({}, Editor.defaultProps, this.props));
    }
}
class EditorComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            searchEnabled: true,
            showEditor: this.props.enabled,
            showIds: false,
        };
        let editor = document.getElementById('locize-editor');
        editor = document.createElement('div');
        editor.id = 'locize-editor';
        document.body.appendChild(editor);
        this.editor = editor;
        this.click = (ev) => this.lookupInEditor(ev);
        const { toggleKeyModifier, toggleKeyCode } = this.props;
        this.keypress = (ev) => {
            if (ev[toggleKeyModifier] && ev.which === toggleKeyCode) {
                this.onSearchEnabled();
            }
        };
        this.message = (ev) => {
            if (ev.data[toggleKeyModifier] && ev.data.which === toggleKeyCode) {
                this.onSearchEnabled();
            }
        };
        document.body.addEventListener('click', this.click);
        document.addEventListener('keypress', this.keypress);
        window.addEventListener('message', this.message);
    }
    componentWillUnmount() {
        document.body.removeChild(this.editor);
        document.removeEventListener('keypress', this.keypress);
        window.removeEventListener('message', this.message);
    }
    render() {
        const { searchEnabled, showIds } = this.state;
        return createPortal(createElement("div", { "data-ignore-locize-editor": "true" },
            createElement(EditorPanel$1, { showIds: showIds, searchEnabled: searchEnabled, onRefresh: () => this.onRefresh(), onSearchEnabled: () => this.onSearchEnabled(), onShowIds: () => this.onShowIds(), language: this.props.language, onChangeLanguage: this.props.onChangeLanguage, getLanguages: this.props.getLanguages }),
            createElement(EditorWindow$1, { mode: this.props.mode, editorWidthInPixels: this.props.editorWidthInPixels, windowOpenTimeout: 3000, window: window, url: this.props.url, onOpen: i => this.open(i) })), this.editor);
    }
    onShowIds() {
        const _a = this.state, { showIds: oldShowIds } = _a, rest = __rest(_a, ["showIds"]);
        const showIds = !oldShowIds;
        this.setState(Object.assign({ showIds }, rest));
        this.props.onShowIds(showIds);
    }
    open(callback) {
        this.postMessage = callback;
    }
    isTranslatedOrIgnored(element) {
        if (this.isHtmlElement(element)) {
            let e = element;
            while (e.tagName.toLowerCase() !== 'body') {
                if (e.dataset.ignoreLocizeEditor === 'true' ||
                    e.dataset.translated === 'true') {
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
    isHtmlElement(element) {
        return element instanceof HTMLElement;
    }
    lookupInEditor(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.state.searchEnabled) {
                return;
            }
            e.preventDefault();
            if (e.srcElement) {
                const resourceContainer = e.srcElement.parentElement;
                if (!resourceContainer || this.isTranslatedOrIgnored(resourceContainer)) {
                    return;
                }
                const { ns, key, defaultMessage, description, } = resourceContainer.dataset;
                let message;
                if (ns && key) {
                    message = this.createMessage(ns, key, defaultMessage, description);
                    const postMessage = yield this.postMessage;
                    if (this.props.mode === 'window') {
                        if (!window.closed) {
                            postMessage(message, this.props.url);
                        }
                    }
                    if (this.props.mode === 'iframe') {
                        postMessage(message, this.props.url);
                    }
                }
                else {
                    alert(`Missing key and namespace of resource, try search for a text or select ID mode`);
                }
            }
        });
    }
    createMessage(ns, key, defaultMessage, description) {
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
    onSearchEnabled() {
        const { searchEnabled } = this.state;
        this.setState({ searchEnabled: !searchEnabled });
    }
    onRefresh() {
        this.props.onRefresh();
    }
}
(function (Editor) {
    Editor.defaultProps = {
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
})(Editor || (Editor = {}));

export { Editor };
