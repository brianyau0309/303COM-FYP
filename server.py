import os
from flask import Flask, flash, session, request, send_file, render_template, redirect, url_for, jsonify
from flask_cors import cross_origin
from datetime import datetime
from db import DBConn, SQL
from pathlib import Path
from werkzeug.utils import secure_filename

UPLOAD_FILE_FOLDER = os.getcwd()  + '/static/files'
ALLOWED_FILE_TYPE = ['pdf', 'doc', 'docx', 'ppt', 'pptx']
UPLOAD_ICON_FOLDER = os.getcwd()  + '/static/image/user_icons'

app = Flask(__name__)
app.config['SECRET_KEY'] = 'SecretKeyHERE!'
app.config['UPLOAD_ICON_FOLDER'] = UPLOAD_ICON_FOLDER
app.config['UPLOAD_FILE_FOLDER'] = UPLOAD_FILE_FOLDER

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
def course_collection():
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

@app.route('/api/classrooms')
def classrooms():
    if session.get('user') != None:
        user = session.get('user')
        if request.method == 'GET':
            classrooms = db.exe_fetch(SQL['my_classrooms'].format(user), 'all')

            print(classrooms)
            return jsonify({'classrooms': classrooms})

    return jsonify({'result': 'Error'})

@app.route('/api/classroom', methods=['GET', 'POST', 'PUT', 'DELETE'])
def classroom():
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
            pass

        elif request.method == 'DELETE':
            pass

    return jsonify({'result': 'Error'})

@app.route('/api/classroom_members', methods=['GET'])
def classroom_members():
    if session.get('user') != None:
        user = session.get('user')
        classroom = request.args.get('c')

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

    return jsonify({'result': 'Error'})

if __name__ == '__main__':
    version = db.exe_fetch('select version()')['version()']
    print(' ~ Running on port 3000.\n ~ Database:', version)

    cer = os.path.dirname(os.path.realpath(__file__))+"/ssl/certificate.crt"
    key = os.path.dirname(os.path.realpath(__file__))+"/ssl/private.key"

    app.run(host='192.168.1.160', port=3000, debug=True, ssl_context=(cer,key))

