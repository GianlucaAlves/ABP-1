const token = localStorage.getItem("token");
const userData = JSON.parse(localStorage.getItem("user"));
if (!token || !userData) {
    window.location.href = "../login.html";
}

const params = new URLSearchParams(window.location.search);
const membroId = params.get("id");
const apiUrl = "http://localhost:3000/membros";

document.addEventListener("DOMContentLoaded", async () => {
    const cargoSelect = document.getElementById("cargo");

    // Carregar lista de cargos
    try {
        const cargosRes = await fetch(`${apiUrl}/tipos-cargo`);
        const cargos = await cargosRes.json();

        if (Array.isArray(cargos)) {
            cargos.forEach(c => {
                const option = document.createElement("option");
                option.value = c.id_cargo;
                option.textContent = c.ca_nome_cargo;
                cargoSelect.appendChild(option);
            });
        } else {
            console.warn("Nenhum cargo encontrado ou erro na resposta:", cargos);
        }
    } catch (error) {
        console.error("Erro ao carregar cargos:", error);
    }

    let membro;
    try {
        if (membroId) {
            const res = await fetch(`${apiUrl}/${membroId}`);
            if (!res.ok) {
                alert("Erro ao buscar dados do membro.");
                return;
            }
            membro = await res.json();
        } else {
            membro = userData;
            document.getElementById("administrador").style.display = "none";
            document.querySelector("label[for='administrador']").style.display = "none";
        }

        // Preencher formulário
        document.getElementById("nome").value = membro.me_nome || "";
        document.getElementById("cpf").value = membro.me_cpf || "";
        document.getElementById("email").value = membro.me_email || "";
        cargoSelect.value = membro.me_cargo || "";
        if (membro.me_administrador) {
            document.getElementById("administrador").checked = true;
        }
    } catch (error) {
        console.error("Erro ao carregar dados do membro:", error);
    }

    // Submit do formulário
    document.getElementById("editForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = membroId || membro.id_membro;
        if (!id) {
            alert("ID do membro não encontrado. Verifique se o login retorna id_membro.");
            return;
        }

        const formData = new FormData();
        formData.append("me_nome", document.getElementById("nome").value);
        formData.append("me_cpf", document.getElementById("cpf").value);
        formData.append("me_email", document.getElementById("email").value);
        formData.append("me_cargo", cargoSelect.value);
        formData.append("me_administrador", document.getElementById("administrador").checked);

        const senha = document.getElementById("senha").value;
        if (senha.trim() !== "") {
            formData.append("me_senha", senha);
        }

        
        const imagemInput = document.getElementById("imagem");
            if (imagemInput && imagemInput.files.length > 0) {
                formData.append("me_imagem", imagemInput.files[0]);
        }


        try {
            const res = await fetch(`${apiUrl}/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }, // NÃO definir Content-Type
                body: formData
            });

            if (!res.ok) {
                alert("Erro ao atualizar membro");
                return;
            }

            const updated = await res.json();
            if (!membroId) {
                localStorage.setItem("user", JSON.stringify(updated));
            }
            alert("Dados atualizados com sucesso!");
            window.location.href = membroId ? "listar-membros.html" : "dashboard.html";
        } catch (error) {
            console.error("Erro ao atualizar membro:", error);
            alert("Falha na conexão com o servidor.");
        }
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "../login.html";
    });
});