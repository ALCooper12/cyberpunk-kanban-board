from flask import request, jsonify, Blueprint
from app import db
from app.models import Task

main = Blueprint('main', __name__)


#GET method: Retrieves all the tasks
@main.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([{'id': task.id, 'title': task.title, 'description': task.description, 'completed': task.completed, 'column': task.column} for task in tasks]), 200
    

#POST method: Creates a new task
@main.route('/tasks/create', methods=['POST'])
def create_task():
    data = request.get_json()
    new_task = Task(id=data['id'], title=data['title'], description=data['description'], completed=data['completed'], column=data['column'])
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task created successfully!'}), 201


#GET method: Retrieves a task
@main.route('/tasks/<int:task_id>', methods=['GET'])
def get_specific_task(task_id):    
    task = Task.query.get_or_404(task_id)
    return jsonify({'id': task.id, 'title': task.title, 'description': task.description, 'completed': task.completed, 'column': task.column}), 200
    

#PUT method: Updates a task's attributes when that task switches into a new column
@main.route('/tasks/<int:task_id>/update', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()
    # Update task attributes with data from the request (if provided )
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.completed = data.get('completed', task.completed)
    task.column = data.get('column', task.column) 
    db.session.commit()
    return jsonify({'message': 'Task attributes were updated successfully'}), 200


#DELETE method: Deletes a task
@main.route('/tasks/<int:task_id>/delete', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'}), 200
