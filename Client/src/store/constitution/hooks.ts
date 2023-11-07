import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { DAO_RESERVED_NAME } from '@q-dev/gdk-sdk';
import axios from 'axios';
import { ErrorHandler } from 'helpers';

import useNetworkConfig from 'hooks/useNetworkConfig';

import { setHash, setLastUpdate } from './reducer';

import { getState, useAppSelector } from 'store';

import { daoInstance } from 'contracts/contract-instance';

import { CONSTITUTION_HASH_PARAMETER_KEY } from 'constants/constitution';

export function useConstitution () {
  const { constitutionUrl } = useNetworkConfig();
  const dispatch = useDispatch();

  const constitutionHash = useAppSelector(({ constitution }) => constitution.hash);
  const constitutionLastUpdate = useAppSelector(({ constitution }) => constitution.lastUpdate);

  async function loadConstitutionHash () {
    try {
      if (!daoInstance) return;
      const parameterStorageInstance = await daoInstance.getConfParameterStorageInstance(DAO_RESERVED_NAME);
      const [, hash] = await parameterStorageInstance.instance.getDAOParameter(CONSTITUTION_HASH_PARAMETER_KEY);
      dispatch(setHash(hash));
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  }

  async function loadConstitutionLastUpdate () {
    try {
      const { hash: currentHash } = getState().constitution;

      const constitutionCaller = axios.create({ baseURL: constitutionUrl });
      const response = await constitutionCaller.get('/constitution/list');

      const constitution = response.data
        .find(({ hash }: { hash: string }) => currentHash === `0x${hash}`);
      dispatch(setLastUpdate(constitution?.time ? constitution?.time * 1000 : 0));
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error);
    }
  }

  return {
    constitutionHash,
    constitutionLastUpdate,
    loadConstitutionHash: useCallback(loadConstitutionHash, []),
    loadConstitutionLastUpdate: useCallback(loadConstitutionLastUpdate, []),
  };
}
