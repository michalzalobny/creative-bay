import styled, { css } from 'styled-components';

import { s1, underline } from 'utils/sharedStyled';
import { media } from 'utils/media';

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
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
  z-index: 8;
  opacity: 1;
  transition: opacity 0.5s;
  background: white;

  ${props =>
    props.shouldReveal &&
    css`
      opacity: 0;
      user-select: none;
      pointer-events: none;
    `}
`;

export const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

interface GateWrapperProps {
  $showGate: boolean;
}

export const GateWrapper = styled.div<GateWrapperProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  display: none;
  background: white;

  ${props =>
    props.$showGate &&
    css`
      display: initial;
    `}
`;

export const GateEnterButton = styled.button`
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${s1};
  ${underline};
  cursor: pointer;
`;

export const VideoWrapper = styled.div`
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  width: 40vh;
  transform: translate(-50%, -50%);

  &:before {
    content: '';
    display: block;
    width: 100%;
    padding-bottom: 171%;
  }

  p {
    font-size: 4rem;
    font-weight: 400;
    letter-spacing: 0.5rem;
    line-height: 1.2;
    color: white;
    z-index: 3;
    position: absolute;
    bottom: 0;
    left: 50%;
    text-align: center;
    transform: translateX(-50%);
    white-space: nowrap;

    ${media.tablet} {
      font-size: 8rem;
      letter-spacing: 1.5rem;
    }

    .line {
      display: inline-block;
      overflow: hidden;
      vertical-align: top;

      .char {
        transform: translateY(100%);

        &--revert {
          transform: translateY(-100%);
        }

        &--active {
          transform: translateY(0%);
        }
      }
    }
  }

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
  }

  .hasTransition {
    transition: opacity 0.65s;
  }
`;
