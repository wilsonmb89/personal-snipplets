import { PulseTooltipInfoData } from '@pulse.io/components/dist/types/interface';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface TooltipProps {
  title: string;
  description: string;
  color?: string;
  colorvariant?: string;
  orientation?: string;
  size?: string;
  mobilebehavior?: boolean;
  removeinclose?: boolean;
  element: HTMLElement;
  onClose: () => void;
  offset?: { x: number; y: number };
}

const Tooltip = ({
  title,
  description,
  element,
  onClose,
  color,
  colorvariant,
  orientation,
  size,
  mobilebehavior,
  removeinclose = false
}: TooltipProps): JSX.Element => {
  const tooltipRef = useRef(null);

  useEffect(() => {
    const content: PulseTooltipInfoData[] = [
      {
        title,
        description
      }
    ];

    tooltipRef.current.htmlelementref = element;
    tooltipRef.current.content = content;
    tooltipRef.current.color = color ? color : 'carbon';
    tooltipRef.current.colorvariant = colorvariant ? colorvariant : '900';
    tooltipRef.current.orientation = orientation ? orientation : 'left-start';
    tooltipRef.current.size = size ? size : 's';
    tooltipRef.current.mobilebehavior = !!mobilebehavior;
    tooltipRef.current.removeinclose = removeinclose;

    tooltipRef.current.addEventListener('onCloseChange', onClose);
    return () => {
      tooltipRef.current?.removeEventListener('onCloseChange', onClose);
    };
  }, []);

  return createPortal(
    <pulse-tooltip-info ref={tooltipRef} dynamicposition={false} data-testid="tooltip"></pulse-tooltip-info>,
    document.getElementById('overlay-root')
  );
};

export default Tooltip;
