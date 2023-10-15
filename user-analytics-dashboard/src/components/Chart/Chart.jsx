import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-date-fns';
import { enIN } from 'date-fns/locale';
import 'chartjs-adapter-moment'
import moment from 'moment'

export const Chart = ({data, dateRange, range}) => {

  let dateType = "day"
  if(dateRange.startDate.toDateString() === dateRange.endDate.toDateString()){
    dateType = "hour"
  }
  let [chartConfig, setChartConfig] = useState(null)
  let [options, setOptions] = useState(null)

  useEffect(()=>{

    const convertTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (dateType==="hour") {
      return moment(date).startOf("hour").toISOString()
    }
    else{
      return moment(date).startOf("date").toISOString()
    }
  };

    ChartJS.register(...registerables);
      const userCounts = {};
      const callCounts = {};
      const failureCounts = {};
        data.forEach((item) => {
          const timestamp = convertTimestamp(item.timeStamp);
          if (!userCounts[timestamp]) {
            userCounts[timestamp] = new Set();
          }
          userCounts[timestamp].add(item.userId);

          if (!callCounts[timestamp]) {
            callCounts[timestamp] = 0;
          }
          callCounts[timestamp]++;

          if (item.status === 'FAILURE') {
            if (!failureCounts[timestamp]) {
              failureCounts[timestamp] = 0;
            }
            failureCounts[timestamp]++;
          }
        });

        let labels = Object.keys(userCounts);
        const userCountsData = labels.map((label) => userCounts[label].size);
        const callCountsData = labels.map((label) => callCounts[label]);
        const failureCountsData = labels.map((label) => failureCounts[label] || 0);

        console.log(dateType)

        chartConfig = {
            labels: labels,
            datasets: [
              {
                label: 'Users',
                data: userCountsData,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
              },
              {
                label: 'Calls',
                data: callCountsData,
                borderColor: 'rgba(255, 159, 64, 1)',
                fill: false,
              },
              {
                label: 'Failures',
                data: failureCountsData,
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
              },
            ],
          }
          options = {
            scales: {
              x: {
                type: 'time',
                time: {
                  round:true,
                  displayFormats: {
                    minute: 'HH:mm',
                    hour: 'HH:mm',
                    day: 'DD:MM:YY',
                  },
                  unit: dateType
                }
              },
            },
          }
          // console.log(JSON.stringify(chartConfig))
        setChartConfig(chartConfig)
        setOptions(options)

  },[data])
  return (
    <div>
    {chartConfig? (
      <Line
        data={chartConfig}
        options={options}
      />
    ):(<div></div>)}
    </div>
  );
};
