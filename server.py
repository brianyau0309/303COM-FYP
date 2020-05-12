import os
from flask import Flask, flash, session, request, send_file, render_template, redirect, url_for, jsonify
from flask_socketio import SocketIO, send, join_room, leave_room, emit
from flask_cors import cross_origin
from datetime import datetime
from db import DBConn, SQL
from pathlib import Path
from werkzeug.utils import secure_filename
from pywebpush import webpush, WebPushException
from json import dumps, loads
from VAPID.push_key import pushKeys

UPLOAD_FILE_FOLDER = os.getcwd()  + '/static/files'
ALLOWED_FILE_TYPE = ['pdf', 'doc', 'docx', 'ppt', 'pptx']
UPLOAD_ICON_FOLDER = os.getcwd()  + '/static/images/user_icons'

app = Flask(__name__)
app.config['SECRET_KEY'] = 'SecretKeyHERE!'
app.config['UPLOAD_ICON_FOLDER'] = UPLOAD_ICON_FOLDER
app.config['UPLOAD_FILE_FOLDER'] = UPLOAD_FILE_FOLDER
socketio = SocketIO(app)
db = DBConn()

def send_web_push(subscription_information, message_body):
    return webpush(
        subscription_info = subscription_information,
        data = dumps(message_body),
        vapid_private_key = pushKeys['privateKey'],
        vapid_claims = pushKeys['claim']
    )

def replace_string(string):
    return string.replace('\\','\\\\').replace('\'','\\\'').replace('\"','\\\"')

@app.route('/sw')
def sw():
    return send_file(os.path.dirname(os.path.realpath(__file__))+"/static/sw.js")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def home(path):
    if session.get('user'):
        return send_file(os.path.dirname(os.path.realpath(__file__))+"/static/index.html")
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
        if data['password'] == password and data['user_type'] != 'admin':
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

#
# User API
#

@app.route('/api/user_data', methods=['GET', 'PUT'])
def api_user_data():
    if session.get('user') != None:
        user = int(session.get('user'))
        user_data = db.exe_fetch(SQL['user_data'].format(user))

        if request.method == 'GET':
            return jsonify({'user_data': user_data})

        if request.method == 'PUT':
            changeNickname = request.json.get('changeNickname')
            changePassword = request.json.get('changePassword')

            if changeNickname:
                nickname = changeNickname['nickname']
                print(nickname)
                db.exe_commit(SQL['change_nickname'].format(nickname, user))
                return jsonify({'changeNickname': 'Success'})
            elif changePassword:
                password_now = changePassword['password_now']
                password_new = changePassword['password_new']
                password = db.exe_fetch(SQL['login_process'].format(user)).get('password')
                print(password, password_now, password_new)
                if password_now == password:
                    db.exe_commit(SQL['change_password'].format(password_new, user))
                    return jsonify({'changePassword': 'Success'})
                return jsonify({'changePassword': 'Error'})

    return jsonify({'result': 'Error'})

@app.route('/api/user_info', methods=['GET', 'POST', 'DELETE'])
def api_setting():
    if session.get('user') != None:
        user = session.get('user')
        target = request.args.get('target')

        if request.method == 'GET':
            if target == None:
                user_info = db.exe_fetch(SQL['user_info'].format(user))
                if user_info['course_avg']:
                    user_info['course_avg'] = str(user_info['course_avg'])
                return jsonify({'user_info': user_info})
            else:
                target_info = db.exe_fetch(SQL['target_info'].format(target, user))
                if target_info['course_avg']:
                    target_info['course_avg'] = str(target_info['course_avg'])
                return jsonify({'target_info': target_info})

        elif request.method == 'POST':
            file = request.files['icon']
            if file:
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_ICON_FOLDER'], str(user)+'.png'))
            return jsonify({'changeIcon': 'Success'})

        elif request.method == 'DELETE':
            if Path(UPLOAD_ICON_FOLDER+'/'+str(user)+'.png').exists():
                os.remove(UPLOAD_ICON_FOLDER+'/'+str(user)+'.png')
            return jsonify({'deleteIcon': 'Success'})

    return jsonify({'result': 'Error'})

