"use strict"

//set as desired.
var num_of_rows = 5;
var num_of_cols = 7;

//get the game area (table).
var table = document.getElementById("play_area");


//Insert rows and cells into the table.
for(var i = 0; i<num_of_rows; i++){
    var table_row = document.createElement("tr");

    for(var j = 0; j<num_of_cols; j++){
        var table_cell = document.createElement("td");
        table_cell.innerHTML = i + "," + j;
        table_row.appendChild(table_cell);
    }
    table.appendChild(table_row);
}