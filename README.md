 LMS Backend API Documentation

1. Clone the repository
2. Install dependencies: npm 
3. Set up environment variables (create .env file):
    NODE_ENV=development
    PORT=3000
    DATABASE_URL=mongodb://localhost:27017/lms
    JWT_SECRET=vkuyvug87tigmnkjbhjbkjn
    JWT_EXPIRE=7d
    RATE_LIMIT_WINDOW=15
    RATE_LIMIT_MAX=100

4. Create Dummy data: npm run seed
5. start server: npm run dev

Base URL: http://localhost:3000/api

Roles
User: Can view courses, enroll, complete lessons, attempt quizzes
Admin: Can create, update, and delete courses, lessons, and quizzes

Authentication Endpoints
    Register User
    http
    POST /api/auth/register
    Input:
    json
    {
    "email": "user@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user"
    }
    Field Details:
    email: Valid email address (required)
    password: Minimum 6 characters (required)
    first_name: 2-50 characters (required)
    last_name: 2-50 characters (required)
    role: Either "user" or "admin" (optional, defaults to "user")

    Login User
    http
    POST /api/auth/login
    Input:
    json
    {
    "email": "user@example.com",
    "password": "password123"
    }
    Field Details:
    email: Valid email address (required)
    password: User's password (required)

    Get User Profile
    http
    GET /api/auth/profile
    Authentication: Bearer Token Required
    Input: None

Course Endpoints
    Get All Courses
    GET /api/courses
    Query Parameters (All Optional):
    page: Page number for pagination (optional, default: 1, min: 1)
    limit: Number of items per page (optional, default: 10, min: 1, max: 50)
    search: Search query for course titles (optional, max: 100 characters)
    sort: Sort order (optional, default: "-createdAt")
    Options: createdAt, -createdAt, title, -title, price, -price
    Example:
    GET /api/courses?page=1&limit=10&search=javascript&sort=-createdAt

    Get Course by ID
    GET /api/courses/:id
    Path Parameters:
    id: Course ID (required)

    Create Course
    POST /api/courses
    Authentication: Bearer Token + Admin Role Required
    Input:
    json
    {
    "title": "JavaScript Fundamentals",
    "description": "Learn JavaScript from basics to advanced concepts",
    "instructor_name": "John Instructor",
    "price": 99.99
    }
    Field Details:
    title: Course title, 3-200 characters (required)
    description: Course description, 10-2000 characters (required)
    instructor_name: Instructor's name, 2-100 characters (required)
    price: Course price, 0-10000 (required)

    Update Course
    PUT /api/courses/:id
    Authentication: Bearer Token + Admin Role Required
    Path Parameters:
    id: Course ID (required)
    Input (All fields optional):
    json
    {
    "title": "Updated JavaScript Course",
    "description": "Updated course description",
    "instructor_name": "Updated Instructor",
    "price": 129.99
    }
    Field Details:
    title: Course title, 3-200 characters (optional)
    description: Course description, 10-2000 characters (optional)
    instructor_name: Instructor's name, 2-100 characters (optional)
    price: Course price, 0-10000 (optional)

    Delete Course
    DELETE /api/courses/:id
    Authentication: Bearer Token + Admin Role Required
    Path Parameters:
    id: Course ID (required)
    Input: None

    Enroll in Course
    POST /api/courses/:id/enroll
    Authentication: Bearer Token Required
    Path Parameters:
    id: Course ID (required)
    Input: None

Lesson Endpoints
    Get Lesson by ID
    GET /api/lessons/:id
    Authentication: Bearer Token Required
    Path Parameters:
    id: Lesson ID (required)
    Input: None

    Create Lesson
    POST /api/lessons/course/:courseId
    Authentication: Bearer Token + Admin Role Required
    Path Parameters:
    courseId: Course ID (required)
    Input:
    json
    {
    "title": "Introduction to Variables",
    "video_url": "https://example.com/video.mp4",
    "resource_links": ["https://example.com/resource1", "https://example.com/resource2"],
    "order_index": 1
    }
    Field Details:
    title: Lesson title, 3-200 characters (required)
    video_url: Valid video URL (required)
    resource_links: Array of valid URLs (optional, defaults to empty array)
    order_index: Lesson order, minimum 1 (required)

    Update Lesson
    PUT /api/lessons/:id
    Authentication: Bearer Token + Admin Role Required
    Path Parameters:
    id: Lesson ID (required)
    Input (All fields optional):
    json
    {
    "title": "Updated Lesson Title",
    "video_url": "https://example.com/updated-video.mp4",
    "resource_links": ["https://example.com/updated-resource"],
    "order_index": 2
    }
    Field Details:
    title: Lesson title, 3-200 characters (optional)
    video_url: Valid video URL (optional)
    resource_links: Array of valid URLs (optional)
    order_index: Lesson order, minimum 1 (optional)

    Delete Lesson
    DELETE /api/lessons/:id
    Authentication: Bearer Token + Admin Role Required
    Path Parameters:
    id: Lesson ID (required)
    Input: None

    Complete Lesson
    PUT /api/lessons/:id/complete
    Authentication: Bearer Token Required
    Path Parameters:
    id: Lesson ID (required)
    Input: None

Quiz Endpoints
    Get Quiz by ID
    GET /api/quizzes/:id
    Authentication: Bearer Token Required
    Path Parameters:
    id: Quiz ID (required)
    Input: None

    Create Quiz
    POST /api/quizzes/course/:courseId
    Authentication: Bearer Token + Admin Role Required
    Path Parameters:
    courseId: Course ID (required)
    Input:
    json
    {
    "title": "JavaScript Basics Quiz",
    "description": "Test your knowledge of JavaScript fundamentals",
    "order_index": 1
    }
    Field Details:
    title: Quiz title, 3-200 characters (required)
    description: Quiz description, max 1000 characters (optional)
    order_index: Quiz order, minimum 1 (required)

    Create Question
    POST /api/quizzes/:quizId/questions
    Authentication: Bearer Token + Admin Role Required
    Path Parameters:
    quizId: Quiz ID (required)
    Input:
    json
    {
    "question_text": "What is the correct way to declare a variable in JavaScript?",
    "options": ["var x = 5;", "variable x = 5;", "declare x = 5;", "x := 5;"],
    "correct_option": 0,
    "order_index": 1
    }
    Field Details:
    question_text: Question text, 5-1000 characters (required)
    options: Array of 2-6 options, each 1-200 characters (required)
    correct_option: Index of correct option (0-based) (required)
    order_index: Question order, minimum 1 (required)

    Attempt Quiz
    POST /api/quizzes/:id/attempt
    Authentication: Bearer Token Required
    Path Parameters:
    id: Quiz ID (required)
    Input:
    json
    {
    "answers": [
        {
        "question_id": "question_id_1",
        "selected_option": 0
        },
        {
        "question_id": "question_id_2",
        "selected_option": 2
        }
    ]
    }
    Field Details:
    answers: Array of answer objects (required, minimum 1)
    question_id: Question ID (required)
    selected_option: Selected option index (0-based) (required)

    Get Quiz Attempts
    GET /api/quizzes/:id/attempts
    Authentication: Bearer Token Required
    Path Parameters:
    id: Quiz ID (required)
    Input: None