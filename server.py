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

    data = db.exe_fetch(SQL['login_process'].format(user_id))
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
# Questions API
#

@app.route('/api/questions', methods=['GET', 'POST'])
def api_questions():
    if session.get('user') != None:
        if request.method == 'GET':
            new = db.exe_fetch(SQL['questions_new'], 'all')
            hot = db.exe_fetch(SQL['questions_hot'], 'all')

            return jsonify({ 'questions': { 'new': new, 'hot': hot } })

        elif request.method == 'POST':
            search_query = request.json.get('search_query')
            search_result = db.exe_fetch(SQL['search_questions'].format(search_query), 'all')

            return jsonify({ 'search_result': search_result })


    return jsonify({'result': 'Error'})

@app.route('/api/question', methods = ['GET','POST','PATCH'])
def api_question():
    if session.get('user') != None:
        user = session.get('user')
        question = request.args.get('q')

        if request.method == 'GET':
            if question != None:
                data = db.exe_fetch(SQL['question'].format(question))
                return jsonify({'question': data})

        elif request.method == 'POST':
            data = request.json.get('create_question')
            title = replace_string(data.get('title'))
            content = replace_string(data.get('content'))
            now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')

            db.exe_commit(SQL['create_question'].format(user, title, content, now))
            return jsonify({'result': 'Success'})

        elif request.method == 'PATCH':
            if question != None:
                question_create_by = db.exe_fetch(SQL['question'].format(question)).get('create_by')
                if int(user) == int(question_create_by):
                    db.exe_commit(SQL['question_valid'].format('false' ,question))
                    return jsonify({'question_valid': {
                        'result': 'Success',
                        'valid': 'false'
                    }})

    return jsonify({'result': 'Error'})

@app.route('/api/solve_question', methods=['PATCH'])
def api_solve_question():
    if session.get('user') != None:
        user = session.get('user')
        data = request.json.get('solve_question')
        question = data.get('question')
        solved_by = data.get('solved_by')
        if solved_by == 0:
            solved_by = 'null'

        db.exe_commit(SQL['solve_question'].format(solved_by, question))
        return jsonify({'solve_question': 'Success'})

    return jsonify({'result': 'Error'})

@app.route('/api/my_questions')
def api_my_questions():
    if session.get('user') != None:
        user = session.get('user')
        question = request.args.get('q')

        if question != None:
            myQuestion = False
            question_create_by = db.exe_fetch(SQL['question'].format(question)).get('create_by')
            if int(user) == int(question_create_by):
                myQuestion = True
            return jsonify({'myQuestion': myQuestion})
        else:
            my_questions = db.exe_fetch(SQL['my_questions'].format(user), 'all')
            return jsonify({'my_questions': my_questions})

    return jsonify({'result': 'Error'})

@app.route('/api/question_collection', methods = ['GET', 'POST', 'DELETE'])
def question_collection():
    if session.get('user') != None:
        user = session.get('user')
        question = request.args.get('q')

        if request.method == 'GET':
            if question != None:
                isCollection = False
                record = db.exe_fetch(SQL['is_collection'].format(user, question))
                if record:
                    isCollection = True
                return jsonify({'isCollection': isCollection})
            else:
                collection = db.exe_fetch(SQL['question_collection'].format(user), 'all')
                return jsonify({'question_collection': collection})

        elif request.method == 'POST':
            if question != None:
                db.exe_commit(SQL['add_to_collection'].format(user, question))
                return jsonify({'add_to_collection': 'Success'})

        elif request.method == 'DELETE':
            if question != None:
                db.exe_commit(SQL['delete_from_collection'].format(user, question))
                return jsonify({'delete_from_collection': 'Success'})

    return jsonify({'result': 'Error'})

#
# Answer API
#

@app.route('/api/check_can_answer/<path:id>')
def api_check_can_answer(id):
    canAnswer = True
    if session.get('user') != None:
        user = session.get('user')
        data = db.exe_fetch(SQL['answer_byQustion_ID'].format(id)+' AND create_by = %s'%user)
        question_create_by = db.exe_fetch(SQL['question'].format(id)).get('create_by')
        if data or int(user) == int(question_create_by):
            canAnswer = False

    return jsonify({'canAnswer': canAnswer})

@app.route('/api/answers/<path:id>')
def api_anwsers_byQuestion_ID(id):
    if session.get('user') != None:
        user = session.get('user')
        answers = db.exe_fetch(SQL['new_answer_byQuestionId'].format(id, user), 'all')

        return jsonify({'answers': answers})

    return jsonify({'result': 'Error'})

@app.route('/api/answer_likes', methods=['POST', 'DELETE'])
def api_answer_likes():
    user = session.get('user')
    if user != None:
        question = request.args.get('q')
        create_by = request.args.get('c')

        if question != None and create_by != None:
            if request.method == 'POST':
                db.exe_commit(SQL['like_answer'].format(question, create_by, user))
                return jsonify({'like_answer': 'Success'})

            elif request.method == 'DELETE':
                db.exe_commit(SQL['unlike_answer'].format(question, create_by, user))
                return jsonify({'unlike_answer': 'Success'})

    return jsonify({'result': 'Error'})

@app.route('/api/submit_answer', methods=['POST', 'PATCH', 'DELETE'])
def api_submit_answer():
    if session.get('user') != None:
        user = session.get('user')
        if request.method == 'POST':
            data = request.json.get('submit_answer')
            question = data.get('question')
            answer = replace_string(data.get('answer'))
            now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')

            db.exe_commit(SQL['submit_answer'].format(question, user, answer, now))
            return jsonify({'submit_answer': 'Success'})

        elif request.method == 'PATCH':
            data = request.json.get('submit_edited_answer')
            question = data.get('question')
            edited_answer = replace_string(data.get('edited_answer'))

            db.exe_commit(SQL['submit_edited_answer'].format(question, user, edited_answer))
            return jsonify({'submit_edited_answer': 'Success'})

        elif request.method == 'DELETE':
            data = request.json.get('delete_answer')
            question = data.get('question')

            db.exe_commit(SQL['delete_answer'].format(question, user))
            return jsonify({'delete_answer': 'Success'})

    return jsonify({'result': 'Error'})

if __name__ == '__main__':
    version = db.exe_fetch('select version()')['version()']
    print(' ~ Running on port 3000.\n ~ Database:', version)

    cer = os.path.dirname(os.path.realpath(__file__))+"/ssl/certificate.crt"
    key = os.path.dirname(os.path.realpath(__file__))+"/ssl/private.key"

    app.run(host='192.168.1.160', port=3000, debug=True, ssl_context=(cer,key))
