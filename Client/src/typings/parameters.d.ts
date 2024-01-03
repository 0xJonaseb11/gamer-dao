import { ParameterType } from '@q-dev/gdk-sdk';

import { ParameterKey } from './forms';

export interface ParameterValue extends ParameterKey {
  normalValue: string;
  solidityType: ParameterType;
}
