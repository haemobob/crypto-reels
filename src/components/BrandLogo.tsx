import type {CSSProperties} from 'react';
import {Img, staticFile} from 'remotion';
import {brand} from '../theme/brand';

/** The official Cryptonite logo, never stretched: give it a width and the height follows. */
export const BrandLogo = ({width, style}: {width: number; style?: CSSProperties}) => (
  <Img
    src={staticFile(brand.logo)}
    style={{
      width,
      height: width / brand.logoAspect,
      objectFit: 'contain',
      mixBlendMode: brand.logoBlend,
      ...style,
    }}
  />
);
