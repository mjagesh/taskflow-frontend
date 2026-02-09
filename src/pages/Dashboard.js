import React from "react";
import Layout from "../components/Layout";
import { Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Layout>
      <Typography variant="h4">
        Welcome to TaskFlow Dashboard
      </Typography>

      <Typography sx={{ marginTop: 2 }}>
        Manage your projects and tasks efficiently.
      </Typography>
    </Layout>
  );
};

export default Dashboard;
