import React from 'react';
import {
  ShoppingBag,
  Volume2,
  VolumeX,
  HelpCircle,
  RotateCcw,
  AlertTriangle,
  ShieldAlert,
  PlayCircle,
  Sparkles,
} from 'lucide-react';

export default function TerminalHeader({
  terminalStatus,
  soundEnabled,
  onToggleSound,
  onResetDemo,
  onStartEmpty,
  onTriggerWeightAlert,
  onTriggerSecurityBlock,
  onOpenGuide,
}) {
  const statusConfig = {
    normal: {
      label: 'Caixa Livre • Compra em Andamento',
      badgeClass: 'status-badge--normal',
    },
    awaiting_tray: {
      label: 'Ação Física: Coloque o item na bandeja de cancelados',
      badgeClass: 'status-badge--warning',
    },
    assistance_needed: {
      label: 'Assistência de Funcionário Solicitada',
      badgeClass: 'status-badge--danger',
    },
  };

  const currentStatus = statusConfig[terminalStatus] || statusConfig.normal;

  return (
    <header className="terminal-header">
      <div className="terminal-header__brand">
        <div className="brand-logo" aria-hidden="true">
          <ShoppingBag size={26} strokeWidth={2.3} />
        </div>
        <div className="brand-text">
          <div className="brand-title-row">
            <h1 className="brand-name">Supermercado Horizonte</h1>
            <span className="terminal-id-badge">CAIXA 04 • AUTOATENDIMENTO</span>
          </div>
          <p className="brand-subtitle">
            Terminal Touchscreen de Autoatendimento — Projeto Acadêmico de IHC
          </p>
        </div>
      </div>

      <div className="terminal-header__status">
        <div className={`status-badge ${currentStatus.badgeClass}`} role="status">
          <span className="status-dot" />
          <span>{currentStatus.label}</span>
        </div>
      </div>

      <div className="terminal-header__controls">
        <button
          type="button"
          className="header-ctrl-btn header-ctrl-btn--guide"
          onClick={onOpenGuide}
          title="Ver roteiro para gravação do vídeo de demonstração"
        >
          <Sparkles size={18} />
          <span>Roteiro IHC</span>
        </button>

        <button
          type="button"
          className="header-ctrl-btn"
          onClick={onStartEmpty}
          title="Iniciar uma compra do zero (carrinho vazio)"
        >
          <PlayCircle size={18} />
          <span>Compra do Zero</span>
        </button>

        <button
          type="button"
          className="header-ctrl-btn"
          onClick={onResetDemo}
          title="Restaurar compra de exemplo com produtos pré-registrados"
        >
          <RotateCcw size={18} />
          <span>Compra Exemplo</span>
        </button>

        <div className="header-divider" aria-hidden="true" />

        <button
          type="button"
          className="header-ctrl-btn header-ctrl-btn--warn"
          onClick={onTriggerWeightAlert}
          title="Simular divergência de peso na balança (exige assistência)"
        >
          <AlertTriangle size={18} />
          <span>Simular Peso</span>
        </button>

        <button
          type="button"
          className="header-ctrl-btn header-ctrl-btn--danger"
          onClick={onTriggerSecurityBlock}
          title="Simular bloqueio de segurança para assistência de funcionário"
        >
          <ShieldAlert size={18} />
          <span>Bloqueio Seg.</span>
        </button>

        <button
          type="button"
          className="header-ctrl-btn header-ctrl-btn--icon"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Desativar som do caixa' : 'Ativar som do caixa'}
          title={soundEnabled ? 'Som do leitor ativado' : 'Som do leitor desativado'}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>
    </header>
  );
}
