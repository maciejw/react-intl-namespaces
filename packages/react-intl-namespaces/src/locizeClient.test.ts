import 'whatwg-fetch';
import { LocizeClient } from './locizeClient';

describe('Backend', () => {
  it('should get languages', async () => {
    const fetchMock = jest.fn();
    fetchMock.mockReturnValue(
      new Response(JSON.stringify(['pl', 'en']), { status: 200 }),
    );
    const backend = new LocizeClient(
      { fetch: fetchMock },
      { apiKey: 'apikey', projectId: 'projectid', lng: 'en' },
    );
    const result = await backend.getLanguages();

    expect(result).toEqual(['pl', 'en']);
    expect(fetchMock).toBeCalledWith(
      'https://api.locize.io/languages/projectid',
      {
        headers: {
          map: {
            accept: 'application/json',
            authorization: 'Bearer apikey',
            'content-type': 'application/json',
          },
        },
        method: 'GET',
      },
    );
  });

  it('should get namespace', async () => {
    const fetchMock = jest.fn();
    fetchMock.mockReturnValue(
      new Response(JSON.stringify({ res1: 'val' }), { status: 200 }),
    );
    const backend = new LocizeClient(
      { fetch: fetchMock },
      { apiKey: 'apikey', projectId: 'projectid', lng: 'en' },
    );

    const result = await backend.getNamespace('ns1');

    expect(result).toEqual({ res1: 'val' });
    expect(fetchMock).toBeCalledWith(
      'https://api.locize.io/projectid/latest/en/ns1',
      {
        headers: {
          map: {
            accept: 'application/json',
            authorization: 'Bearer apikey',
            'content-type': 'application/json',
          },
        },
        method: 'GET',
      },
    );
  });

  it('should add missing', async () => {
    const fetchMock = jest.fn();
    fetchMock.mockReturnValue(new Response(undefined, { status: 200 }));
    const backend = new LocizeClient(
      { fetch: fetchMock },
      { apiKey: 'apikey', projectId: 'projectid', lng: 'en' },
    );

    await backend.addMissing('ns1', { res1: 'val' });

    expect(fetchMock).toBeCalledWith(
      'https://api.locize.io/missing/projectid/latest/en/ns1',
      {
        body: '{"res1":"val"}',
        headers: {
          map: {
            accept: 'application/json',
            authorization: 'Bearer apikey',
            'content-type': 'application/json',
          },
        },
        method: 'POST',
      },
    );
  });
  it('should update modified', async () => {
    const fetchMock = jest.fn();
    fetchMock.mockReturnValue(new Response(undefined, { status: 200 }));
    const backend = new LocizeClient(
      { fetch: fetchMock },
      { apiKey: 'apikey', projectId: 'projectid', lng: 'en' },
    );

    await backend.updateModified('ns1', { res1: 'val' });

    expect(fetchMock).toBeCalledWith(
      'https://api.locize.io/update/projectid/latest/en/ns1',
      {
        body: '{"res1":"val"}',
        headers: {
          map: {
            accept: 'application/json',
            authorization: 'Bearer apikey',
            'content-type': 'application/json',
          },
        },
        method: 'POST',
      },
    );
  });

  it('should replace', async () => {
    const fetchMock = jest.fn();
    fetchMock.mockReturnValue(new Response(undefined, { status: 200 }));
    const backend = new LocizeClient(
      { fetch: fetchMock },
      { apiKey: 'apikey', projectId: 'projectid', lng: 'en' },
    );

    await backend.updateModified('ns1', { res1: 'val' }, true);

    expect(fetchMock).toBeCalledWith(
      'https://api.locize.io/update/projectid/latest/en/ns1?replace=true',
      {
        body: '{"res1":"val"}',
        headers: {
          map: {
            accept: 'application/json',
            authorization: 'Bearer apikey',
            'content-type': 'application/json',
          },
        },
        method: 'POST',
      },
    );
  });
});
