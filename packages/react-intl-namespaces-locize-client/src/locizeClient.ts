import { IntlNamespaces } from 'react-intl-namespaces';

import {
  NamespaceResource,
  PullNamespaceParams,
  ResourceServer,
} from 'react-intl-namespaces/contracts';

export class LocizeClient implements ResourceServer {
  private options: LocizeClient.ApiUrls & LocizeClient.RequiredOptions;
  private globalFetch: GlobalFetch;
  constructor(
    globalFetch: GlobalFetch,
    options: Partial<LocizeClient.ApiUrls> & LocizeClient.RequiredOptions,
  ) {
    this.globalFetch = this.configureFetch(globalFetch);
    this.options = {
      ...LocizeClient.getDefaults(),
      ...options,
    };
  }
  public async pullNamespace(
    ns: string,
    language: string,
    params: PullNamespaceParams,
  ): Promise<NamespaceResource> {
    const query = LocizeClient.PullQueryParams.serialize(
      LocizeClient.PullQueryParams.parse(params),
    );
    const urlParams = { ...this.options, ns, language, query };

    const response = await this.globalFetch.fetch(
      this.options.pullUrl(urlParams),
      {
        method: 'GET',
      },
    );
    const result = await response.json();

    const resource = IntlNamespaces.MessageConverter.flattenTree(result);

    return resource;
  }
  public async getLanguages(): Promise<string[]> {
    const response = await this.globalFetch.fetch(
      this.options.languagesUrl(this.options),
      {
        method: 'GET',
      },
    );
    const languages: LocizeClient.Dto.Languages = await response.json();

    return Object.getOwnPropertyNames(languages);
  }
  public getNamespace(ns: string) {
    return this.getNamespaceForLanguage(ns, this.options.referenceLanguage);
  }

  public async addMissing(
    ns: string,
    missingResources: NamespaceResource,
  ): Promise<void> {
    const params = { ...this.options, ns };
    const response = await this.globalFetch.fetch(
      this.options.missingUrl(params),
      {
        body: JSON.stringify(missingResources),
        method: 'POST',
      },
    );
    return;
  }
  public async updateModified(
    ns: string,
    modifiedResources: NamespaceResource,
    replace: boolean = false,
  ): Promise<void> {
    const params = { ...this.options, ns };
    let url = this.options.updateUrl(params);
    if (replace) {
      url += '?replace=true';
    }
    const response = await this.globalFetch.fetch(url, {
      body: JSON.stringify(modifiedResources),
      method: 'POST',
    });
    return;
  }
  public async getNamespaceForLanguage(
    ns: string,
    language: string,
  ): Promise<NamespaceResource> {
    const params = {
      ...this.options,
      language,
      ns,
    };
    const response = await this.globalFetch.fetch(
      this.options.namespaceUrl(params),
      {
        method: 'GET',
      },
    );

    const result = await response.json();

    const resource = IntlNamespaces.MessageConverter.flattenTree(result);

    return resource;
  }

  private configureFetch(globalFetch: GlobalFetch): GlobalFetch {
    const decoratedFetch = async (
      input: RequestInfo,
      init: RequestInit = {},
    ) => {
      const { headers, ...rest } = init;
      const defaults: RequestInit = {};
      defaults.headers = new Headers(headers);
      defaults.headers.append('Authorization', `Bearer ${this.options.apiKey}`);
      defaults.headers.append('Accept', `application/json`);
      defaults.headers.append('Content-Type', `application/json`);
      const response = await globalFetch.fetch(input, { ...defaults, ...rest });
      return response;
    };
    return { fetch: decoratedFetch };
  }
}

export namespace LocizeClient {
  export function getDefaults(): LocizeClient.ApiUrls {
    return {
      languagesUrl: ({ projectId }) =>
        `https://api.locize.io/languages/${projectId}`,
      missingUrl: ({ projectId, version, referenceLanguage, ns }) =>
        `https://api.locize.io/missing/${projectId}/${version}/${referenceLanguage}/${ns}`,
      namespaceUrl: ({ projectId, version, language, ns }) =>
        `https://api.locize.io/${projectId}/${version}/${language}/${ns}`,
      pullUrl: ({ projectId, version, language, ns, query }) =>
        `https://api.locize.io/pull/${projectId}/${version}/${language}/${ns}?${query}`,
      updateUrl: ({ projectId, version, referenceLanguage, ns }) =>
        `https://api.locize.io/update/${projectId}/${version}/${referenceLanguage}/${ns}`,
      version: 'latest',
    };
  }
  export interface RequiredOptions {
    apiKey: string;
    referenceLanguage: string;
    projectId: string;
  }
  export interface ApiUrls {
    languagesUrl: (params: { projectId: string }) => string;
    missingUrl: (
      params: {
        projectId: string;
        version: string;
        referenceLanguage: string;
        ns: string;
      },
    ) => string;
    namespaceUrl: (
      params: {
        projectId: string;
        version: string;
        language: string;
        ns: string;
      },
    ) => string;
    pullUrl: (
      params: {
        projectId: string;
        version: string;
        language: string;
        ns: string;
        query: string;
      },
    ) => string;
    updateUrl: (
      params: {
        projectId: string;
        version: string;
        referenceLanguage: string;
        ns: string;
      },
    ) => string;
    version: string;
  }
  export interface PullQueryParams {
    '!tags'?: string[];
    tags?: string[];
    updatedAt?: {
      value: Date;
      operator: '>' | '<';
    };
    lastUsed?: {
      value: Date;
      operator: '>' | '<';
    };
  }
  export namespace PullQueryParams {
    export function parse(params: PullNamespaceParams) {
      const query: LocizeClient.PullQueryParams = {};
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

    export function serialize(params: LocizeClient.PullQueryParams) {
      const queryParams: string[] = [];
      if (params.lastUsed !== undefined) {
        queryParams.push(
          `lastUsed=${
            params.lastUsed.operator
          }${params.lastUsed.value.getTime()}`,
        );
      }
      if (params.updatedAt !== undefined) {
        queryParams.push(
          `updatedAt=${
            params.updatedAt.operator
          }${params.updatedAt.value.getTime()}`,
        );
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
  }
  export namespace Dto {
    export interface Translated {
      latest: number;
    }

    export interface Language {
      name: string;
      nativeName: string;
      isReferenceLanguage: boolean;
      translated: Translated;
    }

    export interface Languages {
      [key: string]: Language;
    }
  }
}