@app.route('/api/user_follow', methods=['POST'])
def api_user_follow():
    if session.get('user') != None:
        user = session.get('user')
        target = request.args.get('target')
        if request.method == 'POST' and target != None:
            following = db.exe_fetch(SQL['following'].format(user, target))
            now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')
            if following:
                db.exe_commit(SQL['unfollow'].format(user, target))
                return jsonify({ 'user_follow': "Success" })
            else:
                db.exe_commit(SQL['follow'].format(user, target, now))
                return jsonify({ 'user_unfollow': "Success" })


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
def api_question_collection():
    if session.get('user') != None:
        user = session.get('user')
        question = request.args.get('q')

        if request.method == 'GET':
            if question != None:
                isCollection = False
                record = db.exe_fetch(SQL['is_collection'].format(user, question, 'question_collection', 'question'))
                if record:
                    isCollection = True
                return jsonify({'isCollection': isCollection})
            else:
                collection = db.exe_fetch(SQL['question_collection'].format(user), 'all')
                return jsonify({'question_collection': collection})

        elif request.method == 'POST':
            if question != None:
                db.exe_commit(SQL['add_to_collection'].format(user, question, 'question_collection', 'question'))
                return jsonify({'add_to_collection': 'Success'})

        elif request.method == 'DELETE':
            if question != None:
                db.exe_commit(SQL['delete_from_collection'].format(user, question, 'question_collection', 'question'))
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
        data = db.exe_fetch(SQL['check_can_answer'].format(id, user))
        question_create_by = db.exe_fetch(SQL['question'].format(id)).get('create_by')
        if data or int(user) == int(question_create_by):
            canAnswer = False

    return jsonify({'canAnswer': canAnswer})

@app.route('/api/answers/<path:id>')
def api_anwsers_byQuestion_ID(id):
    if session.get('user') != None:
        user = session.get('user')
        answers = db.exe_fetch(SQL['answer_byQuestionId'].format(id, user), 'all')

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

#
# Courses API
#
@app.route('/api/courses', methods=['GET', 'POST'])
def api_courses():
    if session.get('user') != None:
        user = session.get('user')

        if request.method == 'GET':
            new = db.exe_fetch(SQL['courses_new'], 'all')
            hot = db.exe_fetch(SQL['courses_hot'], 'all')
            tags = db.exe_fetch(SQL['recommand_tags'].format(user), 'all')
            recommand = []
            for tag in tags:
                if tag.get('tag') != None:
                    course = db.exe_fetch(SQL['top_in_tag'].format(replace_string(tag.get('tag'))))
                    if course != None and course not in recommand:
                        recommand.append(course)

            for i in hot:
                if len(recommand) < 5:
                    if i not in recommand:
                        recommand.append(i)
                else:
                    break

            return jsonify({'courses': { 'new': new, 'hot': hot, 'recommand': recommand } })

        elif request.method == 'POST':
            search_query = request.json.get('search_query')
            search_method = request.json.get('search_method')

            if search_method == 'title':
                search_result = db.exe_fetch(SQL['search_courses_by_title'].format(replace_string(search_query)), 'all')

            elif search_method == 'author':
                search_result = db.exe_fetch(SQL['search_courses_by_author'].format(replace_string(search_query)), 'all')

            elif search_method == 'tags':
                tags = search_query.split(' ')
                case = ''
                for tag in tags:
                    t = replace_string(tag)
                    if case == '':
                        case += '''(CASE WHEN LOWER(tag) = LOWER('{0}') THEN 1 ELSE 0 END)'''.format(t)
                    else:
                        case += ''' + (CASE WHEN LOWER(tag) = LOWER('{0}') THEN 1 ELSE 0 END)'''.format(t)
                    db.exe_commit(SQL['search_history'].format(user, t))

                search_result = db.exe_fetch(SQL['search_courses_by_tags'].format(case), 'all')
                for i in search_result:
                    try:
                        i['relevant'] = float(i['relevant'])
                    except:
                        pass

            return jsonify({ 'search_result': search_result })

    return jsonify({'result': 'Error'})

@app.route('/api/course', methods=['GET', 'POST', 'PUT', 'PATCH'])
def api_course():
    if session.get('user') != None:
        user = session.get('user')
        course = request.args.get('c')

        if request.method == 'GET':
            if course != None:
                data = db.exe_fetch(SQL['course'].format(course))
                tags = db.exe_fetch(SQL['course_tags'].format(course), 'all')
                data['tags'] = [d['tag'] for d in tags]
                try:
                    data['avg_rate'] = float(data.get('avg_rate'))
                except:
                    pass
                return jsonify({'course': data})

        elif request.method == 'POST':
            data = request.json.get('create_course')
            title = replace_string(data.get('title'))
            description = replace_string(data.get('description'))
            tags = data.get('tags')
            now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')

            last_id = db.exe_commit_last_id(SQL['create_course'].format(user, title, description, now)).get('last_id')
            for tag in tags:
                if tag != '' and tag != None:
                    try:
                        db.exe_commit(SQL['create_course_tags'].format(last_id, replace_string(tag)))
                    except:
                        pass
                    user_keys = db.exe_fetch("SELECT * FROM user_keys", 'all')
                    for i in user_keys:
                        following = db.exe_fetch("SELECT b.nickname FROM user_following a, users b WHERE a.following = b.user_id AND a.user_id = {0} AND a.following = {1}".format(i['user_id'], user))
                        if following:
                            try:
                                send_web_push(loads(i['user_key']), {'notice': 'Have a new course!', 'title': title, 'name': following['nickname'], 'action': 'create a course: '})
                            except:
                                print('webpush error')

            return jsonify({'create_course': 'Success'})

        elif request.method == 'PUT':
            data = request.json.get('submit_edited_course')
            course = data.get('course')
            edited_title = replace_string(data.get('edited_title'))
            edited_description = replace_string(data.get('edited_description'))
            edited_tags = data.get('edited_tags')
            db.exe_commit(SQL['submit_edited_course'].format(course, user, edited_title, edited_description))
            db.exe_commit(SQL['reset_course_tags'].format(course))
            for tag in edited_tags:
                if tag != '' and tag != None:
                    try:
                        db.exe_commit(SQL['create_course_tags'].format(course, replace_string(tag)))
                    except:
                        pass

            return jsonify({'edit_course': 'Success'})

        elif request.method == 'PATCH':
            if course != None:
                author = db.exe_fetch(SQL['course'].format(course)).get('author')
                if int(user) == int(author):
                    db.exe_commit(SQL['course_valid'].format('false', course))
                    return jsonify({'course_valid': {
                        'result': 'Success',
                        'valid': 'false'
                    }})

    return jsonify({'result': 'Error'})

