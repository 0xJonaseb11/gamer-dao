import { FormEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon } from '@q-dev/q-ui-kit';

import Button from 'components/Button';

import { FormStepContainer } from './styles';

interface Props<T> {
  disabled?: boolean;
  children: ReactNode;
  onNext?: (values?: T) => void;
  onBack?: () => void;
  onConfirm?: (values?: T) => void;
}

function FormStep<T> ({
  disabled = false,
  children,
  onNext,
  onBack,
  onConfirm
}: Props<T>) {
  const { t } = useTranslation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (onConfirm) return onConfirm();
    if (onNext) return onNext();
  };

  return (
    <FormStepContainer
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="form-step-content">{children}</div>
      <div className="form-step-actions">
        {onBack && (
          <Button
            className="form-step-action"
            look="secondary"
            onClick={onBack}
          >
            <Icon name="chevron-left" />
            <span>{t('BACK')}</span>
          </Button>
        )}

        <Button
          className="form-step-action"
          type="submit"
          disabled={disabled}
        >
          <span>{onConfirm ? t('SUBMIT') : t('NEXT')}</span>
          {!onConfirm && <Icon name="chevron-right" />}
        </Button>
      </div>
    </FormStepContainer>
  );
}

export default FormStep;
