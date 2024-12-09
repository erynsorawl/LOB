from flask import Blueprint, render_template, redirect, request, flash, jsonify, url_for

views = Blueprint('views', __name__)

@views.route('/')
def home():
    print(url_for('static',filename='styles/styles.css'))
    return render_template('index.html', size=3)

@views.route('/Level1')
def lvl1():
    return render_template("lvl1.html", size=3, nextLevel=2)

@views.route('/Level2')
def lvl2():
    return render_template("lvl2.html", size=3, nextLevel=3)

@views.route('/Level3')
def lvl3():
    return render_template("lvl3.html", size=4, nextLevel=4)

@views.route('/Level4')
def lvl4():
    return render_template("lvl4.html", size=4, nextLevel=5)

@views.route('/Level5')
def lvl5():
    return render_template("lvl5.html", size=5, nextLevel=6)

@views.route('/Level6')
def lvl6():
    return render_template("lvl6.html", size=6, nextLevel=7)

@views.route('/Level7')
def lvl7():
    return render_template("lvl7.html", size=7, nextLevel=8)

@views.route('/Level8')
def lvl8():
    return render_template("lvl8.html", size=8, nextLevel='Final')

@views.route('/LevelFinal')
def lvl9():
    return render_template("lvlFinal.html", size=12, nextLevel='Finish')

@views.route('/LevelFinish')
def lvl10():
    return render_template("lvlFinish.html")

@views.route('/finish')
def finish():
    return render_template("Finish.html", size = 3)

@views.route('/lesson_1')
def lesson1():
    return render_template("lesson1.html", size = 3)

@views.route('/lesson_2')
def lesson2():
    return render_template("lesson2.html", size = 6)


