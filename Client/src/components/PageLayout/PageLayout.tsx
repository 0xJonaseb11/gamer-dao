import { HTMLAttributes, ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon } from '@q-dev/q-ui-kit';
import { useOnScreen } from '@q-dev/react-hooks';
import { titleCase } from '@q-dev/utils';

import Button from 'components/Button';

import { PageLayoutContainer } from './styles';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  titleExtra?: ReactNode;
  action?: ReactNode;
}

function PageLayout ({
  title,
  titleExtra,
  action,
  children,
  ...rest
}: Props) {
  const { t } = useTranslation();

  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleVisible = useOnScreen(titleRef);

  useEffect(() => {
    const documentTitle = title === 'Dashboard'
      ? 'DAO Dashboard'
      : `${titleCase(title)} | DAO Dashboard`;
    document.title = documentTitle;
  }, [titleCase]);

  return (
    <PageLayoutContainer {...rest}>
      <div className="page-layout__title-wrapper">
        <h1
          ref={titleRef}
          className="page-layout__title text-h1"
        >
          <span className="page-layout__title-text">{t(title)}</span>
          {titleExtra}
        </h1>

        <div className="page-layout__title-actions">{action}</div>
      </div>

      <div className="page-layout__content">{children}</div>

      <Button
        icon
        alwaysEnabled
        look="primary"
        className="page-layout__top-btn"
        style={{ right: isTitleVisible ? '-50px' : '' }}
        onClick={() => titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      >
        <Icon name="expand-less" />
      </Button>
    </PageLayoutContainer>
  );
}

export default PageLayout;
