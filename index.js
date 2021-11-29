const qtdAmonstragens = document.getElementById("amostragens");
const tamanhoVetor = document.getElementById("tamanhoVetor");

const context = document.getElementById("chart").getContext("2d");

const menorErrosDom = document.getElementById("menorErros");     
const maiorErrosDom = document.getElementById("maiorErros");

const mediaTempoDom = document.getElementById("mediaTempo");
const outputsDom = document.getElementById("outputs");

var chart = new Chart(context);


function generateRandomArray(length) {
  
  // popula array de 0 a length-1 com valores 1 ate length
  for (let i = 0; i < length; i++) {
    arrayzao[i] = i+1;
  }

  // em cada iteração, geramos um indice aleatorio de 0 a (ultimo-1)
  // e trocamos o último elemento por esse índice aleatório
  // um valor aleatoriamente será jogado pra última posição
  // após isso, decrementamos 'ultimo', e reiteramos, para que
  // um valor aleatório de índice (ultimo-2) vá para a última posição

  // ou seja, complexidade vira O(N)

  // primeira iteração: 
  // indices 0 1 2 3 4 5
  // arr     1 2 3 4 5 6
  // indice aleatorio de 0 a ultimo-1 (5) arredonda pra baixo - (por ex 4)
  // rand = arr[4] (rand recebe valor 5)
  // ult--
  // arr[randIndex] = arr[ultimo] ... ou seja arr[4] = arr[5]
  // arr agora é 1 2 3 6 5 6
  // arr[ult] = rand ... ou seja arr[5] = 4;
  // 1 2 3 6 5 4


  let ultimoIndiceUsado = length;
  for (let i = 0; i < length; i++) {
    // gera um índice aleatorio de 0 ate ultimoIndiceUsado
    const randomIndex = Math.floor(Math.random() * ultimoIndiceUsado);
    
    // pega o valor de indice aleatorio do array de cima (originalmente com valores de 1 ate length)
    const random = arrayzao[randomIndex];

    // diminui o ultimo indice usado e troca o valor de fato do array pelo ultimo valor do array
    ultimoIndiceUsado--;

    // fazendo isso, "exclui-se" o valor que já foi poppado do array, TROCANDO-O pelo do ultimoIndiceUsado
    arrayzao[randomIndex] = arrayzao[ultimoIndiceUsado];
    arrayzao[ultimoIndiceUsado] = random;
  }

  // descomenta pra logar o array
  logArr(arrayzao);
}





const arrayzao = [];


function process() {

  if (!qtdAmonstragens.value || !tamanhoVetor.value) {
    return;
  }
  
  // input
  const amostragens = parseInt(qtdAmonstragens.value);
  const length = parseInt(tamanhoVetor.value);
      
  // variaveis
  let totalDeTempo = 0;

  let minQtdErros = 10000000000000000000;
  let maxDuracao = -1;

  let duracaoPorAmost = [];



  for (let i = 0; i<amostragens; i++) {

    var tempoInit = performance.now();
    
    generateRandomArray(length);

    var tempoEnd = performance.now();
    var duracao = tempoEnd-tempoInit;
    totalDeTempo += duracao;



    if (duracao > maxDuracao) {
      maxDuracao = duracao;
    }
    
    if (duracao < minQtdErros) {
      minQtdErros = duracao;
    }

    duracaoPorAmost[i] = duracao;

    // atualiza html
    menorErrosDom.innerHTML = roundToThree(minQtdErros);
    maiorErrosDom.innerHTML = roundToThree(maxDuracao);
  }

  const mediaTempo = totalDeTempo/amostragens;
  
  // html
  mediaTempoDom.innerHTML = roundToThree(mediaTempo);
  outputsDom.classList.remove("hidden");

  // descomente para gerar o gráfico
  // generateChart(duracaoPorAmost);
}





function logArr(arr) {
  let s="[";
  arr.forEach( el => s+=` ${el}` );
  s+="]";

  console.log(s);
}



function roundToThree(num) {
  return Math.round((num + Number.EPSILON) * 1000) / 1000
}

function generateChart(errorsArray) {
chart.destroy();

let indexes = [];

//generate array with indexes to be used on chart
for(let i = 0; i< errorsArray.length; i++){
  indexes[i] = i;
}

const chartConfig = {
  type: 'line',
  data: {
    labels: indexes,
    datasets: [{
      label: 'Tempo em ms',
      data: errorsArray,
      borderColor: [
        'rgba(0, 0, 0, 1)',
      ],
      borderWidth: 1 
    }]
},
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Tempo em ms por índice da amostra',
      },
    },
    scales: {
      x: {
        title:{
          display: true,
          text: "Índice da amostra",
        }
      },
      y: {
        title: {
          display: true,
          text: "Tempo em ms",
          padding: 7
        }
      }
    }
  }
}

chart = new Chart(context, chartConfig);
}