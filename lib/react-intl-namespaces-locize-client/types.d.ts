declare module "react-intl-namespaces-locize-client/src/locizeClient" {
    import { NamespaceResource, PullNamespaceParams, ResourceServer } from "react-intl-namespaces/contracts";
    export class LocizeClient implements ResourceServer {
        private options;
        private globalFetch;
        constructor(globalFetch: GlobalFetch, options: Partial<LocizeClient.ApiUrls> & LocizeClient.RequiredOptions);
        pullNamespace(ns: string, language: string, params: PullNamespaceParams): Promise<NamespaceResource>;
        getLanguages(): Promise<string[]>;
        getNamespace(ns: string): Promise<NamespaceResource>;
        addMissing(ns: string, missingResources: NamespaceResource): Promise<void>;
        updateModified(ns: string, modifiedResources: NamespaceResource, replace?: boolean): Promise<void>;
        getNamespaceForLanguage(ns: string, language: string): Promise<NamespaceResource>;
        private configureFetch(globalFetch);
    }
    export namespace LocizeClient {
        function getDefaults(): LocizeClient.ApiUrls;
        interface RequiredOptions {
            apiKey: string;
            referenceLanguage: string;
            projectId: string;
        }
        interface ApiUrls {
            languagesUrl: (params: {
                projectId: string;
            }) => string;
            missingUrl: (params: {
                projectId: string;
                version: string;
                referenceLanguage: string;
                ns: string;
            }) => string;
            namespaceUrl: (params: {
                projectId: string;
                version: string;
                language: string;
                ns: string;
            }) => string;
            pullUrl: (params: {
                projectId: string;
                version: string;
                language: string;
                ns: string;
                query: string;
            }) => string;
            updateUrl: (params: {
                projectId: string;
                version: string;
                referenceLanguage: string;
                ns: string;
            }) => string;
            version: string;
        }
        interface PullQueryParams {
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
        namespace PullQueryParams {
            function parse(params: PullNamespaceParams): PullQueryParams;
            function serialize(params: LocizeClient.PullQueryParams): string;
        }
        namespace Dto {
            interface Translated {
                latest: number;
            }
            interface Language {
                name: string;
                nativeName: string;
                isReferenceLanguage: boolean;
                translated: Translated;
            }
            interface Languages {
                [key: string]: Language;
            }
        }
    }
}
declare module "react-intl-namespaces-locize-client/index" {
    export { LocizeClient } from "react-intl-namespaces-locize-client/src/locizeClient";
}
