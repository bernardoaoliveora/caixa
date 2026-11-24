import React, { useState, useEffect } from 'react';
import {
  Trash2,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  PackageX,
  ArrowDownCircle,
  X,
  Plus,
  Minus,
} from 'lucide-react';
import { formatCurrency } from '../data/products';

/**
 * Modal da Opção B (Botão Fixo "Cancelar produto"):
 * Lista os produtos registrados para que o consumidor escolha qual deseja remover.
 * Ao selecionar, leva para a mesma etapa de Confirmação de Cancelamento.
 */
export function CancelSelectionModal({ isOpen, items, onClose, onSelectProductToCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="select-cancel-title">
      <div className="modal-window modal-window--lg">
        <div className="modal-window__header modal-window__header--navy">
          <div>
            <span className="modal-step-tag">Opção B • Cancelamento pelo Botão Fixo</span>
            <h2 id="select-cancel-title" className="modal-window__title">
              Qual produto você deseja cancelar?
            </h2>
            <p className="modal-window__subtitle">
              Toque no produto registrado abaixo para avançar para a confirmação de remoção
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fechar janela"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-window__body">
          <div className="cancel-selection-list" role="list">
            {items.map((item, idx) => (
              <button
                key={item.instanceId}
                type="button"
                role="listitem"
                className="cancel-selection-card"
                onClick={() => onSelectProductToCancel(item, 'OptionB')}
              >
                <div className="cancel-selection-card__left">
                  <span className="cancel-selection-card__index">
                    #{String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="cancel-selection-card__emoji" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <div className="cancel-selection-card__info">
                    <span className="cancel-selection-card__name">{item.name}</span>
                    <span className="cancel-selection-card__meta">
                      Quantidade: <strong>{item.quantity} un.</strong> • Preço unitário:{' '}
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>

                <div className="cancel-selection-card__right">
                  <span className="cancel-selection-card__price">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <span className="cancel-selection-card__cta">
                    <Trash2 size={18} />
                    <span>Selecionar para remover</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="modal-window__footer">
          <button type="button" className="btn-modal-back" onClick={onClose}>
            <ArrowLeft size={20} />
            <span>Voltar para a compra</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Etapa 4 — Confirmação de cancelamento (Unificada para Opção A e Opção B):
 * Permite selecionar a quantidade de unidades que serão canceladas,
 * exibe Nome do produto, Quantidade selecionada, Preço a descontar e a pergunta:
 * "Deseja realmente remover este produto da sua compra?"
 * Botões: "Voltar" e "Confirmar cancelamento".
 */
export function CancelConfirmationModal({
  item,
  method,
  initialCancelQty,
  onBack,
  onConfirmCancel,
}) {
  const [cancelQty, setCancelQty] = useState(1);

  useEffect(() => {
    if (item) {
      const startQty =
        initialCancelQty && initialCancelQty >= 1 && initialCancelQty <= item.quantity
          ? initialCancelQty
          : item.quantity;
      setCancelQty(startQty);
    }
  }, [item, initialCancelQty]);

  if (!item) return null;

  const maxQty = item.quantity;
  const totalItemPrice = item.price * cancelQty;
  const remainingQty = maxQty - cancelQty;

  const handleDecrease = () => {
    setCancelQty((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setCancelQty((prev) => Math.min(maxQty, prev + 1));
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-cancel-title"
    >
      <div className="modal-window modal-window--confirm">
        <div className="modal-window__header modal-window__header--danger">
          <div className="modal-header-icon-wrap" aria-hidden="true">
            <Trash2 size={28} />
          </div>
          <div>
            <span className="modal-step-tag">
              {method === 'OptionA'
                ? 'Opção A • Selecionado na Lista de Produtos'
                : 'Opção B • Selecionado pelo Botão Cancelar Produto'}
            </span>
            <h2 id="confirm-cancel-title" className="modal-window__title">
              Confirmação de Cancelamento
            </h2>
          </div>
        </div>

        <div className="modal-window__body modal-window__body--centered">
          <p className="confirm-question">
            Deseja realmente remover este produto da sua compra?
          </p>

          <div className="confirm-product-summary">
            <div className="confirm-product-summary__emoji" aria-hidden="true">
              {item.emoji}
            </div>
            <div className="confirm-product-summary__details">
              <div className="confirm-detail-row">
                <span className="confirm-detail-label">Nome do produto:</span>
                <strong className="confirm-detail-value confirm-detail-value--name">
                  {item.name}
                </strong>
                <span className="confirm-unit-price-hint">
                  Valor unitário: {formatCurrency(item.price)} • Registrado na compra: {maxQty}{' '}
                  {maxQty === 1 ? 'unidade' : 'unidades'}
                </span>
              </div>

              {/* Seletor Touchscreen de Quantidade a Cancelar */}
              <div className="confirm-qty-selector-box">
                <div className="confirm-qty-selector-box__header">
                  <span className="confirm-detail-label">
                    Selecione a quantidade a cancelar:
                  </span>
                  {maxQty > 1 && (
                    <div className="confirm-qty-presets">
                      <button
                        type="button"
                        className={`qty-preset-pill ${
                          cancelQty === 1 ? 'qty-preset-pill--active' : ''
                        }`}
                        onClick={() => setCancelQty(1)}
                      >
                        1 un.
                      </button>
                      <button
                        type="button"
                        className={`qty-preset-pill ${
                          cancelQty === maxQty ? 'qty-preset-pill--active' : ''
                        }`}
                        onClick={() => setCancelQty(maxQty)}
                      >
                        Todas ({maxQty} un.)
                      </button>
                    </div>
                  )}
                </div>

                <div className="confirm-qty-controls">
                  <button
                    type="button"
                    className="confirm-qty-btn"
                    onClick={handleDecrease}
                    disabled={cancelQty <= 1}
                    aria-label="Diminuir quantidade a cancelar"
                  >
                    <Minus size={22} strokeWidth={2.5} />
                  </button>

                  <div className="confirm-qty-display" aria-live="polite">
                    <strong className="confirm-qty-display__number">{cancelQty}</strong>
                    <span className="confirm-qty-display__label">
                      de {maxQty} {maxQty === 1 ? 'unidade' : 'unidades'}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="confirm-qty-btn"
                    onClick={handleIncrease}
                    disabled={cancelQty >= maxQty}
                    aria-label="Aumentar quantidade a cancelar"
                  >
                    <Plus size={22} strokeWidth={2.5} />
                  </button>
                </div>

                <span className="confirm-qty-remaining-badge">
                  {remainingQty > 0
                    ? `Cancelamento parcial: permanecerão ${remainingQty} un. na sua compra`
                    : 'Cancelamento total: o produto será inteiramente removido da lista'}
                </span>
              </div>

              <div className="confirm-detail-grid">
                <div className="confirm-detail-box">
                  <span className="confirm-detail-label">Quantidade a remover</span>
                  <strong className="confirm-detail-value">
                    {cancelQty} {cancelQty === 1 ? 'un.' : 'un.'}
                  </strong>
                </div>
                <div className="confirm-detail-box">
                  <span className="confirm-detail-label">Preço a descontar</span>
                  <strong className="confirm-detail-value confirm-detail-value--price">
                    - {formatCurrency(totalItemPrice)}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <p className="confirm-safety-note">
            O produto só será removido e descontado do total após a sua confirmação abaixo.
          </p>
        </div>

        <div className="modal-window__footer modal-window__footer--split">
          <button type="button" className="btn-modal-back btn-modal-back--lg" onClick={onBack}>
            <ArrowLeft size={22} />
            <span>Voltar</span>
          </button>

          <button
            type="button"
            className="btn-modal-confirm-cancel"
            onClick={() => onConfirmCancel(item, method, cancelQty)}
          >
            <Trash2 size={22} />
            <span>
              Confirmar cancelamento ({cancelQty} {cancelQty === 1 ? 'un.' : 'un.'})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Etapa 5 — Cancelamento realizado + Orientação para a área física "PRODUTOS CANCELADOS":
 * Mostra:
 * - "Produto cancelado com sucesso!"
 * - "Coloque o produto na área identificada para itens cancelados."
 */
export function CancelSuccessModal({
  canceledItem,
  newTotal,
  onPlaceInTrayAndContinue,
  onSimulateForgotTray,
}) {
  if (!canceledItem) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-success-title"
    >
      <div className="modal-window modal-window--success">
        <div className="modal-window__header modal-window__header--success">
          <div className="modal-header-icon-wrap modal-header-icon-wrap--success" aria-hidden="true">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <span className="modal-step-tag">Valor Total Atualizado Automaticamente</span>
            <h2 id="cancel-success-title" className="modal-window__title">
              Produto cancelado com sucesso!
            </h2>
          </div>
        </div>

        <div className="modal-window__body">
          <div className="success-summary-banner">
            <div className="success-summary-banner__item">
              <span>Item removido:</span>
              <strong>
                {canceledItem.emoji} {canceledItem.name} ({canceledItem.quantity} un.)
              </strong>
            </div>
            <div className="success-summary-banner__totals">
              <div>
                <span>Valor descontado:</span>
                <strong className="text-danger">
                  - {formatCurrency(canceledItem.price * canceledItem.quantity)}
                </strong>
              </div>
              <div>
                <span>Novo total da compra:</span>
                <strong className="text-navy">{formatCurrency(newTotal)}</strong>
              </div>
            </div>
          </div>

          {/* Orientação obrigatória para a área física de itens cancelados */}
          <div className="physical-guidance-box">
            <div className="physical-guidance-box__icon" aria-hidden="true">
              <PackageX size={36} />
            </div>
            <div className="physical-guidance-box__content">
              <span className="physical-guidance-box__tag">AÇÃO FÍSICA NECESSÁRIA</span>
              <h3 className="physical-guidance-box__instruction">
                Coloque o produto na área identificada para itens cancelados.
              </h3>
              <p className="physical-guidance-box__desc">
                Retire o item da área de ensacamento e deposite-o na bandeja{' '}
                <strong>&ldquo;PRODUTOS CANCELADOS&rdquo;</strong> localizada à direita da balança.
              </p>
            </div>
          </div>

          <div className="visual-map-diagram" aria-hidden="true">
            <div className="diagram-node diagram-node--bag">
              <span>Sacolas (Sua Compra)</span>
            </div>
            <div className="diagram-arrow">➜ Retire e mova para ➜</div>
            <div className="diagram-node diagram-node--tray">
              <span>Bandeja: PRODUTOS CANCELADOS</span>
            </div>
          </div>
        </div>

        <div className="modal-window__footer modal-window__footer--column">
          <button
            type="button"
            className="btn-place-tray-primary"
            onClick={() => onPlaceInTrayAndContinue(canceledItem)}
          >
            <ArrowDownCircle size={24} />
            <span>Colocar produto na bandeja &ldquo;PRODUTOS CANCELADOS&rdquo; e Continuar</span>
          </button>

          <button
            type="button"
            className="btn-simulate-discrepancy"
            onClick={() => onSimulateForgotTray(canceledItem)}
          >
            <AlertTriangle size={16} />
            <span>
              Simular Exceção IHC: Consumidor não colocou o item na bandeja (Divergência de Peso)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
