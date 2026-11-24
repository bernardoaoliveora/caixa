import React from 'react';
import { Trash2, CheckCircle2, Touchpad, ScanBarcode, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../data/products';

export default function ProductList({
  items,
  selectedInstanceId,
  onSelectItem,
  onRequestCancelItem,
  onChangeQuantity,
  lastScannedId,
}) {
  return (
    <section className="panel-card product-list-panel" aria-labelledby="cart-heading">
      <div className="panel-card__header">
        <div>
          <h2 id="cart-heading" className="panel-card__title">
            Produtos Registrados na Compra
          </h2>
          <p className="panel-card__hint">
            <Touchpad size={16} aria-hidden="true" />
            <span>
              <strong>Opção A:</strong> Toque em qualquer produto da lista para exibir a opção{' '}
              <em>&ldquo;Remover produto&rdquo;</em>
            </span>
          </p>
        </div>
        <span className="items-count-pill">
          {items.reduce((acc, item) => acc + item.quantity, 0)}{' '}
          {items.reduce((acc, item) => acc + item.quantity, 0) === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart-state">
          <div className="empty-cart-state__icon" aria-hidden="true">
            <ScanBarcode size={48} strokeWidth={1.6} />
          </div>
          <h3>Nenhum produto registrado ainda</h3>
          <p>
            Toque nos produtos da <strong>Área de Leitura (Scanner)</strong> abaixo para iniciar
            o registro da sua compra.
          </p>
        </div>
      ) : (
        <div className="registered-items-list" role="list">
          {items.map((item, index) => {
            const isSelected = selectedInstanceId === item.instanceId;
            const isNewlyScanned = lastScannedId === item.instanceId;
            const subtotal = item.price * item.quantity;

            return (
              <div
                key={item.instanceId}
                role="listitem"
                className={`registered-item ${isSelected ? 'registered-item--selected' : ''} ${
                  isNewlyScanned ? 'registered-item--just-scanned' : ''
                }`}
              >
                <div
                  className="registered-item__main"
                  onClick={() => onSelectItem(isSelected ? null : item.instanceId)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectItem(isSelected ? null : item.instanceId);
                    }
                  }}
                >
                  <div className="registered-item__index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="registered-item__emoji" aria-hidden="true">
                    {item.emoji}
                  </div>

                  <div className="registered-item__info">
                    <div className="registered-item__title-row">
                      <span className="registered-item__name">{item.name}</span>
                      {item.note && (
                        <span className="registered-item__tag">{item.note}</span>
                      )}
                    </div>
                    <div className="registered-item__meta">
                      <span>
                        Qtd: <strong>{item.quantity} un.</strong>
                      </span>
                      <span className="meta-dot">•</span>
                      <span>Unitário: {formatCurrency(item.price)}</span>
                      <span className="meta-dot">•</span>
                      <span className="registered-item__touch-cue">
                        {isSelected ? 'Selecionado' : 'Toque para opções / remover'}
                      </span>
                    </div>
                  </div>

                  <div className="registered-item__price-col">
                    <span className="registered-item__subtotal">
                      {formatCurrency(subtotal)}
                    </span>
                    {isNewlyScanned && (
                      <span className="registered-item__scanned-badge">
                        <CheckCircle2 size={13} /> Registrado
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="registered-item__drawer">
                    <div className="drawer-quantity-controls">
                      <span className="drawer-label">Ajustar quantidade:</span>
                      <div className="qty-stepper">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.quantity > 1) {
                              onChangeQuantity(item.instanceId, item.quantity - 1);
                            } else {
                              onRequestCancelItem(item, 'OptionA');
                            }
                          }}
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onChangeQuantity(item.instanceId, item.quantity + 1);
                          }}
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="drawer-action-buttons">
                      <button
                        type="button"
                        className="btn-remove-inline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequestCancelItem(item, 'OptionA');
                        }}
                      >
                        <Trash2 size={20} />
                        <span>Remover produto</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
