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
  transition: opacity 1.2s ${sharedValues.timings.t1};
  transition-delay: 1.1s;
  background-color: white;

  ${props =>
    props.shouldReveal &&
    css`
      opacity: 0;
      user-select: none;
      pointer-events: none;
    `}
`;

export const LoaderContainer = styled.div`
  overflow: hidden;
  position: absolute;
  z-index: 3;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

interface LoaderWrapperProps {
  shouldHide: boolean;
}

export const LoaderWrapper = styled.div<LoaderWrapperProps>`
  width: 130px;
  height: 2px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  transform: scaleX(1);
  transition: transform 0.8s ${sharedValues.timings.t1};
  transition-delay: 0.3s;

  ${props =>
    props.shouldHide &&
    css`
      transform: scaleX(0);
    `}
`;

interface LoaderLineProps {
  progress: number;
}

export const LoaderLine = styled.div<LoaderLineProps>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  transition: transform 0.3s ${sharedValues.timings.t1};
  transform: ${props => `scaleX(${props.progress})`};
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
