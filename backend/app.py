from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from parsing import parse_text, generate_pairs
import os

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
CORS(app)

@app.route('/api/parse', methods=['POST'])
def api_parse():
    data = request.get_json() or {}
    text = data.get('text', '')
    default_cc = data.get('default_country_code', '55')
    result = parse_text(text, default_cc)
    return jsonify(result)

@app.route('/api/generate', methods=['POST'])
def api_generate():
    data = request.get_json() or {}
    participants = data.get('participants', [])
    result = generate_pairs(participants)
    return jsonify(result)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve frontend em produção"""
    static_path = os.path.join(app.static_folder, path)
    if path != '' and os.path.isfile(static_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
