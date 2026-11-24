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
import { formatCurrency, formatWeight } from '../data/products';

/**
 * Modal da Opção B (Botão Fixo "Cancelar produto"):
 * Lista os produtos registrados para que o consumidor escolha qual deseja remover.
 * Ao selecionar, leva para a mesma etapa de Confirmação de Cancelamento.
 */
export function CancelSelectionModal({ isOpen, items, onClose, onSelectProductToCancel }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="select-cancel-title"
    >
      <div className="modal-window modal-window--lg">
        <div className="modal-window__header modal-window__header--navy">
          <div>
            <span className="modal-step-tag">Passo 1 de 2 • Escolha o Produto a Cancelar</span>
            <h2 id="select-cancel-title" className="modal-window__title">
              Qual produto você deseja remover da compra?
            </h2>
            <p className="modal-window__subtitle">
              Toque no produto abaixo. No próximo passo você poderá ajustar a quantidade e revisar o
              novo total antes de confirmar.
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
                      Registrado: <strong>{item.quantity} un.</strong> • Unitário:{' '}
                      {formatCurrency(item.price)} • Peso:{' '}
                      {formatWeight(item.weightKg * item.quantity)}
                    </span>
                  </div>
                </div>

                <div className="cancel-selection-card__right">
                  <span className="cancel-selection-card__price">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <span className="cancel-selection-card__cta">
                    <Trash2 size={16} />
                    <span>Escolher item</span>
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
 * Etapa de Confirmação de Cancelamento (Unificada para Opção A e Opção B):
 * - Permite ajustar a quantidade a remover (ex.: cancelar 2 de 3 unidades).
 * - Mostra nome, quantidade a remover, valor a descontar, NOVO TOTAL DA COMPRA e botão "Voltar".
 */
export function CancelConfirmationModal({
  item,
  method,
  currentTotal,
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
  const discountAmount = item.price * cancelQty;
  const previewNewTotal = Math.max(0, (currentTotal || 0) - discountAmount);
  const remainingQty = maxQty - cancelQty;

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
            <Trash2 size={26} />
          </div>
          <div>
            <span className="modal-step-tag">
              Prevenção de Erros • Revise antes de confirmar
            </span>
            <h2 id="confirm-cancel-title" className="modal-window__title">
              Confirmação de Cancelamento
            </h2>
          </div>
        </div>

        <div className="modal-window__body">
          <p className="confirm-question">
            Deseja realmente remover este produto da sua compra?
          </p>

          <div className="confirm-product-summary">
            <div className="confirm-product-header-row">
              <div className="confirm-product-summary__emoji" aria-hidden="true">
                {item.emoji}
              </div>
              <div className="confirm-detail-row">
                <span className="confirm-detail-label">Produto selecionado</span>
                <strong className="confirm-detail-value confirm-detail-value--name">
                  {item.name}
                </strong>
                <span className="confirm-unit-price-hint">
                  Preço unitário: {formatCurrency(item.price)} • Peso unitário:{' '}
                  {formatWeight(item.weightKg)} • No carrinho: <strong>{maxQty} un.</strong>
                </span>
              </div>
            </div>

            {/* Seletor de Quantidade a Remover (ex.: cancelar 2 de 3 unidades) */}
            <div className="confirm-qty-selector-box">
              <div className="confirm-qty-selector-box__header">
                <span className="confirm-detail-label">
                  Ajuste a quantidade que deseja remover:
                </span>
                {maxQty > 1 && (
                  <div className="confirm-qty-presets">
                    {Array.from({ length: maxQty }, (_, idx) => idx + 1).map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`qty-preset-pill ${
                          cancelQty === num ? 'qty-preset-pill--active' : ''
                        }`}
                        onClick={() => setCancelQty(num)}
                      >
                        {num === maxQty ? `Todas (${num} un.)` : `${num} un.`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="confirm-qty-controls">
                <button
                  type="button"
                  className="confirm-qty-btn"
                  onClick={() => setCancelQty((prev) => Math.max(1, prev - 1))}
                  disabled={cancelQty <= 1}
                  aria-label="Diminuir quantidade a remover"
                >
                  <Minus size={22} strokeWidth={2.5} />
                </button>

                <div className="confirm-qty-display" aria-live="polite">
                  <strong className="confirm-qty-display__number">
                    Remover {cancelQty} de {maxQty} {maxQty === 1 ? 'unidade' : 'unidades'}
                  </strong>
                  <span className="confirm-qty-display__label">
                    {remainingQty > 0
                      ? `Cancelamento parcial: continuarão ${remainingQty} un. na sua compra`
                      : 'Cancelamento total: o produto sairá completamente da lista'}
                  </span>
                </div>

                <button
                  type="button"
                  className="confirm-qty-btn"
                  onClick={() => setCancelQty((prev) => Math.min(maxQty, prev + 1))}
                  disabled={cancelQty >= maxQty}
                  aria-label="Aumentar quantidade a remover"
                >
                  <Plus size={22} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Prévia Financeira Transparente: Quantidade | Valor a descontar | Novo total da compra */}
            <div className="confirm-detail-grid confirm-detail-grid--three">
              <div className="confirm-detail-box">
                <span className="confirm-detail-label">Qtd. a remover</span>
                <strong className="confirm-detail-value">
                  {cancelQty} {cancelQty === 1 ? 'unidade' : 'unidades'}
                </strong>
              </div>

              <div className="confirm-detail-box">
                <span className="confirm-detail-label">Valor a descontar</span>
                <strong className="confirm-detail-value confirm-detail-value--price">
                  - {formatCurrency(discountAmount)}
                </strong>
              </div>

              <div className="confirm-detail-box confirm-detail-box--new-total">
                <span className="confirm-detail-label">Novo total da compra</span>
                <strong className="confirm-detail-value confirm-detail-value--new-total">
                  {formatCurrency(previewNewTotal)}
                </strong>
              </div>
            </div>
          </div>
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
            <span>Confirmar cancelamento</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Etapa de Orientação Física Limpa (após confirmar o cancelamento):
 * Evita cartões/banners concorrentes e mantém 100% do foco na devolução do item
 * na Bandeja de Produtos Cancelados.
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
            <CheckCircle2 size={30} />
          </div>
          <div>
            <span className="modal-step-tag">Feedback Claro & Correspondência Física</span>
            <h2 id="cancel-success-title" className="modal-window__title">
              Produto cancelado com sucesso!
            </h2>
          </div>
        </div>

        <div className="modal-window__body">
          <div className="success-summary-banner">
            <div className="success-summary-banner__item">
              <span>Removido da compra:</span>
              <strong>
                {canceledItem.emoji} {canceledItem.quantity}x {canceledItem.name}
              </strong>
            </div>
            <div className="success-summary-banner__totals">
              <div>
                <span>Valor abatido:</span>
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

          <div className="physical-guidance-box">
            <div className="physical-guidance-box__icon" aria-hidden="true">
              <PackageX size={34} />
            </div>
            <div className="physical-guidance-box__content">
              <span className="physical-guidance-box__tag">PRÓXIMO PASSO DO UTILIZADOR</span>
              <h3 className="physical-guidance-box__instruction">
                Coloque o produto na área identificada para itens cancelados.
              </h3>
              <p className="physical-guidance-box__desc">
                Retire <strong>{canceledItem.quantity}x {canceledItem.shortName}</strong> da área de
                ensacamento e deposite na <strong>Bandeja de Produtos Cancelados</strong>.
              </p>
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
            <span>
              Simular Depósito na Bandeja &ldquo;PRODUTOS CANCELADOS&rdquo; e Continuar
            </span>
          </button>

          <button
            type="button"
            className="btn-simulate-discrepancy"
            onClick={() => onSimulateForgotTray(canceledItem)}
          >
            <AlertTriangle size={15} />
            <span>
              Testar Exceção: Não colocar na bandeja (Simular Divergência de Peso)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
