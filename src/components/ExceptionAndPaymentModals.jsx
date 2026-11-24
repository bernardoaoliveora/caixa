import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  RotateCcw,
  X,
} from 'lucide-react';
import { formatCurrency } from '../data/products';

/**
 * Modal de Situações Excepcionais (Assistência de Funcionário)
 */
export function AssistanceModal({ exception, onResolveByEmployee }) {
  if (!exception) return null;

  const isWeight = exception.type === 'weight_discrepancy';

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exception-modal-title"
    >
      <div className="modal-window modal-window--exception">
        <div
          className={`modal-window__header ${
            isWeight ? 'modal-window__header--warning' : 'modal-window__header--danger'
          }`}
        >
          <div className="modal-header-icon-wrap" aria-hidden="true">
            {isWeight ? <AlertTriangle size={30} /> : <ShieldAlert size={30} />}
          </div>
          <div>
            <span className="modal-step-tag">
              Situação Excepcional • Assistência de Funcionário
            </span>
            <h2 id="exception-modal-title" className="modal-window__title">
              {exception.title}
            </h2>
          </div>
        </div>

        <div className="modal-window__body">
          <div className="exception-message-card">
            <p className="exception-message-card__main">{exception.description}</p>
            <div className="exception-details-list">
              <div className="exception-detail-item">
                <span>Status do Terminal:</span>
                <strong>Aguardando conferência do funcionário</strong>
              </div>
              <div className="exception-detail-item">
                <span>Diagnóstico:</span>
                <strong>{exception.reason}</strong>
              </div>
              <div className="exception-detail-item">
                <span>Estado da Compra:</span>
                <strong>Preservada (nenhum produto registrado foi perdido)</strong>
              </div>
            </div>
          </div>

          <p className="exception-ihc-note">
            <strong>Princípio de IHC:</strong> Mensagens de exceção em linguagem natural, indicando
            claramente a causa física (peso na balança ou limite de segurança) e como prosseguir.
          </p>
        </div>

        <div className="modal-window__footer">
          <button
            type="button"
            className="btn-employee-unlock"
            onClick={onResolveByEmployee}
          >
            <UserCheck size={22} />
            <span>Simular Liberação do Funcionário e Retomar Compra</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Resumo Final Transparente da Compra (Valor Cobrado, Valor Cancelado e Total Abatido)
 */
export function PaymentModal({ isOpen, items, canceledItems, onClose, onFinishAndReset }) {
  if (!isOpen) return null;

  const totalCharged = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCanceled = canceledItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grossTotal = totalCharged + totalCanceled;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="modal-window modal-window--payment">
        <div className="modal-window__header modal-window__header--success">
          <div className="modal-header-icon-wrap modal-header-icon-wrap--success" aria-hidden="true">
            <CheckCircle2 size={30} />
          </div>
          <div>
            <span className="modal-step-tag">Transparência e Feedback Final</span>
            <h2 id="payment-modal-title" className="modal-window__title">
              Resumo Final da Compra
            </h2>
          </div>
        </div>

        <div className="modal-window__body">
          {/* Painel de Transparência Financeira: Bruto vs. Cancelado/Abatido vs. Cobrado */}
          <div className="payment-transparency-grid">
            <div className="payment-stat-card">
              <span className="payment-stat-card__label">Total Bruto Registrado</span>
              <strong className="payment-stat-card__value">{formatCurrency(grossTotal)}</strong>
            </div>
            <div className="payment-stat-card payment-stat-card--canceled">
              <span className="payment-stat-card__label">Valor Cancelado / Abatido</span>
              <strong className="payment-stat-card__value">- {formatCurrency(totalCanceled)}</strong>
            </div>
            <div className="payment-stat-card payment-stat-card--charged">
              <span className="payment-stat-card__label">Valor Final Cobrado</span>
              <strong className="payment-stat-card__value">{formatCurrency(totalCharged)}</strong>
            </div>
          </div>

          <div className="receipt-box">
            <div className="receipt-box__header">
              <strong>SUPERMERCADO HORIZONTE</strong>
              <span>Caixa 04 — Demonstrativo Transparente de Autoatendimento</span>
            </div>

            <div className="receipt-box__section">
              <h4>Itens Cobrados na Compra ({items.reduce((a, b) => a + b.quantity, 0)} un.)</h4>
              {items.map((item) => (
                <div key={item.instanceId} className="receipt-line">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            {canceledItems.length > 0 && (
              <div className="receipt-box__section receipt-box__section--canceled">
                <h4>
                  Histórico de Itens Cancelados — Sem Cobrança (
                  {canceledItems.reduce((a, b) => a + b.quantity, 0)} un.)
                </h4>
                {canceledItems.map((c) => (
                  <div key={c.cancelId} className="receipt-line receipt-line--canceled">
                    <span>
                      {c.quantity}x {c.name} (Removido)
                    </span>
                    <span>Abatido (- {formatCurrency(c.price * c.quantity)}) • R$ 0,00</span>
                  </div>
                ))}
                <div className="receipt-line receipt-line--saved">
                  <span>Total abatido por cancelamentos:</span>
                  <strong>- {formatCurrency(totalCanceled)}</strong>
                </div>
              </div>
            )}

            <div className="receipt-box__total">
              <span>VALOR TOTAL A PAGAR:</span>
              <strong>{formatCurrency(totalCharged)}</strong>
            </div>
          </div>
        </div>

        <div className="modal-window__footer modal-window__footer--split">
          <button type="button" className="btn-modal-back" onClick={onClose}>
            <span>Voltar à compra</span>
          </button>
          <button type="button" className="btn-finish-new" onClick={onFinishAndReset}>
            <RotateCcw size={20} />
            <span>Concluir e Iniciar Nova Compra</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal com o Roteiro de Demonstração Acadêmica de IHC
 */
export function DemoGuideModal({ isOpen, onClose, onStartEmpty, onRestoreDemo }) {
  if (!isOpen) return null;

  const steps = [
    '1. Área de Leitura / Adição: Escolha "+1 un.", "+2 un." ou "+3 un." e toque nos produtos para adicioná-los com nome, preço e peso.',
    '2. Lista de Compra e Botão Fixo: Veja os produtos registrados (ex.: 3x Leite Integral) e o botão fixo vermelho "Cancelar produto".',
    '3. Inicie o Cancelamento: Toque direto em um produto da lista (Opção A) ou no botão fixo "Cancelar produto" (Opção B).',
    '4. Ajuste de Quantidade e Prévia: Escolha quantas unidades remover (ex.: 2 de 3 unidades), confira o Valor a Descontar e o Novo Total da Compra antes de confirmar, ou toque em "Voltar".',
    '5. Conexão com o Ambiente Físico: Após confirmar, siga a instrução limpa para depositar o item na "Bandeja de Produtos Cancelados" (separada da Área de Ensacamento).',
    '6. Histórico e Resumo Final: Confira o Histórico de Itens Cancelados (sem cobrança) e toque em "Finalizar e Pagar" para ver o demonstrativo com Total Bruto, Valor Abatido e Valor Final Cobrado.',
  ];

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div className="modal-window modal-window--lg">
        <div className="modal-window__header modal-window__header--navy">
          <div className="modal-header-icon-wrap" aria-hidden="true">
            <Sparkles size={26} />
          </div>
          <div>
            <span className="modal-step-tag">Guia Rápido de Avaliação</span>
            <h2 id="guide-modal-title" className="modal-window__title">
              Roteiro de Demonstração — Princípios de IHC
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fechar roteiro"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-window__body">
          <ol className="guide-steps-list">
            {steps.map((step, i) => (
              <li key={i} className="guide-step-item">
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="modal-window__footer modal-window__footer--split">
          <button
            type="button"
            className="btn-modal-back"
            onClick={() => {
              onStartEmpty();
              onClose();
            }}
          >
            <ShoppingBag size={18} />
            <span>Começar com Carrinho Vazio</span>
          </button>

          <button
            type="button"
            className="btn-finish-new"
            onClick={() => {
              onRestoreDemo();
              onClose();
            }}
          >
            <RotateCcw size={18} />
            <span>Carregar Compra Exemplo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
