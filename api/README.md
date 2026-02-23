# <h1 style='text-align:center;color:aqua; text-transform:capitalize; background-color:black; padding:10px 5px;'> AntechLearn Api </h1>
----

# <h3 style='font-size:18px;color:aqua;'>About AntechLearn Api</h3>
----

<p>
AntechLearn Api is a comprehensive backend service designed to power the
<a href="https://education-ecru.vercel.app">AntechLearn</a> educational platform. It provides secure authentication,
user management, course handling, and administrative controls through
well-structured RESTful endpoints.
</p>

<p>
The API is built to ensure scalability, security, and performance,
supporting both student and admin functionalities. It handles features
such as account registration, login authentication using JWT tokens,
password reset workflows, data management, and protected routes for
authorized access.
</p>

<p>
With a focus on reliability and clean architecture, AntechLearn Api
serves as the core engine that connects the frontend application to
the database, ensuring seamless data flow and a smooth user experience.
</p>

----
# <h3 style='font-size:18px;color:aqua;'>Setup And Running the Application</h3>

<p>Follow the steps below to set up and run the application locally:</p>

<ol>
  <li>
    <strong>Clone the Repository</strong><br>
    Clone the project to your local machine:
    <pre><code>git clone &lt;repository-url&gt;
cd &lt;project-folder&gt;</code></pre>
  </li>

  <li>
    <strong>Create a Virtual Environment (Recommended)</strong><br>
    <pre><code>python -m venv venv
source venv/bin/activate   # On Linux/Mac
venv\Scripts\activate      # On Windows</code></pre>
  </li>

  <li>
    <strong>Create a .env File</strong><br>
    Copy the provided <code>.env.example</code> file and rename it to <code>.env</code>:
    <pre><code>cp .env.example .env</code></pre>
    Fill in all required environment variables inside the <code>.env</code> file.
  </li>

  <li>
    <strong>Configure Email App Password</strong><br>
    Generate an App Password from your email provider (e.g., Gmail) for secure email forwarding.
    Add the generated app password and email credentials to the <code>.env</code> file.
  </li>

  <li>
    <strong>Install Dependencies</strong><br>
    Install all required packages:
    <pre><code>pip install -r requirements.txt</code></pre>
  </li>

  <li>
    <strong>Run the Application</strong><br>
    Start the server by running the main file:
    <pre><code>python main.py</code></pre>
  </li>
</ol>

<p>
Once the server is running, the application will be accessible at the configured host and port.
</p>

----

by ♥ BraveraTech ♥. All rights reserved