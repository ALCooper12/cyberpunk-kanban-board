import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./task.css";
import { EditTask } from "./editTask";
import { baseUrl } from "../kanban/board";

// Component for rendering the a task's information
export function Item({
	title,
	description,
	showModal,
	setShowModal,
	onUpdate,
}) {
	// Tracks the timestamp of the last click
	const [lastClickTime, setLastClickTime] = useState(0);

	// Handle the mouse down event
	const handleMouseDown = () => {
		const currentTime = Date.now();

		// Checks if the time between the last click and current click is less than or equal to 300 milliseconds
		if (currentTime - lastClickTime <= 300) {
			// If it's a double click, call the handleDoubleClick function
			handleDoubleClick();
		}
		// Updates the last click time with the current timestamp
		setLastClickTime(currentTime);
	};

	// Handles the double click event for showing a modal when the user
	// double clicks a task
	const handleDoubleClick = () => {
		setShowModal(true);
	};

	return (
		<div className="taskContent mt-3 py-1" onMouseDown={handleMouseDown}>
			<h5>{title}</h5>
			<hr className="boldHr" />
			<p>{description}</p>
			<EditTask
				title={title}
				description={description}
				showModal={showModal}
				setShowModal={setShowModal}
				onUpdate={(newTitle, newDescription) => {
					onUpdate(newTitle, newDescription);
				}}
			/>
		</div>
	);
}

// Component for rendering a draggable task
export function Task({ id, title, description, updateTask, columnId }) {
	// State that controls the visibility of the modal
	const [showModal, setShowModal] = useState(false);

	// useSortable hook from dnd kit that includes the functionalities of the useDroppable and useDraggable hooks
	// so that it can be used with a SortableContext provider to enable sorting functionalities.
	// attributes: our task's attributes
	// listeners: event listeners for our task
	// setNodeRef: attaches to the HTML element you you intend on turning into a draggable element
	// transform: transformation during dragging
	// transition: CSS transition property
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: id, data: { type: "Task" }, disabled: showModal });

	// Handles updating the edit of a task in the backend
	const handleUpdateTask = async (newTitle, newDescription) => {
		// Creates the updated task object with the provided new title and description
		const updatedTask = {
			id: id,
			title: newTitle,
			description: newDescription,
		};

		try {
			// Sends a PUT request to the backend API to update the task with the provided ID
			const response = await fetch(`${baseUrl}tasks/${id}/update`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedTask),
			});

			if (!response.ok) {
				throw new Error("Failed to update task");
			}

			// Calls the updateTask function to update the task in the frontend
			updateTask(columnId, id, updatedTask);

			// Optionally, handle success response here
		} catch (error) {
			console.error(error);
			// Handle error
		}
	};

	// Renders a div element representing the task
	return (
		<div
			className="task btn btn-outline-dark"
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			style={{
				transition,
				transform: CSS.Transform.toString(transform),
			}}
		>
			<Item
				title={title}
				description={description}
				showModal={showModal}
				setShowModal={setShowModal}
				onUpdate={handleUpdateTask}
			/>
		</div>
	);
}
