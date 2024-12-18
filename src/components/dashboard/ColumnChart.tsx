import { alpha, useTheme } from "@mui/material";
import { capitalCase, sentenceCase } from "change-case";
import { useState, memo } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/reducers";

function ColumnChart({
  series,
}: {
  series: {
    name: string;
    session_time: number;
  }[];
}) {
  const theme = useTheme();
  const { theme: themeSetting } = useSelector(
    (state: RootState) => state.theme
  );
  const [state, setState] = useState({
    series: [
      {
        name: "",
        data: series.map((item) => item.session_time),
      },
    ],
    options: {
      chart: {
        height: 300,
        type: "bar",
        toolbar: {
          show: false,
        },
        // events: {
        //   click: function (chart, w, e) {
        //     // console.log(chart, w, e)
        //   },
        // },
      },
      colors: [
        alpha(theme.palette.primary.main, 1),
        alpha(theme.palette.primary.main, 0.9),
        alpha(theme.palette.primary.main, 0.8),
        alpha(theme.palette.primary.main, 0.7),
        alpha(theme.palette.primary.main, 0.6),
        alpha(theme.palette.primary.main, 0.5),
        alpha(theme.palette.primary.main, 0.4),
        alpha(theme.palette.primary.main, 0.3),
        alpha(theme.palette.primary.main, 0.2),
        alpha(theme.palette.primary.main, 0.1),
      ],
      grid: {
        show: false,
      },
      plotOptions: {
        bar: {
          columnWidth: 40,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: themeSetting.Theme_theme == "Light" ? "light" : "dark", // Optional: change the tooltip theme
        style: {
          fontSize: theme.typography.fontSize,
          color: theme.palette.text.primary, // Tooltip text color
        },
      },
      xaxis: {
        axisBorder: {
          show: false, // Remove X-axis line
        },
        axisTicks: {
          show: false, // Remove X-axis ticks
        },
        labels: {
          style: {
            fontSize: theme.typography.fontSize, // Adjust font size here
            colors: theme.palette.text.primary, // Optional: font color
          },
        },
        categories: series.map((item) => [item.name]),
      },
      yaxis: {
        axisBorder: {
          show: false, // Remove X-axis line
        },
        axisTicks: {
          show: false, // Remove X-axis ticks
        },
        labels: {
          style: {
            fontSize: theme.typography.fontSize, // Adjust font size here
            colors: theme.palette.text.primary, // Optional: font color
          },
        },
      },
    },
  });
  return (
    <ReactApexChart
      options={state.options as any}
      series={state.series}
      type="bar"
      height={300}
    />
  );
}

export default memo(ColumnChart);
