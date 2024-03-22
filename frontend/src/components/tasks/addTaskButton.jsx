import React, { useState } from "react";
import "./task.css";
import { baseUrl } from "../kanban/board";

// Component for rendering the Add Task button
export function AddTask({ column, handleAddTask }) {
	// State for managing the title input value from the user
	const [titleInput, setTitleInput] = useState("");
	// State for managing the description input value from the user
	const [descriptionInput, setDescriptionInput] = useState("");
	// State for managing whether the user is currently adding a new task or not
	const [adding, setAdding] = useState(false);

	// Handles adding a task via form submission. It prevents default behavior,
	// while adding a new task if the input is not empty. And the it resets
	// the input and setAdding state
	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!titleInput.trim().length || !descriptionInput.trim().length) {
			return;
		}

		const taskId = new Date().getTime();

		const newTask = {
			id: taskId,
			title: titleInput.trim(),
			description: descriptionInput.trim(),
			completed: false,
			column: column,
		};

		try {
			// Sends a POST request to the backend API to create a task
			const response = await fetch(`${baseUrl}tasks/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newTask),
			});

			if (!response.ok) {
				throw new Error("Failed to create task...");
			}

			// Call handleAddTask to update the UI with the new task
			handleAddTask({
				id: newTask.id,
				title: newTask.title,
				description: newTask.description,
				completed: newTask.completed,
				column: newTask.column,
			});

			setTitleInput("");
			setDescriptionInput("");
			setAdding(false);
		} catch (error) {
			console.error(error);
			// Handle error
		}
	};

	return (
		// Conditional rendering for displaying the type of Add task content
		// depending on if the Add Task button is clicked or not
		<>
			{adding ? (
				<form onSubmit={handleSubmit}>
					<div className="d-flex align-items-center flex-column">
						<input
							className="addTask px-1 mb-2"
							value={titleInput}
							onChange={(event) =>
								setTitleInput(event.target.value)
							}
							autoFocus
							placeholder="Add task title"
						></input>
						<textarea
							className="addTask px-1"
							value={descriptionInput}
							onChange={(event) =>
								setDescriptionInput(event.target.value)
							}
							placeholder="Add whatever you want"
						></textarea>
						<div className="container d-flex flex-row-reverse gap-2">
							<button
								className="addTask btn btn-outline-dark"
								type="button"
								onClick={() => setAdding(false)}
							>
								Close
							</button>
							<button
								className="addTask btn btn-outline-dark px-2.5 py-1"
								type="submit"
							>
								<span>Add</span>
							</button>
						</div>
					</div>
				</form>
			) : (
				<button
					className="addTask btn btn-outline-dark d-flex align-items-center px-3 py-2"
					onClick={() => setAdding(true)}
				>
					<div>
						<span className="">Add task</span>
						<span className="fs-4 bi bi-plus-lg"></span>
					</div>
				</button>
			)}
		</>
	);
}
