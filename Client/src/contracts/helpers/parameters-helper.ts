import { DAO_RESERVED_NAME, filterParameter, getParametersValue, ParameterType } from '@q-dev/gdk-sdk';
import { ErrorHandler } from 'helpers';
import { ParameterKey } from 'typings/forms';
import { ParameterValue } from 'typings/parameters';

import { daoInstance } from 'contracts/contract-instance';

export async function getPanelParameters (
  panelName: string,
  situation?: string,
) {
  try {
    if (!daoInstance) return [];
    if (panelName === DAO_RESERVED_NAME || !situation) {
      return await daoInstance?.getAggregatedParameters(panelName);
    }
    const confParameterStorage = situation === 'configuration'
      ? await daoInstance.getConfParameterStorageInstance(panelName)
      : await daoInstance.getRegParameterStorageInstance(panelName);
    return await confParameterStorage.instance.getDAOParameters();
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return [];
  }
}

export async function getParameters (
  panelName: string,
  situation?: string,
  parameterType?: ParameterType
): Promise<ParameterValue[]> {
  try {
    const panelParameters = await getPanelParameters(panelName, situation);
    const filteredParameters = parameterType
      ? filterParameter(panelParameters, parameterType)
      : panelParameters;
    const parametersNormalValue = getParametersValue(filteredParameters);
    return filteredParameters.map((item: ParameterKey, index: number) => {
      return { ...item, normalValue: parametersNormalValue[index] };
    });
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return [];
  }
}

export async function getRegistryContracts (): Promise<ParameterValue[]> {
  try {
    if (!daoInstance) return [];

    const registryContracts = await daoInstance.DAORegistryInstance.getRegistryContractAddresses();

    const contractValues: ParameterValue[] = registryContracts
      .map(({ name, address_ }) => ({
        name,
        value: address_,
        normalValue: address_,
        solidityType: ParameterType.ADDRESS,
      }));

    return contractValues;
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error);
    return [];
  }
}
