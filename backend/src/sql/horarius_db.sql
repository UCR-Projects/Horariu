CREATE TABLE users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE user_courses (
    user_id CHAR(36) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    day VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    course_code VARCHAR(20),
    classroom VARCHAR(50),
    building VARCHAR(50),
    PRIMARY KEY (user_id, course_name, day, start_time, end_time),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);