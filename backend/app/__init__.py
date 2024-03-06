from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
    CORS(app)

    
    with app.app_context():
        db.init_app(app)

        from .models import Task

        db.create_all()
        db.session.commit()

        # Import routes after creating tables to avoid circular imports
        from .routes import main
        app.register_blueprint(main)

    return app
