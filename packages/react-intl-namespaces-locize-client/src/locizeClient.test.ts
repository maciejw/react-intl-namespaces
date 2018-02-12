import { LocizeClient } from './locizeClient';

describe('LocizeClient', () => {
  it('should get languages', async () => {
    const fetchMock = jest.fn();
    fetchMock.mockReturnValue(
      new Response(JSON.stringify({ pl: {}, en: {} }), { status: 200 }),
    );
    const backend = new LocizeClient(
      { fetch: fetchMock },
      { apiKey: 'apikey', projectId: 'projectid', referenceLanguage: 'en' },
    );
    const result = await backend.getLanguages();

    expect(result).toMatchSnapshot();
    expect(fetchMock).toMatchSnapshot();
  });

  it('should get namespace', async () => {
    const fetchMock = jest.fn();

    fetchMock.mockReturnValue(
      new Response(
        JSON.stringify({
          prefix: {
            res1: 'val2',
          },
          res1: 'val1',
        }),
      ),
    );
    const backend = new LocizeClient(
      { fetch: fetchMock },
      { apiKey: 'apikey', projectId: 'projectid', referenceLanguage: 'en' },
    );

    const result = await backend.getNamespace('ns1');

    expect(result).toMatchSnapshot();
    expect(fetchMock).toMatchSnapshot();
  });
  it('should add missing', async () => {
    const fetchMock = jest.fn();
    fetchMock.mockReturnValue(new Response(undefined, { status: 200 }));
    const backend = new LocizeClient(
      { fetch: fetchMock },
      { apiKey: 'apikey', projectId: 'projectid', referenceLanguage: 'en' },
    );

    await backend.addMissing('ns1', { res1: 'val' });

    expect(fetchMock).toMatchSnapshot();
  });
  it('should update modified', async () => {
    const fetchMock = jest.fn();
    fetchMock.mockReturnValue(new Response(undefined, { status: 200 }));
    const backend = new LocizeClient(
      { fetch: fetchMock },
      { apiKey: 'apikey', projectId: 'projectid', referenceLanguage: 'en' },
    );

    await backend.updateModified('ns1', { res1: 'val' });

    expect(fetchMock).toMatchSnapshot();
  });
  it('should replace', async () => {
    const fetchMock = jest.fn();
    fetchMock.mockReturnValue(new Response(undefined, { status: 200 }));
    const backend = new LocizeClient(
      { fetch: fetchMock },
      { apiKey: 'apikey', projectId: 'projectid', referenceLanguage: 'en' },
    );

    await backend.updateModified('ns1', { res1: 'val' }, true);

    expect(fetchMock).toMatchSnapshot();
  });
});
