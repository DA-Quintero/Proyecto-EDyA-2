import { collection, addDoc } from "firebase/firestore";
import { db } from "./config"; // Ajusta la ruta si tu config está en otro lugar

const libros = [
  { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", genero: "Ficción", disponibles: 3, portada: "📖" },
  { titulo: "1984", autor: "George Orwell", genero: "Distopía", disponibles: 5, portada: "📖" },
  { titulo: "El principito", autor: "Antoine de Saint-Exupéry", genero: "Infantil", disponibles: 8, portada: "📖" },
  { titulo: "Don Quijote", autor: "Miguel de Cervantes", genero: "Clásico", disponibles: 2, portada: "📖" },
  { titulo: "Orgullo y Prejuicio", autor: "Jane Austen", genero: "Romance", disponibles: 4, portada: "📖" },
  { titulo: "El Hobbit", autor: "J.R.R. Tolkien", genero: "Fantasía", disponibles: 6, portada: "📖" },
  { titulo: "La sombra del viento", autor: "Carlos Ruiz Zafón", genero: "Ficción", disponibles: 5, portada: "📚" },
  { titulo: "Ficciones", autor: "Jorge Luis Borges", genero: "Cuentos", disponibles: 4, portada: "📚" },
  { titulo: "Rayuela", autor: "Julio Cortázar", genero: "Ficción", disponibles: 3, portada: "📘" },
  { titulo: "Los detectives salvajes", autor: "Roberto Bolaño", genero: "Ficción", disponibles: 2, portada: "📗" },
  { titulo: "La casa de los espíritus", autor: "Isabel Allende", genero: "Realismo mágico", disponibles: 4, portada: "📙" },
  { titulo: "Matar a un ruiseñor", autor: "Harper Lee", genero: "Ficción", disponibles: 6, portada: "📖" },
  { titulo: "El nombre del viento", autor: "Patrick Rothfuss", genero: "Fantasía", disponibles: 5, portada: "📕" },
  { titulo: "Sapiens", autor: "Yuval Noah Harari", genero: "No ficción", disponibles: 7, portada: "📗" },
  { titulo: "Breves respuestas a las grandes preguntas", autor: "Stephen Hawking", genero: "Ciencia", disponibles: 3, portada: "📘" },
  { titulo: "El alquimista", autor: "Paulo Coelho", genero: "Ficción", disponibles: 6, portada: "📖" },
  { titulo: "Crimen y castigo", autor: "Fiódor Dostoyevski", genero: "Clásico", disponibles: 2, portada: "📕" },
  { titulo: "La tregua", autor: "Mario Benedetti", genero: "Ficción", disponibles: 4, portada: "📚" },
  { titulo: "Meditaciones", autor: "Marco Aurelio", genero: "Filosofía", disponibles: 5, portada: "📘" },
  { titulo: "La ciudad y los perros", autor: "Mario Vargas Llosa", genero: "Ficción", disponibles: 3, portada: "📗" },
  { titulo: "Neuromante", autor: "William Gibson", genero: "Ciencia ficción", disponibles: 4, portada: "🤖" },
  { titulo: "Fundación", autor: "Isaac Asimov", genero: "Ciencia ficción", disponibles: 5, portada: "🚀" },
  { titulo: "El cuento de la criada", autor: "Margaret Atwood", genero: "Distopía", disponibles: 4, portada: "📕" },
  { titulo: "Drácula", autor: "Bram Stoker", genero: "Terror", disponibles: 3, portada: "🦇" },
  { titulo: "Frankenstein", autor: "Mary Shelley", genero: "Terror", disponibles: 3, portada: "⚗️" },
];

const seedBooks = async () => {
  try {
    for (const libro of libros) {
      await addDoc(collection(db, "books"), libro);
      console.log(`Libro agregado: ${libro.titulo}`);
    }
    console.log("Todos los libros se han agregado correctamente.");
  } catch (error) {
    console.error("Error agregando libros:", error);
  }
};

seedBooks();
