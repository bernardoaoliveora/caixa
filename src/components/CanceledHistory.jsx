import React from 'react';
import { History, CheckCircle2, Clock } from 'lucide-react';
import { formatCurrency } from '../data/products';

export default function CanceledHistory({ canceledItems, pendingTrayItem }) {
  const totalCanceledUnits = canceledItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAbated = canceledItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <section
      className="panel-card canceled-history-panel"
      aria-labelledby="canceled-history-heading"
    >
      <div className="panel-card__header panel-card__header--compact">
        <div className="header-with-icon">
          <History size={18} className="text-danger" aria-hidden="true" />
          <h2 id="canceled-history-heading" className="panel-card__title--sm">
            Histórico de Itens Cancelados (Sem Cobrança)
          </h2>
        </div>
        <div className="canceled-header-pills">
          {totalAbated > 0 && (
            <span className="canceled-abated-pill">
              Total abatido: - {formatCurrency(totalAbated)}
            </span>
          )}
          <span className="canceled-count-pill">
            {totalCanceledUnits} {totalCanceledUnits === 1 ? 'un. removida' : 'un. removidas'}
          </span>
        </div>
      </div>

      {canceledItems.length === 0 ? (
        <p className="canceled-history__empty">
          Nenhum produto cancelado até o momento. Itens removidos são registrados aqui com cobrança
          R$ 0,00.
        </p>
      ) : (
        <div className="canceled-history__list" role="list">
          {canceledItems.map((item) => {
            const isPendingTray =
              pendingTrayItem && pendingTrayItem.cancelId === item.cancelId;

            return (
              <div
                key={item.cancelId}
                role="listitem"
                className={`canceled-history__item ${
                  isPendingTray ? 'canceled-history__item--pending-tray' : ''
                }`}
              >
                <div className="canceled-item__left">
                  <span className="canceled-item__emoji" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <div className="canceled-item__details">
                    <span className="canceled-item__name">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="canceled-item__meta">
                      Removido às {item.canceledAt} • {item.methodLabel} • Não contabilizado no total
                    </span>
                  </div>
                </div>

                <div className="canceled-item__right">
                  <span className="canceled-item__price">
                    Abatido: - {formatCurrency(item.price * item.quantity)}
                  </span>
                  {isPendingTray ? (
                    <span className="canceled-item__status canceled-item__status--pending">
                      <Clock size={12} /> Aguardando depósito na bandeja
                    </span>
                  ) : (
                    <span className="canceled-item__status">
                      <CheckCircle2 size={12} /> Conferido na bandeja de cancelados
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
