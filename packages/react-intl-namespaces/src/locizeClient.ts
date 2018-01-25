import { NamespaceResource, ResourceServer } from './namespaceTypes';

export class LocizeClient implements ResourceServer {
  private options: LocizeClient.ApiUrls & LocizeClient.RequiredOptions;
  private globalFetch: GlobalFetch;
  constructor(
    globalFetch: GlobalFetch,
    options: Partial<LocizeClient.ApiUrls> & LocizeClient.RequiredOptions,
  ) {
    this.globalFetch = this.configureFetch(globalFetch);
    this.options = {
      ...options,
      ...LocizeClient.getDefaults(),
    };
  }

  public async getLanguages(): Promise<string[]> {
    const response = await this.globalFetch.fetch(
      this.options.languagesUrl(this.options),
      {
        method: 'GET',
      },
    );
    return await response.json();
  }
  public async getNamespace(ns: string): Promise<NamespaceResource> {
    const params = { ...this.options, ns };
    const response = await this.globalFetch.fetch(
      this.options.namespaceUrl(params),
      {
        method: 'GET',
      },
    );
    return await response.json();
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

  private configureFetch(globalFetch: GlobalFetch): GlobalFetch {
    const fetch = async (input: RequestInfo, init: RequestInit = {}) => {
      const { headers, ...rest } = init;

      const defaults: RequestInit = {};
      defaults.headers = new Headers(headers);
      defaults.headers.append('Authorization', `Bearer ${this.options.apiKey}`);
      defaults.headers.append('Accept', `application/json`);
      defaults.headers.append('Content-Type', `application/json`);
      const response = await globalFetch.fetch(input, { ...defaults, ...rest });

      return response;
    };
    return { fetch };
  }
}

export namespace LocizeClient {
  export function getDefaults(): LocizeClient.ApiUrls {
    return {
      languagesUrl: ({ projectId }) =>
        `https://api.locize.io/languages/${projectId}`,
      missingUrl: ({ projectId, version, lng, ns }) =>
        `https://api.locize.io/missing/${projectId}/${version}/${lng}/${ns}`,
      namespaceUrl: ({ projectId, version, lng, ns }) =>
        `https://api.locize.io/${projectId}/${version}/${lng}/${ns}`,
      updateUrl: ({ projectId, version, lng, ns }) =>
        `https://api.locize.io/update/${projectId}/${version}/${lng}/${ns}`,
      version: 'latest',
    };
  }
  export interface RequiredOptions {
    apiKey: string;
    lng: string;
    projectId: string;
  }
  export interface ApiUrls {
    languagesUrl: (params: { projectId: string }) => string;
    missingUrl: (
      params: {
        projectId: string;
        version: string;
        lng: string;
        ns: string;
      },
    ) => string;
    namespaceUrl: (
      params: {
        projectId: string;
        version: string;
        lng: string;
        ns: string;
      },
    ) => string;
    updateUrl: (
      params: {
        projectId: string;
        version: string;
        lng: string;
        ns: string;
      },
    ) => string;
    version: string;
  }
}
