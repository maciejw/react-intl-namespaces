// Type definitions for classnames 2.2
// Project: https://github.com/JedWatson/classnames
// Definitions by: Dave Keen <http://www.keendevelopment.ch>
//                 Adi Dahiya <https://github.com/adidahiya>
//                 Jason Killian <https://github.com/JKillian>
//                 Sean Kelley <https://github.com/seansfkelley>
//                 Michal Adamczyk <https://github.com/mradamczyk>
//                 Marvin Hagemeister <https://github.com/marvinhagemeister>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

export type ClassValue =
  | string
  | number
  | ClassDictionary
  | ClassArray
  | undefined
  | null
  | false;

export interface ClassDictionary {
  [id: string]: boolean | undefined | null;
}

// This is the only way I found to break circular references between ClassArray and ClassValue
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export interface ClassArray extends Array<ClassValue> {} // tslint:disable-line no-empty-interface

export type ClassNamesFn = (...classes: ClassValue[]) => string;

// tslint:disable-next-line:no-var-requires
const classNames: ClassNamesFn = require('classnames');

export { classNames };