@app.route('/api/my_courses')
def api_my_courses():
    if session.get('user') != None:
        user = session.get('user')
        course = request.args.get('c')

        if course != None:
            myCourse = False
            author = db.exe_fetch(SQL['course'].format(course)).get('author')
            if int(user) == int(author):
                myCourse = True
            return jsonify({'myCourse': myCourse})
        else:
            my_courses = db.exe_fetch(SQL['my_courses'].format(user), 'all')
            return jsonify({'my_courses': my_courses})

    return jsonify({'result': 'Error'})

@app.route('/api/course_collection', methods = ['GET', 'POST', 'DELETE'])
def api_course_collection():
    if session.get('user') != None:
        user = session.get('user')
        course = request.args.get('c')

        if request.method == 'GET':
            if course != None:
                isCollection = False
                record = db.exe_fetch(SQL['is_collection'].format(user, course, 'course_collection', 'course'))
                if record:
                    isCollection = True
                return jsonify({'isCollection': isCollection})
            else:
                collection = db.exe_fetch(SQL['course_collection'].format(user), 'all')
                return jsonify({'course_collection': collection})

        elif request.method == 'POST':
            if course != None:
                db.exe_commit(SQL['add_to_collection'].format(user, course, 'course_collection'))
                return jsonify({'add_to_collection': 'Success'})

        elif request.method == 'DELETE':
            if course != None:
                db.exe_commit(SQL['delete_from_collection'].format(user, course, 'course_collection', 'course'))
                return jsonify({'delete_from_collection': 'Success'})

    return jsonify({'result': 'Error'})

@app.route('/api/courses_comments', methods=['GET', 'POST', 'PATCH', 'DELETE'])
def api_courses_comments():
    if session.get('user') != None:
        user = session.get('user')
        course = request.args.get('c')
        checkCourse = request.args.get('cc')

        if request.method == 'GET':
            if course != None and checkCourse == None:
                comments = db.exe_fetch(SQL['comments_byCourseId'].format(course, user), 'all')
                return jsonify({'comments': comments})

            elif course == None and checkCourse != None:
                canComment = True
                data = db.exe_fetch(SQL['check_can_comment'].format(checkCourse, user))
                author = db.exe_fetch(SQL['course'].format(checkCourse)).get('author')
                if data or int(user) == int(author):
                    canComment = False

                return jsonify({'canComment': canComment})

        elif request.method == 'POST':
            data = request.json.get('submit_comment')
            course = data.get('course')
            comment = replace_string(data.get('comment'))
            rate = data.get('rate')
            now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')

            db.exe_commit(SQL['submit_comment'].format(course, user, comment, rate, now))
            return jsonify({'submit_comment': 'Success'})

        elif request.method == 'PATCH':
            data = request.json.get('submit_edited_comment')
            course = data.get('course')
            edited_comment = replace_string(data.get('edited_comment'))
            edited_rate = data.get('edited_rate')

            db.exe_commit(SQL['submit_edited_comment'].format(course, user, edited_comment, edited_rate))
            return jsonify({'submit_edited_comment': 'Success'})

        elif request.method == 'DELETE':
            if course != None:
                db.exe_commit(SQL['delete_comment'].format(course, user))
            return jsonify({'delete_comment': 'Success'})

    return jsonify({'result': 'Error'})

#
# Lesson API
#

@app.route('/api/lessons')
def api_lessons():
    if session.get('user') != None:
        user = session.get('user')
        course = request.args.get('c')
        if course != None:
            lessons = db.exe_fetch(SQL['lessons'].format(course), 'all')
            return jsonify({'lessons': lessons})

    return jsonify({'result': 'Error'})

