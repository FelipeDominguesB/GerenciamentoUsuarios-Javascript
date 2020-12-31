class UserController{

    constructor(formId, tableId)
    {
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        console.log('uhul fui construido');
        
        this.onSubmit();
        this.onEditCancel();
    }

    onSubmit()
    {

        console.log('rodei pela primeira vez');
        this.formEl.addEventListener('submit', (event) =>{
            event.preventDefault();
            
            let btnSubmit = this.formEl.querySelector('[type=submit]')
            btnSubmit.disabled = true;


            let user = this.getValues();
            
            if(!user) { 
                btnSubmit.disabled = false; 
                return false; 
            }
            this.getPhoto().then(

            (content) => {
                user.photo = content;
                this.addline(user);
                this.formEl.reset();
                btnSubmit.disabled = false;

            }, 
            (e) => {
                console.error(e);
            }
            );            
        });
    }

    onEditCancel()
    {
        console.log('fui chamado pra cancelar');
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', (event) =>{
            this.showPanelCreate();
        });
    }

    showPanelCreate()
    {
        document.getElementById('box-user-create').style.display = 'block';
        document.getElementById('box-user-update').style.display = 'none';
    }

    showPanelUpdate()
    {
        document.getElementById('box-user-create').style.display = 'none';
        document.getElementById('box-user-update').style.display = 'block';
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

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
        
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ?  'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        
        `;;
        tr.querySelector('.btn-edit').addEventListener('click', (event) =>{
            JSON.parse(tr.dataset.user); 

            this.showPanelUpdate();
        });


        this.tableEl.appendChild(tr);

        
        this.updateCount()
    }
    
    updateCount()
    {
        let numberUsers = 0;
        let numberAdmins = 0;

        [...this.tableEl.children].forEach( (tr) => {
            numberUsers++;
            
            let user = JSON.parse(tr.dataset.user);

            if(user._admin) numberAdmins++;
        });

        document.getElementById('numberUsers').innerHTML = numberUsers;
        document.getElementById('numberAdmins').innerHTML = numberAdmins;
    }

    getValues()
    {
        
        let user = {};
        let isValid = true;
        
        [...this.formEl.elements].forEach((element, index, array) =>{

            
            if(['name', 'email', 'password'].indexOf(element.name) > -1 && !element.value)
            {
                element.parentElement.classList.add('has-error');
                isValid = false;
                
            }

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

            if(!isValid){
            return false;
            }

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