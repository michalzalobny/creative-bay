import styled, { css } from 'styled-components';

import { sharedValues } from 'utils/sharedValues';

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

interface ReadyWrapperProps {
  shouldReveal: boolean;
}

export const ReadyWrapper = styled.div<ReadyWrapperProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  background-color: white;

  ${props =>
    props.shouldReveal &&
    css`
      opacity: 0;
      user-select: none;
      pointer-events: none;
    `}
`;

export const LoaderWrapper = styled.div`
  position: absolute;
  z-index: 3;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 3px;
  border-radius: 5px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
`;

export const LoaderLine = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  transition: transform 0.2s ${sharedValues.timings.t1};
  transform: scaleX(0);
  transform-origin: left;
  background-color: black;
`;

export const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #000;
`;
