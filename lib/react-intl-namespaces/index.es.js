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

import { func, shape } from 'prop-types';
import { createElement, Component } from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}





function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
}

var IntlBackendContext;
(function (IntlBackendContext) {
    const intlBackendShape = {
        getMessagesFromNamespace: func.isRequired,
    };
    const intlContextTypes = {
        intlBackend: shape(intlBackendShape),
    };
    function Define(target) {
        target.childContextTypes = intlContextTypes;
    }
    IntlBackendContext.Define = Define;
    function Provide(target) {
        target.contextTypes = Object.assign({}, target.contextTypes, intlContextTypes);
    }
    IntlBackendContext.Provide = Provide;
})(IntlBackendContext || (IntlBackendContext = {}));
var IntlNamespaceContext;
(function (IntlNamespaceContext) {
    const intlNamespaceShape = {
        missingMessage: func.isRequired,
    };
    IntlNamespaceContext.intlContextTypes = {
        intlNamespace: shape(intlNamespaceShape),
    };
    function Define(target) {
        target.childContextTypes = IntlNamespaceContext.intlContextTypes;
    }
    IntlNamespaceContext.Define = Define;
    function Provide(target) {
        target.contextTypes = Object.assign({}, target.contextTypes, IntlNamespaceContext.intlContextTypes);
    }
    IntlNamespaceContext.Provide = Provide;
})(IntlNamespaceContext || (IntlNamespaceContext = {}));

// tslint:disable-next-line:no-var-requires
const invariant = require('invariant');

var IntlNamespaces;
(function (IntlNamespaces) {
    let MessageConverter;
    (function (MessageConverter) {
        function pathReducerFactory(finalValue, finalDepth) {
            return function pathReducer(acc, p, index) {
                if (acc !== undefined && typeof acc !== 'string') {
                    if (p in acc) {
                        return acc[p];
                    }
                    else {
                        const currentDepth = index + 1;
                        if (currentDepth === finalDepth) {
                            acc[p] = finalValue;
                        }
                        else {
                            return (acc[p] = {});
                        }
                    }
                }
            };
        }
        function joinMessagesReducer(acc, p) {
            return Object.assign({}, acc, p);
        }
        function flattenTreeRec(value, path) {
            if (typeof value === 'string') {
                return { [path.join('.')]: value };
            }
            else {
                return Object.getOwnPropertyNames(value)
                    .map(p => flattenTreeRec(value[p], [...path, p]))
                    .reduce(joinMessagesReducer, {});
            }
        }
        function buildTree(resource) {
            const result = {};
            Object.getOwnPropertyNames(resource)
                .map(p => ({
                path: p.split('.'),
                value: resource[p],
            }))
                .forEach(p => {
                p.path.reduce(pathReducerFactory(p.value, p.path.length), result);
            });
            return result;
        }
        MessageConverter.buildTree = buildTree;
        function flattenTree(treeObject) {
            return flattenTreeRec(treeObject, []);
        }
        MessageConverter.flattenTree = flattenTree;
    })(MessageConverter = IntlNamespaces.MessageConverter || (IntlNamespaces.MessageConverter = {}));
    function getResourceKey(messageDescriptor, namespace, params) {
        const metadata = IntlNamespaces.getMessageMetadata(messageDescriptor, namespace);
        return `[${metadata.namespace}${namespaceSeparator}${metadata.key} (${params})]`;
    }
    IntlNamespaces.getResourceKey = getResourceKey;
    function getMessageMetadata(messageDescriptor, namespace) {
        const { defaultMessage, description, id } = messageDescriptor;
        let missingMessage = {
            defaultMessage,
            description,
            key: id,
            namespace,
        };
        if (IntlNamespaces.hasNamespace(id)) {
            const parsedId = IntlNamespaces.parseId(id);
            if (parsedId) {
                const { key: parsedKey, namespace: parsedNamespace } = parsedId;
                missingMessage = {
                    defaultMessage,
                    description,
                    key: parsedKey,
                    namespace: parsedNamespace,
                };
            }
        }
        return missingMessage;
    }
    IntlNamespaces.getMessageMetadata = getMessageMetadata;
    function removeNamespaceFromResource(messages, namespace) {
        const result = {};
        for (const key in messages) {
            if (messages.hasOwnProperty(key)) {
                const element = messages[key];
                const keyWithoutNamespace = removeNamespace(namespace, key);
                result[keyWithoutNamespace] = element;
            }
        }
        return result;
    }
    IntlNamespaces.removeNamespaceFromResource = removeNamespaceFromResource;
    const namespaceSeparator = ':';
    function removeNamespace(namespace, id) {
        const namespaceRegex = new RegExp(`^${namespace}${namespaceSeparator}`, 'i');
        return id.replace(namespaceRegex, '');
    }
    IntlNamespaces.removeNamespace = removeNamespace;
    function hasNamespace(id) {
        const namespaceRegex = new RegExp(`.+${namespaceSeparator}.+`, 'i');
        return namespaceRegex.test(id);
    }
    IntlNamespaces.hasNamespace = hasNamespace;
    function parseId(id) {
        const namespaceRegex = new RegExp(`(.+)${namespaceSeparator}(.+)`, 'i');
        const result = namespaceRegex.exec(id);
        if (result) {
            const [_, namespace, key] = result;
            return { namespace, key };
        }
    }
    IntlNamespaces.parseId = parseId;
    function addNamespaceToResource(resource, namespace) {
        const result = {};
        for (const id in resource) {
            if (resource.hasOwnProperty(id)) {
                const element = resource[id];
                if (hasNamespace(id)) {
                    result[id] = element;
                }
                else {
                    result[`${namespace}:${id}`] = element;
                }
            }
        }
        return result;
    }
    IntlNamespaces.addNamespaceToResource = addNamespaceToResource;
})(IntlNamespaces || (IntlNamespaces = {}));

