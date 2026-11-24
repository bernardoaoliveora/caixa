import React from 'react';
import { Trash2, CheckCircle2, Touchpad, ScanBarcode } from 'lucide-react';
import { formatCurrency, formatWeight } from '../data/products';

export default function ProductList({
  items,
  selectedInstanceId,
  onSelectItem,
  onRequestCancelItem,
  lastScannedId,
}) {
  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <section className="panel-card product-list-panel" aria-labelledby="cart-heading">
      <div className="panel-card__header">
        <div>
          <h2 id="cart-heading" className="panel-card__title">
            Lista de Compra — Produtos Registrados
          </h2>
          <p className="panel-card__hint">
            <Touchpad size={16} aria-hidden="true" />
            <span>
              Toque em qualquer item da lista para abrir a opção <strong>Remover produto</strong>{' '}
              (total ou parcial)
            </span>
          </p>
        </div>
        <span className="items-count-pill">
          {totalUnits} {totalUnits === 1 ? 'unidade' : 'unidades'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart-state">
          <div className="empty-cart-state__icon" aria-hidden="true">
            <ScanBarcode size={44} strokeWidth={1.6} />
          </div>
          <h3>Nenhum produto registrado na compra</h3>
          <p>
            Utilize a <strong>Área de Leitura / Adição de Produtos</strong> abaixo para registrar
            itens no caixa.
          </p>
        </div>
      ) : (
        <div className="registered-items-list" role="list">
          {items.map((item, index) => {
            const isSelected = selectedInstanceId === item.instanceId;
            const isNewlyScanned = lastScannedId === item.instanceId;
            const subtotal = item.price * item.quantity;
            const totalItemWeight = item.weightKg * item.quantity;

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
                      <span className="meta-qty-highlight">
                        Qtd: <strong>{item.quantity} un.</strong>
                      </span>
                      <span className="meta-dot">•</span>
                      <span>Unitário: {formatCurrency(item.price)}</span>
                      <span className="meta-dot">•</span>
                      <span>Peso: {formatWeight(totalItemWeight)}</span>
                    </div>
                  </div>

                  <div className="registered-item__price-col">
                    <span className="registered-item__subtotal">
                      {formatCurrency(subtotal)}
                    </span>
                    {isNewlyScanned ? (
                      <span className="registered-item__scanned-badge">
                        <CheckCircle2 size={13} /> Registrado
                      </span>
                    ) : (
                      <span className="registered-item__touch-cue">
                        {isSelected ? 'Toque para fechar' : 'Toque para remover'}
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="registered-item__drawer">
                    <span className="drawer-helper-text">
                      {item.quantity > 1
                        ? `Este item possui ${item.quantity} unidades. Na próxima etapa você poderá escolher quantas unidades remover.`
                        : 'Confirme na próxima etapa se deseja remover este produto da sua compra.'}
                    </span>

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
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
