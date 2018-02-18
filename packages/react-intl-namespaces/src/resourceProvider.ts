import { Cancelable, delay, timer } from './delay';
import { createLogger } from './logger';
import { IntlNamespaces } from './namespaces';
import {
  MessageMetadata,
  MessageMetadataToNamespaceResourceReducer,
  NamespaceResource,
  ResourceFromNamespace,
  ResourceServer,
} from './types';

const logger = createLogger('ResourceProvider');

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
  potentiallyMissingResources: NamespaceResource,
) {
  return getFilteredResources(
    originalResources,
    potentiallyMissingResources,
    (k, keys) => !keys.includes(k),
  );
}

export function getModifiedResources(
  originalResources: NamespaceResource,
  potentiallyModifiedResources: NamespaceResource,
) {
  return getFilteredResources(
    originalResources,
    potentiallyModifiedResources,
    (k, keys) =>
      keys.includes(k) &&
      originalResources[k] !== potentiallyModifiedResources[k],
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
  loadNotifications: Array<
    (resourceFromNamespace: ResourceFromNamespace) => void
  >;
  namespaceResource: NamespaceResource | 'empty';
  updatedAt: Date;
}

/**
 * Class responsible for coordination of download namespace requests and messages. It checks if resource is missing and updates a server ResourceServer.
 * It tracks what namespaces were downloaded and notifies namespace provider if selected language changes or new resource is translated of a server.
 */
export class ResourceProvider {
  private scheduleDownloadDelay: Cancelable & Promise<void> | undefined;
  private schedulePullingTimer: Cancelable & Promise<void> | undefined;
  private namespaces: Map<string, NamespacesMapValue>;
  private messages: Map<string, MessageMetadata[]>;

  private server: ResourceServer;
  /**
   * @param server resource server that connects to resource server API
   * @param getDownloadDelay function that returns amount of time that ResourceProvider waits after last requestNamespace to contact backed server, by default 100ms
   * @param getCurrentTime function that returns current time, by default new Date()
   */
  constructor(
    server: ResourceServer,
    private getDownloadDelay = () => 100,
    private getCurrentTime = () => new Date(),
  ) {
    this.server = server;
    this.namespaces = new Map();
    this.messages = new Map();
  }
  /**
   * pulls changes from all namespaces since last download
   * @param language selected language to refresh
   */
  public async refresh(language: string) {
    const namespaces = Array.from(this.namespaces.keys());

    logger.debug('refreshing language', language, 'with', namespaces);

    await this.pull(namespaces, language);
  }
  /**
   * requests namespace download from server
   * @param notification callback used to notify when download is finished
   * @param namespaces list od namespaces to download, notification will be called for each one
   */
  public requestNamespace(
    notification: (resourceFromNamespace: ResourceFromNamespace) => void,
    // tslint:disable-next-line:trailing-comma
    ...namespaces: string[]
  ) {
    let scheduleDownload = false;

    for (const namespace of namespaces) {
      logger.debug('requesting namespace', namespace);

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
      logger.debug('rescheduling download');

      this.cancelDownload();
      this.scheduleDownload();
    }
  }
  /**
   * registers that message will be used by application
   * @param message message that will be used to fill reference language resource definition on a sever
   */
  public requestMessage(message: MessageMetadata) {
    const { namespace } = message;
    const messages = this.messages.get(namespace) || [];

    logger.debug('requesting message', message);

    messages.push(message);
    if (!this.messages.has(namespace)) {
      this.messages.set(namespace, messages);
    }
  }
  /**
   * requests download of all registered namespaces in selected language, namespaces will be notified after each namespace download is finished
   * @param language language to be downloaded from server
   */
  public async changeLanguage(language: string) {
    const requestedResourceNamespaces = Array.from(this.namespaces.keys()).map(
      async namespace => {
        const resource = await this.server.getNamespaceForLanguage(
          namespace,
          language,
        );
        return { namespace, resource };
      },
    );
    logger.debug('changing language to', language);

    await this.loadAndNotify(requestedResourceNamespaces);
  }
  private cancelDownload() {
    if (this.scheduleDownloadDelay) {
      this.scheduleDownloadDelay.cancel();
      this.scheduleDownloadDelay = undefined;
    }
  }

  private async pull(namespaces: string[], language: string) {
    const requestedResourceNamespaces = namespaces.map(async namespace => {
      let updatedAt: Date | undefined;
      const ns = this.namespaces.get(namespace);
      if (ns) {
        updatedAt = ns.updatedAt;
      }

      const resource = await this.server.pullNamespace(namespace, language, {
        updatedAfter: updatedAt,
      });
      return { namespace, resource };
    });

    const resourceNamespaces = await this.loadAndNotify(
      requestedResourceNamespaces,
    );
  }
  private async scheduleDownload() {
    const namespaces = Array.from(this.namespaces.keys());
    this.scheduleDownloadDelay = delay(this.getDownloadDelay());
    await this.scheduleDownloadDelay;
    await this.download(namespaces);
  }
  private async download(namespaces: string[]) {
    const requestedResourceNamespaces = namespaces.map(async namespace => {
      const resource = await this.server.getNamespace(namespace);
      return { namespace, resource };
    });

    const resourceNamespaces = await this.loadAndNotify(
      requestedResourceNamespaces,
    );

    const missingOrModifiedQueue = resourceNamespaces.map(i =>
      this.checkForMissingOrModified(i),
    );

    this.scheduleUpdate(missingOrModifiedQueue);
  }
  private async loadAndNotify(
    requestedResourceNamespaces: Array<Promise<ResourceFromNamespace>>,
  ) {
    const resourceNamespaces = await Promise.all(requestedResourceNamespaces);

    return resourceNamespaces
      .filter(n => Object.getOwnPropertyNames(n.resource).length > 0)
      .map(({ namespace, resource }) => {
        const value = this.namespaces.get(namespace);
        if (value) {
          value.namespaceResource = resource;
          value.loadNotifications.forEach(notify =>
            notify({ namespace, resource }),
          );
          value.updatedAt = this.getCurrentTime();
        }
        return { namespace, resource };
      });
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
