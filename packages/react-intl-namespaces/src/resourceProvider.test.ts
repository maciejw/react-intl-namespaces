import {
  reduceMessageMetadataToNamespaceResource,
  ResourceProvider,
} from './resourceProvider';

import { delay } from './delay';
import {
  MessageMetadata,
  NamespaceResource,
  NamespaceResourceTree,
  ResourceServer,
} from './types';

const messages1: MessageMetadata[] = [
  { key: 'message-a1', defaultMessage: 'a1', namespace: 'a' },
  { key: 'message-b1', defaultMessage: 'b1', namespace: 'b' },
  { key: 'message-c1', defaultMessage: 'c1', namespace: 'a' },
  { key: 'message-d1', defaultMessage: 'd1', namespace: 'c' },
  { key: 'message-f1', defaultMessage: 'f1', namespace: 'b' },
  { key: 'message-g1', defaultMessage: 'g1', namespace: 'b' },
  { key: 'message-h1', defaultMessage: 'h1', namespace: 'c' },
  { key: 'message-i1', defaultMessage: undefined, namespace: 'c' },
];

const messages2: MessageMetadata[] = [
  { key: 'message-a1', defaultMessage: 'a2', namespace: 'a' },
  { key: 'message-b2', defaultMessage: 'b2', namespace: 'b' },
  { key: 'message-c2', defaultMessage: 'c2', namespace: 'a' },
  { key: 'message-d1', defaultMessage: 'd2', namespace: 'c' },
  { key: 'message-f1', defaultMessage: 'f2', namespace: 'b' },
  { key: 'message-g2', defaultMessage: 'g2', namespace: 'b' },
  { key: 'message-h2', defaultMessage: 'h2', namespace: 'c' },
  { key: 'message-i1', defaultMessage: 'i1', namespace: 'c' },
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
    modified: { 'message-d1': 'd2', 'message-i1': '' },
    namespace: 'c',
  },
];
const expectedNamespaces = [
  { namespace: 'a', resource: { 'message-a1': 'a1', 'message-c1': 'c1' } },
  {
    namespace: 'b',
    resource: { 'message-b1': 'b1', 'message-f1': 'f1', 'message-g1': 'g1' },
  },
  {
    namespace: 'c',
    resource: { 'message-d1': 'd1', 'message-h1': 'h1', 'message-i1': '' },
  },
];

const getNamespaceMaxTimeout = 30;
async function getNamespace(namespace: string) {
  const seed: NamespaceResource = {};
  const timeout = Math.floor(Math.random() * getNamespaceMaxTimeout + 1);

  await delay(timeout);

  return messages1
    .filter(m => m.namespace === namespace)
    .reduce(reduceMessageMetadataToNamespaceResource, seed);
}

const ResourceServerMock = jest.fn<ResourceServer>(() => ({
  addMissing: jest.fn(),
  getLanguages: jest.fn(),
  getNamespace: jest.fn(getNamespace),
  updateModified: jest.fn(),
}));

describe('Namespace synchronizer', () => {
  it('should categorize resources to missing or modified', async done => {
    const resourceServer = new ResourceServerMock();

    const namespaceSync = new ResourceProvider(resourceServer);

    const namespaces = ['a', 'b', 'c'];

    function filterNamespaceFactory(n: string) {
      return function filterNamespace(r: { namespace: string }) {
        return r.namespace === n;
      };
    }

    await Promise.all(
      namespaces.map(async namespace => {
        await delay();
        namespaceSync.requestNamespace(nr => {
          expect([nr]).toEqual(
            expectedNamespaces.filter(filterNamespaceFactory(nr.namespace)),
          );
        }, namespace);
      }),
    );

    const publishTimeout = 5;

    await Promise.all(
      messages2.map(async m => {
        await delay(publishTimeout);
        namespaceSync.requestMessage(m);
      }),
    );

    const namespaceCount = namespaces.length;
    await delay(
      getNamespaceMaxTimeout * namespaceCount +
        publishTimeout * messages2.length +
        publishTimeout * namespaceCount,
    );

    expect.assertions(4);

    expect(resourceServer).toMatchSnapshot();

    done();
  });
});
