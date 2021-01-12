class UserController{

    constructor(formId, formIdUpdate, tableId)
    {
        this.formEl = document.getElementById(formId);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        console.log('uhul fui construido');
        
        this.onSubmit();
        this.onEdit();
    }

    onEdit()
    {
        
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', (event) =>{
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener('submit', e =>{
            
            e.preventDefault();

            let btnSubmit = this.formUpdateEl.querySelector('[type=submit]')
            
            btnSubmit.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            let resultado = Object.assign({}, userOld, values);

            
            tr.dataset.user = JSON.stringify(resultado);

            

            
            this.getPhoto(this.formUpdateEl).then(

                (content) => {
                    
                    if(!values.photo)
                    {   
                        resultado._photo = userOld._photo;
                    } 
                    else{
                        resultado._photo = content;
                    }

                    tr.innerHTML = `
        
                    <td><img src="${resultado._photo}" alt="User Image" class="img-circle img-sm"></td>
                    <td>${resultado._name}</td>
                    <td>${resultado._email}</td>
                    <td>${(resultado._admin) ?  'Sim' : 'Não'}</td>
                    <td>${Utils.dateFormat(resultado._register)}</td>
                    <td>
                        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td>
                
                    `;


                    this.addEventsTr(tr);

                    this.updateCount();

                    this.formUpdateEl.reset();

                    btnSubmit.disabled = false;
    
                }, 
                (e) => {
                    console.error(e);
                }
                );

                
            
            
            this.showPanelCreate();
        });
    }

    addEventsTr(tr)
    {
        tr.querySelector('.btn-edit').addEventListener('click', (event) =>{

            let jsonUser = JSON.parse(tr.dataset.user); 
            
            
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for(let name in jsonUser)
            {
                let field = this.formUpdateEl.querySelector('[name=' + name.replace('_', '') + ']');
                
                if(field){
                    switch(field.type){

                        case 'file':
                            continue;
                            break;

                        case 'radio':
                            field = this.formUpdateEl.querySelector('[name=' + name.replace('_', '') + '][value=' + jsonUser[name] + ']');
                            field.checked = true; 
                            break;

                        case 'checkbox':
                            field.checked = jsonUser[name];
                            break;
                        
                        default:
                            field.value = jsonUser[name];
                            break;
                    }
                    
                }
            }
            this.formUpdateEl.querySelector('.photo').src = jsonUser._photo;
            this.showPanelUpdate();
        });
    }

    onSubmit()
    {

        console.log('rodei pela primeira vez');
        this.formEl.addEventListener('submit', (event) =>{
            event.preventDefault();
            
            let btnSubmit = this.formEl.querySelector('[type=submit]')
            btnSubmit.disabled = true;


            let user = this.getValues(this.formEl);
            
            if(!user) { 
                btnSubmit.disabled = false; 
                return false; 
            }
            this.getPhoto(this.formEl).then(

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

    

    getPhoto(formulario)
    {
        return new Promise((resolve, reject) =>{
            let fileReader = new FileReader();

            let elements = [...formulario.elements].filter(item =>{
                
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
        
        `;
        
        this.addEventsTr(tr);

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

    getValues(formulario)
    {
        
        
        let user = {};
        let isValid = true;
        
        [...formulario.elements].forEach((element, index, array) =>{

            
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