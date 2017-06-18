from django.shortcuts import render
from django.http import HttpResponse
import json
from forms import InventoryForm
import predict
from .models import Inventory
from django.conf import settings
from django.core import serializers
from .models import Cocktails
import convertIngredients
from itertools import chain
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import SyllDateFinder








# Create your views here.

def postimage(request):

    if request.method == 'POST':
        form = InventoryForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                data = predict.run(request.FILES['image'])
            except:
                pass
            instance = Inventory(image=request.FILES['image'], prediction=data['description'])
            instance.save()
            # image = instance.image




        # data = {'data': 'otherdata'}
        # data = request.FILES
        # Inventory.objects.create(image=data)
        # Inventory.save()


        # data = predict.run(data)
        return HttpResponse(
            json.dumps(data),
            content_type='application/json')
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )

def make_cond(name, value):
    cond = json.dumps({name:value})[1:-1] # remove '{' and '}'
    return ' ' + cond # avoid '\"'

def getcocktails(request):
    inventory = Inventory.objects.all()
    cList = set()

    cs = Cocktails.objects.all()
    for i in inventory:
        print i.prediction
        if cs.filter(ingredients__icontains=i.prediction) == []:
            continue
        else:
            for ctail in cs.filter(ingredients__icontains=i.prediction):
		cList.add(ctail)

    cs = list(chain(cList))
    for c in cs:
        print c.name
    data = serializers.serialize("json", cs)
    return HttpResponse(
        json.dumps(data),
        content_type='application/json')

# API for syllabus


class GetUpcoming(APIView):

    # send data back as JSON

    def get(self, request):
        print "get called"
        data = {"data": "theData"}
        return Response(data)

    # to access data:       request.data[key]

    def post(self, request):
        print "Post called"
        txt = request.data['text']
        txt = SyllDateFinder.stringSplitter(txt)
        response = {"line": txt[0], 'lineNum': txt[1] }
        return Response(response)
