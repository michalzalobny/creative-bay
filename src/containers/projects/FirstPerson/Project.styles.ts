import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 15px;
    height: 15px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    z-index: 10;
  }

  /* cursor: none; */
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

export const ExitInfo = styled.p`
  position: fixed;
  z-index: 10;
  top: 20px;
  right: 30px;
  font-size: 15px;
  color: white;
  mix-blend-mode: difference;
  opacity: 0;
  transition: opacity 0.45s;
  line-height: 1.4;
`;

export const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #000000;
`;

export const InfoBoard = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0.8;
  cursor: pointer;
  transition: opacity 0.45s;
`;

export const InfoBoardText = styled(motion.p)`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  font-size: 15px;
  line-height: 1.4;
  color: white;
  transform: translate(-50%, -50%);
  text-align: center;
`;
