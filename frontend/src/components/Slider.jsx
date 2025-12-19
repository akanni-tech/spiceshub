import React, { useState, useEffect, useRef, useCallback } from 'react';

// Define the component with min/max props
const DualRangeSlider = ({ min = 0, max = 64399, initialMin = 84, initialMax = 64399, onChange }) => {
  // State for the minimum and maximum values
  const [minVal, setMinVal] = useState(initialMin);
  const [maxVal, setMaxVal] = useState(initialMax);

  // Refs for the slider elements
  const minValRef = useRef(null);
  const maxValRef = useRef(null);
  const rangeRef = useRef(null); // Ref for the colored fill track


  // Function to convert value to percentage (for setting the colored fill)
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set the width and position of the range fill (the orange track between thumbs)
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxValRef.current.value); // Use ref value for real-time update

      if (rangeRef.current) {
        rangeRef.current.style.left = `${minPercent}%`;
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set the width and position of the range fill when the max thumb is moved
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(minValRef.current.value); // Use ref value
      const maxPercent = getPercent(maxVal);

      if (rangeRef.current) {
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);
  
  // Handlers for the text inputs
  const handleMinInputChange = (e) => {
      const value = Number(e.target.value);
      // Ensure new min is not less than the absolute min and not greater than maxVal
      const newMin = Math.max(min, Math.min(value, maxVal));
      setMinVal(newMin);
  };

  const handleMaxInputChange = (e) => {
      const value = Number(e.target.value);
      // Ensure new max is not greater than the absolute max and not less than minVal
      const newMax = Math.min(max, Math.max(value, minVal));
      setMaxVal(newMax);
  };

  const handleApply = () => {
    if (onChange) {
      onChange(minVal, maxVal);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl">
      {/* Header and Apply Button */}
      <div className="flex justify-between items-center mb-6">
        <span>KSH</span>
        <button 
          onClick={handleApply}
          className="text-[#BC6C25] font-medium hover:text-orange-700 transition duration-150"
        >
          Apply
        </button>
      </div>
      
      {/* Slider Container */}
      <div className="relative h-2">
        {/* Absolute Track (Background) */}
        <div className="absolute top-0 bottom-0 w-full rounded-full bg-gray-200"></div>
        
        {/* Range Fill (Orange Track between Thumbs) */}
        <div 
          ref={rangeRef}
          className="absolute h-2 rounded-full bg-[#BC6C25] z-10"
          style={{ 
              // Set initial left and width based on state
              left: `${getPercent(minVal)}%`,
              width: `${getPercent(maxVal) - getPercent(minVal)}%`
          }}
        ></div>

        {/* --- Min Range Input --- */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          ref={minValRef}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal);
            setMinVal(value);
          }}
          className="pointer-events-none absolute w-full -mt-2 appearance-none bg-transparent z-30
            // Custom Styling for the Thumb
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#BC6C25]
            [&::-webkit-slider-thumb]:shadow-lg
            // Hide the default track
            [&::-webkit-slider-runnable-track]:bg-transparent
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#BC6C25]
            [&::-moz-range-thumb]:border-none
            [&::-moz-range-track]:bg-transparent"
        />

        {/* --- Max Range Input --- */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          ref={maxValRef}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal);
            setMaxVal(value);
          }}
          className="pointer-events-none absolute w-full -mt-2 appearance-none bg-transparent z-30
            // Custom Styling for the Thumb
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#BC6C25]
            [&::-webkit-slider-thumb]:shadow-lg
            // Hide the default track
            [&::-webkit-slider-runnable-track]:bg-transparent
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#BC6C25]
            [&::-moz-range-thumb]:border-none
            [&::-moz-range-track]:bg-transparent"
        />
      </div>

      {/* --- Synchronized Inputs --- */}
      <div className="flex justify-center items-center mt-6 space-x-3">
        {/* Min Input */}
        <input
          type="number"
          min={min}
          max={maxVal} // The max value for this input is the current max slider value
          value={minVal}
          onChange={handleMinInputChange}
          className="w-1/2 p-2 border border-gray-300 rounded-lg text-center focus:ring-[#BC6C25] focus:border-[#BC6C25]"
        />
        
        <span className="text-gray-500 font-bold">-</span>
        
        {/* Max Input */}
        <input
          type="number"
          min={minVal} // The min value for this input is the current min slider value
          max={max}
          value={maxVal}
          onChange={handleMaxInputChange}
          className="w-1/2 p-2 border border-gray-300 rounded-lg text-center focus:ring-[#BC6C25] focus:border-[#BC6C25]"
        />
      </div>
    </div>
  );
};

export default DualRangeSlider;