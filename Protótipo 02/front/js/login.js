const senha = document.getElementById("senha");
const botaoMostrar = document.getElementById("mostrarSenha");

botaoMostrar.addEventListener("click", function () {

    if (senha.type === "password") {
        senha.type = "text";
        botaoMostrar.textContent = "🙈";
    } else {
        senha.type = "password";
        botaoMostrar.textContent = "👁";
    }

});

const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senhaValor = document.getElementById("senha").value;

    try {

        const resposta = await fetch("http://localhost:3000/usuarios/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                senha: senhaValor
            })

        });

        const dados = await resposta.json();
        

        if (!resposta.ok) {
            alert(dados.mensagem || "E-mail ou senha inválidos.");
            return;
        }

        if (!dados.token) {
            alert("O servidor não retornou um token.");
            return;
        }

        localStorage.setItem("token", dados.token);

        console.log("Token salvo:", dados.token);

        alert(dados.mensagem || "Login realizado com sucesso!");

        window.location.href = "/html/inicio.html";

    } catch (erro) {

        console.error("Erro no login:", erro);

        alert("Não foi possível conectar ao servidor!");

    }

});
