/**
 * Ponto de entrada principal da aplicação
 * Gerencia o fluxo de carregamento e estados
 */

import { carregarTarefas } from './api.js';
import { renderizarEstado } from './estados.js';

/**
 * Inicializa a aplicação
 */
async function inicializar() {
    // Estado inicial: carregando
    renderizarEstado('carregando');

    try {
        // Tenta carregar as tarefas
        const tarefas = await carregarTarefas();

        // Verifica se há tarefas
        if (tarefas.length === 0) {
            renderizarEstado('vazio');
        } else {
            renderizarEstado('sucesso', tarefas);
        }
    } catch (error) {
        // Trata erros de forma diferenciada
        let mensagemErro = error.message;

        // Distingue tipos de erro por nome
        if (error instanceof TypeError && error.message.includes('fetch')) {
            mensagemErro = 'Erro de rede: não foi possível conectar ao servidor. Verifique sua conexão.';
        } else if (error.message.includes('formato') || error.message.includes('malformado')) {
            mensagemErro = `Erro de formato: ${error.message}`;
        } else {
            mensagemErro = `Erro: ${error.message}`;
        }

        renderizarEstado('erro', mensagemErro);
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializar);