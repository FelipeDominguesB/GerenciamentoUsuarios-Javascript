


let fields = document.querySelectorAll('#form-user-create [name]');

let user = {};

function addLine(dataUser)
{
    var tr = document.createElement('tr');

    tr.innerHTML = `
    <tr>
        <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.admin}</td>
        <td>${user.birth}</td>
        <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>
    </tr>
    `;
    
    document.getElementById('table-users').appendChild(tr);
}


document.getElementById('form-user-create').addEventListener('submit', (event) =>{
    event.preventDefault();

    fields.forEach((element, index, array) =>{

        if(element.name == "gender")
        {
            if(element.checked) user[element.name]= element.value;
            else return;
        }
        else{
            user[element.name] = element.value;
        }
    
        
    });
    addLine(user);
    
});