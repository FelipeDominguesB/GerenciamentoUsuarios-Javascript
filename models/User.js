class User{
    
    constructor(name, gender, birth, country, email, password, photo, admin){
        this._name = name;
        this._id;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password; 
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();

    }

    
    get name(){ return this._name; }

    get id(){ return this._id; }

    get gender(){ return this._gender; }

    get birth() {return this._birth;}

    get country(){ return this._gender; }

    get email(){return this._email;}

    get admin() {return this._admin;}

    get photo() {return this._photo;}
    
    set photo(value){ this._photo = value;}

    get password(){ return this._password;}

    get register() { return this._register; }
    

    loadFromJSON(json)
    {
        
        for(let name in json)
        {
            switch(name){
                case '_register':
                    this[name] = new Date(json[name]);
                break;

                default:
                    this[name] = json[name];
            }
            
        }
    }

    static getUserStorage()
    {
         let users = [];
         if(localStorage.getItem('users')){
             users = JSON.parse(localStorage.getItem('users'));
         }
         return users;

     }


    CreateId()
    {
        if(!window.id) window.id = 0;

        let usuarios = User.getUserStorage();

        usuarios.forEach(e =>{
            if(e._id == id) id++;
        });
        
        return id;

    }
    save()
    {
        
        let users = User.getUserStorage();
        
        if(this.id > 0){
            users.map(u =>{

                if(u._id == this.id)
                {
                    Object.assign(u, this);
                }
                return u;
            });
        }
        else{
            this._id = this.CreateId();
            users.push(this);
        }
        
        localStorage.setItem('users', JSON.stringify(users));
    }

    remove()
    {
        let users = User.getUserStorage();

        users.forEach((elemento, index) => {
            if(this._id == elemento._id)
            {
                users.splice(index, 1);
            }          
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
}