// ==UserScript==
// @name         Imdb_Streaming
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A code to play stream movies directly on Imdb Website.
// @author       rpagli
// @updateURL    https://github.com/rpagli/Imbd_Streaming/raw/refs/heads/main/Imdb_Streaming.user.js
// @downloadURL  https://github.com/rpagli/Imbd_Streaming/raw/refs/heads/main/Imdb_Streaming.user.js
// @match        *://www.imdb.com/*/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Criando o botão de "ASSISTIR"
    var watchButton = document.createElement("a");
    watchButton.href = "#";
    watchButton.text = "ASSISTIR";
    watchButton.style.position = "fixed";
    watchButton.style.top = "65px";
    watchButton.style.left = "10px";
    watchButton.style.background = "#f5c518";
    watchButton.style.color = "#222";
    watchButton.style.padding = "10px 20px";
    watchButton.style.fontWeight = "bold";
    watchButton.style.borderRadius = "50px";
    watchButton.style.zIndex = "100000";
    watchButton.style.cursor = "pointer";

    var divOptions = document.createElement("div");
    divOptions.style.position = "fixed";
    divOptions.style.top = "110px";
    divOptions.style.left = "10px";
    divOptions.style.zIndex = "100000";
    divOptions.style.background = "#000";
    divOptions.style.padding = "10px 10px 0px 10px";
    divOptions.style.display = "none";
    divOptions.style.flexDirection = "column";
    divOptions.style.borderRadius = "10px";
    divOptions.style.justifyContent = "space-between";
    divOptions.style.height = "auto";

    document.body.appendChild(watchButton);
    document.body.appendChild(divOptions);

    // Criando o dialog para seleção das URLs
    var modal = document.createElement("dialog");
    modal.style.display = "none"; // Inicialmente escondido
    modal.style.flexDirection = "column";
    //modal.style.position = "fixed";
    //modal.style.top = "50%";
    //modal.style.left = "50%";
    //modal.style.transform = "translate(-50%, -50%)";
    //modal.style.padding = "20px";
    modal.style.backgroundColor = "#fff";
    modal.style.zIndex = "1000000";
    //modal.style.width = "300px";
    //modal.style.height = "300px";

    // Adicionando o modal ao body
    document.body.appendChild(modal);

    modal.innerHTML = `<h2 style="padding: 20px;text-align: center;font-size: 1.2rem;font-family: 'Roboto';">Faça uma doação de qualquer valor para ajudar a manter o projeto vivo!</h2><div style="
    display: flex;
    justify-content: space-evenly;
"><div style="
    width: 40%;
"><div style="
"><h3 style="
    background: aquamarine;
    padding: 10px;
    text-align: center;
    border-radius: 10px;
    font-weight: bold;
    font-family: 'Roboto';
">Doação via PIX</h3><div style="position: relative;width: 100%;padding-top: 100.0000%;padding-bottom: 0;overflow: hidden;will-change: transform;">  <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;" src="https://www.canva.com/design/DAGZjS2-ywo/kL7slNWsPJ2CVyMfY4L6MQ/view?embed" allowfullscreen="allowfullscreen" allow="fullscreen"></div></iframe></div><input disabled="" style="
    width: 100%;
" value="00020101021126580014br.gov.bcb.pix0136c84e7b82-d96f-4bba-8045-3347329b097d5204000053039865802BR5918RAPHAEL G DA SILVA6008LONDRINA62070503***630415E4"></div></div><div style="
    width: 40%;
"><h3 style="
    background: dodgerblue;
    padding: 10px;
    text-align: center;
    border-radius: 10px;
    font-weight: bold;
    font-family: 'Roboto';
">Doação via Paypal</h3><img src="data:image/png;base64,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" style="
    width: 100%;
    padding: 10px;
"><input disabled="" style="
    width: 100%;
" value="https://www.paypal.com/donate/?hosted_button_id=V993BEAE5LDXG"></div></div>`

    // Função que será chamada quando o usuário clicar no botão "ASSISTIR"
    watchButton.addEventListener("click", function () {
        const metaTag = document.querySelector('meta[property="imdb:pageConst"]');
        if (metaTag) {
            const imdbPageConst = metaTag.getAttribute('content');
            const tmdbId = null;
            const urls = [];
            console.log(`ID Capturado: ${imdbPageConst}`);

            const query = `https://api.themoviedb.org/3/find/${imdbPageConst}?external_source=imdb_id&api_key=fde5ddeba3b7dec3fc1f51852ca0fb95`;

            const options = {
                method: 'GET',
            };

            fetch(query, options)
                .then(res => res.json())
                .then(res => {

                if(document.title.includes("Série de TV")){

                    const urls = [
                        `https://embed.warezcdn.link/serie/${imdbPageConst}`,
                        `https://supercdn.org/tvshow/${imdbPageConst}`,
                        `https://embed.embedplayer.site/serie/${res.tv_results[0].id}/`,
                        `https://assistirseriesonline.cc/embed/${res.tv_results[0].id}`,
                        `https://vidsrc.xyz/embed/tv?imdb=${imdbPageConst}&ds_lang=ptBR`
                    ];

                    showUrlSelectionDialog(urls);
                }else{

                    const urls = [
                        `https://embed.warezcdn.link/filme/${imdbPageConst}`,
                        `https://supercdn.org/movie/${imdbPageConst}`,
                        `https://embed.embedplayer.site/${imdbPageConst}`,
                        `https://assistirseriesonline.cc/filme/${imdbPageConst}`,
                        `https://vidsrc.xyz/embed/movie?imdb=${imdbPageConst}&ds_lang=ptBR`
                    ];

                    showUrlSelectionDialog(urls);
                }
            })
                .catch(err => {

                if(document.title.includes("Série de TV")){

                    const urls = [
                        `https://embed.warezcdn.link/serie/${imdbPageConst}`,
                        `https://supercdn.org/tvshow/${imdbPageConst}`,
                        `https://embed.embedplayer.site/serie/${imdbPageConst}/`,
                        `https://assistirseriesonline.cc/embed/${imdbPageConst}`,
                        `https://vidsrc.xyz/embed/tv?imdb=${imdbPageConst}&ds_lang=ptBR`
                    ];

                    showUrlSelectionDialog(urls);
                }else{

                    const urls = [
                        `https://embed.warezcdn.link/filme/${imdbPageConst}`,
                        `https://supercdn.org/movie/${imdbPageConst}`,
                        `https://embed.embedplayer.site/${imdbPageConst}`,
                        `https://assistirseriesonline.cc/filme/${imdbPageConst}`,
                        `https://vidsrc.xyz/embed/movie?imdb=${imdbPageConst}&ds_lang=ptBR`
                    ];

                    showUrlSelectionDialog(urls);
                }

            });
        } else {
            console.error("Meta tag com imdb:pageConst não encontrada.");
        }
    });

    // Função para exibir o diálogo com os botões das URLs
    function showUrlSelectionDialog(urls) {
        // Limpa qualquer conteúdo existente no modal
        //modal.innerHTML = "<h2>Escolha uma opção para assistir:</h2>";
        divOptions.innerHTML = "";
        divOptions.style.display = divOptions.style.display === "none" ? divOptions.style.display = "flex" : divOptions.style.display = "none";
        var index = 1;
        // Cria um botão para cada URL
        urls.forEach(function (url) {
            var btnOption = document.createElement("a");
            btnOption.classList.add("btnOption");
            btnOption.href = url;
            btnOption.innerText = `Opção ${index}`;
            btnOption.target = "_blank";

            btnOption.style.color = "#111";
            btnOption.style.background = "#f5c518";
            btnOption.style.fontWeight = "bold";
            btnOption.style.marginBottom = "10px";
            btnOption.style.padding = "10px";
            btnOption.style.borderRadius = "5px";
            btnOption.style.textDecoration = "none";

            divOptions.appendChild(btnOption);

            index += 1;

        });

        var btnDonation = document.createElement("a");
        //btnOption.classList.add("btnOption");
        btnDonation.href = "#";
        btnDonation.innerText = `Doar`;
        //btnOption.target = "_blank";

        btnDonation.style.color = "#fff";
        btnDonation.style.background = "#00f";
        btnDonation.style.fontWeight = "bold";
        btnDonation.style.marginBottom = "10px";
        btnDonation.style.padding = "10px";
        btnDonation.style.borderRadius = "5px";
        btnDonation.style.textDecoration = "none";
        btnDonation.style.textAlign = "center";

        divOptions.appendChild(btnDonation);

        btnDonation.addEventListener("click", function () {
            //Exibe o modal
            modal.style.display = "flex";
            modal.showModal();

        });

    }

    // Função para abrir a URL em uma nova aba
    function openInNewTab(url) {
        window.open(url, "_blank"); // Abre a URL em uma nova aba
    }

})();
