import React, { useState, useEffect } from 'react';
import { Segmented } from 'antd';

const AnimatedSizeSelector = ({ sizes, activeIndex, onChange, children }) => {
  const [direction, setDirection] = useState('right');
  const [prevIndex, setPrevIndex] = useState(activeIndex);

  useEffect(() => {
    if (activeIndex !== prevIndex) {
      setDirection(activeIndex < prevIndex ? 'right' : 'left');
      setPrevIndex(activeIndex);
    }
  }, [activeIndex, prevIndex]);

  if (!sizes?.length) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="w-full">
        <Segmented
          type="card"
          className="ltr w-full"
          block
          style={{
            // display: 'grid',
            // gridTemplateColumns: `repeat(${sizes.length}, 1fr)`,
            // gap: '100px'
          }}
          value={activeIndex}
          onChange={onChange}
          options={sizes.map((size, index) => ({
            label: size.label,
            value: index,
          }))}
        />
      </div>
      
      <div className="relative mt-4">
        {sizes.map((size, index) => (
          <div
            key={index}
            className={`transition-all duration-300 ease-in-out absolute w-full
              ${index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
              ${direction === 'right' 
                ? index < activeIndex ? 'translate-x-full' : '-translate-x-full'
                : index < activeIndex ? '-translate-x-full' : 'translate-x-full'
              }
              ${index === activeIndex ? 'translate-x-0' : ''}`}
          >
            {index === activeIndex && children}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedSizeSelector;