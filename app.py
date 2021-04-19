from boggle import Boggle
from flask import Flask, render_template

boggle_game = Boggle()

app = Flask(__name__)
