/*
 * Copyright 2018, warszawski.pro
 * Copyrights licensed under the MIT License
 * See the accompanying LICENSE file for terms.
 */

import { InltNamespaces } from 'react-intl-namespaces';

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
    getLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.globalFetch.fetch(this.options.languagesUrl(this.options), {
                method: 'GET',
            });
            return yield response.json();
        });
    }
    getNamespace(ns) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = Object.assign({}, this.options, { ns });
            const response = yield this.globalFetch.fetch(this.options.namespaceUrl(params), {
                method: 'GET',
            });
            const result = yield response.json();
            const resource = InltNamespaces.MessageConverter.flattenTree(result);
            return resource;
        });
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
    configureFetch(globalFetch) {
        const fetch = (input, init = {}) => __awaiter(this, void 0, void 0, function* () {
            const { headers } = init, rest = __rest(init, ["headers"]);
            const defaults = {};
            defaults.headers = new Headers(headers);
            defaults.headers.append('Authorization', `Bearer ${this.options.apiKey}`);
            defaults.headers.append('Accept', `application/json`);
            defaults.headers.append('Content-Type', `application/json`);
            const response = yield globalFetch.fetch(input, Object.assign({}, defaults, rest));
            return response;
        });
        return { fetch };
    }
}
(function (LocizeClient) {
    function getDefaults() {
        return {
            languagesUrl: ({ projectId }) => `https://api.locize.io/languages/${projectId}`,
            missingUrl: ({ projectId, version, referenceLanguage, ns }) => `https://api.locize.io/missing/${projectId}/${version}/${referenceLanguage}/${ns}`,
            namespaceUrl: ({ projectId, version, referenceLanguage, ns }) => `https://api.locize.io/${projectId}/${version}/${referenceLanguage}/${ns}`,
            updateUrl: ({ projectId, version, referenceLanguage, ns }) => `https://api.locize.io/update/${projectId}/${version}/${referenceLanguage}/${ns}`,
            version: 'latest',
        };
    }
    LocizeClient.getDefaults = getDefaults;
})(LocizeClient || (LocizeClient = {}));

export { LocizeClient };
