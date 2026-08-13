import React from 'react';
import { cn } from '../utils';
import { Badge } from './Badge';

export default function SectionHeading({
  badgeText,
  badgeIcon,
  title,
  highlightWord,
  subtitle,
  align = 'center', // left | center | right
  className = '',
}) {
  const alignStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={cn('flex flex-col max-w-3xl mx-auto mb-12 md:mb-16', alignStyles[align], className)}>
      {badgeText && (
        <Badge variant="brand" icon={badgeIcon} className="mb-4">
          {badgeText}
        </Badge>
      )}

      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-navy leading-tight">
        {title}{' '}
        {highlightWord && <span className="text-brand-red">{highlightWord}</span>}
      </h2>

      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-brand-slate leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
