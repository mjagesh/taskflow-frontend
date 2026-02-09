import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  MenuItem,
  Select
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const Tasks = () => {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [snack, setSnack] = useState({ open: false, message: "" });

  const fetchTasks = async () => {
    try {
      const { data } = await API.get(`/tasks/${projectId}`);
      setTasks(data);
    } catch (error) {
      setSnack({ open: true, message: "Failed to load tasks" });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data);
    } catch (error) {
      console.log("User fetch failed");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks", {
        title,
        description,
        project: projectId,
        assignedTo
      });

      setTitle("");
      setDescription("");

      fetchTasks();

      setSnack({ open: true, message: "Task Created" });
    } catch (error) {
      setSnack({ open: true, message: "Error creating task" });
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);

      fetchTasks();

      setSnack({ open: true, message: "Task Deleted" });
    } catch (error) {
      setSnack({ open: true, message: "Error deleting task" });
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });

      fetchTasks();

      setSnack({ open: true, message: "Status Updated" });
    } catch (error) {
      setSnack({ open: true, message: "Error updating status" });
    }
  };

  return (
    <Layout>
      <Typography variant="h4">Tasks</Typography>

      <form onSubmit={createTask}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Select
          fullWidth
          displayEmpty
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <MenuItem value="">
            <em>Select User</em>
          </MenuItem>
          
          {users.map((user) => (
            <MenuItem key={user._id} value={user._id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>

        <Button variant="contained" type="submit" sx={{ marginTop: 2 }}>
          Create Task
        </Button>
      </form>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{task.title}</TableCell>

                <TableCell>
                  <Select
                    value={task.status}
                    onChange={(e) =>
                      updateStatus(task._id, e.target.value)
                    }
                  >
                    <MenuItem value="todo">Todo</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </TableCell>

                <TableCell>
                  {task.assignedTo?.name || "Unassigned"}
                </TableCell>

                <TableCell>
                  <Button
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteTask(task._id)}
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
        <Alert>{snack.message}</Alert>
      </Snackbar>
    </Layout>
  );
};

export default Tasks;
