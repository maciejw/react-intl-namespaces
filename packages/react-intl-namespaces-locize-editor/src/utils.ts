export function isWindow(obj: any) {
  return obj != null && obj === obj.win;
}

export function getWindow(elem: Document) {
  return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
}

export function offset(elem: Element) {
  let docElem;
  let win;
  let box = { top: 0, left: 0, right: 0, bottom: 0 };
  const doc = elem.ownerDocument;

  docElem = doc.documentElement;

  if (typeof elem.getBoundingClientRect !== typeof undefined) {
    box = elem.getBoundingClientRect();
  }
  win = doc.defaultView;

  const top = box.top + win.pageYOffset - docElem.clientTop;
  const left = box.left + win.pageXOffset - docElem.clientLeft;
  return {
    bottom: top + (box.bottom - box.top),
    left,
    right: left + (box.right - box.left),
    top,
  };
}

const getIndex = (n: Element | null) => {
  if (n && n.parentElement) {
    for (let i = 0; i < n.parentElement.children.length; i++) {
      if (n === n.parentElement.children[i]) {
        return i;
      }
    }
  }
  return 0;
};

const getPath = (e: Element | null, path: Array<[string, number]> = []) => {
  while (e && e.tagName.toUpperCase() !== 'BODY') {
    path = [[e.tagName, getIndex(e)], ...path];
    e = e.parentElement;
  }
  return path;
};

export function getDomPath(e: Element | null) {
  const result = getPath(e, []);

  const reducer = (acc: string, [name, index]: [string, number]) =>
    `${acc}/${name}[${index}]`;

  return result.reduce(reducer, '') || '/';
}
export function getClickedElement(e: MouseEvent): HTMLElement | undefined {
  let el: Element | undefined;
  // let toHigh;
  // let toLeft;
  // let toLeftNextOffset;

  el = e.srcElement || undefined;
  if (el instanceof HTMLElement) {
    return el.parentElement || undefined;
  }
  /*
 if (parent === null) return;
  if (parent && parent.getAttribute && parent.getAttribute('ignorelocizeeditor') === '') return;

  let left = e.pageX;
  let top = e.pageY;
  let pOffset = offset(parent);
  // console.warn('click', top, left);
  // console.warn('parent', parent, pOffset, parent.clientHeight, parent.offsetHeight);

  let topStartsAt = 0;
  let topBreaksAt;
  for (let i = 0; i < parent.childElementCount; i++) {
    let n = parent.children[i];
    let nOffset = offset(n);
    // console.warn('child', n, nOffset, n.clientHeight, n.offsetHeight)

    // if a node is with the bottom over the top click set the next child as start index
    if (n.nodeType === 1 && nOffset.bottom < top) topStartsAt = i + 1;

    // if node is below top click set end index to this node
    if (!topBreaksAt && nOffset.top + (n.clientHeight || 0) > top) topBreaksAt = i;
  }

  // check we are inside children lenght
  if (topStartsAt + 1 > parent.childNodes.length) topStartsAt = parent.childNodes.length - 1;
  if (!topBreaksAt) topBreaksAt = parent.childNodes.length;
  // console.warn('bound', topStartsAt, topBreaksAt)

  // inside our boundaries check when left is to big and out of clicks left
  for (let y = topStartsAt; y < topBreaksAt; y++) {
    let n = parent.children[y];
    let nOffset = offset(n);

    if (!toLeft && nOffset.left > left) {
      break;
    }

    if (n.nodeType !== 8) el = n;
  }
  if (el instanceof HTMLElement) return el;
  */
}

export function removeNamespace(str: string) {
  let res = str;
  const nsSeparator = ':';

  if (str.indexOf(nsSeparator) > -1) {
    const p = str.split(nsSeparator);
    p.shift();
    res = p.join(nsSeparator);
  }
  return res;
}

export function getElementNamespace(str: string, el: Element) {
  let namespace = 'default';
  const nsSeparator = ':';

  if (str.indexOf(nsSeparator) > -1) {
    namespace = str.split(nsSeparator)[0];
  } else {
    let found: string | undefined;

    const find = (el1: Element) => {
      let opts = el1.getAttribute && el1.getAttribute('i18next-options');
      if (!opts) {
        opts = el1.getAttribute && el1.getAttribute('data-i18next-options');
      }
      if (opts) {
        let jsonData = {};
        try {
          jsonData = JSON.parse(opts);
        } catch (e) {
          // not our problem here in editor
        }
      }
      if (!found) {
        found =
          (el1.getAttribute && el1.getAttribute('i18next-ns')) || 'default';
      }
      if (!found) {
        found =
          (el1.getAttribute && el1.getAttribute('data-i18next-ns')) ||
          'default';
      }
      if (!found && el1.parentElement) {
        find(el1.parentElement);
      }
    };
    find(el);

    if (found) {
      namespace = found;
    }
  }

  return namespace;
}

export function getQueryVariable(variable: string) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (const pair of vars) {
    if (pair[0] === variable) {
      return pair[1];
    }
  }

  return false;
}
