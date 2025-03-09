from flask import Blueprint, render_template, jsonify
from .models import Artwork
from sqlalchemy.sql import func

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/api/artwork')
def get_artwork():
    artwork = Artwork.query.order_by(func.random()).first()
    if artwork:
        return jsonify({
            'title': artwork.title,
            'artist': artwork.artist,
            'image_url': artwork.image_url,
            'description': artwork.description
        })
    else:
        return jsonify({'error': 'No artwork found'}), 404