# Codolio Question Sheet
A focused application for managing and tracking your Data Structures and Algorithms (DSA) preparation. It features a modern Master-Detail layout designed to maximize screen real estate and keep you focused.

## Features

-   **Master-Detail Layout**: A clean, split-view interface.
    -   **Sidebar**: Manage your topics (linked lists, arrays, etc.) with drag-and-drop reordering.
    -   **Workspace**: A high-density data grid for managing questions within the active topic.
-   **High Density Design**: Optimized to show maximum information without scrolling.
-   **Drag & Drop**: powered by `@dnd-kit` for intuitive reordering of both topics and questions.
-   **Progress Tracking**:
    -   Visual progress bars for each topic.
    -   Solved/Unsolved status toggles.
-   **Persisted State**: Your progress is saved automatically (using `zustand` persistence).
-   **Clean Aesthetic**: A "Linear-like" utilitarian design with subtle borders and clear typography.

## Tech Stack

-   **Frontend Framework**: React 18
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS (v4)
-   **State Management**: Zustand
-   **Drag & Drop**: @dnd-kit
-   **Icons**: Lucide React

## Getting Started

### Prerequisites

-   Node.js (v16 or higher recommended)
-   npm or yarn

### Installation

1.  Clone the repository (if applicable) or navigate to the project directory:
    ```bash
    cd codolio-asgmt
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

To create a production-ready build:

```bash
npm run build
```

The output will be in the `dist` directory.

## Usage

1.  **Create a Topic**: Click "New Topic" in the sidebar to create a category (e.g., "Dynamic Programming").
2.  **Add Questions**: Select a topic, then click "Add Question" in the main view.
3.  **Track Progress**: Click the circle icon in the "Done" column to mark a question as solved.
4.  **Reorder**: Drag topics in the sidebar or drag questions within the table to prioritize them.