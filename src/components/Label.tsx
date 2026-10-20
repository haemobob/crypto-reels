import type {CSSProperties} from 'react';
import {colors} from '../theme/colors';
import {fonts} from '../theme/typography';

/** On-screen qualifier chip: SIMULASI, ILUSTRASI, USULAN, a date or a source. Place it beside the graphic. */
export const Label = ({
  text,
  tone = 'blue',
  onLight = false,
  style,
}: {
  text: string;
  tone?: 'blue' | 'muted' | 'red';
  /** Set on off-white grounds so the chip keeps its contrast. */
  onLight?: boolean;
  style?: CSSProperties;
}) => {
  const c = tone === 'red' ? colors.negative : tone === 'muted' ? (onLight ? '#4A5568' : colors.muted) : onLight ? colors.blue : colors.light;
  return (
    <div
      style={{
        display: 'inline-block',
        fontFamily: fonts.mono,
        fontWeight: 600,
        fontSize: 26,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: c,
        border: `2px solid ${c}`,
        borderRadius: 8,
        padding: '6px 14px',
        ...style,
      }}
    >
      {text}
    </div>
  );
};
