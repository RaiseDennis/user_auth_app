# User Authentication App

This application allows users to register and log in using Node.js and SQLite3. Users can also upload and change their profile picture, which is viewable via the navbar.

## Features
- **User Registration**: Users can create an account with a username and password.
- **User Login**: Registered users can log in to access their profiles.
- **Profile Picture Upload**: Users can upload a profile picture that will be displayed in the navbar. By default, it uses [this image](https://imgur.com/a/mT0z8zV).

## Requirements
- Node.js
- SQLite3

## Setup Instructions
1. Clone this repository:
   ```bash
   git clone https://github.com/your-repo/user_auth_app.git
   cd user_auth_app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   node app.js
   ```

## Directory Structure
- `app.js`: Main application file.
- `database.sqlite`: SQLite database file (created if it doesn't exist).
- `public/`: Static files (CSS, images, etc.).
- `views/`: HTML templates.

## Contributing
Feel free to contribute by opening issues or pull requests.