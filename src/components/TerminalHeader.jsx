import React, { useState } from 'react';
import {
  ShoppingBag,
  Volume2,
  VolumeX,
  RotateCcw,
  AlertTriangle,
  ShieldAlert,
  PlayCircle,
  SlidersHorizontal,
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
  const [showSimMenu, setShowSimMenu] = useState(false);

  const statusConfig = {
    normal: {
      label: 'Operação Normal • Passe os produtos ou gerencie sua compra',
      badgeClass: 'status-badge--normal',
    },
    awaiting_tray: {
      label: 'Ação Física Pendente: Coloque o item removido na Bandeja de Cancelados',
      badgeClass: 'status-badge--warning',
    },
    assistance_needed: {
      label: 'Terminal Pausado • Aguardando Conferência de Funcionário',
      badgeClass: 'status-badge--danger',
    },
  };

  const currentStatus = statusConfig[terminalStatus] || statusConfig.normal;

  return (
    <header className="terminal-header">
      <div className="terminal-header__brand">
        <div className="brand-logo" aria-hidden="true">
          <ShoppingBag size={24} strokeWidth={2.3} />
        </div>
        <div className="brand-text">
          <div className="brand-title-row">
            <h1 className="brand-name">Supermercado Horizonte</h1>
            <span className="terminal-id-badge">CAIXA 04 • AUTOATENDIMENTO</span>
          </div>
          <p className="brand-subtitle">
            Redesign de Cancelamento Autônomo — Visibilidade, Prevenção de Erros e Controle (IHC)
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
          className="header-ctrl-btn"
          onClick={onResetDemo}
          title="Restaurar compra inicial de demonstração"
        >
          <RotateCcw size={16} />
          <span>Reiniciar Compra</span>
        </button>

        <div className="sim-dropdown-wrapper">
          <button
            type="button"
            className={`header-ctrl-btn ${showSimMenu ? 'header-ctrl-btn--active' : ''}`}
            onClick={() => setShowSimMenu((v) => !v)}
            aria-expanded={showSimMenu}
          >
            <SlidersHorizontal size={16} />
            <span>Cenários IHC</span>
          </button>

          {showSimMenu && (
            <div className="sim-dropdown-menu" role="menu">
              <button
                type="button"
                className="sim-dropdown-item"
                onClick={() => {
                  onOpenGuide();
                  setShowSimMenu(false);
                }}
              >
                <Sparkles size={16} />
                <span>Roteiro de Demonstração IHC</span>
              </button>
              <button
                type="button"
                className="sim-dropdown-item"
                onClick={() => {
                  onStartEmpty();
                  setShowSimMenu(false);
                }}
              >
                <PlayCircle size={16} />
                <span>Iniciar Compra com Carrinho Vazio</span>
              </button>
              <button
                type="button"
                className="sim-dropdown-item sim-dropdown-item--warn"
                onClick={() => {
                  onTriggerWeightAlert();
                  setShowSimMenu(false);
                }}
              >
                <AlertTriangle size={16} />
                <span>Simular Divergência de Peso na Balança</span>
              </button>
              <button
                type="button"
                className="sim-dropdown-item sim-dropdown-item--danger"
                onClick={() => {
                  onTriggerSecurityBlock();
                  setShowSimMenu(false);
                }}
              >
                <ShieldAlert size={16} />
                <span>Simular Bloqueio de Segurança (Funcionário)</span>
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="header-ctrl-btn header-ctrl-btn--icon"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Desativar som do caixa' : 'Ativar som do caixa'}
          title={soundEnabled ? 'Som do leitor ativado' : 'Som do leitor desativado'}
        >
          {soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
        </button>
      </div>
    </header>
  );
}
