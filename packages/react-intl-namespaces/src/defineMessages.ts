import { Messages } from './types';

export function defineMessages<T extends string>(
  messages: Messages<T>,
): Messages<T>;
export function defineMessages(messages: any) {
  return messages;
}
