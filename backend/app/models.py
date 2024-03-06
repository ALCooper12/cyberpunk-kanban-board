from . import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    completed = db.Column(db.Boolean, default=False)
    column = db.Column(db.String(50), nullable=True)

    def __init__(self, id, title, description, completed, column):
        self.id = id
        self.title = title
        self.description = description
        self.completed = completed
        self.column = column