@app.route('/api/lesson', methods=['GET', 'POST', 'PUT', 'DELETE'])
def api_lesson():
    if session.get('user') != None:
        user = session.get('user')
        course = request.args.get('c')
        lesson = request.args.get('l')

        if request.method == 'GET':
            if course != None and lesson != None:
                lesson = db.exe_fetch(SQL['lesson'].format(course, lesson))
                return jsonify({ 'lesson': lesson })

        elif request.method == 'POST':
            if course != None and lesson == None:
                file = None
                filename = 'null'
                video_link = 'null'
                title = replace_string(request.form['title'])
                detail = replace_string(request.form['lesson_detail'])
                try:
                    video_link = request.form['youtube_link']
                    file = request.files['file']
                except:
                    pass

                now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')

                num = 1
                lesson_last_num = db.exe_fetch(SQL['lesson_last_num'].format(course)).get('last_num')
                if lesson_last_num != None:
                    num = lesson_last_num + 1

                if file != None:
                    filename = secure_filename(file.filename)
                    file.save(os.path.join(app.config['UPLOAD_FILE_FOLDER'], str(course)+'_'+str(num)+'.'+filename.split('.')[-1]))
                    filename = "'"+filename+"'"
                if video_link != 'null':
                    video_link = "'"+video_link+"'"

                db.exe_commit(SQL['create_lesson'].format(course, num, title, detail, video_link, filename, now))

                return jsonify({'create_lesson': 'Success'})

        elif request.method == 'PUT':
            if course != None and lesson != None:
                file = None
                filename = 'null'
                title = replace_string(request.form['title'])
                detail = replace_string(request.form['lesson_detail'])
                video_link = request.form['youtube_link']
                delete_file = request.form['delete_file']

                try:
                    file = request.files['file']
                except:
                    pass

                now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')

                if delete_file == 'true':
                    for t in ALLOWED_FILE_TYPE:
                        if Path(UPLOAD_FILE_FOLDER+'/'+str(course)+'_'+str(lesson)+'.'+t).exists():
                            os.remove(UPLOAD_FILE_FOLDER+'/'+str(course)+'_'+str(lesson)+'.'+t)

                if file != None:
                    filename = secure_filename(file.filename)
                    for t in ALLOWED_FILE_TYPE:
                        if Path(UPLOAD_FILE_FOLDER+'/'+str(course)+'_'+str(lesson)+'.'+t).exists():
                            os.remove(UPLOAD_FILE_FOLDER+'/'+str(course)+'_'+str(lesson)+'.'+t)

                    file.save(os.path.join(app.config['UPLOAD_FILE_FOLDER'], str(course)+'_'+str(lesson)+'.'+filename.split('.')[-1]))
                    filename = "'"+filename+"'"

                if video_link != '':
                    video_link = "'"+video_link+"'"
                else:
                    video_link = 'null'

                if file != None or delete_file == 'true':
                    db.exe_commit(SQL['edit_lesson_with_filename'].format(course, lesson, title, detail, video_link, filename, now))
                else:
                    db.exe_commit(SQL['edit_lesson'].format(course, lesson, title, detail, video_link, now))

                return jsonify({'edit_lesson': 'Success'})

        elif request.method == 'DELETE':
            if course != None and lesson != None:
                for t in ALLOWED_FILE_TYPE:
                    if Path(UPLOAD_FILE_FOLDER+'/'+str(course)+'_'+str(lesson)+'.'+t).exists():
                        os.remove(UPLOAD_FILE_FOLDER+'/'+str(course)+'_'+str(lesson)+'.'+t)
                db.exe_commit(SQL['delete_lesson'].format(course, lesson))

    return jsonify({'result': 'Error'})

#
# Classrooms API
#

@app.route('/api/classrooms')
def api_classrooms():
    if session.get('user') != None:
        user = session.get('user')
        if request.method == 'GET':
            classrooms = db.exe_fetch(SQL['my_classrooms'].format(user), 'all')

            return jsonify({'classrooms': classrooms})

    return jsonify({'result': 'Error'})

