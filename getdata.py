import requests,re
from bs4 import BeautifulSoup
import json

url = "https://www.data.jma.go.jp/developer/xml/feed/regular.xml"
response = requests.get(url)
if response.status_code == 200:
    response.encoding=response.apparent_encoding
    xml = response.text
    soup = BeautifulSoup(xml, 'xml')
    urllist=[]
    for entry in soup.find_all('entry'):
        id = entry.find('id')
        if "VZSA50" in id.text:
            #print("ID:", id.text)
            urllist.append(id.text)
    print(urllist)
    response = requests.get(urllist[0])
    if response.status_code == 200:
        response.encoding=response.apparent_encoding
        xml = response.text
        soup = BeautifulSoup(xml, 'xml')
        out=[]
        for main in soup.find_all('Item'):
            if main.find("Type") is not None:
                t=main.find('Type')
                t=t.text
            if main.find("jmx_eb:Pressure") is not None:
                press=main.find("jmx_eb:Pressure")
                press=press.text
            if t == "等圧線" or t == "温暖前線" or t == '寒冷前線' or t== '停滞前線':
                if main.find("jmx_eb:Line") is not None:
                    linecode = main.find("jmx_eb:Line")
                    linecode = linecode.text
                    # 正規表現を用いて文字列を抽出し、浮動小数点数に変換
                    points = [[float(p[1]), float(p[0])] for p in re.findall(r'\+(\d+\.\d+)\+(\d+\.\d+)', linecode)]
                    #print(result)
                    line= {
                            "properties": {
                                "type":t,
                                "obj":press
                                
                                },
                            "geometry":{
                                "type":"LineString",
                                "coordinates":points
                                }
                            }
                    #print(line)
                    out.append(line)
            else:
                if main.find("jmx_eb:Coordinate") is not None:

                    centerpoint=main.find("jmx_eb:Coordinate")
                    centerpoint=centerpoint.text

                    # 正規表現パターンの定義
                    pattern = r'\+(\d+\.\d+)\+(\d+\.\d+)/'

                    # 正規表現に一致する部分を抽出してリストに変換
                    match = re.search(pattern, centerpoint)
                    result = [float(match.group(1)), float(match.group(2))]

                    direction=main.find("jmx_eb:Direction")
                    direction=direction.text

                    
                    speed=main.find("jmx_eb:Speed")
                    if speed is not None:
                        if speed.text:
                            speed = speed.text
                        else:
                            speed = speed['description']

                    press=main.find("jmx_eb:Pressure")
                    press=press.text

                    point= {
                        "properties": {
                            "type":t,
                            "press":press,
                            'direction':direction,
                            'speed':speed
                            
                            },
                        "geometry":{
                            "type":"Point",
                            "coordinates":result
                            }
                    }
                    #print(point)
                    out.append(point)
        #print(out)
        with open('data/output.json', 'w', encoding='utf-8') as f:
            json.dump(out, f, ensure_ascii=False)




            




