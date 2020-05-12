import unittest
import requests
import json

class FYPUnitTest(unittest.TestCase):
    def test_login(self):
        # Using user_id and password to Login and get the result
        login_data = {'user_id': 1, 'password': 'Student01'}
        request_result = requests.post("https://briyana.ddns.net/login_process", data=login_data, verify=False)

        # Expected: Get index page after login success
        with open('static/index.html') as f:
            login_result = f.read()

        self.assertEqual(request_result.text, login_result, "Login Fail")

    def test_user_info(self):
        cookies = { 'session': "eyJ1c2VyIjoiMSJ9.Xre7gg.0LpCnpVsmPJ082hwygo0BXXBRpM" }
        request_with_session = requests.get("https://briyana.ddns.net/api/user_data", cookies=cookies, verify=False)
        request_without_session = requests.get("https://briyana.ddns.net/api/user_data", verify=False)

        # Expected: User Information of User 1
        user_info = {
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

        self.assertEqual(json.loads(request_with_session.text), user_info, "Get User Information Fail")
        self.assertEqual(json.loads(request_without_session.text), error_msg, "Get User Information Fail")

    def test_b_inf(self):
        pass

    def test_cs(self):
        pass

    def test_df(self):
        pass

if __name__ == '__main__':
    unittest.main()
