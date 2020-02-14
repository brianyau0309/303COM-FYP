import os
import pymysql

class DBConn():
    def __init__(self):
        self.connection = pymysql.connect(user='root', password='1234', db='FYP', cursorclass=pymysql.cursors.DictCursor, charset='utf8')
        self.cursor = self.connection.cursor()

    def exe_fetch(self, SQL, fetch = "one"):
        self.cursor.execute(SQL)
        if fetch == 'one':
            return self.cursor.fetchone()
        else:
            return self.cursor.fetchall()

    def exe_commit(self, SQL):
        self.cursor.execute(SQL)
        self.connection.commit()

    def close(self):
        self.connection.close()

SQL = {
    'user_data': '''
    SELECT user_id, nickname, sex, school
    FROM users
    WHERE valid = 'yes' AND user_id = {0}
    ''',
    'create_question': '''
    INSERT INTO questions
    (creater, title, detail, create_date, solve)
    VALUES ('{0}', '{1}', '{2}', '{3}', 'N')
    ''',
    'questions': '''
    SELECT a.question_id, a.title, b.nickname, a.create_date, a.solve
    FROM questions a, users b
    WHERE a.creater = b.user_id AND a.valid = 'yes' AND b.valid = 'yes'
    ORDER BY create_date DESC
    ''',
    'question': '''
    SELECT a.question_id, a.creater, a.title, a.detail, a.solve, a.create_date, b.nickname
    FROM questions a, users b
    WHERE a.creater = b.user_id AND a.valid = 'yes' AND b.valid = 'yes' AND a.question_id = '{0}'
    ''',
    'answer_byQustion_ID': '''
    SELECT a.answer, a.create_date, a.creater, b.nickname
    FROM answers a, users b
    WHERE a.creater = b.user_id AND a.valid = 'yes' AND b.valid = 'yes' AND question = '{0}'
    ''',
    'submit_answer': '''
    INSERT INTO answers
    (question, creater, answer, create_date)
    VALUES ({0}, {1}, '{2}', '{3}')
    '''
}
