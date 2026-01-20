import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Rating,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputAdornment
} from '@mui/material';
import {
  Save,
  ArrowBack,
  CloudUpload,
  AttachFile,
  Delete,
  Image as ImageIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { platformAdminTaskApi } from '../../../api/platformAdminTask.api';

const TaskCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // if id exists, we are editing
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [topicInput, setTopicInput] = useState('');
  const [grades, setGrades] = useState([]);
  const [difficulty, setDifficulty] = useState(5);
  const [activity, setActivity] = useState('Learn');
  const [scholarshipPoints, setScholarshipPoints] = useState(0);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [ctaLink, setCtaLink] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [status, setStatus] = useState('Draft');
  const [expiryDate, setExpiryDate] = useState('');
  
  // Files
  const [selectedFiles, setSelectedFiles] = useState([]); // New files to upload
  const [existingFiles, setExistingFiles] = useState([]); // Files already on server (for edit)
  const [thumbnail, setThumbnail] = useState(''); // Selected thumbnail URL

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchTaskDetails();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await platformAdminTaskApi.getAllCategories();
      if (res.success) setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const res = await platformAdminTaskApi.getTaskById(id);
      if (res.success) {
        const t = res.data;
        setTitle(t.title);
        setDescription(t.description || '');
        setSelectedCategories(t.categories.map(c => c._id));
        setTopics(t.topic || []);
        setGrades(t.grade || []);
        setDifficulty(t.difficulty);
        setActivity(t.activity);
        setScholarshipPoints(t.scholarshipPoints);
        setRequiresApproval(t.requiresApproval);
        setCtaLink(t.ctaLink || '');
        setCtaLabel(t.ctaLabel || '');
        setStatus(t.status);
        setExpiryDate(t.expiryDate ? t.expiryDate.split('T')[0] : '');
        setExistingFiles(t.files || []);
        setThumbnail(t.thumbnail || '');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  const handleAddTopic = () => {
      if (topicInput.trim()) {
          setTopics([...topics, topicInput.trim()]);
          setTopicInput('');
      }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categories', JSON.stringify(selectedCategories));
      formData.append('topic', JSON.stringify(topics));
      formData.append('grade', JSON.stringify(grades));
      formData.append('difficulty', difficulty);
      formData.append('activity', activity);
      formData.append('scholarshipPoints', scholarshipPoints);
      formData.append('requiresApproval', requiresApproval);
      formData.append('ctaLink', ctaLink);
      formData.append('ctaLabel', ctaLabel);
      formData.append('status', status);
      if (expiryDate) formData.append('expiryDate', expiryDate);
      
      // Handle Thumbnail
      // If user selected a new file as thumbnail logic could be complex. 
      // For now, if thumbnail is a string (URL) and matches existing file, send it.
      if (thumbnail) formData.append('thumbnail', thumbnail);

      // Existing files to keep
      formData.append('existingFiles', JSON.stringify(existingFiles));

      // Append new files
      selectedFiles.forEach(file => {
          formData.append('files', file);
      });

      if (isEdit) {
        await platformAdminTaskApi.updateTask(id, formData);
      } else {
        await platformAdminTaskApi.createTask(formData);
      }

      navigate('/platform-admin/tasks');
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task');
    } finally {
      setLoading(false);
    }
  };


  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    // Create preview URLs for images
    const newFiles = files.map(file => {
        Object.defineProperty(file, 'preview', {
            value: URL.createObjectURL(file),
            writable: true
        });
        return file;
    });
    setSelectedFiles(prev => [...prev, ...newFiles]);
    
    // Auto-set thumbnail if none exists
    const firstImage = newFiles.find(f => f.type.startsWith('image/'));
    if (firstImage && !thumbnail) {
       // logic for auto-thumbnail
    }
  };

  const getFileUrl = (path) => {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '';
      return `${baseUrl}${path}`;
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingFile = (url) => {
      setExistingFiles(prev => prev.filter(f => f.url !== url));
  };

  const gradeOptions = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/platform-admin/tasks')}>
                <ArrowBack />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {isEdit ? 'Edit Task' : 'Create New Task'}
            </Typography>
        </Box>
        <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={!title || !selectedCategories.length || !grades.length}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2
            }}
        >
            {isEdit ? 'Update Task' : 'Create Task'}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>
          {/* Main Content - 2/3 Width */}
          <Box sx={{ flex: { md: '2' }, width: '100%' }}>
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <TextField 
                          label="Task Title *" 
                          fullWidth 
                          value={title} 
                          onChange={(e) => setTitle(e.target.value)} 
                          required
                      />
                      <TextField 
                          label="Description" 
                          fullWidth 
                          multiline 
                          rows={4}
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)} 
                      />
                      
                      <Box>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>Categories *</Typography>
                          <Select
                              multiple
                              fullWidth
                              value={selectedCategories}
                              onChange={(e) => setSelectedCategories(e.target.value)}
                              renderValue={(selected) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {selected.map((value) => {
                                          const cat = categories.find(c => c._id === value);
                                          return <Chip key={value} label={cat?.name} size="small" />;
                                      })}
                                  </Box>
                              )}
                          >
                              {categories.map((cat) => (
                                  <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                              ))}
                          </Select>
                      </Box>

                      <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Topics</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <TextField 
                                    size="small" 
                                    value={topicInput} 
                                    onChange={(e) => setTopicInput(e.target.value)}
                                    placeholder="Add custom topic"
                                />
                                <Button variant="outlined" onClick={handleAddTopic}>Add</Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {topics.map((t, i) => (
                                    <Chip key={i} label={t} onDelete={() => setTopics(topics.filter((_, idx) => idx !== i))} />
                                ))}
                            </Box>
                      </Box>
                  </CardContent>
              </Card>

              {/* Files */}
              <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>Files & Visuals</Typography>
                      
                      <Box sx={{ border: '2px dashed #e2e8f0', borderRadius: 2, p: 4, textAlign: 'center', mb: 3 }}>
                          <input
                              type="file"
                              multiple
                              id="file-upload"
                              style={{ display: 'none' }}
                              onChange={handleFileChange}
                          />
                          <label htmlFor="file-upload">
                              <Button component="span" startIcon={<CloudUpload />}>
                                  Upload Files
                              </Button>
                          </label>
                          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                              Images will be used as thumbnails. Documents supported.
                          </Typography>
                      </Box>

                      <List>
                          {existingFiles.map((file, index) => (
                              <ListItem key={index} secondaryAction={
                                  <IconButton edge="end" onClick={() => removeExistingFile(file.url)}>
                                      <Delete />
                                  </IconButton>
                              }>
                                  <ListItemIcon>
                                      {file.type === 'image' ? (
                                        <Box 
                                            component="img" 
                                            src={getFileUrl(file.url)}
                                            sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }} 
                                        />
                                      ) : <AttachFile />}
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={file.name} 
                                    secondary={file.type === 'image' && <Button size="small" onClick={() => setThumbnail(file.url)} disabled={thumbnail === file.url}>{thumbnail === file.url ? 'Current Thumbnail' : 'Set as Thumbnail'}</Button>} 
                                  />
                              </ListItem>
                          ))}
                           {selectedFiles.map((file, index) => (
                              <ListItem key={`new-${index}`} secondaryAction={
                                  <IconButton edge="end" onClick={() => removeFile(index)}>
                                      <Delete />
                                  </IconButton>
                              }>
                                  <ListItemIcon>
                                      {file.type.startsWith('image/') ? (
                                        <Box 
                                            component="img" 
                                            src={file.preview}
                                            sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }} 
                                        />
                                      ) : <AttachFile />}
                                  </ListItemIcon>
                                  <ListItemText primary={file.name} secondary="New Upload" />
                              </ListItem>
                          ))}
                      </List>
                  </CardContent>
              </Card>
          </Box>

          {/* Sidebar - 1/3 Width */}
          <Box sx={{ flex: { md: '1' }, width: '100%' }}>
              <Card sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField 
                            select 
                            label="Status" 
                            fullWidth 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="Draft">Draft</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Archived">Archived</MenuItem>
                        </TextField>

                        <TextField 
                             label="Expiry Date" 
                             type="date" 
                             fullWidth 
                             InputLabelProps={{ shrink: true }}
                             value={expiryDate}
                             onChange={(e) => setExpiryDate(e.target.value)}
                        />

                        <FormControlLabel
                             control={<Switch checked={requiresApproval} onChange={(e) => setRequiresApproval(e.target.checked)} />}
                             label="Requires Approval"
                        />
                   </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3, mb: 3 }}>
                   <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Box>
                             <Typography variant="subtitle2" sx={{ mb: 1 }}>Difficulty (1-10)</Typography>
                             <Rating 
                                name="difficulty" 
                                value={difficulty} 
                                max={10} 
                                onChange={(e, v) => setDifficulty(v)} 
                             />
                        </Box>

                        <TextField 
                             select
                             label="Activity Type"
                             fullWidth
                             value={activity}
                             onChange={(e) => setActivity(e.target.value)}
                        >
                            <MenuItem value="Learn">Learn</MenuItem>
                            <MenuItem value="MCQ Quiz">MCQ Quiz</MenuItem>
                            <MenuItem value="Submission">Submission</MenuItem>
                            <MenuItem value="Script">Script</MenuItem>
                        </TextField>

                        <TextField 
                             label="Scholarship Points"
                             type="number"
                             fullWidth
                             value={scholarshipPoints}
                             onChange={(e) => setScholarshipPoints(e.target.value)}
                        />

                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Grades *</Typography>
                             <Select
                                  multiple
                                  fullWidth
                                  value={grades}
                                  onChange={(e) => {
                                      const val = e.target.value;
                                      if (val.includes('all')) {
                                          if (grades.length === gradeOptions.length) {
                                              setGrades([]);
                                          } else {
                                              setGrades(gradeOptions);
                                          }
                                      } else {
                                          setGrades(val);
                                      }
                                  }}
                                  renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.length === gradeOptions.length ? 
                                            <Chip label="All Grades" size="small" color="primary" /> : 
                                            selected.map((v) => <Chip key={v} label={v} size="small" />)
                                        }
                                    </Box>
                                  )}
                              >
                                  <MenuItem value="all">
                                      <em>{grades.length === gradeOptions.length ? 'Deselect All' : 'Select All'}</em>
                                  </MenuItem>
                                  {gradeOptions.map((g) => (
                                      <MenuItem key={g} value={g}>{g}</MenuItem>
                                  ))}
                              </Select>
                        </Box>
                   </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3 }}>
                   <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField 
                             label="CTA Label"
                             fullWidth
                             value={ctaLabel}
                             onChange={(e) => setCtaLabel(e.target.value)}
                        />
                        <TextField 
                             label="CTA Link"
                             fullWidth
                             value={ctaLink}
                             onChange={(e) => setCtaLink(e.target.value)}
                        />
                   </CardContent>
              </Card>
          </Box>
      </Box>
    </Box>
  );
};

export default TaskCreate;
