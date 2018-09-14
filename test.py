from __future__ import unicode_literals, print_function

from lxml import etree
import plac
import random
from pathlib import Path
import os.path
import spacy
import sys

if len(sys.argv) < 3:
    print("USAGE : python test.py models/MODEL_DIRECTORY {file / sentence}")
    exit(0)

nlp = spacy.load(sys.argv[1])
nlp_splitter = spacy.load('en_core_web_sm')

def find_entities(raw_txt):
    entities = {}
    text = nlp_splitter(raw_txt.strip())
    for sent in text.sents:
        doc = nlp(sent.text)
        entities[sent] = [[ent.text, ent.label_] for ent in doc.ents]
        # print(doc.ents[0].start_char, doc.ents[0].end_char, doc.ents[0].label_)
        # print(sent, doc.ents)
    # entities =
    return entities

if len(sys.argv) == 3:
    if os.path.isfile(str(sys.argv[2])):
        res = find_entities(str(open(sys.argv[2], "r").read()))
    else:
        res = find_entities(str(sys.argv[2]))

print("RESULT : ")
for ent in res:
    sentence = ent
    data = res[ent]
    _subject = [tok[0] for tok in data if tok[1] == "SU_SUBJECT"]
    _verb = [tok[0] for tok in data if tok[1] == "SU_VERB"]
    _object = [tok[0] for tok in data if tok[1] == "SU_OBJECT"]

    print("{} :\n     SUBJECT : {}\n     VERB : {}\n     OBJECT : {}\n==================\n".format(sentence, _subject, _verb, _object))
