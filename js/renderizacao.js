
/**
 * Renderiza as tarefas no quadro de acordo com o status
 * @param {Array} tarefas - Array de tarefas a serem renderizadas
 */
export function renderizarTarefas(tarefas) {
    // Limpa as colunas existentes (mantém a seção de busca)
    const main = document.querySelector('main');
    const sections = main.querySelectorAll('section:not(:first-child)');
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
        main.appendChild(coluna);
    });
}

/**
 * Cria uma coluna de tarefas para um status específico
 * @param {string} status - Status da coluna
 * @param {Array} tarefas - Tarefas da coluna
 * @returns {HTMLElement} Elemento section da coluna
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