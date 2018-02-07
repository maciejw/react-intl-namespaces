declare module "react-intl-namespaces-locize-client/src/locizeClient" {
    import { NamespaceResource, ResourceServer } from "react-intl-namespaces/contracts";
    export class LocizeClient implements ResourceServer {
        private options;
        private globalFetch;
        constructor(globalFetch: GlobalFetch, options: Partial<LocizeClient.ApiUrls> & LocizeClient.RequiredOptions);
        getLanguages(): Promise<string[]>;
        getNamespace(ns: string): Promise<NamespaceResource>;
        addMissing(ns: string, missingResources: NamespaceResource): Promise<void>;
        updateModified(ns: string, modifiedResources: NamespaceResource, replace?: boolean): Promise<void>;
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
                referenceLanguage: string;
                ns: string;
            }) => string;
            updateUrl: (params: {
                projectId: string;
                version: string;
                referenceLanguage: string;
                ns: string;
            }) => string;
            version: string;
        }
    }
}
declare module "react-intl-namespaces-locize-client/index" {
    export { LocizeClient } from "react-intl-namespaces-locize-client/src/locizeClient";
}