let FormattedMessage$1 = class FormattedMessage$$1 extends FormattedMessage {
    constructor(props, context) {
        if (context.intlNamespace === undefined) {
            invariant(false, 'Missing intlNamespace context. Use IntlNamespaceProvider inside IntlBackendProvider');
        }
        super(props, context);
    }
    render() {
        const result = super.render();
        if (this.context.intlNamespace.includeMetadata) {
            const currentNamespace = this.context.intlNamespace.getNameOfCurrentNamespace();
            const metadata = IntlNamespaces.getMessageMetadata(this.props, currentNamespace);
            return createElement('span', {
                'data-default-message': metadata.defaultMessage,
                'data-description': metadata.description,
                'data-key': metadata.key,
                'data-ns': metadata.namespace,
            }, result);
        }
        else {
            return result;
        }
    }
};
FormattedMessage$1 = __decorate([
    IntlNamespaceContext.Provide
], FormattedMessage$1);

let IntlProvider$1 = class IntlProvider$$1 extends IntlProvider {
    constructor(props, context) {
        super(props, context);
    }
    getChildContext() {
        const result = super.getChildContext();
        const _a = result.intl, { formatMessage: intlFormatMessage } = _a, rest = __rest(_a, ["formatMessage"]);
        const resource = this.props.messages || {};
        if (this.context.intlNamespace === undefined) {
            invariant(false, 'Missing intlNamespace context. Use IntlNamespaceProvider inside IntlBackendProvider');
        }
        const { getNameOfCurrentNamespace, missingMessage, showIds, } = this.context.intlNamespace;
        const formatMessage = (messageDescriptor, values) => {
            if (!resource.hasOwnProperty(messageDescriptor.id)) {
                missingMessage(messageDescriptor);
            }
            if (showIds) {
                return IntlNamespaces.getResourceKey(messageDescriptor, getNameOfCurrentNamespace(), Object.getOwnPropertyNames(values || {}));
            }
            else {
                return intlFormatMessage(messageDescriptor, values);
            }
        };
        return {
            intl: Object.assign({ formatMessage }, rest),
        };
    }
    render() {
        return super.render();
    }
};
IntlProvider$1 = __decorate([
    IntlNamespaceContext.Provide
], IntlProvider$1);

let IntlBackendProvider = class IntlBackendProvider extends Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return this.props.children;
    }
    getChildContext() {
        const defaultGetMessagesFromNamespaceFactory = l => (n, ins) => __awaiter(this, void 0, void 0, function* () {
            if (this.props.loggingEnabled) {
                console.log('[IntlBackendProvider]: getting messages for', n, ins);
            }
            return {};
        });
        const defaultAddMissingMessageFactory = l => m => {
            if (this.props.loggingEnabled) {
                console.log('[IntlBackendProvider]: missing message', m);
            }
        };
        const defaultIncludeMetadata = false;
        const defaultShowIds = false;
        const defaultLoggingEnabled = false;
        const { getMessagesFromNamespaceFactory = defaultGetMessagesFromNamespaceFactory, addMissingMessageFactory = defaultAddMissingMessageFactory, defaultLocale, locale, loggingEnabled = defaultLoggingEnabled, includeMetadata = defaultIncludeMetadata, showIds = defaultShowIds, } = this.props;
        const getLocale = () => ({
            defaultLocale,
            locale,
        });
        return {
            intlBackend: {
                addMissingMessage: addMissingMessageFactory(getLocale),
                getIntlProps: getLocale,
                getMessagesFromNamespace: getMessagesFromNamespaceFactory(getLocale),
                includeMetadata,
                loggingEnabled,
                showIds,
            },
        };
    }
};
IntlBackendProvider = __decorate([
    IntlBackendContext.Define
], IntlBackendProvider);

