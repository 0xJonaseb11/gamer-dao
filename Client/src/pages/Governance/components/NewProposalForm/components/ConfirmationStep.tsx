import { useTranslation } from 'react-i18next';

import { DefaultVotingSituations } from '@q-dev/gdk-sdk';

import DAORegistryCallDataViewer from 'components/DAORegistryCallDataViewer';
import FormBlock from 'components/FormBlock';
import { FormStep } from 'components/MultiStepForm';
import ParameterViewer from 'components/ParameterViewer';

import useProposalSteps from 'hooks/useProposalSteps';

import { useNewProposalForm } from '../NewProposalForm';

function ConfirmationStep () {
  const { t } = useTranslation();
  const { values, goBack, confirm, updateStep } = useNewProposalForm();
  const { proposalOptionsMap } = useProposalSteps();

  return (
    <FormStep
      onConfirm={confirm}
      onBack={goBack}
    >
      <FormBlock
        icon="edit"
        title={t('PROPOSAL_TYPE')}
        onAction={() => updateStep(0)}
      >
        <p className="text-lg">
          {proposalOptionsMap[values.type]?.label}
        </p>
      </FormBlock>

      {values.type === DefaultVotingSituations.Constitution && (
        <FormBlock
          icon="edit"
          title={t('BASIC_PART')}
          onAction={() => updateStep(1)}
        >
          <div>
            <p className="text-md color-secondary">{t('HASH')}</p>
            <p className="text-lg ellipsis">{values.hash}</p>
          </div>

          <div>
            <p className="text-md color-secondary">{t('DESCRIPTION')}</p>
            <p className="text-lg pre-line">{values.remark}</p>
          </div>
        </FormBlock>
      )}

      {(values.type === DefaultVotingSituations.Constitution ||
        values.type === DefaultVotingSituations.ConfigurationParameter ||
        values.type === DefaultVotingSituations.RegularParameter) &&
        (
          <FormBlock
            icon="edit"
            title={t('PARAMETERS')}
            onAction={() => updateStep(values.type === DefaultVotingSituations.Constitution ? 2 : 1)}
          >
            <div>
              <p className="text-md color-secondary">
                {t('CHANGE_CONSTITUTION_PARAMETER')}
              </p>
              <p className="text-lg">
                {values.isParamsChanged ? t('YES') : t('NO')}
              </p>
            </div>

            {values.params.map((param, index) => (
              <ParameterViewer
                key={index + param.key}
                parameter={param}
                index={index}
              />
            ))}
          </FormBlock>
        )}

      {values.type === DefaultVotingSituations.General && (
        <FormBlock
          icon="edit"
          title={t('DETAILS')}
          onAction={() => updateStep(1)}
        >
          <div>
            <p className="text-md color-secondary">{t('DESCRIPTION')}</p>
            <p className="text-lg pre-line">{values.remark}</p>
          </div>
        </FormBlock>)}

      {values.type === DefaultVotingSituations.Membership && (
        <FormBlock
          icon="edit"
          title={t('DETAILS')}
          onAction={() => updateStep(1)}
        >
          <div>
            <p className="text-md color-secondary">{t('ACTION_TYPE')}</p>
            <p className="text-lg ellipsis">
              {values.membershipSituationType === 'add-member' ? t('ADD_NEW_MEMBER') : t('REMOVE_MEMBER')}
            </p>
          </div>
          <div>
            <p className="text-md color-secondary">{t('CANDIDATE_ADDRESS')}</p>
            <p className="text-lg ellipsis">{values.candidateAddress}</p>
          </div>
          <div>
            <p className="text-md color-secondary">{t('DESCRIPTION')}</p>
            <p className="text-lg pre-line">{values.remark}</p>
          </div>
        </FormBlock>)}
      {values.type === DefaultVotingSituations.DAORegistry && (
        <>
          <FormBlock
            icon="edit"
            title={t('BASIC_PART')}
            onAction={() => updateStep(1)}
          >
            <div>
              <p className="text-md color-secondary">{t('DESCRIPTION')}</p>
              <p className="text-lg pre-line">{values.remark}</p>
            </div>
          </FormBlock>
          <FormBlock
            icon="edit"
            title={t('DETAILS')}
            onAction={() => updateStep(2)}
          >
            {values.callData.map((callData, index) => (
              <DAORegistryCallDataViewer
                key={index}
                callData={callData}
                index={index}
              />
            ))}
          </FormBlock>
        </>
      )}
    </FormStep>
  );
}

export default ConfirmationStep;
