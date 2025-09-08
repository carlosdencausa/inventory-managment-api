import axios from 'axios';

// Funciones de utilidad
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomLot() {
  return {
    product_id: randomInt(1, 100),
    warehouse_id: randomInt(1, 100),
    stock: randomInt(0, 1000),
  };
}

function generateRandomBody() {
  const size = randomInt(200, 400);
  return Array.from({ length: size }, generateRandomLot);
}

// Headers comunes para todas las solicitudes
const headers = {
  'Content-Type': 'application/json',
  Authorization: 'eb8a94c4-8b91-4124-8dbc-bd29f0c46335',
};

// Función para enviar una solicitud de actualización
async function sendRequest(body, i) {
  try {
    const res = await axios.post(
      'http://localhost:3000/lots/bulk-update-stock',
      body,
      {
        headers,
        timeout: 60000,
      },
    );
    console.log(
      `Request #${i} status:`,
      res.status,
      '| updated:',
      res.data.total_stocks_updated,
    );
  } catch (err) {
    console.error(
      `Request #${i} failed:`,
      err.response ? err.response.status : err.message,
    );
  }
}

// Función para consultar el estado de la cola
async function checkQueueStatus() {
  try {
    const res = await axios.get('http://localhost:3000/lots/queue-status', {
      headers,
    });
    return res.data;
  } catch (err) {
    console.error(
      'Error getting queue status:',
      err.response ? err.response.status : err.message,
    );
    return null;
  }
}

// Función para mostrar el estado de la cola
async function monitorQueue(intervalMs = 2000, maxChecks = 20) {
  let checks = 0;
  const interval = setInterval(async () => {
    const status = await checkQueueStatus();
    if (status) {
      console.log(
        `[${status.timestamp}] Cola: ${status.queue_size} elementos, Procesando: ${
          status.is_processing ? 'Sí' : 'No'
        }, Activa: ${status.is_active ? 'Sí' : 'No'}`,
      );
      console.log('Métricas:', status.metrics);
    }

    checks++;
    if (checks >= maxChecks) {
      clearInterval(interval);
    }
  }, intervalMs);

  return interval;
}

async function main() {
  // Configuración de la prueba
  const totalRequests = 800;
  const batchSize = 100;
  const batches = Math.ceil(totalRequests / batchSize);

  console.log(
    `Ejecutando ${totalRequests} solicitudes en ${batches} lotes de ${batchSize}`,
  );

  // Iniciar monitorización de la cola
  const queueMonitor = monitorQueue();

  // Enviar las solicitudes en lotes
  for (let batchNum = 0; batchNum < batches; batchNum++) {
    const batchRequests = [];
    const startIdx = batchNum * batchSize + 1;
    const endIdx = Math.min(startIdx + batchSize - 1, totalRequests);

    console.log(
      `Lote ${batchNum + 1}/${batches}: solicitudes ${startIdx}-${endIdx}`,
    );

    for (let i = startIdx; i <= endIdx; i++) {
      const body = generateRandomBody();
      batchRequests.push(sendRequest(body, i));
    }

    // Enviar todas las solicitudes del lote en paralelo
    await Promise.all(batchRequests);

    // Pequeña pausa entre lotes
    if (batchNum < batches - 1) {
      const pauseMs = 500;
      console.log(`Pausa de ${pauseMs}ms antes del siguiente lote`);
      await new Promise((resolve) => setTimeout(resolve, pauseMs));
    }
  }

  console.log('Todas las solicitudes enviadas, monitoreando la cola...');

  // Esperar a que se procesen todas las solicitudes
  let queueEmpty = false;
  while (!queueEmpty) {
    const status = await checkQueueStatus();
    if (
      status &&
      status.queue_size === 0 &&
      !status.is_processing &&
      status.is_active
    ) {
      queueEmpty = true;
      console.log('Cola vacía, todas las solicitudes procesadas');
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Detener el monitor de la cola
  clearInterval(queueMonitor);
  console.log('Prueba completada con éxito');
}

main().catch(console.error);
