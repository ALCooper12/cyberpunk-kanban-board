import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

// Component for editing a task.
export function EditTask({
	title: initialTitle,
	description: initialDescription,
	showModal, // Boolean indicating whether the modal is visible or not
	setShowModal, // Controls the visibility of the modal
	onUpdate, // Handles updating a task's title and description
}) {
	// State to manage the title of a task being edited
	const [title, setTitle] = useState(initialTitle);
	// State to manage the description of a task being edited
	const [description, setDescription] = useState(initialDescription);

	// Handles saving changes to a task
	const handleSave = () => {
		onUpdate(title, description);
		setShowModal(false);
	};

	return (
		<>
			<Modal
				dialogClassName="custom-modal"
				show={showModal}
				onHide={() => setShowModal(false)}
				backdrop="static"
				keyboard={false}
				centered
			>
				<div
					style={{
						border: "4px solid #ea00d9",
						borderRadius: "9px",
						fontFamily: "Kdam Thmor Pro",
					}}
				>
					<Form.Label
						className="fs-3"
						style={{
							marginLeft: "15px",
							marginTop: "18px",
							marginBottom: "-5px",
						}}
					>
						Title
					</Form.Label>
					<Modal.Header>
						<Modal.Title>
							<input
								className="editTask fs-5 mb-2"
								style={{ marginLeft: "-18px" }}
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</Modal.Title>
					</Modal.Header>
					<Form.Label
						className="fs-3 "
						style={{
							marginLeft: "15px",
							marginTop: "18px",
							marginBottom: "-5px",
						}}
					>
						Description
					</Form.Label>
					<Modal.Body>
						<textarea
							className="editTask fs-6 mb-2"
							style={{
								width: "458px",
							}}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</Modal.Body>
					<Modal.Footer>
						<Button
							className="editTask btn btn-outline-dark"
							variant="light"
							onMouseUp={handleSave}
						>
							Save
						</Button>

						<Button
							className="editTask btn btn-outline-dark"
							variant="light"
							onMouseUp={() => setShowModal(false)}
						>
							Close
						</Button>
					</Modal.Footer>
				</div>
			</Modal>
		</>
	);
}
