# Northspyre Take-Home Project for React & Flask Web Application

I decided to build a Kanban Board since that is the first thing I think of when I imagine a Task Manager. It features a sleek, Cyberpunk-themed design in order to visualize the uniqueness and creativity in the process of managing tasks from other similarly built applications. The functionality is a simple, but fun-to-use drag and drop mechanism of moving tasks into the current provided columns: On Hold, To Do, In Progress, Done, and Delete. Overall, I had a lot of fun making this and I hope you enjoy it!

## Live Demo 👀
Click this link if you just can't wait to check it out, or you just don't feel like setting it up yourself

[cyberpunk-kanban-board-frontend.onrender.com/](https://cyberpunk-kanban-board-frontend.onrender.com/)

## Architecture Overview 🏗️

This Task Manager Application was built using React for the frontend and Flask in the backend. The frontend is responsible for providing the user interface and the drag and drop functionality, while the backend handles data storage and management.

## Features 🚀

The Task Manager provides the following features:

-   Displays a list of tasks in any column (except the delete column)
-   Adds a new task in whatever column you choose (except the delete column)
-   Drag and Drop functionality of tasks into columns
-   Ability to mark a task as completed
-   Deletes a task

### Frontend

-   Framework: React
-   Languages: JavaScript
-   Styling: CSS and Bootstrap
-   Dependencies: [dnd kit](https://dndkit.com/) and React Router

### Backend

-   Framework: Flask
-   Languages: Python
-   Database: SQLite

## Decisions and Considerations 🤔

As I was developing this Task manager, my decision of making a Cyberpunk-themed Kanban Board and the fact that my favorite thing about using one (at least in my experience) is dragging and dropping stuff, was the reason I wanted to include a drag and drop functionality using dnd kit. I choose that specific tool kit since it had the best documentation. I kept in mind that I wanted something simple and easy to use, and so my database has only 1 table and 5 API endpoints in the backend. Each endpoint was created with a specific purpose of its use in the UI. The frontend (also backend) includes comments explaining what's happening in my code so that you aren't kept in the dark. 
And I made sure to keep organization of files and folder structure so that again, things are simple and easy to follow for the user or reviewer.

## Getting Started 🛠️

### Backend Setup

1. **Activate Python Virtual Environment (Optional):** Now before you spin up your backend server, I recommend activating a Python virtual environment (I used Python 3.12.2) first! If you don't have one, you can create one by running the following command in the root directory of your project:

    ```bash
    python3 -m venv venv
    ```

    then activate it by running:

    ```bash
    source venv/bin/activate  # For Unix/Linux
    venv\Scripts\activate     # For Windows
    ```
    If everything works out, you should see something like this in your terminal:
    ```bash
    (.venv) arianna@Ariannas-MBP 
    ```

2. **Install Dependencies:** Then you should navigate to the backend directory and install the required Python dependencies:

    ```bash
    cd backend
    python3 -m pip install -r requirements.txt
    ```

3. **Run Flask Server:** And finally start the Flask server by running the following command:

    ```bash
    python3 run.py
    ```

    If everything works out, you should see something like this in your terminal:

    ```bash
    * Serving Flask app 'app'
    * Debug mode: on
    WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
    * Running on http://127.0.0.1:5000
    Press CTRL+C to quit
    * Restarting with stat
    * Debugger is active!
    ```

### Frontend Setup

1. **Install Node.js:** If you haven't already, install Node.js from [nodejs.org](https://nodejs.org/).

2. **Install Dependencies:** Navigate to the frontend directory and install the required Node.js dependencies:

    ```bash
    cd frontend
    npm install
    ```

3. **Make a tiny change to 2 files:** Since this Task Manager is being deployed on Render, the `package.json` and `board.jsx` files need to be changed so that the Task Manager can be ran on your localhost ports 3000 and 5000 on your computer. 
    
    First go to line 47 within `package.json` and change the proxy value:
   
    ```bash
    "proxy": "http://localhost:5000/"
    ```
    
    Next, uncomment out the code on line 24, and then comment out line 23 within the `board.jsx` file:
   
    ```bash
    //export const baseUrl = "https://cyberpunk-kanban-board-backend.onrender.com/";
    export const baseUrl = "http://localhost:5000/";
    ```
    
    Now you should be able to render the frontend on your localhost:3000 and the backend on your localhost:5000

4. **Run React Server:** Start the React server by running the following command:

    ```bash
    npm start
    ```

    Again, if everything goes well, you should see something like this in your terminal:

    ```bash
    Compiled successfully!

    You can now view frontend in the browser.

        Local:            http://localhost:3000
        On Your Network:  http://123.456.78.910:3000

    Note that the development build is not optimized.
    To create a production build, use npm run build.

    webpack compiled successfully
    ```

## Usage 🖥️

Once both the backend and frontend servers are running, you can access the Task Manager UI by visiting [http://localhost:3000/](http://localhost:3000/) in your web browser.

Awesome! You're all set up now 🥳 Have fun!! 🎉
