/*
 * gantt.js
 *
 * Requires: None (pure JS)
 *
 * function that draws simple Gantt charts (https://en.wikipedia.org/wiki/Gantt_chart) based on custom data
 */ 

function Gantt(data, destid, width, captionWidth = 200){
    var dest = document.getElementById(destid);
    var minDate = new Date(3600*1000*24*365*100);
    var maxDate = new Date(0);
    var rows = 0, 
        currentRow = 0,
        days = 0;
    var cellWidth;
    
    var colors = ["red","green","blue","purple","orange","aqua","yellow","pink","brown"];
    
    var divs = [];
    
    function init(){
        dest.className = "gantt_box";
        dest.style.width = width + "px";
    }
    
    function findEdgeDates(data){
        // recursively find min and max date 
        for (var i = 0; i < data.length; i++){
            var start = new Date(data[i].start);
            var finish = new Date(data[i].finish);
            minDate = (start < minDate) ? start : minDate;
            maxDate = (finish > maxDate) ? finish : maxDate;
            if (data[i].subprocesses.length > 0)
                findEdgeDates(data[i].subprocesses);
                
            rows++;
        }
        
        days = Math.floor( (maxDate - minDate)/1000/3600/24 ) + 1;
        
        cellWidth = (width - captionWidth) / (days + 1) - 1; // 1 extra day for 1 cell at the end, -1px for border
    }
    
    function childShowHide(event){
        var id = this.getAttribute("data-id");
        var isShow = this.innerText == "+";
        
        // find all divs elements which attribute 'data-parent-id' contains id
        var nested = dest.querySelectorAll("div[data-parent-id*='" + id + "']");
        
        // hide/show subprocesses
        for (var i=0; i<nested.length; i++){
            if (isShow){
                var spanPlus = nested[i].querySelector("span.gantt_plus[data-id]");
                if (spanPlus)
                    spanPlus.innerText = "-";
                nested[i].style.display = "block";
            } else {
                nested[i].style.display = "none";
            }
        }
        this.innerText = (isShow) ? "-" : "+";
    }
    
    function createDivs(data, parrent_id = "", padding = 0){
        
        
        for (var i = 0; i < data.length; i++){
        
            var id = Math.random().toString(36).substring(7,14); // generate random 7 char length string
            
            currentRow++;
            
            var container = document.createElement("div");
            
            container.setAttribute("data-id", id);
            container.setAttribute("data-parent-id", parrent_id);
        
            var divRow = document.createElement("div");
            divRow.className = "gantt_row";
            
            // draw headers
            var divHeader = document.createElement("div");
            divHeader.className = "gantt_header";
            divHeader.style.width = captionWidth + "px";
            
            var spanPlus = document.createElement("span");
            spanPlus.innerHTML = "&nbsp;";
            spanPlus.className = "gantt_plus";
            if (data[i].subprocesses.length > 0){
                spanPlus.setAttribute("data-id", id);
                spanPlus.innerText = "-";
                spanPlus.style.cursor = "pointer";
                
                // handle click event on +/- sign
                spanPlus.addEventListener("click", childShowHide);
            }
            divHeader.appendChild(spanPlus);
            
            var spanName = document.createElement("span");
            spanName.innerText = data[i].name;
            if (padding)
                spanName.style.paddingLeft = padding + "px";
            divHeader.appendChild(spanName);
            divRow.appendChild(divHeader);
            
            // draw grid
            for (var j = 0; j < days + 1; j++){
                var divCell = document.createElement("div");
                divCell.className = "gantt_grid";
                divCell.style.width = cellWidth + "px";
                divCell.innerHTML = "&nbsp;";
                divRow.appendChild(divCell);
            }
            
            // draw bars
            var start = new Date(data[i].start);
            var finish = new Date(data[i].finish);
            
            // caption width + 1px border + (counts of days before start) * cell width (with 1px for border)
            var barLeft = captionWidth + 1 + (start - minDate)/1000/3600/24 * (cellWidth + 1);
            
            // length of process in days + 1 day (because process that starts and ends on 18 March takes 1 day but not 0) * cell width (with 1px for border) - 1 px (for bar fills into cell body and doesn't overlap cell right border)
            var barWidth = ((finish - start)/1000/3600/24 + 1) * (cellWidth + 1) - 1;
            
            var divBar = document.createElement("div");
            divBar.className = "gantt_bar";
            divBar.style.left = barLeft + "px";
            divBar.style.width = barWidth + "px";
            divBar.style.backgroundColor = colors[currentRow % colors.length];
            divRow.appendChild(divBar);
            
            container.appendChild(divRow);
            dest.appendChild(container);
            
            divBar.style.height = (divBar.clientHeight) - 1 + "px"; // decrease height by 1px for prevent overlapping the bottom border line
                                                                    // it should be done AFTER appending divBar, so clientHeight will store actual height of element
            
            if (data[i].subprocesses.length > 0){
                // make sub sections
                createDivs(data[i].subprocesses, parrent_id + " " + id, padding + 15);
            }
        }
        
        // draw legend
        if (!parrent_id){ 
            divRow = document.createElement("div");
            divRow.className = "gantt_row";
            var divSpace = document.createElement("div");
            divSpace.className = "gantt_legend";
            divSpace.innerHTML = "&nbsp;";
            divSpace.style.width = (captionWidth - (cellWidth/2)) + "px";
            divRow.appendChild(divSpace);
            
            var startDate = new Date(minDate);
            
            for (var j = 0; j <= days; j++){
                var divLegend = document.createElement("div");
                divLegend.className = "gantt_legend";
                divLegend.style.width = (cellWidth + 1) + "px";
                divLegend.innerHTML = startDate.getDate() + "/" + (startDate.getMonth() + 1);
                divRow.appendChild(divLegend);
                
                startDate.setTime( startDate.getTime() + 1000*60*60*24 ); // increase by 1 day
            }
            dest.appendChild(divRow);
        }
    }
    
    init();
    findEdgeDates(data);
    createDivs(data);
    
    // console.log(minDate, maxDate, rows, days);
}