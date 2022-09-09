import styled, { css } from 'styled-components';

import { sharedValues } from 'utils/sharedValues';
import { media } from 'utils/media';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  pointer-events: none;

  &:not(:last-child) {
    padding-bottom: 8rem;
  }

  ${media.tablet} {
    &:not(:last-child) {
      padding-bottom: 20rem;
    }
  }
`;

export const TitleWrapper = styled.div``;

interface TitleProps {
  $isHovered: boolean;
}

export const Title = styled.h3<TitleProps>`
  color: #111111;
  font-size: 2.5rem;
  font-weight: 800;
  padding-left: 25px;

  transform: translateY(22%);
  transform-origin: left;
  transition: transform 0.65s ${sharedValues.timings.t1};

  ${props =>
    props.$isHovered &&
    css`
      transform: translateY(-30%) scale(0.8);
    `}

  ${media.tablet} {
    padding-left: 40px;
    font-size: 7rem;
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  &:before {
    content: '';
    display: block;
    padding-bottom: 46.25%;
  }
`;

export const BoxShadow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.35);
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  padding-left: 25px;
  padding-top: 25px;

  ${media.tablet} {
    padding-left: 40px;
    padding-top: 40px;
  }
`;
