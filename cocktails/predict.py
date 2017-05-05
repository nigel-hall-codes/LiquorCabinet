from clarifai.rest import ClarifaiApp
from clarifai.rest import Image as ClImage
import os
import time
from django.conf import settings

ingredientTypes = {
    'Henny': 'Cogniac',
    'Goose': 'Vodka',
    'Lime': 'Garnish',
    'Ciroc': 'Vodka',
    'Jameson': 'Whiskey',
    'DryVermouth': 'Dry Vermouth',
    'AngosturaBitters': 'Angostura Bitters'

}





def run(image):
    app = ClarifaiApp("KiPgquABTE-kvueyDk2GoUrAlbJWGwCXlfrQ45pN", "hkAMvUIGzHH8hZNpPy1fyeC4sca2iS9SgTAUnwLe")


    # get the general model

    model = app.models.get("alcohol")
    image = ClImage(file_obj=image)
    pred = model.predict([image])
    pred = pred['outputs'][0]['data']['concepts'][0]
    pred['description'] = ingredientTypes[pred['name']]
    # print pred
    return pred




