const BACKEND_URL = "https://sistema-login-production.up.railway.app";

// 🔄 Carrega as ações de maior peso no índice (dados reais do backend)
function carregarAcoesReais() {
  fetch(`${BACKEND_URL}/api/market/ibov`)

  .then((res) => res.json())
    .then((data) => {
      console.log("🔍 Dados recebidos:", data);
      const stocks = data.acoes_maior_peso;

      const stocksContainer = document.getElementById("acoes-container");
      stocksContainer.innerHTML = "";

      stocks.forEach((stock) => {
        const changeClass = stock.variacao.includes("+")
          ? "text-green-400"
          : stock.variacao.includes("-")
          ? "text-red-400"
          : "text-gray-400";

        const changeIcon = stock.variacao.includes("+")
          ? "fa-arrow-up"
          : stock.variacao.includes("-")
          ? "fa-arrow-down"
          : "fa-equals";

        const card = document.createElement("div");
        card.className =
          "stock-card bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition cursor-pointer";
        card.innerHTML = `
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-bold">${stock.ticker}</h3>
              <p class="text-sm text-gray-400">${stock.nome}</p>
            </div>
            <span class="text-xs px-2 py-1 rounded ${
              stock.setor === "Financeiro"
                ? "bg-blue-900 text-blue-300"
                : stock.setor === "Energia"
                ? "bg-green-900 text-green-300"
                : "bg-yellow-900 text-yellow-300"
            }">${stock.setor}</span>
          </div>
          <div class="text-2xl font-bold my-3">${stock.preco}</div>
          <div class="flex justify-between items-center text-sm">
            <span class="${changeClass}">
              <i class="fas ${changeIcon} mr-1"></i>
              ${stock.variacao}
            </span>
            <span class="text-gray-400">${stock.volume}</span>
          </div>
        `;

        stocksContainer.appendChild(card);
      });

      // 🕓 Atualiza horário da última atualização das ações
      document.getElementById("last-update-time").textContent =
        "Última atualização: " + new Date().toLocaleTimeString("pt-BR");
    })
    .catch((error) => {
      console.error("❌ Erro ao carregar ações do microserviço:", error);
    });
}

// 📰 Notícias simuladas (mantido para preencher visualmente a seção)
const newsData = [
  {
    title: "BC decide manter taxa Selic em 13,75% ao ano",
    source: "Valor Econômico",
    time: "1h atrás",
    impact: "high",
  },
  {
    title: "Petrobras anuncia redução no preço da gasolina",
    source: "Reuters",
    time: "3h atrás",
    impact: "medium",
  },
  {
    title: "Inflação oficial fica em 0,23% em junho, abaixo do esperado",
    source: "Bloomberg",
    time: "5h atrás",
    impact: "high",
  },
];

// 🎯 Termômetro de mercado (temperatura simbólica com base na variação do IBOV)
const marketStatuses = [
  {
    temp: -20,
    message: "Mercado Frio",
    status: "Frio",
    position: "0%",
    color: "red",
  },
  {
    temp: -10,
    message: "Leve Baixa",
    status: "Frio",
    position: "25%",
    color: "red",
  },
  {
    temp: 0,
    message: "Mercado Neutro",
    status: "Neutro",
    position: "50%",
    color: "yellow",
  },
  {
    temp: 10,
    message: "Leve Alta",
    status: "Quente",
    position: "75%",
    color: "green",
  },
  {
    temp: 20,
    message: "Mercado Quente",
    status: "Quente",
    position: "100%",
    color: "green",
  },
];

// 🚀 Ao carregar a página:
document.addEventListener("DOMContentLoaded", function () {
  carregarAcoesReais();
  buscarVariaçãoIBOV();
  carregarAnaliseIA();
  updateMarketTime();
  setInterval(updateMarketTime, 1000);

  // Preenche as notícias fictícias
  const newsContainer = document.querySelector(
    ".grid.grid-cols-1.md\\:grid-cols-3.gap-4"
  );
  newsData.forEach((news) => {
    const impactColor =
      news.impact === "high"
        ? "bg-red-900"
        : news.impact === "medium"
        ? "bg-yellow-900"
        : "bg-gray-700";

    const card = document.createElement("div");
    card.className =
      "bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition cursor-pointer";
    card.innerHTML = `
        <div class="flex justify-between items-start mb-3">
          <span class="text-xs px-2 py-1 rounded ${impactColor}">
            ${
              news.impact === "high"
                ? "Alto Impacto"
                : news.impact === "medium"
                ? "Médio Impacto"
                : "Geral"
            }
          </span>
          <span class="text-xs text-gray-400">${news.time}</span>
        </div>
        <h3 class="font-bold mb-2">${news.title}</h3>
        <p class="text-sm text-gray-400">Fonte: ${news.source}</p>
      `;
    newsContainer.appendChild(card);
  });

  updateMarketTime(); // ⏱️ relógio digital
  setInterval(updateMarketTime, 1000);
});

