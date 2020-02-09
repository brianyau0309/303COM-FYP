-- MariaDB dump 10.17  Distrib 10.4.10-MariaDB, for Linux (aarch64)
--
-- Host: localhost    Database: FYP
--
-- Server version	10.4.10-MariaDB
-- ------------------------------------------------------
CREATE TABLE users (
  user_id INT(8) UNSIGNED ZEROFILL NOT NULL,
  password VARCHAR(20) NOT NULL,
  nickname VARCHAR(20) NOT NULL,
  school VARCHAR(80) NOT NULL,
  user_type INT(1) NOT NULL,
  PRIMARY KEY (user_id)
); 

CREATE TABLE user_types (
  user_type_id INT(1) NOT NULL,
  user_type_name VARCHAR(20) NOT NULL,
  PRIMARY KEY (user_type_id)
);

CREATE TABLE user_following (
  user_id INT(8) UNSIGNED NOT NULL,
  following INT(8) UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, following)
);

CREATE TABLE course_collection (
  user_id INT(8) UNSIGNED NOT NULL,
  course INT(8) NOT NULL,
  PRIMARY KEY (user_id, course)
);

CREATE TABLE question_collection (
  user_id INT(8) UNSIGNED NOT NULL,
  question INT(8) NOT NULL,
  PRIMARY KEY (user_id, question)
);

CREATE TABLE search_history (
  user_id INT(8) UNSIGNED NOT NULL,
  tag VARCHAR(20) NOT NULL
);

CREATE TABLE courses (
  course_id INT(8) NOT NULL,
  author INT(8) UNSIGNED NOT NULL,
  title VARCHAR(50) NOT NULL,
  descrition TEXT NOT NULL,
  create_date DATETIME NOT NULL,
  PRIMARY KEY (course_id)
);

CREATE TABLE lessions (
  course INT(8) NOT NULL,
  lession_num INT(8) NOT NULL,
  title VARCHAR(50) NOT NULL,
  detail TEXT NOT NULL,
  video_link VARCHAR(200),
  file_link VARCHAR(200),
  last_update DATETIME NOT NULL,
  PRIMARY KEY (course, lession_num)
);

CREATE TABLE courses_tags (
  course INT(8) NOT NULL,
  tag VARCHAR(20) NOT NULL,
  PRIMARY KEY (course, tag)
);

CREATE TABLE courses_comments (
  course INT(8) NOT NULL,
  composor INT(8) UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  rating INT(1) NOT NULL,
  PRIMARY KEY (course, composor)
);

CREATE TABLE questions (
  question_id INT(8) NOT NULL,
  composor INT(8) UNSIGNED NOT NULL,
  title VARCHAR(50) NOT NULL,
  detial TEXT NOT NULL,
  compose_date DATETIME NOT NULL,
  solve CHAR(1) NOT NULL,
  PRIMARY KEY (question_id)
);

CREATE TABLE anwsers (
  question INT(8) NOT NULL,
  composor INT(8) UNSIGNED NOT NULL,
  answer TEXT NOT NULL,
  compose_date DATETIME NOT NULL,
  PRIMARY KEY (question, composor)
);

CREATE TABLE anwser_likes (
  question INT(8) NOT NULL,
  composor INT(8) UNSIGNED NOT NULL,
  like_by INT(8) UNSIGNED NOT NULL,
  PRIMARY KEY (question, composor, like_by)
);

CREATE TABLE classrooms (
  classroom_id INT(8) NOT NULL,
  create_by INT(8) UNSIGNED NOT NULL,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(256) NOT NULL,
  create_date DATETIME NOT NULL,
  PRIMARY KEY (classroom_id)
);

CREATE TABLE classroom_members (
  classroom INT(8) NOT NULL,
  member INT(8) UNSIGNED NOT NULL,
  member_type INT(10) NOT NULL,
  join_date DATETIME NOT NULL,
  PRIMARY KEY (classroom, member)
);

CREATE TABLE classroom_member_types (
  type_id INT(8) NOT NULL,
  type_name VARCHAR(20) NOT NULL,
  PRIMARY KEY (type_id)
);

CREATE TABLE tasks (
  classroom INT(8) NOT NULL,
  task_num INT(8) NOT NULL,
  title VARCHAR(50) NOT NULL,
  creator INT(8) UNSIGNED NOT NULL,
  create_date DATETIME NOT NULL,
  deadline DATETIME,
  publish CHAR(1) NOT NULL,
  PRIMARY KEY (classroom, task_num)
);

