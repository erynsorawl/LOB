from flask import Blueprint, render_template, redirect, request, flash, jsonify, url_for

views = Blueprint('views', __name__)

@views.route('/')
def home():
    print(url_for('static',filename='styles/styles.css'))
    return render_template('index.html')

@views.route('/test')
def test():
    return render_template("NxN.html", size=6)

@views.route('/Level1')
def lvl1():
    return render_template("lvl1.html", size=3)

@views.route('/Level2')
def lvl2():
    return render_template("lvl2.html", size=3)

@views.route('/Level3')
def lvl3():
    return render_template("lvl3.html", size=4)

@views.route('/Level4')
def lvl4():
    return render_template("lvl4.html", size=5)

@views.route('/Level5')
def lvl5():
    return render_template("lvl5.html", size=5)

@views.route('/Level6')
def lvl6():
    return render_template("lvl6.html", size=6)

@views.route('/Level7')
def lvl7():
    return render_template("lvl7.html", size=6)

@views.route('/Level8')
def lvl8():
    return render_template("lvl8.html", size=6)

@views.route('/Level9')
def lvl9():
    return render_template("lvl9.html", size=6)

@views.route('/Level10')
def lvl10():
    return render_template("lvl10.html", size=6)

@views.route('/Levelbonus')
def lvlbonus():
    return render_template("bonus.html", size=6)
