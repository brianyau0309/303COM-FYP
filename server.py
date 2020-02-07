import os
from flask import Flask, session, request, send_file, render_template, redirect, url_for, jsonify
from db import DBConn

app = Flask(__name__)
db = DBConn()

@app.route('/sw')
def sw():
    return send_file(os.path.dirname(os.path.realpath(__file__))+"/static/sw.js")

@app.route('/')
def home():
    return render_template("index.html")
    if session.get('user'):
        return render_template("index.html")
    else:
        return redirect(url_for('login'))

@app.route('/login')
def login():
    return render_template("login.html")

# API Start
@app.route('/api/testing')
def api_testing():
    result = db.exe_fetch('SELECT * FROM testing', all)
    return jsonify({'result': result})

@app.route('/api/insert', methods=['POST'])
def insert():
    string = request.form['account']
    print(string)
    db.exe_commit("insert into testing values ('six', 6, '%s')"%string)

    result = db.exe_fetch('SELECT * FROM testing', all)
    return jsonify({'result': result})

if __name__ == '__main__':
    version = db.exe_fetch('select version()')['version()']
    print(' ~ Running on port 3000.\n ~ Database:', version)

    cer = os.path.dirname(os.path.realpath(__file__))+"/ssl/certificate.crt"
    key = os.path.dirname(os.path.realpath(__file__))+"/ssl/private.key"

    app.run(host='192.168.1.160', port=3000, debug=True, ssl_context=(cer,key))
