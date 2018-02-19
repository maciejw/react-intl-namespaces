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
  { key: 'message-j1', defaultMessage: 'j1', namespace: 'd' },
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
  {
    namespace: 'd',
    resource: {},
  },
];

const getNamespaceMaxTimeout = 1;
async function getNamespace(namespace: string) {
  const seed: NamespaceResource = {};
  const timeout = getNamespaceMaxTimeout;

  await delay(timeout);

  return messages1
    .filter(m => m.namespace === namespace)
    .reduce(reduceMessageMetadataToNamespaceResource, seed);
}

async function getNamespaceForLanguage(namespace: string, language: string) {
  const seed: NamespaceResource = {};
  const timeout = getNamespaceMaxTimeout;

  await delay(timeout);

  return messages1
    .filter(m => m.namespace === namespace)
    .map(r => {
      const { defaultMessage, ...rest } = r;
      return { ...rest, defaultMessage: `${defaultMessage} - ${language}` };
    })
    .reduce(reduceMessageMetadataToNamespaceResource, seed);
}

async function getPullNamespace(
  namespace: string,
  language: string,
  params: {},
) {
  const seed: NamespaceResource = {};
  const timeout = getNamespaceMaxTimeout;

  await delay(timeout);

  return messages1
    .filter(m => m.namespace === namespace)
    .map(r => {
      const { defaultMessage, ...rest } = r;
      return {
        ...rest,
        defaultMessage: `${defaultMessage} - ${language} - ${JSON.stringify(
          params,
        )}`,
      };
    })
    .reduce(reduceMessageMetadataToNamespaceResource, seed);
}

const ResourceServerMock = jest.fn<ResourceServer>(() => ({
  addMissing: jest.fn(),
  getLanguages: jest.fn(),
  getNamespace: jest.fn(getNamespace),
  getNamespaceForLanguage: jest.fn(getNamespaceForLanguage),
  pullNamespace: jest.fn(getPullNamespace),
  updateModified: jest.fn(),
}));

describe('Namespace synchronizer', () => {
  it('should categorize resources to missing or modified', async done => {
    const resourceServer = new ResourceServerMock();

    const namespaceProvider = new ResourceProvider(resourceServer, () => 10);

    const namespaces = ['a', 'b', 'c', 'd'];

    function filterNamespaceFactory(n: string) {
      return function filterNamespace(r: { namespace: string }) {
        return r.namespace === n;
      };
    }

    await Promise.all(
      namespaces.map(async namespace => {
        await delay();
        namespaceProvider.requestNamespace(nr => {
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
        namespaceProvider.requestMessage(m);
      }),
    );

    const namespaceCount = namespaces.length;
    await delay(
      getNamespaceMaxTimeout * namespaceCount +
        publishTimeout * messages2.length +
        publishTimeout * namespaceCount,
    );

    expect.assertions(5);

    expect(resourceServer).toMatchSnapshot();

    done();
  });

  it('should change language without request namespaces', async () => {
    const resourceServer = new ResourceServerMock();

    const namespaceProvider = new ResourceProvider(resourceServer);

    await namespaceProvider.changeLanguage('pl');

    expect(resourceServer).toMatchSnapshot();
  });

  it('should change language after request namespaces', async () => {
    const resourceServer = new ResourceServerMock();

    const namespaceProvider = new ResourceProvider(resourceServer, () => 5);

    const notification = jest.fn();

    namespaceProvider.requestNamespace(notification, 'a');

    await delay(5);

    await namespaceProvider.changeLanguage('pl');

    await delay(5);

    expect(resourceServer).toMatchSnapshot();

    expect(notification).toMatchSnapshot();
  });
  it('should refresh namespaces', async () => {
    const resourceServer = new ResourceServerMock();

    const namespaceProvider = new ResourceProvider(
      resourceServer,
      () => 5,
      () => new Date('2000-01-01'),
    );

    const notification = jest.fn();

    namespaceProvider.requestNamespace(notification, 'a');

    await delay(5);

    await namespaceProvider.refresh('pl');

    await delay(5);

    expect(resourceServer).toMatchSnapshot();

    expect(notification).toMatchSnapshot();
  });
});
