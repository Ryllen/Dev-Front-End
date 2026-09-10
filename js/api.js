export async function carregarTarefas() {
    const resposta = await fetch("./dados.json");

    if (!resposta.ok) {
        const erro = new Error(`Erro HTTP ${resposta.status}`);
        erro.name = "HttpError";
        erro.status = resposta.status;
        throw erro;
    }

    const dados = await resposta.json();

    if (!dados || typeof dados !== "object" || !Array.isArray(dados.tarefas)) {
        const erro = new Error("Estrutura JSON inválida.");
        erro.name = "FormatError";
        throw erro;
    }

    return dados.tarefas;
}