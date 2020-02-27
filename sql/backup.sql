-- MariaDB dump 10.17  Distrib 10.4.10-MariaDB, for Linux (aarch64)
--
-- Host: localhost    Database: FYP
-- ------------------------------------------------------
-- Server version	10.4.10-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answer_likes`
--

DROP TABLE IF EXISTS `answer_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answer_likes` (
  `question` int(8) unsigned NOT NULL,
  `create_by` int(8) unsigned NOT NULL,
  `like_by` int(8) unsigned NOT NULL,
  PRIMARY KEY (`question`,`create_by`,`like_by`),
  KEY `like_by` (`like_by`),
  CONSTRAINT `answer_likes_ibfk_1` FOREIGN KEY (`question`, `create_by`) REFERENCES `answers` (`question`, `create_by`) ON DELETE CASCADE,
  CONSTRAINT `answer_likes_ibfk_2` FOREIGN KEY (`like_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer_likes`
--

LOCK TABLES `answer_likes` WRITE;
/*!40000 ALTER TABLE `answer_likes` DISABLE KEYS */;
INSERT INTO `answer_likes` VALUES (1,2,1),(1,2,2),(3,2,1);
/*!40000 ALTER TABLE `answer_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answers` (
  `question` int(8) unsigned NOT NULL,
  `create_by` int(8) unsigned NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_date` datetime NOT NULL,
  `valid` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`question`,`create_by`),
  KEY `create_by` (`create_by`),
  CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question`) REFERENCES `questions` (`question_id`),
  CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`create_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (1,2,'Answer Test<div><ol><li>1\'1</li><li>2\"2<br></li></ol><div><ul><li>3/3</li><li>456</li></ul></div></div>','2020-02-14 21:07:59',1),(3,2,'May be 1','2020-02-17 21:57:01',1),(6,2,'Yes I <b>know</b> it!','2020-02-24 21:14:13',1);
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `celendar`
--

