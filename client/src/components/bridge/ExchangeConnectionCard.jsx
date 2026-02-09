import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  LinkOff,
  Link as LinkIcon,
  CheckCircle,
  OpenInNew,
  SwapHoriz
} from '@mui/icons-material';
import { bridgeApi } from '../../api/bridge.api';
import { useToast } from '../../contexts/ToastContext';

const ExchangeConnectionCard = ({ onStatusChange }) => {
  const { showToast } = useToast();
  const [bridgeStatus, setBridgeStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const response = await bridgeApi.getStatus();
      if (response.success) {
        setBridgeStatus(response.data);
        if (onStatusChange) {
          onStatusChange(response.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch bridge status:', err);
    } finally {
      setLoading(false);
    }
  }, [onStatusChange]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleConnect = async () => {
    try {
      setActionLoading('connect');
      const response = await bridgeApi.initiateLink();
      if (response.success && response.data?.authorizeUrl) {
        window.location.href = response.data.authorizeUrl;
      }
    } catch (err) {
      showToast(err.message || 'Failed to initiate connection', 'error');
    } finally {
      setActionLoading('');
    }
  };

  const handleDisconnect = async () => {
    try {
      setActionLoading('disconnect');
      const response = await bridgeApi.unlink();
      if (response.success) {
        showToast('Exchange account disconnected', 'success');
        fetchStatus();
      }
    } catch (err) {
      showToast(err.message || 'Failed to disconnect', 'error');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return (
      <Card sx={{
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}>
        <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
          <CircularProgress size={24} />
        </CardContent>
      </Card>
    );
  }

  const isConnected = bridgeStatus?.linked === true;
  const isMigrated = bridgeStatus?.migrated === true;

  return (
    <Card sx={{
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Top accent */}
      <Box sx={{
        height: 4,
        background: isMigrated
          ? 'linear-gradient(90deg, #10b981, #34d399)'
          : isConnected
            ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
            : 'linear-gradient(90deg, #667eea, #764ba2)'
      }} />

      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: isMigrated
                ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                : isConnected
                  ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SwapHoriz sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                Intuition Exchange
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Bridge your tokens to the exchange
              </Typography>
            </Box>
          </Box>

          {/* Status badge */}
          <Chip
            icon={isMigrated || isConnected ? <CheckCircle sx={{ fontSize: 14 }} /> : undefined}
            label={isMigrated ? 'Migrated' : isConnected ? 'Connected' : 'Not Connected'}
            size="small"
            sx={{
              height: 24,
              fontWeight: 600,
              fontSize: '0.7rem',
              ...(isMigrated ? {
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                '& .MuiChip-icon': { color: '#10b981' }
              } : isConnected ? {
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#3b82f6',
                '& .MuiChip-icon': { color: '#3b82f6' }
              } : {
                background: 'rgba(100, 116, 139, 0.1)',
                border: '1px solid rgba(100, 116, 139, 0.3)',
                color: '#64748b'
              })
            }}
          />
        </Box>

        {/* Connected state details */}
        {isConnected && !isMigrated && (
          <Box sx={{
            p: 2,
            borderRadius: 2,
            background: 'rgba(59, 130, 246, 0.04)',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            mb: 2
          }}>
            {bridgeStatus.exchangeEmail && (
              <Typography variant="body2" sx={{ color: '#475569', mb: 0.5 }}>
                <strong>Exchange Email:</strong> {bridgeStatus.exchangeEmail}
              </Typography>
            )}
            {bridgeStatus.linkedAt && (
              <Typography variant="caption" color="text.secondary">
                Connected {new Date(bridgeStatus.linkedAt).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        )}

        {/* Migrated state */}
        {isMigrated && (
          <Box sx={{
            p: 2,
            borderRadius: 2,
            background: 'rgba(16, 185, 129, 0.04)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            mb: 2
          }}>
            <Typography variant="body2" sx={{ color: '#065f46', fontWeight: 600 }}>
              Your tokens have been migrated to Intuition Exchange.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              All mining is now managed on the exchange.
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {!isConnected && !isMigrated && (
            <Button
              variant="contained"
              startIcon={actionLoading === 'connect' ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <LinkIcon />}
              onClick={handleConnect}
              disabled={actionLoading === 'connect'}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4193 100%)',
                }
              }}
            >
              Connect Exchange Account
            </Button>
          )}

          {isConnected && !isMigrated && (
            <Button
              variant="outlined"
              startIcon={actionLoading === 'disconnect' ? <CircularProgress size={16} /> : <LinkOff />}
              onClick={handleDisconnect}
              disabled={actionLoading === 'disconnect'}
              size="small"
              sx={{
                textTransform: 'none',
                borderColor: '#ef4444',
                color: '#ef4444',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#dc2626',
                  background: 'rgba(239, 68, 68, 0.05)'
                }
              }}
            >
              Disconnect
            </Button>
          )}

          {isMigrated && (
            <Button
              variant="contained"
              endIcon={<OpenInNew />}
              href={`${import.meta.env.VITE_EXCHANGE_URL || 'https://exchange.intuition.com'}/mining`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                }
              }}
            >
              Open Intuition Exchange
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExchangeConnectionCard;
