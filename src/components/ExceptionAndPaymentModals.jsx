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
 * Seção 8 — Modal de Situações Excepcionais (Assistência de Funcionário):
 * - Divergência de peso na balança / bandeja de produtos cancelados
 * - Bloqueio de segurança (ex: múltiplos cancelamentos seguidos ou solicitação de ajuda)
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
              Situação Excepcional • Assistência de Funcionário Necessária
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
                <strong>Aguardando conferência do atendente (Luz Amarela/Vermelha acesa)</strong>
              </div>
              <div className="exception-detail-item">
                <span>Motivo detectado:</span>
                <strong>{exception.reason}</strong>
              </div>
              <div className="exception-detail-item">
                <span>Sua compra:</span>
                <strong>Preservada com segurança (nenhum item perdido)</strong>
              </div>
            </div>
          </div>

          <p className="exception-ihc-note">
            <strong>Nota de IHC:</strong> Em vez de travar a tela com códigos técnicos de erro, o
            terminal explica claramente o motivo da pausa e orienta o consumidor enquanto notifica o
            funcionário.
          </p>
        </div>

        <div className="modal-window__footer">
          <button
            type="button"
            className="btn-employee-unlock"
            onClick={onResolveByEmployee}
          >
            <UserCheck size={22} />
            <span>Simular Conferência e Liberação do Funcionário (Continuar Compra)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal de Finalização e Pagamento Simulado
 */
export function PaymentModal({ isOpen, items, canceledItems, onClose, onFinishAndReset }) {
  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCanceled = canceledItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
            <span className="modal-step-tag">Resumo Final da Compra</span>
            <h2 id="payment-modal-title" className="modal-window__title">
              Compra Concluída com Sucesso!
            </h2>
          </div>
        </div>

        <div className="modal-window__body">
          <div className="receipt-box">
            <div className="receipt-box__header">
              <strong>SUPERMERCADO HORIZONTE</strong>
              <span>Caixa 04 — Cupom de Autoatendimento</span>
            </div>

            <div className="receipt-box__section">
              <h4>Itens Comprados ({items.length})</h4>
              {items.map((item) => (
                <div key={item.instanceId} className="receipt-line">
                  <span>
                    {item.quantity}x {item.shortName}
                  </span>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            {canceledItems.length > 0 && (
              <div className="receipt-box__section receipt-box__section--canceled">
                <h4>Itens Cancelados — Não Cobrados ({canceledItems.length})</h4>
                {canceledItems.map((c) => (
                  <div key={c.cancelId} className="receipt-line receipt-line--canceled">
                    <span>
                      {c.quantity}x {c.shortName} (Cancelado)
                    </span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                ))}
                <div className="receipt-line receipt-line--saved">
                  <span>Total abatido por cancelamentos:</span>
                  <strong>- {formatCurrency(totalCanceled)}</strong>
                </div>
              </div>
            )}

            <div className="receipt-box__total">
              <span>TOTAL PAGO:</span>
              <strong>{formatCurrency(totalAmount)}</strong>
            </div>
          </div>
        </div>

        <div className="modal-window__footer modal-window__footer--split">
          <button type="button" className="btn-modal-back" onClick={onClose}>
            <span>Voltar à tela da compra</span>
          </button>
          <button type="button" className="btn-finish-new" onClick={onFinishAndReset}>
            <RotateCcw size={20} />
            <span>Iniciar Nova Demonstração</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal com o Roteiro dos 9 Passos da Demonstração Acadêmica de IHC (Seção 10)
 */
export function DemoGuideModal({ isOpen, onClose, onStartEmpty, onRestoreDemo }) {
  if (!isOpen) return null;

  const steps = [
    '1. O consumidor inicia uma compra (use "Compra Exemplo" ou "Compra do Zero").',
    '2. Registra alguns produtos tocando nos itens da "Área de Leitura (Leitor Óptico)".',
    '3. Percebe que adicionou um produto por engano (ex: Azeite Extra Virgem R$ 39,90).',
    '4. Encontra a opção de cancelamento: Opção A (tocando no produto na lista → "Remover produto") ou Opção B (botão fixo "Cancelar produto").',
    '5. Seleciona o produto que deseja cancelar.',
    '6. Confirma a remoção na janela "Deseja realmente remover este produto da sua compra?".',
    '7. Visualiza o novo valor total atualizado automaticamente.',
    '8. Recebe a orientação "Coloque o produto na área identificada para itens cancelados." e deposita o item na bandeja "PRODUTOS CANCELADOS".',
    '9. Continua sua compra normalmente (ou demonstra situações de divergência de peso / bloqueio de segurança).',
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
            <span className="modal-step-tag">Guia Rápido para Gravação do Vídeo</span>
            <h2 id="guide-modal-title" className="modal-window__title">
              Roteiro de Demonstração — Projeto de IHC
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
            <span>Carregar Compra Exemplo e Fechar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
