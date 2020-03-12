import os
import pymysql

class DBConn():
    def exe_fetch(self, SQL, fetch = "one"):
        '''Execute SQL and Fetch Data'''
        connection = pymysql.connect(user='root', password='1234', db='FYP', cursorclass=pymysql.cursors.DictCursor, charset='utf8')
        cursor = connection.cursor()
        cursor.execute(SQL)
        if fetch == 'one':
            return cursor.fetchone()
        else:
            return cursor.fetchall()
        connection.close()

    def exe_commit(self, SQL):
        '''Execute SQL and Commit'''
        connection = pymysql.connect(user='root', password='1234', db='FYP', cursorclass=pymysql.cursors.DictCursor, charset='utf8')
        cursor = connection.cursor()
        cursor.execute(SQL)
        connection.commit()
        connection.close()

    def exe_commit_last_id(self, SQL):
        '''Execute SQL and Get Last Insert Id and Commit'''
        connection = pymysql.connect(user='root', password='1234', db='FYP', cursorclass=pymysql.cursors.DictCursor, charset='utf8')
        cursor = connection.cursor()
        cursor.execute(SQL)
        connection.commit()
        cursor.execute('SELECT LAST_INSERT_ID() as last_id')
        last_id = cursor.fetchone()
        connection.close()
        return last_id

