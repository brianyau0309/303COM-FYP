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
INSERT INTO `answer_likes` VALUES (1,2,1),(1,2,2),(3,2,1),(6,2,1);
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
INSERT INTO `answers` VALUES (1,2,'Answer Test<div><ol><li>1\'1</li><li>2\"2<br></li></ol><div><ul><li>3/3</li><li>456</li></ul></div></div>','2020-02-14 21:07:59',1),(3,2,'May be 1','2020-02-17 21:57:01',1),(5,1,'Here is My Answer','2020-03-11 21:44:09',1),(5,4,'Here is my answer! ran','2020-03-11 21:46:00',1),(6,2,'Yes I <b>know</b> it!','2020-02-24 21:14:13',1);
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendar`
--

DROP TABLE IF EXISTS `calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendar` (
  `classroom` int(8) unsigned NOT NULL,
  `event_num` int(8) unsigned NOT NULL,
  `event` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_date` datetime NOT NULL,
  PRIMARY KEY (`classroom`,`event_num`),
  CONSTRAINT `calendar_ibfk_1` FOREIGN KEY (`classroom`) REFERENCES `classrooms` (`classroom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendar`
--

LOCK TABLES `calendar` WRITE;
/*!40000 ALTER TABLE `calendar` DISABLE KEYS */;
INSERT INTO `calendar` VALUES (1,1,'Event Test','It is\nan Event!','2020-03-18 00:00:00'),(1,3,'FYP Presentation','Prepare it!','2020-05-11 00:00:00'),(1,4,'FYP Submission','303CEM FYP','2020-05-22 00:00:00');
/*!40000 ALTER TABLE `calendar` ENABLE KEYS */;
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
INSERT INTO `chatroom` VALUES (1,1,2,'hello','2020-03-07 18:23:38'),(1,2,2,'I am Mary','2020-03-07 18:28:52'),(1,3,2,'hello?','2020-03-07 18:35:23'),(1,4,2,'hello?','2020-03-07 18:42:03'),(1,5,2,'hello','2020-03-07 18:42:19'),(1,6,1,'hello','2020-03-07 18:44:48'),(1,7,1,'?','2020-03-07 18:48:42'),(1,8,1,'?','2020-03-07 18:50:54'),(1,9,2,'Hello Peter','2020-03-07 18:51:05'),(1,10,2,'What are you doing peter?','2020-03-12 14:20:17'),(1,11,1,'Hello Mary!','2020-03-12 14:27:01'),(1,12,2,'Hello!','2020-03-12 14:27:20'),(1,13,1,'I am working','2020-03-12 14:29:45'),(1,14,2,'Testing','2020-03-15 00:06:32'),(1,15,2,'Hello','2020-03-15 00:10:16'),(1,16,2,'testing','2020-03-15 00:10:41'),(1,17,2,'Testing','2020-03-15 00:11:14'),(1,18,2,'testing','2020-03-15 00:18:38'),(1,19,2,'testing','2020-03-15 00:22:26'),(1,20,2,'testing','2020-03-15 00:24:12'),(1,21,2,'testing','2020-03-15 00:25:16'),(1,22,2,'testing','2020-03-15 00:25:37'),(1,23,2,'testing','2020-03-15 00:26:31'),(1,24,2,'testing','2020-03-15 00:27:16'),(1,25,2,'testing','2020-03-15 00:30:40'),(1,26,2,'testing','2020-03-15 00:36:17'),(1,27,2,'testing','2020-03-15 00:37:09'),(1,28,2,'testing','2020-03-15 00:44:09'),(1,29,2,'testing','2020-03-15 00:48:31'),(1,30,2,'testing','2020-03-15 00:49:31'),(1,31,2,'testing','2020-03-15 00:50:33'),(1,32,2,'test','2020-03-15 00:55:10'),(1,33,2,'test','2020-03-15 00:55:22'),(1,34,2,'test','2020-03-15 00:55:33'),(1,35,2,'test','2020-03-15 00:56:41'),(1,36,2,'test','2020-03-15 01:01:03'),(1,37,2,'tst','2020-03-15 01:01:25'),(1,38,2,'jknllkn','2020-03-16 23:11:16');
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
INSERT INTO `classroom_members` VALUES (1,1,'2020-03-12 22:50:42'),(1,2,'2020-02-27 22:16:53'),(1,4,'2020-03-04 02:54:39'),(1,5,'2020-03-04 02:54:42'),(1,6,'2020-03-04 02:54:43'),(1,7,'2020-05-03 23:37:57'),(1,8,'2020-05-03 23:37:59'),(1,9,'2020-05-03 23:38:01'),(1,10,'2020-05-03 23:38:02');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classrooms`
--

LOCK TABLES `classrooms` WRITE;
/*!40000 ALTER TABLE `classrooms` DISABLE KEYS */;
INSERT INTO `classrooms` VALUES (00000001,2,'Class 2D','hello everybody\nTesting\nClass 2D','2020-02-27 22:16:53',1);
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
INSERT INTO `course_collection` VALUES (1,2),(2,1),(2,2),(2,7),(2,9),(11,2);
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
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (00000001,2,'DSE Math Prictice.','<b>DSE</b> Math question for F5 and F6 student to practice.<div style=\"text-align: left;\">with Video!</div>','2020-02-20 23:05:53',1),(00000002,11,'English Course','Tenses Exercise for F1-F3 Student.','2020-02-21 20:43:27',1),(00000003,2,'Course 02','Course about Testing','2020-02-24 20:59:25',1),(00000007,2,'Course 03','<i>For Testing!</i>','2020-02-24 21:10:39',1),(00000008,2,'Course for test Notification','For Testing','2020-03-09 18:19:56',1),(00000009,2,'Testing Notice','Testing','2020-03-09 18:26:34',1),(00000011,12,'Oliver Course','DSE Course','2020-03-10 22:39:36',1),(00000038,2,'New ','New','2020-03-16 11:40:44',1),(00000040,2,'New Course','ABC','2020-03-16 22:37:05',1),(00000047,2,'Learn English Grammar','<b>Learning English grammar</b> by watching video and doing excises.<div>From Crown Academy of English</div><div><a href=\"https://www.youtube.com/playlist?list=PL6BDo90oiwpS4_AM1c0s0ozpROeE2A9ff\">https://www.youtube.com/playlist?list=PL6BDo90oiwpS4_AM1c0s0ozpROeE2A9ff</a></div>','2020-05-03 22:58:11',1);
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
INSERT INTO `courses_comments` VALUES (2,1,'Good',3,1,'2020-05-03 23:27:17'),(2,2,'Hello<div><ol><li>one</li><li>two</li><li>three</li><li>four</li></ol></div>',5,1,'2020-03-10 22:10:54'),(47,1,'Bad Content!',2,1,'2020-05-03 23:20:58');
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
  CONSTRAINT `courses_tags_ibfk_1` FOREIGN KEY (`course`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses_tags`
--

LOCK TABLES `courses_tags` WRITE;
/*!40000 ALTER TABLE `courses_tags` DISABLE KEYS */;
INSERT INTO `courses_tags` VALUES (1,'DSE'),(1,'F5'),(1,'F6'),(1,'Math'),(2,'English'),(2,'F1'),(2,'F2'),(2,'F3'),(2,'Tenses'),(3,'A'),(3,'B'),(7,'A'),(7,'B'),(7,'C'),(8,'testing'),(9,'DSE'),(9,'F6'),(9,'testing'),(11,'DSE'),(11,'F6'),(38,'New'),(40,'ABC'),(47,'English'),(47,'excises'),(47,'F3'),(47,'grammar');
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
INSERT INTO `lessons` VALUES (1,1,'Lesson 1','Somthing!','https://www.youtube.com/embed/L_UPHsGR6fM','Tutorial1011ans_2017_1.doc','2020-03-13 17:50:32'),(1,2,'Lesson 2','JSON file',NULL,'Tutorial1011ans_2017_1.doc','2020-03-16 22:11:12'),(2,1,'Lesson 1: Past Tense','Q1. What is the past tense of \'run\'?<div>Q2.</div>',NULL,NULL,'2020-02-23 23:11:43'),(2,2,'Lesson 2: Present tense','Present Tense<div>a. 1</div><div>b. 2</div><div>c.&nbsp;</div>','https://www.youtube.com/embed/EYiUqij4ngM','Tutorial1011ans_2017_1.doc','2020-02-23 23:33:41'),(47,1,'Lesson 1 Present Continuous verb','<div style=\"text-align: center;\"><img src=\"https://i.ytimg.com/vi/rjWd8U-6jbA/hqdefault.jpg?sqp=-oaymwEYCKgBEF5IVfKriqkDCwgBFQAAiEIYAXAB&amp;rs=AOn4CLAJXec6C8s5RWPt0Azj8NcwlO6ZmA\"></div><div style=\"text-align: center;\"><span style=\"font-size: 32px;\"><b>This is an English grammar lesson about the present continuous tense. We also call this verb tense the present progressive.</b></span></div><div style=\"text-align: center;\"><span style=\"font-size: 32px;\"><br></span></div><div style=\"text-align: center;\"><span style=\"font-size: 32px;\">The video starts with an explanation of the form which is made up of the verb \"to be\" and the ing form of the main verb. We look at the affirmative, question and negative forms.</span></div><div style=\"text-align: center;\"><span style=\"font-size: 32px;\"><br></span></div><div style=\"text-align: center;\"><span style=\"font-size: 32px;\">You will then learn the uses of the present continuous and how it is different to the present simple. The general rules is that we use the present progressive to describe an action that is happening now. It is in progress.</span></div><div style=\"text-align: center;\"><br></div>','https://www.youtube.com/embed/rjWd8U-6jbA',NULL,'2020-05-03 23:30:44'),(47,2,'Lesson 2 Present Simple verb tense','<div style=\"\"><span style=\"font-size: 32px;\">Present Simple verb tense&nbsp; - English verbs</span></div><div style=\"\"><span style=\"font-size: 32px;\">1)&nbsp;</span><span style=\"font-size: 32px;\">Present Simple form&nbsp;</span></div><div style=\"\"><span style=\"font-size: 32px;\">2) Affirmative, question and negative forms of the present Simple verb tense</span></div><div style=\"\"><span style=\"font-size: 32px;\">3) How to use the present simple</span></div><div style=\"\"><span style=\"font-size: 32px;\">5) Exercises and&nbsp;practice</span></div>','https://www.youtube.com/embed/X8lu4_5F0hg','Grammer_Excise.docx','2020-05-03 23:15:46'),(47,3,'Lesson 3 How to use apostrophes','<div><span style=\"font-size: 32px;\">Learn how to use apostrophes with this English grammar and punctuation lesson with exercises.&nbsp;</span></div><div><span style=\"font-size: 32px;\"><br></span></div><div><span style=\"font-size: 32px;\">Students make a lot of mistakes using apostrophes and so With this English punctuation class, you will learn how to use them correctly without errors.</span></div>','https://www.youtube.com/embed/4ptrjSSxljM',NULL,'2020-05-03 23:19:52');
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
INSERT INTO `question_collection` VALUES (1,1),(1,3),(2,1),(2,3),(2,4),(2,7);
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (00000001,1,'Testing','<b>Hello World!</b><div style=\"text-align: left;\">Here is a <i>Test</i> to know is this <u>Text Field</u> is work or not.</div><div style=\"text-align: left;\">Left</div><div style=\"text-align: center;\">Center</div><div style=\"text-align: right;\">Right</div><div style=\"text-align: left;\"><ol><li>Number List</li></ol><ul><li>Bullet List</li></ul><div>Super<sup>script</sup></div><div>Sub<sub>script</sub></div></div>','2020-02-12 22:59:30',2,1),(00000002,1,'Student\'s testing','<b>a\'s</b><div style=\"text-align: center;\"><i>b\\s\"</i></div>','2020-02-12 23:18:47',NULL,1),(00000003,1,'Math Question','<img src=\"https://i.insider.com/5a4bdcc6cb9df434008b4577?width=600&amp;format=jpeg&amp;auto=webp\" alt=\"「math question」的圖片\n搜尋結果\"><div>What is the Answer</div>','2020-02-14 22:15:35',2,1),(00000004,2,'Mary Question','Past Tenses Question','2020-02-17 21:59:09',NULL,1),(00000005,2,'Mary Question 2','<div style=\"text-align: center;\">Question 2</div><div style=\"text-align: center;\">What is the past tense of run?</div>','2020-02-17 22:02:50',NULL,1),(00000006,1,'Peter Question','<b>Bold</b> means&nbsp;import','2020-02-18 04:49:32',NULL,1),(00000007,2,'Big Question','About Hong Kong.....','2020-02-24 21:13:05',NULL,1),(00000008,2,'Question 1','dmkslv','2020-03-11 23:34:21',NULL,0),(00000009,2,'Q','jsjs','2020-03-11 23:37:10',NULL,0),(00000010,2,'New','1','2020-03-11 23:39:19',NULL,0),(00000011,1,'Math','<img src=\"data:image/png;base64,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\" alt=\"Image result for math formula\">','2020-03-13 17:45:09',NULL,0);
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
INSERT INTO `search_history` VALUES (2,'DSE'),(2,'DSE'),(2,'A'),(2,'A'),(2,'C'),(2,'A'),(2,'C'),(2,'A'),(2,'C'),(1,'History'),(1,'DSE'),(1,'English'),(1,'DSE'),(1,'English'),(1,'DSE'),(1,'Math'),(2,'dse'),(2,'english'),(2,'dse'),(2,'Math'),(2,'dse'),(2,'Math'),(2,'English'),(2,'math'),(2,'ahq'),(2,'Dse'),(1,'DSE'),(1,'DSE'),(1,'F5'),(1,'DSE'),(1,'F5'),(1,'DSE'),(1,'testing'),(1,'DSE'),(1,'testing'),(1,'F6'),(1,'DSE'),(1,'DSE'),(1,'testing'),(1,'DSE'),(1,'testing'),(1,'F6'),(1,'DSE');
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
  `answer` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`classroom`,`task_num`,`question_num`,`student`),
  KEY `task_answers_ibfk_2` (`student`),
  CONSTRAINT `task_answers_ibfk_1` FOREIGN KEY (`classroom`, `task_num`, `question_num`) REFERENCES `task_questions` (`classroom`, `task_num`, `question_num`) ON DELETE CASCADE,
  CONSTRAINT `task_answers_ibfk_2` FOREIGN KEY (`student`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_answers`
--

LOCK TABLES `task_answers` WRITE;
/*!40000 ALTER TABLE `task_answers` DISABLE KEYS */;
INSERT INTO `task_answers` VALUES (1,7,1,1,'MC1MC'),(1,7,1,4,'MC2'),(1,7,1,5,'MC2'),(1,7,2,1,'answer'),(1,7,2,4,'qwww'),(1,7,2,5,'qwww123'),(1,7,3,1,'MC2'),(1,7,3,4,'MC23'),(1,7,3,5,'MC34'),(1,9,1,1,'readed'),(1,10,1,4,'women'),(1,10,1,5,'women'),(1,10,1,6,'womens'),(1,10,1,7,'women'),(1,10,1,8,'womens'),(1,10,1,9,'women'),(1,10,1,10,'women'),(1,10,2,4,'offence'),(1,10,2,5,'watching'),(1,10,2,6,'away'),(1,10,2,7,'offence'),(1,10,2,8,'officen'),(1,10,2,9,'offence'),(1,10,2,10,'offence'),(1,10,3,4,'for'),(1,10,3,5,'for'),(1,10,3,6,'to'),(1,10,3,7,'for'),(1,10,3,8,'to'),(1,10,3,9,'for'),(1,10,3,10,'for'),(1,10,4,4,'for'),(1,10,4,5,'on'),(1,10,4,6,'on'),(1,10,4,7,'for'),(1,10,4,8,'for'),(1,10,4,9,'for'),(1,10,4,10,'for'),(1,10,5,4,'so'),(1,10,5,5,'so'),(1,10,5,6,'so'),(1,10,5,7,'such'),(1,10,5,8,'such'),(1,10,5,9,'so'),(1,10,5,10,'such'),(1,10,6,4,'so'),(1,10,6,5,'so'),(1,10,6,6,'such'),(1,10,6,7,'such'),(1,10,6,8,'so'),(1,10,6,9,'so'),(1,10,6,10,'so'),(1,10,7,4,'so'),(1,10,7,5,'so'),(1,10,7,6,'such'),(1,10,7,7,'such'),(1,10,7,8,'so'),(1,10,7,9,'so'),(1,10,7,10,'so'),(1,10,8,4,'of'),(1,10,8,5,'for'),(1,10,8,6,'up'),(1,10,8,7,'of'),(1,10,8,8,'of'),(1,10,8,9,'of'),(1,10,8,10,'of'),(1,10,9,4,'is'),(1,10,9,5,'are'),(1,10,9,6,'are'),(1,10,9,7,'IDK'),(1,10,9,8,'are'),(1,10,9,9,'is'),(1,10,9,10,'are');
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
  `question_type` enum('mc','sq') COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `choice1` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `choice2` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `choice3` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `choice4` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`classroom`,`task_num`,`question_num`),
  CONSTRAINT `task_questions_ibfk_1` FOREIGN KEY (`classroom`, `task_num`) REFERENCES `tasks` (`classroom`, `task_num`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_questions`
--

LOCK TABLES `task_questions` WRITE;
/*!40000 ALTER TABLE `task_questions` DISABLE KEYS */;
INSERT INTO `task_questions` VALUES (1,5,1,'tEst','sq','SQ','answer',NULL,NULL,NULL,NULL),(1,5,2,'test','mc','MC Test\nIt is a Math Q.\n1+1 = ?','2','1','2','3','4'),(1,6,1,'tEst','sq','SQ','answer1',NULL,NULL,NULL,NULL),(1,6,2,'Test','mc','MC 2','123','123','456',NULL,NULL),(1,6,3,'test','mc','MC Test','answer4','answer1','answer2','answer4',NULL),(1,7,1,'MC','mc','MC','MC2','MC1MC','MC2',NULL,NULL),(1,7,2,'MC','sq','SQ1','qwwq212',NULL,NULL,NULL,NULL),(1,7,3,'Test','mc','MC2','MC23','MC2','MC23','MC34',NULL),(1,8,1,'mc','mc','Mc 1','abc','abc','bcd','bdc','cbd'),(1,9,1,'past tense','mc','past tense of read','read','read','readed',NULL,NULL),(1,10,1,'noun','mc','The winners were two ………………………… from the north.','women','women','womens','females',NULL),(1,10,2,'noun','sq','He took …………………………… at this.','offence',NULL,NULL,NULL,NULL),(1,10,3,'phrasal verbs','mc','Are you speaking ……………………… me or against me?','for','to','for','down',NULL),(1,10,4,'phrasal verbs','mc','He is a brilliant actor.\nHis movies speak …………………………… themselves.','for','to','for','on',NULL),(1,10,5,'so vs such','mc','It was ………………………… dark that I couldn\'t see anything.','so','so','such',NULL,NULL),(1,10,6,'so vs such','mc','The watch was ………………………… expensive that I couldn\'t buy it.','so','so','such',NULL,NULL),(1,10,7,'so vs such','mc','I liked him …………………………… much that I helped him.','so','so','such',NULL,NULL),(1,10,8,'phrasal verbs','mc','It was one of the driest years on record – no rain to speak ………………………….','of','up','of','for',NULL),(1,10,9,'noun','sq','The latest news from across the borders ………………………… disquieting.','is',NULL,NULL,NULL,NULL);
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
  `create_by` int(8) unsigned NOT NULL,
  `create_date` datetime NOT NULL,
  `deadline` datetime DEFAULT NULL,
  `force_close` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`classroom`,`task_num`),
  KEY `create_by` (`create_by`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`classroom`) REFERENCES `classrooms` (`classroom_id`) ON DELETE CASCADE,
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`create_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,5,'Task',2,'2020-03-02 21:12:26','2020-03-26 04:00:00',0),(1,6,'Task',2,'2020-03-02 23:47:05','2020-03-24 04:00:00',1),(1,7,'Task7',2,'2020-03-02 23:48:43','2020-03-04 04:00:00',0),(1,8,'New Task',2,'2020-03-13 13:57:38','2020-03-20 04:00:00',0),(1,9,'New Task',2,'2020-03-16 22:41:31','2020-03-17 04:00:00',1),(1,10,'Grammar Exercise',2,'2020-05-03 23:54:59','2020-05-15 04:00:00',0);
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
  `follow_date` datetime DEFAULT NULL,
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
INSERT INTO `user_following` VALUES (1,2,'2020-03-15 01:33:58'),(4,2,'2020-03-09 18:25:38'),(5,2,'2020-03-16 22:36:49');
/*!40000 ALTER TABLE `user_following` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_keys`
--

