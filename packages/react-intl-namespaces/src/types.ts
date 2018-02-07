/**
 * https://github.com/gcanti/typelevel-ts/blob/master/src/index.ts#L150
 */

export type StringOmit<L1 extends string, L2 extends string> = ({
  [P in L1]: P
} &
  { [P in L2]: never } & { [key: string]: never })[L1];
/**
 * https://github.com/gcanti/typelevel-ts/blob/master/src/index.ts#L169
 */

export type ObjectOmit<O, K extends string> = Pick<O, StringOmit<keyof O, K>>;

export interface MessageDescriptor<T extends string>
  extends ReactIntl.FormattedMessage.MessageDescriptor {
  id: T;
}

export type Messages<T extends string> = { [P in T]: MessageDescriptor<P> };

export type NamespaceResourceTreeNode = NamespaceResourceTree | string;
export interface NamespaceResourceTree {
  [key: string]: NamespaceResourceTreeNode;
}

export interface MessageMetadata {
  defaultMessage?: string;
  description?: string;
  key: string;
  namespace: string;
}
export interface NamespaceResource {
  [key: string]: string;
}

export interface ResourceFromNamespace {
  namespace: string;
  resource: NamespaceResource;
}
export interface ResourceServer {
  getLanguages(): Promise<string[]>;
  getNamespace(ns: string): Promise<NamespaceResource>;
  addMissing(ns: string, missingResources: NamespaceResource): Promise<void>;
  updateModified(
    ns: string,
    modifiedResources: NamespaceResource,
    replace?: boolean,
  ): Promise<void>;
}

export type MessageMetadataToNamespaceResourceReducer = (
  acc: NamespaceResource,
  message: MessageMetadata,
) => NamespaceResource;
