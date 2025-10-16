import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  ExpandMore,
  CheckCircle,
  Warning,
  Error,
  Info
} from '@mui/icons-material';
import { platformAdminApi } from '../../api/platformAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useNavigate, useLocation } from 'react-router';

const BulkImportPreview = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const { previewData, uploadDetails } = location.state || {};

  if (!previewData) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: '800px', width: '100%', mx: 'auto', textAlign: 'center', mt: 8 }}>
          <Alert severity="error">
            No preview data found. Please upload a CSV file first.
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/platform-admin/colleges/bulk-import-upload')}
            sx={{
              mt: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Go to Upload
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

  const { toBeCreated, toBeUpdated, skipped, errors } = previewData;

  const handleConfirm = async () => {
    try {
      setLoading(true);

      const response = await platformAdminApi.bulkImportConfirm({
        country: uploadDetails.country,
        mode: uploadDetails.mode,
        toBeCreated,
        toBeUpdated
      });

      if (response.success) {
        navigate('/platform-admin/colleges/bulk-import-results', {
          state: {
            results: response.data
          }
        });
      }
    } catch (err) {
      showToast(err.message || 'Failed to import colleges', 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalProcessed = toBeCreated.length + toBeUpdated.length + skipped.length + errors.length;

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto' }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => navigate('/platform-admin/colleges/bulk-import-upload')}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 1)',
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Import Preview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review changes before importing {totalProcessed} colleges
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    To Be Created
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                  {toBeCreated.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Info sx={{ color: '#3b82f6', fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    To Be Updated
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                  {toBeUpdated.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.1)'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Warning sx={{ color: '#f59e0b', fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Skipped
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  {skipped.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Error sx={{ color: '#ef4444', fontSize: 20 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Errors
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                  {errors.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {toBeCreated.length > 0 && (
          <Accordion defaultExpanded sx={{ mb: 3, borderRadius: '12px', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircle sx={{ color: '#10b981' }} />
                <Typography variant="h6" fontWeight={600}>
                  Colleges to Create ({toBeCreated.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>City</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>State</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Zip</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Website</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Students</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Housing</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {toBeCreated.map((item, index) => {
                      const college = item.finalState;
                      return (
                        <TableRow key={index} sx={{ '&:hover': { background: 'rgba(139, 92, 246, 0.02)' } }}>
                          <TableCell sx={{ fontWeight: 600 }}>{college.name}</TableCell>
                          <TableCell>{college.address || '-'}</TableCell>
                          <TableCell>{college.city || '-'}</TableCell>
                          <TableCell>{college.state || '-'}</TableCell>
                          <TableCell>{college.zipCode || '-'}</TableCell>
                          <TableCell>
                            {college.website ? (
                              <Typography variant="caption" sx={{ color: '#3b82f6' }}>
                                {college.website.length > 30 ? college.website.slice(0, 30) + '...' : college.website}
                              </Typography>
                            ) : '-'}
                          </TableCell>
                          <TableCell>{college.studentLife?.totalStudents || '-'}</TableCell>
                          <TableCell>
                            {college.studentLife?.housing?.available !== undefined ? (
                              <Chip
                                label={college.studentLife.housing.available ? 'Yes' : 'No'}
                                size="small"
                                color={college.studentLife.housing.available ? 'success' : 'default'}
                                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                              />
                            ) : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {toBeUpdated.length > 0 && (
          <Accordion sx={{ mb: 3, borderRadius: '12px', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Info sx={{ color: '#3b82f6' }} />
                <Typography variant="h6" fontWeight={600}>
                  Colleges to Update ({toBeUpdated.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="info" sx={{ mb: 2 }}>
                Only empty fields will be updated. Existing data will not be overwritten.
              </Alert>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Changes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {toBeUpdated.map((item, index) => {
                      const changes = item.changes || {};
                      return (
                        <TableRow key={index} sx={{ '&:hover': { background: 'rgba(139, 92, 246, 0.02)' } }}>
                          <TableCell sx={{ fontWeight: 600 }}>{item.name}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {Object.keys(changes).map(field => (
                                <Chip
                                  key={field}
                                  label={field}
                                  size="small"
                                  sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontSize: '0.7rem'
                                  }}
                                />
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {skipped.length > 0 && (
          <Accordion sx={{ mb: 3, borderRadius: '12px', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Warning sx={{ color: '#f59e0b' }} />
                <Typography variant="h6" fontWeight={600}>
                  Skipped Colleges ({skipped.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {skipped.map((item, index) => (
                      <TableRow key={index} sx={{ '&:hover': { background: 'rgba(139, 92, 246, 0.02)' } }}>
                        <TableCell sx={{ fontWeight: 600 }}>{item.name}</TableCell>
                        <TableCell>{item.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {errors.length > 0 && (
          <Accordion sx={{ mb: 3, borderRadius: '12px', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Error sx={{ color: '#ef4444' }} />
                <Typography variant="h6" fontWeight={600}>
                  Errors ({errors.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="error" sx={{ mb: 2 }}>
                These colleges cannot be imported due to errors
              </Alert>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Row</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Error</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {errors.map((item, index) => (
                      <TableRow key={index} sx={{ '&:hover': { background: 'rgba(139, 92, 246, 0.02)' } }}>
                        <TableCell>{item.csvRow}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{item.data?.Name || 'N/A'}</TableCell>
                        <TableCell sx={{ color: '#ef4444' }}>{item.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        <Card
          sx={{
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Ready to Import
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {toBeCreated.length + toBeUpdated.length} colleges will be processed
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/platform-admin/colleges/bulk-import-upload')}
                  disabled={loading}
                  sx={{
                    borderColor: '#cbd5e1',
                    color: '#64748b',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#94a3b8',
                      background: 'rgba(100, 116, 139, 0.04)'
                    }
                  }}
                >
                  Back to Upload
                </Button>
                <Button
                  variant="contained"
                  onClick={handleConfirm}
                  disabled={loading || (toBeCreated.length === 0 && toBeUpdated.length === 0)}
                  startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    fontWeight: 600,
                    px: 4,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    },
                    '&:disabled': {
                      background: '#e2e8f0',
                      color: '#94a3b8'
                    }
                  }}
                >
                  {loading ? 'Importing...' : 'Confirm Import'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default BulkImportPreview;
