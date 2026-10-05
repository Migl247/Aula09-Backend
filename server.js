const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');
const app = express();
const PORT = process.env.PORT || 3000;

//Middleware essenciais
app.use(cors());
app.use(express.json());

let produtosEmMemoria = [
  { id: 1, nome: 'Teclado Mecânico RGB', preco: 150.0 },
  { id: 2, nome: 'Mouse Gamer 3200', preco: 85.50 }
];

// Rota GET
app.get('/produtos', async (req, res) => {
    console.log('[GET / produtos] Enviando produtos em memória...');
    // 
    const {data, error} = await supabase
    .from('produtos')
    .select('*')
    .order('id', { ascending: true });
    if (error) {
        return res.status(500).json({ erro: error.message});
    }
    res.json(data);
});

//Rota POST
app.post('/produtos', async (req, res) => {
    const {nome, preco} = req.body;

    if (!nome || !preco) {
        return res.status(400).json({ erro: 'Nome e preço são obrigatórios!' });
    }

    const novoProduto = {
        id: Date.now(),// Gera um id temporário baseado no timestamp
        nome,
        preco: parseFloat(preco)
    };

    produtosEmMemoria.push(novoProduto);
    console.log(`[POST / produtos] Produto adicionado na RAM: ${novoProduto.nome}`);

    res.status(201).json(novoProduto);
});

//Rota PUT
app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco } = req.body;

    const produtoIndex = produtosEmMemoria.findIndex(p => p.id === parseInt(id));

    if (produtoIndex === -1) {
        return res.status(404).json({ erro: 'Produto não encontrado!' });
    }

    produtosEmMemoria[produtoIndex] = { ...produtosEmMemoria[produtoIndex], nome, preco: parseFloat(preco) };
    console.log(`[PUT / produtos] Produto atualizado na RAM: ${produtosEmMemoria[produtoIndex].nome}`);

    res.json(produtosEmMemoria[produtoIndex]);
});

//Rota DELETE
app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;

    const produtoIndex = produtosEmMemoria.findIndex(p => p.id === parseInt(id));

    if (produtoIndex === -1) {
        return res.status(404).json({ erro: 'Produto não encontrado!' });
    }

    const produtoRemovido = produtosEmMemoria.splice(produtoIndex, 1)[0];
    console.log(`[DELETE / produtos] Produto removido da RAM: ${produtoRemovido.nome}`);

    res.json({ mensagem: 'Produto removido com sucesso!' });
});

//listen Iniciar o servidor
app.listen(PORT, () => {
  console.log('=========================================================')
  console.log(`Servidor Back-End rodando na nuvem`);
  console.log('Rota de produtos ativa na nuvem');
  console.log('Status: MODO MEMÓRIA RAM ATIVO')
  console.log('==========================================================')
});