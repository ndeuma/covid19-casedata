#!/usr/bin/python3.6

from datetime import datetime, date, time, timezone, timedelta
import gzip
import json
import urllib.request

DATE_FORMAT = "%Y-%m-%d"
OUTPUT_DIR = "src/data"

downloadUrl = "https://interactive.zeit.de/cronjobs/2020/corona/germany.json"

zippedTempFileName = "zeit.json.gz"
tempFileName = "zeit.json"

def downloadAndUnzip(jsonUrl):
    print(f"Downloading ZEIT Online data to {zippedTempFileName}")
    # urllib.request.urlretrieve(downloadUrl, zippedTempFileName)
    with gzip.open(zippedTempFileName) as zippedTempFile:
        unzippedBytes = zippedTempFile.read()
        print(f"Downloaded ZEIT Online data to {zippedTempFileName}")
        with open(tempFileName, "w") as tempFile:
            tempFile.write(unzippedBytes.decode("utf-8"))            
            print(f"Unzipped {zippedTempFileName} to {tempFileName}")

def convertCounty(county, metadata, lastUpdate):
    caseData = []
    # Do not append case numbers from currentStats - we might have two entries with the same date
    # which may break some things in the frontend.

    # lastUpdateDate = datetime.strptime(lastUpdate.split("T")[0], "%Y-%m-%d")
    # caseData.append({
    #     "infected_total": county["currentStats"]["count"],
    #     "deaths_total": county["currentStats"]["dead"],
    #     "date_day": lastUpdateDate.strftime(DATE_FORMAT)
    # })
    historicalEndDate = datetime.strptime(metadata["historicalStats"]["end"], DATE_FORMAT)
    length = len(county["historicalStats"]["count"])
    for i in range(0, length):
        caseData.append({
            "infected_total": county["historicalStats"]["count"][length - i - 1] or "0",
            "deaths_total": county["historicalStats"]["dead"][length - i - 1] or "0",
            "date_day": (historicalEndDate - timedelta(days=i)).strftime(DATE_FORMAT)
        })        
    return caseData

def convert(jsonFileName):            
    with open(jsonFileName) as jsonFile:
        zeitJson = json.load(jsonFile)       
        for county in zeitJson["kreise"]["items"]:
            caseData = convertCounty(county, zeitJson["kreise"]["meta"], zeitJson["lastUpdate"])
            caseDataFileName = f"{OUTPUT_DIR}/0{county['ags']}.json"
            with open(caseDataFileName, "w") as caseDataFile:
                caseDataFile.write(json.dumps(caseData))
                print(f"Wrote case data file {caseDataFileName}")

downloadAndUnzip(downloadUrl)
convert(tempFileName)




