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

import { IntlNamespaces } from 'react-intl-namespaces';

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
}

class LocizeClient {
    constructor(globalFetch, options) {
        this.globalFetch = this.configureFetch(globalFetch);
        this.options = Object.assign({}, LocizeClient.getDefaults(), options);
    }
    pullNamespace(ns, language, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = LocizeClient.PullQueryParams.serialize(LocizeClient.PullQueryParams.parse(params));
            const urlParams = Object.assign({}, this.options, { ns, language, query });
            const response = yield this.globalFetch.fetch(this.options.pullUrl(urlParams), {
                method: 'GET',
            });
            const result = yield response.json();
            const resource = IntlNamespaces.MessageConverter.flattenTree(result);
            return resource;
        });
    }
    getLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.globalFetch.fetch(this.options.languagesUrl(this.options), {
                method: 'GET',
            });
            const languages = yield response.json();
            return Object.getOwnPropertyNames(languages);
        });
    }
    getNamespace(ns) {
        return this.getNamespaceForLanguage(ns, this.options.referenceLanguage);
    }
    addMissing(ns, missingResources) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = Object.assign({}, this.options, { ns });
            const response = yield this.globalFetch.fetch(this.options.missingUrl(params), {
                body: JSON.stringify(missingResources),
                method: 'POST',
            });
            return;
        });
    }
    updateModified(ns, modifiedResources, replace = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = Object.assign({}, this.options, { ns });
            let url = this.options.updateUrl(params);
            if (replace) {
                url += '?replace=true';
            }
            const response = yield this.globalFetch.fetch(url, {
                body: JSON.stringify(modifiedResources),
                method: 'POST',
            });
            return;
        });
    }
    getNamespaceForLanguage(ns, language) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = Object.assign({}, this.options, { language,
                ns });
            const response = yield this.globalFetch.fetch(this.options.namespaceUrl(params), {
                method: 'GET',
            });
            const result = yield response.json();
            const resource = IntlNamespaces.MessageConverter.flattenTree(result);
            return resource;
        });
    }
    configureFetch(globalFetch) {
        const decoratedFetch = (input, init = {}) => __awaiter(this, void 0, void 0, function* () {
            const { headers } = init, rest = __rest(init, ["headers"]);
            const defaults = {};
            defaults.headers = new Headers(headers);
            defaults.headers.append('Authorization', `Bearer ${this.options.apiKey}`);
            defaults.headers.append('Accept', `application/json`);
            defaults.headers.append('Content-Type', `application/json`);
            const response = yield globalFetch.fetch(input, Object.assign({}, defaults, rest));
            return response;
        });
        return { fetch: decoratedFetch };
    }
}
(function (LocizeClient) {
    function getDefaults() {
        return {
            languagesUrl: ({ projectId }) => `https://api.locize.io/languages/${projectId}`,
            missingUrl: ({ projectId, version, referenceLanguage, ns }) => `https://api.locize.io/missing/${projectId}/${version}/${referenceLanguage}/${ns}`,
            namespaceUrl: ({ projectId, version, language, ns }) => `https://api.locize.io/${projectId}/${version}/${language}/${ns}`,
            pullUrl: ({ projectId, version, language, ns, query }) => `https://api.locize.io/pull/${projectId}/${version}/${language}/${ns}?${query}`,
            updateUrl: ({ projectId, version, referenceLanguage, ns }) => `https://api.locize.io/update/${projectId}/${version}/${referenceLanguage}/${ns}`,
            version: 'latest',
        };
    }
    LocizeClient.getDefaults = getDefaults;
    let PullQueryParams;
    (function (PullQueryParams) {
        function parse(params) {
            const query = {};
            if ('lastUsedBefore' in params && params.lastUsedBefore) {
                query.lastUsed = { value: params.lastUsedBefore, operator: '<' };
            }
            if ('lastUsedAfter' in params && params.lastUsedAfter) {
                query.lastUsed = { value: params.lastUsedAfter, operator: '>' };
            }
            if ('updatedBefore' in params && params.updatedBefore) {
                query.updatedAt = { value: params.updatedBefore, operator: '<' };
            }
            if ('updatedAfter' in params && params.updatedAfter) {
                query.updatedAt = { value: params.updatedAfter, operator: '>' };
            }
            if ('includeTags' in params) {
                query.tags = params.includeTags;
                query['!tags'] = params.excludeTags;
            }
            return query;
        }
        PullQueryParams.parse = parse;
        function serialize(params) {
            const queryParams = [];
            if (params.lastUsed !== undefined) {
                queryParams.push(`lastUsed=${params.lastUsed.operator}${params.lastUsed.value.getTime()}`);
            }
            if (params.updatedAt !== undefined) {
                queryParams.push(`updatedAt=${params.updatedAt.operator}${params.updatedAt.value.getTime()}`);
            }
            if (params.tags !== undefined && params.tags.length > 0) {
                queryParams.push(`tags=[${params.tags.join(',')}]`);
                const notTags = params['!tags'];
                if (notTags !== undefined && notTags.length > 0) {
                    queryParams.push(`!tags=[${notTags.join(',')}]`);
                }
            }
            return queryParams.join('&');
        }
        PullQueryParams.serialize = serialize;
    })(PullQueryParams = LocizeClient.PullQueryParams || (LocizeClient.PullQueryParams = {}));
})(LocizeClient || (LocizeClient = {}));

export { LocizeClient };
