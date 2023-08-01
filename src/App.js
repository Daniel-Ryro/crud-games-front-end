import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [newGame, setNewGame] = useState({ name: '', company: '' });
  const [showAddFields, setShowAddFields] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null); 
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://localhost:7143/api/Games');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewGame((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateItem = async () => {
    if (showAddFields) {
      try {
        const response = await axios.post('https://localhost:7143/api/Games', newGame);
        console.log('Novo item criado:', response.data);
        setNewGame({ name: '', company: '' });
        fetchData();
      } catch (error) {
        console.error('Error creating item:', error);
      }
    } else {
      setShowAddFields(true);
    }
  };

  const handleCancelAdd = () => {
    setShowAddFields(false);
    setNewGame({ name: '', company: '' });
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`https://localhost:7143/api/Games/${itemId}`);
      console.log('Item excluído com sucesso');
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEditItem = (itemId) => {
    setEditingItemId(itemId);
    const itemToEdit = data.find((item) => item.id === itemId);
    setNewGame({ name: itemToEdit.name, company: itemToEdit.company });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`https://localhost:7143/api/Games/${editingItemId}`, newGame);
      console.log('Item updated successfully');
      setEditingItemId(null);
      setNewGame({ name: '', company: '' });
      fetchData();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleToggleAddFields = () => {
    setShowAddFields((prevShowAddFields) => !prevShowAddFields);
    setNewGame({ name: '', company: '' }); 
    setEditingItemId(null); 
  };

  return (
    <Container className="root">
      <Typography variant="h4" gutterBottom>Crud games:</Typography>
      <div className="form">
        {}
        {!showAddFields && (
          <Button className="button button-primary" onClick={handleToggleAddFields}>
            Add Game
          </Button>
        )}
        {showAddFields && !editingItemId && (
          <>
            <TextField
              className="textField"
              label="Name"
              name="name"
              value={newGame.name}
              onChange={handleInputChange}
            />
            <TextField
              className="textField"
              label="Company"
              name="company"
              value={newGame.company}
              onChange={handleInputChange}
            />
            <Button className="button button-primary" onClick={handleCreateItem}>
              Create
            </Button>
            <Button className="button button-secondary" onClick={handleCancelAdd}>
              Cancel
            </Button>
          </>
        )}
      </div>
      <div className="itemsListContainer">
        <List className="itemsList">
          {data.map((item) => (
            <ListItem key={item.id} className="item">
              {editingItemId === item.id ? (
                <>
                  <TextField
                    className="textField"
                    label="Name"
                    name="name"
                    value={newGame.name}
                    onChange={handleInputChange}
                  />
                  <TextField
                    className="textField"
                    label="Company"
                    name="company"
                    value={newGame.company}
                    onChange={handleInputChange}
                  />
                  <Button className="button button-primary" onClick={handleSaveEdit}>
                    Save
                  </Button>
                  <Button className="button button-secondary" onClick={() => setEditingItemId(null)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <ListItemText primary={`${item.name} - ${item.company}`} />
                  <ListItemSecondaryAction>
                    <IconButton className="edit" color="primary" onClick={() => handleEditItem(item.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton className="delete" onClick={() => handleDeleteItem(item.id)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
          ))}
        </List>
      </div>
    </Container>
  );
};

export default App;
