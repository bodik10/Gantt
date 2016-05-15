# Gantt.js
Function that draws simple Gantt charts (https://en.wikipedia.org/wiki/Gantt_chart) based on custom data

# Usage
`Gantt(data, "dest", 1000, 250);` 

 - data is an array of JS objects (look at `data.json` to see a proper format)
 - "dest" is an ID of div element where chart should be placed
 - 1000 is a total width of chart (div element wich ID was given in previous argument)
 - 250 is a width of header column (200 is default)

For testing run: `python -m http.server` and go to `http://localhost:8000`

# Sample
![Image of Yaktocat](https://github.com/bodik10/Gantt/blob/master/sample.JPG)