DROP TABLE IF EXISTS `user_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_keys` (
  `user_id` int(8) unsigned NOT NULL,
  `user_key` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_keys_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_keys`
--

LOCK TABLES `user_keys` WRITE;
/*!40000 ALTER TABLE `user_keys` DISABLE KEYS */;
INSERT INTO `user_keys` VALUES (1,'{\"endpoint\": \"https://fcm.googleapis.com/fcm/send/d43sRm87s9Y:APA91bFJzAwcgEC_1FzIDKB7sdckx2s8slKEQxCP3K_o6BHMIf6Yd7pYF31weszMXxqVQqjI82OuzT8532kUmaYx3KZx04inSZeJGRUPQNoBjx25qln1Cn4ww_0YjBwYt2CbubKvY8Bn\", \"expirationTime\": null, \"keys\": {\"p256dh\": \"BOnc24rCNqOLcitbJ2lqT-A-x1h9MZZxUxJZMTnhHdBO8ptptYInIza-FFFNJ_NycaFdr_-CsbF3eYR02tYFq2E\", \"auth\": \"z5BI5AwHZj1nQMHop3vA8Q\"}}'),(4,'{\"endpoint\": \"https://fcm.googleapis.com/fcm/send/enXS95K3_e4:APA91bHROai4ZAjFagyE5SLp3Y47FupUNpzXkaeBuaRdUmFwoOmgmJVl6W7rtUg9uwOJqYiSpkjU2DtP5EKANhKcWd8nWLt6Qh4NN_VFt2o6GlmruRVhneMVYqS0YzrCKriv7F4OyVpM\", \"expirationTime\": null, \"keys\": {\"p256dh\": \"BEdBV7lMWk7cR5IIc4HWD_U-xuKDf__LqLmhU7f055kvALgmO4RBnB1JkaN32wdpw1sA9xqg7tC-9yR1ue0_75w\", \"auth\": \"rAfsij1yl6dpWKLcqFIwLQ\"}}');
/*!40000 ALTER TABLE `user_keys` ENABLE KEYS */;
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
INSERT INTO `users` VALUES (00000001,'Student01','wong','tai man','peter','m','student','A School',1),(00000002,'teacher1','chan','man man','Mary','f','teacher','B School',1),(00000003,'Admin01','yau','siu fung brian','brian','m','admin','',1),(00000004,'Student02','lee','tai man','ben','m','student','C School',1),(00000005,'Student03','chan','tai man','tommy','m','student','A School',1),(00000006,'Student04','chow','tai man','jimmy','m','student','B School',1),(00000007,'Student05','lee','tai man','tony','m','student','C School',1),(00000008,'Student06','wong','man man','emma','f','student','C School',1),(00000009,'Student07','ng','tai man','john','m','student','D School',1),(00000010,'Student08','cheng','man man','christain','f','student','A School',1),(00000011,'Teacher02','lee','man man','mia','f','teacher','A School',1),(00000012,'Teacher03','ng','tai man','oliver','m','teacher','A School',1),(00000013,'Teacher04','chow','man man','eva','f','teacher','C School',1),(00000014,'Teacher05','wong','tai man','ben','m','teacher','D School',1);
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

-- Dump completed on 2020-05-04  3:22:25
