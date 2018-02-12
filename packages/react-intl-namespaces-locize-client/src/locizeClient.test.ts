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

  it('should pull namespace', async () => {
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

    const result = await backend.pullNamespace('ns1', 'en', {
      includeTags: ['a', 'b'],
    });

    expect(result).toMatchSnapshot();
    expect(fetchMock).toMatchSnapshot();
  });
  describe('pull params parse', () => {
    it('should parse empty tags', () => {
      const result = LocizeClient.PullQueryParams.parse({
        excludeTags: [],
        includeTags: [],
        lastUsedAfter: undefined,
        lastUsedBefore: undefined,
        updatedAfter: undefined,
        updatedBefore: undefined,
      });

      expect(result).toMatchSnapshot();
    });
    it('should parse tags', () => {
      const result = LocizeClient.PullQueryParams.parse({
        excludeTags: ['c'],
        includeTags: ['a', 'b'],
      });

      expect(result).toMatchSnapshot();
    });

    it('should parse dates before', () => {
      const date = new Date('2000-01-01');
      const result = LocizeClient.PullQueryParams.parse({
        lastUsedBefore: date,
        updatedBefore: date,
      });

      expect(result).toMatchSnapshot();
    });
    it('should parse dates after', () => {
      const date = new Date('2000-01-01');
      const result = LocizeClient.PullQueryParams.parse({
        lastUsedAfter: date,
        updatedAfter: date,
      });

      expect(result).toMatchSnapshot();
    });
  });
  describe('pull params serialize', () => {
    it('should serialize empty tags', () => {
      const result = LocizeClient.PullQueryParams.serialize({
        '!tags': [],
        tags: [],
      });

      expect(result).toMatchSnapshot();
    });
    it('should serialize tags', () => {
      const result = LocizeClient.PullQueryParams.serialize({
        '!tags': ['c'],
        tags: ['a', 'b'],
      });

      expect(result).toMatchSnapshot();
    });

    it('should serialize dates before', () => {
      const date = new Date('2000-01-01');
      const result = LocizeClient.PullQueryParams.serialize({
        lastUsed: { value: date, operator: '<' },
        updatedAt: { value: date, operator: '<' },
      });

      expect(result).toMatchSnapshot();
    });
    it('should serialize dates after', () => {
      const date = new Date('2000-01-01');
      const result = LocizeClient.PullQueryParams.serialize({
        lastUsed: { value: date, operator: '>' },
        updatedAt: { value: date, operator: '>' },
      });

      expect(result).toMatchSnapshot();
    });
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
