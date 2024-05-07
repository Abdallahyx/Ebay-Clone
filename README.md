# Ecomus Website

This project is an e-commerce website developed using React for the frontend and Django REST Framework for the backend. It provides a platform for buyers and sellers to interact, with alot of features.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js and npm: You will need Node.js and npm installed on your local development machine. You can download Node.js [here](https://nodejs.org/en/download/) and npm is included in the installation.
- Python: Django is a Python-based framework, so you will need Python installed on your local development machine. You can download Python [here](https://www.python.org/downloads/).

### Backend Setup

1. Clone the repository to your local machine:

```bash
git clone https://github.com/Abdallahyx/Parallel-Project.git
```


2. Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

3. Run the Django migrations to set up your database:

```bash
python manage.py makemigrations
python manage.py migrate
```

4. Start the Django development server:

```bash
python manage.py runserver
```

The Django server will start running at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd your-repo-name/frontend
```

2. Install the required Node.js dependencies:

```bash
npm install
npm install ldrs
```

3. Start the React development server:

```bash
npm start
```

The React server will start running at `http://localhost:3000`.

Now, you should be able to see the application running in your web browser.

## Built With

- [React](https://reactjs.org/) - The web framework used for the frontend
- [Django REST Framework](https://www.django-rest-framework.org/) - The framework used for the backend API

