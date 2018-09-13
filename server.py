from flask import Flask, request, render_template
import json
import sys
import time

from train import split_sentences, train_model

sys.path.insert(0, './utils')

TEMPLATES_AUTO_RELOAD = True

app = Flask(__name__)

@app.route('/', methods=['GET'])
def get_render_gui():
    return render_template('gui.html')



@app.route('/split_sents', methods=['POST'])
def split_sents():
    text = request.form.get("text")
    sentences = split_sentences(text)
    return json.dumps(sentences)


@app.route('/send_ner', methods=['POST'])
def send_ner():
    data = request.form.get("ner")
    model_name = request.form.get("model_name")
    jsonData = json.loads(data)

    TRAIN_DATA = []

    for key in jsonData:
        sentence = key
        tuple = (sentence,
            {'entities': [(x[0], x[1], x[2]) for x in jsonData[key]["entities"]]}
        )
        TRAIN_DATA.append(tuple)
    print(TRAIN_DATA)
    train_model(output_dir="./models/"+model_name, training_data=TRAIN_DATA)

    return "OK"




app.jinja_env.auto_reload = True
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.run(host= '0.0.0.0')
