# Habit Tracker

![01  Homepage](https://github.com/user-attachments/assets/dccf0836-cfba-4ee4-884d-ce669cbab024)


Habit Tracker is a web application designed to help users manage and improve their daily habits. Built using the MERN stack (MongoDB, Express, React, Node.js) and TypeScript, this app provides an intuitive interface for tracking habits, setting goals, and monitoring progress over time.

## Technologies

### Frontend
- **<span style="color: #3182ce;">TypeScript</span>**: for type-safe development on both frontend and backend
- **<span style="color: #3182ce;">React</span>**: for building the user interface
- **<span style="color: #3182ce;">Tailwind CSS</span>**: for styling and layout
- **<span style="color: #3182ce;">React Query</span>**: for managing data fetching and caching
- **<span style="color: #3182ce;">Axios</span>**: for making HTTP requests to the backend
- **<span style="color: #3182ce;">Chart.js</span>**: for visualizing habit progress with graphs

### Backend
- **<span style="color: #38a169;">Node.js</span>**: for the server-side runtime environment
- **<span style="color: #38a169;">Express.js</span>**: for building the web application framework
- **<span style="color: #38a169;">MongoDB</span>**: for data storage and retrieval
- **<span style="color: #38a169;">JWT (JSON Web Tokens)</span>**: for secure user authentication
- **<span style="color: #38a169;">Mongoose</span>**: for MongoDB object modeling and schema creation
- **<span style="color: #38a169;">Redis</span>**: for caching and session management, enhancing performance and scalability

## Features

- **<span style="color: #805ad5;">User Authentication</span>**
- **<span style="color: #805ad5;">Habit Creation and Tracking</span>**
- **<span style="color: #805ad5;">Habit Editing and Deleting</span>**
- **<span style="color: #805ad5;">Habit Dashboard and Progress Visualization</span>**
- **<span style="color: #805ad5;">Advanced Security Solutions</span>**

## Detailed Feature Description

### User Authentication

- **<span style="color: #805ad5;">Registration and Login</span>**: 
  - Users can register and log in securely either with email-based authentication or Google authentication.
  - Passwords are securely hashed.
  - JWT tokens are used to maintain secure sessions.
    
![02  Login](https://github.com/user-attachments/assets/d9ef031e-eb78-4f17-b3df-be10c8bef0a4)
![02 a Login with google](https://github.com/user-attachments/assets/f784d3a3-5ef2-404b-8c72-e9c1724dd036)

### User Dashboard
- **<span style="color: #805ad5;">User Dashboard</span>**:
  - The dashboard provides a comprehensive view of all habits, including completion status and upcoming goals.
  - Users can add, edit, or delete habits directly from the dashboard.
    
![03  Habits list](https://github.com/user-attachments/assets/a684013f-2dbe-4dcc-8722-603603013301)

### Habit Creation and Tracking

- **<span style="color: #805ad5;">Creating New Habits</span>**:
  - Users can set up new habits with specific details such as title, frequency (daily, weekly, monthly), and start date.
  - Each habit has customizable parameters to suit individual tracking needs.
    
  ![04  Add Habit](https://github.com/user-attachments/assets/6dc74370-0344-4fe7-af2f-590e1325b6f1)

- **<span style="color: #805ad5;">Marking Habit Completion</span>**:
  - Users can mark habits as complete on specific dates, which are stored and tracked over time.
  - This data allows for ongoing progress tracking and analytics.
    
![05  Complete Habit](https://github.com/user-attachments/assets/6643e195-2b3c-4751-9c69-c2005bc9495b)

  
### Habit Editing and Deleting

- **<span style="color: #805ad5;">Editing Habits</span>**:
  - Users can edit specific details such as title, frequency (daily, weekly, monthly), and start date.
    
    ![06  Edit habit](https://github.com/user-attachments/assets/e05ce5fb-ed3a-4a35-8d9f-63090ae3c819)

- **<span style="color: #805ad5;">Deleting Habits</span>**:
  - Habits can be deleted by user confirmation.
    
![07  Delete Habit](https://github.com/user-attachments/assets/7d058250-a402-4489-8509-c7e6ba84f2fc)
![07 a Delete Habit](https://github.com/user-attachments/assets/db3c369d-7571-4f93-b0e7-1ef1e1c157a5)


### Habit Dashboard and Progress Visualization

- **<span style="color: #805ad5;">Habit Progress Tracking</span>**:
  - Users can view graphical representations of their progress using bar charts, which show completion rates over time.
  - Customizable time periods allow users to view progress for weekly or monthly intervals.
  - The Habit dashboard displays key metrics, including total habits, completed habits, and any overdue goals.
  - Graphical insights help users stay motivated and on track with their habit goals
  ![08  Habit Dashboard](https://github.com/user-attachments/assets/c387682e-03d7-4a15-a9b9-195eecf7ae7d)

  ![08a  Habit dashboard details](https://github.com/user-attachments/assets/263c1c9d-b3b1-4444-b9a6-ab27553efb9f)
  ![08b  Habit Dashboard details](https://github.com/user-attachments/assets/fa804ddb-8fb2-457c-9c03-2ef18a093905)

### Advanced Security Solutions

The following solutions has been adopted inside the project to enhance data security: 

1. **Secure JWT Authentication**
   - **HTTP-Only Token**: Stored the JWT token in an HTTP-only cookie when issuing it during login. This prevents JavaScript access to the token, mitigating XSS (Cross-Site Scripting) attacks.
   - **Token Expiry**: Set a short expiration time for the JWT (e.g., 1 hour) and implement a refresh token mechanism to maintain session security.
   - **Secure Signature**: Used a secure signature algorithm (HS256 or RS256) and keep secret key private and sufficiently complex.

2. **Data Validation**
   - **Input Sanitization**: Used `validator` library to ensure user inputs (e.g., email, name, password) are well-formatted and free from malicious code.
   - **Server-Side Validation**: Even with frontend validation in place, data are validated on the backend to prevent client-side manipulation.

3. **Protection Against CSRF (Cross-Site Request Forgery)**
   - Implemented a CSRF token system in forms and APIs, especially for sensitive data-modification operations. When using cookies for authentication, a CSRF token is included for each POST/PUT/DELETE request.

4. **Sensitive Data Encryption**
   - Other sensitive data fields (e.g., email) are encrypted in the database.
   - Used AES (Advanced Encryption Standard) algorithm for encryption, decrypting data only when needed.

5. **Rate Limiting and Brute Force Protection**
   - Limited failed login attempts to prevent brute force attacks. Used `express-rate-limit` middleware to set login attempt thresholds.
   - Implemented CAPTCHA after a certain number of failed login attempts.
     
   ![10  captcha](https://github.com/user-attachments/assets/f04a2c8e-60ae-49f2-b832-a57fa2f13127)
   
   ![11  too many attempts](https://github.com/user-attachments/assets/b10cea3b-00f7-4d64-9368-66929f4e113c)


## Getting Started

### Prerequisites
To run this project, you need:
- Node.js and npm installed
- A MongoDB database (local or remote)
- Redis installed for caching

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/habit-tracker.git
2. Install dependencies:
   ```bash
   cd habit-tracker
   npm install
3. Set up environment variables:

    - Create a .env file in the project root.
    ### Environment Variables

    - Set the following environment variables for the project, dividing them between server-side and client-side as shown below.

    #### Server-side Environment Variables

        ```plaintext
        FRONTEND_URL               # URL of the frontend application, for CORS configuration
        SERVER_URL                 # URL of the server backend, used for API requests

        DB_USER                    # Database username
        DB_PWD                     # Database password
        MONGO_URL                  # Full MongoDB connection string

        PORT                       # Port on which the backend server will run

        JWT_SECRET                 # Secret key for signing JWT tokens
        JWT_EXPIRES_IN             # Expiration time for JWT tokens (e.g., "1h" for 1 hour)

        ENCRYPTION_KEY             # Key used for encrypting sensitive data

        RECAPTCHA_SITE_KEY         # reCAPTCHA site key, if using Google reCAPTCHA
        RECAPTCHA_SECRET_KEY       # reCAPTCHA secret key, if using Google reCAPTCHA

        GOOGLE_CLIENT_ID           # Google OAuth Client ID for authentication

        EMAIL_USER                 # Username for the email service
        EMAIL_PASS                 # Password for the email service

        FIREBASE_SERVER_KEY        # Server key for Firebase push notifications
    ```

    #### Client-side Environment Variables

        ```plaintext
        REACT_APP_BACKEND_URL              # Backend server URL for client API requests

        REACT_APP_GOOGLE_CLIENT_ID         # Google OAuth Client ID for the frontend
        REACT_APP_GOOGLE_CLIENT_SECRET     # Google OAuth Client Secret
        REACT_APP_GOOGLE_REDIRECT_URI      # Google OAuth redirect URI

        GENERATE_SOURCEMAP                 # Optional, Webpack fallback setting
        NODE_OPTIONS                       # Optional, Webpack legacy provider setting

        REACT_APP_FIREBASE_API_KEY         # Firebase API key for client-side Firebase services
        REACT_APP_FIREBASE_VAPID_KEY       # Firebase VAPID key for push notifications
    ```
        
4. Run Redis server in a docker container:
    ```bash
        docker exec -it redis-server redis-cli 
    ``` 

5. Start the development server:
    ```bash
        npm run dev
    ```

### Usage
- Access the application in your browser at http://localhost:3000.
- Register a new account or log in with an existing account.
- Create and manage your habits from the dashboard.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License
This project is licensed under the MIT License.
