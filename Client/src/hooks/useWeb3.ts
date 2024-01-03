import { useEffect, useMemo, useRef, useState } from 'react';

import { sleep } from 'helpers';
import { isEqual } from 'lodash';
import { DesignatedProvider, ProviderInstance } from 'typings/provider.types';

import { PROVIDERS, PROVIDERS_CHECKS } from 'constants/providers';

export const useWeb3 = () => {
  const _browserProviders = useRef<ProviderInstance[]>([]);
  const [providers, setProviders] = useState<DesignatedProvider[]>([]);
  const [isWeb3Init, setIsWeb3Init] = useState(false);
  const isEnabled = useMemo(() => providers.length, [providers]);

  const init = async () => {
    setIsWeb3Init(false);
    await sleep(500);
    detectProvidersInBrowser();
    await _defineProviders();
    setIsWeb3Init(true);
  };

  const detectProvidersInBrowser = () => {
    const ethProviders = window?.ethereum
      ? window?.ethereum?.providers || [window?.ethereum]
      : undefined;
    const newState = [
      ...(ethProviders || []),
    ];
    if (!isEqual(_browserProviders.current, newState)) {
      _browserProviders.current = newState;
    }
  };

  const getAppropriateProviderName = (provider: ProviderInstance): PROVIDERS => {
    const providerName = Object.entries(PROVIDERS_CHECKS).find(el => {
      const [, value] = el;

      return ((<unknown>provider) as { [key in PROVIDERS_CHECKS]: boolean })[
        value
      ];
    });

    return (
      ((providerName && providerName[0]) as PROVIDERS) || PROVIDERS.fallback
    );
  };

  const designateBrowserProviders = (): DesignatedProvider[] => {
    if (!_browserProviders.current.length) return [];

    const designatedProviders = _browserProviders.current.map(el => {
      const appropriatedProviderName: PROVIDERS = getAppropriateProviderName(el);

      return {
        name: appropriatedProviderName,
        instance: el,
      } as DesignatedProvider;
    });

    return designatedProviders.filter(
      (el, idx, arr) => arr.findIndex(sec => sec.name === el.name) === idx,
    );
  };

  function handleProviders () {
    if (!_browserProviders.current.length) return;
    setProviders(state => {
      const newState = designateBrowserProviders();

      return isEqual(newState, state) ? state : newState;
    });
  }

  const _defineProviders = async () => {
    if (_browserProviders.current.length) {
      handleProviders();
    } else {
      await sleep(3000);
      handleProviders();
    }
  };

  useEffect(() => {
    _defineProviders();
  }, [_browserProviders, _defineProviders]);

  return {
    providers,
    isWeb3Init,
    isEnabled,
    init,
  };
};
