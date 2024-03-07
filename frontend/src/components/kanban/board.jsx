import React, { useMemo, useState, useEffect } from "react";
import {
	DndContext,
	DragOverlay,
	closestCorners,
	useSensor,
	useSensors,
	KeyboardSensor,
	PointerSensor,
} from "@dnd-kit/core";
import {
	sortableKeyboardCoordinates,
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import "./board.css";
import { ColumnsContainer } from "../columns/columnsContainer";
import { Column } from "../columns/column";
import { Task } from "../tasks/task";

// BaseUrls used to make API calls to the backend server
export const baseUrl = "https://cyberpunk-kanban-board-backend.onrender.com/";
//export const baseUrl = "http://localhost:5000/";

export function KanbanBoard() {
	// State for managing the ID of the current active task during drag-and-drop operations
	const [activeId, setActiveId] = useState();
	// State to manage the columns data structure: each containing a column name, title, and tasks array
	const [columns, setColumns] = useState([
		{ column: "onHold", title: "On Hold", tasks: [] },
		{ column: "toDo", title: "To Do", tasks: [] },
		{ column: "inProgress", title: "In Progress", tasks: [] },
		{ column: "done", title: "Done", tasks: [] },
		{ column: "delete", title: "Delete", tasks: [] },
	]);

	// useEffect hook to fetch tasks when the component mounts
	// eslint-line is used since we want the useEffect hook
	// to run only once after the initial render
	useEffect(() => {
		// Fetch all tasks from the backend
		fetch(`${baseUrl}tasks`)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to fetch tasks...");
				}
				return response.json();
			})
			.then((data) => {
				// Distribute tasks to columns based on their 'column' property
				const updatedColumns = columns.map((column) => ({
					...column,
					tasks: data.filter((task) => task.column === column.column),
				}));
				setColumns(updatedColumns);
			})
			.catch((error) => {
				console.error(error);
				// Handle error
			});
	}, []); // eslint-disable-line

	// ColumnIds needed in order to use SortableContext from dnd kit for sorting functionalities
	const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

	// Initializes the sensors for detecting pointer and keyboard interactions within a sortable context
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Sets the active ID of a task when a drag operation starts
	const handleDragStart = (event) => {
		const { active } = event;
		const { id } = active;
		setActiveId(id);
	};

	/*
    Handles the drag-over event for sorting tasks within columns. 
	It receives an event object containing information about the active, over, and delta properties.
    It retrieves the IDs of the active and over elements. It also retrieves the corresponding columns for these elements.
    It then updates the state of columns by moving the active task to the new position within the over column's tasks array, based on the delta value.
	The delta represents the change in position of a dragged task relative to its initial position. 
	In our case, how much delta.y has moved vertically since the drag operation began.
	It's important for calculating the new position of a dragged task when it is dropped into a new column!
	*/
	const handleDragOver = (event) => {
		const { active, over, delta } = event;
		const activeId = active.id;
		const overId = over ? over.id : null;
		const activeColumn = findColumn(activeId);
		const overColumn = findColumn(overId);

		// Checks if an activeColumn or overColumn is missing, or if they are equal
		if (!activeColumn || !overColumn || activeColumn === overColumn) {
			return null;
		}

		// Updates the state of the columns by setting the state using the previous columns state (prevState) and a callback function
		setColumns((prevState) => {
			// Gets the tasks arrays and indices of the active and over tasks
			const activeItems = activeColumn.tasks;
			const overItems = overColumn.tasks;
			const activeIndex = activeItems.findIndex(
				(task) => task.id === activeId
			);
			const overIndex = overItems.findIndex((task) => task.id === overId);

			// Calculates the new index for an active task based on the delta value
			const newIndex = () => {
				const putOnBelowLastItem =
					overIndex === overItems.length - 1 && delta.y > 0;
				const modifier = putOnBelowLastItem ? 1 : 0;
				return overIndex >= 0
					? overIndex + modifier
					: overItems.length + 1;
			};

			// Maps through the previous state (columns) and updates the tasks array for the active and over columns
			return prevState.map((column) => {
				// Updates the tasks array for the active column
				if (column.column === activeColumn.column) {
					column.tasks = activeItems.filter(
						(task) => task.id !== activeId
					);
				}
				// Updates the tasks array for the over column
				else if (column.column === overColumn.column) {
					column.tasks = [
						...overItems.slice(0, newIndex()),
						activeItems[activeIndex],
						...overItems.slice(newIndex(), overItems.length),
					];
				}
				return column;
			});
		});
	};

	// Helper function to update a task in the backend database
	const updateTaskInBackend = (taskId, updatedTask) => {
		// Sends a PUT request to update the task with the provided taskId
		fetch(`${baseUrl}tasks/${taskId}/update`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedTask),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to update task");
				}
			})
			.catch((error) => {
				console.error(error);
				// Handle error
			});
	};

	/* 
	Handles the end of a drag operation. It receives an event object containing information about the active and over elements.
	It retrieves the IDs of the active and over elements. It also retrieves the corresponding columns for these elements.
	If the indices are different, it updates the state of columns by moving the active task into the over column's tasks array.
	*/
	const handleDragEnd = (event) => {
		const { active, over } = event;
		const activeId = active.id;
		const overId = over ? over.id : null;
		const activeColumn = findColumn(activeId);
		const overColumn = findColumn(overId);

		// Checks if an activeColumn or overColumn is missing, or if they are not the same
		if (!activeColumn || !overColumn || activeColumn !== overColumn) {
			return null;
		}

		// Checks if the task is being dropped into the delete column
		if (overColumn.column === "delete") {
			// Calls the handleDeleteTask function to remove the task
			handleDeleteTask(activeId);
		} else {
			const task = findTask(activeId);
			if (task) {
				const updatedTask = {
					...task,
					column: overColumn.column,
					completed: overColumn.column === "done",
				};
				updateTaskInBackend(activeId, updatedTask);
			}
		}

		const draggedTask = activeColumn.tasks.find(
			(task) => task.id === activeId
		);

		// If the task is being dropped into the "done" column, set completed to true; otherwise, set it to false
		const completed = overColumn.column === "done";

		// Update the completed property and column property of the dragged task
		if (draggedTask) {
			draggedTask.completed = completed;
			draggedTask.column = overColumn.column;
		}

		// Finds the indices of active and over tasks from active and over columns
		const activeIndex = activeColumn.tasks.findIndex(
			(task) => task.id === activeId
		);
		const overIndex = overColumn.tasks.findIndex(
			(task) => task.id === overId
		);

		// If the indices are different, we update the state of columns
		if (activeIndex !== overIndex) {
			setColumns((prevState) => {
				return prevState.map((column) => {
					if (column.column === activeColumn.column) {
						column.tasks = arrayMove(
							overColumn.tasks,
							activeIndex,
							overIndex
						);
						return column;
					} else {
						return column;
					}
				});
			});
		}
	};

	// Finds a column from an activeId
	const findColumn = (activeId) => {
		if (!activeId) {
			return null;
		}
		// Checks if a column's name(column.column) matches the activeId
		const columnWithId = columns.find(
			(column) => column.column === activeId
		);
		if (columnWithId) {
			return columnWithId;
		}

		// Creates an array of objects containing taskId and columnId pairs
		const taskWithColumnId = columns.flatMap((column) => {
			const columnId = column.column;
			return column.tasks.map((task) => ({ taskId: task.id, columnId }));
		});
		// Finds the columnId corresponding to the given taskId
		const columnId = taskWithColumnId.find(
			(task) => task.taskId === activeId
		)?.columnId;
		// Finds the column with the found columnId
		const columnWithTaskId = columns.find(
			(column) => column.column === columnId
		);
		return columnWithTaskId ?? null;
	};

	// Finds a task from an activeId
	const findTask = (activeId) => {
		for (const column of columns) {
			const foundTask = column.tasks.find((task) => task.id === activeId);
			if (foundTask) {
				return foundTask;
			}
		}
		return null;
	};

	// Handles adding a task to a column
	const handleAddTask = (columnId, newTask) => {
		// Check if the column is the "done" column in order to set the completed property
		if (columnId === "done") {
			newTask.completed = true;
		} else {
			newTask.completed = false;
		}

		// Updates the tasks array for the column with the matching columnId
		const updatedColumns = columns.map((column) => {
			if (column.column === columnId) {
				return { ...column, tasks: [...column.tasks, newTask] };
			}
			return column;
		});

		// Updates the Columns after adding a task
		setColumns(updatedColumns);
		return newTask;
	};

	// Handles the deletion of a task
	const handleDeleteTask = (taskId) => {
		// Make DELETE request to the backend endpoint
		fetch(`${baseUrl}tasks/${taskId}/delete`, {
			method: "DELETE",
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to delete task");
				}

				// Remove the task from the UI
				setColumns((prevState) => {
					return prevState.map((column) => {
						column.tasks = column.tasks.filter(
							(task) => task.id !== taskId
						);
						return column;
					});
				});
			})
			.catch((error) => {
				console.error(error);
				// Handle error
			});
	};

	return (
		<div className="board d-flex flex-column justify-content-evenly -gap-1">
			<div>
				<h1 className="display-5">
					Your very own <span className="unique-font">Cyberpunk</span>{" "}
					themed: "Task Manager"
				</h1>
			</div>

			{/* Renders the droppable and draggable Column and Task components by using DndContext from dnd kit
			 	to share data between draggable and droppable components (tasks and columns) and hooks.
			*/}
			<div className="mb-5">
				<DndContext
					sensors={sensors}
					collisionDetection={closestCorners}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
				>
					<div>
						<ColumnsContainer>
							<SortableContext
								items={columnIds}
								strategy={verticalListSortingStrategy}
							>
								{columns.map((column) => (
									<Column
										key={column.column}
										column={column.column}
										title={column.title}
										tasks={column.tasks}
										handleAddTask={(newTask) =>
											handleAddTask(
												column.column,
												newTask
											)
										}
										handleDeleteTask={handleDeleteTask}
										alterDeleteColumn={
											column.column === "delete"
										}
										showAddButton={
											column.column !== "delete"
										}
									/>
								))}
								{/* Using the DragOverlay component from dnd kit, it renders the overlay for the active dragging task */}
								<DragOverlay>
									{activeId ? (
										<div>
											<Task
												id={activeId}
												title={
													findTask(activeId)?.title
												}
												description={
													findTask(activeId)
														?.description
												}
											/>
										</div>
									) : null}
								</DragOverlay>
							</SortableContext>
						</ColumnsContainer>
					</div>
				</DndContext>
			</div>
		</div>
	);
}
