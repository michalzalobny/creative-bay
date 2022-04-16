import styled from 'styled-components';

import { media } from 'utils/media';
import { underline, s1 } from 'utils/sharedStyled';

export const Wrapper = styled.div`
  margin: 0 auto;
  width: 80%;
  margin-top: 4rem;

  ${media.tablet} {
    width: 120rem;
    margin-top: 10rem;
  }
`;

export const ProjectsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ProjectContainer = styled.div`
  &:not(:last-child) {
    margin-bottom: 3rem;
  }
`;

export const ProjectLink = styled.a`
  font-weight: 800;
  text-transform: uppercase;
  display: inline-block;
  position: relative;
  ${s1};
  ${underline};
`;
