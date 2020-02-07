-- MariaDB dump 10.17  Distrib 10.4.10-MariaDB, for Linux (aarch64)
--
-- Host: localhost    Database: FYP
--
-- Server version	10.4.10-MariaDB
-- ------------------------------------------------------
CREATE TABLE users (
  username VARCHAR(20) NOT NULL,
  password VARCHAR(20) NOT NULL,
  nickname VARCHAR(20) NOT NULL,
  school VARCHAR(40) NOT NULL,
  user_type INT(1) NOT NULL,
  PRIMARY KEY (username)
); 

CREATE TABLE user_types (
  user_type_id INT(1) NOT NULL,
  user_type_name VARCHAR(20) NOT NULL,
  PRIMARY KEY (user_type_id)
);

CREATE TABLE user_following (
  username VARCHAR(20) NOT NULL,
  following VARCHAR(20) NOT NULL,
  PRIMARY KEY (username, following)
);

CREATE TABLE material_collection (
  username VARCHAR(20) NOT NULL,
  material CHAR(8) NOT NULL,
  PRIMARY KEY (username, material)
);

CREATE TABLE question_collection (
  username VARCHAR(20) NOT NULL,
  question CHAR(8) NOT NULL,
  PRIMARY KEY (username, question)
);

CREATE TABLE search_history (
  username VARCHAR(20) NOT NULL,
  tag VARCHAR(20) NOT NULL
);

CREATE TABLE materials (
  material_id CHAR(8) NOT NULL,
  author VARCHAR(20) NOT NULL,
  title VARCHAR(50) NOT NULL,
  descrition TEXT NOT NULL,
  upload_date DATETIME NOT NULL,
  PRIMARY KEY (material_id)
);

CREATE TABLE materials_tags (
  material CHAR(8) NOT NULL,
  tag VARCHAR(20) NOT NULL,
  PRIMARY KEY (material, tag)
);

CREATE TABLE materials_comments (
  material CHAR(8) NOT NULL,
  composor VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  rating INT(1) NOT NULL,
  PRIMARY KEY (material, composor)
);

CREATE TABLE questions (
  question_id CHAR(8) NOT NULL,
  composor VARCHAR(20) NOT NULL,
  title VARCHAR(50) NOT NULL,
  detial TEXT NOT NULL,
  compose_date DATETIME NOT NULL,
  solve CHAR(1) NOT NULL,
  PRIMARY KEY (question_id)
);

CREATE TABLE anwsers (
  question CHAR(8) NOT NULL,
  composor VARCHAR(20) NOT NULL,
  answer TEXT NOT NULL,
  compose_date DATETIME NOT NULL,
  PRIMARY KEY (question, composor)
);

CREATE TABLE anwser_likes (
  question CHAR(8) NOT NULL,
  composor VARCHAR(20) NOT NULL,
  like_by VARCHAR(20) NOT NULL,
  PRIMARY KEY (question, composor, like_by)
);

CREATE TABLE classrooms (
  classroom_id CHAR(8) NOT NULL,
  create_by VARCHAR(20) NOT NULL,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(256) NOT NULL,
  create_date DATETIME NOT NULL,
  PRIMARY KEY (classroom_id)
);

CREATE TABLE classroom_members (
  classroom CHAR(8) NOT NULL,
  member VARCHAR(20) NOT NULL,
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
  classroom CHAR(8) NOT NULL,
  task_num INT(8) NOT NULL,
  title VARCHAR(50) NOT NULL,
  creator VARCHAR(20) NOT NULL,
  create_date DATETIME NOT NULL,
  deadline DATETIME,
  publish CHAR(1) NOT NULL,
  PRIMARY KEY (classroom, task_num)
);

CREATE TABLE task_questions (
  classroom CHAR(8) NOT NULL,
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
  classroom CHAR(8) NOT NULL,
  task_num INT(8) NOT NULL,
  question_num INT(3) NOT NULL,
  student VARCHAR(20) NOT NULL,
  anwser VARCHAR(255) NOT NULL,
  mark INT(3),
  anwsers_comment TEXT,
  PRIMARY KEY (student)
);

CREATE TABLE celendar (
  classroom CHAR(8) NOT NULL,
  event_num INT(8) NOT NULL,
  event VARCHAR(50) NOT NULL,
  detail VARCHAR(100),
  event_date DATETIME NOT NULL,
  PRIMARY KEY (classroom, event_num)
);

CREATE TABLE chatroom (
  classroom CHAR(8) NOT NULL,
  message_num INT(8) NOT NULL,
  member VARCHAR(20) NOT NULL,
  message VARCHAR(150) NOT NULL,
  compose_date DATETIME NOT NULL,
  PRIMARY KEY (classroom, message_num)
);

--
-- Foreign Key
--
ALTER TABLE users
  ADD FOREIGN KEY (user_type) REFERENCES user_types(user_type_id);

ALTER TABLE user_following
  ADD FOREIGN KEY (username) REFERENCES users(username),
  ADD FOREIGN KEY (following) REFERENCES users(username);

ALTER TABLE material_collection
  ADD FOREIGN KEY (username) REFERENCES users(username);

ALTER TABLE question_collection
  ADD FOREIGN KEY (question) REFERENCES questions(question_id),
  ADD FOREIGN KEY (username) REFERENCES users(username);

ALTER TABLE materials
  ADD FOREIGN KEY (author) REFERENCES users(username);

ALTER TABLE materials_tags
  ADD FOREIGN KEY (material) REFERENCES materials(material_id);

ALTER TABLE materials_comments
  ADD FOREIGN KEY (material) REFERENCES materials(material_id),
  ADD FOREIGN KEY (composor) REFERENCES users(username);

ALTER TABLE questions
  ADD FOREIGN KEY (composor) REFERENCES users(username);

ALTER TABLE anwsers
  ADD FOREIGN KEY (question) REFERENCES questions(question_id),
  ADD FOREIGN KEY (composor) REFERENCES users(username);

ALTER TABLE anwser_likes
  ADD FOREIGN KEY (question) REFERENCES questions(question_id),
  ADD FOREIGN KEY (composor) REFERENCES users(username),
  ADD FOREIGN KEY (like_by) REFERENCES users(username);

ALTER TABLE classrooms
  ADD FOREIGN KEY (create_by) REFERENCES users(username);

ALTER TABLE classroom_members
  ADD FOREIGN KEY (classroom) REFERENCES classrooms(classroom_id),
  ADD FOREIGN KEY (member) REFERENCES users(username),
  ADD FOREIGN KEY (member_type) REFERENCES classroom_member_types(type_id);

ALTER TABLE tasks
  ADD FOREIGN KEY (classroom) REFERENCES classrooms(classroom_id),
  ADD FOREIGN KEY (creator) REFERENCES users(username);

ALTER TABLE task_questions
  ADD FOREIGN KEY (classroom, task_num) REFERENCES tasks(classroom, task_num),
  ADD FOREIGN KEY (quesion_type) REFERENCES task_question_types(type_id);

ALTER TABLE task_anwsers
  ADD FOREIGN KEY (classroom, task_num, question_num) REFERENCES tasks(classroom, task_num, question_num),
  ADD FOREIGN KEY (student) REFERENCES users(username);

ALTER TABLE celendar
  ADD FOREIGN KEY (classroom) REFERENCES classrooms(classroom_id);

ALTER TABLE chatroom
  ADD FOREIGN KEY (classroom) REFERENCES classrooms(classroom_id),
  ADD FOREIGN KEY (member) REFERENCES users(username);

--
-- Auto Increment
--
