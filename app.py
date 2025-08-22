from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route("/")
def index():
    return render_template("index.html", app_name="Altay BlackJack")

@app.route("/history")
def history():
    return render_template("history.html", app_name="Altay BlackJack")

@app.route('/manifest.webmanifest')
def manifest():
    return send_from_directory('.', 'manifest.webmanifest', mimetype='application/manifest+json')

@app.route('/sw.js')
def sw():
    return send_from_directory('.', 'sw.js', mimetype='application/javascript')

if __name__ == "__main__":
    app.run(debug=True)
