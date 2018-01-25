export interface GenericObject<T> {
  [key: string]: T;
}
export interface NamespaceResource extends GenericObject<string> {}

export interface ResourceFromNamespace {
  namespace: string;
  resource: NamespaceResource;
}

export interface MessageMetadata {
  key: string;
  defaultMessage?: string;
  namespace: string;
}

export type MessageToNamespaceResourceReducer = (
  acc: NamespaceResource,
  v: MessageMetadata,
) => NamespaceResource;

export interface ResourceServer {
  getLanguages(): Promise<string[]>;
  getNamespace(namespace: string): Promise<NamespaceResource>;
  addMissing(
    namespace: string,
    missingResources: NamespaceResource,
  ): Promise<void>;
  updateModified(
    namespace: string,
    missingResources: NamespaceResource,
  ): Promise<void>;
}
