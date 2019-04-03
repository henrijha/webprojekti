from bs4 import BeautifulSoup
import urllib.request
import re
import json
import requests
page = 'https://frisbeegolfradat.fi/radat'
page = urllib.request.urlopen(page)
soup = BeautifulSoup(page, 'html.parser')

kaikki = []
for a in soup.find_all('a', href=True):
    if a.text:
        kaikki.append(a['href'])

nimet = []
for a in soup.find_all(attrs={'class': 'rataCol'}):
    nimet.append(a.getText())

linkit = []
for i in kaikki:
    if('/rata/' in i):
        linkit.append(i)

nimet.pop(0)
#print(linkit)
print("==========================================================")
#print(nimet)
n = 1
valitut = []
for link in linkit:
    print(n, link)
    if (n > 1000):
        break
    kaikki2 = []
    page = link
    page = urllib.request.urlopen(page)
    soup = BeautifulSoup(page, 'html.parser')
    for a in soup.find_all('a', href=True):
        kaikki2.append(a['href'])

    for i in kaikki2:
        if('maps.google' in i):
            valitut.append(i)
    n = n+1


print(valitut)

latitudes = []
longitudes = []
y = 1
for maps_linkki in valitut:
    if (1000 < y):
        break
    print(y, maps_linkki)
    split_str = maps_linkki.split('=')
    address = split_str[1]
    coordinates = []
    if "." not in address:
        response = requests.get("https://nominatim.openstreetmap.org/search/" + address + "?format=json&addressdetails=1&limit=1&polygon_svg=1")
        data = response.json()
        coordinates.append(data[0]['lat'])
        coordinates.append(data[0]['lon'])
    else:
        coordinates = address.split('.')
    lat = coordinates[0]
    lon = coordinates[1]
    latitudes.append(lat)
    longitudes.append(lon)
    y = y + 1

print(latitudes)
print("=======")
print(longitudes)

data = {}  
data['markers'] = []  
for x in range(0, len(nimet)):
    data['markers'].append({  
        'name': nimet[x],
        'website': linkit[x],
        'latitude': latitudes[x],
        'longitude': longitudes[x]
    })


with open('data.txt', 'w') as outfile:  
    json.dump(data, outfile)
