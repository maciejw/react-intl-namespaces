import { Cancelable, delay } from './delay';
import { InltNamespaces } from './namespaces';
import {
  MessageMetadata,
  MessageMetadataToNamespaceResourceReducer,
  NamespaceResource,
  ResourceFromNamespace,
  ResourceServer,
} from './types';

export const reduceMessageMetadataToNamespaceResource: MessageMetadataToNamespaceResourceReducer = (
  acc,
  message,
) => ({
  ...acc,
  [message.key]: message.defaultMessage || '',
});

export function hasKeys(obj: {}) {
  return Object.getOwnPropertyNames(obj).length > 0;
}

export function getMissingResources(
  originalResources: NamespaceResource,
  potentialyMissingResources: NamespaceResource,
) {
  return getFilteredResources(
    originalResources,
    potentialyMissingResources,
    (k, keys) => !keys.includes(k),
  );
}

export function getModifiedResources(
  originalResources: NamespaceResource,
  potentialyModifiedResources: NamespaceResource,
) {
  return getFilteredResources(
    originalResources,
    potentialyModifiedResources,
    (k, keys) =>
      keys.includes(k) &&
      originalResources[k] !== potentialyModifiedResources[k],
  );
}

function getFilteredResources(
  originalResources: NamespaceResource,
  newResources: NamespaceResource,
  filter: (key: string, keys: string[]) => boolean,
) {
  const originalResourceKeys = Object.getOwnPropertyNames(originalResources);
  const newResourceKeys = Object.getOwnPropertyNames(newResources);

  const seed: NamespaceResource = {};

  return newResourceKeys
    .filter(k => filter(k, originalResourceKeys))
    .reduce((acc, k) => ({ ...acc, [k]: newResources[k] }), seed);
}
interface MissingOrModified {
  missing: NamespaceResource;
  modified: NamespaceResource;
  namespace: string;
}
interface NamespacesMapValue {
  notifications: Array<(resourceFromNamespace: ResourceFromNamespace) => void>;
  namespaceResource: NamespaceResource | 'empty';
}
export class ResourceProvider {
  private scheduleDownloadDelay: Cancelable & Promise<void> | undefined;
  private namespaces: Map<string, NamespacesMapValue>;
  private messages: Map<string, MessageMetadata[]>;

  private server: ResourceServer;
  constructor(server: ResourceServer) {
    this.server = server;
    this.namespaces = new Map();
    this.messages = new Map();
  }

  public requestNamespace(
    notification: (resourceFromNamespace: ResourceFromNamespace) => void,
    // tslint:disable-next-line:trailing-comma
    ...namespaces: string[]
  ) {
    let schedule = false;

    for (const namespace of namespaces) {
      const value = this.namespaces.get(namespace) || {
        namespaceResource: 'empty',
        notifications: [],
      };

      value.notifications.push(notification);

      if (!this.namespaces.has(namespace)) {
        this.namespaces.set(namespace, value);
        schedule = true;
      }
    }
    if (schedule) {
      this.cancelDownload();
      this.scheduleDownload();
    }
  }
  public requestMessage(message: MessageMetadata) {
    const { namespace } = message;
    const messages = this.messages.get(namespace) || [];
    messages.push(message);
    if (!this.messages.has(namespace)) {
      this.messages.set(namespace, messages);
    }
  }

  private cancelDownload() {
    if (this.scheduleDownloadDelay) {
      this.scheduleDownloadDelay.cancel();
      this.scheduleDownloadDelay = undefined;
    }
  }
  private async scheduleDownload() {
    const namespaces = this.namespaces.keys();
    this.scheduleDownloadDelay = delay(100);
    await this.scheduleDownloadDelay;

    await this.download(namespaces);
  }
  private async download(namespaces: Iterable<string>) {
    const requestedResourceNamespaces = Array.from(namespaces).map(
      async namespace => {
        const resource = await this.server.getNamespace(namespace);
        return { namespace, resource };
      },
    );

    const resourceNamespaces = await Promise.all(requestedResourceNamespaces);

    const missingOrModifiedQueue: MissingOrModified[] = [];

    resourceNamespaces.forEach(({ namespace, resource }) => {
      const value = this.namespaces.get(namespace);
      if (value) {
        value.namespaceResource = resource;
        value.notifications.forEach(notify => notify({ namespace, resource }));
        value.notifications = [];
      }
      const missingOrModified = this.checkForMissingOrModified({
        namespace,
        resource,
      });
      missingOrModifiedQueue.push(missingOrModified);
    });
    this.scheduleUpdate(missingOrModifiedQueue);
  }
  private checkForMissingOrModified(
    resourceFromNamespace: ResourceFromNamespace,
  ): MissingOrModified {
    const result = {
      missing: {},
      modified: {},
      namespace: resourceFromNamespace.namespace,
    };
    const value = this.messages.get(resourceFromNamespace.namespace);
    if (value) {
      const seed: NamespaceResource = {};
      const missingOrModifiedResource = value.reduce(
        reduceMessageMetadataToNamespaceResource,
        seed,
      );

      result.missing = getMissingResources(
        resourceFromNamespace.resource,
        missingOrModifiedResource,
      );
      result.modified = getModifiedResources(
        resourceFromNamespace.resource,
        missingOrModifiedResource,
      );
    }
    return result;
  }
  private scheduleUpdate(missingOrModifiedQueue: MissingOrModified[]) {
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
