import React, { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./column.css";
import { Task } from "../tasks/task";
import { AddTask } from "../tasks/addTaskButton";

// Component for rendering a column
export function Column({
	column,
	title,
	tasks,
	handleAddTask, // Function that handles adding a new task
	alterDeleteColumn, // Flag indicating whether it's the delete column or not
	showAddButton, // Flag indicating whether to show the Add Task button
}) {
	// Memoized value to compute and store the IDs of tasks in the tasks array.
	// This ensures that the taskIds array is only recomputed when the tasks array changes
	const taskIds = useMemo(() => {
		return tasks.map((task) => task.id);
	}, [tasks]);

	// useDroppable hook from dnd kit for setting up the droppable area of a column.
	// setNodeRef: attaches to the HTML element you intend on turning into a droppable area
	const { setNodeRef } = useDroppable({
		id: column,
		data: { type: "Column" },
	});

	// Renders the column component
	return (
		<section>
			<div className="column" ref={setNodeRef}>
				{/* Renders the title and task count (excluding the delete column) */}
				{!alterDeleteColumn && (
					<div className="d-flex justify-content-center gap-5">
						<h2>{title}</h2>
						<span className="fs-4 text-muted">{tasks.length}</span>
					</div>
				)}
				{/* Renders a list of tasks using the SortableContext from dnd kit that creates a context for managing sortable lists*/}
				<div className="scrollableTaskList">
					<SortableContext
						id={column}
						items={taskIds}
						strategy={verticalListSortingStrategy}
					>
						<div className="taskList">
							{tasks.map((task) => (
								<Task
									key={task.id}
									id={task.id}
									title={task.title}
									description={task.description}
								/>
							))}
						</div>
					</SortableContext>
				</div>
				{/* Conditional rendering for having the trash icon ONLY inside the delete column */}
				{alterDeleteColumn && (
					<div className="trashIcon">
						<i className="bi bi-trash"></i>
					</div>
				)}
				{/* Conditional rendering for having the "Add Task" button only for NON-delete columns */}
				{!alterDeleteColumn && column !== "delete" && showAddButton && (
					<div className="addTaskContainer">
						<AddTask
							column={column}
							handleAddTask={handleAddTask}
						/>
					</div>
				)}
			</div>
		</section>
	);
}