@app.route('/api/classroom', methods=['GET', 'POST', 'PUT', 'DELETE'])
def api_classroom():
    if session.get('user') != None:
        user = session.get('user')
        classroom = request.args.get('c')

        if request.method == 'GET':
            if classroom != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member:
                    data = db.exe_fetch(SQL['classroom'].format(classroom))
                    return jsonify({'classroom': data})
                else:
                    return jsonify({'classroom': 'Error'})

        elif request.method == 'POST':
            user_data = db.exe_fetch(SQL['user_data'].format(user))
            if user_data.get('user_type') == 'teacher':
                data = request.json.get('createClassroom')
                name = replace_string(data.get('name'))
                description = replace_string(data.get('description'))
                now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')

                last_id = db.exe_commit_last_id(SQL['create_classroom'].format(user, name, description, now)).get('last_id')
                try:
                    db.exe_commit(SQL['join_classroom'].format(last_id, user, now))
                except:
                    pass

                return jsonify({'create_classroom': 'Success'})

        elif request.method == 'PUT':
            if classroom != None:
                user_data = db.exe_fetch(SQL['user_data'].format(user))
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if user_data.get('user_type') == 'teacher' and member:
                    data = request.json.get('editClassroom')
                    name = replace_string(data.get('name'))
                    description = replace_string(data.get('description'))

                    db.exe_commit(SQL['edit_classroom'].format(name, description, classroom))
                    return jsonify({'edit_classroom': 'Success'})

        elif request.method == 'DELETE':
            if classroom != None:
                user_data = db.exe_fetch(SQL['user_data'].format(user))
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if user_data.get('user_type') == 'teacher' and member:
                    db.exe_commit(SQL['delete_classroom'].format(classroom))
                    return jsonify({'delete_classroom': 'Success'})

    return jsonify({'result': 'Error'})

#
# Classroom_Member API
#

@app.route('/api/classroom_members', methods=['GET', 'POST', 'DELETE'])
def api_classroom_members():
    if session.get('user') != None:
        user = session.get('user')
        classroom = request.args.get('c')
        invite = request.args.get('i')

        if request.method == 'GET':
            if classroom != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member:
                    classroomData = db.exe_fetch(SQL['classroom'].format(classroom))
                    memberData = db.exe_fetch(SQL['classroom_members'].format(classroom), 'all')
                    return jsonify({
                        'classroom': classroomData,
                        'classroom_members': memberData
                    })
                else:
                    return jsonify({'classroom_members': 'Error'})

        if request.method == 'POST':
            if classroom != None and user != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member:
                    now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')
                    try:
                        db.exe_commit(SQL['join_classroom'].format(classroom, invite, now))
                    except Exception as e:
                        return jsonify({ 'invite_member': 'Error' })

                    return jsonify({ 'invite_member': 'Success' })
                else:
                    return jsonify({ 'invite_member': 'Error' })

        if request.method == 'DELETE':
            if classroom != None and user != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member:
                    db.exe_commit(SQL['kick_from_classroom'].format(classroom, invite))
                    return jsonify({ 'kick_from_classroom': 'Success' })
                else:
                    return jsonify({ 'kick_from_classroom': 'Error' })

    return jsonify({'result': 'Error'})

@app.route('/api/classroom_member', methods=['GET'])
def api_classroom_member():
    if session.get('user') != None:
        user = session.get('user')
        classroom = request.args.get('c')
        if classroom != None:
            member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
            if member:
                return jsonify({'member': True})

    return jsonify({'member': False})

#
# Tasks API
#

@app.route('/api/tasks')
def api_tasks():
    if session.get('user') != None:
        user = session.get('user')
        classroom = request.args.get('c')

        if classroom != None:
            member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
            if member:
                classroomData = db.exe_fetch(SQL['classroom'].format(classroom))
                tasksData = db.exe_fetch(SQL['tasks'].format(classroom), 'all')
                return jsonify({
                    'classroom': classroomData,
                    'tasks': tasksData
                })
            else:
                return jsonify({'tasks': 'Error'})

    return jsonify({'result': 'Error'})

