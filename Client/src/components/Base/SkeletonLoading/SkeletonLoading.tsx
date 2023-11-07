import ContentLoader from 'react-content-loader';

import { useTheme } from 'styled-components';

import { SkeletonLoadingWrapper } from './styles';

export function SkeletonTableLoading ({ tiny = false }) {
  const { colors } = useTheme();

  const generateSize = (nRow: number) =>
    tiny
      ? { y: `${nRow * 30}`, x: '0', height: '20', ry: '8', rx: '10' }
      : { y: `${nRow * 70}`, x: '0', height: '60', ry: '16', rx: '20' };

  return (
    <ContentLoader
      width="100%"
      height={tiny ? 210 : 410}
      speed={2}
      backgroundColor={colors.tertiaryMiddle}
      foregroundColor={colors.tertiaryLight}
    >
      <rect width="100%" {...generateSize(0)} />
      <rect width="100%" {...generateSize(1)} />
      <rect width="100%" {...generateSize(2)} />
      <rect width="100%" {...generateSize(3)} />
      <rect width="100%" {...generateSize(4)} />
      <rect width="100%" {...generateSize(5)} />
      <rect width="100%" {...generateSize(6)} />
    </ContentLoader>
  );
}

export function SkeletonAuctionLoading () {
  const { colors } = useTheme();

  return (
    <SkeletonLoadingWrapper>
      <ContentLoader
        speed={2}
        width="100%"
        height="1000"
        backgroundColor={colors.tertiaryMiddle}
        foregroundColor={colors.tertiaryLight}
      >
        <rect
          x="5"
          y="10"
          rx="16"
          ry="16"
          width="150"
          height="35"
        />

        <rect
          x="5"
          y="80"
          rx="16"
          ry="16"
          width="25%"
          height="50"
        />

        <rect
          x="26%"
          y="80"
          rx="20"
          ry="20"
          width="80"
          height="30"
        />

        <rect
          x="79%"
          y="90"
          rx="20"
          ry="20"
          width="10%"
          height="40"
        />

        <rect
          x="90%"
          y="90"
          rx="16"
          ry="16"
          width="10%"
          height="40"
        />

        <rect
          x="5"
          y="160"
          rx="16"
          ry="16"
          width="100%"
          height="366"
        />
      </ContentLoader>
    </SkeletonLoadingWrapper>
  );
}