CREATE TABLE task_questions (
  classroom INT(8) NOT NULL,
  task_num INT(8) NOT NULL,
  question_num INT(3) NOT NULL,
  category VARCHAR(50),
  quesion_type INT(1) NOT NULL,
  question TEXT NOT NULL,
  awnser VARCHAR(80),
  full_mark INT(3) NOT NULL,
  PRIMARY KEY (classroom, task_num, question_num)
);

CREATE TABLE task_question_types (
  type_id INT(8) NOT NULL,
  type_name VARCHAR(50) NOT NULL,
  PRIMARY KEY (type_id)
);

CREATE TABLE task_anwsers (
  classroom INT(8) NOT NULL,
  task_num INT(8) NOT NULL,
  question_num INT(3) NOT NULL,
  student INT(8) UNSIGNED NOT NULL,
  anwser VARCHAR(255) NOT NULL,
  mark INT(3),
  anwsers_comment TEXT,
  PRIMARY KEY (student)
);

CREATE TABLE celendar (
  classroom INT(8) NOT NULL,
  event_num INT(8) NOT NULL,
  event VARCHAR(50) NOT NULL,
  detail VARCHAR(100),
  event_date DATETIME NOT NULL,
  PRIMARY KEY (classroom, event_num)
);

CREATE TABLE chatroom (
  classroom INT(8) NOT NULL,
  message_num INT(8) NOT NULL,
  member INT(8) UNSIGNED NOT NULL,
  message VARCHAR(150) NOT NULL,
  compose_date DATETIME NOT NULL,
  PRIMARY KEY (classroom, message_num)
);

--
-- Foreign Key
--
ALTER TABLE users
  ADD FOREIGN KEY (user_type) REFERENCES user_types(user_type_id);

ALTER TABLE search_history
  ADD FOREIGN KEY (user_id) REFERENCES users(user_id);

ALTER TABLE user_following
  ADD FOREIGN KEY (user_id) REFERENCES users(user_id),
  ADD FOREIGN KEY (following) REFERENCES users(user_id);

ALTER TABLE course_collection
  ADD FOREIGN KEY (user_id) REFERENCES users(user_id),
  ADD FOREIGN KEY (course) REFERENCES courses(course_id);

ALTER TABLE question_collection
  ADD FOREIGN KEY (user_id) REFERENCES users(user_id),
  ADD FOREIGN KEY (question) REFERENCES questions(question_id);

ALTER TABLE courses
  ADD FOREIGN KEY (author) REFERENCES users(user_id);

ALTER TABLE lessions
  ADD FOREIGN KEY (course) REFERENCES courses(course_id);

ALTER TABLE courses_tags
  ADD FOREIGN KEY (course) REFERENCES courses(course_id);

ALTER TABLE courses_comments
  ADD FOREIGN KEY (course) REFERENCES courses(course_id),
  ADD FOREIGN KEY (composor) REFERENCES users(user_id);

ALTER TABLE questions
  ADD FOREIGN KEY (composor) REFERENCES users(user_id);

ALTER TABLE anwsers
  ADD FOREIGN KEY (question) REFERENCES questions(question_id),
  ADD FOREIGN KEY (composor) REFERENCES users(user_id);

ALTER TABLE anwser_likes
  ADD FOREIGN KEY (question, composor) REFERENCES anwsers(question, composor),
  ADD FOREIGN KEY (like_by) REFERENCES users(user_id);

ALTER TABLE classrooms
  ADD FOREIGN KEY (create_by) REFERENCES users(user_id);

ALTER TABLE classroom_members
  ADD FOREIGN KEY (classroom) REFERENCES classrooms(classroom_id),
  ADD FOREIGN KEY (member) REFERENCES users(user_id),
  ADD FOREIGN KEY (member_type) REFERENCES classroom_member_types(type_id);

ALTER TABLE tasks
  ADD FOREIGN KEY (classroom) REFERENCES classrooms(classroom_id),
  ADD FOREIGN KEY (creator) REFERENCES users(user_id);

ALTER TABLE task_questions
  ADD FOREIGN KEY (classroom, task_num) REFERENCES tasks(classroom, task_num),
  ADD FOREIGN KEY (quesion_type) REFERENCES task_question_types(type_id);

ALTER TABLE task_anwsers
  ADD FOREIGN KEY (classroom, task_num, question_num) REFERENCES task_questions(classroom, task_num, question_num),
  ADD FOREIGN KEY (student) REFERENCES users(user_id);

ALTER TABLE celendar
  ADD FOREIGN KEY (classroom) REFERENCES classrooms(classroom_id);

ALTER TABLE chatroom
  ADD FOREIGN KEY (classroom) REFERENCES classrooms(classroom_id),
  ADD FOREIGN KEY (member) REFERENCES users(user_id);

--
-- Auto Increment
--
