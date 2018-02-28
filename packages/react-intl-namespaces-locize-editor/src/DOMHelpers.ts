function delay(timeout: number = 0) {
  return new Promise<void>(resolve => {
    window.setTimeout(resolve, timeout);
  });
}

export namespace DOMHelpers {
  export namespace Editor {
    export function toggleClass(
      element: HTMLElement,
      state: boolean,
      cssClass: string,
    ) {
      if (state) {
        element.classList.add(cssClass);
      } else {
        element.classList.remove(cssClass);
      }
    }
    export function createTargetElement(document: Document, id: string) {
      let editor = document.getElementById(id);
      if (editor == null) {
        editor = document.createElement('div');
        editor.id = id;
        document.body.appendChild(editor);
      }
      return editor;
    }
    export function isHtmlElement(element: EventTarget): element is HTMLElement;
    export function isHtmlElement(element: any): element is HTMLElement {
      return element instanceof HTMLElement;
    }

    export function findElementInDOMHierarchy(
      element: Element,
      filter: (htmlElement: HTMLElement) => boolean,
    ) {
      if (isHtmlElement(element)) {
        let e = element;
        while (e !== e.ownerDocument.body) {
          if (filter(e)) {
            return true;
          }
          if (e.parentElement === null) {
            return false;
          }
          e = e.parentElement;
        }
      }
      return false;
    }
    export function ignoreEditorOrTranslatedFilter(e: HTMLElement) {
      return (
        e.dataset.ignoreEditor === 'true' || e.dataset.translated === 'true'
      );
    }
    function isTranslatedOrIgnored(element: Element) {
      return findElementInDOMHierarchy(
        element,
        DOMHelpers.Editor.ignoreEditorOrTranslatedFilter,
      );
    }

    export function locateResourceContext(element: EventTarget) {
      if (isHtmlElement(element)) {
        const resourceContainer = element.parentElement;

        if (!resourceContainer || isTranslatedOrIgnored(resourceContainer)) {
          return false;
        }

        const {
          namespace,
          key,
          defaultMessage,
          description,
        } = resourceContainer.dataset;

        if (namespace && key) {
          return { namespace, key, defaultMessage, description };
        }
      }
      return false;
    }
  }

  export namespace EditorWindow {
    export function postMessage(
      window: Window | null,
      message: any,
      targetOrigin: string,
      transfer?: any[],
    ) {
      if (window !== null) {
        window.postMessage(message, targetOrigin, transfer);
      }
    }

    export function focus(window: Window | null) {
      if (window !== null) {
        window.focus();
      }
    }

    export async function openIfNecessary(
      window: Window,
      openedWindow: Window | null,
      windowOpenTimeout: number,
      url: string,
      target?: string,
      features?: string,
      replace?: boolean,
    ) {
      if (openedWindow === null || openedWindow.closed) {
        openedWindow = window.open(url, target, features, replace);
        await delay(windowOpenTimeout);
      }

      return openedWindow;
    }
  }
}
