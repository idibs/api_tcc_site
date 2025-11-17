import express from "express";
import {
  getOutrosProdutos,
  getCategorias,
  createEndereco,
  getProdutos,
  getEndereco,
  createCliente,
  getClienteEmail,
  deleteOutrosProdutos,
  deleteProdutosEnsacados,
  getCereaisByIdNome,
  getProdutoById,
  getOutroProdutoById,
  getEnsacados,
  getEnsacadosPeso,
  getClienteByTelefone,
  getUsuarioById,
  updateUsuarioById,
  updatePessoaSetEndereco,
  updateEnderecoById,
} from "../database/functions.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.get("/ensacados", async (_, res) => {
  try {
    const data = await getEnsacados();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/cereais", async (_, res) => {
  try {
    const data = await getProdutos();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/produtos/:categoria/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const categoria = req.params.categoria;
    let response = {};

    if (categoria == "variedades" || categoria == "rações") {
      response = await getOutroProdutoById(id);
    } else if (categoria == "cereais") {
      response = await getProdutoById(id);
    } else {
      return res.status(500).send("Categoria Obrigatória");
    }

    res.status(200).send(response[0]);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /ensacados/preco?id=123
router.get("/ensacados/preco", async (req, res) => {
  try {
    const prodId = req.query.id ?? req.body?.id;
    if (!prodId) {
      return res
        .status(400)
        .send({ error: "product id required (query 'id')" });
    }
    const rows = await getEnsacadosPeso(prodId);
    return res.status(200).send(rows || []);
  } catch (error) {
    console.error("GET /ensacados/preco error:", error);
    return res.status(500).send({ error: error.message || "Erro interno" });
  }
});

router.get("/produtos", async (_, res) => {
  try {
    const data = await getOutrosProdutos();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/produtos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const nomeProduto = req.body;

    if (!id) {
      return res.status(500).send("Id necessário");
    }

    const results = await getCereaisByIdNome(id, nomeProduto.nome);

    if (!results || results.length === 0) {
      await deleteOutrosProdutos(id);
    } else {
      await deleteProdutosEnsacados(id);
    }

    res.status(200).send("deletado");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/categorias", async (_, res) => {
  try {
    const data = await getCategorias();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/cadastro", async (req, res) => {
  /* esperado (campos opcionais):
  {
    "cep": "01001000",
    "numero": "123",
    "complemento": "Apto 1",
    "nome": "Nome Cliente",
    "telefone": "5511999999999",
    "senha": "opcional",
    "email": "opcional@ex.com"
  }
  */
  try {
    const request = req.body || {};

    const nome = (request.nome || "").trim();
    const telefone = (request.telefone || "").trim();
    const cep = (request.cep || "").trim();
    const numero = (request.numero || "").trim();
    const complemento = (request.complemento || "").trim();
    const emailRaw =
      request.email && String(request.email).trim() !== ""
        ? String(request.email).trim()
        : null;
    const email = emailRaw ? emailRaw.toLowerCase() : null; // normaliza para lowercase

    if (!nome || !telefone) {
      return res
        .status(400)
        .send({ error: "nome e telefone são obrigatórios" });
    }

    // coleciona campos em conflito
    const conflicts = [];

    // Verifica se já existe cliente por telefone
    try {
      const existingByPhone = await getClienteByTelefone(telefone);
      if (existingByPhone && existingByPhone.length > 0) {
        conflicts.push("telefone");
      }
    } catch (err) {
      console.error("Erro ao checar cliente por telefone:", err);
    }

    // Se veio email, verifica se já existe cliente por email
    if (email) {
      try {
        const existingByEmail = await getClienteEmail(email);
        if (existingByEmail && existingByEmail.length > 0) {
          conflicts.push("email");
        }
      } catch (err) {
        console.error("Erro ao checar cliente por email:", err);
      }
    }

    // Se existir função getClienteByNome no escopo, usa-a para checar nome
    try {
      if (typeof getClienteByNome === "function") {
        const existingByNome = await getClienteByNome(nome);
        if (existingByNome && existingByNome.length > 0) {
          conflicts.push("nome");
        }
      }
    } catch (err) {
      console.error("Erro ao checar cliente por nome:", err);
    }

    if (conflicts.length > 0) {
      return res.status(409).send({
        error: "Conflito: já existe cliente com os seguintes campos",
        fields: conflicts,
      });
    }

    // Busca dados do CEP (se informado)
    let cepData = null;
    if (cep) {
      try {
        const responseCep = await fetch(
          `https://viacep.com.br/ws/${cep}/json/`
        );
        if (responseCep && responseCep.ok) {
          cepData = await responseCep.json();
        }
      } catch (e) {
        // não fatal — seguimos com nulls
        console.warn(
          "Falha ao consultar viacep:",
          e && e.message ? e.message : e
        );
      }
    }

    const endereco = [
      cepData ? cepData.logradouro : null,
      numero || null,
      cepData ? cepData.bairro : null,
      cep || null,
      cepData ? cepData.localidade : null,
      complemento || null,
    ];

    let Id_end = await getEndereco(cep, numero);
    if (!Id_end || Id_end.length === 0) {
      await createEndereco(endereco);
      Id_end = await getEndereco(cep, numero);
      if (!Id_end || Id_end.length === 0) {
        return res.status(500).send({ error: "Erro ao recuperar o endereço" });
      }
    }

    // SENHA: se fornecida, encripta; caso contrário, guarda NULL
    let senhaEncriptada = null;
    if (request.senha && String(request.senha).trim() !== "") {
      senhaEncriptada = await bcrypt.hash(String(request.senha), 10);
    } else {
      senhaEncriptada = null; // explicitamente NULL
    }

    const cliente = [
      nome,
      telefone,
      email, // já é null quando não enviado
      senhaEncriptada, // null se não veio
      Id_end[0].Id_end,
    ];

    try {
      await createCliente(cliente);
    } catch (dbErr) {
      console.error("Erro ao inserir cliente:", dbErr);
      if (dbErr && dbErr.code === "ER_DUP_ENTRY") {
        return res.status(409).send({
          error:
            "Já existe um usuário com algum dos campos únicos (email/telefone/etc).",
          detail: dbErr.sqlMessage,
        });
      }
      return res
        .status(500)
        .send({ error: dbErr.message || "Erro ao criar cliente" });
    }

    return res.status(201).send({ message: "Cliente criado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error.message || "Erro interno" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const request = req.body;

    if (!request.email || !request.senha) {
      return res.status(400).send("Email e senha são obrigatórios");
    }

    const cliente = await getClienteEmail(request.email);
    if (!cliente || cliente.length === 0) {
      return res.status(404).send("Cliente não encontrado");
    }

    const senhaValida = await bcrypt.compare(
      request.senha,
      cliente[0].Senha_pes
    );
    if (!senhaValida) {
      return res.status(401).send("Senha incorreta");
    }

    const token = jwt.sign(
      {
        id: cliente[0].Id_pes,
        nome: cliente[0].Nome_pes,
        tipo: cliente[0].Tipo_pes,
      },
      JWT_SECRET,
      { expiresIn: "5m" }
    );

    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).send({ error: "Token não fornecido" });
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).send({ error: "Formato do token inválido" });

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // normaliza: id ou userId
    req.userId = decoded.id ?? decoded.userId;
    next();
  } catch (err) {
    return res.status(401).send({ error: "Token inválido" });
  }
}

router.get("/usuarios/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (String(req.userId) !== String(id)) {
      return res.status(403).send({ error: "Não autorizado" });
    }

    const rows = await getUsuarioById(id);
    if (!rows || rows.length === 0) {
      return res.status(404).send({ error: "Usuário não encontrado" });
    }

    const r = rows[0];
    const payload = {
      id: r.Id_pes,
      nome: r.Nome_pes,
      telefone: r.Telefone_pes,
      email: r.Email_pes,
      tipo: r.Tipo_pes,
      endereco: r.Id_end
        ? {
            id: r.Id_end,
            cidade: r.Cidade_end,
            rua: r.Rua_end,
            numero: r.Numero_end,
            bairro: r.Bairro_end,
            cep: r.Cep_end,
            complemento: r.Complemento_end,
          }
        : null,
    };

    res.status(200).json(payload);
  } catch (error) {
    console.error("GET /usuarios/:id error:", error);
    res.status(500).send({ error: error.message || "Erro interno" });
  }
});

router.put("/usuarios/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (String(req.userId) !== String(id)) {
      return res.status(403).send({ error: "Não autorizado" });
    }

    const { nome, telefone, email, senha, endereco } = req.body || {};

    const updateObj = {
      nome: nome !== undefined ? String(nome).trim() : undefined,
      telefone: telefone !== undefined ? String(telefone).trim() : undefined,
      email:
        email !== undefined
          ? email === null
            ? null
            : String(email).trim()
          : undefined,
    };

    if (senha !== undefined && senha !== null && String(senha).trim() !== "") {
      const hash = await bcrypt.hash(String(senha), 10);
      updateObj.senha = hash;
    }

    // Atualiza usuário (campos básicos)
    await updateUsuarioById(id, updateObj);

    // === Endereco: somente com cep, numero, complemento ===
    // Esperamos endereco = { id?, cep?, numero?, complemento? }
    if (endereco && (endereco.cep || endereco.numero || endereco.complemento)) {
      const cepRaw = (endereco.cep || "").replace(/\D/g, "");
      if (!cepRaw || cepRaw.length !== 8) {
        return res
          .status(400)
          .send({ error: "CEP inválido. Envie 8 dígitos." });
      }

      // consulta ViaCEP no servidor para obter logradouro/bairro/cidade
      let cepInfo = null;
      try {
        const resp = await fetch(`https://viacep.com.br/ws/${cepRaw}/json/`);
        if (!resp.ok) throw new Error("Falha na consulta ViaCEP");
        const json = await resp.json();
        if (json.erro) {
          return res.status(400).send({ error: "CEP não encontrado" });
        }
        cepInfo = json; // tem logradouro, bairro, localidade, etc
      } catch (err) {
        console.error("Erro ao consultar viacep:", err);
        return res.status(500).send({ error: "Erro ao consultar CEP" });
      }

      // monta objeto completo para salvar no DB
      const enderecoParaSalvar = {
        rua: cepInfo.logradouro ?? null,
        bairro: cepInfo.bairro ?? null,
        cidade: cepInfo.localidade ?? null,
        cep: cepRaw,
        numero:
          endereco.numero !== undefined
            ? String(endereco.numero).trim()
            : undefined,
        complemento:
          endereco.complemento !== undefined
            ? String(endereco.complemento).trim()
            : undefined,
      };

      if (endereco.id) {
        // atualiza endereço existente
        await updateEnderecoById(endereco.id, enderecoParaSalvar);
      } else {
        // cria novo endereco e associa à pessoa
        // só cria se pelo menos cep + numero existirem (numero pode ser vazio se desejar)
        const newEndId = await createEndereco(enderecoParaSalvar);
        await updatePessoaSetEndereco(id, newEndId);
      }
    }

    return res.status(200).send({ message: "Dados atualizados com sucesso" });
  } catch (error) {
    console.error("PUT /usuarios/:id error:", error);
    res.status(500).send({ error: error.message || "Erro interno" });
  }
});

