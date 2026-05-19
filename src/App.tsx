import { useEffect, useMemo, useRef, useState } from 'react';
import { DeviceService } from '@services/DeviceService';
import { QRCodeService } from '@services/QRCodeService';
import { createRegistrationData, formatRegistrationData } from '@utils/index';
import type { FormData, RegistrationData } from '@app-types/index';

type Stage = 'onboarding' | 'form' | 'camera' | 'result';

const ICON_GLYPHS: Record<string, string> = {
    check: '✓',
    'arrows-right-left': '⇄',
    clock: '◷',
    qrcode: '▣',
    'shield-check': '🛡',
    'building-bank': '◫',
    'chart-line': '↗',
    'file-invoice': '₿',
    bell: '◔',
};

const ONBOARDING_SLIDES = [
    {
        icon: '✓',
        iconBg: '#fff',
        iconColor: '#16a34a',
        cards: [
            { icon: 'arrows-right-left', bg: '#ffff', color: '#2563eb', title: 'Transferência realizada', sub: 'Pix enviado com sucesso' },
        ],
        title: 'Antecipe seus recebíveis na hora',
        description: 'Receba antes do prazo com taxas justas e sem burocracia.',
    },
    {
        cards: [
            { icon: 'shield-check', bg: '#ffff', color: '#2563eb', title: '100% seguro e criptografado', sub: 'Seus dados protegidos' },
        ],
        title: 'Transferências Pix simples e seguras',
        description: 'Envie e receba com qualquer chave em segundos.',
    },
];

