import * as utils from './utils';

function getDefaults(): Backend.OptionsWithDefaults {
  return {
    addPath:
      'https://api.locize.io/missing/${projectId}/${version}/${lng}/${ns}',
    crossDomain: true,
    getLanguagesPath: 'https://api.locize.io/languages/${projectId}',
    loadPath: 'https://api.locize.io/${projectId}/${version}/${lng}/${ns}',
    referenceLng: 'en',
    setContentTypeJSON: false,
    updatePath:
      'https://api.locize.io/update/${projectId}/${version}/${lng}/${ns}',
    version: 'latest',
  };
}

export function interpolate(
  templateString: string,
  context: { [key: string]: any } = {},
) {
  const keys = Object.keys(context);
  const values = keys.map(k => context[k]);
  const template = new Function(...keys, `return \`${templateString}\`;`);
  return template(...values);
}

export class Backend {
  private queuedWrites = {};
  private options: Backend.OptionsWithDefaults & Backend.RequiredOptions;
  private debouncedWrite: (lng: string, namespace: string) => Promise<void>;
  constructor(
    options: Partial<Backend.OptionsWithDefaults> & Backend.RequiredOptions,
  ) {
    this.init(options);
  }

  public create = (
    language: string = this.options.referenceLng,
    namespace: string,
    key: string,
    fallbackValue: string = '',
  ) => {
    if (language === this.options.referenceLng) {
      this.queue(this.options.referenceLng, namespace, key, fallbackValue);
    }
    // tslint:disable-next-line:semicolon
  };
  public read = async (
    language: string = this.options.referenceLng,
    namespace: string,
  ) => {
    const url = interpolate(this.options.loadPath, {
      lng: language,
      ns: namespace,
      projectId: this.options.projectId,
      version: this.options.version,
    });

    const result = await this.loadUrl<{ [key: string]: string }>(url);

    switch (result) {
      case 'retry':
        console.log('retry');
        break;
      case 'no-retry':
        console.log('no-retry');
        break;
      default:
        return result;
    }
    // tslint:disable-next-line:semicolon
  };
  private fetch(input: RequestInfo, init: RequestInit = {}) {
    const { headers, ...rest } = init;

    const defaults: RequestInit = {};
    defaults.headers = new Headers(headers);
    defaults.headers.append('Authorization', `Bearer ${this.options.apiKey}`);
    defaults.headers.append('Accept', `application/json`);
    defaults.headers.append('Content-Type', `application/json`);

    return fetch(input, { ...defaults, ...rest });
  }
  private init(options = {}) {
    this.debouncedWrite = utils.debounce(this.write, 1000);
    this.options = { ...getDefaults(), ...this.options, ...options };
  }

  // private async getLanguages() {
  //   const url = interpolate(this.options.getLanguagesPath, {
  //     projectId: this.options.projectId,
  //   });

  //   return await this.loadUrl(url);
  // }

  private loadUrl = async <T>(
    url: string,
  ): Promise<T | 'retry' | 'no-retry'> => {
    const response = await this.fetch(url);

    if (response.status >= 500 && response.status < 600) {
      console.error('failed loading', url);
      return 'retry';
    }
    if (response.status >= 400 && response.status < 500) {
      console.log('failed loading', url);
      return 'no-retry';
    }

    try {
      return (await response.json()) as T;
    } catch (e) {
      console.log('failed parsing ' + url + ' to json');
      return 'no-retry';
    }
    // tslint:disable-next-line:semicolon
  };

  private update(
    languages: string | string[],
    namespace: string,
    key: string,
    fallbackValue: string,
    options: any = {},
  ) {
    if (typeof languages === 'string') {
      languages = [languages];
    }

    // mark as update
    options.isUpdate = true;

    languages.forEach(lng => {
      if (lng === this.options.referenceLng) {
        this.queue(
          this.options.referenceLng,
          namespace,
          key,
          fallbackValue,
          options,
        );
      }
    });
  }

  private write = async (lng: string, namespace: string) => {
    const lock = utils.getPath(this.queuedWrites, ['locks', lng, namespace]);
    if (lock) {
      return;
    }

    const missingUrl = interpolate(this.options.addPath, {
      lng,
      ns: namespace,
      projectId: this.options.projectId,
      version: this.options.version,
    });
    const updatesUrl = interpolate(this.options.updatePath, {
      lng,
      ns: namespace,
      projectId: this.options.projectId,
      version: this.options.version,
    });

    const missings = utils.getPath(this.queuedWrites, [lng, namespace]);
    utils.setPath(this.queuedWrites, [lng, namespace], []);

    if (missings.length) {
      // lock
      utils.setPath(this.queuedWrites, ['locks', lng, namespace], true);

      let hasMissing = false;
      let hasUpdates = false;
      const payloadMissing: { [k: string]: any } = {};
      const payloadUpdate: { [k: string]: any } = {};

      missings.forEach((item: any) => {
        if (item.options && item.options.isUpdate) {
          if (!hasUpdates) {
            hasUpdates = true;
          }
          payloadUpdate[item.key] = item.fallbackValue || '';
        } else {
          if (!hasMissing) {
            hasMissing = true;
          }
          payloadMissing[item.key] = item.fallbackValue || '';
        }
      });

      let todo = 0;
      if (hasMissing) {
        todo++;
      }
      if (hasUpdates) {
        todo++;
      }
      const doneOne = () => {
        todo--;

        if (!todo) {
          // unlock
          utils.setPath(this.queuedWrites, ['locks', lng, namespace], false);

          missings.forEach((missing: any) => {
            if (missing.callback) {
              missing.callback();
            }
          });

          // rerun
          this.debouncedWrite(lng, namespace);
        }
      };

      if (!todo) {
        doneOne();
      }

      if (hasMissing) {
        const respnose = await this.fetch(
          interpolate(missingUrl, {
            lng,
            ns: namespace,
            projectId: this.options.projectId,
            version: this.options.version,
          }),
          {
            body: JSON.stringify(payloadMissing),
            method: 'POST',
          },
        );
        doneOne();
      }

      if (hasUpdates) {
        const respnose = await this.fetch(
          interpolate(updatesUrl, {
            lng,
            ns: namespace,
            projectId: this.options.projectId,
            version: this.options.version,
          }),
          {
            body: payloadUpdate,
            method: 'POST',
          },
        );
        doneOne();
      }
    }
    // tslint:disable-next-line:semicolon
  };

  private queue(
    lng: string,
    namespace: string,
    key: string,
    fallbackValue: string,
    options: any = {},
  ) {
    utils.pushPath(this.queuedWrites, [lng, namespace], {
      fallbackValue: fallbackValue || '',
      key,
      options,
    });

    this.debouncedWrite(lng, namespace);
  }
}

namespace Backend {
  export interface RequiredOptions {
    apiKey: string;
    projectId: string;
  }
  export interface OptionsWithDefaults {
    addPath: string;
    crossDomain: boolean;
    getLanguagesPath: string;
    loadPath: string;
    referenceLng: string;
    setContentTypeJSON: boolean;
    updatePath: string;
    version: string;
  }
}
