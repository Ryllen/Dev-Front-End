import { carregarTarefas }
    from "./api.js";

import { renderizarEstado }
    from "./estados.js";

import { renderizarTarefas }
    from "./renderizacao.js";


const estado = {

    tarefas: [],

    busca: "",

    status: "todos",

    prioridade: "todas",

    ordenacao: "nenhuma",

    carregamento: "carregando",

    erro: null

};


const form =
    document.querySelector(
        "#form-filtros"
    );


const campoBusca =
    document.querySelector(
        "#busca-tarefa"
    );


const campoOrdenacao =
    document.querySelector(
        "#ordenacao"
    );


const botaoLimpar =
    document.querySelector(
        "#limpar-filtros"
    );


function derivarTarefasVisiveis(
    estadoAtual
) {

    const textoBusca =
        estadoAtual.busca
            .trim()
            .toLowerCase();


    let tarefasFiltradas =
        estadoAtual.tarefas.filter(
            tarefa => {

                const correspondeBusca =
                    tarefa.titulo
                        .toLowerCase()
                        .includes(textoBusca);


                const correspondeStatus =
                    estadoAtual.status === "todos" ||
                    tarefa.status ===
                    estadoAtual.status;


                const correspondePrioridade =
                    estadoAtual.prioridade === "todas" ||
                    tarefa.prioridade ===
                    estadoAtual.prioridade;


                return (
                    correspondeBusca &&
                    correspondeStatus &&
                    correspondePrioridade
                );

            }
        );


    if (
        estadoAtual.ordenacao ===
        "prazo-crescente"
    ) {

        tarefasFiltradas =
            [...tarefasFiltradas].sort(
                (a, b) =>
                    converterData(a.prazo) -
                    converterData(b.prazo)
            );

    }


    if (
        estadoAtual.ordenacao ===
        "prazo-decrescente"
    ) {

        tarefasFiltradas =
            [...tarefasFiltradas].sort(
                (a, b) =>
                    converterData(b.prazo) -
                    converterData(a.prazo)
            );

    }


    return tarefasFiltradas;
}


function converterData(data) {

    const [dia, mes, ano] =
        data.split("/");


    return new Date(
        ano,
        mes - 1,
        dia
    );

}


function atualizarTela() {

    const tarefasVisiveis =
        derivarTarefasVisiveis(
            estado
        );


    if (
        estado.carregamento ===
        "carregando"
    ) {

        renderizarEstado(
            "carregando"
        );

        return;
    }


    if (
        estado.carregamento ===
        "erro"
    ) {

        renderizarEstado(
            "erro",
            estado.erro
        );

        return;
    }


    if (
        estado.tarefas.length === 0
    ) {

        renderizarEstado(
            "vazio"
        );

        return;
    }


    if (
        tarefasVisiveis.length === 0
    ) {

        renderizarTarefas([]);

        renderizarEstado(
            "resultado-vazio"
        );

        return;
    }


    renderizarTarefas(
        tarefasVisiveis
    );


    renderizarEstado(
        "sucesso",
        tarefasVisiveis.length
    );

}


function configurarEventos() {

    campoBusca.addEventListener(
        "input",
        evento => {

            estado.busca =
                evento.target.value;

            atualizarTela();

        }
    );


    document
        .querySelectorAll(
            'input[name="status"]'
        )
        .forEach(radio => {

            radio.addEventListener(
                "change",
                evento => {

                    estado.status =
                        evento.target.value;

                    atualizarTela();

                }
            );

        });


    document
        .querySelectorAll(
            'input[name="prioridade"]'
        )
        .forEach(radio => {

            radio.addEventListener(
                "change",
                evento => {

                    estado.prioridade =
                        evento.target.value;

                    atualizarTela();

                }
            );

        });


    campoOrdenacao.addEventListener(
        "change",
        evento => {

            estado.ordenacao =
                evento.target.value;

            atualizarTela();

        }
    );


    form.addEventListener(
        "submit",
        evento => {

            evento.preventDefault();

            atualizarTela();

        }
    );


    botaoLimpar.addEventListener(
        "click",
        () => {

            estado.busca = "";

            estado.status =
                "todos";

            estado.prioridade =
                "todas";

            estado.ordenacao =
                "nenhuma";


            campoBusca.value = "";

            campoOrdenacao.value =
                "nenhuma";


            document
                .querySelector(
                    "#status-todos"
                )
                .checked = true;


            document
                .querySelector(
                    "#prioridade-todas"
                )
                .checked = true;


            atualizarTela();

        }
    );

}


function mensagemDeErro(erro) {

    if (
        erro.name ===
        "TypeError"
    ) {

        return "Erro de rede. Não foi possível carregar as tarefas.";

    }


    if (
        erro.name ===
        "SyntaxError"
    ) {

        return "Erro no formato do JSON. Verifique o arquivo dados.json.";

    }


    if (
        erro.name ===
        "HttpError"
    ) {

        return `Erro HTTP ${erro.status}. Não foi possível carregar os dados.`;

    }


    if (
        erro.name ===
        "FormatError"
    ) {

        return "Erro no formato dos dados do arquivo JSON.";

    }


    return "Ocorreu um erro ao carregar as tarefas.";

}


async function inicializar() {

    configurarEventos();


    estado.carregamento =
        "carregando";

    atualizarTela();


    try {

        const tarefas =
            await carregarTarefas();


        estado.tarefas =
            tarefas;


        estado.carregamento =
            "sucesso";


        estado.erro =
            null;


    } catch (erro) {

        estado.carregamento =
            "erro";


        estado.erro =
            mensagemDeErro(erro);

    }


    atualizarTela();

}


inicializar();