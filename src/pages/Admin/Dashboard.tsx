import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { END_POINTS } from "src/api/EndPoints";
import fetcher from "src/api/fetcher";
import BarChart from "src/components/dashboard/BarChart";
import ColumnChart from "src/components/dashboard/ColumnChart";
import DonutChart from "src/components/dashboard/DonutChart";
import LineChart from "src/components/dashboard/LineChart";
import StatsCard from "src/components/dashboard/StatsCard";

type dashboardDataTypes = {
  total_users: number;
  total_notebook: number;
  total_files_uploaded: number;
  monthly_user_activity: {
    _id: {
      year: null | number;
      month: null | number;
    };
    user_count: number;
  }[];
  Monthly_notebook_count: {
    _id: {
      year: number;
      month: number;
    };
    notebook_count: number;
  }[];
  files_by_type: {
    _id: string;
    file_count: number;
  }[];
  Top_queried_files: {
    _id: string;
    queries: number;
  }[];
};

function Dashboard() {
  useEffect(() => {
    getDashboardData();
  }, []);

  const [dashboardData, setDashboardData] = useState({} as dashboardDataTypes);

  const getDashboardData = async () => {
    try {
      const Response = await fetcher.get(END_POINTS.ADMIN.DASHBOARD);
      if (Response.status == 200) {
        setDashboardData(Response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const colors = ["#008080", "#F5B700", "#1B75BC"];
  const totalFiles = dashboardData?.files_by_type?.reduce(
    (acc, elem) => (acc += elem.file_count),
    0
  );

  return (
    <Box>
      <Grid container>
        <Grid item lg={3} sm={6} xs={1}>
          <StatsCard
            data={{ title: "Total Users", count: dashboardData.total_users }}
          />
        </Grid>
        <Grid item lg={3} sm={6} xs={1}>
          <StatsCard
            data={{
              title: "Total Notebook",
              count: dashboardData.total_notebook,
            }}
          />
        </Grid>
        <Grid item lg={3} sm={6} xs={1}>
          <StatsCard
            data={{
              title: "Total Files Uploaded",
              count: dashboardData.total_files_uploaded,
            }}
          />
        </Grid>
        <Grid item lg={3} sm={6} xs={1}>
          <StatsCard
            data={{
              title: "Average Session Time",
              count: 0,
            }}
          />
        </Grid>
      </Grid>
      <Grid container mt={2} spacing={3}>
        <Grid item xs={8}>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.background.default,
              borderRadius: 3,
              padding: 3,
            }}
          >
            {dashboardData?.Top_queried_files?.length && (
              <LineChart
                series={[
                  {
                    name: "active",
                    data: [10, 20, 15, 8, 6, 12, 2, 3, 6, 12, 8, 10],
                  },
                ]}
              />
            )}
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.background.default,
              borderRadius: 3,
              padding: 3,
            }}
          >
            {dashboardData?.Top_queried_files?.length && (
              <BarChart series={dashboardData?.Top_queried_files} />
            )}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.background.default,
              borderRadius: 3,
              padding: 3,
            }}
          >
            {dashboardData?.files_by_type?.length && (
              <ColumnChart
                series={[
                  { name: "User1", session_time: 12 },
                  { name: "User2", session_time: 21 },
                  { name: "User3", session_time: 24 },
                  { name: "User4", session_time: 15 },
                  { name: "User5", session_time: 20 },
                  { name: "User6", session_time: 10 },
                ]}
              />
            )}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.background.default,
              borderRadius: 3,
              padding: 3,
            }}
          >
            {dashboardData?.files_by_type?.length && (
              <DonutChart series={dashboardData.files_by_type} />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
