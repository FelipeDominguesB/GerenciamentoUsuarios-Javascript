

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
            
            this.getPhoto().then(
            (content) => {
                user.photo = content;
                this.addline(user) 

            }, 
            (e) => {
                console.error(e);
            }
            );            
        });
    }

    getPhoto()
    {
        return new Promise((resolve, reject) =>{
            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item =>{
                
                if(item.name == 'photo'){
                    return item;
                }
            });

            let file = elements[0].files[0];

            fileReader.onload = ()=>{
                resolve(fileReader.result)
            };

            fileReader.onerror = (e) =>{
                reject(e);
            }

            if(file){
                fileReader.readAsDataURL(file);
            }
            else{
                resolve('dist/img/boxed-bg.jpg');
            }
        });
        

        
    }
    addline(dataUser)
    {
        

        console.log(dataUser);

        let tr = document.createElement('tr');

        

        tr.innerHTML = `
        
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ?  'Sim' : 'Não'}</td>
            <td>${dataUser.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        
        `;;

        this.tableEl.appendChild(tr);
    }
    
    getValues()
    {
        let user = {};

        console.log(this.formEl.elements);
        [...this.formEl.elements].forEach((element, index, array) =>{

            if(element.name == "gender")
            {
                if(element.checked) user[element.name] = element.value;
                
            }
            else if(element.name == 'admin')
            {
                user[element.name] = element.checked;

            }
            else
             {
                user[element.name] = element.value;
            }
        

            
        });
    
        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin);
    
    }
}