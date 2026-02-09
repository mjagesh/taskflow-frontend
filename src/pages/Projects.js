import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

import {
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [snack, setSnack] = useState({ open: false, message: "" });
  const [deleteId, setDeleteId] = useState(null);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (error) {
      setSnack({ open: true, message: "Failed to load projects" });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();

    try {
      await API.post("/projects", { name, description });

      setName("");
      setDescription("");

      fetchProjects();

      setSnack({ open: true, message: "Project Created Successfully" });

    } catch (error) {
      setSnack({ open: true, message: "Error creating project" });
    }
  };

  const deleteProject = async () => {
    try {
      await API.delete(`/projects/${deleteId}`);

      fetchProjects();

      setSnack({ open: true, message: "Project Deleted" });
      setDeleteId(null);

    } catch (error) {
      setSnack({ open: true, message: "Error deleting project" });
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>

      <form onSubmit={createProject}>
        <TextField
          label="Project Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button variant="contained" type="submit">
          Create Project
        </Button>
      </form>

      <Typography variant="h6" sx={{ marginTop: 4 }}>
        Project List
      </Typography>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                    <Button
                        component={Link}
                            to={`/tasks/${project._id}`}
                            >
                        View Tasks
                    </Button>
                  <Button
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteId(project._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ open: false, message: "" })}
      >
        <Alert severity="info">{snack.message}</Alert>
      </Snackbar>

      <Dialog open={!!deleteId}>
        <DialogTitle>Are you sure you want to delete?</DialogTitle>

        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={deleteProject}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Projects;
