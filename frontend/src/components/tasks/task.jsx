import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./task.css";

// Component for rendering a single task item
export function Item({ title, description }) {
	return (
		<div className="taskContent mt-3 py-1">
			<h5>{title}</h5>
			<hr className="boldHr" />
			<p>{description}</p>
		</div>
	);
}

// Component for rendering a draggable task
export function Task({ id, title, description }) {
	// useSortable hook from dnd kit that includes the functionalities of the useDroppable and useDraggable hooks
	// so that it can be used with a SortableContext provider to enable sorting functionalities.
	// attributes: our task's attributes
	// listeners: event listeners for our task
	// setNodeRef: attaches to the HTML element you you intend on turning into a draggable element
	// transform: transformation during dragging
	// transition: CSS transition property
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: id, data: { type: "Task" } });

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
			<Item title={title} description={description}></Item>
		</div>
	);
}
