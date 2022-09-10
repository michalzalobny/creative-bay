import styled from 'styled-components';

import { media } from 'utils/media';
import { sharedValues } from 'utils/sharedValues';

export const Wrapper = styled.div`
  display: flex;
  cursor: pointer;
  padding: 8px 12px;
  border: 2px solid black;
  border-radius: 50px;
  pointer-events: initial;

  &:hover {
    [data-rb='label'] {
      transform: translateY(100%);
    }

    [data-rb='labelCopy'] {
      transform: translateY(0%);
    }
  }

  ${media.tablet} {
    padding: 8px 15px;
  }
`;

export const LabelsContainer = styled.div`
  position: relative;
  overflow: hidden;
  font-size: 12px;
  line-height: 1.2;
  ${media.tablet} {
    font-size: 14px;
  }
`;

export const Label = styled.span`
  transition: transform 0.55s ${sharedValues.timings.t1};
  display: flex;
`;

export const LabelCopy = styled.span`
  transition: transform 0.55s ${sharedValues.timings.t1};
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-100%);
`;
