const { MongoClient } = require('mongodb');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const connectionString = 'mongodb://localhost:27017';
const dbName = 'task-list';
const collectionName = 'tareas';

const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

let db;
let tasksCollection;

function connectToDatabase() {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      db = client.db(dbName);
      tasksCollection = db.collection(collectionName);
      console.log('Conexión a la base de datos establecida.');
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

async function addTask(description) {
  const task = {
    description,
    completed: false,
  };
  await tasksCollection.insertOne(task);
  console.log('Tarea agregada con éxito.');
}

async function removeTask(index) {
  const result = await tasksCollection.deleteOne({ _id: tasksCollection[index]._id });
  if (result.deletedCount === 1) {
    console.log('Tarea eliminada con éxito.');
  } else {
    console.log('Índice incorrecto o tarea no encontrada.');
  }
}

async function completeTask(index) {
  const result = await tasksCollection.updateOne(
    { _id: tasksCollection[index]._id },
    { $set: { completed: true } }
  );
  if (result.modifiedCount === 1) {
    console.log('Tarea marcada como completada.');
  } else {
    console.log('Índice incorrecto o tarea no encontrada.');
  }
}

async function showTasks() {
  const tasks = await tasksCollection.find().toArray();
  console.log('Lista de tareas:');
  tasks.forEach((task, index) => {
    console.log(`${index}. [${task.completed ? 'x' : ' '}] ${task.description}`);
  });
}

rl.setPrompt('Comando (add, remove, complete, show, exit): ');
rl.prompt();

(async () => {
  try {
    await connectToDatabase();

    rl.on('line', async (line) => {
      const command = line.trim().toLowerCase();

      switch (command) {
        case 'add':
          rl.question('Tarea: ', async (description) => {
            await addTask(description);
            rl.prompt();
          });
          break;
        case 'remove':
          rl.question('Índice de la tarea que desea eliminar: ', async (index) => {
            await removeTask(parseInt(index));
            rl.prompt();
          });
          break;
        case 'complete':
          rl.question('Índice de la tarea completada: ', async (index) => {
            await completeTask(parseInt(index));
            rl.prompt();
          });
          break;
        case 'show':
          await showTasks();
          rl.prompt();
          break;
        case 'exit':
          rl.close();
          break;
        default:
          console.log('Comando incorrecto.');
          rl.prompt();
          break;
      }
    });

    rl.on('close', () => {
      console.log('¡Hasta luego!');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
})();