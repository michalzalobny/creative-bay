import styled, { css } from 'styled-components';

interface ReadyWrapperProps {
  isReady: boolean;
}

export const ReadyWrapper = styled.div<ReadyWrapperProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  opacity: 1;
  transition: opacity 0.7s ease-in-out;
  background-color: white;

  ${props =>
    props.isReady &&
    css`
      opacity: 0;
      user-select: none;
      pointer-events: none;
    `}
`;
