from flask import Flask, render_template, redirect, url_for
from flask_assets import Environment, Bundle
from views import views

app = app = Flask(__name__)
assets = Environment(app)
app.config['SECRET_KEY'] = 'aernstoa'

js = Bundle('LOB.js', 'base.js')
assets.register('js_all', js)
app.register_blueprint(views, url_prefix='/')

assets.init_app(app)
app.run(debug=True)