let IntlNamespaceProvider = class IntlNamespaceProvider extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { messages: {} };
    }
    componentWillMount() {
        const { namespace, includeNamespace = [] } = this.props;
        if (this.context.intlBackend === undefined) {
            invariant(false, 'Missing intlBackend context. Use IntlNamespaceProvider inside IntlBackendProvider');
        }
        const { getMessagesFromNamespace } = this.context.intlBackend;
        const namespaceLoadedNotification = (resource) => {
            this.namespaceLoadedNotification(resource);
        };
        getMessagesFromNamespace(namespaceLoadedNotification, namespace, includeNamespace);
    }
    getChildContext() {
        const { namespace } = this.props;
        const { getMessagesFromNamespace, addMissingMessage, includeMetadata, showIds, loggingEnabled, } = this.context.intlBackend;
        return {
            intlNamespace: {
                includeMetadata,
                getNameOfCurrentNamespace() {
                    return namespace;
                },
                loggingEnabled,
                missingMessage: messageDescriptor => {
                    const missingMessage = IntlNamespaces.getMessageMetadata(messageDescriptor, namespace);
                    addMissingMessage(missingMessage);
                },
                showIds,
            },
        };
    }
    render() {
        const { getIntlProps } = this.context.intlBackend;
        const props = getIntlProps();
        return (createElement(IntlProvider$1, Object.assign({}, props, { messages: this.state.messages }), this.props.children));
    }
    namespaceLoadedNotification({ namespace: messagesNamespace, resource: messages, }) {
        const { namespace, includeNamespace = [] } = this.props;
        if (messagesNamespace === namespace) {
            const newState = {
                messages: Object.assign({}, this.state.messages, messages),
            };
            this.setState(newState);
        }
        if (includeNamespace.includes(messagesNamespace)) {
            messages = IntlNamespaces.addNamespaceToResource(messages, messagesNamespace);
            const newState = {
                messages: Object.assign({}, this.state.messages, messages),
            };
            this.setState(newState);
        }
    }
};
IntlNamespaceProvider = __decorate([
    IntlNamespaceContext.Define,
    IntlBackendContext.Provide
], IntlNamespaceProvider);

function defineMessages(messages) {
    return messages;
}

class CancelablePromise {
    constructor(executor, cancel) {
        this.cancel = cancel;
        this.promise = new Promise(executor);
    }
    then(onfulfilled, onrejected) {
        return this.promise.then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        return this.promise.catch(onrejected);
    }
}
function delay(timeout = 0) {
    let timeoutHandle = 0;
    const p = new CancelablePromise(resolve => {
        timeoutHandle = window.setTimeout(resolve, timeout);
    }, () => window.clearTimeout(timeoutHandle));
    return p;
}

