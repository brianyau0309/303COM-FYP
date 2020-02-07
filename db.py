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
