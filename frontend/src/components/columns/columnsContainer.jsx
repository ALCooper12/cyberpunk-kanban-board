import React from "react";

// Component that houses all the columns
export function ColumnsContainer({ children }) {
	return (
		<div className="container mt-3 d-flex justify-content-center gap-3">
			{children}
		</div>
	);
}
