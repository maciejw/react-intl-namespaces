import { ResourceProvider } from './locizeResourceProvider';
import { ResourceServer } from './namespaceTypes';
import { setTimeoutAsync } from './setTimeout';

const ResourceServerMock = jest.fn<ResourceServer>(() => ({
  addMissing: jest.fn(),
  getLanguages: jest.fn(),
  getNamespace: jest.fn().mockReturnValue({ res1: 'value1', res2: 'value2' }),
  updateModified: jest.fn(),
}));

describe('ResourceProvider', () => {
  it('should provide with downloaded namespaces', async done => {
    const mock = new ResourceServerMock();
    const provider = new ResourceProvider(mock);

    provider.requestNamespace('ns');

    provider.registerMissingOrModified({
      defaultMessage: 'value1',
      key: 'res1',
      namespace: 'ns',
    });

    provider.registerMissingOrModified({
      defaultMessage: 'value2',
      key: 'res2',
      namespace: 'ns',
    });

    const unsubscribe = provider.getNamespaceDownloadNotification(
      resourceFromNamespace => {
        expect(resourceFromNamespace).toEqual({
          namespace: 'ns',
          resource: {
            res1: 'value1',
            res2: 'value2',
          },
        });
      },
    );

    await setTimeoutAsync(150);

    expect(mock.getNamespace).toHaveBeenCalledTimes(1);
    expect(mock.getNamespace).toHaveBeenCalledWith('ns');
    expect(mock.addMissing).toHaveBeenCalledTimes(0);
    expect(mock.updateModified).toHaveBeenCalledTimes(0);
    expect(mock.getLanguages).toHaveBeenCalledTimes(0);

    unsubscribe();
    expect.assertions(6);

    done();
  });

  it('should update server when resources changed', async done => {
    const mock = new ResourceServerMock();
    const provider = new ResourceProvider(mock);

    provider.requestNamespace('ns');

    provider.registerMissingOrModified({
      defaultMessage: 'value1-altered',
      key: 'res1',
      namespace: 'ns',
    });

    provider.registerMissingOrModified({
      defaultMessage: 'value3',
      key: 'res3',
      namespace: 'ns',
    });

    await setTimeoutAsync(10);

    expect(mock.addMissing).toHaveBeenCalledTimes(1);
    expect(mock.addMissing).toHaveBeenCalledWith('ns', {
      res3: 'value3',
    });
    expect(mock.updateModified).toHaveBeenCalledTimes(1);
    expect(mock.updateModified).toHaveBeenCalledWith('ns', {
      res1: 'value1-altered',
    });
    expect(mock.getLanguages).toHaveBeenCalledTimes(0);

    expect.assertions(5);

    done();
  });
});
