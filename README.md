

## ✅ Clean Architecture Todo App with Next.js 14

### ⚙️ Tech Stack

* **Next.js 14** (App Router)
* **TypeScript**
* **Tailwind CSS** + **Hero UI**
* **Redux Toolkit**
* **Firebase v9 Modular SDK** (Auth + Firestore)
* **Clean Architecture** principles

---

## 📁 Folder Structure

```
/todo-app/
├── public/                          
├── styles/
├── .env.local
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
├── middleware.ts                    
│
└── src/
    ├── app/                         # Next.js App Router entrypoints
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── (auth)/                 
    │       ├── login/page.tsx
    │       └── register/page.tsx
    │   └── (dashboard)/            
    │       ├── todos/page.tsx
    │       └── settings/page.tsx
    │
    ├── presentation/               # UI Layer (React components)
    │   ├── components/             # Pure UI (Hero UI + Custom UI)
    │   │   ├── ui/
    │   │   └── todos/
    │   └── pages/                  # Compositional screens (if needed)
    │
    ├── application/                # Application logic (Use cases / Redux)
    │   ├── use-cases/
    │   │   ├── auth/
    │   │   │   ├── loginUser.ts
    │   │   │   ├── registerUser.ts
    │   │   │   └── logoutUser.ts
    │   │   └── todos/
    │   │       ├── addTodo.ts
    │   │       ├── getTodos.ts
    │   │       ├── updateTodo.ts
    │   │       └── deleteTodo.ts
    │   └── state/                  # Redux Toolkit slices
    │       ├── authSlice.ts
    │       ├── todoSlice.ts
    │       └── store.ts
    │
    ├── domain/                     # Enterprise business logic
    │   ├── entities/               # Pure business models
    │   │   ├── Todo.ts
    │   │   └── User.ts
    │   └── repositories/           # Abstract interfaces
    │       ├── TodoRepository.ts
    │       └── AuthRepository.ts
    │
    ├── infrastructure/            # External world: Firebase, DBs, APIs
    │   ├── firebase/              
    │   │   ├── config.ts           # Firebase initialization
    │   │   ├── authService.ts      # Auth impl
    │   │   └── todoService.ts      # Firestore impl
    │   └── repositories/           # Concrete implementations of domain interfaces
    │       ├── FirebaseTodoRepo.ts
    │       └── FirebaseAuthRepo.ts
    │
    ├── types/                      # Global shared types
    │   └── index.ts
    │
    └── utils/
        └── formatDate.ts
```

---

## 🔄 Clean Architecture Flow

* **UI layer** calls a use-case (from `application/use-cases`)
* Use-case invokes a domain repository interface
* That interface is implemented in `infrastructure/repositories`
* The implementation uses Firebase SDK
* Redux is used only in `application/state` to manage UI state

---

## ✅ Sample File Responsibilities

| File                  | Role                               |
| --------------------- | ---------------------------------- |
| `authSlice.ts`        | Redux slice for auth state         |
| `addTodo.ts`          | Use-case to add a todo             |
| `FirebaseTodoRepo.ts` | Concrete Firestore implementation  |
| `TodoRepository.ts`   | Interface for todo data logic      |
| `Todo.ts`             | Domain model with type definitions |
| `todos/page.tsx`      | Authenticated dashboard page       |
| `middleware.ts`       | Route protection                   |

---

## 🧠 AI Prompt: Build This Project

> You are an AI full-stack engineer. Create a fully functional **Next.js 14 Todo App** using **clean architecture**. Use the following specifications:
>
> ### 🔧 Tech Stack
>
> * **Next.js 14 App Router**
> * **TypeScript**
> * **Tailwind CSS** + **Hero UI**
> * **Redux Toolkit** for state
> * **Firebase v9 Modular SDK** for Firestore and Auth
>
> ### 🧱 Folder Structure
>
> Follow this exact structure:
>
> ```
> /todo-app/
> ├── public/
> ├── styles/
> ├── .env.local
> ├── tailwind.config.ts
> ├── next.config.js
> ├── tsconfig.json
> ├── middleware.ts
> └── src/
>     ├── app/
>     ├── presentation/
>     ├── application/
>     ├── domain/
>     ├── infrastructure/
>     ├── types/
>     └── utils/
> ```
>
> ### 🧠 Architecture Rules
>
> * Follow **Clean Architecture** principles:
>
>   * **Domain**: business models + abstract interfaces
>   * **Application**: use-cases + redux slices
>   * **Infrastructure**: Firebase SDK implementations
>   * **Presentation**: UI logic with Hero UI
>
> ### ✅ Build Features
>
> 1. Register/Login (Firebase Auth)
> 2. Add/Edit/Delete/Toggle Todos (Firestore)
> 3. Auth-protected `/dashboard/todos`
> 4. `middleware.ts` redirects unauthenticated users to `/auth/login`
>
> ### 🔧 Implementation Requirements
>
> * Define domain models (`Todo`, `User`) in `domain/entities`
> * Define abstract interfaces for `AuthRepository` and `TodoRepository`
> * Implement `addTodo`, `getTodos`, `updateTodo`, `deleteTodo` in `application/use-cases`
> * Implement these in Firebase inside `infrastructure/repositories`
> * Wire up Redux with `authSlice` and `todoSlice`
> * Use Hero UI + Tailwind for form and todo UI
> * Store and access Firebase user via `onAuthStateChanged`
>
> 🔐 Authenticated users should only see their own todos.

---

