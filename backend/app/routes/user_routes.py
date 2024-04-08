from flask import Blueprint, jsonify, request, current_app
from email_validator import validate_email, EmailNotValidError
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/')
def index():
    users = list(current_app.db.users.find({}, {'_id': 0}))
    return jsonify(users)

@user_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body must be JSON'}), 400

    email = data.get('email')
    password = data.get('password')

    if email is None or password is None:
        return jsonify({'error': 'Email or password is missing'}), 400

    try:
        valid = validate_email(email)
        email = valid.email  
    except EmailNotValidError as e:
        return jsonify({'error': str(e)}), 400

    exists = current_app.db.users.find_one({"email": email})
    if exists:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = generate_password_hash(password)
    user = {"email": email, "password": hashed_password}
    inserted_user = current_app.db.users.insert_one(user)

    access_token = create_access_token(identity=str(inserted_user.inserted_id))
    return jsonify({"email": email, "token": access_token}), 200