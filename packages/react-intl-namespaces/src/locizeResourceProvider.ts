import * as Rx from '@reactivex/rxjs';

import { LocizeClient } from './locizeClient';
import { getMissingOrModifiedResources } from './namespaceSync';
import {
  MessageMetadata,
  NamespaceResource,
  ResourceFromNamespace,
  ResourceServer,
} from './namespaceTypes';

type Unsubscribe = () => void;

function hasKeys(obj: {}) {
  return Object.getOwnPropertyNames(obj).length > 0;
}

export class ResourceProvider {
  private subscription: Rx.Subscription;
  private missingMessages: Rx.Subject<MessageMetadata>;
  private namespaceRequests: Rx.Subject<string>;
  private namespaceResponses: Rx.Subject<ResourceFromNamespace>;
  private resourceServer: ResourceServer;

  constructor(resourceServer: ResourceServer) {
    this.resourceServer = resourceServer;
    this.missingMessages = new Rx.Subject<MessageMetadata>();
    this.namespaceRequests = new Rx.Subject<string>();
    this.namespaceResponses = new Rx.Subject<ResourceFromNamespace>();

    const missingOrModifiedResources = getMissingOrModifiedResources(
      namespace => this.getNamespace(namespace),
      this.missingMessages,
      this.namespaceRequests,
    );

    this.subscription = missingOrModifiedResources.subscribe(
      ({ missing, modified, namespace }) => {
        if (hasKeys(missing)) {
          this.resourceServer.addMissing(namespace, missing);
        }
        if (hasKeys(modified)) {
          this.resourceServer.updateModified(namespace, modified);
        }
      },
    );
  }
  public requestNamespace(namespace: string) {
    this.namespaceRequests.next(namespace);
  }
  public registerMissingOrModified(message: MessageMetadata) {
    this.missingMessages.next(message);
  }
  public getNamespaceDownloadNotification(
    callback: (resourceFormNamespace: ResourceFromNamespace) => void,
  ): Unsubscribe {
    const subscription = this.namespaceResponses.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  private async getNamespace(namespace: string) {
    const resource = await this.resourceServer.getNamespace(namespace);

    this.namespaceResponses.next({
      namespace,
      resource,
    });
    return resource;
  }
}