const reduceMessageMetadataToNamespaceResource = (acc, message) => (Object.assign({}, acc, { [message.key]: message.defaultMessage || '' }));
function hasKeys(obj) {
    return Object.getOwnPropertyNames(obj).length > 0;
}
function getMissingResources(originalResources, potentiallyMissingResources) {
    return getFilteredResources(originalResources, potentiallyMissingResources, (k, keys) => !keys.includes(k));
}
function getModifiedResources(originalResources, potentiallyModifiedResources) {
    return getFilteredResources(originalResources, potentiallyModifiedResources, (k, keys) => keys.includes(k) &&
        originalResources[k] !== potentiallyModifiedResources[k]);
}
function getFilteredResources(originalResources, newResources, filter) {
    const originalResourceKeys = Object.getOwnPropertyNames(originalResources);
    const newResourceKeys = Object.getOwnPropertyNames(newResources);
    const seed = {};
    return newResourceKeys
        .filter(k => filter(k, originalResourceKeys))
        .reduce((acc, k) => (Object.assign({}, acc, { [k]: newResources[k] })), seed);
}
class ResourceProvider {
    constructor(server, getDownloadDelay = () => 100, getCurrentTime = () => new Date(), pullInterval = -1) {
        this.getDownloadDelay = getDownloadDelay;
        this.getCurrentTime = getCurrentTime;
        this.pullInterval = pullInterval;
        this.server = server;
        this.namespaces = new Map();
        this.messages = new Map();
    }
    refresh(language) {
        return __awaiter(this, void 0, void 0, function* () {
            const namespaces = Array.from(this.namespaces.keys());
            yield this.pull(namespaces, language);
        });
    }
    requestNamespace(notification, 
    // tslint:disable-next-line:trailing-comma
    ...namespaces) {
        let scheduleDownload = false;
        for (const namespace of namespaces) {
            const value = this.namespaces.get(namespace) || {
                loadNotifications: [],
                namespaceResource: 'empty',
                updatedAt: this.getCurrentTime(),
            };
            value.loadNotifications.push(notification);
            if (!this.namespaces.has(namespace)) {
                this.namespaces.set(namespace, value);
                scheduleDownload = true;
            }
        }
        if (scheduleDownload) {
            this.cancelDownload();
            this.scheduleDownload();
        }
    }
    requestMessage(message) {
        const { namespace } = message;
        const messages = this.messages.get(namespace) || [];
        messages.push(message);
        if (!this.messages.has(namespace)) {
            this.messages.set(namespace, messages);
        }
    }
    changeLanguage(language) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestedResourceNamespaces = Array.from(this.namespaces.keys()).map((namespace) => __awaiter(this, void 0, void 0, function* () {
                const resource = yield this.server.getNamespaceForLanguage(namespace, language);
                return { namespace, resource };
            }));
            yield this.loadAndNotify(requestedResourceNamespaces);
        });
    }
    cancelDownload() {
        if (this.scheduleDownloadDelay) {
            this.scheduleDownloadDelay.cancel();
            this.scheduleDownloadDelay = undefined;
        }
    }
    cancelPulling() {
        if (this.schedulePullingTimer) {
            this.schedulePullingTimer.cancel();
            this.schedulePullingTimer = undefined;
        }
    }
    schedulePulling(language) {
        return __awaiter(this, void 0, void 0, function* () {
            this.schedulePullingTimer = delay(this.pullInterval);
            yield this.schedulePullingTimer;
            const namespaces = Array.from(this.namespaces.keys());
            yield this.pull(namespaces, language);
            this.schedulePulling(language);
        });
    }
    pull(namespaces, language) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestedResourceNamespaces = namespaces.map((namespace) => __awaiter(this, void 0, void 0, function* () {
                let updatedAt;
                const ns = this.namespaces.get(namespace);
                if (ns) {
                    updatedAt = ns.updatedAt;
                }
                if (updatedAt === undefined) {
                    return { namespace, resource: {} };
                }
                const resource = yield this.server.pullNamespace(namespace, language, {
                    updatedAfter: updatedAt,
                });
                return { namespace, resource };
            }));
            const resourceNamespaces = yield this.loadAndNotify(requestedResourceNamespaces);
        });
    }
    scheduleDownload() {
        return __awaiter(this, void 0, void 0, function* () {
            const namespaces = Array.from(this.namespaces.keys());
            this.scheduleDownloadDelay = delay(this.getDownloadDelay());
            yield this.scheduleDownloadDelay;
            yield this.download(namespaces);
        });
    }
    download(namespaces) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestedResourceNamespaces = namespaces.map((namespace) => __awaiter(this, void 0, void 0, function* () {
                const resource = yield this.server.getNamespace(namespace);
                return { namespace, resource };
            }));
            const resourceNamespaces = yield this.loadAndNotify(requestedResourceNamespaces);
            const missingOrModifiedQueue = resourceNamespaces.map(i => this.checkForMissingOrModified(i));
            this.scheduleUpdate(missingOrModifiedQueue);
        });
    }
    loadAndNotify(requestedResourceNamespaces) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceNamespaces = yield Promise.all(requestedResourceNamespaces);
            return resourceNamespaces
                .filter(n => Object.getOwnPropertyNames(n.resource).length > 0)
                .map(({ namespace, resource }) => {
                const value = this.namespaces.get(namespace);
                if (value) {
                    value.namespaceResource = resource;
                    value.loadNotifications.forEach(notify => notify({ namespace, resource }));
                    value.updatedAt = this.getCurrentTime();
                }
                return { namespace, resource };
            });
        });
    }
    checkForMissingOrModified(resourceFromNamespace) {
        const result = {
            missing: {},
            modified: {},
            namespace: resourceFromNamespace.namespace,
        };
        const value = this.messages.get(resourceFromNamespace.namespace);
        if (value) {
            const seed = {};
            const missingOrModifiedResource = value.reduce(reduceMessageMetadataToNamespaceResource, seed);
            result.missing = getMissingResources(resourceFromNamespace.resource, missingOrModifiedResource);
            result.modified = getModifiedResources(resourceFromNamespace.resource, missingOrModifiedResource);
        }
        return result;
    }
    scheduleUpdate(missingOrModifiedQueue) {
        missingOrModifiedQueue.map(item => {
            if (hasKeys(item.missing)) {
                this.server.addMissing(item.namespace, item.missing);
            }
            if (hasKeys(item.modified)) {
                this.server.updateModified(item.namespace, item.modified);
            }
        });
    }
}

export { FormattedMessage$1 as FormattedMessage, IntlProvider$1 as IntlProvider, IntlBackendProvider, IntlNamespaceProvider, IntlNamespaces, defineMessages, ResourceProvider };
