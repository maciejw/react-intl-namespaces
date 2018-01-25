import * as Rx from '@reactivex/rxjs';
import {
  MessageMetadata,
  MessageToNamespaceResourceReducer,
  NamespaceResource,
} from './namespaceTypes';

export const reduceMessageToNamespaceResource: MessageToNamespaceResourceReducer = (
  acc,
  message,
) => ({
  ...acc,
  [message.key]: message.defaultMessage || '',
});

function getResourcesGroupedInTimeByNamespce(
  subject: Rx.Observable<MessageMetadata>,
) {
  const seed: NamespaceResource = {};
  return groupByInTime(
    subject,
    s => s.namespace,
    reduceMessageToNamespaceResource,
    seed,
    0,
  );
}

function groupByInTime<T, U, TAcc>(
  subject: Rx.Observable<T>,
  groupBy: (t: T) => U,
  reduce: (acc: TAcc, v: T) => TAcc,
  seed: TAcc,
  windowTime = 0,
) {
  const groupedInTime = subject
    .windowTime(windowTime)
    .map(b =>
      b.groupBy(groupBy).map(v => ({
        group: v.key,
        items: v.reduce(reduce, seed),
      })),
    )
    .flatMap(v => v.map(m => m.items.map(i => ({ group: m.group, item: i }))))
    .flatMap(f => f);
  return groupedInTime;
}

function getMissingResources(
  originalResources: NamespaceResource,
  potentialyMissingResources: NamespaceResource,
) {
  return getFilteredResources(
    originalResources,
    potentialyMissingResources,
    (k, keys) => !keys.includes(k),
  );
}

function getModifiedResources(
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

export function getMissingOrModifiedResources(
  getNamespace: (namespace: string) => Promise<NamespaceResource>,
  missingMessagesSubject: Rx.Subject<MessageMetadata>,
  namespaceRequestsSubject: Rx.Subject<string>,
) {
  const missingResources = getResourcesGroupedInTimeByNamespce(
    missingMessagesSubject,
  );

  const namespaces = namespaceRequestsSubject;

  const skipGroup = '[[RX-SKIP-THIS-ITEM]]';

  const modifiedOrMissing = namespaces
    .flatMapTo(missingResources, (namespace, missingResource) => {
      if (namespace === missingResource.group) {
        return missingResource;
      } else {
        return { group: skipGroup, item: {} };
      }
    })
    .filter(f => f.group !== skipGroup)
    .flatMap(
      n =>
        Rx.Observable.fromPromise(getNamespace(n.group)).filter(
          r => r !== undefined,
        ),
      (missingResource, resourceResponse) => ({
        missingResource,
        resourceResponse: {
          group: missingResource.group,
          item: resourceResponse,
        },
      }),
    )
    .map(({ missingResource, resourceResponse }) => {
      if (resourceResponse.group === missingResource.group) {
        return {
          missing: getMissingResources(
            resourceResponse.item,
            missingResource.item,
          ),
          modified: getModifiedResources(
            resourceResponse.item,
            missingResource.item,
          ),
          namespace: resourceResponse.group,
        };
      } else {
        return {
          missing: {},
          modified: {},
          namespace: skipGroup,
        };
      }
    })
    .filter(f => f.namespace !== skipGroup);
  return modifiedOrMissing;
}
