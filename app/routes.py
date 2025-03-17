from flask import Blueprint, render_template, jsonify
from .models import Artwork
from sqlalchemy.sql import func
import requests
import os
import random
from . import cache

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

@cache.cached(timeout=86400, key_prefix='harvard_artworks')
def fetch_harvard_artworks():
    api_key = os.getenv('HARVARD_API_KEY')
    url = f'https://api.harvardartmuseums.org/object?apikey={api_key}&size=100'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data['records']
    else:
        return []

@main.route('/api/harvard')
def get_harvard_artwork():
    artworks = fetch_harvard_artworks()
    if artworks:
        return jsonify(artworks)
    else:
        return jsonify({'error': 'Failed to fetch data from Harvard Art Museums API'}), 500

@main.route('/harvard')
def harvard():
    artworks = fetch_harvard_artworks()
    if artworks:
        artwork = random.choice(artworks)  # Επιλογή τυχαίου έργου τέχνης
        image_url = artwork.get('primaryimageurl', '')
        if not image_url:
            image_url = 'https://via.placeholder.com/150'  # Placeholder image if no image URL is available
        return render_template('index.html', artwork={
            'title': artwork['title'],
            'image_url': image_url,
            'artist': artwork['people'][0]['name'] if 'people' in artwork and artwork['people'] else 'Unknown',
            'description': artwork.get('description', 'No description available')
        })
    else:
        return render_template('index.html', artwork={
            'title': 'Failed to fetch data from Harvard Art Museums API',
            'image_url': '',
            'artist': '',
            'description': ''
        })