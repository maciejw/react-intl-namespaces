import { Messages } from './types';

/**
 * defines ReactIntl messages object that works with intellisense and type checking in typescript. It defines on the fly type, based on names of properties passed as a generic parameter
 * @param messages type safe object with messages
 * @returns passed messages object
 */
export function defineMessages<T extends string>(
  messages: Messages<T>,
): Messages<T>;
export function defineMessages(messages: any) {
  return messages;
}