// 🧠 Tradução da variação % do IBOV para o "grau" do termômetro
function calcularStatusPorVariação(variacaoPercentual) {
  if (variacaoPercentual <= -1) return marketStatuses[0]; // Frio
  if (variacaoPercentual <= -0.3) return marketStatuses[1]; // Leve baixa
  if (variacaoPercentual < 0.3) return marketStatuses[2]; // Neutro
  if (variacaoPercentual < 1) return marketStatuses[3]; // Leve alta
  return marketStatuses[4]; // Quente
}

function getRandomMarketPhrase(status) {
  const frases = {
    Frio: [
      "Mercado retraído.",
      "Predomínio de vendedores.",
      "Momento de cautela.",
    ],
    Neutro: [
      "Oscilação lateral.",
      "Sem força dominante.",
      "Mercado aguardando definição.",
    ],
    Quente: [
      "Alta consistência.",
      "Pressão compradora visível.",
      "Possível rompimento de alta.",
    ],
  };

  return frases[status][Math.floor(Math.random() * frases[status].length)];
}

// 🟡 Atualiza visualmente o termômetro com base no status
function updateMarketStatus(status) {
  const thermometer = document.getElementById("market-thermometer");
  const marketTemp = document.getElementById("market-temp");
  const marketMessage = document.getElementById("market-message");

  thermometer.style.backgroundPosition = `0% ${status.position}`;
  thermometer.classList.remove("market-hot", "market-cold");

  if (status.status === "Quente") thermometer.classList.add("market-hot");
  else if (status.status === "Frio") thermometer.classList.add("market-cold");

  marketTemp.textContent = `${status.temp}°`;

  marketMessage.innerHTML = `
    <h3 class="text-2xl font-bold mb-2 ${
      status.status === "Quente"
        ? "text-green-400"
        : status.status === "Frio"
        ? "text-red-400"
        : "text-yellow-400"
    }">
      ${status.message}
    </h3>
    <p class="text-gray-400">${getRandomMarketPhrase(status.status)}</p>
  `;

  // Barrinha colorida
  document.getElementById("market-bias-bar").style.width = `${
    (status.temp + 20) * 2.5
  }%`;
}

// 📈 Variação do IBOV (real, vinda do backend)
function buscarVariaçãoIBOV() {
  fetch(`${BACKEND_URL}/api/market/ibov`)

    .then((res) => res.json())
    .then((data) => {
      const variacao = parseFloat(
        data.variacao.replace("%", "").replace(",", ".")
      );
      console.log("📈 Variação real do IBOV:", variacao);

      const status = calcularStatusPorVariação(variacao);
      updateMarketStatus(status);

      const agora = new Date();
      const horas = agora.getHours().toString().padStart(2, "0");
      const minutos = agora.getMinutes().toString().padStart(2, "0");
      document.getElementById(
        "last-update-time"
      ).textContent = `Última atualização: ${horas}:${minutos}`;
    })
    .catch((error) => {
      console.error("❌ Erro ao buscar dados do IBOV:", error);
    });
}

// 🔁 Atualiza o relógio digital do topo
function updateMarketTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  document.getElementById(
    "market-time"
  ).textContent = `${hours}:${minutes}:${seconds}`;
}

// 🟦 Botão de "Atualizar" manual do termômetro
document.getElementById("update-button").addEventListener("click", () => {
  buscarVariaçãoIBOV(); // ← Agora atualizado de forma limpa
});

function mostrarTextoDigitando(texto, elementoId, delay = 20) {
  const el = document.getElementById(elementoId);
  el.textContent = "";
  let i = 0;

  function digitar() {
    if (i < texto.length) {
      el.textContent += texto.charAt(i);
      i++;
      setTimeout(digitar, delay);
    }
  }

  digitar();
}

function carregarAnaliseIA() {
  const el = document.getElementById("texto-ia");
  el.textContent = "Analisando mercado";
  el.classList.add("blinking");

  fetch(`${BACKEND_URL}/api/market/ibov`)

    .then((res) => res.json())
    .then((dados) => {
      return fetch(`${BACKEND_URL}/api/market/analise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variacao: dados.variacao,
          valor_atual: dados.valor_atual,
          volatilidade: dados.volatilidade,
          acoes_maior_peso: dados.acoes_maior_peso,
          setor_em_alta: dados.setor_em_alta,
          setor_em_baixa: dados.setor_em_baixa,
        }),
      });
    })
    .then((res) => res.json())
    .then((data) => {
      el.classList.remove("blinking");
      console.log("🧠 Análise recebida:", data);

      if (data.analise) {
        mostrarTextoDigitando(data.analise, "texto-ia");
      } else {
        el.textContent = "⚠️ Nenhuma análise recebida.";
      }
    })
    .catch(async (err) => {
      console.error("❌ Erro ao buscar análise da IA:", err);
      el.classList.remove("blinking");

      try {
        const respostaErro = await err.response.json();
        console.log("📩 Resposta da análise:", respostaErro);
        el.textContent = `Erro: ${respostaErro.erro || "Erro ao gerar análise."}`;
      } catch {
        el.textContent = "Erro ao gerar análise.";
      }
    });
}

