import React, { useState } from 'react';
import {
  ScanBarcode,
  ShoppingBag,
  PackageX,
  Scale,
  ArrowDown,
  CheckCircle2,
  PlusCircle,
} from 'lucide-react';
import { CATALOG_PRODUCTS, formatCurrency, formatWeight } from '../data/products';

export default function PhysicalZones({
  cartItems,
  canceledTrayItems,
  pendingTrayItem,
  isModalOpen,
  scannerActive,
  onScanProduct,
  onConfirmPlaceInTray,
}) {
  const [scanMultiplier, setScanMultiplier] = useState(1);

  const baggedWeight = cartItems.reduce((acc, item) => acc + item.weightKg * item.quantity, 0);
  const canceledWeight = canceledTrayItems.reduce(
    (acc, item) => acc + item.weightKg * item.quantity,
    0
  );

  return (
    <section
      className="physical-hardware-zones"
      aria-label="Simulação das áreas físicas do terminal de autoatendimento"
    >
      {/* ZONA FÍSICA 1: Área de Leitura / Adição de Produtos */}
      <div className={`hardware-zone hardware-zone--scanner ${scannerActive ? 'scanner-flash' : ''}`}>
        <div className="hardware-zone__header">
          <div className="hardware-zone__title-wrap">
            <span className="hardware-zone__icon hardware-zone__icon--blue">
              <ScanBarcode size={20} />
            </span>
            <div>
              <h3 className="hardware-zone__title">1. Área de Leitura / Adição de Produtos</h3>
              <p className="hardware-zone__subtitle">
                Toque em um produto para registrar no caixa (inclui preço e peso por unidade)
              </p>
            </div>
          </div>

          <div className="scan-qty-multiplier" role="group" aria-label="Quantidade a adicionar por toque">
            <span className="scan-qty-multiplier__label">Adicionar por toque:</span>
            {[1, 2, 3].map((qty) => (
              <button
                key={qty}
                type="button"
                className={`multiplier-pill ${scanMultiplier === qty ? 'multiplier-pill--active' : ''}`}
                onClick={() => setScanMultiplier(qty)}
              >
                +{qty} un.
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-grid" role="group" aria-label="Produtos disponíveis para passar no leitor">
          {CATALOG_PRODUCTS.map((product) => (
            <button
              key={product.id}
              type="button"
              className="catalog-product-btn"
              onClick={() => onScanProduct(product, scanMultiplier)}
              title={`Adicionar ${scanMultiplier}x ${product.name} (${formatCurrency(product.price)} • ${formatWeight(product.weightKg)})`}
            >
              <span className="catalog-product-btn__emoji" aria-hidden="true">
                {product.emoji}
              </span>
              <div className="catalog-product-btn__info">
                <span className="catalog-product-btn__name">{product.shortName}</span>
                <span className="catalog-product-btn__price">
                  {formatCurrency(product.price)} • {formatWeight(product.weightKg)}
                </span>
              </div>
              <span className="catalog-product-btn__badge">+{scanMultiplier}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ZONA FÍSICA 2: Área de Ensacamento (Compra Ativa / Peso) */}
      <div className="hardware-zone hardware-zone--bagging">
        <div className="hardware-zone__header">
          <div className="hardware-zone__title-wrap">
            <span className="hardware-zone__icon hardware-zone__icon--green">
              <ShoppingBag size={20} />
            </span>
            <div>
              <h3 className="hardware-zone__title">2. Área de Ensacamento (Compra Ativa)</h3>
              <p className="hardware-zone__subtitle">
                Balança de conferência dos itens que serão comprados
              </p>
            </div>
          </div>
          <span className="scale-pill scale-pill--ok" title="Peso total na área de ensacamento">
            <Scale size={14} />
            <span>{formatWeight(baggedWeight)}</span>
          </span>
        </div>

        <div className="physical-surface physical-surface--bagging">
          {cartItems.length === 0 ? (
            <div className="physical-surface__placeholder">
              Área de ensacamento vazia • Registre produtos no leitor ao lado
            </div>
          ) : (
            <div className="physical-tokens-grid">
              {cartItems.map((item) => (
                <div key={item.instanceId} className="physical-token physical-token--active">
                  <span className="physical-token__emoji" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <span className="physical-token__label">{item.shortName}</span>
                  <span className="physical-token__qty">{item.quantity}x</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ZONA FÍSICA 3: Bandeja de Produtos Cancelados (Separada da Compra Ativa) */}
      <div
        className={`hardware-zone hardware-zone--canceled-tray ${
          pendingTrayItem ? 'hardware-zone--canceled-tray-highlight' : ''
        }`}
      >
        <div className="hardware-zone__header">
          <div className="hardware-zone__title-wrap">
            <span className="hardware-zone__icon hardware-zone__icon--red">
              <PackageX size={20} />
            </span>
            <div>
              <div className="tray-header-badge-row">
                <h3 className="hardware-zone__title hardware-zone__title--tray">
                  3. BANDEJA DE PRODUTOS CANCELADOS
                </h3>
              </div>
              <p className="hardware-zone__subtitle">
                Separada das sacolas • Deposite aqui os itens removidos
              </p>
            </div>
          </div>
          <span className="scale-pill scale-pill--tray" title="Peso depositado na bandeja de cancelados">
            <Scale size={14} />
            <span>{formatWeight(canceledWeight)}</span>
          </span>
        </div>

        {/* Só exibe o botão de ação na bandeja física se o modal já tiver sido fechado e o item ainda estiver pendente */}
        {pendingTrayItem && !isModalOpen && (
          <div className="tray-guidance-banner" role="region" aria-live="polite">
            <div className="tray-guidance-banner__instruction">
              <ArrowDown size={18} className="bounce-arrow" />
              <span>
                Pendente: coloque <strong>{pendingTrayItem.quantity}x {pendingTrayItem.shortName}</strong> na bandeja:
              </span>
            </div>
            <button
              type="button"
              className="btn-place-in-tray"
              onClick={() => onConfirmPlaceInTray(pendingTrayItem)}
            >
              <CheckCircle2 size={17} />
              <span>Simular Depósito na Bandeja</span>
            </button>
          </div>
        )}

        <div className="physical-surface physical-surface--canceled">
          {canceledTrayItems.length === 0 ? (
            <div className="physical-surface__placeholder physical-surface__placeholder--tray">
              {pendingTrayItem
                ? `Aguardando devolução física de ${pendingTrayItem.quantity}x ${pendingTrayItem.shortName}...`
                : 'Bandeja de produtos cancelados vazia'}
            </div>
          ) : (
            <div className="physical-tokens-grid">
              {canceledTrayItems.map((item) => (
                <div key={item.cancelId} className="physical-token physical-token--canceled">
                  <span className="physical-token__emoji" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <span className="physical-token__label">{item.shortName}</span>
                  <span className="physical-token__qty">{item.quantity}x</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
