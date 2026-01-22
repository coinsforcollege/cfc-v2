import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tab,
  Tabs,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Pagination,
  Checkbox,
  Alert
} from '@mui/material';
import {
  Add,
  Search,
  Category as CategoryIcon,
  FilterList,
  Edit,
  Visibility,
  Delete,
  Archive,
  MenuBook,
  Quiz,
  Description,
  ContentCopy
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { platformAdminTaskApi } from '../../../api/platformAdminTask.api';

const TaskList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('library'); // 'active', 'expired', 'library'
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ active: 0, expired: 0, library: 0 });
  const [selected, setSelected] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [activeTab, page, search]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search,
        status: activeTab === 'library' ? undefined : (activeTab === 'active' ? 'Active' : 'Archived') // TODO: Handle 'Expired' logic if distinct from Archived
      };
      
      // If 'expired' is a separate logical status not in enum, we need to filter by date.
      // For now assuming 'Archived' maps to 'expired' tab or similar, OR we filter by expiryDate < now.
      // The requirement says "Active, Expired, and Content Library". 
      // Library = All tasks? Or just draft/storage? "Library is a storage of all tasks". 
      // So Library request should send NO status filter.
      // Active request should send status=Active.
      // Expired request should send status=Active + date filter? Or status=Archived?
      
      const response = await platformAdminTaskApi.getAllTasks(params);
      if (response.success) {
        setTasks(response.data || []);
        setTotalPages(response.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
    setSelected([]);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(tasks.map(t => t._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      return [...prev, id];
    });
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selected.length} task(s)?`)) return;

    try {
      setBulkDeleting(true);
      await platformAdminTaskApi.bulkDeleteTasks(selected);
      setSelected([]);
      fetchTasks();
    } catch (error) {
      console.error('Error bulk deleting tasks:', error);
    } finally {
      setBulkDeleting(false);
    }
  };

  const getActivityIcon = (type) => {
      switch(type) {
          case 'MCQ Quiz': return <Quiz fontSize="small" />;
          case 'Learn': return <MenuBook fontSize="small" />;
          case 'Submission': return <Description fontSize="small" />;
          default: return <MenuBook fontSize="small" />;
      }
  };

  const getStatusChip = (status, expiryDate) => {
      let label = status;
      let color = 'default';
      
      if (status === 'Active') {
          color = 'success';
          if (expiryDate && new Date(expiryDate) < new Date()) {
              label = 'Expired';
              color = 'error';
          }
      } else if (status === 'Draft') {
          color = 'warning';
      } else if (status === 'Archived') {
          color = 'default';
      }

      return <Chip label={label} size="small" color={color} variant="outlined" />;
  };

  const handleDelete = async (id) => {
      if(window.confirm("Are you sure you want to delete this task?")) {
          try {
              await platformAdminTaskApi.deleteTask(id);
              fetchTasks();
          } catch (error) {
              console.error(error);
          }
      }
  }

  const handleDuplicate = async (id) => {
      try {
          await platformAdminTaskApi.duplicateTask(id);
          fetchTasks();
      } catch (error) {
          console.error('Error duplicating task:', error);
      }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Tasks
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Manage, create and assign tasks to students
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {}} // Placeholder
            sx={{ borderRadius: 2 }}
          >
            Task Templates
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/platform-admin/tasks/reviews')}
            sx={{ borderRadius: 2 }}
          >
            Review Requests
          </Button>
          <Button
            variant="outlined"
            startIcon={<CategoryIcon />}
            onClick={() => navigate('/platform-admin/tasks/categories')}
            sx={{ borderRadius: 2 }}
          >
            Manage Categories
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/platform-admin/tasks/create')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)'
            }}
          >
            Create Task
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 }
            }}
          >
              <Tab label="Content Library" value="library" />
              <Tab label="Active Tasks" value="active" />
              <Tab label="Expired/Archived" value="expired" />
          </Tabs>
          
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField 
                size="small" 
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
                }}
                sx={{ width: 300 }}
              />
          </Box>
      </Card>

      {/* Bulk Action Bar */}
      {selected.length > 0 && (
        <Alert
          severity="info"
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button
              color="error"
              size="small"
              startIcon={<Delete />}
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
            >
              {bulkDeleting ? 'Deleting...' : `Delete ${selected.length} selected`}
            </Button>
          }
        >
          {selected.length} task(s) selected
        </Alert>
      )}

      {/* List */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                              <Checkbox
                                indeterminate={selected.length > 0 && selected.length < tasks.length}
                                checked={tasks.length > 0 && selected.length === tasks.length}
                                onChange={handleSelectAll}
                              />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Task Title</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Grade</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Activity</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Points</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow
                              key={task._id}
                              hover
                              selected={selected.includes(task._id)}
                            >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={selected.includes(task._id)}
                                    onChange={() => handleSelectOne(task._id)}
                                  />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {task.thumbnail && (
                                            <Box 
                                                component="img" 
                                                src={task.thumbnail.startsWith('http') ? task.thumbnail : `${import.meta.env.VITE_API_URL.replace('/api', '')}${task.thumbnail}`} 
                                                sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                                            />
                                        )}
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>{task.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {task.topic?.join(', ')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {task.categories?.map(c => c.name).join(', ')}
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption" sx={{ bgcolor: '#f1f5f9', px: 1, py: 0.5, borderRadius: 1 }}>
                                        {task.grade?.length > 3 ? `${task.grade.length} Grades` : task.grade?.join(', ')}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {getActivityIcon(task.activity)}
                                        <Typography variant="body2">{task.activity}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{task.scholarshipPoints}</TableCell>
                                <TableCell>
                                    {getStatusChip(task.status, task.expiryDate)}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => navigate(`/platform-admin/tasks/${task._id}`)} title="View">
                                        <Visibility fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => navigate(`/platform-admin/tasks/edit/${task._id}`)} title="Edit">
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDuplicate(task._id)} title="Duplicate" sx={{ color: '#6366f1' }}>
                                        <ContentCopy fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(task._id)} title="Delete" sx={{ color: '#ef4444' }}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                         {tasks.length === 0 && !loading && (
                            <TableRow>
                            <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                <Typography color="text.secondary">No tasks found</Typography>
                            </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={(e, v) => setPage(v)} 
                    color="primary" 
                />
            </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TaskList;
