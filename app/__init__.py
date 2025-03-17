
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Load environment variables from .env file
    load_dotenv()

    # Configuration settings
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize SQLAlchemy
    db.init_app(app)

    # Register blueprints
    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app