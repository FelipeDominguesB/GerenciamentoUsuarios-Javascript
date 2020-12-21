class UserController{

    constructor(formId, tableId)
    {
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
    }

    onSubmit()
    {

        
        this.formEl.addEventListener('submit', (event) =>{
            event.preventDefault();
            
            let user = this.getValues();
            
            this.addline(user)
            
            
        });
    }

    addline(dataUser)
    {
        
        document.getElementById(this.tableEl).innerHTML = `
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
        `;;
    }
    
    getValues()
    {
        let user = {};
        this.formEl.elements.forEach((element, index, array) =>{

            if(element.name == "gender")
            {
                if(element.checked) user[element.name] = element.value;
                else return;
            }
            else{
                user[element.name] = element.value;
            }
        
            
        });
    
        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.passwrod, 
            user.photo, 
            user.admin);
    
    }
}