@app.route('/api/task', methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def api_task():
    if session.get('user') != None:
        user = session.get('user')
        classroom = request.args.get('c')
        task = request.args.get('t')

        if request.method == 'GET':
            if classroom != None and task != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member:
                    classroomData = db.exe_fetch(SQL['classroom'].format(classroom))
                    taskData = db.exe_fetch(SQL['task'].format(classroom, task))
                    return jsonify({
                        'classroom': classroomData,
                        'task': taskData
                    })
                else:
                    return jsonify({'task': 'Error'})

        elif request.method == 'POST':
            if classroom != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                user_data = db.exe_fetch(SQL['user_data'].format(user))
                if user_data.get('user_type') == 'teacher' and member:
                    task = request.json.get('task')
                    now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')
                    deadline = datetime.strptime(task.get('deadline'), '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%Y/%m/%d %H:%M:%S')
                    title = replace_string(task.get('title'))

                    task_num = 1
                    task_last_num = db.exe_fetch(SQL['task_last_num'].format(classroom)).get('last_num')
                    if task_last_num != None:
                        task_num = task_last_num + 1

                    db.exe_commit(SQL['create_task'].format(classroom, task_num, title, user, now, deadline))
                    for (i, q) in enumerate(task.get('questions')):
                        question_num = i+1
                        category = 'NULL'
                        if q.get('category') != '':
                            category = "'"+replace_string(q.get('category'))+"'"
                        if q.get('type').lower() == 'mc':
                            choiceCol = ''
                            answer = q.get('choice')[q.get('answer') - 1]
                            choice = ""
                            for (i, c) in enumerate(q.get('choice')):
                                choice += ",'" + replace_string(c) + "'"
                                choiceCol += ',choice'+str(i+1)

                            db.exe_commit(SQL['create_task_question_MC'].format(classroom, task_num, question_num, category, 'mc', replace_string(q.get('question')), answer, choiceCol, choice))

                        elif q.get('type').lower() == 'sq':
                            db.exe_commit(SQL['create_task_question_SQ'].format(classroom, task_num, question_num, category, 'sq', replace_string(q.get('question')), replace_string(q.get('answer'))))
                    return jsonify({'create_task':'Success'})

        elif request.method == 'PUT':
            if classroom != None and task != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                user_data = db.exe_fetch(SQL['user_data'].format(user))
                if user_data.get('user_type') == 'teacher' and member:
                    taskData = request.json.get('task')
                    deadline = datetime.strptime(taskData.get('deadline'), '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%Y/%m/%d %H:%M:%S')
                    title = replace_string(taskData.get('title'))
                    task_num = task
                    questions = taskData.get('questions')

                    db.exe_commit(SQL['edit_task'].format(title, deadline, classroom, task_num))
                    db.exe_commit(SQL['reset_task_question'].format(classroom, task_num))
                    for (i, q) in enumerate(questions):
                        question_num = i+1
                        category = 'NULL'
                        if q.get('category') != '':
                            category = "'"+replace_string(q.get('category'))+"'"
                        if q.get('type').lower() == 'mc':
                            choiceCol = ''
                            answer = q.get('choice')[q.get('answer') - 1]
                            choice = ""
                            for (i, c) in enumerate(q.get('choice')):
                                choice += ",'" + replace_string(c) + "'"
                                choiceCol += ',choice'+str(i+1)

                            db.exe_commit(SQL['create_task_question_MC'].format(classroom, task_num, question_num, category, 'mc', replace_string(q.get('question')), answer, choiceCol, choice))

                        elif q.get('type').lower() == 'sq':
                            db.exe_commit(SQL['create_task_question_SQ'].format(classroom, task_num, question_num, category, 'sq', replace_string(q.get('question')), replace_string(q.get('answer'))))

                    return jsonify({'edit_task':'Success'})

        elif request.method == 'PATCH':
            if classroom != None and task != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                user_data = db.exe_fetch(SQL['user_data'].format(user))
                if user_data.get('user_type') == 'teacher' and member:
                    db.exe_commit(SQL['force_close_task'].format(classroom, task))
                    return jsonify({'force_close_task': 'Success'})

        elif request.method == 'DELETE':
            if classroom != None and task != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                user_data = db.exe_fetch(SQL['user_data'].format(user))
                if user_data.get('user_type') == 'teacher' and member:
                    db.exe_commit(SQL['delete_task'].format(classroom, task))
                    return jsonify({'delete_task': 'Success'})

    return jsonify({'result': 'Error'})

@app.route('/api/task_questions')
def api_task_questions():
    if session.get('user') != None:
        user = session.get('user')
        classroom = request.args.get('c')
        task = request.args.get('t')

        if classroom != None and task != None:
            member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
            user_data = db.exe_fetch(SQL['user_data'].format(user))
            if member and user_data.get('user_type') == 'teacher':
                classroomData = db.exe_fetch(SQL['classroom'].format(classroom))
                taskData = db.exe_fetch(SQL['task'].format(classroom, task))
                taskQuestionData = db.exe_fetch(SQL['task_questions'].format(classroom, task), 'all')
                for q in taskQuestionData:
                    q['choice'] = []
                    if q.get('question_type') == 'mc':
                        for i in range(4):
                            if q.get('choice'+str(i+1)) != None:
                                q['choice'].append(q.get('choice'+str(i+1)))
                        for (i, c) in enumerate(q.get('choice')):
                            if q.get('answer') == c:
                                q['answer'] = i+1
                    del q['choice1']
                    del q['choice2']
                    del q['choice3']
                    del q['choice4']
                    q['type'] = q['question_type']
                    del q['question_type']
                taskData['task_questions'] = taskQuestionData
                return jsonify({
                    'classroom': classroomData,
                    'task': taskData
                })
            else:
                return jsonify({'task': 'Error'})

    return jsonify({'result': 'Error'})

@app.route('/api/student_task_questions')
def api_student_task_questions():
    if session.get('user') != None:
        user = session.get('user')
        classroom = request.args.get('c')
        task = request.args.get('t')

        if classroom != None and task != None:
            member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
            if member:
                classroomData = db.exe_fetch(SQL['classroom'].format(classroom))
                taskData = db.exe_fetch(SQL['task'].format(classroom, task))
                taskQuestionData = db.exe_fetch(SQL['student_task_questions'].format(classroom, task), 'all')
                for q in taskQuestionData:
                    q['choice'] = []
                    if q.get('question_type') == 'mc':
                        for i in range(4):
                            if q.get('choice'+str(i+1)) != None:
                                q['choice'].append(q.get('choice'+str(i+1)))
                        for (i, c) in enumerate(q.get('choice')):
                            if q.get('answer') == c:
                                q['answer'] = i+1
                    del q['choice1']
                    del q['choice2']
                    del q['choice3']
                    del q['choice4']
                    q['answer'] = ''
                    q['type'] = q['question_type']
                    del q['question_type']
                taskData['task_questions'] = taskQuestionData
                return jsonify({
                    'classroom': classroomData,
                    'task': taskData
                })
            else:
                return jsonify({'task': 'Error'})

    return jsonify({'result': 'Error'})

@app.route('/api/task_answers', methods=['GET', 'POST', 'PUT'])
def api_task_answers():
    if session.get('user') != None:
        user = session.get('user')
        classroom = request.args.get('c')
        task = request.args.get('t')
        student = request.args.get('s')

        if request.method == 'GET':
            if classroom != None and task != None and student == None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member:
                    answers = db.exe_fetch(SQL['task_answers'].format(classroom, task, user), 'all')
                    return jsonify({'task_answers': answers})
                else:
                    return jsonify({'task_answers': 'Error'})
            elif classroom != None and task != None and student != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member:
                    answers = db.exe_fetch(SQL['task_answers'].format(classroom, task, student))
                    if answers != None and int(user) == int(student):
                        return jsonify({'edit_task': 'OK'})
                    else:
                        return jsonify({'edit_task': 'Error'})

        elif request.method == 'POST':
            if classroom != None and task != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member:
                    questions = request.json.get('answer_task').get('questions')
                    for q in questions:
                        db.exe_commit(SQL['answer_task'].format(classroom, task, q.get('question_num'), user, replace_string(q.get('answer'))))
                    return jsonify({'answer_task': 'Success'})
                else:
                    return jsonify({'answer_task': 'Error'})

        elif request.method == 'PUT':
            if classroom != None and task != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member:
                    questions = request.json.get('answer_task').get('questions')
                    for q in questions:
                        db.exe_commit(SQL['edit_task_answer'].format(replace_string(q.get('answer')), classroom, task, q.get('question_num'), user))
                    return jsonify({'edit_task_answer': 'Success'})
                else:
                    return jsonify({'edit_task_answer': 'Error'})

    return jsonify({'result': 'Error'})

@app.route('/api/task_results', methods=['GET'])
def api_task_results():
    if session.get('user') != None:
        user = session.get('user')
        classroom = request.args.get('c')
        task = request.args.get('t')

        if request.method == 'GET':
            if classroom != None and task != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member:
                    taskData = db.exe_fetch(SQL['task_results'].format(classroom, task))
                    if taskData != None:
                        taskData['student_answers'] = db.exe_fetch(SQL['task_results_student'].format(classroom, task), 'all')
                        taskData['performance_question'] = db.exe_fetch(SQL['task_performance_question'].format(classroom, task), 'all')
                        taskData['performance_category'] = db.exe_fetch(SQL['task_performance_category'].format(classroom, task), 'all')
                    else:
                        return jsonify({'task_results': 'Error'})

                    return jsonify({ 'task_results': taskData })
                else:
                    return jsonify({'task_results': 'Error'})

    return jsonify({'result': 'Error'})

@app.route('/api/task_result', methods=['GET'])
def api_task_result():
    if session.get('user') != None:
        user = session.get('user')
        classroom = request.args.get('c')
        task = request.args.get('t')
        student = request.args.get('s')

        if request.method == 'GET':
            if classroom != None and task != None:
                user_data = db.exe_fetch(SQL['user_data'].format(user))
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member and (int(user) == int(student) or user_data.get('user_type') == 'teacher'):
                    taskData = db.exe_fetch(SQL['task_results'].format(classroom, task))
                    if taskData != None:
                        taskData['student_result'] = db.exe_fetch(SQL['task_results_onestudent'].format(classroom, task, student))
                        taskData['student_answers'] = db.exe_fetch(SQL['student_answers'].format(classroom, task, student), 'all')
                        taskData['performance_category'] = db.exe_fetch(SQL['task_performance_category_onestudent'].format(classroom, task, student), 'all')
                    else:
                        return jsonify({'task_results': 'Error'})

                    return jsonify({ 'task_results': taskData })
                else:
                    return jsonify({'task_results': 'Error'})

    return jsonify({'result': 'Error'})

@app.route('/api/calendar', methods=['GET', 'POST', 'DELETE'])
def api_calendar():
    if session.get('user') != None:
        user = session.get('user')
        classroom = request.args.get('class')
        date = request.args.get('date')
        event = request.args.get('event')

        if request.method == 'GET':
            if classroom != None and date == None and event == None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member:
                    events = db.exe_fetch(SQL['events'].format(classroom), 'all')
                    deadline = db.exe_fetch(SQL['deadline'].format(classroom), 'all')
                    return jsonify({ 'calendar': { 'deadline': deadline, 'events': events } })
                else:
                    return jsonify({'calendar': 'Error'})
            if classroom != None and date != None and event == None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member:
                    date = date.replace('_', '-')
                    events = db.exe_fetch(SQL['events_byDate'].format(classroom, date), 'all')
                    deadline = db.exe_fetch(SQL['deadline_byDate'].format(classroom, date), 'all')
                    return jsonify({ 'calendar': { 'deadline': deadline, 'events': events } })
                else:
                    return jsonify({'calendar': 'Error'})

        elif request.method == 'POST':
            if classroom != None and date == None and event == None:
                user_data = db.exe_fetch(SQL['user_data'].format(user))
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member and user_data.get('user_type') == 'teacher':
                    data = request.json.get('createEvent')
                    name = replace_string(data.get('name'))
                    description = replace_string(data.get('description'))
                    event_date = data.get('date').replace('_', '-')
                    event_num = 1
                    event_last_num = db.exe_fetch(SQL['event_last_num'].format(classroom)).get('last_num')
                    if event_last_num != None:
                        event_num = event_last_num + 1

                    db.exe_commit(SQL['create_event'].format(classroom, event_num, name, description, event_date))
                    return jsonify({ 'cretae_event': 'Success' })

        elif request.method == 'DELETE':
            if classroom != None and event != None and date == None:
                user_data = db.exe_fetch(SQL['user_data'].format(user))
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member and user_data.get('user_type') == 'teacher':
                    db.exe_commit(SQL['delete_event'].format(classroom, event))
                    return jsonify({ 'delete_event': 'Success' })

    return jsonify({'result': 'Error'})

@app.route('/api/chatroom', methods=['GET', 'POST'])
def api_chatroom():
    if session.get('user') != None:
        user = session.get('user')
        classroom = request.args.get('class')

        if request.method == 'GET':
            if classroom != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member:
                    messages = db.exe_fetch(SQL['chatroom'].format(classroom), 'all')
                    return jsonify({ 'chatroom': { 'messages': messages } })

        elif request.method == 'POST':
            if classroom != None:
                member = db.exe_fetch(SQL['classroom_member'].format(user, classroom))
                if member:
                    data = request.json.get('message')
                    print(data)
                    message = replace_string(data)
                    now = datetime.now().strftime('%Y/%m/%d %H:%M:%S')
                    message_num = 1
                    message_last_num = db.exe_fetch(SQL['message_last_num'].format(classroom)).get('last_num')
                    if message_last_num != None:
                        message_num = message_last_num + 1

                    db.exe_commit(SQL['send_message'].format(classroom, message_num, user, message, now))
                    socketio.emit('reloadMessage', { 'room': 'class'+classroom})
                    return jsonify({ 'send_messags': 'Success' })

    return jsonify({'result': 'Error'})

#
# Notification API
#

@app.route('/api/notification', methods=['GET', 'PUT'])
def api_notification():
    if session.get('user') != None:
        user = session.get('user')
        if request.method == 'GET':
            notification = db.exe_fetch(SQL['notification'].format(user), 'all')
            return jsonify({ 'notification': notification })

        if request.method == 'PUT':
            key = request.json
            user_key = db.exe_fetch("SELECT * FROM user_keys WHERE user_id = {0}".format(user))
            if user_key:
                db.exe_commit("UPDATE user_keys SET user_key = '{0}' WHERE user_id = {1}".format(dumps(key), user))
            else:
                db.exe_commit("INSERT INTO user_keys VALUES ({0}, '{1}')".format(user, dumps(key)))

    return jsonify({'result': 'Error'})

#
# Socket.io
#

@socketio.on('message') # for testing
def handleMessage(msg):
    print('Message: ', msg)
    send(msg, broadcast=True)

@socketio.on('addRoom')
def on_join(data):
    room = data['room']
    join_room(room)
    print('addRoom: ',room)
    send('some one has join ' + room,room=room)

@socketio.on('leaveRoom')
def on_leave(data):
    room = data['room']
    leave_room(room)
    print('leave: ',room)
    send('some one has leave ' + room,room=room)

if __name__ == '__main__':
    version = db.exe_fetch('select version()')['version()']
    print(' ~ Running on port 3000.\n ~ Database:', version)

    cer = os.path.dirname(os.path.realpath(__file__))+"/ssl/certificate.crt"
    key = os.path.dirname(os.path.realpath(__file__))+"/ssl/private.key"

    socketio.run(app, debug = True, host='192.168.1.160', port=3000, keyfile=key, certfile=cer)

