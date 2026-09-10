const listasPorStatus = {

    "a-fazer": "#lista-afazer",

    "em-andamento": "#lista-andamento",

    "em-revisao": "#lista-revisao",

    "concluida": "#lista-concluida"

};


function criarCard(tarefa) {

    const li =
        document.createElement("li");


    const article =
        document.createElement("article");


    article.dataset.tarefaId =
        tarefa.id;


    const titulo =
        document.createElement("h3");

    titulo.textContent =
        tarefa.titulo;


    const projeto =
        document.createElement("p");

    projeto.innerHTML =
        `<strong>Projeto:</strong> ${tarefa.projeto}`;


    const responsavel =
        document.createElement("p");

    responsavel.innerHTML =
        `<strong>Responsável:</strong> ${tarefa.responsavel}`;


    const prazo =
        document.createElement("p");

    prazo.className =
        "card-deadline";

    prazo.innerHTML =
        `<strong>Prazo:</strong> ${tarefa.prazo}`;


    const prioridade =
        document.createElement("p");

    prioridade.className =
        "card-priority";

    prioridade.textContent =
        `Prioridade: ${tarefa.prioridade}`;


    article.append(
        titulo,
        projeto,
        responsavel,
        prazo,
        prioridade
    );


    li.appendChild(article);


    return li;
}


export function renderizarTarefas(tarefas) {

    Object.values(listasPorStatus)
        .forEach(seletor => {

            const lista =
                document.querySelector(seletor);

            lista.replaceChildren();

        });


    tarefas.forEach(tarefa => {

        const seletor =
            listasPorStatus[tarefa.status];


        const lista =
            document.querySelector(seletor);


        if (lista) {

            lista.appendChild(
                criarCard(tarefa)
            );

        }

    });

}