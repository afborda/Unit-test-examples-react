import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App, { calcularNovoSaldo } from "./App";

describe("componete principal", () => {
  describe("Quando abro o app do banco", () => {
    it("Mostrar o nome do banco", () => {
      render(<App />);

      expect(screen.getByText("ByteBank")).toBeInTheDocument();
    });
    it("mostra saldo", () => {
      render(<App />);

      expect(screen.getByText("Saldo:")).toBeInTheDocument();
    });
    it("o botao de realizar operação é exibido", () => {
      render(<App />);

      expect(screen.getByText("Realizar operação")).toBeInTheDocument();
    });
  });
  describe("Quando eu realizo uma transação", () => {
    it("que é um saque, o valor vai diminuir", () => {
      const valores = {
        transacao: "saque",
        valor: 50,
      };
      const novoSaldo = calcularNovoSaldo(valores, 150);
      expect(novoSaldo).toBe(100);
    });
    it("que é um saque, transação deve ser realizada", () => {
      render(<App />);

      const saldo = screen.getByText("R$ 1000");
      const transacao = screen.getByLabelText("Saque");
      const valor = screen.getByTestId("valor");
      const botaoTransacao = screen.getByText("Realizar operação");

      expect(saldo.textContent).toBe("R$ 1000");
      fireEvent.click(transacao, { target: { value: "saque" } });
      fireEvent.change(valor, {
        target: {
          value: 10,
        },
      });
      fireEvent.click(botaoTransacao);
      expect(saldo.textContent).toBe("R$ 990");
    });
    it("Sacar um valor maior que esta disponivel na conta ", () => {
      render(<App />);

      const saldo = screen.getByText("R$ 1000");
      const transacao = screen.getByLabelText("Saque");
      const valor = screen.getByTestId("valor");
      const botaoTransacao = screen.getByText("Realizar operação");

      expect(saldo.textContent).toBe("R$ 1000");

      fireEvent.click(transacao, { target: { value: "saque" } });
      fireEvent.change(valor, {
        target: {
          value: 1200,
        },
      });
      fireEvent.click(botaoTransacao);
      expect(saldo.textContent).toBe("R$ -200");
    });
  });
});
