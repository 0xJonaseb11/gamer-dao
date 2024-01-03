import { errors } from 'errors';
import { getErrorMessage } from 'helpers';

import { Bus } from 'utils';

export class ErrorHandler {
  static process (error: Error | unknown, errorMessage = ''): void {
    const msgTranslation = errorMessage || getErrorMessage(error);
    Bus.error(msgTranslation);

    ErrorHandler.processWithoutFeedback(error);
  }

  static processWithoutFeedback (error: Error | unknown): void {
    if (error instanceof Error && error.constructor === errors.DefaultEmptyError) {
      return;
    }
    console.error(error);
  }
}
