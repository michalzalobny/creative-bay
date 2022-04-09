import styled from 'styled-components';

import { sharedValues } from 'utils/sharedValues';

export const Wrapper = styled.div`
  position: relative;
`;

export const ContentWrapper = styled.div`
  overflow: hidden;
  transition: height 0.8s ${sharedValues.timings.t1};
`;

export const GhostWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  user-select: none;
`;
