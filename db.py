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

SQL = {
    'login_process':'''
    SELECT password
    FROM users
    WHERE valid = true and user_id = {0}
    ''',
    'user_data': '''
    SELECT user_id, nickname, sex, school
    FROM users
    WHERE valid = true AND user_id = {0}
    ''',
    'questions_new': '''
    SELECT a.question_id, a.title, b.nickname, b.user_type, a.create_date, a.solved_by
    FROM questions a, users b
    WHERE a.create_by = b.user_id AND a.valid = true AND b.valid = true
    ORDER BY a.create_date
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
    'answer_byQustion_ID': '''
    SELECT a.answer, a.create_date, a.create_by, b.nickname, b.user_type
    FROM answers a, users b
    WHERE a.create_by = b.user_id AND a.valid = true AND b.valid = true AND question = '{0}'
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
    FROM question_collection
    WHERE user_id = {0} AND question = {1}
    ''',
    'add_to_collection': '''
    INSERT INTO question_collection
    VALUES ({0}, {1})
    ''',
    'delete_from_collection': '''
    DELETE FROM question_collection
    WHERE user_id = {0} AND question = {1}
    ''',
    'my_questions': '''
    SELECT a.question_id, a.create_by, a.title, a.solved_by, a.create_date, b.nickname, b.user_type
    FROM questions a, users b
    WHERE a.create_by = b.user_id AND a.create_by = {0} AND a.valid = true AND b.valid = true
    '''
}