export function App() {
    const [isMobile, setIsMobile] = useState(true);
    const [stage, setStage] = useState<Stage>('onboarding');
    const [onboardingSlide, setOnboardingSlide] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        document: '',
        company: '',
    });
    const [savedFormData, setSavedFormData] = useState<FormData | null>(null);
    const [qrData, setQrData] = useState('');
    const [cameraError, setCameraError] = useState('');

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        setIsMobile(DeviceService.isMobile());
    }, []);

    useEffect(() => {
        if (stage !== 'camera') {
            stopCamera();
            return;
        }
        void startCamera();
        return () => { stopCamera(); };
    }, [stage]);

    const registrationData = useMemo<RegistrationData | null>(() => {
        if (!savedFormData || !qrData) return null;
        return createRegistrationData(savedFormData, qrData);
    }, [savedFormData, qrData]);

    const startCamera = async () => {
        setCameraError('');
        try {
            if (!DeviceService.supportsWebRTC()) {
                setCameraError('Seu navegador nao suporta acesso a camera.');
                setStage('form');
                return;
            }
            const stream = await DeviceService.requestCameraPermission();
            mediaStreamRef.current = stream;
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas) throw new Error('Elementos de camera nao encontrados.');
            video.srcObject = stream;
            QRCodeService.startScanning(video, canvas, (code) => {
                setQrData(code);
                setStage('result');
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido';
            setCameraError(message);
            setStage('form');
        }
    };

    const stopCamera = () => {
        QRCodeService.stopScanning();
        if (mediaStreamRef.current) {
            QRCodeService.stopMediaStream(mediaStreamRef.current);
            mediaStreamRef.current = null;
        }
    };

    const onNextSlide = () => {
        if (onboardingSlide < ONBOARDING_SLIDES.length - 1) {
            setOnboardingSlide((prev) => prev + 1);
            return;
        }

        setStage('form');
    };

    const onSkipOnboarding = () => {
        setStage('form');
    };

    const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formData.fullName.trim() || !formData.document.trim() || !formData.company.trim()) return;
        setSavedFormData(formData);
        setQrData('');
        setStage('camera');
    };

    const onCancelCamera = () => {
        setStage('form');
        setQrData('');
    };

    const onFinish = () => {
        if (!registrationData) return;
        console.log('Registro completo:', registrationData);
        alert(formatRegistrationData(registrationData));
        setFormData({ fullName: '', document: '', company: '' });
        setSavedFormData(null);
        setQrData('');
        setStage('form');
    };

    //   if (!isMobile) {
    //     return (
    //       <div className="container error-container">
    //         <h1>Acesso Apenas Mobile</h1>
    //         <p>Este aplicativo so funciona em dispositivos moveis.</p>
    //         <p>Abra no seu smartphone para continuar.</p>
    //       </div>
    //     );
    //   }

    const isLastSlide = onboardingSlide === ONBOARDING_SLIDES.length - 1;
    const currentSlide = ONBOARDING_SLIDES[onboardingSlide];

    if (!isMobile) {
        return (
            <div className="container">
                <section className="error-container">
                    <div className="section-header">
                        <div>
                            <h1>Acesso restrito</h1>
                            <p>Abra este sistema no seu smartphone para continuar.</p>
                        </div>
                    </div>
                    <p className="error-description">
                        Este fluxo foi desenhado para leitura de QR Code com câmera frontal.
                    </p>
                </section>
            </div>
        );
    }

    return (
        <div className="container">
            {stage === 'onboarding' && (
                <section className="onboarding-section">
                    <div className="onboarding-header">
                        <img src="/src/assets/logo.svg" alt="VIVA.cash" className="onboarding-logo-mark" />
                    </div>
                    <div>
                        <div className="onboarding-illustration">
                            {currentSlide.cards.map((card, i) => (
                                <div
                                    key={i}
                                    className="onboarding-card"
                                    style={{ opacity: 1 - i * 0.15, transform: `scale(${1 - i * 0.04})` }}
                                >
                                    <div className="onboarding-card-icon" style={{ background: card.bg, color: card.color }}>
                                        <span>{ICON_GLYPHS[card.icon] ?? '•'}</span>
                                    </div>
                                    <div className="onboarding-card-text">
                                        <p>{card.title}</p>
                                        <span>{card.sub}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='onboarding-case-text'>
                            <div className="onboarding-text">
                                <h2>{currentSlide.title}</h2>
                                <p>{currentSlide.description}</p>
                            </div>

                            <div className="onboarding-dots">
                                {ONBOARDING_SLIDES.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`onboarding-dot${i === onboardingSlide ? ' active' : ''}`}
                                        onClick={() => setOnboardingSlide(i)}
                                        aria-label={`Slide ${i + 1}`}
                                    />
                                ))}
                            </div>

                            <button className="btn-submit" onClick={onNextSlide}>
                                {isLastSlide ? 'Começar' : 'Próximo ›'}
                            </button>

                            {!isLastSlide && (
                                <button className="btn-skip" onClick={onSkipOnboarding}>
                                    Pular introdução
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {stage === 'form' && (
                <section className="form-section">
                    <div className="section-header">
                        <img src="/src/assets/logo.svg" alt="VIVA.cash" className="section-badge" />
                    </div>
                    <div className="form-container">
                        <form onSubmit={onSubmitForm}>
                            <div className="form-group">
                                <label htmlFor="fullName">Nome Completo</label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="Digite seu nome completo"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="document">Documento (CPF/CNPJ)</label>
                                <input
                                    id="document"
                                    name="document"
                                    type="text"
                                    placeholder="Digite seu CPF ou CNPJ"
                                    value={formData.document}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, document: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="company">Empresa</label>
                                <input
                                    id="company"
                                    name="company"
                                    type="text"
                                    placeholder="Digite o nome da empresa"
                                    value={formData.company}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                                    required
                                />
                            </div>
                              <div className="form-group">
                                <label htmlFor="company">Cargo</label>
                                <input
                                    id="company"
                                    name="company"
                                    type="text"
                                    placeholder="Digite o nome da empresa"
                                    value={formData.company}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-submit">
                                Continuar com QR Code
                            </button>
                        </form>
                    </div>
                    {cameraError && <p className="error-message">{cameraError}</p>}
                </section>
            )}

            {stage === 'camera' && (
                <section className="camera-section">
                    <div className="section-header">
                        <img src="/src/assets/logo.svg" alt="QR" className="section-badge" />
                    </div>
                    <div className='camera-section-container'>
                        <div className="camera-instructions">
                            <h1>Escanear QR Code</h1>
                            <p>Use a câmera frontal para continuar</p>
                        </div>
                        <div className="camera-container">
                            <video ref={videoRef} autoPlay playsInline id="qrVideo" />
                            <canvas ref={canvasRef} hidden />
                            <div className="scan-frame" />
                        </div>
                        <div className="camera-buttons">
                            <button type="button" className="btn-secondary" onClick={onCancelCamera}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {stage === 'result' && (
                <section className="camera-section">
                    <div className="section-header">
                        <img src="/src/assets/logo.svg" alt="OK" className="section-badge success" />
                        <div>
                            <h1>QR Code lido</h1>
                            <p>Confira o código capturado e continue</p>
                        </div>
                    </div>
                    <div className="qr-result">
                        <h3>QR Code Lido!</h3>
                        <p>{qrData}</p>
                    </div>
                    <div className="camera-buttons">
                        <button type="button" className="btn-secondary" onClick={onCancelCamera}>
                            Ler Novamente
                        </button>
                        <button type="button" className="btn-submit" onClick={onFinish}>
                            Continuar
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}