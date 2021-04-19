from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    def setUp(self):
        """Do before each testing method"""

        self.client = app.test_client()
        app.config["TESTING"] = True

    # def tearDown(self):
        """Available testing method if there was a need to complete a task after every testing method"""


    def test_index(self):
        """Verify that information is being collected in the session and that the HTML is being shown"""

        with self.client:

            res = self.client.get('/')
            html = res.get_data(as_text=True)

            self.assertIn('board', session)
            self.assertIsNone(session.get('nplays'))
            self.assertEqual(res.status_code, 200)
            self.assertIn('<p>High Score:', html)
            self.assertIn('Seconds Left:', html)

    def test_check_word(self):
        """Test if word is valid by modifying the board in the session"""

        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["C", "A", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"]]

        res = self.client.get('/check-word?word=cat')
        html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)            
        self.assertEqual(res.json['result'], "ok")


    def test_invalid_word(self):
        """Test if word is in the dictionary"""

        self.client.get('/')
        res = self.client.get('/check-word?word=impossible')
        self.assertEqual(res.json['result'], "not-on-board")

    
    def non_english_word(self):
        """Test if word is on the board"""

        self.client.get('/')
        res = self.client.get('/check-word?word=dhagkljhs;gk')
        self.assertEqual(res.json['result'], "not-word")