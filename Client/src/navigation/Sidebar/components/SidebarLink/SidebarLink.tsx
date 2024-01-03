import { Icon } from '@q-dev/q-ui-kit';
import { IconName } from '@q-dev/q-ui-kit/dist/components/Icon';

import { StyledLink } from './styles';

interface Props {
  to: string;
  title: string;
  icon?: IconName;
  count?: number;
  accordion?: boolean;
  exact?: boolean;
}

function SidebarLink ({ to, title, icon, count = 0, exact = true }: Props) {
  return (
    <StyledLink
      className="text-md"
      exact={exact}
      to={to}
    >
      <div className="sidebar-link-group">
        {icon && <Icon name={icon} />}
        <span>{title}</span>
      </div>
      {count > 0 && (
        <div className="sidebar-link-group">
          <span className="sidebar-link-count text-sm font-semibold">{count}</span>
        </div>
      )}
    </StyledLink>
  );
}

export default SidebarLink;
