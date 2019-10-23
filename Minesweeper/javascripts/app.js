"use strict"

//set as desired.
var num_of_rows = 5;
var num_of_cols = 7;

//get the game area (table).
var table = document.getElementById("play_area");

//call func.
initializePlayArea(table, num_of_cols, num_of_rows);


//Insert rows and cells into the table.
function initializePlayArea(table, num_of_cols = 10, num_of_rows = 20){
    for(var i = 0; i<num_of_rows; i++){
        var table_row = document.createElement("tr");

        for(var j = 0; j<num_of_cols; j++){
            var table_cell = document.createElement("td");
            table_cell.innerHTML = i + "," + j;
            table_cell.setAttribute("id" , i + "," + j);
            table_row.appendChild(table_cell);
        }
        table.appendChild(table_row);
    }
}

document.getElementById("0,0").addEventListener("click", testFunc);

function testFunc(){
    alert("TEST!");
}