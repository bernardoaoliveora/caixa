import React from 'react';
import {
  ScanBarcode,
  ShoppingBag,
  PackageX,
  Scale,
  ArrowDown,
  CheckCircle2,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';
import { CATALOG_PRODUCTS, formatCurrency, formatWeight } from '../data/products';

export default function PhysicalZones({
  cartItems,
  canceledTrayItems,
  pendingTrayItem,
  scannerActive,
  onScanProduct,
  onConfirmPlaceInTray,
}) {
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
      {/* ZONA FÍSICA 1: Área de Leitura de Produtos (Scanner Óptico + Cesta do Consumidor) */}
      <div className={`hardware-zone hardware-zone--scanner ${scannerActive ? 'scanner-flash' : ''}`}>
        <div className="hardware-zone__header">
          <div className="hardware-zone__title-wrap">
            <span className="hardware-zone__icon hardware-zone__icon--blue">
              <ScanBarcode size={20} />
            </span>
            <div>
              <h3 className="hardware-zone__title">1. Área de Leitura de Produtos (Leitor Óptico)</h3>
              <p className="hardware-zone__subtitle">
                Toque em um produto abaixo para simular a passagem pelo leitor de código de barras
              </p>
            </div>
          </div>
          <div className="scanner-window-indicator" aria-hidden="true">
            <span className="laser-line" />
            <span className="scanner-status-text">
              {scannerActive ? 'BIP! Lendo código...' : 'Leitor Óptico Pronto'}
            </span>
          </div>
        </div>

        <div className="catalog-grid" role="group" aria-label="Produtos disponíveis para passar no leitor">
          {CATALOG_PRODUCTS.map((product) => (
            <button
              key={product.id}
              type="button"
              className="catalog-product-btn"
              onClick={() => onScanProduct(product)}
              title={`Passar ${product.name} no leitor (${formatCurrency(product.price)})`}
            >
              <span className="catalog-product-btn__emoji" aria-hidden="true">
                {product.emoji}
              </span>
              <div className="catalog-product-btn__info">
                <span className="catalog-product-btn__name">{product.shortName}</span>
                <span className="catalog-product-btn__price">{formatCurrency(product.price)}</span>
              </div>
              <PlusCircle size={16} className="catalog-product-btn__add" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      {/* ZONA FÍSICA 2: Área de Ensacamento (Produtos que serão comprados) */}
      <div className="hardware-zone hardware-zone--bagging">
        <div className="hardware-zone__header">
          <div className="hardware-zone__title-wrap">
            <span className="hardware-zone__icon hardware-zone__icon--green">
              <ShoppingBag size={20} />
            </span>
            <div>
              <h3 className="hardware-zone__title">2. Área de Ensacamento (Sua Compra)</h3>
              <p className="hardware-zone__subtitle">
                Balança de conferência das sacolas com itens ativos
              </p>
            </div>
          </div>
          <span className="scale-pill scale-pill--ok">
            <Scale size={14} />
            <span>{formatWeight(baggedWeight)}</span>
          </span>
        </div>

        <div className="physical-surface physical-surface--bagging">
          {cartItems.length === 0 ? (
            <div className="physical-surface__placeholder">
              Sacolas vazias • Passe os produtos no leitor ao lado
            </div>
          ) : (
            <div className="physical-tokens-grid">
              {cartItems.map((item) => (
                <div key={item.instanceId} className="physical-token physical-token--active">
                  <span className="physical-token__emoji" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <span className="physical-token__label">{item.shortName}</span>
                  {item.quantity > 1 && (
                    <span className="physical-token__qty">x{item.quantity}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ZONA FÍSICA 3: Bandeja Física Separada "PRODUTOS CANCELADOS" */}
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
                  PRODUTOS CANCELADOS
                </h3>
                <span className="tray-physical-tag">Bandeja Física Separada</span>
              </div>
              <p className="hardware-zone__subtitle">
                Coloque aqui os itens removidos da compra (fora das sacolas)
              </p>
            </div>
          </div>
          <span className="scale-pill scale-pill--tray">
            <span>{formatWeight(canceledWeight)}</span>
          </span>
        </div>

        {pendingTrayItem && (
          <div className="tray-guidance-banner" role="region" aria-live="polite">
            <div className="tray-guidance-banner__instruction">
              <ArrowDown size={20} className="bounce-arrow" />
              <span>
                Deposite <strong>{pendingTrayItem.shortName}</strong> nesta bandeja para concluir a
                conferência física:
              </span>
            </div>
            <button
              type="button"
              className="btn-place-in-tray"
              onClick={() => onConfirmPlaceInTray(pendingTrayItem)}
            >
              <CheckCircle2 size={18} />
              <span>Colocar &ldquo;{pendingTrayItem.shortName}&rdquo; na Bandeja</span>
            </button>
          </div>
        )}

        <div className="physical-surface physical-surface--canceled">
          {canceledTrayItems.length === 0 && !pendingTrayItem ? (
            <div className="physical-surface__placeholder physical-surface__placeholder--tray">
              Bandeja de Produtos Cancelados vazia • Separada da área de ensacamento
            </div>
          ) : (
            <div className="physical-tokens-grid">
              {canceledTrayItems.map((item) => (
                <div key={item.cancelId} className="physical-token physical-token--canceled">
                  <span className="physical-token__emoji" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <span className="physical-token__label">{item.shortName}</span>
                  <span className="physical-token__qty">x{item.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
