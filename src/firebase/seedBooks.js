import { collection, addDoc } from "firebase/firestore";
import { db } from "./config"; // Ajusta la ruta si tu config está en otro lugar

const libros = [
  { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", genero: "Ficción", disponibles: 3, portada: "📖" },
  { titulo: "1984", autor: "George Orwell", genero: "Distopía", disponibles: 5, portada: "📖" },
  { titulo: "El principito", autor: "Antoine de Saint-Exupéry", genero: "Infantil", disponibles: 8, portada: "📖" },
  { titulo: "Don Quijote", autor: "Miguel de Cervantes", genero: "Clásico", disponibles: 2, portada: "📖" },
  { titulo: "Orgullo y Prejuicio", autor: "Jane Austen", genero: "Romance", disponibles: 4, portada: "📖" },
  { titulo: "El Hobbit", autor: "J.R.R. Tolkien", genero: "Fantasía", disponibles: 6, portada: "📖" },
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
