import { Link } from 'react-router-dom';

import { trimString } from '@q-dev/utils';
import styled from 'styled-components';
import { DaoCardType } from 'typings/dao';

const StyledLink = styled(Link)`
  transition: all 150ms ease-out;
  padding: 16px 24px 24px;

  &:hover,
  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderMain};
    background: ${({ theme }) => theme.colors.tertiaryMain};
    transform: scale(1.02);
  }

  .dao-card__logo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .dao-card__logo-img {
    object-fit: cover;
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }

  .dao-card__description {
    display: grid;
    gap: 4px;
  }

  .dao-card__description-text {
    width: 100%;
    display: -webkit-box;
    word-wrap: break-word;
    overflow: hidden;
    white-space: break-spaces;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
`;

interface Props {
  card: DaoCardType;
}

function DaoCard ({ card }: Props) {
  return (
    <StyledLink
      to={{
        pathname: `/${card.address}`,
      }}
      className="block"
    >
      <div className="dao-card__logo">
        <img
          className="dao-card__logo-img"
          src={card.image}
          alt={card.title}
        />
        <p className="text-md font-semibold">{trimString(card.address)}</p>
      </div>

      <div className="dao-card__description">
        <p className="text-lg font-semibold">{card.title}</p>
        <p className="dao-card__description-text color-secondary">
          {card.description}
        </p>
      </div>
    </StyledLink>
  );
}

export default DaoCard;
