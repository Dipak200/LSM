require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Course, Lesson, Quiz, Question } = require('../src/models');
const config = require('../src/config');

const seedData = async () => {
  try {
    await mongoose.connect(config.DATABASE_URL);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@lms.com',
      password: 'admin123',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin'
    });

    // Create regular user
    const regularUser = await User.create({
      email: 'user@lms.com',
      password: 'user123',
      first_name: 'John',
      last_name: 'Doe',
      role: 'user'
    });

    console.log('Created users');

    // Create sample courses
    const course1 = await Course.create({
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming language including variables, functions, and objects.',
      instructor_name: 'John Smith',
      price: 99.99,
      created_by: adminUser._id
    });

    const course2 = await Course.create({
      title: 'React Development',
      description: 'Master React.js framework for building modern web applications.',
      instructor_name: 'Jane Wilson',
      price: 149.99,
      created_by: adminUser._id
    });

    console.log('Created courses');

    // Create lessons for course1
    const lesson1 = await Lesson.create({
      course_id: course1._id,
      title: 'Introduction to JavaScript',
      video_url: 'https://www.youtube.com/watch?v=sample1',
      resource_links: ['https://developer.mozilla.org/en-US/docs/Web/JavaScript'],
      order_index: 1
    });

    const lesson2 = await Lesson.create({
      course_id: course1._id,
      title: 'Variables and Data Types',
      video_url: 'https://www.youtube.com/watch?v=sample2',
      resource_links: ['https://javascript.info/variables'],
      order_index: 2
    });

    const lesson3 = await Lesson.create({
      course_id: course1._id,
      title: 'Functions in JavaScript',
      video_url: 'https://www.youtube.com/watch?v=sample3',
      resource_links: ['https://javascript.info/function-basics'],
      order_index: 3
    });

    // Create lessons for course2
    const lesson4 = await Lesson.create({
      course_id: course2._id,
      title: 'Getting Started with React',
      video_url: 'https://www.youtube.com/watch?v=sample4',
      resource_links: ['https://reactjs.org/docs/getting-started.html'],
      order_index: 1
    });

    const lesson5 = await Lesson.create({
      course_id: course2._id,
      title: 'JSX and Components',
      video_url: 'https://www.youtube.com/watch?v=sample5',
      resource_links: ['https://reactjs.org/docs/introducing-jsx.html'],
      order_index: 2
    });

    console.log('Created lessons');

    // Create quiz for course1
    const quiz1 = await Quiz.create({
      course_id: course1._id,
      title: 'JavaScript Basics Quiz',
      description: 'Test your knowledge of JavaScript fundamentals',
      order_index: 1
    });

    // Create questions for quiz1
    await Question.create({
      quiz_id: quiz1._id,
      question_text: 'What is the correct way to declare a variable in JavaScript?',
      options: ['var name = "John";', 'variable name = "John";', 'v name = "John";', 'declare name = "John";'],
      correct_option: 0,
      order_index: 1
    });

    await Question.create({
      quiz_id: quiz1._id,
      question_text: 'Which of the following is a JavaScript data type?',
      options: ['String', 'Number', 'Boolean', 'All of the above'],
      correct_option: 3,
      order_index: 2
    });

    await Question.create({
      quiz_id: quiz1._id,
      question_text: 'How do you create a function in JavaScript?',
      options: ['function myFunction() {}', 'create myFunction() {}', 'def myFunction() {}', 'function = myFunction() {}'],
      correct_option: 0,
      order_index: 3
    });

    // Create quiz for course2
    const quiz2 = await Quiz.create({
      course_id: course2._id,
      title: 'React Basics Quiz',
      description: 'Test your knowledge of React fundamentals',
      order_index: 1
    });

    // Create questions for quiz2
    await Question.create({
      quiz_id: quiz2._id,
      question_text: 'What is JSX?',
      options: ['A JavaScript extension', 'A CSS framework', 'A database', 'A server'],
      correct_option: 0,
      order_index: 1
    });

    await Question.create({
      quiz_id: quiz2._id,
      question_text: 'What is a React component?',
      options: ['A function or class', 'A CSS file', 'A database table', 'A server endpoint'],
      correct_option: 0,
      order_index: 2
    });

    console.log('Created quizzes and questions');

    console.log('\n=== SEED DATA COMPLETED ===');
    console.log('Admin User: admin@lms.com / admin123');
    console.log('Regular User: user@lms.com / user123');
    console.log('Created 2 courses with lessons and quizzes');
    console.log('==============================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();