
function readInput(form){

	
	var name = form.name.value;
	var reps = form.reps.value;
	var weight = form.weight.value;
	var date = form.date.value;
	var lbs = form.lbs.value;

}

var collection = [ 
    
    {Name:"Pullup", Reps: "15" , Weight:"0", Date: "2015-10-10", Lbs: "0"},
  	
    
	
];

function buildTable(array){
    
    var newTable = document.createElement("table");
    newTable.id = "newTable";
    
    var properties = Object.keys(array[0]);
    console.log(properties);
    
    var firstRow = document.createElement("thead");
    
    var newRow;
    var newData;
    var newHeader;
    var button;
	var deleteButton;
    var editButton;
    
    for(var i = 0; i < properties.length; i++)
    {
        
        newHeader = document.createElement("th");
        newHeader.textContent = properties[i];
        
        firstRow.appendChild(newHeader);
    }
    
    newTable.appendChild(firstRow);

    for(var j = 0; j < array.length; j++)
    {
        newRow = document.createElement("tr");
        for(var k = 0; k < properties.length; k++)
        {
			newData = document.createElement("td");
            var propName = properties[k];
            newData.textContent = array[j][propName];
            newRow.appendChild(newData);
            
        }
        
        newData = document.createElement("td");
        
        deleteButton = document.createElement("BUTTON");        
		var deleteText = document.createTextNode("DELETE");
        
        newRow.appendChild(newData);
        newData.appendChild(deleteButton);
        deleteButton.appendChild(deleteText); 
        
        newData = document.createElement("td");
        editButton = document.createElement("BUTTON");
        var editText = document.createTextNode("EDIT");
		 
        newRow.appendChild(newData);
        newData.appendChild(editButton);
        editButton.appendChild(editText);
        
        deleteButton.onclick = function( ){
            
            deleteRow( "newTable", this );
        };
        editButton.onclick = function( ){
            
            editRow( "newTable", this );
        };
		
                             
        newTable.appendChild(newRow);
		
    }
    

return newTable; 
}


/*When the page is loaded the upper left, non-header cell of the table should be 'selected'. This is denoted by it having a thicker border than the other cells. If you push the directional buttons other cells should be selected instead. So if you press the right button, cell 1,1 should no longer be selected and 2,1 should be selected instead.

If you are already on the top row and hit 'up' nothing should happen (you should not be able to move into the header cells). Likewise if you are all the way right and hit right or all the way at the bottom and hit down.

Hitting the "Mark Cell" button should permanently change the background of the selected cell to yellow. This should persist even after other cells are selected or marked.
*/

//var newTable = document.body.appendChild(buildTable(collection));

function deleteRow(tableID, currentRowButton){


	try {
        var table = document.getElementById(tableID);
        var rowCount = table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            var row = table.rows[i];
            
            if (row==currentRowButton.parentNode.parentNode) {
                if (rowCount <= 1) {
                    alert("Cannot delete all the rows.");
                    break;
                }
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        alert(e);
    }


}

function editRow(tableID, currentRowButton){

	var row =  currentRowButton.parentNode.parentNode;
	var name = row.children[1].textContent;
	var reps = row.children[2].textContent;
	var weight = row.children[3].textContent;
	var date = row.children[4].textContent;
	var lbs = row.children[5].textContent;
	window.location.href = "/edit?name=" + name + "&reps=" + reps + "&weight=" + weight + "&date=" + date + "&lbs=" + lbs ;
	

}

document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
        document.getElementById('addExercise').addEventListener('click', function(event){
        
          console.log("beginning");
          var req = new XMLHttpRequest();
          
          // Add the form data to the ajax request
          var payload = {name:null,reps:null,weight:null,date:null, lbs:null};
          
          payload.name = document.getElementById('name').value;
          payload.reps = document.getElementById('reps').value;
          payload.weight = document.getElementById('weight').value;
          payload.date = document.getElementById('date').value;
          payload.lbs = document.getElementById('lbs').value;
          
          req.open('POST', 'http://web.engr.oregonstate.edu/~walterer/insert', true);
          req.setRequestHeader('Content-Type', 'application/json');
          req.addEventListener('load', function(){
          	if (req.status >= 200 && req.status < 400){
          		/*
          		var response = JSON.parse(req.responseText);
          		document.getElementById('textOutput').textContent = response.json.name;
          		*/
          	}
          else{
          		console.log("Error in network request: " + req.statusText);
          }});
          
          // POST accepts parameters in the send method
          req.send(JSON.stringify(payload));
          event.preventDefault();
          
          console.log("end");
        });
}