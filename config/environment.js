const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahSomething',
    db_name: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'testformail1996',
            pass: 'helloWorld37a'
        }
    },
    google_clientID: '198457081810-vts6146cjldkc9u95d5qu4c8j2e4tfds.apps.googleusercontent.com',
    google_clientSecret: 'cz18Hs3dNe15YJygZlWkAuo0',
    google_callbackURL: 'http://localhost:8000/users/auth/google/callback',
    jwt_secret: 'codeial'
};

const production = {
    name: 'production'
};

module.exports = development;