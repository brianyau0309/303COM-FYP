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
  `creater` int(8) unsigned NOT NULL,
  `like_by` int(8) unsigned NOT NULL,
  PRIMARY KEY (`question`,`creater`,`like_by`),
  KEY `like_by` (`like_by`),
  CONSTRAINT `answer_likes_ibfk_1` FOREIGN KEY (`question`, `creater`) REFERENCES `answers` (`question`, `creater`),
  CONSTRAINT `answer_likes_ibfk_2` FOREIGN KEY (`like_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer_likes`
--

LOCK TABLES `answer_likes` WRITE;
/*!40000 ALTER TABLE `answer_likes` DISABLE KEYS */;
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
  `creater` int(8) unsigned NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_date` datetime NOT NULL,
  `valid` enum('yes','no') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`question`,`creater`),
  KEY `creater` (`creater`),
  CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question`) REFERENCES `questions` (`question_id`),
  CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`creater`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
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
  `valid` enum('yes','no') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'yes',
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
  CONSTRAINT `chatroom_ibfk_1` FOREIGN KEY (`classroom`) REFERENCES `classrooms` (`classroom_id`),
  CONSTRAINT `chatroom_ibfk_2` FOREIGN KEY (`member`) REFERENCES `users` (`user_id`)
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
  CONSTRAINT `classroom_members_ibfk_1` FOREIGN KEY (`classroom`) REFERENCES `classrooms` (`classroom_id`),
  CONSTRAINT `classroom_members_ibfk_2` FOREIGN KEY (`member`) REFERENCES `users` (`user_id`)
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
  `valid` enum('yes','no') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`classroom_id`),
  KEY `create_by` (`create_by`),
  CONSTRAINT `classrooms_ibfk_1` FOREIGN KEY (`create_by`) REFERENCES `users` (`user_id`)
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
  CONSTRAINT `course_collection_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `course_collection_ibfk_2` FOREIGN KEY (`course`) REFERENCES `courses` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_collection`
--

LOCK TABLES `course_collection` WRITE;
/*!40000 ALTER TABLE `course_collection` DISABLE KEYS */;
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
  `descrition` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_date` datetime NOT NULL,
  `valid` enum('yes','no') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`course_id`),
  KEY `author` (`author`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`author`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
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
  `creater` int(8) unsigned NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int(1) NOT NULL,
  `valid` enum('yes','no') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`course`,`creater`),
  KEY `creater` (`creater`),
  CONSTRAINT `courses_comments_ibfk_1` FOREIGN KEY (`course`) REFERENCES `courses` (`course_id`),
  CONSTRAINT `courses_comments_ibfk_2` FOREIGN KEY (`creater`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses_comments`
--

LOCK TABLES `courses_comments` WRITE;
/*!40000 ALTER TABLE `courses_comments` DISABLE KEYS */;
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
  `tag` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`course`,`tag`),
  CONSTRAINT `courses_tags_ibfk_1` FOREIGN KEY (`course`) REFERENCES `courses` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses_tags`
--

LOCK TABLES `courses_tags` WRITE;
/*!40000 ALTER TABLE `courses_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `courses_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessions`
--

DROP TABLE IF EXISTS `lessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lessions` (
  `course` int(8) unsigned NOT NULL,
  `lession_num` int(8) unsigned NOT NULL,
  `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_link` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_link` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_update` datetime NOT NULL,
  PRIMARY KEY (`course`,`lession_num`),
  CONSTRAINT `lessions_ibfk_1` FOREIGN KEY (`course`) REFERENCES `courses` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessions`
--

LOCK TABLES `lessions` WRITE;
/*!40000 ALTER TABLE `lessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `lessions` ENABLE KEYS */;
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
  CONSTRAINT `question_collection_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `question_collection_ibfk_2` FOREIGN KEY (`question`) REFERENCES `questions` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_collection`
--

LOCK TABLES `question_collection` WRITE;
/*!40000 ALTER TABLE `question_collection` DISABLE KEYS */;
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
  `creater` int(8) unsigned NOT NULL,
  `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_date` datetime NOT NULL,
  `solve` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valid` enum('yes','no') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`question_id`),
  KEY `creater` (`creater`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`creater`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (00000001,1,'Testing','<b>Hello World!</b><div style=\"text-align: left;\">Here is a <i>Test</i> to know is this <u>Text Field</u> is work or not.</div><div style=\"text-align: left;\">Left</div><div style=\"text-align: center;\">Center</div><div style=\"text-align: right;\">Right</div><div style=\"text-align: left;\"><ol><li>Number List</li></ol><ul><li>Bullet List</li></ul><div>Super<sup>script</sup></div><div>Sub<sub>script</sub></div></div>','2020-02-12 22:59:30','N','yes'),(00000002,1,'Student\'s testing','<b>a\'s</b><div style=\"text-align: center;\"><i>b\\s\"</i></div>','2020-02-12 23:18:47','N','yes');
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
  `tag` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  KEY `user_id` (`user_id`),
  CONSTRAINT `search_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `search_history`
--

LOCK TABLES `search_history` WRITE;
/*!40000 ALTER TABLE `search_history` DISABLE KEYS */;
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
  CONSTRAINT `task_answers_ibfk_1` FOREIGN KEY (`classroom`, `task_num`, `question_num`) REFERENCES `task_questions` (`classroom`, `task_num`, `question_num`),
  CONSTRAINT `task_answers_ibfk_2` FOREIGN KEY (`student`) REFERENCES `users` (`user_id`)
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
  CONSTRAINT `task_questions_ibfk_1` FOREIGN KEY (`classroom`, `task_num`) REFERENCES `tasks` (`classroom`, `task_num`)
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
  `publish` enum('yes','no') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`classroom`,`task_num`),
  KEY `creator` (`creator`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`classroom`) REFERENCES `classrooms` (`classroom_id`),
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`creator`) REFERENCES `users` (`user_id`)
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
  CONSTRAINT `user_following_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `user_following_ibfk_2` FOREIGN KEY (`following`) REFERENCES `users` (`user_id`)
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
  `valid` enum('yes','no') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (00000001,'Student01','wong','tai man','peter','m','student','A School','yes'),(00000002,'Teacher01','chan','tai man','mary','m','teacher','B School','yes'),(00000003,'Admin01','yau','siu fung brian','brian','m','admin','','yes');
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

-- Dump completed on 2020-02-14 20:22:11