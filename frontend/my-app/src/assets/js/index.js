var lat_long;
function geosearch(){
    var request = new XMLHttpRequest();
    request.open('GET','https://ipinfo.io?token=333e0cd1d96882',true)
    request.onload = function(){
        var data = JSON.parse(this.response)
        if (request.status >= 200 && request.status<=400){
            lat_long = data.loc;
            //console.log(lat_long);
            document.getElementById("Search").disabled = false;
        }
        else{
            document.getElementById("Search").disabled = true;
        }
    };
    request.send();
}

function validateRequiredField(fieldID,origLength){ //origLength is hardcoded
    var field = document.getElementById(fieldID);
    var parent = field.parentElement;
    if (field.value.trim() == ''){
        //console.log(parent.childNodes.length)
        field.value = '';
        if (parent.childNodes.length==origLength){
            var span = document.createElement('span');
            span.style = "color:red;"
            var text = document.createTextNode('Please enter a '+fieldID.toLowerCase()+'.');
            span.appendChild(text);
            parent.appendChild(span);
            field.className = "form-control border border-2 border-danger"
        }
    }
    else{
        while(parent.childNodes.length!=origLength){
            parent.removeChild(parent.lastChild);
        }
        field.className = 'form-control';
    }
}


function enableDisableTextBox() {
    var chkLocation = document.getElementById("Loc");
    var txtLocation = document.getElementById("Location");
    txtLocation.disabled = chkLocation.checked ? false : true;
    if (!txtLocation.disabled) {
        txtLocation.focus();
    }
}
