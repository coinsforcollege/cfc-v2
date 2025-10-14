import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Close,
  Share as ShareIcon,
  Download,
  ContentCopy,
  CheckCircle
} from '@mui/icons-material';
import { generateShareImage } from '../utils/shareImageGenerator';

const ShareDialog = ({ open, onClose, shareData }) => {
  const [imageBlob, setImageBlob] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && shareData) {
      generateImage();
    }
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [open, shareData]);


  const generateImage = async () => {
    setLoading(true);
    setError('');
    try {
      const blob = await generateShareImage({
        collegeName: shareData.collegeName,
        collegeLogo: shareData.collegeLogo,
        balance: shareData.balance,
        isGeneral: shareData.isGeneral
      });
      setImageBlob(blob);
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      console.error('Failed to generate image:', err);
      setError('Failed to generate share image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!imageBlob || !shareData) return;

    const file = new File([imageBlob], 'cfc-share.png', { type: 'image/png' });

    const fullPayload = {
      files: [file],
      text: shareData.text,
      url: shareData.url
    };

    const fileOnlyPayload = {
      files: [file]
    };

    try {
      if (navigator.canShare(fullPayload)) {
        await navigator.share(fullPayload);
      } else if (navigator.canShare(fileOnlyPayload)) {
        await navigator.share(fileOnlyPayload);
      } else {
        throw new Error('Sharing not supported');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
        setError('Share failed. Please try downloading the image and copying the text instead.');
      }
    }
  };

  const handleDownload = () => {
    if (!imageBlob) return;

    const url = URL.createObjectURL(imageBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cfc-${shareData.collegeName.replace(/\s+/g, '-').toLowerCase()}-share.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    if (!shareData) return;

    const textToCopy = `${shareData.text}\n\n${shareData.url}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setImageBlob(null);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
    setError('');
    setCopied(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)'
        }
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 2.5,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ShareIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
            Share
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3, px: 2.5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress sx={{ color: '#8b5cf6' }} />
          </Box>
        ) : (
          <>
            {imageUrl && (
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                  boxShadow: '0 2px 12px rgba(139, 92, 246, 0.08)',
                  mb: 2
                }}
              >
                <img
                  src={imageUrl}
                  alt="Share preview"
                  style={{ width: '100%', display: 'block' }}
                />
              </Box>
            )}

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: 'rgba(139, 92, 246, 0.03)',
                border: '1px solid rgba(139, 92, 246, 0.1)'
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', display: 'block', mb: 0.5 }}>
                Message
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.875rem', mb: 1 }}>
                {shareData?.text}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', display: 'block', mb: 0.5 }}>
                Link
              </Typography>
              <Typography variant="body2" sx={{ color: '#8b5cf6', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                {shareData?.url}
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: '1px solid rgba(139, 92, 246, 0.1)',
          px: 2.5,
          py: 2,
          gap: 1,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)'
        }}
      >
        <Button
          onClick={handleDownload}
          startIcon={<Download />}
          disabled={loading || !imageBlob}
          variant="outlined"
          size="small"
          sx={{
            textTransform: 'none',
            color: '#64748b',
            fontWeight: 600,
            borderColor: '#cbd5e1',
            '&:hover': {
              backgroundColor: 'rgba(100, 116, 139, 0.04)',
              borderColor: '#94a3b8'
            }
          }}
        >
          Download
        </Button>

        <Button
          onClick={handleCopyText}
          startIcon={copied ? <CheckCircle /> : <ContentCopy />}
          disabled={loading}
          size="small"
          sx={{
            textTransform: 'none',
            color: copied ? '#22c55e' : '#64748b',
            fontWeight: 600,
            borderColor: copied ? '#22c55e' : '#cbd5e1',
            '&:hover': {
              backgroundColor: copied ? 'rgba(34, 197, 94, 0.04)' : 'rgba(100, 116, 139, 0.04)',
              borderColor: copied ? '#22c55e' : '#94a3b8'
            }
          }}
          variant="outlined"
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>

        <Button
          onClick={handleShare}
          startIcon={<ShareIcon />}
          disabled={loading || !imageBlob || !navigator.share}
          variant="contained"
          size="small"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 1.5,
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #633a8a 100%)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
            },
            '&:disabled': {
              background: '#e2e8f0',
              color: '#94a3b8'
            }
          }}
        >
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
