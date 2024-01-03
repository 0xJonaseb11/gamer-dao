import ContentLoader from 'react-content-loader';

import { useTheme } from 'styled-components';

function ProposalSkeleton () {
  const { colors } = useTheme();

  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={400}
      backgroundColor={colors.tertiaryMiddle}
      foregroundColor={colors.tertiaryLight}
    >
      <rect
        x="0"
        y="0"
        rx="16"
        ry="16"
        width="40%"
        height="48"
      />
      <rect
        x="84%"
        y="4"
        rx="16"
        ry="16"
        width="16%"
        height="40"
      />

      <rect
        x="0"
        y="80"
        rx="16"
        ry="16"
        width="100%"
        height="300"
      />
    </ContentLoader>
  );
}

export default ProposalSkeleton;
