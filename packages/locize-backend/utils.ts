export function debounce(
  // tslint:disable-next-line:ban-types
  func: (lng: string, namespace: string) => Promise<void>,
  wait: number,
  immediate: boolean = false,
): (lng: string, namespace: string) => Promise<void> {
  const timeouts: { [key: string]: number | null } = {};

  return async (lng: string, namespace: string) => {
    const later = () => {
      timeouts[namespace] = null;
      if (!immediate) {
        return func(lng, namespace);
      }
    };

    const timeout = timeouts[namespace];
    const callNow = immediate && !timeout;
    if (timeout) {
      window.clearTimeout(timeout);
    }
    timeouts[namespace] = window.setTimeout(later, wait);
    if (callNow) {
      return func(lng, namespace);
    }
  };
}

function getLastOfPath(object: any, path: any, Empty?: any): any {
  function cleanKey(key: any) {
    return key && key.indexOf('###') > -1 ? key.replace(/###/g, '.') : key;
  }

  const stack = typeof path !== 'string' ? [].concat(path) : path.split('.');
  while (stack.length > 1) {
    if (!object) {
      return {};
    }

    const key = cleanKey(stack.shift());
    if (!object[key] && Empty) {
      object[key] = new Empty();
    }
    object = object[key];
  }

  if (!object) {
    return {};
  }
  return {
    k: cleanKey(stack.shift()),
    obj: object,
  };
}

export function setPath(object: any, path: any, newValue: any) {
  const { obj, k } = getLastOfPath(object, path, Object);

  obj[k] = newValue;
}

export function pushPath(object: any, path: any, newValue: any, concat?: any) {
  const { obj, k } = getLastOfPath(object, path, Object);

  obj[k] = obj[k] || [];
  if (concat) {
    obj[k] = obj[k].concat(newValue);
  }
  if (!concat) {
    obj[k].push(newValue);
  }
}

export function getPath(object: any, path: any) {
  const { obj, k } = getLastOfPath(object, path);

  if (!obj) {
    return undefined;
  }
  return obj[k];
}