SQL = {
    'login_process':'''
    SELECT password, user_type
    FROM users
    WHERE valid = true and user_id = {0}
    ''',
    'user_data': '''
    SELECT user_id, CONCAT(surname,' ', lastname) name, nickname, sex, school, user_type
    FROM users
    WHERE valid = true AND user_id = {0}
    ''',
    'change_nickname': '''
    UPDATE users
    SET nickname = '{0}'
    WHERE user_id = {1}
    ''',
    'change_password': '''
    UPDATE users
    SET password = '{0}'
    WHERE user_id = {1}
    ''',
    'user_info': '''
    SELECT a.best_answer, b.answer_likes, c.course_num, d.follower
    FROM (
      SELECT COUNT(*) best_answer
      FROM questions
      WHERE solved_by = {0}
    ) a, (
      SELECT COUNT(*) answer_likes
      FROM answer_likes
      WHERE create_by = {0}
    ) b, (
      SELECT COUNT(*) course_num
      FROM courses
      WHERE author = {0} AND valid = true
    ) c, (
      SELECT COUNT(*) follower
      FROM user_following
      WHERE following = {0}
    ) d
    ''',
    'target_info': '''
    SELECT a.best_answer, b.answer_likes, c.course_num, d.follower, e.following, f.*
    FROM (
      SELECT COUNT(*) best_answer
      FROM questions
      WHERE solved_by = {0}
    ) a, (
      SELECT COUNT(*) answer_likes
      FROM answer_likes
      WHERE create_by = {0}
    ) b, (
      SELECT COUNT(*) course_num
      FROM courses
      WHERE author = {0} AND valid = true
    ) c, (
      SELECT COUNT(*) follower
      FROM user_following
      WHERE following = {0}
    ) d, (
      SELECT COUNT(*) following
      FROM user_following
      WHERE user_id = {1} AND following = {0}
    ) e, (
        SELECT user_id, nickname, user_type, school
        FROM users
        WHERE user_id = {0}
    ) f
    ''',
    'following':'''
    SELECT *
    FROM user_following
    WHERE user_id = {0} AND following = {1}
    ''',
    'follow':'''
    INSERT INTO user_following VALUES
    ({0}, {1}, '{2}')
    ''',
    'unfollow':'''
    DELETE FROM user_following
    WHERE user_id = {0} AND following = {1}
    ''',
    'questions_new': '''
    SELECT a.question_id, a.title, b.nickname, b.user_type, a.create_date, a.solved_by
    FROM questions a, users b
    WHERE a.create_by = b.user_id AND a.valid = true AND b.valid = true
    ORDER BY a.create_date DESC
    LIMIT 5
    ''',
    'questions_hot': '''
    SELECT a.question_id, a.title, b.nickname, b.user_type, a.create_date, a.solved_by
    FROM questions a, users b, (
        SELECT question, COUNT(question) as count
        FROM answers
        GROUP BY question
        ORDER BY count) c
    WHERE a.create_by = b.user_id AND c.question = a.question_id AND a.valid = true AND b.valid = true
    LIMIT 5
    ''',
    'search_questions': '''
    SELECT a.question_id, a.title, b.nickname, b.user_type, a.create_date, a.solved_by
    FROM questions a, users b
    WHERE a.create_by = b.user_id AND a.valid = true AND b.valid = true AND LOWER(a.title) LIKE LOWER('%{0}%')
    ORDER BY a.create_date
    ''',
    'question': '''
    SELECT a.question_id, a.create_by, a.title, a.detail, a.solved_by, a.create_date, b.nickname, b.user_type
    FROM questions a, users b
    WHERE a.create_by = b.user_id AND a.valid = true AND b.valid = true AND a.question_id = '{0}'
    ''',
    'create_question': '''
    INSERT INTO questions
    (create_by, title, detail, create_date)
    VALUES ('{0}', '{1}', '{2}', '{3}')
    ''',
    'question_valid': '''
    UPDATE questions
    SET valid = {0}
    WHERE question_id = {1}
    ''',
    'solve_question': '''
    UPDATE questions
    SET solved_by = {0}
    WHERE question_id = {1}
    ''',
    'check_can_answer': '''
    SELECT create_by
    FROM answers
    WHERE valid = true AND question = {0} AND create_by = {1}
    ''',
    'answer_byQuestionId': '''
    SELECT
      a.answer,
      a.create_date,
      a.create_by,
      b.nickname,
      b.user_type,
      c.likes,
      CASE WHEN d.like_by IS NOT NULL
        then true
        else false
      END as user_liked
    FROM answers a
      INNER JOIN users b ON a.create_by = b.user_id
      LEFT JOIN (
        SELECT question, create_by, COUNT(*) as likes
        FROM answer_likes
        GROUP BY question, create_by
      ) as c ON a.question = c.question AND a.create_by = c.create_by
      LEFT JOIN answer_likes d ON d.question = a.question AND d.create_by = a.create_by AND d.like_by = {1}
    WHERE a.question = {0}
    ''',
    'like_answer': '''
    INSERT INTO answer_likes
    VALUES ({0}, {1}, {2})
    ''',
    'unlike_answer': '''
    DELETE FROM answer_likes
    WHERE question = {0} AND create_by = {1} AND like_by = {2}
    ''',
    'submit_answer': '''
    INSERT INTO answers
    (question, create_by, answer, create_date)
    VALUES ({0}, {1}, '{2}', '{3}')
    ''',
    'submit_edited_answer': '''
    UPDATE answers
    SET answer = '{2}'
    WHERE question = {0} AND create_by = {1}
    ''',
    'delete_answer': '''
    DELETE FROM answers
    WHERE question = {0} AND create_by = {1}
    ''',
    'question_collection': '''
    SELECT a.question_id, a.create_by, a.title, a.solved_by, a.create_date, b.nickname, b.user_type
    FROM questions a, users b, question_collection c
    WHERE a.create_by = b.user_id AND a.question_id = c.question AND c.user_id = {0} AND a.valid = true AND b.valid = true
    ''',
    'is_collection': '''
    SELECT *
    FROM {2}
    WHERE user_id = {0} AND {3} = {1}
    ''',
    'add_to_collection': '''
    INSERT INTO {2}
    VALUES ({0}, {1})
    ''',
    'delete_from_collection': '''
    DELETE FROM {2}
    WHERE user_id = {0} AND {3} = {1}
    ''',
    'my_questions': '''
    SELECT a.question_id, a.create_by, a.title, a.solved_by, a.create_date, b.nickname, b.user_type
    FROM questions a, users b
    WHERE a.create_by = b.user_id AND a.create_by = {0} AND a.valid = true AND b.valid = true
    ''',
    'courses_new': '''
    SELECT a.course_id, a.title, a.description, b.nickname, a.create_date
    FROM courses a, users b
    WHERE a.author = b.user_id AND a.valid = true AND b.valid = true
    ORDER BY a.create_date DESC
    LIMIT 5
    ''',
    'courses_hot': '''
    SELECT a.course_id, a.title, a.description, b.nickname, a.create_date, c.collectors
    FROM courses a
        INNER JOIN users b ON a.author = b.user_id
        LEFT JOIN (
          SELECT course, COUNT(*) as collectors
          FROM course_collection
          GROUP BY course
          ) c ON a.course_id = c.course
    WHERE a.valid = true AND b.valid = true
    ORDER BY c.collectors DESC
    LIMIT 5
    ''',
    'recommand_tags': '''
    SELECT tag, COUNT(*) as search_count
    FROM search_history
    WHERE user_id = {0}
    GROUP BY tag
    ORDER BY search_count DESC
    LIMIT 5
    ''',
    'top_in_tag': '''
    SELECT a.course_id, a.title, a.description ,a.create_date, b.nickname, d.collectors
    FROM courses a, users b, courses_tags c, (
      SELECT course, COUNT(*) AS collectors
      FROM course_collection
      GROUP BY course
    ) d
    WHERE a.author = b.user_id AND a.course_id = c.course AND a.course_id = d.course AND c.tag = '{0}'
    LIMIT 1
    ''',
    'search_courses_by_title': '''
    SELECT a.course_id, a.author, a.title, a.description, a.create_date, b.nickname
    FROM courses a, users b
    WHERE a.author = b.user_id AND a.valid = true AND b.valid = true AND LOWER(a.title) LIKE LOWER('%{0}%')
    ORDER BY a.create_date
    ''',
    'search_courses_by_author': '''
    SELECT a.course_id, a.author, a.title, a.description, a.create_date, b.nickname
    FROM courses a, users b
    WHERE a.author = b.user_id AND a.valid = true AND b.valid = true AND LOWER(b.nickname) LIKE LOWER('%{0}%')
    ORDER BY a.create_date
    ''',
    'search_courses_by_tags': '''
    SELECT a.course_id, a.author, a.title, a.description, a.create_date, b.nickname, c.relevant
    FROM courses a
      INNER JOIN users b ON a.author = b.user_id
      INNER JOIN (
        SELECT course,
          SUM({0})
          as relevant
        FROM courses_tags
        GROUP BY course
      ) c ON a.course_id = c.course and relevant > 0
    WHERE a.valid = true AND b.valid = true
    ORDER BY c.relevant DESC
    ''',
    'search_history': '''
    INSERT INTO search_history VALUES ({0}, '{1}')
    ''',
    'course': '''
    SELECT a.course_id, a.author, a.title, a.description, a.create_date, b.nickname, c.avg_rate, c.raters
    FROM courses a
      INNER JOIN users b ON a.author = b.user_id
      LEFT JOIN (SELECT course, AVG(rating) as avg_rate, COUNT(create_by) as raters FROM courses_comments) c ON c.course = {0}
    WHERE a.valid = true AND b.valid = true AND a.course_id = {0}
    ''',
    'course_tags': '''
    SELECT tag FROM courses_tags WHERE course = {0}
    ''',
    'create_course': '''
    INSERT INTO courses (author, title, description, create_date)
    VALUES ({0}, '{1}', '{2}', '{3}')
    ''',
    'create_course_tags': '''
    INSERT INTO courses_tags (course, tag)
    VALUES ({0}, '{1}')
    ''',
    'submit_edited_course': '''
    UPDATE courses
    SET title = '{2}', description = '{3}'
    WHERE course_id = {0} AND author = {1}
    ''',
    'reset_course_tags': '''
    DELETE FROM courses_tags
    WHERE course = {0}
    ''',
    'course_collection': '''
    SELECT a.course_id, a.author, a.title, a.description, a.create_date, b.nickname
    FROM courses a, users b, course_collection c
    WHERE a.author = b.user_id AND a.course_id = c.course AND c.user_id = {0} AND a.valid = true AND b.valid = true
    ''',
    'my_courses': '''
    SELECT a.course_id, a.author, a.title, a.description, a.create_date, b.nickname
    FROM courses a, users b
    WHERE a.author = b.user_id AND a.author = {0} AND a.valid = true AND b.valid = true
    ''',
    'check_can_comment': '''
    SELECT create_by
    FROM courses_comments
    WHERE valid = true AND course = {0} AND create_by = {1}
    ''',
    'comments_byCourseId': '''
    SELECT a.create_by, a.content, a.rating, a.create_date, b.nickname, b.user_type
    FROM courses_comments a, users b
    WHERE a.create_by = b.user_id AND a.valid = true AND b.valid = true AND course = {0}
    ''',
    'submit_comment': '''
    INSERT INTO courses_comments
    (course, create_by, content, rating, create_date)
    VALUES ({0}, {1}, '{2}', {3},'{4}')
    ''',
    'submit_edited_comment': '''
    UPDATE courses_comments
    SET content = '{2}', rating = {3}
    WHERE course = {0} AND create_by = {1}
    ''',
    'delete_comment': '''
    DELETE FROM courses_comments
    WHERE course = {0} AND create_by = {1}
    ''',
    'course_valid': '''
    UPDATE courses
    SET valid = {0}
    WHERE course_id = {1}
    ''',
    'lessons': '''
    SELECT lesson_num, title, filename, video_link ,last_update FROM lessons WHERE course = {0}
    ''',
    'lesson': '''
    SELECT * FROM lessons
    WHERE course = {0} and lesson_num = {1}
    ''',
    'lesson_last_num': '''
    SELECT MAX(lesson_num) as last_num FROM lessons WHERE course = {0}
    ''',
    'create_lesson': '''
    INSERT INTO lessons VALUES
    ({0}, {1}, '{2}', '{3}', {4}, {5}, '{6}')
    ''',
    'edit_lesson': '''
    UPDATE lessons
    SET title = '{2}', detail = '{3}', video_link = {4}, last_update = '{5}'
    WHERE course = {0} AND lesson_num = {1}
    ''',
    'edit_lesson_with_filename': '''
    UPDATE lessons
    SET title = '{2}', detail = '{3}', video_link = {4}, filename = {5}, last_update = '{6}'
    WHERE course = {0} AND lesson_num = {1}
    ''',
    'delete_lesson': '''
    DELETE FROM lessons
    WHERE course = {0} AND lesson_num = {1}
    ''',
    'my_classrooms': '''
    SELECT a.classroom_id, a.name, a.description, a.create_date
    FROM classrooms a, classroom_members b
    WHERE a.classroom_id = b.classroom AND a.valid = true AND b.member = {0}
    ''',
    'classroom': '''
    SELECT a.classroom_id, a.create_by, a.name, a.description, a.create_date, b.nickname
    FROM classrooms a, users b
    WHERE a.create_by = b.user_id AND classroom_id = {0}
    ''',
    'edit_classroom': '''
    UPDATE classrooms
    SET name = '{0}', description = '{1}'
    WHERE classroom_id = {2}
    ''',
    'delete_classroom': '''
    DELETE FROM classrooms
    WHERE classroom_id = {0}
    ''',
    'classroom_member': '''
    SELECT *
    FROM classroom_members
    WHERE member = {0} AND classroom = {1}
    ''',
    'classroom_members': '''
    SELECT LPAD(a.member, 8, 0) user_id, CONCAT(b.surname, ' ', b.lastname) fullname, b.nickname, b.user_type, a.join_date
    FROM classroom_members a, users b
    WHERE a.member = b.user_id AND classroom = {0}
    ''',
    'create_classroom': '''
    INSERT INTO classrooms (create_by, name, description, create_date) VALUES
    ({0}, '{1}', '{2}', '{3}')
    ''',
    'join_classroom': '''
    INSERT INTO classroom_members VALUES ({0}, {1}, '{2}')
    ''',
    'kick_from_classroom': '''
    DELETE FROM classroom_members
    WHERE classroom = {0} AND member = {1}
    ''',
    'task_last_num': '''
    SELECT MAX(task_num) as last_num FROM tasks WHERE classroom = {0}
    ''',
    'create_task': '''
    INSERT INTO tasks (classroom, task_num, title, create_by, create_date, deadline)
    VALUES ({0}, {1}, '{2}', {3}, '{4}', '{5}')
    ''',
    'edit_task': '''
    UPDATE tasks
    SET title = '{0}', deadline = '{1}'
    WHERE classroom = {2} AND task_num = {3}
    ''',
    'force_close_task': '''
    UPDATE tasks SET force_close = TRUE
    WHERE classroom = {0} AND task_num = {1}
    ''',
    'reset_task_question': '''
    DELETE FROM task_questions
    WHERE classroom = {0} AND task_num = {1}
    ''',
    'create_task_question_MC': '''
    INSERT INTO task_questions (classroom, task_num, question_num, category, question_type, question, answer{7})
    VALUES ({0}, {1}, {2}, {3}, '{4}', '{5}', '{6}' {8})
    ''',
    'create_task_question_SQ': '''
    INSERT INTO task_questions (classroom, task_num, question_num, category, question_type, question, answer)
    VALUES ({0}, {1}, {2}, {3}, '{4}', '{5}', '{6}')
    ''',
    'tasks': '''
    SELECT *
    FROM tasks
    WHERE classroom = {0}
    ''',
    'task': '''
    SELECT * FROM tasks WHERE classroom = {0} AND task_num = {1}
    ''',
    'task_questions': '''
    SELECT * FROM task_questions WHERE classroom = {0} AND task_num = {1}
    ''',
    'student_task_questions': '''
    SELECT question_num, question, question_type, choice1, choice2, choice3, choice4
    FROM task_questions
    WHERE classroom = {0} AND task_num = {1}
    ''',
    'answer_task': '''
    INSERT INTO task_answers VALUES
    ({0}, {1}, {2}, {3}, '{4}')
    ''',
    'edit_task_answer': '''
    UPDATE task_answers
    SET answer = '{0}'
    WHERE classroom = {1} AND task_num = {2} AND question_num = {3} AND student = {4}
    ''',
    'task_answers': '''
    SELECT classroom, task_num, question_num, answer
    FROM task_answers
    WHERE classroom = {0} AND task_num = {1} AND student = {2}
    ''',
    'delete_task': '''
    DELETE FROM tasks
    WHERE classroom = {0} and task_num = {1}
    ''',
    'task_results': '''
    SELECT a.title, a.create_date, a.deadline, a.force_close,
      CASE WHEN b.submitted IS NOT NULL
        then b.submitted
        else 0
      END as submitted,
      c.question_count
    FROM tasks a
      LEFT JOIN (
        SELECT classroom, task_num, COUNT(*) submitted
        FROM task_answers
        WHERE question_num = 1
        GROUP BY classroom, task_num
        ) b ON a.classroom = b.classroom AND a.task_num = b.task_num
      LEFT JOIN (
        SELECT classroom, task_num, COUNT(*) question_count
        FROM task_questions
        WHERE classroom = {0} AND task_num = {1}
        GROUP BY classroom, task_num
        ) c ON a.classroom = c.classroom AND a.task_num = c.task_num
    WHERE a.classroom = {0} AND a.task_num = {1}
    ''',
    'task_results_student': '''
    SELECT LPAD(a.student, 8, 0) student, CONCAT(b.surname,' ',b.lastname) name,
      CAST(SUM(CASE WHEN a.answer = c.answer
        then 1
        else 0
      END) AS INT) correct
    FROM task_answers a, users b, task_questions c
    WHERE a.student = b.user_id AND a.classroom = c.classroom AND a.task_num = c.task_num AND a.question_num = c.question_num AND
    a.classroom = {0} AND a.task_num = {1}
    GROUP BY a.student
    ''',
    'task_results_onestudent': '''
    SELECT LPAD(a.student, 8, 0) student, CONCAT(b.surname,' ',b.lastname) name,
      CAST(SUM(CASE WHEN a.answer = c.answer
        then 1
        else 0
      END) AS INT) correct
    FROM task_answers a, users b, task_questions c
    WHERE a.student = b.user_id AND a.classroom = c.classroom AND a.task_num = c.task_num AND a.question_num = c.question_num AND
    a.classroom = {0} AND a.task_num = {1} AND student = {2}
    GROUP BY a.student
    ''',
    'task_performance_question': '''
    SELECT a.question_num,
      CAST(SUM(CASE WHEN a.answer = b.answer
        then 1
        else 0
      END) AS INT) correct
    FROM task_answers a, task_questions b
    WHERE a.classroom = b.classroom AND a.task_num = b.task_num AND a.question_num = b.question_num AND
    a.classroom = {0} AND a.task_num = {1}
    GROUP BY a.question_num
    ''',
    'task_performance_category': '''
    SELECT b.category, COUNT(*) category_count,
      CAST(SUM(CASE WHEN a.answer = b.answer
        then 1
        else 0
      END) AS INT) correct
    FROM task_answers a, task_questions b
    WHERE a.classroom = b.classroom AND a.task_num = b.task_num AND a.question_num = b.question_num AND
    a.classroom = {0} AND a.task_num = {1}
    GROUP BY b.category
    ''',
    'task_performance_category_onestudent': '''
    SELECT b.category, COUNT(*) category_count,
      CAST(SUM(CASE WHEN a.answer = b.answer
        then 1
        else 0
      END) AS INT) correct
    FROM task_answers a, task_questions b
    WHERE a.classroom = b.classroom AND a.task_num = b.task_num AND a.question_num = b.question_num AND
    a.classroom = {0} AND a.task_num = {1} AND a.student = {2}
    GROUP BY b.category
    ''',
    'student_answers': '''
    SELECT a.question_num, b.question, a.answer student_answer, b.answer
    FROM task_answers a, task_questions b
    WHERE a.classroom = b.classroom AND a.task_num = b.task_num AND a.question_num = b.question_num AND
    a.classroom = {0} AND a.task_num = {1} AND a.student = {2}
    ''',
    'deadline': '''
    SELECT deadline
    FROM tasks
    WHERE classroom = {0} AND force_close = false
    ''',
    'events': '''
    SELECT event_date
    FROM calendar
    WHERE classroom = {0}
    ''',
    'deadline_byDate': '''
    SELECT *
    FROM tasks
    WHERE classroom = {0} AND date(deadline) = '{1}' AND force_close = false
    ''',
    'events_byDate': '''
    SELECT *
    FROM calendar
    WHERE classroom = {0} AND date(event_date) = '{1}'
    ''',
    'event_last_num': '''
    SELECT MAX(event_num) as last_num FROM calendar WHERE classroom = {0}
    ''',
    'create_event': '''
    INSERT INTO calendar VALUES
    ({0}, {1}, '{2}', '{3}', '{4}')
    ''',
    'delete_event': '''
    DELETE FROM calendar
    WHERE classroom = {0} AND event_num = {1}
    ''',
    'chatroom': '''
    SELECT a.member, b.nickname, a.message, a.date, b.user_type
    FROM chatroom a, users b
    WHERE a.member = b.user_id AND a.classroom = {0}
    ''',
    'message_last_num': '''
    SELECT MAX(message_num) as last_num FROM chatroom WHERE classroom = {0}
    ''',
    'send_message': '''
    INSERT INTO chatroom VALUES
    ({0}, {1}, {2}, '{3}','{4}')
    ''',
    'notification': '''
    SELECT b.course_id, b.title, b.author, b.create_date, c.nickname, d.collection
    FROM user_following a
      INNER JOIN courses b ON a.following = b.author
      INNER JOIN users c ON b.author = c.user_id
      LEFT JOIN (
        SELECT course, COUNT(*) collection
        FROM course_collection
        WHERE user_id = {0}
        GROUP BY course
      ) d ON b.course_id = d.course
    WHERE a.user_id = {0} AND b.create_date > a.follow_date
    LIMIT 50
    ''',
}
