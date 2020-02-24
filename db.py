import os
import pymysql

class DBConn():
    def exe_fetch(self, SQL, fetch = "one"):
        connection = pymysql.connect(user='root', password='1234', db='FYP', cursorclass=pymysql.cursors.DictCursor, charset='utf8')
        cursor = connection.cursor()
        cursor.execute(SQL)
        if fetch == 'one':
            return cursor.fetchone()
        else:
            return cursor.fetchall()
        connection.close()

    def exe_commit(self, SQL):
        connection = pymysql.connect(user='root', password='1234', db='FYP', cursorclass=pymysql.cursors.DictCursor, charset='utf8')
        cursor = connection.cursor()
        cursor.execute(SQL)
        connection.commit()
        connection.close()

    def exe_commit_last_id(self, SQL):
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
    SELECT password
    FROM users
    WHERE valid = true and user_id = {0}
    ''',
    'user_data': '''
    SELECT user_id, nickname, sex, school, user_type
    FROM users
    WHERE valid = true AND user_id = {0}
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
    ORDER BY a.create_date
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
    'search_courses_by_title': '''
    SELECT a.course_id, a.author, a.title, a.create_date, b.nickname
    FROM courses a, users b
    WHERE a.author = b.user_id AND a.valid = true AND b.valid = true AND LOWER(a.title) LIKE LOWER('%{0}%')
    ORDER BY a.create_date
    ''',
    'search_courses_by_author': '''
    SELECT a.course_id, a.author, a.title, a.create_date, b.nickname
    FROM courses a, users b
    WHERE a.author = b.user_id AND a.valid = true AND b.valid = true AND LOWER(b.nickname) LIKE LOWER('%{0}%')
    ORDER BY a.create_date
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
    SELECT a.course_id, a.author, a.title, a.create_date, b.nickname
    FROM courses a, users b, course_collection c
    WHERE a.author = b.user_id AND a.course_id = c.course AND c.user_id = {0} AND a.valid = true AND b.valid = true
    ''',
    'my_courses': '''
    SELECT a.course_id, a.author, a.title, a.create_date, b.nickname
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
}
