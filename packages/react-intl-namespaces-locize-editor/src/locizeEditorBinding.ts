import { appendIframe, initUI } from './ui';
import {
  getClickedElement,
  getDomPath,
  getElementNamespace,
  getQueryVariable,
  removeNamespace,
} from './utils';

const defaults: LocizeEditorBinding.EditorOptions = {
  autoOpen: true,
  bodyStyle: 'margin-right: 705px;',
  enableByQS: 'locize',
  enabled: false,
  iframeContainerStyle:
    'z-index: 2000; position: fixed; top: 0; right: 0; bottom: 0;' +
    'width: 700px; box-shadow: -3px 0 5px 0 rgba(0,0,0,0.5);',
  iframeStyle: 'height: 100%; width: 700px; border: none;',
  lngOverrideQS: 'useLng',
  mode: 'iframe',
  toggleKeyCode: 24,
  toggleKeyModifier: 'ctrlKey',
  url: 'https://www.locize.io',
};
export class LocizeEditorBinding {
  public enabled: boolean = false;
  public options: LocizeEditorBinding.EditorOptions &
    LocizeEditorBinding.BackendOptions;

  public toggleUI?: (on: boolean) => void;
  public locizeInstance: Window | null = null;
  constructor({
    url = defaults.url,
    enabled = defaults.enabled,
    enableByQS = defaults.enableByQS,
    toggleKeyCode = defaults.toggleKeyCode,
    toggleKeyModifier = defaults.toggleKeyModifier,
    lngOverrideQS = defaults.lngOverrideQS,
    autoOpen = defaults.autoOpen,
    mode = defaults.mode,
    iframeContainerStyle = defaults.iframeContainerStyle,
    iframeStyle = defaults.iframeStyle,
    bodyStyle = defaults.bodyStyle,
    backend,
  }: Partial<
    LocizeEditorBinding.EditorOptions & LocizeEditorBinding.BackendOptions
  > = {}) {
    if (backend === undefined) {
      throw new Error(`Missing backend options`);
    }

    this.options = {
      autoOpen,
      backend,
      bodyStyle,
      enableByQS,
      enabled,
      iframeContainerStyle,
      iframeStyle,
      lngOverrideQS,
      mode,
      toggleKeyCode,
      toggleKeyModifier,
      url,
    };

    this.handler = this.handler.bind(this);

    if (
      this.options.enabled ||
      (this.options.enableByQS &&
        getQueryVariable(this.options.enableByQS) === 'true')
    ) {
      setTimeout(() => {
        this.toggleUI = initUI(() => this.on(), () => this.off());
        if (this.options.autoOpen) {
          this.open();
        }
        this.on();
      }, 500);
    }
  }

  public handler(e: MouseEvent) {
    e.preventDefault();

    const el = getClickedElement(e);
    if (!el) {
      return;
    }
    const send = () => {
      window.addEventListener('message', ev => {
        if (ev.data.message === 'searchForKey') {
          console.log(ev.data);
        }
      });

      const { ns, key, defaultMessage, description } = el.dataset;

      if (ns && key) {
        const payload: LocizeEditorBinding.SearchMessage = {
          defaultMessage,
          description,
          lng: getQueryVariable(this.options.lngOverrideQS) || 'en',
          message: 'searchForKey',
          ns,
          projectId: this.options.backend.projectId,
          token: key,
          version: this.options.backend.version || 'latest',
        };

        if (this.locizeInstance != null) {
          this.locizeInstance.postMessage(payload, this.options.url);
          this.locizeInstance.focus();
        }
      } else {
        console.warn('Missing ns and token in clicked element', getDomPath(el));
      }
    };

    // assert the locizeInstance is still open
    if (
      this.options.autoOpen &&
      (this.options.mode !== 'iframe' &&
        this.locizeInstance &&
        this.locizeInstance.closed)
    ) {
      this.open();
      setTimeout(() => {
        send();
      }, 3000);
    } else {
      send();
    }
    document.addEventListener('keypress', ev => {
      if (
        ev[this.options.toggleKeyModifier] &&
        ev.which === this.options.toggleKeyCode
      ) {
        this.enabled ? this.off() : this.on();
      }
    });

    // listen to key press on locize service to disable
    window.addEventListener('message', ev => {
      if (
        ev.data[this.options.toggleKeyModifier] &&
        ev.data.which === this.options.toggleKeyCode
      ) {
        this.enabled ? this.off() : this.on();
      }
    });
  }

  public open() {
    if (this.options.mode === 'iframe') {
      this.locizeInstance = appendIframe(this.options.url, this.options);
      return;
    }
    this.locizeInstance = window.open(this.options.url);
  }

  public on() {
    this.enabled = true;
    document.body.addEventListener('click', this.handler);
    if (this.toggleUI) {
      this.toggleUI(this.enabled);
    }
  }

  public off() {
    this.enabled = false;
    document.body.removeEventListener('click', this.handler);
    if (this.toggleUI) {
      this.toggleUI(this.enabled);
    }
  }
}

export namespace LocizeEditorBinding {
  export type LocizeMode = 'window' | 'iframe';
  function isLocizeMode(p: string): p is LocizeMode {
    return p === 'window' || p === 'iframe';
  }

  export interface SearchMessage {
    message: 'searchForKey';
    projectId: string;
    version: string;
    lng: string;
    ns: string;
    token: string;
    defaultMessage?: string;
    description?: string;
  }
  export interface BackendOptions {
    backend: {
      projectId: string;
      apiKey: string;
      version?: string;
      referenceLng: string;
    };
  }
  export interface ApplicationOptions {
    language: string;
  }
  export interface EditorOptions {
    url: string;
    enabled: boolean;
    enableByQS: string;
    toggleKeyCode: number;
    toggleKeyModifier: 'ctrlKey' | 'altKey' | 'shiftKey';
    lngOverrideQS: string;
    autoOpen: boolean;
    mode: 'window' | 'iframe';
    iframeContainerStyle: string;
    iframeStyle: string;
    bodyStyle: string;
    handler?: (m: SearchMessage) => void;
  }

  export function getMode(): LocizeMode | false {
    const result = getQueryVariable('locizeMode');
    if (result && isLocizeMode(result)) {
      return result;
    }
    return false;
  }
}
