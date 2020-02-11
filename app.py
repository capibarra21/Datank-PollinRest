from flask import Flask,render_template

app = Flask(__name__)

app.config.from_object('config')

#db.init_app('app')
#db.create_all(app=app)

@app.route('/')


def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
