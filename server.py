import os
from flask import Flask, flash, session, request, send_file, render_template, redirect, url_for, jsonify
from flask_cors import cross_origin
from db import DBConn

app = Flask(__name__)
app.config['SECRET_KEY'] = 'SecretKeyHERE!'

db = DBConn()

@app.route('/sw')
def sw():
    return send_file(os.path.dirname(os.path.realpath(__file__))+"/static/sw.js")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def home(path):
    if session.get('user'):
        return render_template("index.html")
    else:
        return redirect(url_for('login'))

@app.route('/login')
def login():
    return render_template("login.html")

@app.route('/login_process', methods=['POST'])
def login_process():
    user_id = request.form['user_id']
    password = request.form['password']

    data = db.exe_fetch('SELECT password FROM users WHERE user_id = \'%s\''%user_id)
    if data != None:
        if data['password'] == password:
            print('Success')
            session['user'] = user_id
        else:
            flash('Fail')
            return redirect(url_for('login'))
    else:
        flash('Fail')
        return redirect(url_for('login'))

    return redirect(url_for('home'))

@app.route('/logout', methods=['POST'])
def logout():
    if session.get('user') != None:
        session.pop('user')
        return jsonify({'logout': 'Success'})
    return jsonify({'logout': 'Fail'})

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
