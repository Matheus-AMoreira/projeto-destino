import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/paths";
import { useSession } from "@/store/sessionStore";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const seassion = useSession();
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Confirmar Compra</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda: Dados e Pagamento */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados do Usuário (Vindo do Store) */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                👤 Seus Dados
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  ID: {seassion.usuario?.nomeCompleto}
                </p>
                <p>
                  <strong>Email:</strong> {seassion.usuario?.email}
                </p>
              </div>
            </div>

            {/* Forma de Pagamento */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                💳 Forma de Pagamento
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selecione como deseja pagar:
                </label>
                <select
                  value={metodoPagamento}
                  onChange={(e) => setMetodoPagamento(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cartao-credito">💳 Cartão de Crédito</option>
                  <option value="cartao-debito">💳 Cartão de Débito</option>
                  <option value="pix">🧾 PIX</option>
                </select>
              </div>

              {/* Opções Cartão Crédito */}
              {metodoPagamento === "cartao-credito" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parcelas
                    </label>
                    <select
                      value={parcelas}
                      onChange={(e) => setParcelas(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <option key={num} value={num}>
                          {num}x de {formatarValor(valorTotal / num)}
                          {num > 1 ? " sem juros" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Info PIX */}
              {metodoPagamento === "pix" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🧾</span>
                    <div>
                      <p className="font-semibold text-green-800">
                        5% de desconto no PIX!
                      </p>
                      <p className="text-sm text-green-600">
                        Economize {formatarValor(descontoPix)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleFinalizarCompra}
              disabled={loading}
              className={`w-full text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading
                ? "Processando..."
                : metodoPagamento === "pix"
                ? `Pagar com PIX - ${formatarValor(valorComDescontoPix)}`
                : `Confirmar Compra - ${formatarValor(valorTotal)}`}
            </button>
          </div>

          {/* Coluna Direita: Resumo */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📦 Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Pacote</span>
                  <p className="font-medium">{pacoteState.nome}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Destino:</span>
                  <span>{pacoteState.destino}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Valor Original:</span>
                  <span>{formatarValor(valorTotal)}</span>
                </div>

                {metodoPagamento === "pix" && (
                  <div className="flex justify-between text-sm text-green-600 mb-2">
                    <span>Desconto PIX:</span>
                    <span>-{formatarValor(descontoPix)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center font-bold text-lg mt-4 pt-4 border-t">
                  <span>Total a pagar:</span>
                  <span className="text-blue-600">
                    {metodoPagamento === "pix"
                      ? formatarValor(valorComDescontoPix)
                      : formatarValor(valorTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
