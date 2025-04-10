# 🖼️ Image Annotation App

A full-featured image management and annotation application built with **Next.js App Router**, **Material UI**, **React Query**, and **React Konva**. Users can upload, view, and delete images, manage categories, filter images by metadata, and annotate images using drawing tools.

## 🚀 Features

- 📁 **Image Management**

  - Upload (simulated)
  - View gallery with details
  - Delete with confirmation

- 🏷️ **Category Management**

  - CRUD for image categories

- 🔍 **Filtering**

  - Filter images by name, metadata, and category

- 🖊️ **Image Annotation**

  - Draw rectangles using React Konva
  - Select annotation colors
  - Save, view, and delete annotations

- ⚙️ **Tech Stack**
  - Next.js (App Router)
  - Material UI
  - React Query
  - React Konva

## 📸 Screenshots

_(Include screenshots here if available)_

## 📦 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/image-annotation-app.git
npm install
```

### Run the App

```bash
npm run dev
```

App will be available at `http://localhost:3000`.

## 🌐 API

Using a [JSON Placeholder API](https://my-json-server.typicode.com/MostafaKMilly/demo). Data is **not persistent**, so API responses are simulated as needed.

## 🧪 Simulated API Endpoints

- `GET /categories`, `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id`
- `GET /images`, `POST /images`, `PUT /images/:id`, `DELETE /images/:id`
- `GET /annotations`, `POST /annotations`, `PUT /annotations/:id`, `DELETE /annotations/:id`
- `GET /images/:imageId/annotations`

## 📁 Project Structure

```
/
├─ app/
│  ├─ images/
│  ├─ categories/
│  ├─ annotations/
├─ components/
├─ hooks/
├─ utils/
├─ services/
├─ styles/
└─ public/
```

## 💡 Notes

- This app simulates image uploads and annotations—no actual backend file storage.
- All image metadata, categories, and annotations are mocked or persisted temporarily in local state or cache.

## 📋 Assignment Scope

This project was built as part of a frontend technical test. See [Technical Test PDF](./Technical%20Test%20Assignment%202.pdf) for full details.

## 🧠 Topics

```
nextjs
react
material-ui
react-query
react-konva
image-annotation
frontend-assignment
image-gallery
image-upload
categories
annotations
```

## 📫 Contact

Feel free to reach out for any questions or improvements!
