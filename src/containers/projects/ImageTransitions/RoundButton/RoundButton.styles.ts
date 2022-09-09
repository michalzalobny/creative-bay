import styled from 'styled-components';

import { sharedValues } from 'utils/sharedValues';

export const Wrapper = styled.div`
  display: flex;
  cursor: pointer;
  padding: 10px 20px;
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
`;

export const LabelsContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

export const Label = styled.span`
  font-size: 14px;
  line-height: 1.2;
  transition: transform 0.55s ${sharedValues.timings.t1};
  display: flex;
`;

export const LabelCopy = styled.span`
  font-size: 14px;
  line-height: 1.2;
  transition: transform 0.55s ${sharedValues.timings.t1};
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-100%);
`;
