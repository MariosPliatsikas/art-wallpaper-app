
from flask import Blueprint, render_template, jsonify
from .models import Artwork
from sqlalchemy.sql import func
import requests
import os

main = Blueprint('main', __name__)

@main.route('/')
def index():
    artwork = {
        'title': 'Starry Night',
        'artist': 'Vincent van Gogh',
        'year': 1889
    }
    return render_template('index.html', artwork=artwork)

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

@main.route('/api/harvard')
def get_harvard_artwork():
    api_key = os.getenv('HARVARD_API_KEY')
    url = f'https://api.harvardartmuseums.org/object?apikey={api_key}&size=10'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return jsonify(data)
    else:
        return jsonify({'error': 'Failed to fetch data from Harvard Art Museums API'}), response.status_code