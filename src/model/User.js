import { Firebase } from './../util/Firebase';
import { Model } from './Model';

export class User extends Model{

    constructor(id) {
        super();

        if(id){
            this.getById(id);
        }
    }

    //pega a referencia da coleção no firebase
    static getRef(){
        return Firebase.db().collection('/users');
    }

    static findByEmail(email){
        return User.getRef().doc(email);
    }

    save(){
        return User.findByEmail(this.email).set(this.toJSON());
    }

    getById(id){
        return new Promise((resolve,reject)=>{

            User.findByEmail(id).onSnapshot(doc=>{
                this.fromJSON(doc.data());

                resolve(doc);
            });

            /*
            //maneira para fazer um get apenas uma vez ao banco sem ficar ouvindo as alterações
            User.findByEmail(id).get().then(doc=>{
                this.fromJSON(doc.data());

                resolve(doc);
            }).catch(err=>{
                reject(err);
            });*/
        });
    }

    addContact(contact){
        return User.getRef().doc(this.email).collection('contacts').doc(btoa(contact.email)).set(contact.toJSON());
    }//addContact

    /*             Geters and Seters               */

    get name(){return this._data.name;}
    set name(value){this._data.name = value;}

    get email(){return this._data.email;}
    set email(value){this._data.email = value;}

    get photo(){return this._data.photo;}
    set photo(value){this._data.photo = value;}
}