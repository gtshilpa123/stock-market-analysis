import fetchAndCreateChart from "./chart.js";
let st = "AAPL";
fetchAndCreateChart("5y", st);

export async function getSummary(item) {
  const url = `https://stock-market-api-k9vl.onrender.com/api/profiledata`;
  try {
    const response = await fetch(url);
    const result = await response.json();
    const summaryItem = document.getElementById("summaryItem");
    summaryItem.textContent = result.stocksProfileData[0][item].summary;
  } catch (error) {
    console.error(error);
  }
}

export async function getBookValueProfit(item) {
  const url = `https://stock-market-api-k9vl.onrender.com/api/stocksstatsdata`;
  try {
    const response = await fetch(url);
    const result = await response.json();
    const bookValue = result.stocksStatsData[0][item].bookValue;
    const profit = result.stocksStatsData[0][item].profit;
    return { bookValue, profit };
  } catch (error) {
    console.error(error);
  }
}

async function renderList() {
  const list = [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "PYPL",
    "TSLA",
    "JPM",
    "NVDA",
    "NFLX",
    "DIS",
  ];
  const stockList = document.getElementById("stock-list");

  for (const stock of list) {
    const { bookValue, profit } = await getBookValueProfit(stock);
    const list_item = document.createElement("div");
    const name = document.createElement("button");
    name.classList.add("list");
    name.textContent = stock;
    const bookV = document.createElement("span");
    bookV.textContent = `$${bookValue}`;
    const proft = document.createElement("span");
    proft.textContent = `${profit.toFixed(2)} %`;

    if (profit > 0) {
      proft.setAttribute("style", "color: #90EE90");
    } else {
      proft.setAttribute("style", "color: red");
    }

    list_item.append(name, bookV, proft);
    stockList.append(list_item);

    name.addEventListener("click", () => {
      fetchAndCreateChart("5y", stock);
    });
  }
}

renderList();
