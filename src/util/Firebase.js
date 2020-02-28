import { firestore } from 'firebase';

const firebase = require('firebase');
require('firebase/firestore'); 

export class Firebase{
    constructor(){

        this._firebaseConfig  = {
            apiKey: "AIzaSyA3bkN7zHlfVFU-easno8V9VxV1IRfKu_w",
            authDomain: "whatsapp-clone-ecc30.firebaseapp.com",
            databaseURL: "https://whatsapp-clone-ecc30.firebaseio.com",
            projectId: "whatsapp-clone-ecc30",
            storageBucket: "whatsapp-clone-ecc30.appspot.com",
            messagingSenderId: "24347540815",
            appId: "1:24347540815:web:cf7a3f4d20ea419563993a",
            measurementId: "G-B8P440JKES"
          };
        
        this.init();
    }

    init(){

        if(!window.initializeFirebase){

            firebase.initializeApp(this._firebaseConfig);

            /* metodo para ficar de 'olho' sempre que algo e alterado no firebase
               futuramente depreciado
            firebase.firestore().settings({
                timestampsInSnapshots: true
            });*/

            window.initializeFirebase = true;
        }
    }//init

    initAuth(){
        return new Promise((resolve,reject)=>{

            let provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(result=>{

                let token = result.credential.accessToken;
                let user  = result.user;

                resolve({
                    user,
                    token
                });

            }).catch(err=>{
                reject(err);
            });

        });
    }//initAuth

    //retorna a instacia do banco de dados em nuvem
    static db(){
        return firebase.firestore();
    }

    //retorna a instancia do storage onde estara guardado os uploads
    static hd(){
        return firestore.storage();
    }
}