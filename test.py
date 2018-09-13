from __future__ import unicode_literals, print_function

from lxml import etree
import plac
import random
from pathlib import Path
import spacy
import sys

if len(sys.argv) < 2:
    print("USAGE : python test.py models/MODEL_DIRECTORY")
    exit(0)

nlp = spacy.load(sys.argv[1])

def find_entities(sentence):
    doc = nlp(sentence)
    entities = [ent.text for ent in doc.ents]
    return entities

if len(sys.argv) == 3:
    res = find_entities(str(sys.argv[2]))
else:
    res = find_entities("Once upon a time there lived a lion in a forest.")
print("RESULT : ", res)
