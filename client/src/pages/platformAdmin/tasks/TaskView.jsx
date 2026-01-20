import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper
} from '@mui/material';
import {
  Edit,
  ArrowBack,
  AttachFile,
  Image as ImageIcon,
  CheckCircle,
  Link as LinkIcon,
  Event
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { platformAdminTaskApi } from '../../../api/platformAdminTask.api';

const TaskView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const res = await platformAdminTaskApi.getTaskById(id);
      if (res.success) setTask(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = (path) => {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '';
      return `${baseUrl}${path}`;
  };

  if (!task && !loading) return <Typography>Task not found</Typography>;
  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/platform-admin/tasks')}>
                <ArrowBack />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Task Details
            </Typography>
        </Box>
        <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/platform-admin/tasks/edit/${task._id}`)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2
            }}
        >
            Edit Task
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>
          {/* Main Content */}
          <Box sx={{ flex: { md: '2' }, width: '100%' }}>
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent>
                      <Box sx={{ mb: 3 }}>
                          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{task.title}</Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip label={task.status} color={task.status === 'Active' ? 'success' : 'default'} size="small" />
                                {task.categories.map(c => <Chip key={c._id} label={c.name} variant="outlined" size="small" />)}
                                {task.topic.map(t => <Chip key={t} label={t} variant="outlined" size="small" sx={{ borderColor: 'transparent', bgcolor: '#f1f5f9' }} />)}
                          </Box>
                      </Box>
                      
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Description</Typography>
                      <Typography variant="body1" color="text.secondary" paragraph>
                          {task.description}
                      </Typography>
                      
                      {task.thumbnail && (
                          <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>Thumbnail</Typography>
                              <Box component="img" src={getFileUrl(task.thumbnail)} sx={{ maxWidth: '100%', maxHeight: 300, borderRadius: 2 }} />
                          </Box>
                      )}
                  </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Files & Resources</Typography>
                      {task.files.length > 0 ? (
                          <List>
                              {task.files.map((file, i) => (
                                  <ListItem key={i} component={Paper} elevation={0} sx={{ bgcolor: '#f8fafc', mb: 1, borderRadius: 2 }}>
                                      <ListItemIcon>
                                          {file.type === 'image' ? <ImageIcon color="primary" /> : <AttachFile color="action" />}
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary={file.name} 
                                        secondary={<a href={getFileUrl(file.url)} target="_blank" rel="noopener noreferrer">Download / View</a>}
                                      />
                                  </ListItem>
                              ))}
                          </List>
                      ) : (
                          <Typography color="text.secondary">No files attached</Typography>
                      )}
                  </CardContent>
              </Card>
          </Box>

          {/* Sidebar */}
          <Box sx={{ flex: { md: '1' }, width: '100%' }}>
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Details</Typography>
                      <List dense>
                          <ListItem>
                              <ListItemText primary="Difficulty" secondary={`${task.difficulty}/10`} />
                          </ListItem>
                          <Divider component="li" />
                          <ListItem>
                              <ListItemText primary="Activity Type" secondary={task.activity} />
                          </ListItem>
                          <Divider component="li" />
                          <ListItem>
                              <ListItemText primary="Scholarship Points" secondary={task.scholarshipPoints} />
                          </ListItem>
                          <Divider component="li" />
                          <ListItem>
                              <ListItemText primary="Requires Approval" secondary={task.requiresApproval ? 'Yes' : 'No'} />
                          </ListItem>
                          <Divider component="li" />
                           <ListItem>
                              <ListItemText primary="Grades" secondary={task.grade.join(', ')} />
                          </ListItem>
                          {task.expiryDate && (
                              <>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary="Expiry Date" secondary={new Date(task.expiryDate).toLocaleDateString()} />
                                </ListItem>
                              </>
                          )}
                      </List>
                  </CardContent>
              </Card>

              {(task.ctaLink || task.ctaLabel) && (
                   <Card sx={{ borderRadius: 3 }}>
                       <CardContent>
                           <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Call to Action</Typography>
                           <Button 
                                variant="contained" 
                                fullWidth 
                                href={task.ctaLink} 
                                target="_blank"
                                startIcon={<LinkIcon />}
                                sx={{ borderRadius: 2 }}
                            >
                                {task.ctaLabel || 'Action'}
                            </Button>
                       </CardContent>
                   </Card>
              )}
          </Box>
      </Box>
    </Box>
  );
};

export default TaskView;
