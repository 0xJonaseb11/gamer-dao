import { ReactNode } from 'react';

import { Stepper } from '@q-dev/q-ui-kit';

import { MultiStepFormContainer } from './styles';

interface Props {
  stepIndex: number;
  isStepperDisplayed?: boolean;
  steps: {
    id: string;
    name: string;
    title: string;
    tip?: string;
    children: ReactNode;
  }[];
}

function MultiStepForm ({ stepIndex, steps, isStepperDisplayed = true }: Props) {
  return (
    <MultiStepFormContainer $step={stepIndex + 1}>
      {steps.map((step, i) => (
        <div
          key={step.id}
          className={stepIndex === i ? 'multi-step-form__step block' : ''}
          data-active={stepIndex === i}
          style={{ display: stepIndex === i ? 'block' : 'none' }}
        >
          <h3 className="text-h3">{step.title}</h3>
          {step.tip && <p className="multi-step-form__step-tip text-md">{step.tip}</p>}

          <div className="multi-step-form__step-content">{step.children}</div>
        </div>
      ))}
      {isStepperDisplayed && (
        <Stepper current={stepIndex} steps={steps} />
      )}
    </MultiStepFormContainer>
  );
}

export default MultiStepForm;
