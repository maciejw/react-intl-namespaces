import * as Rx from '@reactivex/rxjs';
import { setTimeoutAsync } from './setTimeout';

import {
  getMissingOrModifiedResources,
  reduceMessageToNamespaceResource,
} from './namespaceSync';

import { MessageMetadata, NamespaceResource } from './namespaceTypes';

const messages1: MessageMetadata[] = [
  { key: 'message-a1', defaultMessage: 'a1', namespace: 'a' },
  { key: 'message-b1', defaultMessage: 'b1', namespace: 'b' },
  { key: 'message-c1', defaultMessage: 'c1', namespace: 'a' },
  { key: 'message-d1', defaultMessage: 'd1', namespace: 'c' },
  { key: 'message-f1', defaultMessage: 'f1', namespace: 'b' },
  { key: 'message-g1', defaultMessage: 'g1', namespace: 'b' },
  { key: 'message-h1', defaultMessage: 'h1', namespace: 'c' },
];

const messages2: MessageMetadata[] = [
  { key: 'message-a1', defaultMessage: 'a2', namespace: 'a' },
  { key: 'message-b2', defaultMessage: 'b2', namespace: 'b' },
  { key: 'message-c2', defaultMessage: 'c2', namespace: 'a' },
  { key: 'message-d1', defaultMessage: 'd2', namespace: 'c' },
  { key: 'message-f1', defaultMessage: 'f2', namespace: 'b' },
  { key: 'message-g2', defaultMessage: 'g2', namespace: 'b' },
  { key: 'message-h2', defaultMessage: 'h2', namespace: 'c' },
];

const expected = [
  {
    missing: { 'message-c2': 'c2' },
    modified: { 'message-a1': 'a2' },
    namespace: 'a',
  },
  {
    missing: { 'message-b2': 'b2', 'message-g2': 'g2' },
    modified: { 'message-f1': 'f2' },
    namespace: 'b',
  },
  {
    missing: { 'message-h2': 'h2' },
    modified: { 'message-d1': 'd2' },
    namespace: 'c',
  },
];

const getNamespaceMaxTimeout = 30;
async function getNamespace(namespace: string) {
  const seed: NamespaceResource = {};
  const timeout = Math.floor(Math.random() * getNamespaceMaxTimeout + 1);

  await setTimeoutAsync(timeout);

  return messages1
    .filter(m => m.namespace === namespace)
    .reduce(reduceMessageToNamespaceResource, seed);
}

describe('Namespace synchronizer', () => {
  it('should categorize resources to missing or modified', async done => {
    const missingMessagesSubject = new Rx.Subject<MessageMetadata>();
    const namespaceRequestsSubject = new Rx.Subject<string>();

    const missingOrModifiedResources = getMissingOrModifiedResources(
      getNamespace,
      missingMessagesSubject,
      namespaceRequestsSubject,
    );

    missingOrModifiedResources.subscribe(s => {
      const filterNamespace = (n: string) => (r: { namespace: string }) =>
        r.namespace === n;

      expect([s]).toEqual(expected.filter(filterNamespace(s.namespace)));
    });

    const publishTimeout = 5;
    const namespaces = ['a', 'b', 'c'];

    await Promise.all(
      namespaces.map(async m => {
        await setTimeoutAsync(publishTimeout);
        namespaceRequestsSubject.next(m);
      }),
    );

    await Promise.all(
      messages2.map(async m => {
        await setTimeoutAsync(publishTimeout);
        missingMessagesSubject.next(m);
      }),
    );

    const namespaceCount = namespaces.length;
    await setTimeoutAsync(
      getNamespaceMaxTimeout * namespaceCount +
        publishTimeout * messages2.length +
        publishTimeout * namespaceCount,
    );

    expect.assertions(3);

    done();
  });
});
