const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/task-list';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión a MongoDB establecida.');
});

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: String,
  completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

async function addTask(description) {
    const task = new Task({
      description,
      completed: false,
    });
  
    try {
      await task.save();
      console.log('Tarea agregada con éxito.');
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    }
  }
  
  async function removeTask(index) {
    try {
      const result = await Task.deleteOne({ _id: index });
      if (result.deletedCount === 1) {
        console.log('Tarea eliminada con éxito.');
      } else {
        console.log('Índice incorrecto o tarea no encontrada.');
      }
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  }
  
  async function completeTask(index) {
    try {
      const result = await Task.updateOne(
        { _id: index },
        { $set: { completed: true } }
      );
      if (result.modifiedCount === 1) {
        console.log('Tarea marcada como completada.');
      } else {
        console.log('Índice incorrecto o tarea no encontrada.');
      }
    } catch (error) {
      console.error('Error al marcar tarea como completada:', error);
    }
  }
  
  async function showTasks() {
    try {
      const tasks = await Task.find().exec();
      console.log('Lista de tareas:');
      tasks.forEach((task, index) => {
        console.log(`${index}. [${task.completed ? 'x' : ' '}] ${task.description}`);
      });
    } catch (error) {
      console.error('Error al mostrar tareas:', error);
    }
  }
  