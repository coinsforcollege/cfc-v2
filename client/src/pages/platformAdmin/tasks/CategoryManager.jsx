import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  ArrowBack,
  Save,
  FolderOpen
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { platformAdminTaskApi } from '../../../api/platformAdminTask.api';

const CategoryManager = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    scholarshipPoints: 0,
    parent: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await platformAdminTaskApi.getAllCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingCategory(null);
    setFormData({ name: '', scholarshipPoints: 0, parent: '' });
    setShowForm(true);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      scholarshipPoints: category.scholarshipPoints,
      parent: category.parent?._id || category.parent || ''
    });
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await platformAdminTaskApi.deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleSave = async () => {
    try {
      const data = {
        name: formData.name,
        scholarshipPoints: Number(formData.scholarshipPoints),
        parent: formData.parent || null
      };

      if (editingCategory) {
        await platformAdminTaskApi.updateCategory(editingCategory._id, data);
      } else {
        await platformAdminTaskApi.createCategory(data);
      }

      setShowForm(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      const message = error.message || 'Failed to save category';
      alert(message);
    }
  };

  const renderForm = () => (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {editingCategory ? 'Edit Category' : 'Create Category'}
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Category Name *"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Scholarship Points"
              type="number"
              fullWidth
              value={formData.scholarshipPoints}
              onChange={(e) => setFormData({ ...formData, scholarshipPoints: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Parent Category"
              fullWidth
              value={formData.parent}
              onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
              helperText="Optional: Select a parent category to create a hierarchy"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories
                .filter(c => c._id !== editingCategory?._id) // Prevent selecting self as parent
                .map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setShowForm(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.name}
            startIcon={<Save />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2
            }}
          >
            Save
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/platform-admin/tasks')}>
                <ArrowBack />
            </IconButton>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    Manage Categories
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Create and manage task categories and hierarchies
                </Typography>
            </Box>
        </Box>
        {!showForm && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)'
            }}
          >
            Add Category
          </Button>
        )}
      </Box>

      {showForm ? renderForm() : (
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Parent</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Points</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FolderOpen sx={{ color: '#64748b' }} />
                            <Typography variant="body1" fontWeight={500}>{category.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {category.parent ? (
                           <Typography variant="body2" sx={{ 
                                bgcolor: '#f1f5f9', 
                                px: 1, 
                                py: 0.5, 
                                borderRadius: 1,
                                display: 'inline-block'
                           }}>
                               {category.parent.name}
                           </Typography> 
                        ) : (
                            <Typography variant="caption" color="text.secondary">Top Level</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">{category.scholarshipPoints}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleEditClick(category)} sx={{ color: '#3b82f6' }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteClick(category._id)} sx={{ color: '#ef4444' }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {categories.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No categories found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CategoryManager;
