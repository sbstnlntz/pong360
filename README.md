# Pong 360°

A full-circle arcade-style Pong game built with **Flask**, **HTML5 Canvas**, and **MySQL**. The player controls a paddle rotating around a circular arena to keep the ball in play. Scores are tracked, saved in a database, and displayed dynamically. The game supports light, dark, and colorful themes and is fully responsive across devices.

---

## Features

- 360-degree circular Pong gameplay using HTML5 Canvas
- Paddle control via keyboard (arrow keys) and touch (mobile/tablet)
- Fully responsive design for desktop and mobile
- Theme switcher: Light, Dark, and Colorful
- Highscore tracking and persistence in a MySQL database
- Dynamic frontend text loaded from the database
- Transparent modal windows for game and legal content (impressum)

---

## Technologies Used

### Frontend
- HTML5 & CSS3 (flex layout, custom properties, animations)
- JavaScript (Canvas API for rendering and game logic)
- Responsive design with mobile optimizations

### Backend
- Python 3.x
- Flask 3.x
- MySQL (for highscores and text content)
- `python-dotenv` for configuration

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sbstnlntz/pong360.git
cd pong360
```

### 2. Set up a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create a `.env` file

Create a `.env` file in the project root:

```env
DB_HOST=127.0.0.1
DB_USER=pong_user
DB_PASSWORD=your_password
DB_NAME=pong
```

### 5. Set up the MySQL database

```sql
CREATE DATABASE pong CHARACTER SET utf8mb4;

CREATE TABLE texts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name VARCHAR(100) UNIQUE,
  content TEXT
);

CREATE TABLE highscores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  score INT NOT NULL,
  created_at DATETIME NOT NULL
);
```

Insert sample data into the `texts` table as needed:

- `intro_title`
- `intro_subnote`
- `start_button`
- `impressum_title`
- `impressum_body`
- `footer_copyright`

### 6. Run the application

```bash
flask run
```

Visit [http://localhost:5000](http://localhost:5000) in your browser.

---

## Project Structure

```
pong360/
│
├── static/
│   ├── main.css         # Base theme and layout styles
│   ├── home.css         # Intro screen styles
│   ├── game.css         # Game canvas and modal styles
│   ├── main.js          # Modal, theme toggle, UI handlers
│   └── game.js          # Main game loop and logic
│
├── templates/
│   └── index.html       # Main HTML template using Jinja2
│
├── .env                 # Local environment variables (excluded from Git)
├── app.py               # Flask server logic
├── requirements.txt     # Python dependencies
└── README.md            # Project documentation
```

---

## Gameplay

- Use **left/right arrow keys** or **touch and drag** to rotate the paddle.
- The paddle deflects the ball back into the arena.
- The more successful hits, the higher the score.
- If the ball escapes the arena, the game ends and the score is submitted.

---

## Configuration

- All text content is loaded from the database (`texts` table) for easy localization.
- Only one top score is displayed (latest highest score).
- Theme toggle cycles between light, dark, and colorful via a central button.

---

## Security Notes

- Do not commit your `.env` file to version control.
- Restrict database user privileges appropriately.
- Input is minimal and safe, but you should extend validation if usernames or comments are added later.

---

## Future Enhancements

- Full leaderboard with multiple player entries
- Option to enter player name
- Sound effects and music toggle
- Progressive difficulty and multiple ball speed levels

---

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute it for any purpose.

---

## Author

Created for educational and entertainment purposes using Flask and modern web technologies.
