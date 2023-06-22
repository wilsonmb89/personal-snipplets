import React, { Fragment, useEffect, useRef } from 'react';

interface PulseListGroupProps {
  isAccordion: boolean;
  itemChanged?: (customEvent: CustomEvent) => void;
  slot?: string;
  children?: React.ReactNode;
}

const PulseListGroup = ({ isAccordion, itemChanged, children }: PulseListGroupProps): JSX.Element => {
  const elementRef = useRef(null);

  useEffect(() => {
    elementRef.current.addEventListener('itemChanged', itemChanged);
    return () => {
      elementRef.current?.removeEventListener('itemChanged', itemChanged);
    };
  }, []);

  return (
    <Fragment>
      <pulse-list-group ref={elementRef} isaccordion={isAccordion}>
        {children}
      </pulse-list-group>
    </Fragment>
  );
};

export default PulseListGroup;
