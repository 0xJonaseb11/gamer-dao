import ContentLoader from 'react-content-loader';

import { useTheme } from 'styled-components';

import { SkeletonContainer } from './styles';

function ProposalCardSkeleton () {
  const { colors } = useTheme();

  return (
    <SkeletonContainer>
      <ContentLoader
        speed={2}
        width="100%"
        height={217}
        backgroundColor={colors.tertiaryMiddle}
        foregroundColor={colors.tertiaryLight}
      >
        <rect
          x="32"
          y="28"
          rx="3"
          ry="3"
          width="30%"
          height="20"
        />
        <rect
          x="78%"
          y="24"
          rx="16"
          ry="16"
          width="16%"
          height="28"
        />

        <rect
          x="32"
          y="72"
          rx="3"
          ry="3"
          width="60%"
          height="25"
        />

        <rect
          x="32"
          y="116"
          rx="3"
          ry="3"
          width="18%"
          height="14"
        />
        <rect
          x="75%"
          y="116"
          rx="3"
          ry="3"
          width="18%"
          height="14"
        />

        <rect
          x="32"
          y="142"
          rx="8"
          ry="8"
          width="87%"
          height="12"
        />

        <rect
          x="32"
          y="176"
          rx="3"
          ry="3"
          width="18%"
          height="14"
        />
        <rect
          x="75%"
          y="176"
          rx="3"
          ry="3"
          width="18%"
          height="14"
        />
      </ContentLoader>
    </SkeletonContainer>
  );
}

export default ProposalCardSkeleton;
