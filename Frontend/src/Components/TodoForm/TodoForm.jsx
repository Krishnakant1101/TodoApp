import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const TodoForm = ({ setOpen, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

  
    const todoData = {
      title,
      description,
      stage: "todo", 
    };

    try {
      const response = await fetch("http://localhost:1100/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) {
        throw new Error("Failed to create the task");
      }

      const newTask = await response.json();

   
      if (onTaskCreated) {
        onTaskCreated(newTask);
      }

    
      setTitle("");
      setDescription("");

      
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        margin: "0 auto",
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" textAlign="center">
        Create New Task
      </Typography>
      
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
        
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
      >
        {loading ? "Submitting..." : "SUBMIT"}
      </Button>
    </Box>
  );
};

export default TodoForm;
