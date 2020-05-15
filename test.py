import unittest
import requests
import json
domain_name = "https://briyana.ddns.net"
student_session = "eyJ1c2VyIjoiMSJ9.Xre7gg.0LpCnpVsmPJ082hwygo0BXXBRpM"
teacher_session = "eyJ1c2VyIjoiMiJ9.Xr6AWw.AsyKDK77KzZe4NGGiBD1inHxbFI"

class FYPUnitTest(unittest.TestCase):
    def test_login(self):
        # Using user_id and password to Login and get the result
        login_data = {'user_id': 1, 'password': 'Student01'}
        request_result = requests.post(domain_name+"/login_process", data=login_data, verify=False)

        # Expected: Get index page after login success
        with open('static/index.html') as f:
            login_result = f.read()

        self.assertEqual(request_result.text, login_result, "Login Fail")

    def test_user_info(self):
        cookies = { 'session': student_session }
        request_with_session = requests.get(domain_name+"/api/user_data", cookies=cookies, verify=False)
        request_without_session = requests.get(domain_name+"/api/user_data", verify=False)

        # Expected: User Information of User 1
        expected = {
            "user_data": {
                "name": "wong tai man",
                "nickname": "peter",
                "school": "A School",
                "sex": "m",
                "user_id": 1,
                "user_type": "student"
            }
        }

        error_msg = {
            "result": "Error"
        }

        self.assertEqual(json.loads(request_with_session.text), expected, "Get User Information Fail")
        self.assertEqual(json.loads(request_without_session.text), error_msg, "Get User Information Fail")

    def test_changePW(self):
        cookies = { 'session': teacher_session }
        data = {
            "changePassword": {
               "password_now": "teacher1",
               "password_new": "Teacher01"
            }
        }
        request_result = requests.put(domain_name+"/api/user_data", json=data, cookies=cookies, verify=False)

        # Expected: Success to change password of User 2
        expected = {
            "changePassword": "Success"
        }

        self.assertEqual(json.loads(request_result.text), expected, "Error to change password")

        # Change it back after test
        data = {
            "changePassword": {
               "password_now": "Teacher01",
               "password_new": "teacher1"
            }
        }
        request_result = requests.put(domain_name+"/api/user_data", json=data, cookies=cookies, verify=False)

    def test_close_task(self):
        cookies = { 'session': teacher_session }
        expected = {'force_close_task': 'Success'}

        request_result = requests.patch(domain_name+"/api/task?c=1&t=10", cookies=cookies, verify=False)

        self.assertEqual(json.loads(request_result.text), expected, "Error to close task")

    def test_upload_icon(self):
        cookies = { 'session': student_session }
        files = {'icon': open('static/images/user_icons/2.png', 'rb')}
        expected = {'changeIcon': 'Success'}

        request_result = requests.post(domain_name+"/api/user_info", files=files, cookies=cookies, verify=False)


        self.assertEqual(json.loads(request_result.text), expected, "Error to upload icon")

if __name__ == '__main__':
    unittest.main()
