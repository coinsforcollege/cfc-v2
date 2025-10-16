import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CheckCircle,
  Error,
  ArrowBack,
  Refresh
} from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useNavigate, useLocation } from 'react-router';

const BulkImportResults = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { results } = location.state || {};

  if (!results) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: '800px', width: '100%', mx: 'auto', textAlign: 'center', mt: 8 }}>
          <Alert severity="error">
            No results found. Please start a new import.
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/platform-admin/colleges/bulk-import-upload')}
            sx={{
              mt: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Start New Import
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

  const { created, updated, failed } = results;

  const totalSuccess = (created?.length || 0) + (updated?.length || 0);
  const totalFailed = failed?.length || 0;

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: '1000px', width: '100%', mx: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Import Complete
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Import summary and results
          </Typography>
        </Box>

        <Card
          sx={{
            borderRadius: '20px',
            background: totalFailed === 0
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
            border: totalFailed === 0
              ? '1px solid rgba(16, 185, 129, 0.2)'
              : '1px solid rgba(245, 158, 11, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            mb: 4
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            {totalFailed === 0 ? (
              <CheckCircle sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
            ) : (
              <Error sx={{ fontSize: 64, color: '#f59e0b', mb: 2 }} />
            )}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {totalFailed === 0
                ? 'All Colleges Imported Successfully'
                : 'Import Completed with Some Errors'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {totalSuccess} colleges processed successfully
              {totalFailed > 0 && `, ${totalFailed} failed`}
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                  Created
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                  {created?.length || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                  Updated
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                  {updated?.length || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                  Failed
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#ef4444' }}>
                  {failed?.length || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {created && created.length > 0 && (
          <Card
            sx={{
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              mb: 3
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981', mb: 2 }}>
                Successfully Created ({created.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                {created.map((college, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={college.name}
                      secondary={`${college.city || ''}, ${college.state || ''}`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {updated && updated.length > 0 && (
          <Card
            sx={{
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              mb: 3
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#3b82f6', mb: 2 }}>
                Successfully Updated ({updated.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                {updated.map((college, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: '#3b82f6', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={college.name}
                      secondary={`${college.city || ''}, ${college.state || ''}`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {failed && failed.length > 0 && (
          <Card
            sx={{
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              mb: 3
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444', mb: 2 }}>
                Failed ({failed.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                {failed.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Error sx={{ color: '#ef4444', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name || 'Unknown'}
                      secondary={item.error}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ color: '#ef4444' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/platform-admin/colleges')}
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#764ba2',
                background: 'rgba(102, 126, 234, 0.04)'
              }
            }}
          >
            Back to Colleges
          </Button>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={() => navigate('/platform-admin/colleges/bulk-import-upload')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b42a0 100%)',
              }
            }}
          >
            Import More Colleges
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default BulkImportResults;