DROP TABLE IF EXISTS `celendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `celendar` (
  `classroom` int(8) unsigned NOT NULL,
  `event_num` int(8) unsigned NOT NULL,
  `event` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_date` datetime NOT NULL,
  `valid` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`classroom`,`event_num`),
  CONSTRAINT `celendar_ibfk_1` FOREIGN KEY (`classroom`) REFERENCES `classrooms` (`classroom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `celendar`
--

LOCK TABLES `celendar` WRITE;
/*!40000 ALTER TABLE `celendar` DISABLE KEYS */;
/*!40000 ALTER TABLE `celendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatroom`
--

DROP TABLE IF EXISTS `chatroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chatroom` (
  `classroom` int(8) unsigned NOT NULL,
  `message_num` int(8) unsigned NOT NULL,
  `member` int(8) unsigned NOT NULL,
  `message` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`classroom`,`message_num`),
  KEY `member` (`member`),
  CONSTRAINT `chatroom_ibfk_1` FOREIGN KEY (`classroom`) REFERENCES `classrooms` (`classroom_id`) ON DELETE CASCADE,
  CONSTRAINT `chatroom_ibfk_2` FOREIGN KEY (`member`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatroom`
--

LOCK TABLES `chatroom` WRITE;
/*!40000 ALTER TABLE `chatroom` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classroom_members`
--

DROP TABLE IF EXISTS `classroom_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `classroom_members` (
  `classroom` int(8) unsigned NOT NULL,
  `member` int(8) unsigned NOT NULL,
  `join_date` datetime NOT NULL,
  PRIMARY KEY (`classroom`,`member`),
  KEY `member` (`member`),
  CONSTRAINT `classroom_members_ibfk_1` FOREIGN KEY (`classroom`) REFERENCES `classrooms` (`classroom_id`) ON DELETE CASCADE,
  CONSTRAINT `classroom_members_ibfk_2` FOREIGN KEY (`member`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classroom_members`
--

LOCK TABLES `classroom_members` WRITE;
/*!40000 ALTER TABLE `classroom_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `classroom_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classrooms`
--

DROP TABLE IF EXISTS `classrooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `classrooms` (
  `classroom_id` int(8) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `create_by` int(8) unsigned NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_date` datetime NOT NULL,
  `valid` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`classroom_id`),
  KEY `create_by` (`create_by`),
  CONSTRAINT `classrooms_ibfk_1` FOREIGN KEY (`create_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classrooms`
--

LOCK TABLES `classrooms` WRITE;
/*!40000 ALTER TABLE `classrooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `classrooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_collection`
--

DROP TABLE IF EXISTS `course_collection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_collection` (
  `user_id` int(8) unsigned NOT NULL,
  `course` int(8) unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`course`),
  KEY `course` (`course`),
  CONSTRAINT `course_collection_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `course_collection_ibfk_2` FOREIGN KEY (`course`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_collection`
--

LOCK TABLES `course_collection` WRITE;
/*!40000 ALTER TABLE `course_collection` DISABLE KEYS */;
INSERT INTO `course_collection` VALUES (1,2),(2,1),(2,2),(2,7),(11,2);
/*!40000 ALTER TABLE `course_collection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `course_id` int(8) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `author` int(8) unsigned NOT NULL,
  `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_date` datetime NOT NULL,
  `valid` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`course_id`),
  KEY `author` (`author`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`author`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (00000001,2,'DSE Math Prictice.','<b>DSE</b> Math question for F5 and F6 student to practice.<div>with Video.</div>','2020-02-20 23:05:53',1),(00000002,11,'English Course','Tenses Exercise for F1-F3 Student.','2020-02-21 20:43:27',1),(00000003,2,'Course 02','Course about Testing','2020-02-24 20:59:25',1),(00000004,2,'Course 3','<strike>For Testing</strike>','2020-02-24 21:02:39',0),(00000005,2,'Course 3','<strike>For Testing</strike>','2020-02-24 21:04:52',0),(00000006,2,'Course 3','<strike>For Testing</strike>','2020-02-24 21:05:19',0),(00000007,2,'Course 03','<i>For Testing!</i>','2020-02-24 21:10:39',1);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses_comments`
--

DROP TABLE IF EXISTS `courses_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses_comments` (
  `course` int(8) unsigned NOT NULL,
  `create_by` int(8) unsigned NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int(1) NOT NULL,
  `valid` tinyint(1) NOT NULL DEFAULT 1,
  `create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`course`,`create_by`),
  KEY `create_by` (`create_by`),
  CONSTRAINT `courses_comments_ibfk_1` FOREIGN KEY (`course`) REFERENCES `courses` (`course_id`),
  CONSTRAINT `courses_comments_ibfk_2` FOREIGN KEY (`create_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses_comments`
--

LOCK TABLES `courses_comments` WRITE;
/*!40000 ALTER TABLE `courses_comments` DISABLE KEYS */;
INSERT INTO `courses_comments` VALUES (2,2,'I like it',4,1,'2020-02-24 20:54:02');
/*!40000 ALTER TABLE `courses_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses_tags`
--

DROP TABLE IF EXISTS `courses_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses_tags` (
  `course` int(8) unsigned NOT NULL,
  `tag` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`course`,`tag`),
  CONSTRAINT `courses_tags_ibfk_1` FOREIGN KEY (`course`) REFERENCES `courses` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses_tags`
--

LOCK TABLES `courses_tags` WRITE;
/*!40000 ALTER TABLE `courses_tags` DISABLE KEYS */;
INSERT INTO `courses_tags` VALUES (1,'DSE'),(1,'F5'),(1,'F6'),(1,'Math'),(2,'English'),(2,'F1'),(2,'F2'),(2,'F3'),(2,'Tenses'),(3,'A'),(3,'B'),(7,'A'),(7,'B'),(7,'C');
/*!40000 ALTER TABLE `courses_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lessons` (
  `course` int(8) unsigned NOT NULL,
  `lesson_num` int(8) unsigned NOT NULL,
  `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_link` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_update` datetime NOT NULL,
  PRIMARY KEY (`course`,`lesson_num`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`course`) REFERENCES `courses` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` VALUES (1,1,'Lesson 1','Somthing &gt;&gt;&gt;!!','https://www.youtube.com/embed/L_UPHsGR6fM','Tutorial1011ans_2017_1.doc','2020-02-24 20:54:42'),(2,1,'Lesson 1: Past Tense','Q1. What is the past tense of \'run\'?<div>Q2.</div>',NULL,NULL,'2020-02-23 23:11:43'),(2,2,'Lesson 2: Present tense','Present Tense<div>a. 1</div><div>b. 2</div><div>c.&nbsp;</div>','https://www.youtube.com/embed/EYiUqij4ngM','Tutorial1011ans_2017_1.doc','2020-02-23 23:33:41');
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_collection`
--

DROP TABLE IF EXISTS `question_collection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question_collection` (
  `user_id` int(8) unsigned NOT NULL,
  `question` int(8) unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`question`),
  KEY `question` (`question`),
  CONSTRAINT `question_collection_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `question_collection_ibfk_2` FOREIGN KEY (`question`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_collection`
--

LOCK TABLES `question_collection` WRITE;
/*!40000 ALTER TABLE `question_collection` DISABLE KEYS */;
INSERT INTO `question_collection` VALUES (1,1),(2,1),(2,3),(2,4),(2,7);
/*!40000 ALTER TABLE `question_collection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questions` (
  `question_id` int(8) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `create_by` int(8) unsigned NOT NULL,
  `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_date` datetime NOT NULL,
  `solved_by` int(8) unsigned DEFAULT NULL,
  `valid` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`question_id`),
  KEY `create_by` (`create_by`),
  KEY `questions_ibfk_2` (`solved_by`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`create_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`solved_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (00000001,1,'Testing','<b>Hello World!</b><div style=\"text-align: left;\">Here is a <i>Test</i> to know is this <u>Text Field</u> is work or not.</div><div style=\"text-align: left;\">Left</div><div style=\"text-align: center;\">Center</div><div style=\"text-align: right;\">Right</div><div style=\"text-align: left;\"><ol><li>Number List</li></ol><ul><li>Bullet List</li></ul><div>Super<sup>script</sup></div><div>Sub<sub>script</sub></div></div>','2020-02-12 22:59:30',NULL,1),(00000002,1,'Student\'s testing','<b>a\'s</b><div style=\"text-align: center;\"><i>b\\s\"</i></div>','2020-02-12 23:18:47',NULL,1),(00000003,1,'Math Question','<img src=\"https://i.insider.com/5a4bdcc6cb9df434008b4577?width=600&amp;format=jpeg&amp;auto=webp\" alt=\"「math question」的圖片\n搜尋結果\"><div>What is the Answer</div>','2020-02-14 22:15:35',NULL,1),(00000004,2,'Mary Question','Past Tenses Question','2020-02-17 21:59:09',NULL,1),(00000005,2,'Mary Question 2','<div style=\"text-align: center;\">Question 2</div><div style=\"text-align: center;\">What is the past tense of run?</div>','2020-02-17 22:02:50',NULL,1),(00000006,1,'Peter Question','<b>Bold</b> means&nbsp;import','2020-02-18 04:49:32',NULL,1),(00000007,2,'Big Question','About Hong Kong.....','2020-02-24 21:13:05',NULL,1);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `search_history`
--

DROP TABLE IF EXISTS `search_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_history` (
  `user_id` int(8) unsigned NOT NULL,
  `tag` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  KEY `user_id` (`user_id`),
  CONSTRAINT `search_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `search_history`
--

LOCK TABLES `search_history` WRITE;
/*!40000 ALTER TABLE `search_history` DISABLE KEYS */;
INSERT INTO `search_history` VALUES (2,'DSE'),(2,'DSE'),(2,'A'),(2,'A'),(2,'C'),(2,'A'),(2,'C'),(2,'A'),(2,'C'),(1,'History'),(1,'DSE'),(1,'English'),(1,'DSE'),(1,'English'),(1,'DSE'),(1,'Math'),(2,'dse'),(2,'english'),(2,'dse'),(2,'Math'),(2,'dse'),(2,'Math'),(2,'English'),(2,'math'),(2,'ahq');
/*!40000 ALTER TABLE `search_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_answers`
--

DROP TABLE IF EXISTS `task_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task_answers` (
  `classroom` int(8) unsigned NOT NULL,
  `task_num` int(8) unsigned NOT NULL,
  `question_num` int(3) NOT NULL,
  `student` int(8) unsigned NOT NULL,
  `answer` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mark` int(3) DEFAULT NULL,
  `answers_comment` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`student`),
  KEY `classroom` (`classroom`,`task_num`,`question_num`),
  CONSTRAINT `task_answers_ibfk_1` FOREIGN KEY (`classroom`, `task_num`, `question_num`) REFERENCES `task_questions` (`classroom`, `task_num`, `question_num`) ON DELETE CASCADE,
  CONSTRAINT `task_answers_ibfk_2` FOREIGN KEY (`student`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_answers`
--

LOCK TABLES `task_answers` WRITE;
/*!40000 ALTER TABLE `task_answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_questions`
--

DROP TABLE IF EXISTS `task_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task_questions` (
  `classroom` int(8) unsigned NOT NULL,
  `task_num` int(8) unsigned NOT NULL,
  `question_num` int(3) NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quesion_type` enum('mc','short','long') COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `awnser` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_mark` int(3) NOT NULL,
  PRIMARY KEY (`classroom`,`task_num`,`question_num`),
  CONSTRAINT `task_questions_ibfk_1` FOREIGN KEY (`classroom`, `task_num`) REFERENCES `tasks` (`classroom`, `task_num`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_questions`
--

LOCK TABLES `task_questions` WRITE;
/*!40000 ALTER TABLE `task_questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `classroom` int(8) unsigned NOT NULL,
  `task_num` int(8) unsigned NOT NULL,
  `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creator` int(8) unsigned NOT NULL,
  `create_date` datetime NOT NULL,
  `deadline` datetime DEFAULT NULL,
  `publish` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`classroom`,`task_num`),
  KEY `creator` (`creator`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`classroom`) REFERENCES `classrooms` (`classroom_id`) ON DELETE CASCADE,
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`creator`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_following`
--

DROP TABLE IF EXISTS `user_following`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_following` (
  `user_id` int(8) unsigned NOT NULL,
  `following` int(8) unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`following`),
  KEY `following` (`following`),
  CONSTRAINT `user_following_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_following_ibfk_2` FOREIGN KEY (`following`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_following`
--

LOCK TABLES `user_following` WRITE;
/*!40000 ALTER TABLE `user_following` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_following` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(8) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `password` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sex` enum('m','f','n') COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_type` enum('student','teacher','admin') COLLATE utf8mb4_unicode_ci NOT NULL,
  `school` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valid` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (00000001,'Student01','wong','tai man','peter','m','student','A School',1),(00000002,'Teacher01','chan','man man','mary','f','teacher','B School',1),(00000003,'Admin01','yau','siu fung brian','brian','m','admin','',1),(00000004,'Student02','lee','tai man','ben','m','student','C School',1),(00000005,'Student03','chan','tai man','tommy','m','student','A School',1),(00000006,'Student04','chow','tai man','jimmy','m','student','B School',1),(00000007,'Student05','lee','tai man','tony','m','student','C School',1),(00000008,'Student06','wong','man man','emma','f','student','C School',1),(00000009,'Student07','ng','tai man','john','m','student','D School',1),(00000010,'Student08','cheng','man man','christain','f','student','A School',1),(00000011,'Teacher02','lee','man man','mia','f','teacher','A School',1),(00000012,'Teacher03','ng','tai man','oliver','m','teacher','A School',1),(00000013,'Teacher04','chow','man man','eva','f','teacher','C School',1),(00000014,'Teacher05','wong','tai man','ben','m','teacher','D School',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-02-27 21:51:51
