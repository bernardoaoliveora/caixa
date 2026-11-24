import React from 'react';
import { Trash2, CreditCard, HelpCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatCurrency, formatWeight } from '../data/products';

export default function CheckoutSummary({
  items,
  canceledItems,
  onOpenFixedCancelModal,
  onOpenPaymentModal,
  onRequestAssistance,
  emptyCancelFeedback,
}) {
  const totalActiveItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.weightKg * item.quantity, 0);
  const totalCanceledValue = canceledItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <aside className="checkout-summary-column" aria-label="Resumo da compra e ações principais">
      {/* Card de Valor Total da Compra */}
      <div className="summary-total-card">
        <div className="summary-total-card__top">
          <span className="summary-total-card__label">VALOR TOTAL DA COMPRA</span>
          <span className="summary-total-card__badge">
            {totalActiveItems} {totalActiveItems === 1 ? 'volume' : 'volumes'}
          </span>
        </div>

        <div className="summary-total-card__amount" aria-live="polite">
          {formatCurrency(totalAmount)}
        </div>

        <div className="summary-total-card__meta">
          <div className="summary-meta-row">
            <span>Peso total conferido:</span>
            <strong>{formatWeight(totalWeight)}</strong>
          </div>
          {canceledItems.length > 0 && (
            <div className="summary-meta-row summary-meta-row--abated">
              <span>Abatido por cancelamentos ({canceledItems.length}):</span>
              <strong>- {formatCurrency(totalCanceledValue)}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Botão Fixo "Cancelar produto" — Opção B */}
      <div className="fixed-cancel-section">
        <div className="fixed-cancel-section__header">
          <span className="option-pill option-pill--b">Opção B • Botão Fixo</span>
          <span className="fixed-cancel-section__caption">
            Acesso direto e visível em qualquer momento da compra
          </span>
        </div>

        <button
          type="button"
          className={`btn-fixed-cancel ${items.length === 0 ? 'btn-fixed-cancel--disabled' : ''}`}
          onClick={onOpenFixedCancelModal}
          aria-disabled={items.length === 0}
        >
          <div className="btn-fixed-cancel__icon">
            <Trash2 size={28} strokeWidth={2.3} />
          </div>
          <div className="btn-fixed-cancel__text">
            <span className="btn-fixed-cancel__title">Cancelar produto</span>
            <span className="btn-fixed-cancel__subtitle">
              {items.length > 0
                ? 'Toque para escolher um item registrado e remover'
                : 'Nenhum produto registrado para cancelar'}
            </span>
          </div>
        </button>

        {emptyCancelFeedback && (
          <div className="empty-cancel-alert" role="alert">
            <AlertCircle size={18} />
            <span>
              Não há produtos registrados na compra. Registre um item no leitor antes de cancelar.
            </span>
          </div>
        )}
      </div>

      {/* Botão de Finalizar Compra (Verde para confirmações) */}
      <div className="primary-actions-group">
        <button
          type="button"
          className="btn-finish-purchase"
          disabled={items.length === 0}
          onClick={onOpenPaymentModal}
        >
          <CreditCard size={26} strokeWidth={2.2} />
          <div className="btn-finish-purchase__content">
            <span className="btn-finish-purchase__title">Finalizar e Pagar</span>
            <span className="btn-finish-purchase__subtitle">
              {items.length > 0
                ? `Concluir compra de ${formatCurrency(totalAmount)}`
                : 'Adicione produtos para finalizar'}
            </span>
          </div>
        </button>

        <button
          type="button"
          className="btn-call-attendant"
          onClick={onRequestAssistance}
        >
          <HelpCircle size={20} />
          <span>Precisa de ajuda? Chamar Funcionário</span>
        </button>
      </div>

      <div className="security-footer-note">
        <ShieldCheck size={16} />
        <span>
          Cancelamento autônomo ativo • Produtos cancelados devem ser colocados na bandeja ao lado
        </span>
      </div>
    </aside>
  );
}
