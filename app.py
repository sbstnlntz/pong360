from flask import Flask, render_template, request, jsonify
import mysql.connector
import os
from dotenv import load_dotenv

# ============================
# Environment & Flask Config
# ============================
load_dotenv()  # Load environment variables from .env
app = Flask(__name__)

# Database connection settings from environment
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME")
}

# ============================
# Route: Home Page
# ============================
@app.route('/')
def index():
    """
    Loads dynamic text content from the `texts` table and renders the homepage.
    """
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT key_name, content FROM texts")
    text_rows = cursor.fetchall()

    cursor.close()
    conn.close()

    texts = {row['key_name']: row['content'] for row in text_rows}
    return render_template('index.html', texts=texts)

# ============================
# Route: Submit Score (POST)
# ============================
@app.route('/submit-score', methods=['POST'])
def submit_score():
    """
    Accepts a JSON POST request containing the player's score.
    Saves it to the `highscores` table if valid.
    """
    try:
        data = request.json
        print("Received:", data)  # Debug output

        score = int(data.get("score", 0))
        print("Parsed score:", score)

        if score <= 0:
            print("Score too low")
            return jsonify(success=False, error="Invalid score"), 400

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO highscores (score, created_at) VALUES (%s, NOW())",
            (score,)
        )
        conn.commit()
        print("Saved to DB.")

        cursor.close()
        conn.close()
        return jsonify(success=True)

    except Exception as e:
        print("Error saving score:", e)
        return jsonify(success=False, error=str(e)), 500

# ============================
# Route: Get Highest Score
# ============================
@app.route('/highscores')
def get_highscores():
    """
    Returns the highest score from the database, along with its timestamp.
    """
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT score, created_at
        FROM highscores
        ORDER BY score DESC, created_at ASC
        LIMIT 1
    """)
    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if row:
        return jsonify([{
            "score": row[0],
            "date": row[1].strftime('%Y-%m-%d %H:%M:%S')
        }])
    else:
        return jsonify([])

# ============================
# Run Flask App
# ============================
# if __name__ == '__main__':
#     app.run(debug=True)
