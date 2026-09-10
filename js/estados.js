export function renderizarEstado(
    estado,
    mensagem = ""
) {

    const regiao =
        document.querySelector(
            "#status-regiao"
        );


    const main =
        document.querySelector("main");


    if (estado === "carregando") {

        main.hidden = true;

        regiao.textContent =
            "Carregando tarefas.";

        return;
    }


    if (estado === "erro") {

        main.hidden = true;

        regiao.textContent =
            mensagem;

        return;
    }


    if (estado === "vazio") {

        main.hidden = true;

        regiao.textContent =
            "A fonte de dados está vazia. Nenhuma tarefa foi encontrada.";

        return;
    }


    if (estado === "resultado-vazio") {

        main.hidden = false;

        regiao.textContent =
            "Nenhuma tarefa corresponde aos filtros selecionados.";

        return;
    }


    if (estado === "sucesso") {

        main.hidden = false;

        regiao.textContent =
            `${mensagem} tarefas encontradas.`;

    }

}