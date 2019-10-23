'use strict'

//set as desired.
var num_of_rows = 5;
var num_of_cols = 7;

//get the game area (table).
var table = document.getElementById('play_area');
initializePlayArea(table, num_of_cols, num_of_rows);


function initializePlayArea(table, num_of_cols = 10, num_of_rows = 20){

    //adding rows and columns.
    for(var i = 0; i<num_of_rows; i++){
        var table_row = document.createElement('tr');

        for(var j = 0; j<num_of_cols; j++){
            var table_cell = document.createElement('td');
            table_cell.innerHTML = i + ',' + j;
            table_cell.classList.add('table-cell');
            table_cell.setAttribute('id' , i + ',' + j);
            table_row.appendChild(table_cell);
        }
        table.appendChild(table_row);
    }
}


function testFunc(id){
    console.log('ID is: ' + id);
}


//arrow functions in es6! =>
document.querySelectorAll('.table-cell').forEach(item => {
    item.addEventListener('click', event => {
        console.log('ID is: ' + item.id);
    })
  })