import React from 'react';
import { History, Ban, CheckCircle2, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../data/products';

export default function CanceledHistory({ canceledItems, pendingTrayItem, onPlaceInTray }) {
  return (
    <section
      className="panel-card canceled-history-panel"
      aria-labelledby="canceled-history-heading"
    >
      <div className="panel-card__header panel-card__header--compact">
        <div className="header-with-icon">
          <History size={18} className="text-danger" aria-hidden="true" />
          <h2 id="canceled-history-heading" className="panel-card__title--sm">
            Histórico de Produtos Cancelados
          </h2>
        </div>
        <span className="canceled-count-pill">
          {canceledItems.length} {canceledItems.length === 1 ? 'removido' : 'removidos'}
        </span>
      </div>

      {canceledItems.length === 0 ? (
        <p className="canceled-history__empty">
          Nenhum produto foi cancelado nesta compra. Itens removidos aparecerão aqui e não serão
          cobrados no valor final.
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
                    <span className="canceled-item__name">{item.name}</span>
                    <span className="canceled-item__meta">
                      Qtd: {item.quantity} • Removido às {item.canceledAt} ({item.methodLabel})
                    </span>
                  </div>
                </div>

                <div className="canceled-item__right">
                  <span className="canceled-item__price">
                    - {formatCurrency(item.price * item.quantity)}
                  </span>
                  {isPendingTray ? (
                    <button
                      type="button"
                      className="canceled-item__tray-action"
                      onClick={() => onPlaceInTray(item)}
                    >
                      <ArrowDownRight size={13} />
                      <span>Colocar na bandeja</span>
                    </button>
                  ) : (
                    <span className="canceled-item__status">
                      <CheckCircle2 size={12} /> Na bandeja de cancelados
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
