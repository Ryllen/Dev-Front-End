/**
 * Módulo responsável por buscar e validar os dados da API
 */

/**
 * Carrega as tarefas do arquivo dados.json
 * @returns {Promise<Array>} Array de tarefas
 * @throws {Error} Se houver falha na rede, protocolo ou formato
 */
export async function carregarTarefas() {
    try {
        const resposta = await fetch('dados.json');

        // Verifica se a resposta foi bem-sucedida (status 200-299)
        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status}: ${resposta.statusText}`);
        }

        // Tenta fazer o parse do JSON
        let dados;
        try {
            dados = await resposta.json();
        } catch (error) {
            // SyntaxError indica JSON malformado
            if (error instanceof SyntaxError) {
                throw new Error('Erro de formato: o arquivo JSON está malformado.');
            }
            throw error;
        }

        // Verifica se o JSON tem a estrutura esperada
        if (!dados || typeof dados !== 'object') {
            throw new Error('Erro de formato: os dados não são um objeto válido.');
        }

        if (!dados.tarefas || !Array.isArray(dados.tarefas)) {
            throw new Error('Erro de formato: a propriedade "tarefas" não é um array.');
        }

        // Verifica se cada tarefa tem os campos obrigatórios
        dados.tarefas.forEach((tarefa, index) => {
            const camposObrigatorios = ['id', 'titulo', 'status', 'prioridade', 'prazo'];
            const camposFaltando = camposObrigatorios.filter(campo => !(campo in tarefa));
            if (camposFaltando.length > 0) {
                throw new Error(
                    `Erro de formato: tarefa ${index + 1} está com campos faltando: ${camposFaltando.join(', ')}`
                );
            }
        });

        return dados.tarefas;

    } catch (error) {
        // Distingue os tipos de erro
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Erro de rede: não foi possível conectar ao servidor. Verifique sua conexão.');
        }
        // Re-lança o erro para ser tratado pelo estado
        throw error;
    }
}