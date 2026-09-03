/**
 * Módulo responsável por gerenciar os estados da aplicação
 * Nenhuma requisição ou manipulação direta de dados aqui
 */

import { renderizarTarefas } from './renderizacao.js';

/**
 * Renderiza o estado atual da aplicação
 * @param {string} estado - 'carregando' | 'sucesso' | 'vazio' | 'erro'
 * @param {Object} dados - Dados para renderização (tarefas ou mensagem de erro)
 */
export function renderizarEstado(estado, dados) {
    const elementoStatus = document.getElementById('status-regiao');
    const containerTarefas = document.querySelector('main');

    // Remove estados anteriores
    const estadosExistentes = containerTarefas.querySelectorAll('.estado-mensagem');
    estadosExistentes.forEach(el => el.remove());

    switch (estado) {
        case 'carregando':
            renderizarCarregando(containerTarefas, elementoStatus);
            break;

        case 'sucesso':
            renderizarSucesso(containerTarefas, dados, elementoStatus);
            break;

        case 'vazio':
            renderizarVazio(containerTarefas, elementoStatus);
            break;

        case 'erro':
            renderizarErro(containerTarefas, dados, elementoStatus);
            break;

        default:
            console.warn(`Estado desconhecido: ${estado}`);
    }
}

/**
 * Renderiza o estado de carregamento
 */
function renderizarCarregando(container, elementoStatus) {
    const mensagem = document.createElement('div');
    mensagem.className = 'estado-mensagem estado-carregando';
    mensagem.innerHTML = `
        <div class="estado-conteudo">
            <div class="spinner"></div>
            <p>Carregando tarefas...</p>
        </div>
    `;
    container.prepend(mensagem);

    // Atualiza região de status para acessibilidade
    elementoStatus.textContent = 'Carregando tarefas. Aguarde.';
}

/**
 * Renderiza o estado de sucesso
 */
function renderizarSucesso(container, tarefas, elementoStatus) {
    // Remove os cartões existentes (mantém a seção de busca)
    const sections = container.querySelectorAll('section:not(:first-child)');
    sections.forEach(section => section.remove());

    // Agrupa tarefas por status
    const tarefasPorStatus = {
        'a-fazer': [],
        'em-andamento': [],
        'em-revisao': [],
        'concluida': []
    };

    tarefas.forEach(tarefa => {
        if (tarefasPorStatus[tarefa.status]) {
            tarefasPorStatus[tarefa.status].push(tarefa);
        }
    });

    // Renderiza cada coluna
    Object.keys(tarefasPorStatus).forEach(status => {
        const tarefasStatus = tarefasPorStatus[status];
        const coluna = criarColuna(status, tarefasStatus);
        container.appendChild(coluna);
    });

    // Atualiza região de status
    const total = tarefas.length;
    elementoStatus.textContent = `Sucesso: ${total} tarefa${total > 1 ? 's' : ''} carregada${total > 1 ? 's' : ''}.`;
}

/**
 * Renderiza o estado vazio
 */
function renderizarVazio(container, elementoStatus) {
    const mensagem = document.createElement('div');
    mensagem.className = 'estado-mensagem estado-vazio';
    mensagem.innerHTML = `
        <div class="estado-conteudo">
            <span class="estado-icone">📭</span>
            <h2>Nenhuma tarefa encontrada</h2>
            <p>Não há tarefas para exibir no momento.</p>
        </div>
    `;
    container.prepend(mensagem);

    elementoStatus.textContent = 'Nenhuma tarefa encontrada.';
}

/**
 * Renderiza o estado de erro
 */
function renderizarErro(container, erro, elementoStatus) {
    const mensagem = document.createElement('div');
    mensagem.className = 'estado-mensagem estado-erro';
    mensagem.innerHTML = `
        <div class="estado-conteudo">
            <span class="estado-icone">⚠️</span>
            <h2>Erro ao carregar tarefas</h2>
            <p>${erro}</p>
            <p class="estado-dica">Tente recarregar a página ou verifique sua conexão.</p>
        </div>
    `;
    container.prepend(mensagem);

    elementoStatus.textContent = `Erro: ${erro}`;
}

/**
 * Cria uma coluna de tarefas para um status específico
 */
function criarColuna(status, tarefas) {
    const section = document.createElement('section');
    section.setAttribute('aria-labelledby', `status-${status}`);
    section.id = `status-${status}`;

    const tituloMap = {
        'a-fazer': 'A fazer',
        'em-andamento': 'Em andamento',
        'em-revisao': 'Em revisão',
        'concluida': 'Concluída'
    };

    const h2 = document.createElement('h2');
    h2.id = `status-${status}`;
    h2.textContent = tituloMap[status] || status;
    section.appendChild(h2);

    const ul = document.createElement('ul');

    tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        const article = document.createElement('article');

        // Título
        const h3 = document.createElement('h3');
        h3.textContent = tarefa.titulo;
        article.appendChild(h3);

        // Projeto
        if (tarefa.projeto) {
            const pProjeto = document.createElement('p');
            pProjeto.innerHTML = `<strong>Projeto:</strong> ${tarefa.projeto}`;
            article.appendChild(pProjeto);
        }

        // Responsável
        if (tarefa.responsavel) {
            const pResponsavel = document.createElement('p');
            pResponsavel.innerHTML = `<strong>Responsável:</strong> ${tarefa.responsavel}`;
            article.appendChild(pResponsavel);
        }

        // Prazo (com classe para base do cartão)
        const pPrazo = document.createElement('p');
        pPrazo.className = 'card-deadline';
        pPrazo.innerHTML = `<strong>Prazo:</strong> ${tarefa.prazo}`;
        article.appendChild(pPrazo);

        // Prioridade (com classe para estilo badge)
        const pPrioridade = document.createElement('p');
        pPrioridade.className = 'card-priority';
        pPrioridade.textContent = tarefa.prioridade;
        article.appendChild(pPrioridade);

        li.appendChild(article);
        ul.appendChild(li);
    });

    section.appendChild(ul);
    return section;
}