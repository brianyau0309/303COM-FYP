import os
from flask import Flask, flash, session, request, send_file, render_template, redirect, url_for, jsonify
from flask_cors import cross_origin
from datetime import datetime
from db import DBConn, SQL

app = Flask(__name__)
app.config['SECRET_KEY'] = 'SecretKeyHERE!'

db = DBConn()

def replace_string(string):
    return string.replace('\\','\\\\').replace('\'','\\\'').replace('\"','\\\"')
def re_replace_string(string):
    return string.replace('\\\\','\\').replace('\\\'','\'').replace('\\\"','\"')

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

    data = db.exe_fetch("SELECT password FROM users WHERE valid = 'yes' and user_id = '%s'"%user_id)
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

#
# API Start
#

@app.route('/api/user_data')
def api_user_data():
    if session.get('user') != None:
        user = int(session.get('user'))
        user_data = db.exe_fetch(SQL['user_data'].format(user))

        return jsonify({'user_data': user_data})

    return jsonify({'result': 'Error'})

#
# CreateQuestion API
#

@app.route('/api/create_question', methods=['POST'])
def api_create_question():
    if session.get('user') != None:
        user = session.get('user')
        data = request.json.get('create_question')
        title = replace_string(data.get('title'))
        content = replace_string(data.get('content'))
        now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')

        print(SQL['create_question'].format(user, title, content, now))
        return jsonify({'result': 'Success'})

    return jsonify({'result': 'Error'})

#
# Questions API
#

@app.route('/api/questions')
def api_questions():
    data = db.exe_fetch(SQL['questions'], 'all')
    return jsonify({'questions': data})

#
# Question API
#

@app.route('/api/question/<path:id>')
def api_question(id):
    data = db.exe_fetch(SQL['question'].format(id))
    return jsonify({'question': data})

@app.route('/api/check_can_answer/<path:id>')
def api_check_can_answer(id):
    canAnswer = True
    if session.get('user') != None:
        user = session.get('user')
        data = db.exe_fetch(SQL['answer_byQustion_ID'].format(id)+' AND creater = %s'%user)
        question_creater = db.exe_fetch(SQL['question'].format(id)).get('creater')
        print(int(user) == int(question_creater))
        if data or int(user) == int(question_creater):
            canAnswer = False

    return jsonify({'canAnswer': canAnswer})

@app.route('/api/answers/<path:id>')
def api_anwsers_byQuestion_ID(id):
    data = db.exe_fetch(SQL['answer_byQustion_ID'].format(id), 'all')
    return jsonify({'answers': data})

@app.route('/api/submit_answer', methods=['POST'])
def api_submit_answer():
    if session.get('user') != None:
        user = session.get('user')
        data = request.json.get('submit_answer')
        question = data.get('question')
        answer = replace_string(data.get('answer'))
        now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')

        print(SQL['submit_answer'].format(user, question, answer, now))
        return jsonify({'submit_anwser': 'Success'})

    return jsonify({'result': 'Error'})

if __name__ == '__main__':
    version = db.exe_fetch('select version()')['version()']
    print(' ~ Running on port 3000.\n ~ Database:', version)

    cer = os.path.dirname(os.path.realpath(__file__))+"/ssl/certificate.crt"
    key = os.path.dirname(os.path.realpath(__file__))+"/ssl/private.key"

    app.run(host='192.168.1.160', port=3000, debug=True, ssl_context=(cer,key))
