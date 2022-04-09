import { css } from 'styled-components';

import { sharedValues } from 'utils/sharedValues';

export const s1 = css`
  font-size: 15px;
  line-height: 1.6;
`;

export const m1 = css`
  font-size: 2.5rem;
  line-height: 1.4;
`;

export const m2 = css`
  font-size: 4.5rem;
`;

export const underline = css`
  &:before {
    content: '';
    position: absolute;
    top: 85%;
    width: 100%;
    height: 1px;
    background-color: currentColor;
    transform-origin: left;
    transform: scaleX(0);
    transition: transform 0.8s ${sharedValues.timings.t1};
  }

  &:hover {
    &:before {
      transform: scaleX(1);
    }
  }
`;

export const squareButton = css`
  ${s1};
  line-height: initial;
  background-color: ${sharedValues.colors.blue};
  color: ${sharedValues.colors.trueWhite};
  padding: 12px 20px;
  border-radius: ${sharedValues.spacing.s3};
  position: relative;

  &::before {
    content: '';
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    background-color: inherit;
    z-index: -1;
    border-radius: inherit;
    transition-duration: 1s;
    transition-property: opacity, width, height;
  }

  &:hover {
    &::before {
      opacity: 0;
      width: calc(100% + 20px);
      height: calc(100% + 20px);
    }
  }
`;
