import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Warning,
  CheckCircle,
  OpenInNew,
  SwapHoriz,
  AccountBalanceWallet
} from '@mui/icons-material';
import { bridgeApi } from '../../api/bridge.api';
import { useToast } from '../../contexts/ToastContext';

const MigrationSection = ({ wallets = [], bridgeStatus, onMigrationComplete }) => {
  const { showToast } = useToast();
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchMigrationStatus = useCallback(async () => {
    try {
      const response = await bridgeApi.getMigrationStatus();
      if (response.success) {
        setMigrationStatus(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch migration status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMigrationStatus();
  }, [fetchMigrationStatus]);

  const handleMigrate = async () => {
    try {
      setMigrating(true);
      setConfirmOpen(false);
      const response = await bridgeApi.initiateMigration();
      if (response.success) {
        showToast('Migration completed successfully', 'success');
        fetchMigrationStatus();
        if (onMigrationComplete) onMigrationComplete();
      }
    } catch (err) {
      showToast(err.message || 'Migration failed. Your tokens are safe.', 'error');
      fetchMigrationStatus();
    } finally {
      setMigrating(false);
    }
  };

  // Don't show if not connected
  if (!bridgeStatus?.linked && !bridgeStatus?.migrated) {
    return null;
  }

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </CardContent>
      </Card>
    );
  }

  const isCompleted = migrationStatus?.hasMigration && migrationStatus?.status === 'completed';
  const isProcessing = migrationStatus?.hasMigration && migrationStatus?.status === 'processing';
  const isFailed = migrationStatus?.hasMigration && migrationStatus?.status === 'failed';

  // Compute total from wallets
  const walletsWithBalance = wallets.filter(w => w.college && w.balance > 0);
  const totalBalance = walletsWithBalance.reduce((sum, w) => sum + (w.balance || 0), 0);

  // If migration is completed, show success state
  if (isCompleted) {
    return (
      <Card sx={{
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <Box sx={{ height: 4, background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <CheckCircle sx={{ color: '#10b981', fontSize: 28 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#065f46' }}>
                Migration Complete
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {migrationStatus.totalTokensMigrated?.toFixed(4)} tokens migrated on {new Date(migrationStatus.completedAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {/* Migrated wallet breakdown */}
          {migrationStatus.walletSnapshots && migrationStatus.walletSnapshots.length > 0 && (
            <TableContainer sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem' }}>College</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem' }}>Tokens Migrated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {migrationStatus.walletSnapshots.map((ws, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{ws.collegeName}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontFamily: 'Monaco, monospace', fontWeight: 600 }}>
                          {ws.balance.toFixed(4)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, borderBottom: 'none' }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, borderBottom: 'none', fontFamily: 'Monaco, monospace' }}>
                      {migrationStatus.totalTokensMigrated?.toFixed(4)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Button
            variant="contained"
            endIcon={<OpenInNew />}
            href={`${import.meta.env.VITE_EXCHANGE_URL || 'https://exchange.intuition.com'}/college-coins`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              }
            }}
          >
            Open College Coins on Exchange
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Processing state
  if (isProcessing || migrating) {
    return (
      <Card sx={{
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <Box sx={{ height: 4, background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }} />
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress size={36} sx={{ color: '#3b82f6', mb: 2 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Migrating Balances...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your tokens are being transferred to Intuition Exchange. Please do not close this page.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Connected but not yet migrated - show migration option
  return (
    <>
      <Card sx={{
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <Box sx={{ height: 4, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SwapHoriz sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Migrate to Intuition Exchange
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Transfer all your token balances to the exchange
              </Typography>
            </Box>
          </Box>

          {/* Warning */}
          <Alert
            severity="warning"
            icon={<Warning />}
            sx={{
              mb: 2,
              borderRadius: 2,
              '& .MuiAlert-message': { fontSize: '0.8rem' }
            }}
          >
            Early bird bonuses (referral rates) will end after migration. After the migration cutoff date, all mining will move to Intuition Exchange. Active mining sessions will be stopped and their earnings finalized before migration.
          </Alert>

          {/* Failed migration alert */}
          {isFailed && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              Previous migration attempt failed: {migrationStatus.error || 'Unknown error'}. Your tokens are safe. Please try again.
            </Alert>
          )}

          {/* Balance table */}
          {walletsWithBalance.length > 0 ? (
            <TableContainer sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem' }}>College</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem' }}>Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {walletsWithBalance.map((wallet, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {wallet.college?.name || 'Unknown'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontFamily: 'Monaco, monospace', fontWeight: 600 }}>
                          {wallet.balance.toFixed(4)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, borderBottom: 'none' }}>Total to Migrate</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, borderBottom: 'none', fontFamily: 'Monaco, monospace' }}>
                      {totalBalance.toFixed(4)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3, mb: 2 }}>
              <AccountBalanceWallet sx={{ fontSize: 36, color: '#cbd5e1', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No token balances to migrate
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            startIcon={<SwapHoriz />}
            onClick={() => setConfirmOpen(true)}
            disabled={walletsWithBalance.length === 0}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              },
              '&.Mui-disabled': {
                background: '#e2e8f0',
                color: '#94a3b8'
              }
            }}
          >
            Migrate Balances ({totalBalance.toFixed(4)} tokens)
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        {/* Header accent */}
        <Box sx={{ height: 4, background: 'linear-gradient(90deg, #f59e0b, #d97706)' }} />

        <DialogTitle sx={{ pb: 0, pt: 3, px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SwapHoriz sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                Migrate to Intuition Exchange
              </Typography>
              <Typography variant="caption" color="text.secondary">
                One-time transfer of all your balances
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
          {/* What happens now */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            What happens now
          </Typography>
          <Box sx={{ mb: 2.5 }}>
            {[
              { label: 'Active miners stopped', desc: 'All running mining sessions will be stopped and earnings finalized into your wallet.' },
              { label: `${totalBalance.toFixed(4)} tokens transferred`, desc: `Balances across ${walletsWithBalance.length} college wallet${walletsWithBalance.length !== 1 ? 's' : ''} will be moved to your Exchange account.` },
              { label: 'College subscriptions copied', desc: 'Your colleges will appear on Exchange so you can continue mining there.' },
            ].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                <Box sx={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0, mt: 0.25,
                  background: '#fef3c7', border: '1px solid #fcd34d',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700, color: '#92400e'
                }}>
                  {i + 1}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{item.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* What happens after */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            After migration
          </Typography>
          <Box sx={{
            p: 2, borderRadius: 2, mb: 2,
            background: '#fffbeb', border: '1px solid #fcd34d'
          }}>
            <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 0.75, color: '#92400e', fontSize: '0.8rem' }, '& li:last-child': { mb: 0 } }}>
              <li>All mining and balances will be managed on <strong>Intuition Exchange</strong></li>
              <li>Mining on Coins for College will be <strong>disabled</strong> for your account</li>
              <li>You can continue mining the same colleges on Exchange</li>
            </Box>
          </Box>

          {/* Warning */}
          <Alert
            severity="warning"
            sx={{ borderRadius: 2, '& .MuiAlert-message': { fontSize: '0.8rem' } }}
          >
            This action cannot be undone. Early bird referral bonus rates will not carry over.
          </Alert>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{ textTransform: 'none', color: '#64748b', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleMigrate}
            startIcon={<SwapHoriz />}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              }
            }}
          >
            Migrate {totalBalance.toFixed(4)} tokens
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MigrationSection;