router.get("/ensacados/produto/:id", async (req, res) => {
  const prodIdRaw = req.params.id;
  if (!prodIdRaw) {
    return res.status(400).send({ error: "product id required" });
  }
  const prodId = isNaN(Number(prodIdRaw)) ? prodIdRaw : Number(prodIdRaw);

  console.info(`[ENSACADOS] request for prodId:`, prodId);

  try {
    const rows = await getEnsacadosPeso(prodId);
    const data = Array.isArray(rows) ? rows : [];
    console.info(`[ENSACADOS] prodId=${prodId} -> rows.length=${data.length}`);
    if (data.length && data.length < 20) console.debug("[ENSACADOS] rows sample:", data);
    return res.status(200).json(data);
  } catch (err) {
    console.error("ERROR GET /ensacados/produto/:id ->", err);
    return res.status(500).send({
      error: "Erro ao buscar ensacados",
      detail: err && err.message ? err.message : err,
    });
  }
});


// rota: GET /ensacados/produto/:prodId
// retorna linhas da tabela produto_ensacado onde Id_prod = prodId
router.get("/ensacados/produto/:prodId", async (req, res) => {
  const prodIdRaw = req.params.prodId;
  if (!prodIdRaw) {
    return res.status(400).send({ error: "product id required in path" });
  }

  // tenta converter para número quando aplicável, mas aceita string também
  const prodId = isNaN(Number(prodIdRaw)) ? prodIdRaw : Number(prodIdRaw);

  try {
    const rows = await getEnsacadosPeso(prodId);
    // garantir array
    const data = Array.isArray(rows) ? rows : [];
    return res.status(200).json(data);
  } catch (err) {
    console.error("GET /ensacados/produto/:prodId error:", err);
    return res.status(500).send({
      error: "Erro ao buscar ensacados por produto",
      detail: err && err.message ? err.message : err,
    });
  }
});

// rota: GET /outros_produtos  -> lista todos os outros_produtos (Nome_out, Foto_out, Descricao_out, ...)
router.get("/outros_produtos", async (_, res) => {
  try {
    const rows = await getOutrosProdutos(); // função já importada
    return res.status(200).json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error("GET /outros_produtos error:", err);
    return res.status(500).send({ error: err && err.message ? err.message : "Erro interno" });
  }
});

// rota: GET /outros_produtos/:id -> recupera um registro específico por Id_out
router.get("/outros_produtos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).send({ error: "Id obrigatório" });

    // usa sua função getOutroProdutoById (já importada no topo)
    const rows = await getOutroProdutoById(id);
    if (!rows || rows.length === 0) {
      return res.status(404).send({ error: "Outro produto não encontrado" });
    }

    // retorna o primeiro registro (padronizando como o /produtos/:categoria/:id faz)
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("GET /outros_produtos/:id error:", err);
    return res.status(500).send({ error: err && err.message ? err.message : "Erro interno" });
  }
});


export default router;
