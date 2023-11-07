// TODO: waiting for contract implementation
import { useTranslation } from 'react-i18next';

import { FormParameter } from 'typings/forms';

import ParameterViewer from 'components/ParameterViewer';

function ProposalParameters () {
  const { t } = useTranslation();
  const parameters: FormParameter[] = [];

  return (
    <div className="block">
      <h2 className="text-h2">{t('PARAMETERS')}</h2>

      <div className="block__content">
        <div className="details-list">
          {parameters.map((parameter, i) => (
            <ParameterViewer
              key={i}
              block
              parameter={parameter}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProposalParameters;
