import React, { useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { addDays, subDays } from "date-fns";

export const Filter = ({ range, setDate }) => {

  const handleOnChange = (ranges) => {
    const { selection } = ranges;
    setDate([selection]);
  };
  return (
    <DateRangePicker
      onChange={handleOnChange}
      showSelectionPreview={true}
      moveRangeOnFirstSelection={false}
      months={1}
      ranges={range}
      direction="vertical"
    />
  );
};
