import React, { useState } from 'react';
import TerminalHeader from './components/TerminalHeader';
import ProductList from './components/ProductList';
import CanceledHistory from './components/CanceledHistory';
import CheckoutSummary from './components/CheckoutSummary';
import PhysicalZones from './components/PhysicalZones';
import {
  CancelSelectionModal,
  CancelConfirmationModal,
  CancelSuccessModal,
} from './components/CancelModals';
import {
  AssistanceModal,
  PaymentModal,
  DemoGuideModal,
} from './components/ExceptionAndPaymentModals';
import { INITIAL_CART_ITEMS } from './data/products';
import { soundFX } from './utils/sound';
import { CheckCircle2, PackageX, X } from 'lucide-react';

function getCurrentTimeStr() {
  const now = new Date();
  return now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function App() {
  // Produtos registrados atualmente na compra
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  // Produto selecionado diretamente na lista (Opção A)
  const [selectedInstanceId, setSelectedInstanceId] = useState(null);
  // Histórico de produtos cancelados durante a compra (Seção 7)
  const [canceledHistory, setCanceledHistory] = useState([]);
  // Itens fisicamente depositados na bandeja "PRODUTOS CANCELADOS" (Seção 6)
  const [canceledTrayItems, setCanceledTrayItems] = useState([]);
  // Item cancelado aguardando ser colocado fisicamente na bandeja "PRODUTOS CANCELADOS"
  const [pendingTrayItem, setPendingTrayItem] = useState(null);

  // Estados dos modais do fluxo de cancelamento
  const [isFixedCancelModalOpen, setIsFixedCancelModalOpen] = useState(false);
  const [confirmationTarget, setConfirmationTarget] = useState(null); // { item, method: 'OptionA' | 'OptionB' }
  const [justCanceledItem, setJustCanceledItem] = useState(null);
  const [inlineSuccessBanner, setInlineSuccessBanner] = useState(null);

  // Feedback visual quando tenta cancelar sem produtos registrados
  const [emptyCancelFeedback, setEmptyCancelFeedback] = useState(false);

  // Animação de leitura do scanner óptico
  const [scannerActive, setScannerActive] = useState(false);
  const [lastScannedId, setLastScannedId] = useState(null);

  // Situações excepcionais (Seção 8) e modais auxiliares
  const [activeException, setActiveException] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Determina o status luminoso do terminal físico
  const terminalStatus = activeException
    ? 'assistance_needed'
    : pendingTrayItem
    ? 'awaiting_tray'
    : 'normal';

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.enabled = next;
  };

  // Registrar um produto a partir da Área de Leitura (Scanner Óptico)
  const handleScanProduct = (catalogProduct) => {
    soundFX.playScanBeep();
    setScannerActive(true);
    setEmptyCancelFeedback(false);

    setTimeout(() => {
      setScannerActive(false);
    }, 450);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === catalogProduct.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + 1,
        };
        setLastScannedId(existing.instanceId);
        return updated;
      }

      const newInstanceId = `item-${Date.now()}`;
      setLastScannedId(newInstanceId);
      return [
        ...prev,
        {
          instanceId: newInstanceId,
          productId: catalogProduct.id,
          code: catalogProduct.code,
          name: catalogProduct.name,
          shortName: catalogProduct.shortName,
          category: catalogProduct.category,
          price: catalogProduct.price,
          quantity: 1,
          weightKg: catalogProduct.weightKg,
          emoji: catalogProduct.emoji,
          registeredAt: getCurrentTimeStr(),
        },
      ];
    });
  };

  // Alterar quantidade diretamente na lista
  const handleChangeQuantity = (instanceId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Opção B: Tocar no botão fixo "Cancelar produto"
  const handleOpenFixedCancelModal = () => {
    if (cartItems.length === 0) {
      soundFX.playAlert();
      setEmptyCancelFeedback(true);
      return;
    }
    setEmptyCancelFeedback(false);
    setIsFixedCancelModalOpen(true);
  };

  // Iniciar etapa de confirmação (tanto pela Opção A quanto pela Opção B)
  const handleRequestCancelItem = (item, method, initialCancelQty = null) => {
    setIsFixedCancelModalOpen(false);
    setConfirmationTarget({
      item,
      method,
      initialCancelQty: initialCancelQty || item.quantity,
    });
  };

  // Botão "Voltar" na janela de Confirmação de Cancelamento
  const handleBackFromConfirmation = () => {
    if (!confirmationTarget) return;
    const previousMethod = confirmationTarget.method;
    setConfirmationTarget(null);
    // Se veio da Opção B, permite voltar à lista de seleção ou fechar
    if (previousMethod === 'OptionB' && cartItems.length > 0) {
      setIsFixedCancelModalOpen(true);
    }
  };

  // Botão "Confirmar cancelamento" na janela de Confirmação (suporta cancelamento parcial ou total da quantidade)
  const handleConfirmCancel = (itemToCancel, method, quantityToCancel = itemToCancel.quantity) => {
    soundFX.playCancelSuccess();

    const safeQtyToCancel = Math.max(
      1,
      Math.min(itemToCancel.quantity, Number(quantityToCancel) || itemToCancel.quantity)
    );
    const isFullRemoval = safeQtyToCancel >= itemToCancel.quantity;

    // Atualiza ou remove o produto da lista de compras conforme a quantidade selecionada
    setCartItems((prev) => {
      if (isFullRemoval) {
        return prev.filter((i) => i.instanceId !== itemToCancel.instanceId);
      }
      return prev.map((i) =>
        i.instanceId === itemToCancel.instanceId
          ? { ...i, quantity: i.quantity - safeQtyToCancel }
          : i
      );
    });

    if (isFullRemoval && selectedInstanceId === itemToCancel.instanceId) {
      setSelectedInstanceId(null);
    }

    const canceledRecord = {
      ...itemToCancel,
      quantity: safeQtyToCancel,
      cancelId: `cancel-${Date.now()}`,
      canceledAt: getCurrentTimeStr(),
      methodLabel: method === 'OptionA' ? 'Via Lista (Opção A)' : 'Via Botão Fixo (Opção B)',
    };

    // Adiciona ao histórico de produtos cancelados
    setCanceledHistory((prev) => [canceledRecord, ...prev]);

    // Define como pendente de depósito na bandeja física "PRODUTOS CANCELADOS"
    setPendingTrayItem(canceledRecord);
    setConfirmationTarget(null);
    setJustCanceledItem(canceledRecord);
    setInlineSuccessBanner(canceledRecord);
  };

  // Simular ação física do consumidor: colocar o produto removido na bandeja "PRODUTOS CANCELADOS"
  const handlePlaceInTrayAndContinue = (canceledRecord) => {
    const target = canceledRecord || pendingTrayItem;
    if (target) {
      setCanceledTrayItems((prev) => {
        if (prev.some((i) => i.cancelId === target.cancelId)) return prev;
        return [target, ...prev];
      });
    }
    setPendingTrayItem(null);
    setJustCanceledItem(null);

    // Se o consumidor realizar 4 ou mais cancelamentos na mesma compra, podemos demonstrar
    // o bloqueio preventivo opcional ou manter a compra fluindo normalmente
  };

  // Simular situação excepcional: Consumidor não colocou o produto na bandeja de cancelados (Divergência de peso)
  const handleSimulateForgotTray = (canceledRecord) => {
    soundFX.playAlert();
    setJustCanceledItem(null);
    setActiveException({
      type: 'weight_discrepancy',
      title: 'Divergência de Peso Detectada na Balança',
      reason: `O produto cancelado "${
        canceledRecord ? canceledRecord.name : 'Item removido'
      }" ainda está na área de ensacamento ou não foi identificado na bandeja "PRODUTOS CANCELADOS".`,
      description:
        'Para continuar sua compra com segurança, retire o item cancelado da sacola e coloque-o na bandeja "PRODUTOS CANCELADOS", ou aguarde o funcionário.',
    });
  };

  // Simular situação excepcional manualmente pelo cabeçalho: Divergência de Peso
  const handleTriggerWeightAlert = () => {
    soundFX.playAlert();
    setActiveException({
      type: 'weight_discrepancy',
      title: 'Divergência de Peso na Área de Ensacamento',
      reason:
        'O peso medido na balança de ensacamento não corresponde aos produtos ativos registrados na tela.',
      description:
        'Verifique se algum produto cancelado permaneceu na sacola em vez de ser colocado na bandeja "PRODUTOS CANCELADOS". Um funcionário foi notificado para auxiliar.',
    });
  };

  // Simular situação excepcional: Bloqueio de Segurança / Auditoria de Funcionário
  const handleTriggerSecurityBlock = () => {
    soundFX.playAlert();
    setActiveException({
      type: 'security_block',
      title: 'Bloqueio Preventivo de Segurança — Conferência do Atendente',
      reason:
        'Limite de cancelamentos autônomos atingido nesta compra ou item sujeito à conferência visual.',
      description:
        'Sua compra está salva! Um funcionário do Supermercado Horizonte já foi acionado para validar os itens na bandeja "PRODUTOS CANCELADOS" e liberar o terminal.',
    });
  };

  // Solicitar ajuda voluntariamente
  const handleRequestAssistance = () => {
    soundFX.playAlert();
    setActiveException({
      type: 'attendant_requested',
      title: 'Solicitação de Ajuda Enviada ao Funcionário',
      reason: 'O consumidor tocou no botão "Chamar Funcionário" no painel do caixa.',
      description:
        'A luz indicadora do Caixa 04 foi acesa. Um atendente chegará em instantes para ajudar você.',
    });
  };

  // Liberação pelo funcionário
  const handleResolveException = () => {
    if (pendingTrayItem) {
      setCanceledTrayItems((prev) => {
        if (prev.some((i) => i.cancelId === pendingTrayItem.cancelId)) return prev;
        return [pendingTrayItem, ...prev];
      });
      setPendingTrayItem(null);
    }
    setActiveException(null);
  };

  // Restaurar compra exemplo para o vídeo
  const handleResetDemo = () => {
    setCartItems(INITIAL_CART_ITEMS);
    setSelectedInstanceId(null);
    setCanceledHistory([]);
    setCanceledTrayItems([]);
    setPendingTrayItem(null);
    setConfirmationTarget(null);
    setJustCanceledItem(null);
    setInlineSuccessBanner(null);
    setActiveException(null);
    setEmptyCancelFeedback(false);
    setIsPaymentModalOpen(false);
  };

  // Iniciar compra do zero (carrinho vazio)
  const handleStartEmpty = () => {
    setCartItems([]);
    setSelectedInstanceId(null);
    setCanceledHistory([]);
    setCanceledTrayItems([]);
    setPendingTrayItem(null);
    setConfirmationTarget(null);
    setJustCanceledItem(null);
    setInlineSuccessBanner(null);
    setActiveException(null);
    setEmptyCancelFeedback(false);
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="kiosk-shell">
      {/* Cabeçalho Superior do Terminal Físico */}
      <TerminalHeader
        terminalStatus={terminalStatus}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onResetDemo={handleResetDemo}
        onStartEmpty={handleStartEmpty}
        onTriggerWeightAlert={handleTriggerWeightAlert}
        onTriggerSecurityBlock={handleTriggerSecurityBlock}
        onOpenGuide={() => setIsGuideModalOpen(true)}
      />

      {/* Banner de Confirmação Visual e Orientação Física na Tela Principal (Seção 5) */}
      {inlineSuccessBanner && (
        <div className="inline-cancel-feedback-bar" role="status" aria-live="polite">
          <div className="inline-cancel-feedback-bar__left">
            <span className="inline-feedback-icon">
              <CheckCircle2 size={22} />
            </span>
            <div className="inline-feedback-texts">
              <strong>Produto cancelado com sucesso!</strong>
              <span className="inline-feedback-separator">•</span>
              <span className="inline-feedback-guidance">
                <PackageX size={17} />
                Coloque o produto na área identificada para itens cancelados (
                <em>&ldquo;{inlineSuccessBanner.shortName}&rdquo;</em>).
              </span>
            </div>
          </div>
          <div className="inline-cancel-feedback-bar__right">
            {pendingTrayItem && (
              <button
                type="button"
                className="inline-feedback-tray-btn"
                onClick={() => handlePlaceInTrayAndContinue(pendingTrayItem)}
              >
                Confirmar depósito na bandeja
              </button>
            )}
            <button
              type="button"
              className="inline-feedback-close"
              onClick={() => setInlineSuccessBanner(null)}
              aria-label="Fechar aviso"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Área Principal da Tela Touchscreen Horizontal */}
      <main className="terminal-main-screen">
        {/* Coluna Esquerda/Central: Lista de Produtos Registrados + Histórico de Cancelados */}
        <div className="terminal-left-column">
          <ProductList
            items={cartItems}
            selectedInstanceId={selectedInstanceId}
            onSelectItem={setSelectedInstanceId}
            onRequestCancelItem={handleRequestCancelItem}
            onChangeQuantity={handleChangeQuantity}
            lastScannedId={lastScannedId}
          />

          <CanceledHistory
            canceledItems={canceledHistory}
            pendingTrayItem={pendingTrayItem}
            onPlaceInTray={handlePlaceInTrayAndContinue}
          />
        </div>

        {/* Coluna Direita: Valor Total + Botão Fixo "Cancelar produto" + Finalizar Compra */}
        <CheckoutSummary
          items={cartItems}
          canceledItems={canceledHistory}
          onOpenFixedCancelModal={handleOpenFixedCancelModal}
          onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          onRequestAssistance={handleRequestAssistance}
          emptyCancelFeedback={emptyCancelFeedback}
        />
      </main>

      {/* Bancada Física Inferior: 1. Leitor de Produtos | 2. Área de Ensacamento | 3. Bandeja "PRODUTOS CANCELADOS" */}
      <PhysicalZones
        cartItems={cartItems}
        canceledTrayItems={canceledTrayItems}
        pendingTrayItem={pendingTrayItem}
        scannerActive={scannerActive}
        onScanProduct={handleScanProduct}
        onConfirmPlaceInTray={handlePlaceInTrayAndContinue}
      />

      {/* Modal Opção B: Escolha do Produto para Cancelar via Botão Fixo */}
      <CancelSelectionModal
        isOpen={isFixedCancelModalOpen}
        items={cartItems}
        onClose={() => setIsFixedCancelModalOpen(false)}
        onSelectProductToCancel={handleRequestCancelItem}
      />

      {/* Etapa 4: Janela de Confirmação de Cancelamento (comum para Opção A e Opção B) */}
      <CancelConfirmationModal
        item={confirmationTarget?.item || null}
        method={confirmationTarget?.method || 'OptionA'}
        initialCancelQty={confirmationTarget?.initialCancelQty}
        onBack={handleBackFromConfirmation}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* Etapa 5: Confirmação Visual "Produto cancelado com sucesso!" + Orientação da Bandeja */}
      <CancelSuccessModal
        canceledItem={justCanceledItem}
        newTotal={totalAmount}
        onPlaceInTrayAndContinue={handlePlaceInTrayAndContinue}
        onSimulateForgotTray={handleSimulateForgotTray}
      />

      {/* Etapa 8: Situações Excepcionais (Divergência de Peso ou Bloqueio de Segurança) */}
      <AssistanceModal
        exception={activeException}
        onResolveByEmployee={handleResolveException}
      />

      {/* Modal de Pagamento / Resumo Final da Compra */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        items={cartItems}
        canceledItems={canceledHistory}
        onClose={() => setIsPaymentModalOpen(false)}
        onFinishAndReset={handleResetDemo}
      />

      {/* Modal com Roteiro de Demonstração IHC (9 passos) */}
      <DemoGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onStartEmpty={handleStartEmpty}
        onRestoreDemo={handleResetDemo}
      />
    </div>
  );
}
