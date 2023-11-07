import { Link } from 'react-router-dom';

import styled from 'styled-components';

export const RedirectAddressLink = styled(Link)`
  display: grid;
  grid-template-columns: minmax(0, 1fr);

  &,
  &:hover {
    color: inherit;
  }

  &:hover {
    text-decoration: underline;
  }

  & > p {
    margin-bottom: 0;
  }
`;
