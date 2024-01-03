import { ReactNode, Suspense } from 'react';

import { Spinner } from '@q-dev/q-ui-kit';

import { LazyLoadingWrapper } from './styles';

function LazyLoading ({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <LazyLoadingWrapper>
          <Spinner size={48} />
        </LazyLoadingWrapper>
      }
    >
      {children}
    </Suspense>
  );
}

export default LazyLoading;
