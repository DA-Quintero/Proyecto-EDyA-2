# Sistema web de librería 

## Descripción

Es una aplicación web diseñada para facilitar la gestión de préstamos de libros en bibliotecas municipales. La plataforma permite a los usuarios explorar un catálogo completo de libros, realizar préstamos, gestionar favoritos y administrar su perfil personal. El sistema cuenta con autenticación mediante Firebase, gestión de fila de espera cuando los libros no están disponibles, cálculo automático de multas por retraso, y una interfaz intuitiva y responsive.

## Integrantes del Proyecto

- **Juan Andrés Montealegre Calambas** - 2230021
- **Diego Alejandro Quintero Miranda** - 2235621
- **Santiago Torralba Alape** - 2230608

## Enlaces Importantes

- **Propuesta Gráfica (Figma):** https://www.figma.com/design/AhhK6kvrbKe92L3XVfSwOG/Library-Website?node-id=0-1&t=Wmfu71jWuTXHuF7R-1
- **Despliegue en Netlify:** https://estructuras2-proyecto.netlify.app/

## Características Principales

- **Autenticación segura** con Firebase (Email/Password y Google)
- **Catálogo completo** con búsqueda y filtros por categoría y disponibilidad
- **Sistema de favoritos** para guardar libros preferidos
- **Gestión de préstamos** con fechas de devolución
- **Sistema de fila de espera** FIFO cuando los libros están prestados
- **Cálculo automático de multas** por retrasos en devoluciones
- **Perfil de usuario** con historial de préstamos
- **Diseño responsive** adaptado a la mayoría de los dispositivos

## Tecnologías Utilizadas

- **Frontend:** React + Vite
- **BD:** Firebase (Authentication, Firestore)
- **Estilos:** SCSS (SASS)
- **Enrutamiento:** React Router
- **Estado Global:** Redux Toolkit
- **Despliegue:** Netlify

## Instalación y Uso

1. Instala las dependencias:
```bash
npm install
```

2. Ejecuta el proyecto en modo desarrollo:
```bash
npm run dev
```

## Finalidad

Este proyecto fue desarrollado como parte del curso de Estructuras de Datos y Algoritmos 2.