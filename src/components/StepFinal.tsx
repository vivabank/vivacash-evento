import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { colors } from '../theme';
import QRScanner from './QRScanner';
import { validateToken, validateCode, registerUser, ApiError } from '../services/api';
import type { StepFinalProps } from '../types';

type Status = 'idle' | 'loading' | 'error' | 'conflict';

export default function StepFinal({ formData }: StepFinalProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCodeDetected = async (raw: string) => {
    setShowScanner(false);
    setStatus('loading');
    setErrorMsg(null);

    const tokenHash = raw.includes('?') ? raw.split('?')[1] : raw;

    try {
      const validation = await validateToken(tokenHash);

      if (!validation.valid || !validation.isActive) {
        setStatus('error');
        setErrorMsg(validation.message ?? 'Token inválido ou inativo.');
        return;
      }

      if (!formData) {
        setStatus('error');
        setErrorMsg('Dados do formulário não encontrados.');
        return;
      }

      const cpfDigits = formData.cpf.replace(/\D/g, '');
      const registration = await registerUser({
        documentNumber: cpfDigits,
        personName: formData.nome,
        companyName: formData.empresa,
        position: formData.cargo,
      });

      window.location.href = `https://meuvivacash.com/code?${registration.code}`;
    } catch (err) {
      // CPF já cadastrado → status especial com opção de voltar ao formulário
      if (err instanceof ApiError && err.status === 409) {
        setStatus('conflict');
        setErrorMsg(err.displayMessage);
        return;
      }

      setStatus('error');
      setErrorMsg(err instanceof ApiError ? err.displayMessage : 'Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  const handleCodeSubmit = async () => {
    setShowCodeDialog(false);
    setStatus('loading');
    setErrorMsg(null);

    const codeValue = code.trim();
    setCode('');

    try {
      const validation = await validateCode(codeValue);

      if (!validation.valid) {
        setStatus('error');
        setErrorMsg(validation.message ?? 'Código inválido ou inativo.');
        return;
      }

      if (!formData) {
        setStatus('error');
        setErrorMsg('Dados do formulário não encontrados.');
        return;
      }

      const cpfDigits = formData.cpf.replace(/\D/g, '');
      const registration = await registerUser({
        documentNumber: cpfDigits,
        personName: formData.nome,
        companyName: formData.empresa,
        position: formData.cargo,
      });

      window.location.href = `https://meuvivacash.com/code?${registration.code}`;
    } catch (err) {
      // CPF já cadastrado → status especial com opção de voltar ao formulário
      if (err instanceof ApiError && err.status === 409) {
        setStatus('conflict');
        setErrorMsg(err.displayMessage);
        return;
      }

      setStatus('error');
      setErrorMsg(err instanceof ApiError ? err.displayMessage : 'Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: colors.navyDark,
        overflowX: 'hidden',
      }}
    >
      <Box
        component="img"
        src="/assets/hero-tech.png"
        alt=""
        sx={{
          display: 'block',
          width: '100%',
          height: { xs: '32vh', sm: '38vh' },
          objectFit: 'cover',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      />

      <Box
        sx={{
          maxWidth: 640,
          mx: 'auto',
          px: { xs: 3, sm: 5 },
          py: { xs: 1, sm: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box
          component="img"
          src="/assets/logo-white-vivatech.png"
          alt="Viva Tech"
          loading="eager"
          fetchPriority="high"
          sx={{ width: { xs: 182, sm: 58 }, mb: 3 }}
        />

        <Typography component="h1" sx={{ fontWeight: 700, lineHeight: 1.15, fontSize: { xs: 20, sm: 34 }, mb: 4 }}>
          <Box component="span" sx={{ color: '#FFFFFF' }}>
            O colaborador está no{' '}
          </Box>
          <Box component="span" sx={{ color: colors.cyan }}>
            controle do seu recebimento
          </Box>
        </Typography>

        {/* Loading */}
        {status === 'loading' && (
          <Box
            sx={{
              bgcolor: '#FFFFFF',
              borderRadius: 4,
              px: { xs: 3, sm: 5 },
              py: { xs: 5, sm: 6 },
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
            }}
          >
            <CircularProgress size={40} sx={{ color: colors.navy }} />
            <Typography sx={{ color: colors.navy, fontWeight: 600 }}>Validando e cadastrando…</Typography>
          </Box>
        )}

        {/* Error genérico */}
        {status === 'error' && (
          <Box
            sx={{
              bgcolor: '#FFFFFF',
              borderRadius: 4,
              px: { xs: 3, sm: 5 },
              py: { xs: 4, sm: 5 },
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2.5,
              boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
            }}
          >
            <Typography sx={{ color: 'error.main', fontWeight: 600, fontSize: { xs: 15, sm: 16 } }}>
              {errorMsg}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ py: 1.1 }}
              onClick={() => {
                setStatus('idle');
                setErrorMsg(null);
              }}
            >
              Tentar novamente
            </Button>
          </Box>
        )}

        {/* CPF já cadastrado (409) */}
        {status === 'conflict' && (
          <Box
            sx={{
              bgcolor: '#FFFFFF',
              borderRadius: 4,
              px: { xs: 3, sm: 5 },
              py: { xs: 4, sm: 5 },
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2.5,
              boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
            }}
          >
            {/* Ícone de aviso */}
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'rgba(237, 108, 2, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
              }}
            >
              ⚠️
            </Box>

            <Typography
              sx={{
                color: '#B45309',
                fontWeight: 700,
                fontSize: { xs: 15, sm: 17 },
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              CPF já cadastrado neste evento
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ py: 1.1, width: '100%', maxWidth: 280 }}
                onClick={() => (window.location.href = 'https://www.vivafintech.com.br/')}
              >
                Encerrar
              </Button>
            </Box>
          </Box>
        )}

        {/* Idle — card ou scanner */}
        {status === 'idle' &&
          (!showScanner ? (
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: 4,
                px: { xs: 3, sm: 5 },
                py: { xs: 4, sm: 5 },
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
              }}
            >
              <Typography sx={{ color: colors.navy, fontSize: { xs: 14.5, sm: 16 }, lineHeight: 1.6, mb: 2 }}>
                A partir de agora, você vivenciará exatamente a mesma jornada que um colaborador real teria ao solicitar
                sua antecipação.
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: 14, sm: 15 },
                  lineHeight: 1.6,
                  mb: 3.5,
                }}
              >
                O próximo passo é o Opt-in da Viva Cash. É fundamental ressaltar que este processo é 100% opcional. O
                colaborador entra efetivamente para o ecossistema Viva Cash se desejar antecipar seus valores; caso
                contrário, seu fluxo de recebimento padrão via folha de pagamento permanece inalterado.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <Button
                  onClick={() => setShowScanner(true)}
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ py: 1.1, minWidth: { xs: '100%', sm: 200 } }}
                >
                  Entrar via QR Code
                </Button>
                <Button
                  onClick={() => setShowCodeDialog(true)}
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ py: 1.1, minWidth: { xs: '100%', sm: 200 } }}
                >
                  Entrar via Código
                </Button>
              </Box>
            </Box>
          ) : (
            <QRScanner onCancel={() => setShowScanner(false)} onCodeDetected={handleCodeDetected} />
          ))}
      </Box>

      {/* Dialog para entrada de código */}
      <Dialog open={showCodeDialog} onClose={() => setShowCodeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: colors.navy, fontWeight: 600 }}>Entrar via Código</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Código"
            type="text"
            fullWidth
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowCodeDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleCodeSubmit} variant="contained" color="primary" disabled={!code.trim()}>
            Entrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
