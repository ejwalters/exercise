function deleteRow(tableID, currentRowButton){
	
	var req = new XMLHttpRequest();
          
          
          var row =  currentRowButton.parentNode.parentNode;
		  var id = row.children[0].value;
          
          req.open('GET', "/delete?id=" + id , true);
          //req.setRequestHeader('Content-Type', 'application/json');
          req.addEventListener('load', function(){
          	if (req.status >= 200 && req.status < 400){
          		
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
				} 
				
				catch (e) {
					alert(e);
				}

			
			}
		  else{
				console.log("Error in network request: " + req.statusText);
		  }});
          
          req.send();
          event.preventDefault();
}


function editRow(tableID, currentRowButton){

	var row =  currentRowButton.parentNode.parentNode;
	var id = row.children[0].value;
	var name = row.children[1].textContent;
	var reps = row.children[2].textContent;
	var weight = row.children[3].textContent;
	var date = row.children[4].textContent;
	var lbs = row.children[5].textContent;
	window.location.href = "/edit?id=" + id + "&name=" + name + "&reps=" + reps + "&weight=" + weight + "&date=" + date + "&lbs=" + lbs ;
	

}

function addRow(){

	var form = document.getElementById("exerciseForm");
	
	var req = new XMLHttpRequest();
          
          // Add the form data to the ajax request
          var queryString = "";
          
          var name = form.name.value;
          var reps = form.reps.value;
          var weight = form.weight.value;
          var date = form.date.value;
          var lbs = form.lbs.value;
          
          queryString += "name=" + name + "&";
          queryString += "reps=" + reps + "&";
          queryString += "weight=" + weight + "&";
          queryString += "date=" + date + "&";
          queryString += "lbs=" + lbs;
          
          req.open('GET', '/insert?' + queryString, true);
          //req.setRequestHeader('Content-Type', 'application/json');
          req.addEventListener('load', function(){
          	if (req.status >= 200 && req.status < 400){
          		
          		var table = document.getElementById("exerciseTable")
          		var newRow = document.createElement("tr");
          		
				newData = document.createElement("td");
				newData.textContent = name;
				newRow.appendChild(newData);
				
				newData = document.createElement("td");
				newData.textContent = reps;
				newRow.appendChild(newData);
				
				newData = document.createElement("td");
				newData.textContent = weight;
				newRow.appendChild(newData);
				
				newData = document.createElement("td");
				newData.textContent = date;
				newRow.appendChild(newData);
				
				newData = document.createElement("td");
				newData.textContent = lbs;
				newRow.appendChild(newData);
		
				newData = document.createElement("td");
		
				deleteButton = document.createElement("BUTTON");        
				var deleteText = document.createTextNode("Delete");
		
				newRow.appendChild(newData);
				newData.appendChild(deleteButton);
				deleteButton.appendChild(deleteText); 
		
				newData = document.createElement("td");
				editButton = document.createElement("BUTTON");
				var editText = document.createTextNode("Edit");
		 
				newRow.appendChild(newData);
				newData.appendChild(editButton);
				editButton.appendChild(editText);
		
				deleteButton.onclick = function( ){
			
					deleteRow( "newTable", this );
				};
				editButton.onclick = function( ){
			
					editRow( "newTable", this );
				};
		
							 
				table.appendChild(newRow);
		
          		
          	}
          else{
          		console.log("Error in network request: " + req.statusText);
          }});
          
          req.send();
          event.preventDefault();
}



