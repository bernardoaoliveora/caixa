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
  // Histórico de produtos cancelados durante a compra (sem cobrança)
  const [canceledHistory, setCanceledHistory] = useState([]);
  // Itens fisicamente depositados na bandeja "PRODUTOS CANCELADOS"
  const [canceledTrayItems, setCanceledTrayItems] = useState([]);
  // Item cancelado aguardando ser colocado fisicamente na bandeja
  const [pendingTrayItem, setPendingTrayItem] = useState(null);

  // Estados dos modais do fluxo de cancelamento (apenas 1 modal ativo por vez para transição limpa)
  const [isFixedCancelModalOpen, setIsFixedCancelModalOpen] = useState(false);
  const [confirmationTarget, setConfirmationTarget] = useState(null);
  const [justCanceledItem, setJustCanceledItem] = useState(null);

  // Feedback visual quando tenta cancelar sem produtos registrados
  const [emptyCancelFeedback, setEmptyCancelFeedback] = useState(false);

  // Animação de leitura do scanner óptico
  const [scannerActive, setScannerActive] = useState(false);
  const [lastScannedId, setLastScannedId] = useState(null);

  // Situações excepcionais e modais auxiliares
  const [activeException, setActiveException] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isAnyModalOpen = Boolean(
    isFixedCancelModalOpen ||
      confirmationTarget ||
      justCanceledItem ||
      activeException ||
      isPaymentModalOpen ||
      isGuideModalOpen
  );

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

  // Registrar um produto (com suporte a adicionar 1, 2 ou 3 unidades para testar cancelamento parcial)
  const handleScanProduct = (catalogProduct, quantityToAdd = 1) => {
    soundFX.playScanBeep();
    setScannerActive(true);
    setEmptyCancelFeedback(false);

    setTimeout(() => {
      setScannerActive(false);
    }, 400);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === catalogProduct.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + quantityToAdd,
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
          quantity: quantityToAdd,
          weightKg: catalogProduct.weightKg,
          emoji: catalogProduct.emoji,
          registeredAt: getCurrentTimeStr(),
        },
      ];
    });
  };

  // Opção B: Tocar no botão fixo "Cancelar produto"
  const handleOpenFixedCancelModal = () => {
    if (cartItems.length === 0) {
      soundFX.playAlert();
      setEmptyCancelFeedback(true);
      return;
    }
    setEmptyCancelFeedback(false);
    setSelectedInstanceId(null);
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
    if (previousMethod === 'OptionB' && cartItems.length > 0) {
      setIsFixedCancelModalOpen(true);
    }
  };

  // Botão "Confirmar cancelamento" (suporta cancelamento parcial ex.: 2 de 3 unidades, ou total)
  const handleConfirmCancel = (itemToCancel, method, quantityToCancel = itemToCancel.quantity) => {
    soundFX.playCancelSuccess();

    const safeQtyToCancel = Math.max(
      1,
      Math.min(itemToCancel.quantity, Number(quantityToCancel) || itemToCancel.quantity)
    );
    const isFullRemoval = safeQtyToCancel >= itemToCancel.quantity;

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

    setSelectedInstanceId(null);

    const canceledRecord = {
      ...itemToCancel,
      quantity: safeQtyToCancel,
      cancelId: `cancel-${Date.now()}`,
      canceledAt: getCurrentTimeStr(),
      methodLabel: method === 'OptionA' ? 'Via Lista (Opção A)' : 'Via Botão Fixo (Opção B)',
    };

    setCanceledHistory((prev) => [canceledRecord, ...prev]);
    setPendingTrayItem(canceledRecord);
    setConfirmationTarget(null);
    setJustCanceledItem(canceledRecord);
  };

  // Simular ação física: colocar o item removido na Bandeja de Produtos Cancelados
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
  };

  // Simular exceção: Consumidor não colocou o item na bandeja de cancelados (Divergência de peso)
  const handleSimulateForgotTray = (canceledRecord) => {
    soundFX.playAlert();
    setJustCanceledItem(null);
    setActiveException({
      type: 'weight_discrepancy',
      title: 'Divergência de Peso Detectada na Balança',
      reason: `O item cancelado (${
        canceledRecord ? `${canceledRecord.quantity}x ${canceledRecord.name}` : 'Item removido'
      }) não foi identificado na Bandeja de Produtos Cancelados.`,
      description:
        'Para prosseguir com segurança, retire o item cancelado da área de ensacamento e coloque-o na Bandeja de Produtos Cancelados, ou aguarde a conferência do funcionário.',
    });
  };

  const handleTriggerWeightAlert = () => {
    soundFX.playAlert();
    setActiveException({
      type: 'weight_discrepancy',
      title: 'Divergência de Peso na Área de Ensacamento',
      reason:
        'O peso aferido na balança de ensacamento difere do peso esperado para os itens ativos da compra.',
      description:
        'Verifique se algum item cancelado permaneceu na sacola em vez de ser depositado na Bandeja de Produtos Cancelados.',
    });
  };

  const handleTriggerSecurityBlock = () => {
    soundFX.playAlert();
    setActiveException({
      type: 'security_block',
      title: 'Bloqueio Preventivo de Segurança — Conferência do Funcionário',
      reason:
        'Múltiplos cancelamentos realizados ou item sujeito à validação visual de autoatendimento.',
      description:
        'Sua compra está preservada! Um funcionário foi chamado automaticamente para validar a Bandeja de Produtos Cancelados e liberar o terminal.',
    });
  };

  const handleRequestAssistance = () => {
    soundFX.playAlert();
    setActiveException({
      type: 'attendant_requested',
      title: 'Assistência de Funcionário Solicitada',
      reason: 'Você acionou o botão de ajuda no terminal de autoatendimento.',
      description:
        'A luz indicadora do Caixa 04 foi acesa. Um funcionário chegará em instantes para auxiliar você.',
    });
  };

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

  const handleResetDemo = () => {
    setCartItems(INITIAL_CART_ITEMS);
    setSelectedInstanceId(null);
    setCanceledHistory([]);
    setCanceledTrayItems([]);
    setPendingTrayItem(null);
    setConfirmationTarget(null);
    setJustCanceledItem(null);
    setActiveException(null);
    setEmptyCancelFeedback(false);
    setIsPaymentModalOpen(false);
  };

  const handleStartEmpty = () => {
    setCartItems([]);
    setSelectedInstanceId(null);
    setCanceledHistory([]);
    setCanceledTrayItems([]);
    setPendingTrayItem(null);
    setConfirmationTarget(null);
    setJustCanceledItem(null);
    setActiveException(null);
    setEmptyCancelFeedback(false);
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="kiosk-shell">
      {/* Cabeçalho Limpo do Terminal */}
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

      {/* Tela Principal Touchscreen Horizontal */}
      <main className="terminal-main-screen">
        {/* Coluna Esquerda: Lista de Compra Ativa + Histórico de Cancelados */}
        <div className="terminal-left-column">
          <ProductList
            items={cartItems}
            selectedInstanceId={selectedInstanceId}
            onSelectItem={setSelectedInstanceId}
            onRequestCancelItem={handleRequestCancelItem}
            lastScannedId={lastScannedId}
          />

          <CanceledHistory
            canceledItems={canceledHistory}
            pendingTrayItem={pendingTrayItem}
          />
        </div>

        {/* Coluna Direita: Total Atualizado + Botão Fixo "Cancelar produto" + Finalizar */}
        <CheckoutSummary
          items={cartItems}
          canceledItems={canceledHistory}
          onOpenFixedCancelModal={handleOpenFixedCancelModal}
          onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          onRequestAssistance={handleRequestAssistance}
          emptyCancelFeedback={emptyCancelFeedback}
        />
      </main>

      {/* Ambiente Físico: 1. Leitor/Adição | 2. Área de Ensacamento (Peso) | 3. Bandeja de Produtos Cancelados */}
      <PhysicalZones
        cartItems={cartItems}
        canceledTrayItems={canceledTrayItems}
        pendingTrayItem={pendingTrayItem}
        isModalOpen={isAnyModalOpen}
        scannerActive={scannerActive}
        onScanProduct={handleScanProduct}
        onConfirmPlaceInTray={handlePlaceInTrayAndContinue}
      />

      {/* Modal Opção B: Seleção de Produto a Cancelar */}
      <CancelSelectionModal
        isOpen={isFixedCancelModalOpen}
        items={cartItems}
        onClose={() => setIsFixedCancelModalOpen(false)}
        onSelectProductToCancel={handleRequestCancelItem}
      />

      {/* Modal de Confirmação: Escolha de Quantidade, Valor a Descontar, Novo Total e Voltar */}
      <CancelConfirmationModal
        item={confirmationTarget?.item || null}
        method={confirmationTarget?.method || 'OptionA'}
        currentTotal={totalAmount}
        initialCancelQty={confirmationTarget?.initialCancelQty}
        onBack={handleBackFromConfirmation}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* Modal de Transição Física Limpa: Orientação para colocar na Bandeja de Produtos Cancelados */}
      <CancelSuccessModal
        canceledItem={justCanceledItem}
        newTotal={totalAmount}
        onPlaceInTrayAndContinue={handlePlaceInTrayAndContinue}
        onSimulateForgotTray={handleSimulateForgotTray}
      />

      {/* Modal de Exceções (Funcionário) */}
      <AssistanceModal
        exception={activeException}
        onResolveByEmployee={handleResolveException}
      />

      {/* Modal de Resumo Final Transparente */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        items={cartItems}
        canceledItems={canceledHistory}
        onClose={() => setIsPaymentModalOpen(false)}
        onFinishAndReset={handleResetDemo}
      />

      {/* Modal com Roteiro de Demonstração IHC */}
      <DemoGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onStartEmpty={handleStartEmpty}
        onRestoreDemo={handleResetDemo}
      />
    </div>
  );
}
